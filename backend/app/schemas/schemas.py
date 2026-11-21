from typing import Optional, List, Dict, Any, Literal
from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field, field_validator

# ==========================================
# User, Authentication & RBAC Schemas
# ==========================================

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: Literal["farmer", "insurance_officer", "admin"] = "farmer"
    tenant_id: str = "AIC_INDIA" # Multi-tenancy isolation
    status: Literal["active", "pending_verification", "suspended", "locked"] = "active"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 86400 # 24 hours
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Farmer Specific Registration
class FarmerRegistrationRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str
    village: str
    district: str
    sub_district_tehsil: Optional[str] = None
    state: str = "Madhya Pradesh"
    pincode: Optional[str] = None
    aadhar_hash: Optional[str] = None

# Insurance Officer Registration & Invitation
class OfficerRegistrationRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    organization_id: str = "AIC_INDIA"
    designation: str = "Claims Assessor"
    division: str = "Bhopal Division"
    invitation_code: Optional[str] = None

class OfficerInviteRequest(BaseModel):
    email: EmailStr
    full_name: str
    organization_id: str = "AIC_INDIA"
    division: str = "Bhopal Division"
    role: Literal["insurance_officer"] = "insurance_officer"

# Password Management
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

# Account Status & Session Controls
class AccountStatusUpdate(BaseModel):
    user_id: str
    status: Literal["active", "pending_verification", "suspended", "locked"]
    reason: Optional[str] = None

# ==========================================
# Farmer & Farm Schemas
# ==========================================

import re

class FarmerProfileCreate(BaseModel):
    farmer_name: str
    phone: str
    village: str
    district: str
    sub_district_tehsil: Optional[str] = None
    state: str = "Madhya Pradesh"
    pincode: Optional[str] = None
    aadhar_hash: Optional[str] = None
    bank_account_last4: Optional[str] = None
    primary_crop: Optional[str] = "Wheat"

    @field_validator("phone")
    def validate_phone(cls, v: str) -> str:
        clean = re.sub(r"[^\d+]", "", v)
        digits = re.sub(r"\D", "", clean)
        if len(digits) < 10:
            raise ValueError("Phone number must contain at least 10 digits.")
        return clean

    @field_validator("pincode")
    def validate_pincode(cls, v: Optional[str]) -> Optional[str]:
        if v:
            clean = v.strip()
            if not re.match(r"^\d{6}$", clean):
                raise ValueError("Indian PIN code must be exactly 6 digits.")
            return clean
        return v

    @field_validator("village", "district")
    def validate_non_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Village and District cannot be empty.")
        return v.strip()

class FarmerProfileUpdate(BaseModel):
    farmer_name: Optional[str] = None
    phone: Optional[str] = None
    village: Optional[str] = None
    sub_district_tehsil: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    bank_account_last4: Optional[str] = None
    primary_crop: Optional[str] = None

    @field_validator("phone")
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v:
            clean = re.sub(r"[^\d+]", "", v)
            digits = re.sub(r"\D", "", clean)
            if len(digits) < 10:
                raise ValueError("Phone number must contain at least 10 digits.")
            return clean
        return v

    @field_validator("pincode")
    def validate_pincode(cls, v: Optional[str]) -> Optional[str]:
        if v:
            clean = v.strip()
            if not re.match(r"^\d{6}$", clean):
                raise ValueError("Indian PIN code must be exactly 6 digits.")
            return clean
        return v

class FarmerProfile(BaseModel):
    farmer_id_code: str
    village: str
    sub_district_tehsil: Optional[str] = None
    district: str
    state: str = "Madhya Pradesh"
    pincode: Optional[str] = None

class FarmCreate(BaseModel):
    farm_name: str
    khasra_number: str
    declared_area_hectares: float
    current_crop: str
    season: str
    soil_type: Optional[str] = None
    boundary_geojson: Dict[str, Any]

class FarmResponse(BaseModel):
    id: str
    farmer_id: str
    farm_name: str
    khasra_number: str
    declared_area_hectares: float
    geodesic_area_hectares: Optional[float] = None
    area_variance_percent: Optional[float] = None
    current_crop: str
    season: str
    soil_type: Optional[str] = None
    boundary_geojson: Dict[str, Any]
    verification_status: str

