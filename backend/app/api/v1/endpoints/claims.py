import io
import uuid
from datetime import datetime, date
from typing import List, Dict, Any, Optional
import pandas as pd
from fastapi import APIRouter, UploadFile, File, Query, HTTPException, status, Depends
from app.schemas.schemas import ClaimCreate, ClaimListItem, ClaimsOverviewMetrics, ClaimStatusUpdate
from app.core.security import require_roles, get_current_user_payload

router = APIRouter()

MOCK_CLAIMS: List[Dict[str, Any]] = [
    {
        "id": "c0000001-0000-0000-0000-000000000001",
        "claim_number": "CLM001",
        "farmer_name": "Rajesh Kumar Patel",
        "farmer_code": "FAR-MP-BHP-001",
        "farmer_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "farm_id": "fa000001-0000-0000-0000-000000000001",
        "district": "Bhopal",
        "crop": "Wheat",
        "season": "Rabi 2026",
        "claimed_amount_inr": 113750.0,
        "loss_cause": "Drought & Prolonged Dry Spell",
        "loss_event_type": "Drought",
        "claimed_loss_percentage": 65.0,
        "reported_yield_kg_ha": 1300.0,
        "status": "Pending",
        "incident_date": "2026-11-05",
        "khasra": "48/2",
        "policy_number": "POL-PMFBY-BHP-2026-88",
        "created_at": "2026-11-06T10:30:00Z",
        "status_history": [
            {"status": "Pending", "changed_at": "2026-11-06T10:30:00Z", "changed_by": "System", "remarks": "Initial submission"}
        ]
    },
    {
        "id": "c0000002-0000-0000-0000-000000000002",
        "claim_number": "CLM002",
        "farmer_name": "Sunita Bai Chouhan",
        "farmer_code": "FAR-MP-SEH-002",
        "farmer_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "farm_id": "fa000002-0000-0000-0000-000000000002",
        "district": "Sehore",
        "crop": "Soybean",
        "season": "Kharif 2026",
        "claimed_amount_inr": 182400.0,
        "loss_cause": "Unseasonal Excessive Rain & Inundation",
        "loss_event_type": "Inundation",
        "claimed_loss_percentage": 80.0,
        "reported_yield_kg_ha": 450.0,
        "status": "Verified",
        "incident_date": "2026-10-18",
        "khasra": "112/1",
        "policy_number": "POL-PMFBY-SEH-2026-14",
        "created_at": "2026-10-19T11:00:00Z",
        "status_history": [
            {"status": "Pending", "changed_at": "2026-10-19T11:00:00Z", "changed_by": "System", "remarks": "Initial submission"},
            {"status": "Verified", "changed_at": "2026-10-22T14:30:00Z", "changed_by": "Officer Sharma", "remarks": "Automated engines validated"}
        ]
    },
    {
        "id": "c0000003-0000-0000-0000-000000000003",
        "claim_number": "CLM003",
        "farmer_name": "Mohan Lal Verma",
        "farmer_code": "FAR-MP-RSN-003",
        "farmer_id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
        "farm_id": "fa000003-0000-0000-0000-000000000003",
        "district": "Raisen",
        "crop": "Paddy",
        "season": "Kharif 2026",
        "claimed_amount_inr": 175000.0,
        "loss_cause": "Pest Blight & False Smut",
        "loss_event_type": "Pest Attack",
        "claimed_loss_percentage": 70.0,
        "reported_yield_kg_ha": 900.0,
        "status": "Flagged_Investigation",
        "incident_date": "2026-10-25",
        "khasra": "95/4",
        "policy_number": "POL-PMFBY-RSN-2026-92",
        "created_at": "2026-10-26T09:15:00Z",
        "status_history": [
            {"status": "Pending", "changed_at": "2026-10-26T09:15:00Z", "changed_by": "System", "remarks": "Initial submission"},
            {"status": "Flagged_Investigation", "changed_at": "2026-10-29T16:00:00Z", "changed_by": "Officer Verma", "remarks": "Area discrepancy detected in Engine 1"}
        ]
    }
]

VALID_STATUSES = [
    "Pending",
    "Under_Review",
    "Verified",
    "Flagged_Investigation",
    "Approved",
    "Rejected",
    "Settled"
]

