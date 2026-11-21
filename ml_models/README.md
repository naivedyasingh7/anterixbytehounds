# AgriVerify AI – Machine Learning & Yield Estimation Models

This folder contains the training scripts, benchmark datasets, and model serialization pipelines for **Engine 2 (Crop Yield Verification)**.

## Key Features Used in the Model:
- **`peak_ndvi`**: Maximum canopy greenness captured by Sentinel-2 L2A BOA index.
- **`rainfall_mm`**: Cumulative seasonal precipitation (IMD / CHIRPS).
- **`consecutive_dry_days`**: Drought indicator representing consecutive days with rainfall < 2.5 mm.
- **`mean_temp_c`**: Average surface temperature during the vegetative & flowering stages.
- **`soil_moisture_index`**: Surface volumetric soil water content.

## Regulatory & Ethical Notice:
All ML-derived yield metrics on the AgriVerify AI platform are tagged with `is_experimental: true`. Under insurance regulations, algorithmic estimates serve as advisory evidence to aid human assessors and do not substitute statutory Crop Cutting Experiments (CCE) until calibrated by regional state agricultural authorities.
