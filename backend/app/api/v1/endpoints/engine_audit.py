from fastapi import APIRouter, UploadFile, File
from typing import Dict, Any, Optional
import io
import pandas as pd
from app.services.audit_service import audit_claim_lifecycle

router = APIRouter()

@router.get("/audit/{claim_id}")
def audit_claim(claim_id: str):
    """
    Engine 3 Execution:
    - Ingests claim processing stages
    - Analyzes SLA compliance and processing delays
    - Identifies missing records and unusual patterns
    """
    return audit_claim_lifecycle(claim_number=claim_id)

@router.post("/audit-csv")
async def audit_csv_upload(file: UploadFile = File(...)):
    """
    Ingests an insurance batch processing CSV and audits entire batch for SLA delays and missing records.
    """
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    flagged_records = []
    delayed_count = 0
    missing_docs_count = 0

    for idx, row in df.iterrows():
        days_taken = int(row.get("Days Elapsed", 12))
        has_khasra = str(row.get("Has Khasra", "Yes")).lower() in ["yes", "true", "1"]
        has_sowing = str(row.get("Has Sowing Cert", "Yes")).lower() in ["yes", "true", "1"]

        reasons = []
        if days_taken > 21:
            delayed_count += 1
            reasons.append(f"Exceeded 21 days ({days_taken} days)")
        if not has_khasra or not has_sowing:
            missing_docs_count += 1
            reasons.append("Missing mandatory deed/sowing certificate")

        if reasons:
            flagged_records.append({
                "claim_id": row.get("Claim ID", f"CLM-{idx+1}"),
                "days_taken": days_taken,
                "reasons": reasons
            })

    return {
        "engine": "Engine 3: Insurance Process Audit (Batch Ingestion)",
        "total_records_analyzed": len(df),
        "delayed_claims_count": delayed_count,
        "missing_docs_count": missing_docs_count,
        "flagged_records": flagged_records,
        "batch_audit_summary": f"Analyzed {len(df)} records. Found {len(flagged_records)} anomalies requiring investigation."
    }
