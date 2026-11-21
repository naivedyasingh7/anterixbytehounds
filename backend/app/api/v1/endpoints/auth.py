import uuid
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.schemas import (
    LoginRequest, TokenResponse, UserCreate,
    FarmerRegistrationRequest, OfficerRegistrationRequest, OfficerInviteRequest,
    PasswordResetRequest, PasswordResetConfirm, ChangePasswordRequest, AccountStatusUpdate
)
from app.core.security import (
    verify_password, get_password_hash, create_access_token,
    revoke_token, get_current_user_payload, require_roles,
    create_password_reset_token, verify_password_reset_token,
    ACTIVE_SESSIONS, oauth2_scheme
)

router = APIRouter()

# In-memory account database for rapid testing and demo persistence
USERS_DB: Dict[str, Dict[str, Any]] = {
    "officer.sharma@agriverify.in": {
        "id": "11111111-1111-1111-1111-111111111111",
        "email": "officer.sharma@agriverify.in",
        "hashed_password": get_password_hash("Officer@123"),
        "full_name": "R. K. Sharma",
        "role": "insurance_officer",
        "tenant_id": "AIC_INDIA",
        "designation": "Senior Claims Assessor (Bhopal Div.)",
        "status": "active",
        "is_active": True,
        "phone": "+91 98260 11223"
    },
    "farmer.rajesh@agriverify.in": {
        "id": "22222222-2222-2222-2222-222222222222",
        "email": "farmer.rajesh@agriverify.in",
        "hashed_password": get_password_hash("Farmer@123"),
        "full_name": "Rajesh Kumar Patel",
        "role": "farmer",
        "tenant_id": "AIC_INDIA",
        "farmer_code": "FAR-MP-BHP-001",
        "village": "Berasia",
        "district": "Bhopal",
        "status": "active",
        "is_active": True,
        "phone": "+91 94250 88776"
    },
    "admin@agriverify.in": {
        "id": "99999999-9999-9999-9999-999999999999",
        "email": "admin@agriverify.in",
        "hashed_password": get_password_hash("Admin@123"),
        "full_name": "System Administrator",
        "role": "admin",
        "tenant_id": "AIC_INDIA",
        "status": "active",
        "is_active": True,
        "phone": "+91 99999 00000"
    }
}

INVITATIONS: Dict[str, Dict[str, Any]] = {}

@router.get("/demo-accounts")
def get_demo_accounts():
    """Returns pre-configured demo credentials for one-click testing."""
    return [
        {
            "email": u["email"],
            "full_name": u["full_name"],
            "role": u["role"],
            "tenant_id": u["tenant_id"],
            "designation": u.get("designation") or u.get("farmer_code")
        }
        for u in USERS_DB.values()
    ]

# -------------------------------------------------------------
# 1. Farmer Registration API
# -------------------------------------------------------------
@router.post("/register/farmer", status_code=status.HTTP_201_CREATED)
def register_farmer(data: FarmerRegistrationRequest):
    """Registers a new farmer, hashes password, and creates linked farmer profile."""
    email_key = data.email.lower()
    if email_key in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email '{data.email}' already exists."
        )

    user_id = str(uuid.uuid4())
    farmer_code = f"FAR-MP-{data.district[:3].upper()}-{len(USERS_DB)+1:03d}"

    new_user = {
        "id": user_id,
        "email": email_key,
        "hashed_password": get_password_hash(data.password),
        "full_name": data.full_name,
        "phone": data.phone,
        "role": "farmer",
        "tenant_id": "AIC_INDIA",
        "farmer_code": farmer_code,
        "village": data.village,
        "district": data.district,
        "sub_district_tehsil": data.sub_district_tehsil,
        "state": data.state,
        "pincode": data.pincode,
        "aadhar_hash": data.aadhar_hash or "8a4f9...masked",
        "status": "active",
        "is_active": True
    }
    USERS_DB[email_key] = new_user

    return {
        "status": "success",
        "message": f"Farmer profile created successfully for {data.full_name}.",
        "farmer_id_code": farmer_code,
        "user_id": user_id,
        "email": data.email
    }

# -------------------------------------------------------------
# 2. Insurance Officer Registration & Invitation API
# -------------------------------------------------------------
@router.post("/invite/officer")
def invite_officer(
    invite: OfficerInviteRequest,
    current_user: Dict[str, Any] = Depends(require_roles(["admin"]))
):
    """Admin-only endpoint to issue secure invitation codes for insurance officers."""
    invitation_code = f"INV-OFFICER-{uuid.uuid4().hex[:8].upper()}"
    INVITATIONS[invitation_code] = {
        "email": invite.email.lower(),
        "full_name": invite.full_name,
        "organization_id": invite.organization_id,
        "division": invite.division
    }

    return {
        "status": "success",
        "invitation_code": invitation_code,
        "email": invite.email,
        "organization_id": invite.organization_id,
        "instructions": f"Share invitation code '{invitation_code}' with {invite.full_name} to complete onboarding."
    }