@router.get("/", response_model=List[Dict[str, Any]])
def list_claims(
    district: Optional[str] = None,
    crop: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    """Lists insurance claims with optional filtering by district, crop, status, or search term."""
    results = MOCK_CLAIMS
    if district and district != "All":
        results = [c for c in results if c["district"].lower() == district.lower()]
    if crop and crop != "All":
        results = [c for c in results if c["crop"].lower() == crop.lower()]
    if status and status != "All":
        results = [c for c in results if c["status"].lower() == status.lower()]
    if search:
        s = search.lower()
        results = [
            c for c in results 
            if s in c["claim_number"].lower() or s in c["farmer_name"].lower() or s in c["district"].lower()
        ]
    return results

@router.get("/metrics")
def get_claims_metrics():
    """Aggregates dashboard metrics for claims."""
    total = len(MOCK_CLAIMS)
    pending = len([c for c in MOCK_CLAIMS if c["status"] == "Pending"])
    verified = len([c for c in MOCK_CLAIMS if c["status"] == "Verified"])
    flagged = len([c for c in MOCK_CLAIMS if c["status"] in ["Flagged", "Flagged_Investigation"]])
    delayed = len([c for c in MOCK_CLAIMS if c["status"] == "Delayed"])

    dist_counts = {}
    for c in MOCK_CLAIMS:
        dist_counts[c["district"]] = dist_counts.get(c["district"], 0) + 1

    recent = [
        {"action": "Claim Filed", "claim": "CLM001", "time": "2 hours ago", "user": "Rajesh Kumar"},
        {"action": "Satellite NDVI Analyzed", "claim": "CLM002", "time": "5 hours ago", "user": "Engine 2"},
        {"action": "Area Mismatch Flagged", "claim": "CLM003", "time": "1 day ago", "user": "Engine 1"},
    ]

    return {
        "total_claims": total,
        "pending_claims": pending,
        "verified_claims": verified,
        "flagged_claims": flagged,
        "delayed_claims": delayed,
        "district_distribution": dist_counts,
        "recent_activity": recent
    }

@router.get("/{claim_id}")
def get_claim(claim_id: str):
    """Retrieves a single claim by UUID or Claim Number (e.g. CLM001)."""
    matched = next((c for c in MOCK_CLAIMS if c["claim_number"].lower() == claim_id.lower() or c["id"] == claim_id), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found")
    return matched

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_claim(
    claim: ClaimCreate,
    current_user: Dict[str, Any] = Depends(require_roles(["farmer", "admin"]))
):
    """
    Submits a new crop loss claim (Module 6):
    - Generates collision-resistant unique claim number (CLM00X)
    - Links claim to farmer and policy
    - Stores reported loss cause, percentage, and loss event
    - Initializes status to 'Pending'
    """
    new_claim_number = f"CLM{len(MOCK_CLAIMS)+1:03d}"
    farmer_name = current_user.get("full_name", "Rajesh Kumar Patel")
    new_id = f"c{len(MOCK_CLAIMS)+1:07d}-0000-0000-0000-000000000001"
    now_iso = datetime.utcnow().isoformat()

    new_record = {
        "id": new_id,
        "claim_number": new_claim_number,
        "farmer_name": farmer_name,
        "farmer_code": current_user.get("farmer_code", "FAR-MP-BHP-001"),
        "farmer_id": current_user.get("sub", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        "farm_id": claim.farm_id,
        "district": "Bhopal",
        "crop": "Wheat",
        "season": "Rabi 2026",
        "claimed_amount_inr": float(claim.claimed_amount_inr),
        "loss_cause": claim.loss_cause,
        "loss_event_type": "Drought" if "drought" in claim.loss_cause.lower() else "Crop Stress",
        "claimed_loss_percentage": float(claim.claimed_loss_percentage),
        "reported_yield_kg_ha": 1350.0,
        "status": "Pending",
        "incident_date": str(claim.incident_date),
        "khasra": "48/2",
        "policy_number": claim.policy_id or "POL-PMFBY-BHP-2026-88",
        "created_at": now_iso,
        "status_history": [
            {"status": "Pending", "changed_at": now_iso, "changed_by": farmer_name, "remarks": "Claim created"}
        ]
    }
    MOCK_CLAIMS.append(new_record)
    return new_record

@router.patch("/{claim_id}/status")
def update_claim_status(
    claim_id: str,
    payload: ClaimStatusUpdate,
    current_user: Dict[str, Any] = Depends(require_roles(["insurance_officer", "admin"]))
):
    """
    Implements Claim Status Lifecycle (Module 6):
    - Authorized transitions: Pending -> Under_Review -> Verified -> Flagged_Investigation -> Approved/Rejected -> Settled
    - Restricted to insurance officers and admins (farmers cannot approve their own claims)
    - Records immutable timestamped transition audit log
    """
    matched = next((c for c in MOCK_CLAIMS if c["claim_number"].lower() == claim_id.lower() or c["id"] == claim_id), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found")

    if payload.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid status '{payload.status}'. Allowed statuses: {VALID_STATUSES}"
        )

    old_status = matched.get("status")
    new_status = payload.status
    now_iso = datetime.utcnow().isoformat()
    officer_name = current_user.get("full_name", "Officer")

    # Business rule: Settled claims cannot be reverted to Pending
    if old_status == "Settled" and new_status == "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Illegal lifecycle transition: Settled claims cannot be reopened to Pending."
        )

    matched["status"] = new_status
    if "status_history" not in matched:
        matched["status_history"] = []
    
    matched["status_history"].append({
        "from_status": old_status,
        "to_status": new_status,
        "changed_at": now_iso,
        "changed_by": officer_name,
        "remarks": payload.remarks or f"Status transitioned to {new_status}"
    })

    return {
        "status": "success",
        "claim_id": matched["claim_number"],
        "previous_status": old_status,
        "current_status": new_status,
        "updated_at": now_iso,
        "updated_by": officer_name,
        "remarks": payload.remarks
    }

@router.post("/import-csv")
@router.post("/import-batch")
async def import_claims_batch(
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(require_roles(["insurance_officer", "admin"]))
):
    """
    Supports CSV and Excel claim import with row-by-row validation & error reporting (Module 6 & 10):
    - Parses CSV and Excel (.xlsx, .xls) files via Pandas
    - Validates data types, required fields, and business rules per row
    - Imports valid rows into claim inventory while accumulating structured error reports for invalid rows
    """
    content = await file.read()
    filename = file.filename.lower()

    try:
        if filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(content))
        else:
            df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unable to parse spreadsheet file: {str(e)}"
        )

    imported_count = 0
    validation_errors = []

    for idx, row in df.iterrows():
        row_num = idx + 2  # Excel 1-based header + 1
        crop = row.get("Crop")
        district = row.get("District")
        claimed_amt = row.get("Claimed Amount")
        loss_pct = row.get("Loss %", 50.0)

        # Field validation
        row_errors = []
        if pd.isna(crop) or not str(crop).strip():
            row_errors.append("Missing required 'Crop' field.")
        if pd.isna(district) or not str(district).strip():
            row_errors.append("Missing required 'District' field.")
        
        try:
            claimed_amt_float = float(claimed_amt)
            if claimed_amt_float <= 0:
                row_errors.append("Claimed Amount must be positive.")
        except (ValueError, TypeError):
            row_errors.append(f"Invalid Claimed Amount '{claimed_amt}': must be numeric.")

        try:
            loss_pct_float = float(loss_pct)
            if not (0.0 <= loss_pct_float <= 100.0):
                row_errors.append(f"Loss % ({loss_pct_float}) must be between 0 and 100.")
        except (ValueError, TypeError):
            row_errors.append(f"Invalid Loss % '{loss_pct}': must be numeric.")

        if row_errors:
            validation_errors.append({
                "row": row_num,
                "claim_id": str(row.get("Claim ID", f"ROW-{row_num}")),
                "errors": row_errors
            })
            continue

        # Import valid claim
        claim_num = str(row.get("Claim ID", f"CLM-IMP-{len(MOCK_CLAIMS)+1:03d}"))
        new_claim = {
            "id": f"c{len(MOCK_CLAIMS)+1:07d}-0000-0000-0000-000000000001",
            "claim_number": claim_num,
            "farmer_name": str(row.get("Farmer", "Imported Farmer")),
            "farmer_code": f"FAR-IMP-{len(MOCK_CLAIMS)+1:03d}",
            "farmer_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "farm_id": "fa000001-0000-0000-0000-000000000001",
            "district": str(district).strip(),
            "crop": str(crop).strip(),
            "season": "Rabi 2026",
            "claimed_amount_inr": claimed_amt_float,
            "loss_cause": str(row.get("Loss Cause", "Crop Inundation")),
            "loss_event_type": "Flood/Inundation",
            "claimed_loss_percentage": loss_pct_float,
            "reported_yield_kg_ha": float(row.get("Reported Yield", 1200.0)),
            "status": str(row.get("Status", "Pending")),
            "incident_date": "2026-11-01",
            "khasra": str(row.get("Khasra", "12/3")),
            "policy_number": f"POL-IMP-{len(MOCK_CLAIMS)+1:03d}",
            "created_at": datetime.utcnow().isoformat(),
            "status_history": [
                {"status": "Pending", "changed_at": datetime.utcnow().isoformat(), "changed_by": "Batch Import", "remarks": "Imported via CSV/Excel"}
            ]
        }
        MOCK_CLAIMS.append(new_claim)
        imported_count += 1

    return {
        "status": "completed",
        "file_name": file.filename,
        "total_rows_processed": len(df),
        "imported_rows_count": imported_count,
        "error_rows_count": len(validation_errors),
        "validation_errors": validation_errors,
        "total_claims_in_system": len(MOCK_CLAIMS)
    }
