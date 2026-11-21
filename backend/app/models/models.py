import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, Numeric, Integer, Date, DateTime, 
    ForeignKey, Text, JSON, Uuid
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(30), nullable=False, default="farmer") # farmer, insurance_officer, admin
    tenant_id = Column(String(50), nullable=False, default="AIC_INDIA") # Multi-tenant isolation
    status = Column(String(30), nullable=False, default="active") # active, pending_verification, suspended, locked
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    farmer_profile = relationship("Farmer", back_populates="user", uselist=False)

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    farmer_id_code = Column(String(50), unique=True, nullable=False)
    aadhar_hash = Column(String(64), nullable=True)
    village = Column(String(100), nullable=False)
    sub_district_tehsil = Column(String(100), nullable=True)
    district = Column(String(100), nullable=False)
    state = Column(String(100), default="Madhya Pradesh")
    pincode = Column(String(10), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="farmer_profile")
    farms = relationship("Farm", back_populates="farmer")
    policies = relationship("Policy", back_populates="farmer")
    claims = relationship("Claim", back_populates="farmer")

class Farm(Base):
    __tablename__ = "farms"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    farmer_id = Column(Uuid, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    farm_name = Column(String(100), nullable=False)
    khasra_number = Column(String(50), nullable=False)
    declared_area_hectares = Column(Numeric(8, 4), nullable=False)
    geodesic_area_hectares = Column(Numeric(8, 4), nullable=True)
    area_variance_percent = Column(Numeric(5, 2), nullable=True)
    current_crop = Column(String(50), nullable=False)
    season = Column(String(20), nullable=False)
    soil_type = Column(String(50), nullable=True)
    boundary_geojson = Column(JSON, nullable=False)
    verification_status = Column(String(30), default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="farms")
    claims = relationship("Claim", back_populates="farm")
    satellite_records = relationship("SatelliteData", back_populates="farm")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    farmer_id = Column(Uuid, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    policy_number = Column(String(50), unique=True, nullable=False)
    scheme_name = Column(String(100), nullable=False)
    sum_insured_inr = Column(Numeric(12, 2), nullable=False)
    premium_paid_inr = Column(Numeric(10, 2), nullable=False)
    coverage_start_date = Column(Date, nullable=False)
    coverage_end_date = Column(Date, nullable=False)
    status = Column(String(30), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="policies")
    claims = relationship("Claim", back_populates="policy")

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    claim_number = Column(String(50), unique=True, nullable=False, index=True)
    farmer_id = Column(Uuid, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    farm_id = Column(Uuid, ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    policy_id = Column(Uuid, ForeignKey("policies.id", ondelete="CASCADE"), nullable=False)
    loss_cause = Column(String(100), nullable=False)
    claimed_loss_percentage = Column(Numeric(5, 2), nullable=False)
    claimed_amount_inr = Column(Numeric(12, 2), nullable=False)
    incident_date = Column(Date, nullable=False)
    status = Column(String(30), default="Pending", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="claims")
    farm = relationship("Farm", back_populates="claims")
    policy = relationship("Policy", back_populates="claims")
    events = relationship("ClaimEvent", back_populates="claim")
    documents = relationship("Document", back_populates="claim")
    yield_prediction = relationship("YieldPrediction", back_populates="claim", uselist=False)
    verification_results = relationship("VerificationResult", back_populates="claim")
    assessment = relationship("Assessment", back_populates="claim", uselist=False)

class ClaimEvent(Base):
    __tablename__ = "claim_events"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    claim_id = Column(Uuid, ForeignKey("claims.id", ondelete="CASCADE"), nullable=False)
    stage = Column(String(50), nullable=False)
    event_timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    actor_user_id = Column(Uuid, ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True)
    sla_status = Column(String(30), default="On Time")
    created_at = Column(DateTime, default=datetime.utcnow)

    claim = relationship("Claim", back_populates="events")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    claim_id = Column(Uuid, ForeignKey("claims.id", ondelete="CASCADE"), nullable=True)
    farm_id = Column(Uuid, ForeignKey("farms.id", ondelete="CASCADE"), nullable=True)
    document_type = Column(String(50), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, nullable=True)
    mime_type = Column(String(50), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    claim = relationship("Claim", back_populates="documents")

class SatelliteData(Base):
    __tablename__ = "satellite_data"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    farm_id = Column(Uuid, ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    observation_date = Column(Date, nullable=False)
    satellite_mission = Column(String(50), default="Sentinel-2 L2A")
    cloud_coverage_percent = Column(Numeric(5, 2), nullable=True)
    mean_ndvi = Column(Numeric(6, 4), nullable=False)
    min_ndvi = Column(Numeric(6, 4), nullable=True)
    max_ndvi = Column(Numeric(6, 4), nullable=True)
    band_b04_red = Column(Numeric(8, 4), nullable=True)
    band_b08_nir = Column(Numeric(8, 4), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    farm = relationship("Farm", back_populates="satellite_records")

class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    district = Column(String(100), nullable=False)
    record_date = Column(Date, nullable=False)
    rainfall_mm = Column(Numeric(6, 2), nullable=False)
    temperature_max_c = Column(Numeric(4, 2), nullable=True)
    temperature_min_c = Column(Numeric(4, 2), nullable=True)
    soil_moisture_index = Column(Numeric(5, 3), nullable=True)
    anomaly_flag = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class YieldPrediction(Base):
    __tablename__ = "yield_predictions"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    claim_id = Column(Uuid, ForeignKey("claims.id", ondelete="CASCADE"), nullable=False)
    crop_type = Column(String(50), nullable=False)
    historical_benchmark_yield_kg_ha = Column(Numeric(8, 2), nullable=True)
    reported_yield_kg_ha = Column(Numeric(8, 2), nullable=True)
    estimated_yield_kg_ha = Column(Numeric(8, 2), nullable=True)
    loss_severity_percent = Column(Numeric(5, 2), nullable=True)
    model_confidence_score = Column(Numeric(4, 2), nullable=True)
    is_experimental = Column(Boolean, default=True)
    model_version = Column(String(50), default="xgb-crop-v1.4")
    created_at = Column(DateTime, default=datetime.utcnow)

    claim = relationship("Claim", back_populates="yield_prediction")

class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    claim_id = Column(Uuid, ForeignKey("claims.id", ondelete="CASCADE"), nullable=False)
    engine_name = Column(String(50), nullable=False)
    verdict = Column(String(50), nullable=False)
    score = Column(Numeric(5, 2), nullable=True)
    details_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    claim = relationship("Claim", back_populates="verification_results")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    claim_id = Column(Uuid, ForeignKey("claims.id", ondelete="CASCADE"), unique=True, nullable=False)
    assessor_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    decision = Column(String(50), nullable=False)
    approved_amount_inr = Column(Numeric(12, 2), nullable=True)
    remarks = Column(Text, nullable=False)
    decision_date = Column(DateTime, default=datetime.utcnow)

    claim = relationship("Claim", back_populates="assessment")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(100), nullable=False)
    ip_address = Column(String(45), nullable=True)
    payload = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
