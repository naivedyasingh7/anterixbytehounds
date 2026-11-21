from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.pdf_service import generate_claim_assessment_pdf

router = APIRouter()

@router.get("/{claim_id}/pdf")
def download_claim_report_pdf(claim_id: str):
    """
    Generates and downloads a complete, audit-ready PDF assessment report.
    """
    claim_mock = {
        "claim_number": claim_id,
        "farmer_name": "Rajesh Kumar Patel",
        "farmer_code": "FAR-MP-BHP-001",
        "district": "Bhopal",
        "policy_number": "POL-PMFBY-BHP-2026-88",
        "crop": "Wheat",
        "khasra": "48/2",
        "claimed_amount": 113750,
        "approved_amount": 113750,
        "loss_cause": "Drought & Prolonged Dry Spell"
    }

    pdf_buffer = generate_claim_assessment_pdf(claim_mock)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=AgriVerify_Assessment_{claim_id}.pdf"}
    )
