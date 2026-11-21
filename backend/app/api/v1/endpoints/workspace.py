from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.schemas.schemas import AssessmentRequest
from app.services.gis_service import compute_geodesic_area_hectares, verify_farm_area
from app.services.satellite_service import get_sentinel_ndvi_timeseries
from app.services.weather_service import get_weather_analytics
from app.services.ml_yield_service import predict_crop_yield_loss
from app.services.audit_service import audit_claim_lifecycle

router = APIRouter()

# In-memory storage for assessment state during demo
SAVED_ASSESSMENTS = {}

@router.get("/{claim_id}")
def get_unified_claim_workspace(claim_id: str):
    """
    THE STAR OF THE SYSTEM: Unified Claim Workspace
    Aggregates all 6 critical sections for the Insurance Officer:
    1. Claim Overview
    2. Farm Verification (Engine 1)
    3. Yield Verification (Engine 2)
    4. Process Audit (Engine 3)
    5. Evidence Locker
    6. Final Assessment & Actions
    """
    # Base claim details
    overview = {
        "claim_number": claim_id,
        "farmer_name": "Rajesh Kumar Patel",
        "farmer_code": "FAR-MP-BHP-001",
        "policy_number": "POL-PMFBY-BHP-2026-88",
        "village": "Berasia",
        "district": "Bhopal",
        "state": "Madhya Pradesh",
        "crop": "Wheat",
        "season": "Rabi 2026",
        "claimed_amount_inr": 113750.0,
        "sum_insured_inr": 175000.0,
        "loss_cause": "Drought & Prolonged Dry Spell",
        "claimed_loss_percentage": 65.0,
        "incident_date": "2026-11-05",
        "status": "Pending"
    }

    # Engine 1: Farm Verification
    farm_polygon = {
        "type": "Polygon",
        "coordinates": [[[77.4128, 23.2599], [77.4155, 23.2605], [77.4162, 23.2578], [77.4132, 23.2572], [77.4128, 23.2599]]]
    }
    declared_ha = 2.50
    geodesic_ha = compute_geodesic_area_hectares(farm_polygon)
    e1_status, e1_variance, e1_notes = verify_farm_area(declared_ha, geodesic_ha)
    farm_verification = {
        "khasra_number": "48/2",
        "declared_area_ha": declared_ha,
        "geodesic_area_ha": geodesic_ha,
        "variance_percent": e1_variance,
        "verdict": e1_status,
        "notes": e1_notes,
        "boundary_geojson": farm_polygon,
        "land_record_matched": True
    }

    # Engine 2: Yield Verification
    ndvi_timeline = get_sentinel_ndvi_timeseries(claim_id, crop="Wheat")
    weather = get_weather_analytics(district="Bhopal")
    yield_pred = predict_crop_yield_loss(
        crop="Wheat",
        reported_loss_pct=65.0,
        mean_ndvi_peak=0.69,
        drought_deficit_pct=weather["rainfall_deficit_pct"]
    )
    yield_verification = {
        "ndvi_timeline": ndvi_timeline,
        "weather_summary": weather,
        "yield_evaluation": yield_pred,
        "verdict": yield_pred["verdict"],
        "confidence_score": yield_pred["model_confidence_score"]
    }

    # Engine 3: Process Audit
    process_audit = audit_claim_lifecycle(claim_number=claim_id)

    # Evidence Locker
    evidence = [
        {"type": "Khasra Deed", "name": "Bhopal_Khasra_48_2_Certified.pdf", "size": "1.2 MB", "status": "Verified"},
        {"type": "Sowing Certificate", "name": "Panchayat_Sowing_Receipt_2026.pdf", "size": "450 KB", "status": "Verified"},
        {"type": "Field Photo", "name": "Geotagged_Field_Crop_Stress.jpg", "size": "2.8 MB", "status": "Geotag Matched"},
        {"type": "Satellite Snapshot", "name": "Sentinel2_FalseColor_B08_B04.png", "size": "3.1 MB", "status": "Processed"}
    ]

    # Existing Assessment if recorded
    current_assessment = SAVED_ASSESSMENTS.get(claim_id, {
        "decision": "Pending Review",
        "approved_amount_inr": None,
        "remarks": None,
        "assessor_name": "R. K. Sharma (Senior Assessor)"
    })

    return {
        "claim_overview": overview,
        "farm_verification": farm_verification,
        "yield_verification": yield_verification,
        "process_audit": process_audit,
        "evidence_locker": evidence,
        "assessment": current_assessment
    }

@router.post("/{claim_id}/decision")
def submit_claim_decision(claim_id: str, payload: AssessmentRequest):
    """
    Submits official human assessor decision on the claim.
    """
    SAVED_ASSESSMENTS[claim_id] = {
        "decision": payload.decision,
        "approved_amount_inr": payload.approved_amount_inr,
        "remarks": payload.remarks,
        "assessor_name": "R. K. Sharma (Insurance Officer)",
        "decision_timestamp": "2026-11-21T21:45:00Z"
    }

    return {
        "status": "success",
        "claim_id": claim_id,
        "message": f"Assessment for {claim_id} recorded as '{payload.decision}'.",
        "assessment": SAVED_ASSESSMENTS[claim_id]
    }
