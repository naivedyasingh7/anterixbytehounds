# AgriVerify AI – REST API Specification

Base URL: `/api/v1`

---

## 1. Authentication (`/api/v1/auth`)

### `POST /auth/login`
- **Request:** `{ "email": "officer.sharma@agriverify.in", "password": "Password123" }`
- **Response:** `{ "access_token": "jwt...", "token_type": "bearer", "user": { "id": "uuid", "role": "insurance_officer", "full_name": "Sharma", "email": "..." } }`

### `POST /auth/register`
- **Request:** `{ "email": "...", "password": "...", "full_name": "...", "phone": "...", "role": "farmer" }`
- **Response:** `201 Created` with User object.

### `GET /auth/demo-accounts`
- **Response:** Pre-configured demo accounts for quick role-switching in the UI.

---

## 2. Farmers & Farms (`/api/v1/farmers`, `/api/v1/farms`)

### `GET /farmers/me`
- Returns profile of the authenticated farmer.

### `GET /farms`
- Query params: `farmer_id`, `district`
- Returns list of registered farms with Khasra and GeoJSON boundaries.

### `POST /farms`
- **Request:** 
  ```json
  {
    "farm_name": "East Plot 12",
    "khasra_number": "142/2",
    "declared_area_hectares": 3.5,
    "current_crop": "Wheat",
    "season": "Rabi",
    "village": "Berasia",
    "district": "Bhopal",
    "boundary_geojson": { "type": "Polygon", "coordinates": [...] }
  }
  ```
- **Response:** Created farm with geodesic area computed and initial verification status.

---

## 3. Claims Management (`/api/v1/claims`)

### `GET /claims`
- Query params: `status`, `district`, `crop`, `search`, `page`, `limit`
- **Response:** Paginated list of claims with metrics.

### `GET /claims/metrics`
- Returns aggregated statistics: `total_claims`, `pending_claims`, `verified_claims`, `flagged_claims`, `delayed_claims`, `district_distribution`.

### `POST /claims`
- Files a new claim from Farmer Portal with incident date, cause, and documents.

### `POST /claims/import-csv`
- Uploads CSV file (multipart/form-data) to batch import claims into the system.

### `GET /claims/{claim_id}`
- Detailed view of an individual claim.

---

## 4. Verification Engines (`/api/v1/engines`)

### `POST /engines/farm-verify/{farm_id}`
- Triggers **Engine 1**.
- Calculates geodesic polygon area, cross-checks declared Khasra area, returns variance % and status (`Verified`, `Mismatch`, `Manual Review`).

### `GET /engines/yield-verify/{claim_id}`
- Triggers **Engine 2**.
- Returns Sentinel-2 NDVI timeseries, rainfall/temperature observations, and XGBoost predicted yield vs. reported yield.

### `POST /engines/process-audit`
- Triggers **Engine 3**.
- Accepts claim timeline events or uploaded CSV, detects SLA delays, missing records, and anomalies.

---

## 5. Unified Claim Workspace (`/api/v1/workspace`)

### `GET /workspace/{claim_id}`
- Aggregates all data points needed by an Insurance Officer:
  - `claim_overview`
  - `farm_verification` (Engine 1 output + GeoJSON polygon)
  - `yield_verification` (Engine 2 output + NDVI chart series)
  - `process_audit` (Engine 3 output + Timeline milestones)
  - `evidence_documents` (Photos, Khasra, certificates)
  - `assessment` (Current decision or previous remarks)

### `POST /workspace/{claim_id}/decision`
- Records assessor action:
  ```json
  {
    "decision": "Approved", // Approved | Rejected | Flagged_Investigation | More_Info_Required
    "approved_amount_inr": 185000,
    "remarks": "Satellite NDVI confirms severe moisture stress in Sep 2026. Area variance within 2%."
  }
  ```

---

## 6. Reports (`/api/v1/reports`)

### `GET /reports/{claim_id}/pdf`
- Generates and streams a downloadable, high-fidelity PDF claim dossier with farm coordinates, NDVI graphs, audit logs, and officer signature.
