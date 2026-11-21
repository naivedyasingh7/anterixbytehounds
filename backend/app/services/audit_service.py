import math
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

# PMFBY Statutory SLA Service Timelines (in calendar days per stage)
PMFBY_SLA_TIMELINES = {
    "Intimation": 2,              # Farmer intimates crop loss within 72 hours (2-3 days)
    "Document_Verification": 3,   # Insurer verifies uploaded land records & Khasra
    "Farm_Survey": 7,             # Field / cadastral GIS survey completion
    "Satellite_Analysis": 5,      # Multi-spectral Sentinel-2 NDVI phenology processing
    "Loss_Assessment": 15,        # Committee determines loss percentage
    "Disbursal": 21               # Direct DBT bank transfer to farmer
}
STATUTORY_MAX_TURNAROUND_DAYS = 21

def audit_claim_lifecycle(
    claim_number: str,
    events: Optional[List[Dict[str, Any]]] = None,
    documents: Optional[List[str]] = None,
    claim_metadata: Optional[Dict[str, Any]] = None,
    district_turnaround_history: Optional[List[float]] = None
) -> Dict[str, Any]:
    """
    Engine 3: Comprehensive PMFBY Insurance Process Audit Engine (Module 10).
    - Maps 6 mandatory processing stages with timestamps
    - Calculates stage-wise durations and verifies statutory SLA thresholds
    - Identifies missing records and compliance gaps
    - Detects 'Approved claims without recorded payment completion' (> 7 days)
    - Performs statistical Z-Score anomaly detection across district claims
    - Rule-based financial and date validation checks
    """
    now = datetime.utcnow()

    # Default staged events if not supplied
    if not events:
        events = [
            {"stage": "Intimation", "started_at": "2026-11-05T10:00:00Z", "completed_at": "2026-11-06T10:30:00Z", "status": "Completed", "duration_days": 1.0, "max_sla_days": 2},
            {"stage": "Document_Verification", "started_at": "2026-11-06T10:30:00Z", "completed_at": "2026-11-08T14:15:00Z", "status": "Completed", "duration_days": 2.15, "max_sla_days": 3},
            {"stage": "Farm_Survey", "started_at": "2026-11-08T14:15:00Z", "completed_at": "2026-11-09T11:00:00Z", "status": "Completed", "duration_days": 0.86, "max_sla_days": 7},
            {"stage": "Satellite_Analysis", "started_at": "2026-11-09T11:00:00Z", "completed_at": "2026-11-10T16:45:00Z", "status": "Completed", "duration_days": 1.24, "max_sla_days": 5},
            {"stage": "Loss_Assessment", "started_at": "2026-11-10T16:45:00Z", "completed_at": None, "status": "In Progress", "duration_days": 1.5, "max_sla_days": 15},
            {"stage": "Disbursal", "started_at": None, "completed_at": None, "status": "Pending", "duration_days": 0.0, "max_sla_days": 21}
        ]

    # Calculate total turnaround days and stage breaches
    stage_durations = {}
    stage_sla_breaches = []
    total_turnaround_days = 0.0

    for ev in events:
        stg = ev.get("stage", "Unknown")
        dur = float(ev.get("duration_days", 0.0))
        max_sla = ev.get("max_sla_days", PMFBY_SLA_TIMELINES.get(stg, 7))
        stage_durations[stg] = dur
        total_turnaround_days += dur

        if dur > max_sla and ev.get("status") in ["Completed", "In Progress"]:
            stage_sla_breaches.append({
                "stage": stg,
                "duration_days": dur,
                "allowed_sla_days": max_sla,
                "delay_days": round(dur - max_sla, 2)
            })

    total_turnaround_days = round(total_turnaround_days, 1)

    # Document completeness check
    required_docs = ["Khasra_Deed", "Sowing_Certificate", "Field_Photo"]
    present_docs = documents if documents is not None else ["Khasra_Deed", "Sowing_Certificate", "Field_Photo"]
    missing_docs = [doc for doc in required_docs if doc not in present_docs]

    anomalies = []
    audit_findings = []

    # 1. Statutory SLA Evaluation
    if total_turnaround_days > STATUTORY_MAX_TURNAROUND_DAYS:
        sla_status = "Critical Delay"
        anomalies.append(f"Statutory turnaround limit breached: {total_turnaround_days} days elapsed (threshold: {STATUTORY_MAX_TURNAROUND_DAYS} days).")
        audit_findings.append({
            "category": "SLA_BREACH",
            "severity": "High",
            "message": f"Claim processing has taken {total_turnaround_days} days, exceeding the 21-day PMFBY mandate."
        })
    elif total_turnaround_days > 14:
        sla_status = "Delayed"
        anomalies.append(f"Processing turnaround ({total_turnaround_days} days) exceeds operational 14-day SLA benchmark.")
        audit_findings.append({
            "category": "SLA_WARNING",
            "severity": "Medium",
            "message": f"Claim nearing maximum turnaround limits ({total_turnaround_days} days elapsed)."
        })
    else:
        sla_status = "On Time"

    for b in stage_sla_breaches:
        anomalies.append(f"Stage '{b['stage']}' exceeded SLA limit by {b['delay_days']} days.")
        audit_findings.append({
            "category": "STAGE_DELAY",
            "severity": "Medium",
            "message": f"Processing at '{b['stage']}' took {b['duration_days']} days (SLA max: {b['allowed_sla_days']} days)."
        })

    # 2. Missing Records Check
    if missing_docs:
        anomalies.append(f"Missing mandatory compliance documents: {', '.join(missing_docs)}")
        audit_findings.append({
            "category": "MISSING_EVIDENCE",
            "severity": "High",
            "message": f"Mandatory evidence files absent from evidence locker: {', '.join(missing_docs)}."
        })

    # 3. Check for Approved Claims Without Payment Completion (> 7 days)
    metadata = claim_metadata or {}
    claim_status = metadata.get("status", "Pending")
    approval_date_str = metadata.get("approval_date")
    payment_status = metadata.get("payment_status", "Pending")

    if claim_status.lower() in ["approved"] and payment_status.lower() not in ["completed", "settled", "paid"]:
        if approval_date_str:
            try:
                app_date = datetime.fromisoformat(approval_date_str.replace("Z", "+00:00"))
                days_since_approval = (datetime.utcnow() - app_date.replace(tzinfo=None)).days
                if days_since_approval > 7:
                    anomaly_msg = f"Disbursal Delay Anomaly: Claim was approved {days_since_approval} days ago without recorded payment completion (mandate: within 7 days)."
                    anomalies.append(anomaly_msg)
                    audit_findings.append({
                        "category": "UNPAID_APPROVED_CLAIM",
                        "severity": "Critical",
                        "message": anomaly_msg
                    })
            except Exception:
                pass

    # 4. Financial & Logical Rule-Based Anomaly Checks
    claimed_amount = metadata.get("claimed_amount_inr", 113750.0)
    sum_insured = metadata.get("sum_insured_inr", 175000.0)
    loss_pct = metadata.get("claimed_loss_percentage", 65.0)

    if loss_pct > 100.0 or loss_pct < 0.0:
        anomalies.append(f"Invalid claimed loss percentage: {loss_pct}%. Must be between 0% and 100%.")
        audit_findings.append({
            "category": "LOGICAL_ANOMALY",
            "severity": "High",
            "message": f"Reported loss percentage of {loss_pct}% is physically impossible."
        })

    if sum_insured > 0 and claimed_amount > sum_insured:
        anomalies.append(f"Financial indemnity breach: Claimed amount (₹{claimed_amount:,.2f}) exceeds policy sum insured (₹{sum_insured:,.2f}).")
        audit_findings.append({
            "category": "FINANCIAL_OVERCLAIM",
            "severity": "High",
            "message": f"Claimed amount exceeds policy sum insured limit by ₹{claimed_amount - sum_insured:,.2f}."
        })

    # 5. Statistical Anomaly Detection (Z-Score on Turnaround Times)
    historical_durations = district_turnaround_history or [5.2, 6.1, 7.0, 5.8, 6.4, 6.9, 7.5, 8.1, 6.0, 5.5, 6.2, 7.1]
    hist_mean = float(np.mean(historical_durations))
    hist_std = float(np.std(historical_durations))
    z_score = 0.0

    if hist_std > 0:
        z_score = round((total_turnaround_days - hist_mean) / hist_std, 2)
        if abs(z_score) >= 2.0:
            anomalies.append(f"Statistical processing duration outlier: Z-Score = {z_score:+.2f} (exceeds ±2.0 standard deviations from district mean of {hist_mean:.1f} days).")
            audit_findings.append({
                "category": "STATISTICAL_OUTLIER",
                "severity": "Medium",
                "message": f"Claim duration of {total_turnaround_days} days deviates significantly from regional baseline (z={z_score:+.2f})."
            })

    # Health score computation (100 base, deductions for anomalies and missing documents)
    health_score = 100
    for finding in audit_findings:
        sev = finding.get("severity")
        if sev == "Critical":
            health_score -= 25
        elif sev == "High":
            health_score -= 15
        elif sev == "Medium":
            health_score -= 8
    health_score = max(10, min(100, health_score))

    return {
        "engine": "Engine 3: Insurance Process Audit Engine",
        "claim_number": claim_number,
        "total_turnaround_days": total_turnaround_days,
        "statutory_sla_limit_days": STATUTORY_MAX_TURNAROUND_DAYS,
        "sla_status": sla_status,
        "stages_completed": len([e for e in events if e.get("status") == "Completed"]),
        "stage_durations_days": stage_durations,
        "stage_sla_breaches": stage_sla_breaches,
        "missing_records": missing_docs,
        "anomalies_detected": anomalies,
        "audit_findings": audit_findings,
        "statistical_metrics": {
            "turnaround_days": total_turnaround_days,
            "district_mean_days": round(hist_mean, 2),
            "district_std_dev": round(hist_std, 2),
            "z_score": z_score,
            "is_outlier": abs(z_score) >= 2.0
        },
        "timeline_events": events,
        "audit_health_score": health_score
    }
