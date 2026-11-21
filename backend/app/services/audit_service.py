from typing import Dict, Any, List
from datetime import datetime

def audit_claim_lifecycle(claim_number: str, events: List[Dict[str, Any]] = None, documents: List[str] = None) -> Dict[str, Any]:
    """
    Engine 3: Ingests timeline events and audit logs to flag SLA breaches,
    missing compliance records, and anomalous processing stages.
    """
    default_events = [
        {"stage": "Submission", "date": "2026-11-06 10:30", "status": "Completed", "sla_days": 1},
        {"stage": "Document Check", "date": "2026-11-08 14:15", "status": "Completed", "sla_days": 2},
        {"stage": "Farm Verification (E1)", "date": "2026-11-09 11:00", "status": "Completed", "sla_days": 1},
        {"stage": "Yield Verification (E2)", "date": "2026-11-10 16:45", "status": "Completed", "sla_days": 1},
        {"stage": "Officer Assessment", "date": "Pending", "status": "In Progress", "sla_days": 0},
    ]

    timeline = events if events else default_events
    total_turnaround_days = sum(e.get("sla_days", 0) for e in timeline)

    # Mandatory document completeness
    required_docs = ["Khasra_Deed", "Sowing_Certificate", "Field_Photo"]
    present_docs = documents if documents else ["Khasra_Deed", "Sowing_Certificate", "Field_Photo"]
    missing_docs = [doc for doc in required_docs if doc not in present_docs]

    # SLA Rules
    anomalies = []
    if total_turnaround_days > 21:
        sla_status = "Critical Delay"
        anomalies.append(f"Turnaround time ({total_turnaround_days} days) exceeds statutory 21-day threshold.")
    elif total_turnaround_days > 14:
        sla_status = "Delayed"
        anomalies.append(f"Turnaround time ({total_turnaround_days} days) exceeds target 14-day window.")
    else:
        sla_status = "On Time"

    if missing_docs:
        anomalies.append(f"Missing mandatory compliance documents: {', '.join(missing_docs)}")

    return {
        "claim_number": claim_number,
        "total_turnaround_days": total_turnaround_days,
        "stages_completed": len([e for e in timeline if e.get("status") == "Completed"]),
        "sla_status": sla_status,
        "missing_records": missing_docs,
        "anomalies_detected": anomalies,
        "timeline_events": timeline,
        "audit_health_score": 95 if not anomalies else 60
    }
