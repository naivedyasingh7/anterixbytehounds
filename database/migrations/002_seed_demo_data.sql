-- =============================================================================
-- AgriVerify AI – Seed Data for MVP Demonstrations
-- Migration: 002_seed_demo_data.sql
-- =============================================================================

-- Clean up existing demo data
DELETE FROM audit_logs;
DELETE FROM assessments;
DELETE FROM verification_results;
DELETE FROM yield_predictions;
DELETE FROM weather_data;
DELETE FROM satellite_data;
DELETE FROM documents;
DELETE FROM claim_events;
DELETE FROM claims;
DELETE FROM policies;
DELETE FROM farms;
DELETE FROM farmers;
DELETE FROM users;

-- 1. Insert Users (Password: 'Pass1234' hashed with bcrypt or demo placeholder)
INSERT INTO users (id, email, hashed_password, full_name, phone, role) VALUES
('11111111-1111-1111-1111-111111111111', 'officer.sharma@agriverify.in', '$2b$12$e6mZtQ25c0P1Xq7HlV5lP.7F1s2K3J4H5G6F7E8D9C0B1A2', 'R. K. Sharma', '+91 98260 11223', 'insurance_officer'),
('22222222-2222-2222-2222-222222222222', 'farmer.rajesh@agriverify.in', '$2b$12$e6mZtQ25c0P1Xq7HlV5lP.7F1s2K3J4H5G6F7E8D9C0B1A2', 'Rajesh Kumar Patel', '+91 94250 88776', 'farmer'),
('33333333-3333-3333-3333-333333333333', 'farmer.sunita@agriverify.in', '$2b$12$e6mZtQ25c0P1Xq7HlV5lP.7F1s2K3J4H5G6F7E8D9C0B1A2', 'Sunita Bai Chouhan', '+91 97555 44332', 'farmer'),
('44444444-4444-4444-4444-444444444444', 'farmer.mohan@agriverify.in', '$2b$12$e6mZtQ25c0P1Xq7HlV5lP.7F1s2K3J4H5G6F7E8D9C0B1A2', 'Mohan Lal Verma', '+91 91110 99887', 'farmer');

-- 2. Insert Farmers
INSERT INTO farmers (id, user_id, farmer_id_code, aadhar_hash, village, sub_district_tehsil, district, state, pincode) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'FAR-MP-BHP-001', 'e3b0c44298fc1c149afbf4c8996fb924', 'Berasia', 'Huzur', 'Bhopal', 'Madhya Pradesh', '462038'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'FAR-MP-SEH-002', 'ca978112ca1bbdcafac231b39a23dc4b', 'Ashta', 'Ashta', 'Sehore', 'Madhya Pradesh', '466116'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 'FAR-MP-RSN-003', '4e07408562bedb8b60ce05c1decfe3ad', 'Gairatganj', 'Begamganj', 'Raisen', 'Madhya Pradesh', '464884');

-- 3. Insert Farms (With realistic polygons in MP)
-- Farm 1: Bhopal (Rajesh) - Declared 2.5 ha, Mapped 2.46 ha (Verified)
INSERT INTO farms (id, farmer_id, farm_name, khasra_number, declared_area_hectares, geodesic_area_hectares, area_variance_percent, current_crop, season, soil_type, boundary_geojson, verification_status) VALUES
('fa000001-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Patel Khasra 48/2 North Plot', '48/2', 2.5000, 2.4620, 1.52, 'Wheat', 'Rabi', 'Deep Black Cotton Soil', 
 '{"type": "Polygon", "coordinates": [[[77.4128, 23.2599], [77.4155, 23.2605], [77.4162, 23.2578], [77.4132, 23.2572], [77.4128, 23.2599]]]}', 'Verified'),

-- Farm 2: Sehore (Sunita) - Declared 3.8 ha, Mapped 3.75 ha (Verified)
('fa000002-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Chouhan Riverbank Parcel', '112/1', 3.8000, 3.7510, 1.29, 'Soybean', 'Kharif', 'Medium Black Soil',
 '{"type": "Polygon", "coordinates": [[[77.0850, 23.1950], [77.0885, 23.1960], [77.0890, 23.1925], [77.0855, 23.1918], [77.0850, 23.1950]]]}', 'Verified'),

-- Farm 3: Raisen (Mohan) - Declared 4.2 ha, Mapped 2.30 ha (Mismatch - High Discrepancy!)
('fa000003-0000-0000-0000-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Verma Hillside Terrace', '95/4', 4.2000, 2.3040, 45.14, 'Paddy', 'Kharif', 'Red and Yellow Alluvial Soil',
 '{"type": "Polygon", "coordinates": [[[77.7810, 23.3320], [77.7835, 23.3325], [77.7840, 23.3300], [77.7815, 23.3295], [77.7810, 23.3320]]]}', 'Mismatch');

