import uuid
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status, Query, Depends
from app.schemas.schemas import (
    FarmerProfileCreate, FarmerProfileUpdate, FarmerProfile
)
from app.core.security import require_roles, get_current_user_payload

router = APIRouter()

MOCK_POLICIES = [
    {
        "id": "pol-001",
        "farmer_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "farmer_id_code": "FAR-MP-BHP-001",
        "policy_number": "POL-PMFBY-BHP-2026-88",
        "scheme_name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "sum_insured_inr": 175000.0,
        "premium_paid_inr": 3500.0,
        "crop": "Wheat",
        "season": "Rabi 2026",
        "coverage_start_date": "2026-10-01",
        "coverage_end_date": "2027-03-31",
        "status": "Active"
    },
    {
        "id": "pol-002",
        "farmer_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "farmer_id_code": "FAR-MP-SEH-002",
        "policy_number": "POL-PMFBY-SEH-2026-14",
        "scheme_name": "PMFBY Kharif Oilseed & Pulses",
        "sum_insured_inr": 228000.0,
        "premium_paid_inr": 4560.0,
        "crop": "Soybean",
        "season": "Kharif 2026",
        "coverage_start_date": "2026-06-15",
        "coverage_end_date": "2026-11-15",
        "status": "Active"
    },
    {
        "id": "pol-003",
        "farmer_id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
        "farmer_id_code": "FAR-MP-RSN-003",
        "policy_number": "POL-PMFBY-RSN-2026-92",
        "scheme_name": "PMFBY Kharif Cereal Guarantee",
        "sum_insured_inr": 250000.0,
        "premium_paid_inr": 5000.0,
        "crop": "Paddy",
        "season": "Kharif 2026",
        "coverage_start_date": "2026-06-15",
        "coverage_end_date": "2026-11-30",
        "status": "Active"
    }
]

MOCK_FARMERS: List[Dict[str, Any]] = [
    {
        "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "user_id": "22222222-2222-2222-2222-222222222222",
        "farmer_name": "Rajesh Kumar Patel",
        "farmer_id_code": "FAR-MP-BHP-001",
        "village": "Berasia",
        "sub_district_tehsil": "Huzur",
        "district": "Bhopal",
        "state": "Madhya Pradesh",
        "pincode": "462038",
        "phone": "+91 94250 88776",
        "aadhar_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "bank_account_last4": "4821",
        "primary_crop": "Wheat",
        "farms_count": 1,
        "active_policies": ["POL-PMFBY-BHP-2026-88"]
    },
    {
        "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "user_id": "33333333-3333-3333-3333-333333333333",
        "farmer_name": "Sunita Bai Chouhan",
        "farmer_id_code": "FAR-MP-SEH-002",
        "village": "Ashta",
        "sub_district_tehsil": "Ashta",
        "district": "Sehore",
        "state": "Madhya Pradesh",
        "pincode": "466116",
        "phone": "+91 97555 44332",
        "aadhar_hash": "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
        "bank_account_last4": "9012",
        "primary_crop": "Soybean",
        "farms_count": 1,
        "active_policies": ["POL-PMFBY-SEH-2026-14"]
    },
    {
        "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
        "user_id": "44444444-4444-4444-4444-444444444444",
        "farmer_name": "Mohan Lal Verma",
        "farmer_id_code": "FAR-MP-RSN-003",
        "village": "Gairatganj",
        "sub_district_tehsil": "Begamganj",
        "district": "Raisen",
        "state": "Madhya Pradesh",
        "pincode": "464884",
        "phone": "+91 91110 99887",
        "aadhar_hash": "f0e1d2c3b4a5968778695a4b3c2d1e0f0123456789abcdef0123456789abcdef",
        "bank_account_last4": "6643",
        "primary_crop": "Paddy",
        "farms_count": 1,
        "active_policies": ["POL-PMFBY-RSN-2026-92"]
    }
]

DISTRICT_CODES = {
    "bhopal": "BHP",
    "sehore": "SEH",
    "raisen": "RSN",
    "indore": "IND",
    "ujjain": "UJN",
    "jabalpur": "JBP",
    "gwalior": "GWL"
}

