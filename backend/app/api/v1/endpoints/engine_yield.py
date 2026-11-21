from fastapi import APIRouter
from typing import Dict, Any
from app.services.satellite_service import get_sentinel_ndvi_timeseries
from app.services.weather_service import get_weather_analytics
from app.services.ml_yield_service import predict_crop_yield_loss

router = APIRouter()

@router.get("/verify/{claim_id}")
def verify_yield(claim_id: str, crop: str = "Wheat", reported_loss_pct: float = 65.0, district: str = "Bhopal"):
    """
    Engine 2 Execution:
    - Multi-temporal Sentinel-2 NDVI timeseries
    - Weather analytics & drought anomaly tracking
    - Machine learning yield prediction vs. reported loss
    """
    ndvi_series = get_sentinel_ndvi_timeseries(claim_id, crop=crop)
    weather_info = get_weather_analytics(district=district)
    yield_eval = predict_crop_yield_loss(
        crop=crop,
        reported_loss_pct=reported_loss_pct,
        mean_ndvi_peak=0.69,
        drought_deficit_pct=weather_info["rainfall_deficit_pct"]
    )

    return {
        "engine": "Engine 2: Crop Yield & Phenological Health Verifier",
        "claim_id": claim_id,
        "crop": crop,
        "district": district,
        "ndvi_timeseries": ndvi_series,
        "weather_analytics": weather_info,
        "yield_evaluation": yield_eval,
        "verdict": yield_eval["verdict"],
        "confidence_score": yield_eval["model_confidence_score"],
        "is_experimental": True,
        "disclaimer": "AI Model estimate (XGBoost). Subject to regional Crop Cutting Experiment (CCE) ground validation."
    }
