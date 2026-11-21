# AgriVerify AI – Core Verification Engines Specification

The AgriVerify AI platform is anchored by three analytical engines that independently assess distinct risk factors of a crop insurance claim.

---

## 1. Engine 1: Farm Boundary & Geospatial Verification

### Objective
Ensure that the agricultural land parcel claimed by the farmer exists, matches legal cadastral records (Khasra), and does not exceed declared boundary dimensions.

### Methodology
1. **Cadastral Record Ingestion:**
   The farmer inputs their Khasra / Survey Number (e.g. `Khasra 42/1`).
2. **Interactive Boundary Mapping:**
   Using the Leaflet map tool, the farmer or field agent delineates the plot vertices over high-resolution satellite imagery.
3. **Geodesic Area Calculation:**
   Using PostGIS `ST_Area(ST_Transform(geom, 32643))` (UTM Zone 43N for central India) or Shapely ellipsoidal calculation:
   $$\text{Area}_{\text{hectares}} = \frac{\iint_{\text{Polygon}} dA}{10,000}$$
4. **Variance Computation:**
   $$\text{Variance (\%)} = \left| \frac{\text{Declared Area} - \text{Mapped Area}}{\text{Declared Area}} \right| \times 100$$
5. **Decision Matrix:**
   - **`Verified`:** $\text{Variance} \le 5.0\%$
   - **`Manual Review`:** $5.0\% < \text{Variance} \le 15.0\%$
   - **`Mismatch`:** $\text{Variance} > 15.0\%$ (Potential inflated land declaration)
   - **`Insufficient Data`:** Boundary polygon unclosed or Khasra record missing.

---

## 2. Engine 2: Crop Yield & Phenological Health Verification

### Objective
Empirically verify whether the claimed crop failure occurred due to environmental adversity (drought, flooding, unseasonal heat) or if the vegetation followed a normal vegetative curve.

### Methodology
1. **Sentinel-2 Multi-Spectral Surface Reflectance:**
   Extracts Bottom-of-Atmosphere (BOA) pixel values inside the farm polygon across the crop phenological window (Sowing $\rightarrow$ Vegetative $\rightarrow$ Flowering $\rightarrow$ Maturity $\rightarrow$ Harvest).
2. **NDVI Time-Series Construction:**
   $$\text{NDVI}_t = \frac{\text{B8}_{\text{NIR}} - \text{B4}_{\text{Red}}}{\text{B8}_{\text{NIR}} + \text{B4}_{\text{Red}}}$$
   - Healthy crop threshold: $\text{NDVI} > 0.60$ during peak vegetative phase.
   - Stressed / Damaged crop: $\text{NDVI}$ premature crash to $< 0.35$.
3. **Agro-Meteorological Correlation:**
   Integrates rainfall ($\text{mm}$) and surface temperature ($^\circ\text{C}$) data:
   - Cumulative dry spells ($> 21$ consecutive rainless days during critical tillering).
   - Extreme heat spikes during flowering.
4. **Yield Prediction Model (XGBoost Regressor):**
   Predicts estimated yield $\hat{Y}$ in $\text{kg/ha}$:
   $$\hat{Y} = f\left(\text{NDVI}_{\text{max}}, \text{NDVI}_{\text{AUC}}, \sum \text{Rainfall}, T_{\text{mean}}, \text{Soil Type}, \text{District}\right)$$
5. **Output Metrics:**
   - Reported Yield vs. Estimated Yield ($\text{kg/ha}$).
   - Discrepancy & Estimated Yield Loss ($\% $).
   - Model Confidence Score ($0.0 - 1.0$).
   - **Experimental Notice:** Explicit badge clarifying that model estimates are advisory pending regional CCE ground-truth calibration.

---

## 3. Engine 3: Insurance Process & SLA Audit

### Objective
Prevent bureaucratic delays and identify operational anomalies, missing evidence, or potential fraud in the claim settlement timeline.

### Methodology
1. **Process Milestone Graph:**
   Tracks the lifecycle of claim events:
   $$\text{Submission} \xrightarrow{\Delta t_1} \text{Survey/Engine Run} \xrightarrow{\Delta t_2} \text{Assessment} \xrightarrow{\Delta t_3} \text{Disbursement}$$
2. **SLA Rules & Thresholds:**
   - **Submission to Verification:** Normal $\le 7$ days; Delayed $> 14$ days.
   - **Verification to Assessment:** Normal $\le 10$ days; Critical Delay $> 21$ days.
   - **Total Settlement Cycle:** Maximum statutory limit $30$ days.
3. **Anomaly & Missing Record Detection:**
   - **Missing Mandatory Artifacts:** Absence of Khasra deed or geotagged field photos.
   - **Retroactive Timestamping:** Events logged out of chronological order.
   - **Cluster Spikes:** Abnormally high claim volumes concentrated in an isolated village without corresponding weather events.
4. **Output Classification:**
   - `Compliant (On Time)`
   - `Delayed Processing (SLA Breach)`
   - `Missing Evidentiary Documentation`
   - `Anomaly Flagged for Formal Investigation`
