from typing import Dict, Any, List

def get_weather_analytics(district: str) -> Dict[str, Any]:
    """
    Returns meteorological timeseries and drought anomaly index for the district.
    """
    weekly_weather = [
        {"week": "Sep W1", "rainfall_mm": 35.4, "temp_max": 30.5, "soil_moisture": 0.68},
        {"week": "Sep W2", "rainfall_mm": 28.0, "temp_max": 31.0, "soil_moisture": 0.62},
        {"week": "Sep W3", "rainfall_mm": 12.5, "temp_max": 32.2, "soil_moisture": 0.51},
        {"week": "Sep W4", "rainfall_mm": 0.0, "temp_max": 34.0, "soil_moisture": 0.38},
        {"week": "Oct W1", "rainfall_mm": 0.0, "temp_max": 36.5, "soil_moisture": 0.22},
        {"week": "Oct W2", "rainfall_mm": 0.0, "temp_max": 37.1, "soil_moisture": 0.14},
        {"week": "Oct W3", "rainfall_mm": 0.0, "temp_max": 35.8, "soil_moisture": 0.10},
        {"week": "Oct W4", "rainfall_mm": 2.1, "temp_max": 33.0, "soil_moisture": 0.09},
    ]

    total_rain = sum(w["rainfall_mm"] for w in weekly_weather)
    consecutive_dry_days = 31

    return {
        "district": district,
        "total_season_rainfall_mm": round(total_rain, 1),
        "district_normal_rainfall_mm": 160.0,
        "rainfall_deficit_pct": 51.3,
        "consecutive_dry_days": consecutive_dry_days,
        "extreme_heat_days": 12,
        "drought_severity": "Moderate to Severe Dry Spell",
        "weekly_records": weekly_weather
    }
