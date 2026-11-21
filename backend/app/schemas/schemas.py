from typing import Optional, List, Dict, Any
from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field

# User & Auth
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: str = "farmer"

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
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    email: str
    password: str

# Farmer
class FarmerProfile(BaseModel):
    farmer_id_code: str
    village: str
    sub_district_tehsil: Optional[str] = None
    district: str
    state: str = "Madhya Pradesh"
    pincode: Optional[str] = None

# Farm
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

# Claim
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
