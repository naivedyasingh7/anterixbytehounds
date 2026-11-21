from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from app.schemas.schemas import LoginRequest, TokenResponse, UserCreate
from app.core.security import verify_password, create_access_token

router = APIRouter()

DEMO_ACCOUNTS = [
    {
        "id": "11111111-1111-1111-1111-111111111111",
        "email": "officer.sharma@agriverify.in",
        "full_name": "R. K. Sharma",
        "role": "insurance_officer",
        "designation": "Senior Claims Assessor (Bhopal Div.)",
        "password_hint": "Officer@123"
    },
    {
        "id": "22222222-2222-2222-2222-222222222222",
        "email": "farmer.rajesh@agriverify.in",
        "full_name": "Rajesh Kumar Patel",
        "role": "farmer",
        "designation": "Wheat & Soybean Cultivator (Berasia)",
        "password_hint": "Farmer@123"
    }
]

@router.get("/demo-accounts")
def get_demo_accounts():
    """Returns pre-configured demo credentials for one-click testing."""
    return DEMO_ACCOUNTS

@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest):
    # Check demo users first
    matched = next((u for u in DEMO_ACCOUNTS if u["email"].lower() == credentials.email.lower()), None)
    if not matched:
        # Default fallback for testing
        matched = {
            "id": "22222222-2222-2222-2222-222222222222",
            "email": credentials.email,
            "full_name": "Registered User",
            "role": "farmer"
        }

    token_data = {
        "sub": matched["email"],
        "user_id": matched["id"],
        "role": matched["role"],
        "full_name": matched["full_name"]
    }
    token = create_access_token(token_data)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": matched
    }

@router.post("/register")
def register(user_data: UserCreate):
    return {
        "status": "success",
        "message": f"Account for {user_data.full_name} ({user_data.role}) registered successfully. Please login.",
        "email": user_data.email
    }