def generate_unique_farmer_id(state: str, district: str) -> str:
    """
    Generates a collision-resistant unique farmer ID.
    Format: FAR-{STATE_ABBR}-{DISTRICT_ABBR}-{SEQUENCE:03d}
    """
    state_abbr = "MP" if "madhya" in state.lower() else state[:2].upper()
    dist_abbr = DISTRICT_CODES.get(district.lower().strip(), district[:3].upper())
    seq = len(MOCK_FARMERS) + 1
    new_id = f"FAR-{state_abbr}-{dist_abbr}-{seq:03d}"
    
    # Ensure uniqueness
    existing_ids = {f["farmer_id_code"] for f in MOCK_FARMERS}
    while new_id in existing_ids:
        seq += 1
        new_id = f"FAR-{state_abbr}-{dist_abbr}-{seq:03d}"
    return new_id

# -------------------------------------------------------------
# 1. Search and Filter Farmers
# -------------------------------------------------------------
@router.get("/")
def list_and_filter_farmers(
    search: Optional[str] = Query(None, description="Search by name, farmer ID, village, or phone"),
    district: Optional[str] = Query(None, description="Filter by district"),
    village: Optional[str] = Query(None, description="Filter by village"),
    state: Optional[str] = Query(None, description="Filter by state"),
    crop: Optional[str] = Query(None, description="Filter by primary cultivated crop"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    Search and filter registered farmers by location, crop, or textual match.
    """
    results = MOCK_FARMERS

    if district and district != "All":
        results = [f for f in results if f["district"].lower() == district.lower()]
    if village and village != "All":
        results = [f for f in results if f["village"].lower() == village.lower()]
    if state and state != "All":
        results = [f for f in results if f["state"].lower() == state.lower()]
    if crop and crop != "All":
        results = [f for f in results if f.get("primary_crop", "").lower() == crop.lower()]

    if search:
        s = search.lower().strip()
        results = [
            f for f in results
            if s in f["farmer_name"].lower()
            or s in f["farmer_id_code"].lower()
            or s in f["village"].lower()
            or s in f.get("district", "").lower()
            or s in f.get("phone", "").lower()
        ]

    total = len(results)
    paginated = results[offset : offset + limit]

    return {
        "total_records": total,
        "limit": limit,
        "offset": offset,
        "farmers": paginated
    }

# -------------------------------------------------------------
# 2. Create Farmer Profile API
# -------------------------------------------------------------
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_farmer_profile(
    profile_data: FarmerProfileCreate,
    current_user: Dict[str, Any] = Depends(require_roles(["farmer", "insurance_officer", "admin"]))
):
    """
    Creates a new farmer profile, validates contact & address details,
    and assigns a unique collision-resistant Farmer ID code.
    """
    unique_code = generate_unique_farmer_id(profile_data.state, profile_data.district)
    profile_id = str(uuid.uuid4())

    new_profile = {
        "id": profile_id,
        "user_id": current_user.get("user_id", str(uuid.uuid4())),
        "farmer_name": profile_data.farmer_name,
        "farmer_id_code": unique_code,
        "village": profile_data.village,
        "sub_district_tehsil": profile_data.sub_district_tehsil or "Tehsil Center",
        "district": profile_data.district,
        "state": profile_data.state,
        "pincode": profile_data.pincode,
        "phone": profile_data.phone,
        "aadhar_hash": profile_data.aadhar_hash or "sha256-verified-placeholder",
        "bank_account_last4": profile_data.bank_account_last4,
        "primary_crop": profile_data.primary_crop or "Wheat",
        "farms_count": 0,
        "active_policies": []
    }

    MOCK_FARMERS.append(new_profile)

    return {
        "status": "success",
        "message": f"Farmer profile created for {profile_data.farmer_name}.",
        "farmer_id_code": unique_code,
        "profile": new_profile
    }

# -------------------------------------------------------------
# 3. Logged-in Farmer Profile (Get & Update /me)
# -------------------------------------------------------------
@router.get("/me")
def get_current_farmer_profile(current_user: Dict[str, Any] = Depends(get_current_user_payload)):
    """Retrieves profile of the currently authenticated farmer."""
    email = current_user.get("sub")
    farmer = next(
        (f for f in MOCK_FARMERS if f.get("user_id") == current_user.get("user_id")),
        MOCK_FARMERS[0]
    )
    return farmer

@router.put("/me")
def update_current_farmer_profile(
    update_data: FarmerProfileUpdate,
    current_user: Dict[str, Any] = Depends(require_roles(["farmer", "admin"]))
):
    """Updates contact, village, and bank details for current authenticated farmer."""
    farmer = next(
        (f for f in MOCK_FARMERS if f.get("user_id") == current_user.get("user_id")),
        MOCK_FARMERS[0]
    )
    for field, val in update_data.model_dump(exclude_unset=True).items():
        if val is not None:
            farmer[field] = val

    return {
        "status": "success",
        "message": "Profile updated successfully.",
        "profile": farmer
    }

# -------------------------------------------------------------
# 4. Get and Update Farmer Profile by ID
# -------------------------------------------------------------
@router.get("/{farmer_id}")
def get_farmer_profile(farmer_id: str):
    """Retrieves farmer profile by UUID or unique farmer code."""
    matched = next(
        (f for f in MOCK_FARMERS if f["id"] == farmer_id or f["farmer_id_code"].lower() == farmer_id.lower()),
        None
    )
    if not matched:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farmer with ID '{farmer_id}' not found."
        )
    return matched

@router.put("/{farmer_id}")
def update_farmer_profile(
    farmer_id: str,
    update_data: FarmerProfileUpdate,
    current_user: Dict[str, Any] = Depends(require_roles(["insurance_officer", "admin", "farmer"]))
):
    """Updates village, district, state, and contact details for a specific farmer."""
    matched = next(
        (f for f in MOCK_FARMERS if f["id"] == farmer_id or f["farmer_id_code"].lower() == farmer_id.lower()),
        None
    )
    if not matched:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farmer with ID '{farmer_id}' not found."
        )

    for field, val in update_data.model_dump(exclude_unset=True).items():
        if val is not None:
            matched[field] = val

    return {
        "status": "success",
        "message": f"Farmer profile '{matched['farmer_id_code']}' updated.",
        "profile": matched
    }

# -------------------------------------------------------------
# 5. Retrieve Farmer's Registered Farms
# -------------------------------------------------------------
@router.get("/{farmer_id}/farms")
def get_farmer_farms(farmer_id: str):
    """Retrieves all cadastral farm parcels registered under this farmer."""
    from app.api.v1.endpoints.farms import MOCK_FARMS

    matched_farmer = next(
        (f for f in MOCK_FARMERS if f["id"] == farmer_id or f["farmer_id_code"].lower() == farmer_id.lower()),
        None
    )
    if not matched_farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farmer with ID '{farmer_id}' not found."
        )

    farms = [
        f for f in MOCK_FARMS 
        if f.get("farmer_id") == matched_farmer["id"] 
        or f.get("farmer_name", "").lower() == matched_farmer["farmer_name"].lower()
    ]

    return {
        "farmer_id": matched_farmer["id"],
        "farmer_id_code": matched_farmer["farmer_id_code"],
        "farmer_name": matched_farmer["farmer_name"],
        "total_farms": len(farms),
        "farms": farms
    }

# -------------------------------------------------------------
# 6. Retrieve Farmer's Policies and Claims
# -------------------------------------------------------------
@router.get("/{farmer_id}/policies")
def get_farmer_policies(farmer_id: str):
    """Retrieves active PMFBY crop insurance policies for this farmer."""
    matched_farmer = next(
        (f for f in MOCK_FARMERS if f["id"] == farmer_id or f["farmer_id_code"].lower() == farmer_id.lower()),
        None
    )
    if not matched_farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farmer with ID '{farmer_id}' not found."
        )

    policies = [
        p for p in MOCK_POLICIES 
        if p.get("farmer_id") == matched_farmer["id"] 
        or p.get("farmer_id_code") == matched_farmer["farmer_id_code"]
    ]

    return {
        "farmer_id_code": matched_farmer["farmer_id_code"],
        "farmer_name": matched_farmer["farmer_name"],
        "total_policies": len(policies),
        "policies": policies
    }

@router.get("/{farmer_id}/claims")
def get_farmer_claims(farmer_id: str):
    """Retrieves all insurance crop loss claims submitted by this farmer."""
    from app.api.v1.endpoints.claims import MOCK_CLAIMS

    matched_farmer = next(
        (f for f in MOCK_FARMERS if f["id"] == farmer_id or f["farmer_id_code"].lower() == farmer_id.lower()),
        None
    )
    if not matched_farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farmer with ID '{farmer_id}' not found."
        )

    claims = [
        c for c in MOCK_CLAIMS 
        if c.get("farmer_code") == matched_farmer["farmer_id_code"] 
        or c.get("farmer_name", "").lower() == matched_farmer["farmer_name"].lower()
    ]

    return {
        "farmer_id_code": matched_farmer["farmer_id_code"],
        "farmer_name": matched_farmer["farmer_name"],
        "total_claims": len(claims),
        "claims": claims
    }
