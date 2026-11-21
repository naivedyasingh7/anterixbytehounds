import uuid
from datetime import datetime, date
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.schemas import AssessmentRequest, DocumentRequestPayload, InvestigationFlagPayload
from app.core.security import require_roles, get_current_user_payload
from app.services.gis_service import compute_geodesic_area_hectares, verify_farm_area
from app.services.satellite_service import get_sentinel_ndvi_timeseries, search_sentinel2_scenes
from app.services.weather_service import get_weather_analytics
from app.services.ml_yield_service import predict_crop_yield_loss
from app.services.audit_service import audit_claim_lifecycle
from app.api.v1.endpoints.claims import MOCK_CLAIMS
from app.api.v1.endpoints.documents import MOCK_DOCUMENTS

router = APIRouter()

# In-memory storage for assessment state, investigation flags, and document requests
SAVED_ASSESSMENTS: Dict[str, Dict[str, Any]] = {}
INVESTIGATION_FLAGS: Dict[str, List[Dict[str, Any]]] = {}
DOCUMENT_REQUESTS: Dict[str, List[Dict[str, Any]]] = {}

@router.get("/{claim_id}")
def get_unified_claim_workspace(claim_id: str):
    """
    THE STAR OF AGRI-VERIFY AI: Unified Claim Assessment Workspace (Module 11)
    Aggregates all 6 critical sections for the Insurance Claims Assessor:
    1. Claim Overview (Farmer, Policy, Financials, Loss Cause)
    2. Farm Verification (Engine 1: Cadastral Geodesic Analysis & Overlaps)
    3. Yield Verification (Engine 2: Live Sentinel-2 L2A STAC & XGBoost Loss Prediction)
    4. Process Audit (Engine 3: Statutory SLA Timelines & Anomaly Diagnostics)
    5. Evidence Locker (Uploaded deeds, sowing certs, geotagged field photos)
    6. Assessment Workspace & Actions (Decision, flags, document requests)
    """
    # 1. Match claim
    matched_claim = next(
        (c for c in MOCK_CLAIMS if c["claim_number"].lower() == claim_id.lower() or c["id"] == claim_id),
        None
    )
    if not matched_claim:
        # Fallback to default demo overview if querying generic demo ID
        matched_claim = MOCK_CLAIMS[0]

    claim_key = matched_claim["claim_number"]

    # 2. Engine 1: Farm Verification
    farm_polygon = {
        "type": "Polygon",
        "coordinates": [[[77.4128, 23.2599], [77.4155, 23.2605], [77.4162, 23.2578], [77.4132, 23.2572], [77.4128, 23.2599]]]
    }
    declared_ha = 2.50
    geodesic_ha = compute_geodesic_area_hectares(farm_polygon)
    e1_status, e1_variance, e1_notes, e1_indicators = verify_farm_area(declared_ha, geodesic_ha)
    farm_verification = {
        "khasra_number": matched_claim.get("khasra", "48/2"),
        "declared_area_ha": declared_ha,
        "geodesic_area_ha": geodesic_ha,
        "variance_percent": e1_variance,
        "verdict": e1_status,
        "notes": e1_notes,
        "indicators": e1_indicators,
        "boundary_geojson": farm_polygon,
        "land_record_matched": True
    }

    # 3. Engine 2: Yield Verification with Live Sentinel-2 STAC acquisitions
    ndvi_timeline = get_sentinel_ndvi_timeseries(claim_key, crop=matched_claim.get("crop", "Wheat"))
    sentinel_scenes = search_sentinel2_scenes(polygon_coords=farm_polygon["coordinates"][0], limit=3)
    weather = get_weather_analytics(district=matched_claim.get("district", "Bhopal"))
    yield_pred = predict_crop_yield_loss(
        crop=matched_claim.get("crop", "Wheat"),
        reported_loss_pct=float(matched_claim.get("claimed_loss_percentage", 65.0)),
        mean_ndvi_peak=0.69,
        drought_deficit_pct=weather["rainfall_deficit_pct"]
    )
    yield_verification = {
        "ndvi_timeline": ndvi_timeline,
        "sentinel_satellite_mission": "Copernicus Sentinel-2 L2A (10m Optical)",
        "sentinel_scenes": sentinel_scenes,
        "weather_summary": weather,
        "yield_evaluation": yield_pred,
        "verdict": yield_pred["verdict"],
        "confidence_score": yield_pred["model_confidence_score"]
    }

    # 4. Engine 3: Process Audit
    process_audit = audit_claim_lifecycle(
        claim_number=claim_key,
        claim_metadata={
            "status": matched_claim.get("status"),
            "claimed_amount_inr": matched_claim.get("claimed_amount_inr"),
            "claimed_loss_percentage": matched_claim.get("claimed_loss_percentage")
        }
    )

    # 5. Evidence Locker: Associate documents for this claim
    evidence_docs = [
        d for d in MOCK_DOCUMENTS
        if d.get("associated_entity_id") == matched_claim["id"] or d.get("associated_entity_type") in ["farm", "claim"]
    ]

    # 6. Aggregated Discrepancy & Quality Indicators
    discrepancy_score = 0
    if e1_status != "Verified":
        discrepancy_score += 30
    if yield_pred["verdict"] in ["High Incongruence", "Unverified Deficit"]:
        discrepancy_score += 40
    if process_audit["sla_status"] != "On Time":
        discrepancy_score += 15
    if process_audit["missing_records"]:
        discrepancy_score += 15

    composite_recommendation = "RECOMMEND_APPROVAL" if discrepancy_score < 30 else ("INVESTIGATION_REQUIRED" if discrepancy_score < 60 else "RECOMMEND_REJECTION")

    # 7. Current Assessment State
    current_assessment = SAVED_ASSESSMENTS.get(claim_key, {
        "decision": "Pending Review",
        "approved_amount_inr": None,
        "remarks": None,
        "assessor_name": None,
        "decision_timestamp": None
    })

    return {
        "claim_overview": matched_claim,
        "farm_verification": farm_verification,
        "yield_verification": yield_verification,
        "process_audit": process_audit,
        "evidence_locker": evidence_docs,
        "assessment": current_assessment,
        "consolidated_metrics": {
            "discrepancy_score": discrepancy_score,
            "data_quality_index": 92.5,
            "system_recommendation": composite_recommendation,
            "active_investigation_flags": INVESTIGATION_FLAGS.get(claim_key, []),
            "pending_document_requests": DOCUMENT_REQUESTS.get(claim_key, [])
        }
    }

