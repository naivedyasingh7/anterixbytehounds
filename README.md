# AgriVerify AI – AI-Powered Agricultural Insurance Verification Platform

> **Empowering Fair, Fast, and Evidence-Backed Crop Insurance Settlements**  
> AgriVerify AI bridges the trust gap between farmers and insurance underwriters using high-resolution satellite imagery (Sentinel-2), geospatial boundary validation, historical agro-meteorological analytics, and automated claims workflow auditing.

---

## 🌟 Executive Summary & Value Proposition

Traditional crop insurance (e.g., PM Fasal Bima Yojana, multi-peril crop insurance) suffers from:
1. **Slow Ground Surveys:** Manual crop cutting experiments (CCE) take weeks to months.
2. **Area Discrepancies:** Inflated land declarations, overlapping plots, or non-existent fields.
3. **Yield Estimation Ambiguity:** Lack of empirical vegetation health data leading to claim disputes.
4. **Administrative Bottlenecks:** Claims getting stuck in bureaucratic pipelines without audit trails.

**AgriVerify AI solves this through three specialized engines:**
- 🛰️ **Engine 1: Farm Verification:** Satellite polygon delineation, Khasra land record cross-checking, and automatic area variance scoring (`Verified`, `Mismatch`, `Insufficient Data`, `Manual Review`).
- 🌾 **Engine 2: Crop Yield Verification:** Multi-temporal Sentinel-2 NDVI vegetative trajectory tracking, rainfall & temperature timeseries correlation, and machine learning yield loss benchmark estimation.
- ⏱️ **Engine 3: Insurance Process Audit:** Automated ingestion of claim logs to flag institutional delays, missing mandatory documents, and suspicious processing patterns.
- 🎯 **Unified Claim Workspace:** A single cockpit where insurance assessors examine AI-synthesized evidence and record legally defensible approval, rejection, or investigation decisions.

---

## 🗺️ Platform Sitemap & User Journeys

```
                                      AgriVerify AI
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
       Farmer Portal                                             Insurance Portal
   (Empowerment & Claim Filing)                                (Auditing & Settlement)
         │                                                         │
   ┌─────┴─────────────────────┐                             ┌─────┴──────────────────────┐
   │ • Landing Page            │                             │ • Overview Dashboard       │
   │ • Register / Login        │                             │ • Farmers & Farms Directory│
   │ • Farmer Dashboard        │                             │ • Claims Management Table  │
   │ • My Registered Farms     │                             │ • Unified Claim Workspace  │
   │ • Register New Farm (Map) │                             │ • Engine 1: Farm Verifier  │
   │ • Submit Claim Wizard     │                             │ • Engine 2: Yield Verifier │
   │ • Track Claim Status      │                             │ • Engine 3: Process Audit  │
   │ • Upload Land / Crop Docs │                             │ • Assessment PDF Reports   │
   └───────────────────────────┘                             └────────────────────────────┘
               │                                                         │
               └────────────────────────────┬────────────────────────────┘
                                            ▼
                               Shared Backend & Database
                       (FastAPI + PostgreSQL/PostGIS + Supabase)
     [Farm Polygons · Claims · Sentinel-2 NDVI · Weather · ML Models · Tamper-proof Audit Logs]
```

---

## 🏗️ Repository Architecture

The project is structured into clear, decoupled modules:

