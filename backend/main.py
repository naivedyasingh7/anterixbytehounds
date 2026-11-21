from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.database import init_db
from app.core.exceptions import register_exception_handlers
from app.api.v1.router import api_router

logger = setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup tasks
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} [{settings.ENVIRONMENT}]")
    init_db()
    yield
    # Shutdown tasks
    logger.info(f"Shutting down {settings.PROJECT_NAME}")

OPENAPI_TAGS = [
    {
        "name": "Authentication",
        "description": "JWT authentication, demo profile switcher, and role-based access control."
    },
    {
        "name": "Farmers",
        "description": "Farmer directory, beneficiary profile lookups, and PMFBY policy linkage."
    },
    {
        "name": "Farms",
        "description": "Cadastral farm parcel registry, boundary ingestion, and area variance calculations."
    },
    {
        "name": "Claims Management",
        "description": "Crop loss claim filing, batch CSV ingestion, and district metrics overview."
    },
    {
        "name": "Engine 1: Farm Verification",
        "description": "Geodesic acreage calculation (EPSG:32643 UTM 43N) and Khasra cadastral mismatch detection."
    },
    {
        "name": "Engine 2: Yield Verification",
        "description": "Sentinel-2 L2A optical NDVI timeseries (B08/B04), IMD weather analytics, and XGBoost yield loss benchmarking."
    },
    {
        "name": "Engine 3: Process Audit",
        "description": "Lifecycle turnaround audit, statutory SLA violation flags (>21 days), and document completeness checks."
    },
    {
        "name": "Unified Claim Workspace",
        "description": "Single-pane-of-glass dashboard consolidating all 3 verification engines with human-in-the-loop decision capture."
    },
    {
        "name": "Reports & PDFs",
        "description": "Audit-ready PDF generation and settlement summary downloads via ReportLab."
    }
]

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
# AgriVerify AI API
### AI-Powered Agricultural Insurance Verification Engine & Unified Claim Workspace

AgriVerify AI automates and accelerates the PMFBY (Pradhan Mantri Fasal Bima Yojana) insurance assessment workflow:
* **Engine 1: Farm Parcel Boundary & Geodesic Verifier:** Detects land overstatement and links state land records (MP Bhulekh).
* **Engine 2: Crop Yield & Phenological Health Verifier:** Analyzes multi-temporal Sentinel-2 L2A NDVI curves and IMD meteorological drought indices using an advisory XGBoost regression model.
* **Engine 3: Insurance Process & SLA Auditor:** Pinpoints delays and missing mandatory sowing/Khasra documents across the claim lifecycle.
* **Unified Claim Workspace:** Bridges AI analytics with insurance officers for defensible, transparent claim determinations.
""",
    openapi_tags=OPENAPI_TAGS,
    docs_url=settings.docs_url,
    redoc_url=settings.redoc_url,
    openapi_url=settings.openapi_url,
    lifespan=lifespan,
    contact={
        "name": "AgriVerify AI Engineering Team",
        "email": "dev@agriverify.in"
    },
    license_info={
        "name": "Proprietary / Government Agritech Demo License"
    }
)

# Exception handling
register_exception_handlers(app)

# Configure CORS
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register v1 router
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Health Check"])
@app.get("/health", tags=["Health Check"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": "connected",
        "docs": settings.docs_url,
        "redoc": settings.redoc_url
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