-- 4. Insert Policies
INSERT INTO policies (id, farmer_id, policy_number, scheme_name, sum_insured_inr, premium_paid_inr, coverage_start_date, coverage_end_date, status) VALUES
('pol00001-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'POL-PMFBY-BHP-2026-88', 'PM Fasal Bima Yojana - Rabi Wheat', 175000.00, 3500.00, '2026-10-15', '2027-04-15', 'Active'),
('pol00002-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'POL-PMFBY-SEH-2026-14', 'PM Fasal Bima Yojana - Kharif Soybean', 228000.00, 4560.00, '2026-06-01', '2026-11-30', 'Claimed'),
('pol00003-0000-0000-0000-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'POL-PMFBY-RSN-2026-92', 'PM Fasal Bima Yojana - Kharif Paddy', 250000.00, 5000.00, '2026-06-15', '2026-12-15', 'Active');

-- 5. Insert Claims (CLM001, CLM002, CLM003 matching problem prompt)
INSERT INTO claims (id, claim_number, farmer_id, farm_id, policy_id, loss_cause, claimed_loss_percentage, claimed_amount_inr, incident_date, status) VALUES
('c0000001-0000-0000-0000-000000000001', 'CLM001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'fa000001-0000-0000-0000-000000000001', 'pol00001-0000-0000-0000-000000000001', 'Drought & Prolonged Dry Spell', 65.00, 113750.00, '2026-11-05', 'Pending'),
('c0000002-0000-0000-0000-000000000002', 'CLM002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'fa000002-0000-0000-0000-000000000002', 'pol00002-0000-0000-0000-000000000002', 'Unseasonal Excessive Rain & Inundation', 80.00, 182400.00, '2026-10-18', 'Verified'),
('c0000003-0000-0000-0000-000000000003', 'CLM003', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'fa000003-0000-0000-0000-000000000003', 'pol00003-0000-0000-0000-000000000003', 'Pest Blight & False Smut', 70.00, 175000.00, '2026-10-25', 'Flagged');

-- 6. Insert Claim Events (Timeline for Process Audit)
INSERT INTO claim_events (claim_id, stage, event_timestamp, notes, sla_status) VALUES
('c0000001-0000-0000-0000-000000000001', 'Submission', '2026-11-06 10:30:00+05:30', 'Claim submitted via Farmer Mobile Web Portal', 'On Time'),
('c0000001-0000-0000-0000-000000000001', 'Document Verification', '2026-11-08 14:15:00+05:30', 'Khasra deed and bank passbook verified against land records', 'On Time'),
('c0000001-0000-0000-0000-000000000001', 'Engine 1: Farm Check', '2026-11-09 11:00:00+05:30', 'Geodesic area matched within 1.5% variance', 'On Time'),
('c0000001-0000-0000-0000-000000000001', 'Engine 2: Yield Analysis', '2026-11-10 16:45:00+05:30', 'NDVI dip observed during late tillering; drought signature verified', 'On Time'),

('c0000003-0000-0000-0000-000000000003', 'Submission', '2026-10-26 09:00:00+05:30', 'Claim submitted by Raisen farmer', 'On Time'),
('c0000003-0000-0000-0000-000000000003', 'Engine 1: Farm Check', '2026-10-27 15:30:00+05:30', 'CRITICAL MISMATCH: Declared 4.2 ha vs Mapped 2.30 ha (45% inflation)', 'Delayed'),
('c0000003-0000-0000-0000-000000000003', 'Audit Flag', '2026-10-29 11:00:00+05:30', 'Claim halted. Sowing certificate missing. Flagged for physical surveyor inspection.', 'Critical Delay');

-- 7. Insert Documents
INSERT INTO documents (claim_id, farm_id, document_type, file_name, file_url, file_size_bytes, mime_type) VALUES
('c0000001-0000-0000-0000-000000000001', 'fa000001-0000-0000-0000-000000000001', 'Khasra_Deed', 'Khasra_Record_Bhopal_48_2.pdf', '/docs/khasra_48_2.pdf', 1048576, 'application/pdf'),
('c0000001-0000-0000-0000-000000000001', 'fa000001-0000-0000-0000-000000000001', 'Field_Photo', 'Crop_Damage_Dry_Wilted_Field.jpg', '/docs/photo_dry_field.jpg', 2450000, 'image/jpeg'),
('c0000001-0000-0000-0000-000000000001', 'fa000001-0000-0000-0000-000000000001', 'Sowing_Certificate', 'Panchayat_Sowing_Receipt_2026.pdf', '/docs/sowing_cert.pdf', 524288, 'application/pdf');

-- 8. Insert Satellite Sentinel-2 Observations (Weekly NDVI curve for Farm 1)
INSERT INTO satellite_data (farm_id, observation_date, mean_ndvi, min_ndvi, max_ndvi, cloud_coverage_percent) VALUES
('fa000001-0000-0000-0000-000000000001', '2026-09-01', 0.28, 0.22, 0.35, 4.2),
('fa000001-0000-0000-0000-000000000001', '2026-09-08', 0.39, 0.31, 0.45, 2.1),
('fa000001-0000-0000-0000-000000000001', '2026-09-15', 0.54, 0.44, 0.62, 0.0),
('fa000001-0000-0000-0000-000000000001', '2026-09-22', 0.68, 0.58, 0.74, 5.0),
('fa000001-0000-0000-0000-000000000001', '2026-09-29', 0.62, 0.51, 0.70, 1.5),
('fa000001-0000-0000-0000-000000000001', '2026-10-06', 0.45, 0.36, 0.52, 0.8), -- Drought stress dip begins!
('fa000001-0000-0000-0000-000000000001', '2026-10-13', 0.34, 0.26, 0.41, 0.0),
('fa000001-0000-0000-0000-000000000001', '2026-10-20', 0.27, 0.20, 0.32, 3.1),
('fa000001-0000-0000-0000-000000000001', '2026-10-27', 0.22, 0.18, 0.28, 0.0);

-- 9. Insert Weather Data (Bhopal region historical during crop cycle)
INSERT INTO weather_data (district, record_date, rainfall_mm, temperature_max_c, temperature_min_c, soil_moisture_index, anomaly_flag) VALUES
('Bhopal', '2026-09-01', 35.4, 30.5, 23.2, 0.68, FALSE),
('Bhopal', '2026-09-15', 22.1, 31.0, 22.8, 0.60, FALSE),
('Bhopal', '2026-09-30', 0.0, 34.2, 21.0, 0.38, FALSE),
('Bhopal', '2026-10-10', 0.0, 36.8, 20.5, 0.18, TRUE), -- Severe dry spell & heat spike!
('Bhopal', '2026-10-20', 0.0, 35.5, 19.8, 0.12, TRUE),
('Bhopal', '2026-10-30', 0.0, 33.0, 17.5, 0.10, TRUE);

-- 10. Insert Yield Predictions (Engine 2)
INSERT INTO yield_predictions (claim_id, crop_type, historical_benchmark_yield_kg_ha, reported_yield_kg_ha, estimated_yield_kg_ha, loss_severity_percent, model_confidence_score, is_experimental) VALUES
('c0000001-0000-0000-0000-000000000001', 'Wheat', 3800.00, 1300.00, 1420.00, 62.63, 0.89, TRUE),
('c0000002-0000-0000-0000-000000000002', 'Soybean', 2100.00, 420.00, 480.00, 77.14, 0.92, TRUE),
('c0000003-0000-0000-0000-000000000003', 'Paddy', 3400.00, 1020.00, 2900.00, 14.70, 0.65, TRUE); -- Predicted healthy, reported huge loss (Suspicious!)

-- 11. Insert Verification Results (Outputs from 3 Engines)
INSERT INTO verification_results (claim_id, engine_name, verdict, score, details_json) VALUES
('c0000001-0000-0000-0000-000000000001', 'farm_verification', 'Verified', 98.48, '{"declared_ha": 2.5, "mapped_ha": 2.462, "variance_pct": 1.52, "boundary_status": "Valid", "khasra_match": true}'),
('c0000001-0000-0000-0000-000000000001', 'yield_verification', 'Severe Stress Confirmed', 89.00, '{"ndvi_drop_pct": 67.6, "dry_spell_days": 32, "reported_loss_pct": 65.0, "estimated_loss_pct": 62.63, "congruence": "High"}'),
('c0000001-0000-0000-0000-000000000001', 'process_audit', 'Compliant', 95.00, '{"turnaround_days": 4, "mandatory_docs_present": 3, "anomalies_detected": 0}'),

('c0000003-0000-0000-0000-000000000003', 'farm_verification', 'Mismatch', 54.86, '{"declared_ha": 4.2, "mapped_ha": 2.304, "variance_pct": 45.14, "boundary_status": "Area Inflation Flagged", "khasra_match": false}'),
('c0000003-0000-0000-0000-000000000003', 'yield_verification', 'Discrepancy Detected', 65.00, '{"ndvi_health": "Moderate", "weather_support": "Inconclusive", "reported_loss": 70.0, "estimated_loss": 14.7, "congruence": "Contradictory"}'),
('c0000003-0000-0000-0000-000000000003', 'process_audit', 'Delayed & Incomplete', 40.00, '{"sla_status": "Breached", "missing_documents": ["Sowing_Certificate"], "anomalies_detected": 2}');

-- 12. Insert Audit Logs
INSERT INTO audit_logs (action, entity_type, entity_id, payload) VALUES
('DATABASE_INITIALIZED', 'SYSTEM', 'SYS-001', '{"version": "1.0.0", "seeded_claims": 3}'),
('CLAIM_SUBMITTED', 'CLAIM', 'CLM001', '{"farmer": "Rajesh Kumar Patel", "amount": 113750}'),
('CLAIM_FLAGGED', 'CLAIM', 'CLM003', '{"reason": "Area mismatch > 40% and yield discrepancy"}');
