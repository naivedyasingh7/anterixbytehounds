from fastapi import APIRouter
from typing import List, Dict, Any
from app.schemas.schemas import FarmCreate, FarmResponse
from app.services.gis_service import compute_geodesic_area_hectares, verify_farm_area

router = APIRouter()

MOCK_FARMS = [
    {
        "id": "fa000001-0000-0000-0000-000000000001",
        "farmer_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "farmer_name": "Rajesh Kumar Patel",
        "farm_name": "Patel Khasra 48/2 North Plot",
        "khasra_number": "48/2",
        "declared_area_hectares": 2.50,
        "geodesic_area_hectares": 2.462,
        "area_variance_percent": 1.52,
        "current_crop": "Wheat",
        "season": "Rabi",
        "village": "Berasia",
        "district": "Bhopal",
        "soil_type": "Deep Black Cotton Soil",
        "verification_status": "Verified",
        "boundary_geojson": {
            "type": "Polygon",
            "coordinates": [[[77.4128, 23.2599], [77.4155, 23.2605], [77.4162, 23.2578], [77.4132, 23.2572], [77.4128, 23.2599]]]
        }
    },
    {
        "id": "fa000002-0000-0000-0000-000000000002",
        "farmer_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "farmer_name": "Sunita Bai Chouhan",
        "farm_name": "Chouhan Riverbank Parcel",
        "khasra_number": "112/1",
        "declared_area_hectares": 3.80,
        "geodesic_area_hectares": 3.751,
        "area_variance_percent": 1.29,
        "current_crop": "Soybean",
        "season": "Kharif",
        "village": "Ashta",
        "district": "Sehore",
        "soil_type": "Medium Black Soil",
        "verification_status": "Verified",
        "boundary_geojson": {
            "type": "Polygon",
            "coordinates": [[[77.0850, 23.1950], [77.0885, 23.1960], [77.0890, 23.1925], [77.0855, 23.1918], [77.0850, 23.1950]]]
        }
    },
    {
        "id": "fa000003-0000-0000-0000-000000000003",
        "farmer_id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
        "farmer_name": "Mohan Lal Verma",
        "farm_name": "Verma Hillside Terrace",
        "khasra_number": "95/4",
        "declared_area_hectares": 4.20,
        "geodesic_area_hectares": 2.304,
        "area_variance_percent": 45.14,
        "current_crop": "Paddy",
        "season": "Kharif",
        "village": "Gairatganj",
        "district": "Raisen",
        "soil_type": "Red and Yellow Alluvial Soil",
        "verification_status": "Mismatch",
        "boundary_geojson": {
            "type": "Polygon",
            "coordinates": [[[77.7810, 23.3320], [77.7835, 23.3325], [77.7840, 23.3300], [77.7815, 23.3295], [77.7810, 23.3320]]]
        }
    }
]

@router.get("/")
def list_farms():
    return MOCK_FARMS

@router.post("/")
def create_farm(farm: FarmCreate):
    geodesic_ha = compute_geodesic_area_hectares(farm.boundary_geojson)
    status, variance, _ = verify_farm_area(farm.declared_area_hectares, geodesic_ha)

    new_farm = {
        "id": f"fa{len(MOCK_FARMS)+1:06d}-0000-0000-0000-000000000001",
        "farmer_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "farmer_name": "Rajesh Kumar Patel",
        "farm_name": farm.farm_name,
        "khasra_number": farm.khasra_number,
        "declared_area_hectares": farm.declared_area_hectares,
        "geodesic_area_hectares": geodesic_ha,
        "area_variance_percent": variance,
        "current_crop": farm.current_crop,
        "season": farm.season,
        "soil_type": farm.soil_type or "Loamy",
        "village": "Berasia",
        "district": "Bhopal",
        "boundary_geojson": farm.boundary_geojson,
        "verification_status": status
    }
    MOCK_FARMS.append(new_farm)
    return new_farm