```
anterixbytehounds/
├── README.md                      # Master architecture, workflow & setup guide (this file)
├── docker-compose.yml              # Local container orchestration (DB, Backend, Frontend)
├── .gitignore                      # Git ignore patterns
│
├── docs/                           # Comprehensive Specifications & Blueprints
│   ├── ARCHITECTURE.md            # System architecture, sequence diagrams & data flows
│   ├── DATABASE_SCHEMA.md         # Full ERD and column definitions for all 13 tables
│   ├── VERIFICATION_ENGINES.md    # Mathematical models & algorithms for Engines 1, 2, & 3
│   └── API_SPECIFICATION.md       # OpenAPI/REST contract documentation
│
├── database/                       # Database Schemas, PostGIS & Seeds
│   ├── README.md                  # Database setup & Supabase configuration
│   └── migrations/
│       ├── 001_initial_schema.sql # 13 core relational & geospatial tables
│       └── 002_seed_demo_data.sql # Bhopal, Sehore & Raisen demo claims & geospatial datasets
│
├── backend/                        # Python FastAPI Backend
│   ├── README.md                  # Backend guide & virtualenv setup
│   ├── requirements.txt           # Python dependencies (FastAPI, PostGIS/GeoAlchemy2, Shapely, ReportLab)
│   ├── Dockerfile                 # Docker container specification
│   ├── .env.example               # Environment variables template
│   ├── main.py                    # Application entrypoint & middleware configuration
│   └── app/
│       ├── core/                  # Security (JWT, RBAC), Config & Database session
│       ├── models/                # SQLAlchemy & GeoAlchemy2 models
│       ├── schemas/               # Pydantic schemas (Request / Response DTOs)
│       ├── services/              # GIS calculations, Sentinel-2 NDVI, Weather, ML & PDF generation
│       └── api/v1/                # Modular REST API endpoints
│           ├── endpoints/
│           │   ├── auth.py        # Login, registration, demo account switcher
│           │   ├── farmers.py     # Farmer registry & profile management
│           │   ├── farms.py       # Farm registration, Khasra matching, polygon mapping
│           │   ├── claims.py      # Claims CRUD & CSV batch importer
│           │   ├── engine_farm.py # Engine 1: Farm verification endpoint
│           │   ├── engine_yield.py# Engine 2: Yield & NDVI verification endpoint
│           │   ├── engine_audit.py# Engine 3: Process audit & SLA anomaly detector
│           │   ├── workspace.py   # Unified Claim Workspace aggregation endpoint
│           │   └── reports.py     # Downloadable audit-ready PDF report builder
│           └── router.py          # Unified v1 API routing
│
├── frontend/                       # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── README.md                  # Frontend development & build instructions
│   ├── package.json               # Node dependencies (Leaflet, Recharts, Lucide, Tailwind)
│   ├── tsconfig.json              # TypeScript configuration
│   ├── vite.config.ts             # Vite bundler config
│   ├── tailwind.config.js         # Tailwind styling design tokens
│   └── src/
│       ├── types/                 # Strong TypeScript type definitions
│       ├── context/               # AuthContext (Role-based state management)
│       ├── services/              # Axios API client & mock data fallback
│       ├── components/            # Reusable UI widgets
│       │   ├── common/            # Navbar, Sidebar, Badges, Modals
│       │   ├── maps/              # Leaflet GIS farm polygon viewer & drawing canvas
│       │   └── charts/            # NDVI temporal line charts, weather rainfall graphs
│       └── pages/                 # Routing views
│           ├── LandingPage.tsx    # High-converting informative landing page
│           ├── auth/              # Login & Registration pages
│           ├── farmer/            # Farmer portal (Dashboard, Farms, Claims Wizard)
│           └── insurance/         # Insurance portal (Dashboard, Workspace, Engines, Reports)
│
├── ml_models/                      # Machine Learning Training & Inference
│   ├── README.md                  # Model benchmarks, feature engineering & notes
│   ├── train_yield_model.py       # XGBoost / Random Forest crop yield regressor
│   └── sample_data/               # Training dataset for Madhya Pradesh districts
│
└── sample_data/                    # Sample Datasets for Demo & Testing
    ├── README.md                  # Guide on loading test datasets
    ├── claims_import_sample.csv   # Claims management batch upload CSV
    ├── process_audit_sample.csv   # Process audit lifecycle timeline CSV
    └── farms_khasra_sample.geojson# Spatial geojson records for demo plots
```

---

## ⚙️ The Three Core Verification Engines

### 1. Engine 1: Farm Verification
- **Core Problem:** Does the claimed farm actually exist where reported, and does the declared acreage match ground geometry?
- **How it Works:** 
  1. Integrates cadastral Khasra survey records with interactive Leaflet/PostGIS polygon delineation.
  2. Calculates geodesic plot area using Shapely / PostGIS `ST_Area`.
  3. Computes discrepancy percentage:  
     $$\Delta_{\text{area}} = \frac{|\text{Declared Area} - \text{Geodesic Mapped Area}|}{\text{Declared Area}} \times 100$$
  4. Classifies status:
     - `Verified` ($\Delta \le 5\%$)
     - `Mismatch` ($\Delta > 15\%$)
     - `Manual Review` ($5\% < \Delta \le 15\%$)
     - `Insufficient Data` (missing boundary or cadastral record)