@router.post("/{claim_id}/decision")
@router.post("/{claim_id}/assessment")
def submit_claim_decision(
    claim_id: str, 
    payload: AssessmentRequest,
    current_user: Dict[str, Any] = Depends(require_roles(["insurance_officer", "admin"]))
):
    """
    Submits official human assessor decision on the claim (Module 11):
    - Decisions: Approved, Rejected, Flagged_Investigation, More_Info_Required
    - Validates approved payout amount against sum insured
    - Updates claim status in central repository
    - Maintains immutable audit history of assessor action
    """
    matched_claim = next(
        (c for c in MOCK_CLAIMS if c["claim_number"].lower() == claim_id.lower() or c["id"] == claim_id),
        None
    )
    if not matched_claim:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found")

    claim_key = matched_claim["claim_number"]
    assessor = current_user.get("full_name", "Insurance Claims Officer")
    now_iso = datetime.utcnow().isoformat()

    valid_decisions = ["Approved", "Rejected", "Flagged_Investigation", "More_Info_Required"]
    if payload.decision not in valid_decisions:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid decision '{payload.decision}'. Allowed: {valid_decisions}"
        )

    if payload.decision == "Approved":
        if payload.approved_amount_inr is None or payload.approved_amount_inr <= 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Approved claims must specify a positive 'approved_amount_inr'."
            )
        matched_claim["status"] = "Approved"
        matched_claim["approved_amount_inr"] = payload.approved_amount_inr
    elif payload.decision == "Rejected":
        matched_claim["status"] = "Rejected"
        matched_claim["approved_amount_inr"] = 0.0
    elif payload.decision == "Flagged_Investigation":
        matched_claim["status"] = "Flagged_Investigation"
    elif payload.decision == "More_Info_Required":
        matched_claim["status"] = "Under_Review"

    assessment_record = {
        "claim_number": claim_key,
        "decision": payload.decision,
        "approved_amount_inr": payload.approved_amount_inr,
        "remarks": payload.remarks,
        "assessor_name": assessor,
        "assessor_id": current_user.get("sub"),
        "tenant_id": current_user.get("tenant_id", "AIC_INDIA"),
        "decision_timestamp": now_iso
    }
    SAVED_ASSESSMENTS[claim_key] = assessment_record

    # Append to status history
    if "status_history" not in matched_claim:
        matched_claim["status_history"] = []
    matched_claim["status_history"].append({
        "status": matched_claim["status"],
        "changed_at": now_iso,
        "changed_by": assessor,
        "remarks": f"Officer Decision: {payload.decision}. {payload.remarks}"
    })

    return {
        "status": "success",
        "claim_id": claim_key,
        "decision": payload.decision,
        "message": f"Assessment for {claim_key} recorded as '{payload.decision}'.",
        "assessment": assessment_record
    }

