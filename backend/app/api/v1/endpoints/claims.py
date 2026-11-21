from fastapi import APIRouter, UploadFile, File, Query
from typing import List, Dict, Any, Optional
import io
import pandas as pd
from app.schemas.schemas import ClaimListItem, ClaimsOverviewMetrics

router = APIRouter()

MOCK_CLAIMS: List[Dict[str, Any]] = [
    {
        "id": "c0000001-0000-0000-0000-000000000001",
        "claim_number": "CLM001",
        "farmer_name": "Rajesh Kumar Patel",
        "farmer_code": "FAR-MP-BHP-001",
        "district": "Bhopal",
        "crop": "Wheat",
        "claimed_amount_inr": 113750.0,
        "loss_cause": "Drought & Prolonged Dry Spell",
        "claimed_loss_percentage": 65.0,
        "status": "Pending",
        "incident_date": "2026-11-05",
        "khasra": "48/2",
        "policy_number": "POL-PMFBY-BHP-2026-88"
    },
    {
        "id": "c0000002-0000-0000-0000-000000000002",
        "claim_number": "CLM002",
        "farmer_name": "Sunita Bai Chouhan",
        "farmer_code": "FAR-MP-SEH-002",
        "district": "Sehore",
        "crop": "Soybean",
        "claimed_amount_inr": 182400.0,
        "loss_cause": "Unseasonal Excessive Rain & Inundation",
        "claimed_loss_percentage": 80.0,
        "status": "Verified",
        "incident_date": "2026-10-18",
        "khasra": "112/1",
        "policy_number": "POL-PMFBY-SEH-2026-14"
    },
    {
        "id": "c0000003-0000-0000-0000-000000000003",
        "claim_number": "CLM003",
        "farmer_name": "Mohan Lal Verma",
        "farmer_code": "FAR-MP-RSN-003",
        "district": "Raisen",
        "crop": "Paddy",
        "claimed_amount_inr": 175000.0,
        "loss_cause": "Pest Blight & False Smut",
        "claimed_loss_percentage": 70.0,
        "status": "Flagged",
        "incident_date": "2026-10-25",
        "khasra": "95/4",
        "policy_number": "POL-PMFBY-RSN-2026-92"
    }
]

@router.get("/", response_model=List[Dict[str, Any]])
def list_claims(
    district: Optional[str] = None,
    crop: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
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
    total = len(MOCK_CLAIMS)
    pending = len([c for c in MOCK_CLAIMS if c["status"] == "Pending"])
    verified = len([c for c in MOCK_CLAIMS if c["status"] == "Verified"])
    flagged = len([c for c in MOCK_CLAIMS if c["status"] == "Flagged"])
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

@router.post("/import-csv")
async def import_claims_csv(file: UploadFile = File(...)):
    """Imports batch claims from CSV file."""
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))
    
    imported_count = 0
    for _, row in df.iterrows():
        new_claim = {
            "id": f"c{len(MOCK_CLAIMS)+1:07d}-0000-0000-0000-000000000001",
            "claim_number": str(row.get("Claim ID", f"CLM{len(MOCK_CLAIMS)+1:03d}")),
            "farmer_name": str(row.get("Farmer", "Imported Farmer")),
            "farmer_code": f"FAR-IMP-{len(MOCK_CLAIMS)+1:03d}",
            "district": str(row.get("District", "Bhopal")),
            "crop": str(row.get("Crop", "Wheat")),
            "claimed_amount_inr": float(row.get("Claimed Amount", 120000)),
            "loss_cause": str(row.get("Loss Cause", "Crop Inundation")),
            "claimed_loss_percentage": float(row.get("Loss %", 60.0)),
            "status": str(row.get("Status", "Pending")),
            "incident_date": "2026-11-01",
            "khasra": str(row.get("Khasra", "12/3")),
            "policy_number": f"POL-IMP-{len(MOCK_CLAIMS)+1:03d}"
        }
        MOCK_CLAIMS.append(new_claim)
        imported_count += 1

    return {"status": "success", "imported_rows": imported_count, "total_claims": len(MOCK_CLAIMS)}