### 2. Engine 2: Crop Yield Verification
- **Core Problem:** Did a genuine crop loss event occur during the specified phenological window?
- **How it Works:**
  1. Pulls multi-date Sentinel-2 Bottom-of-Atmosphere (BOA) surface reflectance for the farm polygon.
  2. Computes Normalized Difference Vegetation Index (NDVI):
     $$\text{NDVI} = \frac{\text{NIR} - \text{RED}}{\text{NIR} + \text{RED}}$$
  3. Overlays daily precipitation and temperature timeseries (detecting droughts, unseasonal heatwaves, or flash flooding).
  4. Compares the farmer's self-reported harvest yield against an ML estimated yield (XGBoost model trained on historical agro-climatic indices).
  5. Outputs model confidence level and flags experimental estimates with clear disclaimers.

### 3. Engine 3: Insurance Process Audit
- **Core Problem:** Are claim settlements languishing in administrative delays, or showing signs of non-compliance?
- **How it Works:**
  1. Ingests claim lifecycle events (`Submitted` $\rightarrow$ `Survey Scheduled` $\rightarrow$ `Loss Assessed` $\rightarrow$ `Approved` $\rightarrow$ `Disbursed`).
  2. Measures Service Level Agreement (SLA) turnaround times at each milestone.
  3. Detects anomalies:
     - Regulatory breach (> 21 days from filing to assessment).
     - Missing mandatory evidentiary records (e.g. absent sowing certificate or photo proof).
     - Out-of-sequence timestamps (e.g. payment approved prior to survey date).

---

## 🎯 The Star of the System: Unified Claim Workspace

When an Insurance Officer opens a claim (e.g. `CLM001`), the **Unified Claim Workspace** synthesizes all dimensions onto a single decision-support screen:

| Section | Content |
|---|---|
| **1. Claim Overview** | Farmer identity, Policy No., crop type, claim amount, declared loss date |
| **2. Farm Verification** | Interactive satellite map, cadastral boundary, declared vs. mapped area comparison |
| **3. Yield Verification** | Multi-week NDVI curve vs. district normal, rainfall distribution, estimated vs. reported yield |
| **4. Process Audit** | Timeline stepper, stage delays, missing document alerts |
| **5. Evidence Locker** | Geotagged farmer photos, Khasra land deeds, sowing certificates, satellite snapshots |
| **6. Assessor Cockpit** | Assessor remarks textarea and action triggers: `Approve Claim`, `Reject Claim`, `Request More Info`, `Flag for Field Investigation` |

> ⚠️ **Key Safety Principle:** AI strictly **assists** assessment by organizing evidence and computing risk indicators; it **never automatically rejects or settles claims**. Final fiduciary decisions remain under human officer authority.

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **PostgreSQL 14+ with PostGIS** (or Docker)

### Option A: Running with Docker Compose (Recommended)
```bash
# Clone and enter directory
cd anterixbytehounds

# Spin up Database, FastAPI backend, and React frontend
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API Docs: `http://localhost:8000/docs`
- Database: `localhost:5432` (`postgres` / `agriverify_password`)

### Option B: Local Development

#### 1. Setup Database
```bash
# Connect to your PostgreSQL instance and execute:
psql -U postgres -d agriverify -f database/migrations/001_initial_schema.sql
psql -U postgres -d agriverify -f database/migrations/002_seed_demo_data.sql
```

#### 2. Setup Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
python main.py
```
Backend runs on `http://localhost:8000`.

#### 3. Setup Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 👥 Demo Credentials (Pre-seeded)

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Farmer (Demo)** | `farmer.rajesh@agriverify.in` | `Farmer@123` | Farm registration, Claim filing, Claim tracking |
| **Insurance Officer** | `officer.sharma@agriverify.in` | `Officer@123` | Claims management, 3 Engines, Workspace, PDF Reports |

---

## 📋 MVP Development Roadmap

- [x] **Phase 1: Architecture & Foundations** (Relational & geospatial schemas, API contract, folder layout, demo seed data).
- [x] **Phase 2: Core Verification Engines** (Cadastral polygon geometry, NDVI timeseries simulator, process SLA auditor).
- [x] **Phase 3: Unified Claim Workspace** (Evidence aggregation, interactive Leaflet view, decision recording).
- [x] **Phase 4: Reporting & Batch Processing** (CSV claim importer, downloadable summary assessment PDF).

---

## 📄 License & Attribution
Developed for the **AgriVerify AI** MVP Initiative. Built with open-source tools: FastAPI, React, Leaflet, PostGIS, Recharts, and Scikit-learn.
