from fastapi import APIRouter, Query
from typing import Dict, Any, List, Optional
from app.services.satellite_service import get_sentinel_ndvi_timeseries, search_sentinel2_scenes
from app.services.weather_service import get_weather_analytics
from app.services.ml_yield_service import predict_crop_yield_loss

router = APIRouter()

@router.get("/verify/{claim_id}")
def verify_yield(
    claim_id: str, 
    crop: str = "Wheat", 
    reported_loss_pct: float = 65.0, 
    district: str = "Bhopal"
):
    """
    Engine 2 Execution:
    - Multi-temporal Sentinel-2 L2A optical NDVI timeseries (B08 NIR / B04 Red)
    - Live STAC Sentinel-2 acquisition scene metadata & imagery footprints
    - Weather analytics & drought anomaly tracking
    - Machine learning yield prediction vs. reported loss (XGBoost)
    """
    ndvi_series = get_sentinel_ndvi_timeseries(claim_id, crop=crop)
    scenes = search_sentinel2_scenes(limit=4)
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
        "sentinel_satellite_mission": "Copernicus Sentinel-2 L2A (10m Optical)",
        "sentinel_scenes": scenes,
        "ndvi_timeseries": ndvi_series,
        "weather_analytics": weather_info,
        "yield_evaluation": yield_eval,
        "verdict": yield_eval["verdict"],
        "confidence_score": yield_eval["model_confidence_score"],
        "is_experimental": True,
        "disclaimer": "AI Model estimate (XGBoost). Subject to regional Crop Cutting Experiment (CCE) ground validation."
    }

@router.get("/scenes")
def get_sentinel_scenes(
    min_lon: float = Query(77.38, description="Bounding box min longitude"),
    min_lat: float = Query(23.23, description="Bounding box min latitude"),
    max_lon: float = Query(77.44, description="Bounding box max longitude"),
    max_lat: float = Query(23.28, description="Bounding box max latitude"),
    limit: int = Query(6, ge=1, le=20)
):
    """
    Directly queries Sentinel-2 L2A acquisitions over a spatial bounding box.
    """
    bbox = [min_lon, min_lat, max_lon, max_lat]
    scenes = search_sentinel2_scenes(bbox=bbox, limit=limit)
    return {
        "bbox": bbox,
        "total_scenes": len(scenes),
        "scenes": scenes
    }

@router.get("/credentials-status")
def get_credentials_status():
    """
    Returns verified connectivity & authentication telemetry for all external APIs:
    - AgroMonitoring API (Live field weather & soil)
    - Government MP Bhulekh API (Real-time Khasra cadastral verification)
    - Copernicus Sentinel API (10m L2A optical bands & NDVI)
    - NASA Earthdata / Earth Engine Platform (Remote sensing datasets)
    """
    from app.services.satellite_service import get_satellite_credentials_telemetry
    return get_satellite_credentials_telemetry()
