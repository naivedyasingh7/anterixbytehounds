# AgriVerify AI – Backend API Service

FastAPI-powered asynchronous REST API for agricultural insurance claim processing, geospatial boundary verification, multi-spectral NDVI analysis, and automated process audits.

---

## 🛠️ Tech Stack & Key Libraries
- **FastAPI:** High-performance async ASGI web framework
- **SQLAlchemy 2.0 & GeoAlchemy2:** ORM with PostGIS spatial geometry support
- **Shapely & PyProj:** Ellipsoidal geodesic polygon area & variance calculation
- **ReportLab:** Headless dynamic PDF generation for claim assessment reports
- **Pydantic v2:** Strict request/response validation and serialization
- **JWT (python-jose):** Secure role-based tokens (`farmer`, `insurance_officer`)

---

## 🚀 Local Setup

1. **Create and activate virtual environment:**
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your local PostgreSQL/PostGIS connection details
   ```

4. **Launch development server:**
   ```bash
   python main.py
   # or
   uvicorn main:app --reload --port 8000
   ```

5. **Explore Interactive OpenAPI Docs:**
   - Swagger UI: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

---

## 📂 Backend Architecture

```
backend/
├── main.py                    # App entrypoint, CORS & exception handling
├── requirements.txt           # Python dependencies
├── app/
│   ├── core/                  # Security (JWT, passwords), config & DB session
│   ├── models/                # SQLAlchemy & PostGIS models
│   ├── schemas/               # Pydantic request/response schemas
│   ├── services/
│   │   ├── gis_service.py     # Polygon area & discrepancy logic
│   │   ├── satellite_service.py# Sentinel-2 NDVI timeseries generator/fetcher
│   │   ├── weather_service.py # Agro-meteorological rainfall & temp data
│   │   ├── ml_yield_service.py# Crop yield prediction model
│   │   ├── audit_service.py   # Claim processing SLA & anomaly detector
│   │   └── pdf_service.py     # PDF claim dossier compiler
│   └── api/v1/
│       ├── router.py          # Unified v1 router
│       └── endpoints/         # Modular endpoints
│           ├── auth.py        # Authentication & Demo accounts
│           ├── farmers.py     # Farmer registry
│           ├── farms.py       # Farms CRUD & mapping
│           ├── claims.py      # Claims CRUD & CSV batch upload
│           ├── engine_farm.py # Engine 1 (Farm Verification)
│           ├── engine_yield.py# Engine 2 (Yield & NDVI Verification)
│           ├── engine_audit.py# Engine 3 (Insurance Process Audit)
│           ├── workspace.py   # Unified Claim Workspace aggregator
│           └── reports.py     # Downloadable PDF reports
```
