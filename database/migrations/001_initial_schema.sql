-- =============================================================================
-- AgriVerify AI – Initial Database Schema
-- Migration: 001_initial_schema.sql
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(30) NOT NULL CHECK (role IN ('farmer', 'insurance_officer', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FARMERS
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farmer_id_code VARCHAR(50) UNIQUE NOT NULL,
    aadhar_hash VARCHAR(64),
    village VARCHAR(100) NOT NULL,
    sub_district_tehsil VARCHAR(100),
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Madhya Pradesh',
    pincode VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FARMS (Geospatial with PostGIS)
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    farm_name VARCHAR(100) NOT NULL,
    khasra_number VARCHAR(50) NOT NULL,
    declared_area_hectares NUMERIC(8, 4) NOT NULL,
    geodesic_area_hectares NUMERIC(8, 4),
    area_variance_percent NUMERIC(5, 2),
    current_crop VARCHAR(50) NOT NULL,
    season VARCHAR(20) NOT NULL,
    soil_type VARCHAR(50),
    boundary_geojson JSONB NOT NULL,
    geom GEOMETRY(Polygon, 4326),
    verification_status VARCHAR(30) DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'Verified', 'Mismatch', 'Insufficient Data', 'Manual Review')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_farms_geom ON farms USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_farms_district ON farms(farmer_id);

-- 4. POLICIES
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    scheme_name VARCHAR(100) NOT NULL,
    sum_insured_inr NUMERIC(12, 2) NOT NULL,
    premium_paid_inr NUMERIC(10, 2) NOT NULL,
    coverage_start_date DATE NOT NULL,
    coverage_end_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Active', 'Claimed', 'Expired', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLAIMS
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    loss_cause VARCHAR(100) NOT NULL,
    claimed_loss_percentage NUMERIC(5, 2) NOT NULL,
    claimed_amount_inr NUMERIC(12, 2) NOT NULL,
    incident_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Under Verification', 'Verified', 'Flagged', 'Delayed', 'Approved', 'Rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

-- 6. CLAIM EVENTS (Timeline & Audit)
CREATE TABLE IF NOT EXISTS claim_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    stage VARCHAR(50) NOT NULL,
    event_timestamp TIMESTAMPTZ NOT NULL,
    actor_user_id UUID REFERENCES users(id),
    notes TEXT,
    sla_status VARCHAR(30) DEFAULT 'On Time' CHECK (sla_status IN ('On Time', 'Delayed', 'Critical Delay')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DOCUMENTS
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('Khasra_Deed', 'Sowing_Certificate', 'Field_Photo', 'Soil_Report', 'Assessment_Dossier')),
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes INTEGER,
    mime_type VARCHAR(50),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SATELLITE DATA (Sentinel-2 NDVI observations)
CREATE TABLE IF NOT EXISTS satellite_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    observation_date DATE NOT NULL,
    satellite_mission VARCHAR(50) DEFAULT 'Sentinel-2 L2A',
    cloud_coverage_percent NUMERIC(5, 2),
    mean_ndvi NUMERIC(6, 4) NOT NULL,
    min_ndvi NUMERIC(6, 4),
    max_ndvi NUMERIC(6, 4),
    band_b04_red NUMERIC(8, 4),
    band_b08_nir NUMERIC(8, 4),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. WEATHER DATA
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district VARCHAR(100) NOT NULL,
    record_date DATE NOT NULL,
    rainfall_mm NUMERIC(6, 2) NOT NULL,
    temperature_max_c NUMERIC(4, 2),
    temperature_min_c NUMERIC(4, 2),
    soil_moisture_index NUMERIC(5, 3),
    anomaly_flag BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. YIELD PREDICTIONS (Engine 2 Outputs)
CREATE TABLE IF NOT EXISTS yield_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    crop_type VARCHAR(50) NOT NULL,
    historical_benchmark_yield_kg_ha NUMERIC(8, 2),
    reported_yield_kg_ha NUMERIC(8, 2),
    estimated_yield_kg_ha NUMERIC(8, 2),
    loss_severity_percent NUMERIC(5, 2),
    model_confidence_score NUMERIC(4, 2),
    is_experimental BOOLEAN DEFAULT TRUE,
    model_version VARCHAR(50) DEFAULT 'xgb-crop-v1.4',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. VERIFICATION RESULTS (Aggregated from all 3 Engines)
CREATE TABLE IF NOT EXISTS verification_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    engine_name VARCHAR(50) NOT NULL CHECK (engine_name IN ('farm_verification', 'yield_verification', 'process_audit')),
    verdict VARCHAR(50) NOT NULL,
    score NUMERIC(5, 2),
    details_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ASSESSMENTS (Official Assessor Decision)
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID UNIQUE NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    assessor_id UUID NOT NULL REFERENCES users(id),
    decision VARCHAR(50) NOT NULL CHECK (decision IN ('Approved', 'Rejected', 'Flagged_Investigation', 'More_Info_Required')),
    approved_amount_inr NUMERIC(12, 2),
    remarks TEXT NOT NULL,
    decision_date TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
