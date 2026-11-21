import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.schemas.schemas import NotificationResponse
from app.core.security import get_current_user_payload, require_roles

router = APIRouter()

# In-memory notifications store with seed items
MOCK_NOTIFICATIONS: List[Dict[str, Any]] = [
    {
        "id": "notif-001",
        "recipient_role": "farmer",
        "recipient_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "title": "Claim CLM001 Under Review",
        "message": "Your claim CLM001 has passed automated satellite verification and is now assigned to Claims Officer R. K. Sharma.",
        "category": "claim_status",
        "reference_id": "CLM001",
        "created_at": "2026-11-10T16:50:00Z",
        "read": False
    },
    {
        "id": "notif-002",
        "recipient_role": "insurance_officer",
        "recipient_id": "all_officers",
        "title": "New PMFBY Claim Filed: CLM001",
        "message": "Farmer Rajesh Kumar Patel filed claim CLM001 for Wheat (Bhopal District, Rabi 2026). Claimed amount: ₹1,13,750.",
        "category": "new_claim",
        "reference_id": "CLM001",
        "created_at": "2026-11-06T10:35:00Z",
        "read": True
    },
    {
        "id": "notif-003",
        "recipient_role": "insurance_officer",
        "recipient_id": "all_officers",
        "title": "Investigation Flag Raised: CLM003",
        "message": "Claim CLM003 has been flagged for Medium severity investigation: Cadastral boundary variance exceeds 18%.",
        "category": "investigation_flag",
        "reference_id": "CLM003",
        "created_at": "2026-10-29T16:05:00Z",
        "read": False
    }
]

@router.get("/")
def list_notifications(
    category: Optional[str] = None,
    unread_only: bool = False,
    current_user: Dict[str, Any] = Depends(get_current_user_payload)
):
    """
    Lists notifications for the authenticated user/role (Module 12):
    - Farmers receive status change notices and document requests
    - Officers receive new claim alerts and investigation flags
    """
    user_role = current_user.get("role", "farmer")
    user_id = current_user.get("sub")

    results = []
    for n in MOCK_NOTIFICATIONS:
        rec_role = n.get("recipient_role")
        rec_id = n.get("recipient_id")

        # Role or direct recipient match
        if rec_role == user_role or rec_id in [user_id, "all_officers", "all"]:
            results.append(n)

    if category:
        results = [n for n in results if n.get("category") == category]
    if unread_only:
        results = [n for n in results if not n.get("read", False)]

    # Sort newest first
    results.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return results

@router.get("/unread-count")
def get_unread_count(
    current_user: Dict[str, Any] = Depends(get_current_user_payload)
):
    """Returns the count of unread notifications for badge counters."""
    user_role = current_user.get("role", "farmer")
    user_id = current_user.get("sub")

    count = 0
    for n in MOCK_NOTIFICATIONS:
        if (n.get("recipient_role") == user_role or n.get("recipient_id") in [user_id, "all_officers", "all"]) and not n.get("read", False):
            count += 1
    return {"unread_count": count}

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_notification(
    title: str = Query(...),
    message: str = Query(...),
    category: str = Query("claim_status", description="claim_status, new_claim, investigation_flag, document_request"),
    recipient_role: str = Query("farmer", description="farmer, insurance_officer, admin"),
    recipient_id: Optional[str] = Query("all"),
    reference_id: Optional[str] = Query(None),
    current_user: Dict[str, Any] = Depends(require_roles(["insurance_officer", "admin"]))
):
    """
    Triggers an automated system notification (Module 12):
    - Status change notifications to farmers
    - New claim submission alerts to insurance officers
    - Vigilance / investigation flag broadcasts
    """
    new_notif = {
        "id": f"notif-{uuid.uuid4().hex[:6]}",
        "recipient_role": recipient_role,
        "recipient_id": recipient_id or "all",
        "title": title,
        "message": message,
        "category": category,
        "reference_id": reference_id,
        "created_at": datetime.utcnow().isoformat(),
        "read": False
    }
    MOCK_NOTIFICATIONS.append(new_notif)
    return new_notif

@router.patch("/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user_payload)
):
    """Marks a notification as read."""
    notif = next((n for n in MOCK_NOTIFICATIONS if n["id"] == notification_id), None)
    if not notif:
        raise HTTPException(status_code=404, detail=f"Notification '{notification_id}' not found.")
    notif["read"] = True
    return {"status": "success", "notification_id": notification_id, "read": True}
