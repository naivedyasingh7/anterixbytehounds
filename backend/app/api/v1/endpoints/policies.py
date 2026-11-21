import uuid
from datetime import datetime, date
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.schemas.schemas import PolicyCreate, PolicyResponse
from app.core.security import require_roles, get_current_user_payload

router = APIRouter()

MOCK_POLICIES_STORE: List[Dict[str, Any]] = [
    {
        "id": "pol-001",
        "farmer_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "farm_id": "fa000001-0000-0000-0000-000000000001",
        "policy_number": "POL-PMFBY-BHP-2026-88",
        "scheme_name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "insurer_name": "Agriculture Insurance Company of India (AIC)",
        "crop": "Wheat",
        "season": "Rabi 2026",
        "insured_area_hectares": 2.50,
        "sum_insured_inr": 175000.0,
        "premium_paid_inr": 3500.0,
        "coverage_start_date": "2026-10-01",
        "coverage_end_date": "2027-03-31",
        "status": "Active",
        "created_at": "2026-09-20T10:00:00Z"
    },
    {
        "id": "pol-002",
        "farmer_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "farm_id": "fa000002-0000-0000-0000-000000000002",
        "policy_number": "POL-PMFBY-SEH-2026-14",
        "scheme_name": "PMFBY Kharif Oilseed & Pulses",
        "insurer_name": "HDFC ERGO General Insurance",
        "crop": "Soybean",
        "season": "Kharif 2026",
        "insured_area_hectares": 3.80,
        "sum_insured_inr": 228000.0,
        "premium_paid_inr": 4560.0,
        "coverage_start_date": "2026-06-15",
        "coverage_end_date": "2026-11-15",
        "status": "Active",
        "created_at": "2026-06-01T11:00:00Z"
    },
    {
        "id": "pol-003",
        "farmer_id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
        "farm_id": "fa000003-0000-0000-0000-000000000003",
        "policy_number": "POL-PMFBY-RSN-2026-92",
        "scheme_name": "PMFBY Kharif Cereal Guarantee",
        "insurer_name": "ICICI Lombard General Insurance",
        "crop": "Paddy",
        "season": "Kharif 2026",
        "insured_area_hectares": 4.20,
        "sum_insured_inr": 250000.0,
        "premium_paid_inr": 5000.0,
        "coverage_start_date": "2026-06-15",
        "coverage_end_date": "2026-11-30",
        "status": "Active",
        "created_at": "2026-06-05T09:30:00Z"
    }
]

@router.get("/")
def list_policies(
    crop: Optional[str] = None,
    season: Optional[str] = None,
    status_filter: Optional[str] = None
):
    """Lists insurance policies with optional filters."""
    results = MOCK_POLICIES_STORE
    if crop and crop != "All":
        results = [p for p in results if p["crop"].lower() == crop.lower()]
    if season and season != "All":
        results = [p for p in results if p["season"].lower() == season.lower()]
    if status_filter and status_filter != "All":
        results = [p for p in results if p["status"].lower() == status_filter.lower()]
    return results

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_policy(
    policy: PolicyCreate,
    current_user: Dict[str, Any] = Depends(require_roles(["insurance_officer", "admin"]))
):
    """
    Creates an insurance policy:
    - Generates unique policy number if omitted
    - Links to farmer and farm parcel
    - Validates coverage dates & positive insured values
    """
    if policy.coverage_start_date >= policy.coverage_end_date:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Policy coverage_start_date must be strictly before coverage_end_date."
        )

    policy_num = policy.policy_number or f"POL-PMFBY-IND-{datetime.utcnow().year}-{uuid.uuid4().hex[:6].upper()}"

    new_policy = {
        "id": str(uuid.uuid4()),
        "farmer_id": policy.farmer_id,
        "farm_id": policy.farm_id or "fa000001-0000-0000-0000-000000000001",
        "policy_number": policy_num,
        "scheme_name": policy.scheme_name,
        "insurer_name": policy.insurer_name,
        "crop": policy.crop,
        "season": policy.season,
        "insured_area_hectares": policy.insured_area_hectares,
        "sum_insured_inr": policy.sum_insured_inr,
        "premium_paid_inr": policy.premium_paid_inr,
        "coverage_start_date": str(policy.coverage_start_date),
        "coverage_end_date": str(policy.coverage_end_date),
        "status": "Active",
        "created_at": datetime.utcnow().isoformat()
    }
    MOCK_POLICIES_STORE.append(new_policy)
    return new_policy

@router.get("/{policy_id}")
def get_policy(policy_id: str):
    """Retrieves policy by ID or policy number."""
    matched = next((p for p in MOCK_POLICIES_STORE if p["id"] == policy_id or p["policy_number"] == policy_id), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Policy '{policy_id}' not found")
    return matched

@router.get("/by-farmer/{farmer_id}")
def get_policies_by_farmer(farmer_id: str):
    """Retrieves all policies linked to a specific farmer."""
    policies = [p for p in MOCK_POLICIES_STORE if p["farmer_id"] == farmer_id]
    return {
        "farmer_id": farmer_id,
        "total_policies": len(policies),
        "policies": policies
    }

@router.get("/by-claim/{claim_id}")
def get_policy_by_claim(claim_id: str):
    """Retrieves the active policy linked to a specific claim."""
    from app.api.v1.endpoints.claims import MOCK_CLAIMS
    claim = next((c for c in MOCK_CLAIMS if c["claim_number"].lower() == claim_id.lower() or c["id"] == claim_id), None)
    if not claim:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found")

    pol_num = claim.get("policy_number")
    matched_policy = next((p for p in MOCK_POLICIES_STORE if p["policy_number"] == pol_num), MOCK_POLICIES_STORE[0])
    return matched_policy