# ==========================================
# Claim Schemas
# ==========================================

class ClaimCreate(BaseModel):
    farm_id: str
    policy_id: str
    loss_cause: str
    claimed_loss_percentage: float
    claimed_amount_inr: float
    incident_date: date

class ClaimListItem(BaseModel):
    id: str
    claim_number: str
    farmer_name: str
    farmer_code: str
    district: str
    crop: str
    claimed_amount_inr: float
    loss_cause: str
    status: str
    incident_date: str

class ClaimsOverviewMetrics(BaseModel):
    total_claims: int
    pending_claims: int
    verified_claims: int
    flagged_claims: int
    delayed_claims: int
    district_distribution: Dict[str, int]
    recent_activity: List[Dict[str, Any]]

# ==========================================
# Verification Engines Schemas
# ==========================================

# Engine 1
class FarmVerificationResult(BaseModel):
    farm_id: str
    declared_area_ha: float
    geodesic_area_ha: float
    variance_percent: float
    status: str # Verified, Mismatch, Manual Review, Insufficient Data
    khasra_verified: bool
    notes: str

# Engine 2
class YieldVerificationResult(BaseModel):
    claim_id: str
    crop_type: str
    reported_yield_kg_ha: float
    estimated_yield_kg_ha: float
    historical_benchmark_kg_ha: float
    loss_severity_percent: float
    model_confidence_score: float
    is_experimental: bool
    ndvi_timeline: List[Dict[str, Any]]
    weather_summary: Dict[str, Any]
    verdict: str

# Engine 3
class ProcessAuditResult(BaseModel):
    claim_id: str
    turnaround_days: int
    stages_completed: int
    sla_status: str # On Time, Delayed, Critical Delay
    missing_records: List[str]
    anomalies: List[str]
    timeline_events: List[Dict[str, Any]]

# Assessment Decision
class AssessmentRequest(BaseModel):
    decision: str # Approved, Rejected, Flagged_Investigation, More_Info_Required
    approved_amount_inr: Optional[float] = None
    remarks: str


# ==========================================
# Policy Management Schemas (Module 5)
# ==========================================

class PolicyCreate(BaseModel):
    farmer_id: str
    farm_id: Optional[str] = None
    policy_number: Optional[str] = None
    scheme_name: str = "Pradhan Mantri Fasal Bima Yojana (PMFBY)"
    insurer_name: str = "Agriculture Insurance Company of India (AIC)"
    crop: str
    season: str = "Rabi 2026"
    insured_area_hectares: float
    sum_insured_inr: float
    premium_paid_inr: float
    coverage_start_date: date
    coverage_end_date: date

    @field_validator("sum_insured_inr", "insured_area_hectares", "premium_paid_inr")
    def validate_positive_values(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Numeric values must be greater than zero.")
        return v

class PolicyResponse(PolicyCreate):
    id: str
    farmer_id_code: Optional[str] = None
    status: str = "Active"
    created_at: Optional[datetime] = None

# ==========================================
# Document & Evidence Schemas (Module 7)
# ==========================================

class DocumentResponse(BaseModel):
    id: str
    file_name: str
    document_type: str
    file_size_bytes: int
    mime_type: str
    download_url: str
    verification_status: str # Verified, Pending_Review, Rejected
    uploaded_at: datetime
    associated_entity_type: str # farmer, farm, claim
    associated_entity_id: str

# ==========================================
# Claim Status & Assessment Workflow (Module 6 & 11)
# ==========================================

class ClaimStatusUpdate(BaseModel):
    status: Literal["Pending", "Under_Review", "Verified", "Flagged_Investigation", "Approved", "Rejected", "Settled"]
    remarks: Optional[str] = None

class DocumentRequestPayload(BaseModel):
    document_types: List[str]
    deadline_date: Optional[date] = None
    instructions: str

class InvestigationFlagPayload(BaseModel):
    reason: str
    severity: Literal["Low", "Medium", "High", "Critical"] = "Medium"
    assigned_officer: Optional[str] = None

class NotificationResponse(BaseModel):
    id: str
    recipient_role: str
    recipient_id: str
    title: str
    message: str
    category: str # claim_status, new_claim, investigation_flag, document_request
    created_at: datetime
    read: bool = False