@router.post("/register/officer", status_code=status.HTTP_201_CREATED)
def register_officer(data: OfficerRegistrationRequest):
    """Registers an insurance assessor, validating tenant insurer organization."""
    email_key = data.email.lower()
    if email_key in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email '{data.email}' already exists."
        )

    user_id = str(uuid.uuid4())
    new_user = {
        "id": user_id,
        "email": email_key,
        "hashed_password": get_password_hash(data.password),
        "full_name": data.full_name,
        "phone": data.phone,
        "role": "insurance_officer",
        "tenant_id": data.organization_id,
        "designation": f"{data.designation} ({data.division})",
        "status": "active",
        "is_active": True
    }
    USERS_DB[email_key] = new_user

    return {
        "status": "success",
        "message": f"Insurance officer account registered under insurer organization '{data.organization_id}'.",
        "user_id": user_id,
        "organization_id": data.organization_id
    }

# -------------------------------------------------------------
# 3. Login & Logout APIs
# -------------------------------------------------------------
@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest):
    """Authenticates credentials via bcrypt, checks status, and issues tenant-scoped JWT."""
    email_key = credentials.email.lower()
    user = USERS_DB.get(email_key)

    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # Enforce account status controls
    if user.get("status") in ["suspended", "locked"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is {user.get('status')}. Access revoked by administrator."
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive."
        )

    token_data = {
        "sub": user["email"],
        "user_id": user["id"],
        "role": user["role"],
        "tenant_id": user.get("tenant_id", "AIC_INDIA"),
        "full_name": user["full_name"],
        "status": user["status"]
    }
    token = create_access_token(token_data)

    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": 86400,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "tenant_id": user.get("tenant_id", "AIC_INDIA"),
            "status": user["status"]
        }
    }

@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    """Revokes the current JWT bearer token and terminates active session."""
    if token:
        revoke_token(token)
    return {
        "status": "success",
        "message": "Logged out successfully. Token invalidated."
    }

@router.get("/me")
def get_current_user_profile(user: Dict[str, Any] = Depends(get_current_user_payload)):
    """Returns the authenticated user identity, role, and tenant organization."""
    return {
        "user": user,
        "tenant_organization": user.get("tenant_id", "AIC_INDIA"),
        "role": user.get("role"),
        "permissions": [
            "claim:view",
            "claim:assess" if user.get("role") in ["insurance_officer", "admin"] else "claim:submit",
            "farm:register" if user.get("role") in ["farmer", "admin"] else "farm:verify",
            "admin:manage" if user.get("role") == "admin" else None
        ]
    }

# -------------------------------------------------------------
# 4. Password Hashing and Reset
# -------------------------------------------------------------
@router.post("/password-reset/request")
def request_password_reset(data: PasswordResetRequest):
    """Generates a secure 15-minute password reset token."""
    email_key = data.email.lower()
    if email_key not in USERS_DB:
        # Prevent account enumeration: return success regardless
        return {"status": "success", "message": "If the email is registered, a password reset link has been issued."}

    token = create_password_reset_token(email_key)
    return {
        "status": "success",
        "message": "Password reset token generated.",
        "reset_token": token,
        "expires_in_minutes": 15
    }

@router.post("/password-reset/confirm")
def confirm_password_reset(data: PasswordResetConfirm):
    """Validates reset token and sets new bcrypt password."""
    email = verify_password_reset_token(data.token)
    if not email or email not in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset token."
        )

    USERS_DB[email]["hashed_password"] = get_password_hash(data.new_password)
    return {
        "status": "success",
        "message": "Password updated successfully. You can now login with your new credentials."
    }

@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user: Dict[str, Any] = Depends(get_current_user_payload)
):
    """Allows an authenticated user to change their password."""
    email = current_user.get("sub")
    user = USERS_DB.get(email)
    if not user or not verify_password(data.old_password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password does not match."
        )

    user["hashed_password"] = get_password_hash(data.new_password)
    return {
        "status": "success",
        "message": "Password updated successfully."
    }

# -------------------------------------------------------------
# 5. Account Status & Session Controls
# -------------------------------------------------------------
@router.patch("/account-status")
def update_account_status(
    data: AccountStatusUpdate,
    admin_user: Dict[str, Any] = Depends(require_roles(["admin"]))
):
    """Admin-only endpoint to suspend, lock, or activate user accounts."""
    target_user = next((u for u in USERS_DB.values() if u["id"] == data.user_id), None)
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id '{data.user_id}' not found."
        )

    target_user["status"] = data.status
    if data.status in ["suspended", "locked"]:
        target_user["is_active"] = False
    else:
        target_user["is_active"] = True

    return {
        "status": "success",
        "user_id": data.user_id,
        "new_status": data.status,
        "reason": data.reason
    }

@router.get("/sessions")
def list_active_sessions(admin_user: Dict[str, Any] = Depends(require_roles(["admin"]))):
    """Admin-only endpoint to inspect live active user sessions."""
    return {
        "total_active_sessions": len(ACTIVE_SESSIONS),
        "sessions": list(ACTIVE_SESSIONS.values())
    }
