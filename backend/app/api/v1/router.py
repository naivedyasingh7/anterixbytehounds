from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, farmers, farms, policies, claims, documents,
    engine_farm, engine_yield, engine_audit,
    workspace, reports, notifications
)

api_router = APIRouter()

# Core User, Profile & Cadastral Routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Access Control"])
api_router.include_router(farmers.router, prefix="/farmers", tags=["Farmers Profile & Management"])
api_router.include_router(farms.router, prefix="/farms", tags=["Farms & Cadastral GIS"])
api_router.include_router(policies.router, prefix="/policies", tags=["Insurance Policies"])
api_router.include_router(claims.router, prefix="/claims", tags=["Claims Lifecycle Management"])
api_router.include_router(documents.router, prefix="/documents", tags=["Document & Evidence Management"])

# Verification Engines
api_router.include_router(engine_farm.router, prefix="/engines/farm", tags=["Engine 1: Farm Boundary Verification"])
api_router.include_router(engine_yield.router, prefix="/engines/yield", tags=["Engine 2: Yield & Sentinel-2 Verification"])
api_router.include_router(engine_audit.router, prefix="/engines/audit", tags=["Engine 3: Insurance Process Audit"])

# Assessment Workspace, Reports & Notifications
api_router.include_router(workspace.router, prefix="/workspace", tags=["Unified Claim Workspace"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports & PDFs"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications & Alerts"])
