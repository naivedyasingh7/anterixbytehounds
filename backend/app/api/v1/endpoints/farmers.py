from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter()

MOCK_FARMERS = [
    {
        "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "user_id": "22222222-2222-2222-2222-222222222222",
        "farmer_name": "Rajesh Kumar Patel",
        "farmer_id_code": "FAR-MP-BHP-001",
        "village": "Berasia",
        "tehsil": "Huzur",
        "district": "Bhopal",
        "state": "Madhya Pradesh",
        "pincode": "462038",
        "phone": "+91 94250 88776",
        "farms_count": 1,
        "active_policies": ["POL-PMFBY-BHP-2026-88"]
    },
    {
        "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "user_id": "33333333-3333-3333-3333-333333333333",
        "farmer_name": "Sunita Bai Chouhan",
        "farmer_id_code": "FAR-MP-SEH-002",
        "village": "Ashta",
        "tehsil": "Ashta",
        "district": "Sehore",
        "state": "Madhya Pradesh",
        "pincode": "466116",
        "phone": "+91 97555 44332",
        "farms_count": 1,
        "active_policies": ["POL-PMFBY-SEH-2026-14"]
    },
    {
        "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
        "user_id": "44444444-4444-4444-4444-444444444444",
        "farmer_name": "Mohan Lal Verma",
        "farmer_id_code": "FAR-MP-RSN-003",
        "village": "Gairatganj",
        "tehsil": "Begamganj",
        "district": "Raisen",
        "state": "Madhya Pradesh",
        "pincode": "464884",
        "phone": "+91 91110 99887",
        "farms_count": 1,
        "active_policies": ["POL-PMFBY-RSN-2026-92"]
    }
]

@router.get("/", response_model=List[Dict[str, Any]])
def list_farmers():
    """Returns directory of registered farmers and policies."""
    return MOCK_FARMERS

@router.get("/me")
def get_current_farmer_profile():
    return MOCK_FARMERS[0]