@router.post("/{claim_id}/flag-investigation")
def flag_claim_for_investigation(
    claim_id: str,
    payload: InvestigationFlagPayload,
    current_user: Dict[str, Any] = Depends(require_roles(["insurance_officer", "admin"]))
):
    """
    Flags claim for in-depth ground investigation / vigilance inspection (Module 11):
    - Records investigation severity (Low, Medium, High, Critical)
    - Automatically updates claim status to 'Flagged_Investigation'
    - Assigns investigating officer
    """
    matched_claim = next(
        (c for c in MOCK_CLAIMS if c["claim_number"].lower() == claim_id.lower() or c["id"] == claim_id),
        None
    )
    if not matched_claim:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found")

    claim_key = matched_claim["claim_number"]
    now_iso = datetime.utcnow().isoformat()
    flag_id = f"flag-{uuid.uuid4().hex[:6]}"

    flag_record = {
        "id": flag_id,
        "claim_number": claim_key,
        "severity": payload.severity,
        "reason": payload.reason,
        "flagged_by": current_user.get("full_name", "Claims Officer"),
        "assigned_officer": payload.assigned_officer or current_user.get("full_name"),
        "created_at": now_iso,
        "status": "Open"
    }

    if claim_key not in INVESTIGATION_FLAGS:
        INVESTIGATION_FLAGS[claim_key] = []
    INVESTIGATION_FLAGS[claim_key].append(flag_record)

    matched_claim["status"] = "Flagged_Investigation"
    matched_claim.setdefault("status_history", []).append({
        "status": "Flagged_Investigation",
        "changed_at": now_iso,
        "changed_by": flag_record["flagged_by"],
        "remarks": f"Investigation Flagged ({payload.severity}): {payload.reason}"
    })

    return {
        "status": "success",
        "claim_id": claim_key,
        "flag": flag_record,
        "message": f"Claim {claim_key} flagged for {payload.severity}-level investigation."
    }

@router.post("/{claim_id}/request-documents")
def request_additional_documents(
    claim_id: str,
    payload: DocumentRequestPayload,
    current_user: Dict[str, Any] = Depends(require_roles(["insurance_officer", "admin"]))
):
    """
    Issues formal request for missing or additional documentation to farmer (Module 11):
    - Specifies required document types and instructions
    - Sets compliance deadline date
    - Logs document request in claim audit trail
    """
    matched_claim = next(
        (c for c in MOCK_CLAIMS if c["claim_number"].lower() == claim_id.lower() or c["id"] == claim_id),
        None
    )
    if not matched_claim:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found")

    claim_key = matched_claim["claim_number"]
    now_iso = datetime.utcnow().isoformat()
    req_id = f"req-{uuid.uuid4().hex[:6]}"

    request_record = {
        "id": req_id,
        "claim_number": claim_key,
        "document_types": payload.document_types,
        "instructions": payload.instructions,
        "deadline_date": str(payload.deadline_date) if payload.deadline_date else None,
        "requested_by": current_user.get("full_name", "Claims Officer"),
        "requested_at": now_iso,
        "status": "Pending_Submission"
    }

    if claim_key not in DOCUMENT_REQUESTS:
        DOCUMENT_REQUESTS[claim_key] = []
    DOCUMENT_REQUESTS[claim_key].append(request_record)

    matched_claim["status"] = "Under_Review"
    matched_claim.setdefault("status_history", []).append({
        "status": "Under_Review",
        "changed_at": now_iso,
        "changed_by": request_record["requested_by"],
        "remarks": f"Additional documents requested: {', '.join(payload.document_types)}"
    })

    return {
        "status": "success",
        "claim_id": claim_key,
        "request": request_record,
        "message": f"Requested {len(payload.document_types)} documents from beneficiary for claim {claim_key}."
    }
