# AgriVerify AI – System Architecture Specification

## 1. High-Level System Architecture

AgriVerify AI is engineered as a modern, decoupled cloud-ready platform combining a reactive Single Page Application (SPA), high-performance asynchronous REST microservices, a PostGIS-enabled relational database, and geospatial analytics pipelines.

```mermaid
flowchart TD
    subgraph Clients["Presentation Layer (React + TypeScript)"]
        Landing["Landing Page & Auth"]
        FarmerUI["Farmer Portal\n(Farms, Claims, Tracking)"]
        OfficerUI["Insurance Portal\n(Dashboard, Claims, Workspace)"]
    end

    subgraph API_Gateway["API Layer (FastAPI)"]
        AuthRouter["Auth & RBAC Middleware\n(JWT Tokens)"]
        ClaimRouter["Claims & Policies Router"]
        GISRouter["Geospatial & Farms Router"]
        EnginesRouter["Verification Engines Router\n(Farm, Yield, Process)"]
        ReportRouter["PDF Report Generator"]
    end

    subgraph Analytics["Analytics & AI Layer"]
        Engine1["Engine 1: Farm Verifier\n(Shapely Polygon Geodesics)"]
        Engine2["Engine 2: Yield Verifier\n(Sentinel-2 NDVI + XGBoost)"]
        Engine3["Engine 3: Process Auditor\n(Timeline SLA & Anomaly Engine)"]
    end

    subgraph Data["Persistence Layer"]
        Postgres[("PostgreSQL 15 + PostGIS\n(Farms, Claims, Audits)")]
        Storage[("Document / GeoJSON Store\n(Khasra, Images, PDFs)")]
    end

    Landing --> AuthRouter
    FarmerUI --> ClaimRouter
    FarmerUI --> GISRouter
    OfficerUI --> EnginesRouter
    OfficerUI --> ReportRouter

    AuthRouter --> Postgres
    ClaimRouter --> Postgres
    GISRouter --> Postgres
    GISRouter --> Storage
    
    EnginesRouter --> Engine1
    EnginesRouter --> Engine2
    EnginesRouter --> Engine3

    Engine1 --> Postgres
    Engine2 --> Postgres
    Engine3 --> Postgres
    ReportRouter --> Postgres
    ReportRouter --> Storage
```

---

## 2. Component Breakdown

### 2.1 Frontend Client (React 18 + TypeScript + Vite)
- **Role-Based Routing:** Secured routes distinguishing between `farmer` and `insurance_officer`.
- **Geospatial Mapping:** Integrated with **Leaflet** and **OpenStreetMap / ESRI Satellite** for drawing and reviewing farm boundary polygons.
- **Data Visualizations:** Built with **Recharts** for rendering:
  - Multi-temporal NDVI vegetation index trends against district baselines.
  - Rainfall and temperature historical distributions.
  - Claim processing SLA duration breakdowns.
- **Unified Workspace Cockpit:** A responsive 6-panel grid providing synchronized inspection of geospatial, vegetative, meteorological, and audit records.

### 2.2 Backend Microservice (Python FastAPI)
- **Asynchronous Execution:** High-throughput async endpoints built on Starlette and Pydantic v2.
- **Authentication & RBAC:** OAuth2 with Password Bearer, cryptographically signed JWT tokens, and declarative role dependencies (`require_role('insurance_officer')`).
- **Geospatial Processing Engine:** Utilizes `shapely`, `pyproj`, and `GeoAlchemy2` to compute accurate geodesic polygon surface area in hectares and acres, accounting for ellipsoidal distortion.
- **Reporting Engine:** Headless PDF generation via `ReportLab` compiling comprehensive audit records into printable, verifiable claim dossiers.

### 2.3 Persistence & Spatial Storage (PostgreSQL + PostGIS)
- PostGIS extensions (`geometry(Polygon, 4326)`) allow spatial queries, boundary containment checks, and overlap detections between adjacent Khasra parcels.
- Fully normalized relational schema spanning 13 core tables with cascade constraints, check constraints, and timestamp audit triggers.

---

## 3. End-to-End Claim Lifecycle Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Rajesh (Farmer)
    participant Web as AgriVerify Frontend
    participant API as FastAPI Backend
    participant Engine1 as Engine 1 (Farm)
    participant Engine2 as Engine 2 (Yield)
    participant Engine3 as Engine 3 (Audit)
    actor Officer as Sharma (Insurance Officer)

    Farmer->>Web: Register Farm (Draw boundary on satellite map, input Khasra)
    Web->>API: POST /api/v1/farms (GeoJSON polygon, area, crop)
    API-->>Web: Farm Created (Status: Pending Verification)

    Farmer->>Web: File Crop Loss Claim (Select Farm, Crop, Loss Cause, Est. Loss)
    Web->>API: POST /api/v1/claims (Attach photos, sowing receipt)
    API-->>Web: Claim Issued (CLM001 - Status: Pending)

    Officer->>Web: Open Insurance Dashboard
    Web->>API: GET /api/v1/claims/overview
    API-->>Web: Returns KPI counts & claims list

    Officer->>Web: Click Claim CLM001 (Unified Workspace)
    Web->>API: GET /api/v1/workspace/CLM001
    
    par Run Engine 1
        API->>Engine1: Validate Geodesic Area vs Declared Khasra
        Engine1-->>API: Result: Verified (Area variance: 1.8%)
    and Run Engine 2
        API->>Engine2: Compute Sentinel-2 NDVI trajectory & Weather anomaly
        Engine2-->>API: Result: Anomaly Confirmed (Drought dip in Week 38)
    and Run Engine 3
        API->>Engine3: Audit claim timeline & documents completeness
        Engine3-->>API: Result: Normal (No SLA breach, all docs present)
    end

    API-->>Web: Return Aggregated Evidence Package
    Officer->>Web: Review Evidence & Click "Approve Claim" with Remarks
    Web->>API: POST /api/v1/claims/CLM001/assess (Status: Approved, Remarks)
    API-->>Web: Claim Status Updated & Audit Log Created
    
    Officer->>Web: Click "Download Assessment Dossier"
    Web->>API: GET /api/v1/reports/CLM001/pdf
    API-->>Web: Stream Downloadable PDF Report
```

---

## 4. Security & Compliance Architecture

1. **Role-Based Access Control (RBAC):**
   - Farmers cannot view or modify claims outside their own registered user identifier.
   - Only authorized `insurance_officer` roles can access verification engines and trigger claim decisions.
2. **Immutable Audit Trails:**
   - Every status alteration, document submission, and assessor decision generates a timestamped entry in `audit_logs` and `claim_events`.
3. **Fiduciary Safety:**
   - AI outputs are classified strictly as advisory evidence (`confidence_score`, `data_quality`). The platform enforces mandatory human sign-off for any claim disbursement or repudiation.
