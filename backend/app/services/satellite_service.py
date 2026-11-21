from typing import List, Dict, Any
from datetime import date, timedelta

def get_sentinel_ndvi_timeseries(farm_id: str, crop: str = "Wheat") -> List[Dict[str, Any]]:
    """
    Simulates or pulls 10-day Sentinel-2 L2A BOA NDVI observations for the field.
    Captures phenological growth curve with potential drought or damage dip.
    """
    # Realistic 10-week timeline for central MP agricultural cycle
    base_dates = [
        ("2026-09-01", 0.28, "Baseline Germination"),
        ("2026-09-10", 0.42, "Vegetative Canopy Development"),
        ("2026-09-20", 0.58, "Early Tillering"),
        ("2026-09-30", 0.69, "Peak Vegetative Greenness"),
        ("2026-10-10", 0.51, "Moisture Stress Inception"),
        ("2026-10-20", 0.36, "Acute Canopy Wilt (Drought Effect)"),
        ("2026-10-30", 0.25, "Premature Senescence"),
        ("2026-11-10", 0.21, "Harvest Failure State"),
    ]

    district_normal_ndvi = [0.30, 0.45, 0.60, 0.72, 0.74, 0.71, 0.55, 0.35]

    series = []
    for idx, (dt_str, observed_val, note) in enumerate(base_dates):
        normal_val = district_normal_ndvi[idx]
        anomaly = round(observed_val - normal_val, 3)
        series.append({
            "date": dt_str,
            "mean_ndvi": observed_val,
            "district_normal_ndvi": normal_val,
            "anomaly": anomaly,
            "cloud_coverage_pct": 1.2 if idx % 2 == 0 else 3.5,
            "phenology_stage": note
        })

    return series
