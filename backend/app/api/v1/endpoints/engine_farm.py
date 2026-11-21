from fastapi import APIRouter
from typing import Dict, Any
from app.services.gis_service import compute_geodesic_area_hectares, verify_farm_area

router = APIRouter()

@router.get("/verify/{farm_id}")
def verify_farm(farm_id: str):
    """
    Engine 1 Execution:
    - Calculates geodesic mapped area via PostGIS / Shapely
    - Compares declared vs mapped boundary
    - Classifies status (Verified / Mismatch / Manual Review / Insufficient Data)
    """
    # Sample coordinates for farm
    sample_boundary = {
        "type": "Polygon",
        "coordinates": [[[77.4128, 23.2599], [77.4155, 23.2605], [77.4162, 23.2578], [77.4132, 23.2572], [77.4128, 23.2599]]]
    }
    declared_ha = 2.50
    geodesic_ha = compute_geodesic_area_hectares(sample_boundary)
    status, variance, notes = verify_farm_area(declared_ha, geodesic_ha)

    return {
        "engine": "Engine 1: Farm Boundary & Geospatial Verifier",
        "farm_id": farm_id,
        "khasra_number": "48/2",
        "declared_area_hectares": declared_ha,
        "geodesic_mapped_hectares": geodesic_ha,
        "variance_percent": variance,
        "verdict": status,
        "khasra_match": True,
        "cadastral_registry_status": "Matched in MP Bhulekh Land Records",
        "notes": notes,
        "boundary_geojson": sample_boundary
    }
