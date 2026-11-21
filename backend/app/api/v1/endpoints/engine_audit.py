import io
from typing import Dict, Any, Optional, List
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from app.services.audit_service import audit_claim_lifecycle, PMFBY_SLA_TIMELINES
from app.core.security import require_roles, get_current_user_payload

router = APIRouter()

@router.get("/audit/{claim_id}")
def audit_claim(claim_id: str):
    """
    Engine 3 Execution (Module 10):
    - Ingests claim processing stages and timestamps
    - Analyzes SLA compliance across all 6 processing milestones
    - Identifies missing records and unusual patterns
    - Computes statistical Z-Score vs regional benchmark
    """
    return audit_claim_lifecycle(claim_number=claim_id)

@router.get("/sla-timelines")
def get_sla_timelines():
    """Returns statutory PMFBY SLA turnaround limits by processing stage."""
    return {
        "framework": "Pradhan Mantri Fasal Bima Yojana (PMFBY) Operational Guidelines",
        "maximum_statutory_turnaround_days": 21,
        "stages": [
            {"stage": k, "max_allowed_days": v, "description": f"Standard SLA for {k.replace('_', ' ')}"}
            for k, v in PMFBY_SLA_TIMELINES.items()
        ]
    }

@router.post("/audit-csv")
@router.post("/audit-batch")
async def audit_batch_upload(
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(require_roles(["insurance_officer", "admin"]))
):
    """
    Ingests an insurance batch processing CSV or Excel file and audits the entire portfolio (Module 10):
    - SLA delays and stage breaches
    - Missing mandatory compliance deeds / certificates
    - Approved claims without payment completion (> 7 days)
    - Statistical turnaround outliers (Z-Score calculation)
    - Financial overclaim anomalies
    """
    content = await file.read()
    filename = file.filename.lower()

    try:
        if filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(content))
        else:
            df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unable to parse batch audit spreadsheet: {str(e)}"
        )

    # Calculate portfolio duration stats for Z-Score anomaly detection
    durations = []
    for _, row in df.iterrows():
        try:
            d = float(row.get("Days Elapsed", row.get("days_elapsed", 12)))
            durations.append(d)
        except (ValueError, TypeError):
            durations.append(12.0)

    flagged_records = []
    delayed_count = 0
    missing_docs_count = 0
    unpaid_approved_count = 0

    for idx, row in df.iterrows():
        claim_id = str(row.get("Claim ID", row.get("claim_id", f"CLM-{idx+1}")))
        days_taken = float(row.get("Days Elapsed", row.get("days_elapsed", 12)))
        status_val = str(row.get("Status", row.get("status", "Pending")))
        payment_status = str(row.get("Payment Status", row.get("payment_status", "Pending")))
        has_khasra = str(row.get("Has Khasra", row.get("has_khasra", "Yes"))).lower() in ["yes", "true", "1"]
        has_sowing = str(row.get("Has Sowing Cert", row.get("has_sowing_cert", "Yes"))).lower() in ["yes", "true", "1"]
        claimed_amt = float(row.get("Claimed Amount", row.get("claimed_amount", 100000)))
        sum_insured = float(row.get("Sum Insured", row.get("sum_insured", 150000)))

        docs_present = []
        if has_khasra:
            docs_present.append("Khasra_Deed")
        if has_sowing:
            docs_present.append("Sowing_Certificate")
        docs_present.append("Field_Photo")

        metadata = {
            "status": status_val,
            "payment_status": payment_status,
            "claimed_amount_inr": claimed_amt,
            "sum_insured_inr": sum_insured,
            "approval_date": "2026-11-01T10:00:00Z" if status_val.lower() == "approved" else None
        }

        # Run full audit
        audit_res = audit_claim_lifecycle(
            claim_number=claim_id,
            documents=docs_present,
            claim_metadata=metadata,
            district_turnaround_history=durations
        )

        if audit_res["anomalies_detected"]:
            if audit_res["sla_status"] in ["Delayed", "Critical Delay"]:
                delayed_count += 1
            if audit_res["missing_records"]:
                missing_docs_count += 1
            if any("payment completion" in a.lower() for a in audit_res["anomalies_detected"]):
                unpaid_approved_count += 1

            flagged_records.append({
                "claim_id": claim_id,
                "days_taken": days_taken,
                "sla_status": audit_res["sla_status"],
                "health_score": audit_res["audit_health_score"],
                "missing_records": audit_res["missing_records"],
                "anomalies": audit_res["anomalies_detected"],
                "statistical_z_score": audit_res["statistical_metrics"]["z_score"]
            })

    return {
        "engine": "Engine 3: Insurance Process Audit (Batch Analysis)",
        "file_name": file.filename,
        "total_records_analyzed": len(df),
        "delayed_claims_count": delayed_count,
        "missing_docs_count": missing_docs_count,
        "unpaid_approved_claims_count": unpaid_approved_count,
        "flagged_records": flagged_records,
        "clean_records_count": len(df) - len(flagged_records),
        "summary": f"Audited {len(df)} records. Found {len(flagged_records)} flagged claims ({delayed_count} delayed, {missing_docs_count} missing records, {unpaid_approved_count} unpaid approved)."
    }
