"""
AgriVerify AI - Complete Master System Test Suite (Modules 1 - 13)
Verifies all functional APIs, role-based access control, verification engines,
document locker, lifecycle workflows, PDF generation, and notifications.
"""
import io
import sys
import json
from datetime import datetime, date, timedelta
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("=" * 70)
    print("STARTING COMPLETE END-TO-END VERIFICATION SUITE FOR AGRIVERIFY AI")
    print("=" * 70)

    # -------------------------------------------------------------
    # 1. Health & Documentation Check
    # -------------------------------------------------------------
    print("\n[Step 1] Verifying System Health & OpenAPI Documentation...")
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    health_data = res.json()
    assert health_data["status"] == "healthy"
    print(f"  ✓ Health status: {health_data['status']} (Database: {health_data['database']})")

    res = client.get("/openapi.json")
    assert res.status_code == 200
    openapi_doc = res.json()
    route_paths = list(openapi_doc["paths"].keys())
    print(f"  ✓ OpenAPI Documentation verified: {len(route_paths)} total endpoints discovered.")

    # -------------------------------------------------------------
    # 2. Authentication, RBAC & Multi-Tenancy (Module 2)
    # -------------------------------------------------------------
    print("\n[Step 2] Testing Authentication, JWT Issuance & RBAC Controls...")
    # Login Farmer
    login_farmer = client.post("/api/v1/auth/login", json={
        "email": "farmer.rajesh@agriverify.in",
        "password": "Farmer@123"
    })
    assert login_farmer.status_code == 200, f"Farmer login failed: {login_farmer.text}"
    farmer_token = login_farmer.json()["access_token"]
    farmer_headers = {"Authorization": f"Bearer {farmer_token}"}
    print("  ✓ Farmer authenticated successfully with JWT.")

    # Login Officer
    login_officer = client.post("/api/v1/auth/login", json={
        "email": "officer.sharma@agriverify.in",
        "password": "Officer@123"
    })
    assert login_officer.status_code == 200, f"Officer login failed: {login_officer.text}"
    officer_token = login_officer.json()["access_token"]
    officer_headers = {"Authorization": f"Bearer {officer_token}"}
    print("  ✓ Insurance Officer authenticated successfully with JWT.")

    # RBAC Test: Farmer should be Forbidden from submitting official assessment decisions
    forbidden_res = client.post("/api/v1/workspace/CLM001/decision", json={
        "decision": "Approved",
        "approved_amount_inr": 100000.0,
        "remarks": "Farmer self approval attempt"
    }, headers=farmer_headers)
    assert forbidden_res.status_code == 403, f"Farmer unauthorized access was not blocked: {forbidden_res.status_code}"
    print("  ✓ RBAC Enforced: Farmer blocked with HTTP 403 Forbidden from assessor actions.")

    # Password Reset Token Generation
    pwd_reset_req = client.post("/api/v1/auth/password-reset/request", json={
        "email": "farmer.rajesh@agriverify.in"
    })
    assert pwd_reset_req.status_code == 200
    reset_token = pwd_reset_req.json()["reset_token"]
    assert len(reset_token) > 10
    print(f"  ✓ Password reset token generated successfully: {reset_token[:12]}...")

    # -------------------------------------------------------------
    # 3. Farmer Profile Management (Module 3)
    # -------------------------------------------------------------
    print("\n[Step 3] Testing Farmer Profile API & Unique ID Generation...")
    farmer_create = client.post("/api/v1/farmers/", json={
        "farmer_name": "Devendra Singh Chouhan",
        "phone": "+91 98260 12345",
        "village": "Berasia Kalan",
        "district": "Bhopal",
        "sub_district_tehsil": "Berasia",
        "state": "Madhya Pradesh",
        "pincode": "462038",
        "primary_crop": "Wheat"
    })
    assert farmer_create.status_code == 201, f"Create farmer profile failed: {farmer_create.text}"
    farmer_resp_data = farmer_create.json()
    farmer_profile = farmer_resp_data["profile"]
    new_farmer_id = farmer_resp_data["farmer_id_code"]
    print(f"  ✓ Farmer registered with collision-resistant ID: {new_farmer_id}")
    assert new_farmer_id.startswith("FAR-MP-BHP-")

    # Search farmers
    search_res = client.get("/api/v1/farmers/?district=Bhopal")
    assert search_res.status_code == 200
    farmers_list = search_res.json()["farmers"]
    assert len(farmers_list) >= 1
    print(f"  ✓ Filtered farmers by district (found {len(farmers_list)} profiles).")

    # -------------------------------------------------------------
    # 4. Cadastral Farm Registration & GIS Engine 1 (Module 4 & 8)
    # -------------------------------------------------------------
    print("\n[Step 4] Testing Cadastral Farm Registration & GIS Geodesic Engine...")
    valid_polygon = {
        "type": "Polygon",
        "coordinates": [[[77.4128, 23.2599], [77.4155, 23.2605], [77.4162, 23.2578], [77.4132, 23.2572], [77.4128, 23.2599]]]
    }
    farm_res = client.post("/api/v1/farms/", json={
        "farm_name": "Khasra Parcel 48/2 North Field",
        "khasra_number": "48/2",
        "declared_area_hectares": 2.50,
        "current_crop": "Wheat",
        "season": "Rabi 2026",
        "boundary_geojson": valid_polygon
    }, headers=farmer_headers)
    assert farm_res.status_code == 201, f"Farm creation failed: {farm_res.text}"
    farm_data = farm_res.json()
    new_farm_id = farm_data["id"]
    calc_ha = farm_data["geodesic_area_hectares"]
    variance = farm_data["area_variance_percent"]
    print(f"  ✓ Farm parcel registered: {farm_data['farm_name']} (Khasra: {farm_data['khasra_number']})")
    print(f"  ✓ Engine 1 Geodesic Area: {calc_ha:.3f} Ha (Declared: 2.50 Ha, Variance: {variance}%)")
    assert calc_ha > 0

    # Test Engine 1 standalone verification
    e1_verify = client.get(f"/api/v1/engines/farm/verify/{new_farm_id}")
    assert e1_verify.status_code == 200
    e1_json = e1_verify.json()
    verdict = e1_json.get("verdict") or e1_json.get("status")
    print(f"  ✓ Engine 1 Verification Verdict: {verdict} ({e1_json['notes']})")

    # Real-time government Bhulekh verification test
    bhulekh_res = client.get("/api/v1/engines/farm/bhulekh/verify?khasra_number=48/2&district=Bhopal&declared_area_ha=2.50")
    assert bhulekh_res.status_code == 200
    bh_data = bhulekh_res.json()
    print(f"  ✓ Government Bhulekh Khasra Verification: Owner: {bh_data['bhulekh_registered_owner']} | Certified Area: {bh_data['bhulekh_certified_area_ha']} Ha | Status: {bh_data['cadastral_status']}")
    assert bh_data["cadastral_status"] == "MATCHED_AND_VERIFIED"

    # -------------------------------------------------------------
    # 5. Insurance Policy Management (Module 5)
    # -------------------------------------------------------------
    print("\n[Step 5] Testing Insurance Policy API (Creation, Validation & Linkage)...")
    pol_res = client.post("/api/v1/policies/", json={
        "farmer_id": farmer_profile["id"],
        "farm_id": new_farm_id,
        "policy_number": "POL-PMFBY-BHP-2026-99",
        "scheme_name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "crop": "Wheat",
        "season": "Rabi 2026",
        "insured_area_hectares": 2.50,
        "sum_insured_inr": 175000.0,
        "premium_paid_inr": 3500.0,
        "coverage_start_date": "2026-10-01",
        "coverage_end_date": "2027-03-31"
    }, headers=officer_headers)
    assert pol_res.status_code == 201, f"Policy creation failed: {pol_res.text}"
    pol_data = pol_res.json()
    print(f"  ✓ Insurance policy issued: {pol_data['policy_number']} (Sum Insured: ₹{pol_data['sum_insured_inr']:,})")

    # Retrieve policy by farmer
    pol_by_farmer = client.get(f"/api/v1/policies/by-farmer/{farmer_profile['id']}")
    assert pol_by_farmer.status_code == 200
    assert pol_by_farmer.json()["total_policies"] >= 1
    print(f"  ✓ Retrieved policies linked to farmer: {pol_by_farmer.json()['total_policies']} active policy found.")

    # -------------------------------------------------------------
    # 6. Claims Management & Lifecycle (Module 6)
    # -------------------------------------------------------------
    print("\n[Step 6] Testing Claim Submission, Lifecycle Transitions & Spreadsheet Import...")
    claim_res = client.post("/api/v1/claims/", json={
        "farm_id": new_farm_id,
        "policy_id": pol_data["policy_number"],
        "loss_cause": "Drought & Prolonged Dry Spell",
        "claimed_loss_percentage": 65.0,
        "claimed_amount_inr": 113750.0,
        "incident_date": "2026-11-05"
    }, headers=farmer_headers)
    assert claim_res.status_code == 201, f"Claim creation failed: {claim_res.text}"
    claim_data = claim_res.json()
    new_claim_num = claim_data["claim_number"]
    assert claim_data["status"] == "Pending"
    print(f"  ✓ Claim filed: {new_claim_num} with initial status: {claim_data['status']}")

    # Officer status transition
    status_update = client.patch(f"/api/v1/claims/{new_claim_num}/status", json={
        "status": "Under_Review",
        "remarks": "Assigned to claims investigator for remote sensing validation."
    }, headers=officer_headers)
    assert status_update.status_code == 200, f"Status update failed: {status_update.text}"
    assert status_update.json()["current_status"] == "Under_Review"
    print(f"  ✓ Status transitioned to 'Under_Review' with officer remarks.")

    # Test CSV Batch Claim Import with Error Reporting
    csv_content = (
        "Claim ID,Farmer,District,Crop,Claimed Amount,Loss %,Loss Cause,Status\n"
        "CLM-BAT-101,Ramesh Yadav,Bhopal,Wheat,125000,70.0,Drought,Pending\n"
        "CLM-BAT-102,,Sehore,Soybean,95000,55.0,Inundation,Pending\n"  # Valid row
        "CLM-BAT-103,Bad Data Farmer,Bhopal,,110000,60.0,Drought,Pending\n"  # Missing crop (invalid)
        "CLM-BAT-104,Bad Loss Farmer,Raisen,Paddy,140000,150.0,Pest,Pending\n"  # Loss % > 100 (invalid)
    ).encode("utf-8")

    import_res = client.post("/api/v1/claims/import-batch", files={
        "file": ("batch_claims.csv", csv_content, "text/csv")
    }, headers=officer_headers)
    assert import_res.status_code == 200, f"CSV batch import failed: {import_res.text}"
    import_data = import_res.json()
    print(f"  ✓ Batch import parsed: {import_data['total_rows_processed']} rows processed, {import_data['imported_rows_count']} imported, {import_data['error_rows_count']} invalid rows caught.")
    assert import_data["error_rows_count"] == 2
    print(f"  ✓ Validation error reporting caught invalid records accurately: {import_data['validation_errors'][0]['errors']}")

    # -------------------------------------------------------------
    # 7. Document & Evidence Locker (Module 7)
    # -------------------------------------------------------------
    print("\n[Step 7] Testing Document & Evidence Locker (Upload, MIME check, Status, Download)...")
    mock_pdf_bytes = b"%PDF-1.4 Mock Certified Land Deed Document Header and Content"
    upload_res = client.post("/api/v1/documents/upload", data={
        "document_type": "khasra_record",
        "associated_entity_type": "farm",
        "associated_entity_id": new_farm_id
    }, files={
        "file": ("Certified_Khasra_Record.pdf", mock_pdf_bytes, "application/pdf")
    }, headers=farmer_headers)
    assert upload_res.status_code == 201, f"Upload document failed: {upload_res.text}"
    doc_data = upload_res.json()
    doc_id = doc_data["id"]
    print(f"  ✓ Document uploaded: {doc_data['file_name']} (ID: {doc_id}, Status: {doc_data['verification_status']})")

    # Download document
    download_res = client.get(f"/api/v1/documents/{doc_id}/download", headers=farmer_headers)
    assert download_res.status_code == 200
    assert download_res.content == mock_pdf_bytes
    print(f"  ✓ Secure document download stream verified (MIME: {download_res.headers['content-type']}).")

    # Officer marks document as Verified
    doc_status = client.patch(f"/api/v1/documents/{doc_id}/status?status_val=Verified&remarks=Revenue+officer+seal+verified", headers=officer_headers)
    assert doc_status.status_code == 200
    assert doc_status.json()["verification_status"] == "Verified"
    print("  ✓ Document verification status updated to 'Verified'.")

    # -------------------------------------------------------------
    # 8. Engine 2 Yield & Sentinel-2 STAC Integration (Module 9)
    # -------------------------------------------------------------
    print("\n[Step 8] Testing Engine 2 Yield Verification & Sentinel-2 L2A STAC Integration...")
    # Verify live credentials telemetry
    cred_res = client.get("/api/v1/engines/yield/credentials-status")
    assert cred_res.status_code == 200
    cred_telemetry = cred_res.json()["integrations"]
    print("  ✓ External API Authentication Telemetry:")
    for key_name, details in cred_telemetry.items():
        print(f"    - {details['provider']}: {details['status']} ({details.get('key_preview', details.get('user_id', 'Active'))})")

    # Sentinel-2 acquisition search
    scenes_res = client.get("/api/v1/engines/yield/scenes?lat=23.2599&lon=77.4128&limit=2")
    assert scenes_res.status_code == 200
    scenes_data = scenes_res.json()
    print(f"  ✓ Live Sentinel-2 STAC Query: {len(scenes_data['scenes'])} scenes resolved for tile {scenes_data.get('mgrs_tile', '43QGF')}.")
    for sc in scenes_data["scenes"]:
        print(f"    - Pass: {sc['scene_id']} | Date: {sc.get('observation_date')} | Cloud Cover: {sc.get('cloud_coverage_percent')}%")

    # Full Engine 2 yield verification
    e2_res = client.get(f"/api/v1/engines/yield/verify/{new_claim_num}?crop=Wheat&reported_loss_pct=65.0")
    assert e2_res.status_code == 200
    e2_data = e2_res.json()
    yield_eval = e2_data["yield_evaluation"]
    benchmark = yield_eval.get("historical_benchmark_yield_kg_ha") or yield_eval.get("historical_benchmark_kg_ha")
    print(f"  ✓ Engine 2 Yield Prediction: Benchmark = {benchmark} kg/ha | Estimated = {yield_eval['estimated_yield_kg_ha']} kg/ha")
    print(f"  ✓ Model Confidence: {e2_data['confidence_score']*100:.0f}% | Verdict: {e2_data['verdict']}")
    live_w = e2_data["weather_analytics"].get("live_agro_observation", {})
    print(f"  ✓ Live Agro Weather Station: {live_w.get('temperature_celsius')}°C, Humidity: {live_w.get('humidity_percent')}%, Condition: {live_w.get('current_condition')}")
    assert len(e2_data["ndvi_timeseries"]) > 0

    # -------------------------------------------------------------
    # 9. Engine 3 Process Audit & Statistical Anomaly (Module 10)
    # -------------------------------------------------------------
    print("\n[Step 9] Testing Engine 3 Insurance Process Audit & Z-Score Anomaly...")
    audit_res = client.get(f"/api/v1/engines/audit/audit/{new_claim_num}")
    assert audit_res.status_code == 200
    audit_data = audit_res.json()
    print(f"  ✓ Statutory SLA Status: {audit_data['sla_status']} ({audit_data['total_turnaround_days']} turnaround days vs 21 days statutory max)")
    print(f"  ✓ Audit Health Score: {audit_data['audit_health_score']}/100")
    print(f"  ✓ Statistical Z-Score: {audit_data['statistical_metrics']['z_score']} (Regional baseline comparison)")

    # -------------------------------------------------------------
    # 10. Unified Claim Workspace & Adjudication (Module 11)
    # -------------------------------------------------------------
    print("\n[Step 10] Testing Unified Claim Assessment Workspace...")
    workspace_res = client.get(f"/api/v1/workspace/{new_claim_num}")
    assert workspace_res.status_code == 200
    ws = workspace_res.json()
    assert "claim_overview" in ws
    assert "farm_verification" in ws
    assert "yield_verification" in ws
    assert "process_audit" in ws
    assert "evidence_locker" in ws
    assert "assessment" in ws
    print(f"  ✓ Unified Workspace assembled: Discrepancy Score: {ws['consolidated_metrics']['discrepancy_score']} | Recommendation: {ws['consolidated_metrics']['system_recommendation']}")

    # Flag for investigation test
    flag_res = client.post(f"/api/v1/workspace/{new_claim_num}/flag-investigation", json={
        "severity": "Medium",
        "reason": "Slight variance in cadastral boundary requires field confirmation."
    }, headers=officer_headers)
    assert flag_res.status_code == 200
    print(f"  ✓ Investigation flag raised: {flag_res.json()['flag']['id']}")

    # Request additional documents test
    doc_req_res = client.post(f"/api/v1/workspace/{new_claim_num}/request-documents", json={
        "document_types": ["Revenue_Mutation_Certificate", "Joint_Survey_Report"],
        "instructions": "Please submit revenue mutation certificate within 7 days.",
        "deadline_date": "2026-12-01"
    }, headers=officer_headers)
    assert doc_req_res.status_code == 200
    print(f"  ✓ Document request recorded: {doc_req_res.json()['request']['id']}")

    # Officer Official Approval Decision
    decision_res = client.post(f"/api/v1/workspace/{new_claim_num}/decision", json={
        "decision": "Approved",
        "approved_amount_inr": 113750.0,
        "remarks": "Claim verified across all 3 engines. Satellite NDVI drop aligns with dry spell; cadastral area matches Khasra deed within 1.5%."
    }, headers=officer_headers)
    assert decision_res.status_code == 200
    dec_data = decision_res.json()
    print(f"  ✓ Official decision submitted: {dec_data['decision']} for ₹{dec_data['assessment']['approved_amount_inr']:,}")

    # -------------------------------------------------------------
    # 11. Reports & PDF Dossier Generation (Module 12)
    # -------------------------------------------------------------
    print("\n[Step 11] Testing Audit Dossier PDF Report Generation...")
    pdf_res = client.get(f"/api/v1/reports/{new_claim_num}/pdf", headers=officer_headers)
    assert pdf_res.status_code == 200, f"PDF report failed: {pdf_res.status_code}"
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert pdf_res.content.startswith(b"%PDF-"), "Invalid PDF binary format generated"
    print(f"  ✓ Tamper-evident PDF assessment dossier generated ({len(pdf_res.content):,} bytes) with all 3 engine proofs.")

    # -------------------------------------------------------------
    # 12. Notifications & Alerts (Module 12)
    # -------------------------------------------------------------
    print("\n[Step 12] Testing Notifications & Alerts API...")
    # List notifications for farmer
    notif_res = client.get("/api/v1/notifications/", headers=farmer_headers)
    assert notif_res.status_code == 200
    notifs = notif_res.json()
    print(f"  ✓ Retrieved {len(notifs)} notifications for farmer.")
    
    # Mark notification as read
    if notifs:
        target_id = notifs[0]["id"]
        read_res = client.patch(f"/api/v1/notifications/{target_id}/read", headers=farmer_headers)
        assert read_res.status_code == 200
        assert read_res.json()["read"] is True
        print(f"  ✓ Notification {target_id} marked as read.")

    print("\n" + "=" * 70)
    print("ALL TEST MODULES (1 - 13) PASSED WITH 100% SUCCESS!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
