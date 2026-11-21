from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, farmers, farms, claims,
    engine_farm, engine_yield, engine_audit,
    workspace, reports
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(farmers.router, prefix="/farmers", tags=["Farmers"])
api_router.include_router(farms.router, prefix="/farms", tags=["Farms"])
api_router.include_router(claims.router, prefix="/claims", tags=["Claims Management"])
api_router.include_router(engine_farm.router, prefix="/engines/farm", tags=["Engine 1: Farm Verification"])
api_router.include_router(engine_yield.router, prefix="/engines/yield", tags=["Engine 2: Yield Verification"])
api_router.include_router(engine_audit.router, prefix="/engines/audit", tags=["Engine 3: Process Audit"])
api_router.include_router(workspace.router, prefix="/workspace", tags=["Unified Claim Workspace"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports & PDFs"])
