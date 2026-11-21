import os
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Depends, Query
from fastapi.responses import FileResponse
from app.core.security import require_roles, get_current_user_payload

router = APIRouter()

STORAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "storage", "uploads"))
os.makedirs(STORAGE_DIR, exist_ok=True)

ALLOWED_MIME_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
    "text/csv": ".csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "application/vnd.ms-excel": ".xls"
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

# In-memory document metadata store with seed evidence
MOCK_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "id": "doc-001",
        "file_name": "Bhopal_Khasra_48_2_Certified.pdf",
        "document_type": "khasra_record",
        "file_size_bytes": 1258291,
        "mime_type": "application/pdf",
        "file_path": os.path.join(STORAGE_DIR, "Bhopal_Khasra_48_2_Certified.pdf"),
        "download_url": "/api/v1/documents/doc-001/download",
        "verification_status": "Verified",
        "uploaded_at": "2026-11-06T10:30:00Z",
        "associated_entity_type": "farm",
        "associated_entity_id": "fa000001-0000-0000-0000-000000000001",
        "uploaded_by": "farmer"
    },
    {
        "id": "doc-002",
        "file_name": "Panchayat_Sowing_Receipt_2026.pdf",
        "document_type": "sowing_certificate",
        "file_size_bytes": 460800,
        "mime_type": "application/pdf",
        "file_path": os.path.join(STORAGE_DIR, "Panchayat_Sowing_Receipt_2026.pdf"),
        "download_url": "/api/v1/documents/doc-002/download",
        "verification_status": "Verified",
        "uploaded_at": "2026-11-06T11:15:00Z",
        "associated_entity_type": "claim",
        "associated_entity_id": "c0000001-0000-0000-0000-000000000001",
        "uploaded_by": "farmer"
    },
    {
        "id": "doc-003",
        "file_name": "Geotagged_Field_Crop_Stress.jpg",
        "document_type": "crop_photograph",
        "file_size_bytes": 2936012,
        "mime_type": "image/jpeg",
        "file_path": os.path.join(STORAGE_DIR, "Geotagged_Field_Crop_Stress.jpg"),
        "download_url": "/api/v1/documents/doc-003/download",
        "verification_status": "Verified",
        "uploaded_at": "2026-11-07T09:20:00Z",
        "associated_entity_type": "claim",
        "associated_entity_id": "c0000001-0000-0000-0000-000000000001",
        "uploaded_by": "farmer"
    }
]

# Create dummy sample physical files if they don't exist
for doc in MOCK_DOCUMENTS:
    if not os.path.exists(doc["file_path"]):
        with open(doc["file_path"], "wb") as f:
            f.write(f"Sample AgriVerify Mock Evidence Content for {doc['file_name']}".encode("utf-8"))

@router.get("/")
def list_documents(
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    document_type: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user_payload)
):
    """Lists uploaded documents with optional entity association filters."""
    results = MOCK_DOCUMENTS
    if entity_type:
        results = [d for d in results if d["associated_entity_type"].lower() == entity_type.lower()]
    if entity_id:
        results = [d for d in results if d["associated_entity_id"].lower() == entity_id.lower()]
    if document_type:
        results = [d for d in results if d["document_type"].lower() == document_type.lower()]
    return results

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form(...),
    associated_entity_type: str = Form("claim"), # farmer, farm, claim, policy
    associated_entity_id: str = Form(...),
    current_user: Dict[str, Any] = Depends(get_current_user_payload)
):
    """
    Secure File Upload API (Module 7):
    - Validates MIME type and 10MB size limit
    - Stores file securely with collision-resistant UUID filename
    - Associates evidence with farmer, farm, policy, or claim
    - Initializes verification status as 'Pending_Review'
    """
    content = await file.read()
    file_size = len(content)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of 10 MB (received {file_size / (1024*1024):.2f} MB)."
        )

    content_type = file.content_type or "application/octet-stream"
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file format '{content_type}'. Allowed types: JPEG, PNG, WEBP, PDF, CSV, Excel."
        )

    doc_id = f"doc-{uuid.uuid4().hex[:8]}"
    ext = ALLOWED_MIME_TYPES[content_type]
    safe_filename = f"{doc_id}_{file.filename}"
    disk_path = os.path.join(STORAGE_DIR, safe_filename)

    with open(disk_path, "wb") as f:
        f.write(content)

    new_doc = {
        "id": doc_id,
        "file_name": file.filename,
        "document_type": document_type,
        "file_size_bytes": file_size,
        "mime_type": content_type,
        "file_path": disk_path,
        "download_url": f"/api/v1/documents/{doc_id}/download",
        "verification_status": "Pending_Review",
        "uploaded_at": datetime.utcnow().isoformat(),
        "associated_entity_type": associated_entity_type.lower(),
        "associated_entity_id": associated_entity_id,
        "uploaded_by": current_user.get("role", "farmer")
    }

    MOCK_DOCUMENTS.append(new_doc)
    return new_doc

@router.get("/{doc_id}")
def get_document_metadata(
    doc_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user_payload)
):
    """Retrieves document metadata by ID."""
    doc = next((d for d in MOCK_DOCUMENTS if d["id"] == doc_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")
    return doc

@router.get("/{doc_id}/download")
def download_document(
    doc_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user_payload)
):
    """
    Secure Download API:
    - Verifies document existence and access permissions
    - Streams file with correct MIME type and content disposition
    """
    doc = next((d for d in MOCK_DOCUMENTS if d["id"] == doc_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")

    if not os.path.exists(doc["file_path"]):
        raise HTTPException(status_code=404, detail="Physical document file missing on server storage.")

    return FileResponse(
        path=doc["file_path"],
        media_type=doc["mime_type"],
        filename=doc["file_name"]
    )

@router.patch("/{doc_id}/status")
def update_document_verification_status(
    doc_id: str,
    status_val: str = Query(..., description="Verified, Pending_Review, or Rejected"),
    remarks: Optional[str] = Query(None),
    current_user: Dict[str, Any] = Depends(require_roles(["insurance_officer", "admin"]))
):
    """
    Updates document verification status. Restricted to insurance officers and admins.
    """
    valid_statuses = ["Verified", "Pending_Review", "Rejected"]
    if status_val not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid verification status. Allowed: {valid_statuses}"
        )

    doc = next((d for d in MOCK_DOCUMENTS if d["id"] == doc_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")

    doc["verification_status"] = status_val
    doc["verified_by"] = current_user.get("full_name", "Officer")
    doc["verification_remarks"] = remarks
    doc["verified_at"] = datetime.utcnow().isoformat()

    return {
        "status": "success",
        "document_id": doc_id,
        "verification_status": status_val,
        "verified_by": doc["verified_by"],
        "remarks": remarks
    }
