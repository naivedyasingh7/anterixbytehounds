import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from typing import List, Dict, Any, Optional
from app.schemas.schemas import FarmCreate, FarmResponse
from app.core.security import require_roles, get_current_user_payload
from app.services.gis_service import (
    compute_geodesic_area_hectares, verify_farm_area, validate_polygon_geometry
)

router = APIRouter()

MOCK_FARMS = [
    {
        "id": "fa000001-0000-0000-0000-000000000001",
        "farmer_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "farmer_name": "Rajesh Kumar Patel",
        "farmer_code": "FAR-MP-BHP-001",
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
        "gps_center": {"latitude": 23.2588, "longitude": 77.4144},
        "boundary_geojson": {
            "type": "Polygon",
            "coordinates": [[[77.4128, 23.2599], [77.4155, 23.2605], [77.4162, 23.2578], [77.4132, 23.2572], [77.4128, 23.2599]]]
        },
        "documents": [
            {
                "id": "doc-khasra-001",
                "name": "Bhopal_Khasra_48_2_Certified.pdf",
                "type": "Khasra Deed",
                "verification_status": "Verified",
                "uploaded_at": "2026-10-15T10:30:00Z"
            }
        ]
    },
    {
        "id": "fa000002-0000-0000-0000-000000000002",
        "farmer_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "farmer_name": "Sunita Bai Chouhan",
        "farmer_code": "FAR-MP-SEH-002",
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
        "gps_center": {"latitude": 23.1938, "longitude": 77.0870},
        "boundary_geojson": {
            "type": "Polygon",
            "coordinates": [[[77.0850, 23.1950], [77.0885, 23.1960], [77.0890, 23.1925], [77.0855, 23.1918], [77.0850, 23.1950]]]
        },
        "documents": []
    },
    {
        "id": "fa000003-0000-0000-0000-000000000003",
        "farmer_id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
        "farmer_name": "Mohan Lal Verma",
        "farmer_code": "FAR-MP-RSN-003",
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
        "gps_center": {"latitude": 23.3310, "longitude": 77.7825},
        "boundary_geojson": {
            "type": "Polygon",
            "coordinates": [[[77.7810, 23.3320], [77.7835, 23.3325], [77.7840, 23.3300], [77.7815, 23.3295], [77.7810, 23.3320]]]
        },
        "documents": []
    }
]

@router.get("/")
def list_farms(
    district: Optional[str] = None,
    crop: Optional[str] = None,
    status_filter: Optional[str] = None
):
    """Retrieves all registered farm parcels with GeoJSON boundaries and acreage."""
    results = MOCK_FARMS
    if district and district != "All":
        results = [f for f in results if f["district"].lower() == district.lower()]
    if crop and crop != "All":
        results = [f for f in results if f["current_crop"].lower() == crop.lower()]
    if status_filter and status_filter != "All":
        results = [f for f in results if f["verification_status"].lower() == status_filter.lower()]
    return results

@router.get("/{farm_id}")
def get_farm(farm_id: str):
    """Retrieves single farm parcel details by ID."""
    matched = next((f for f in MOCK_FARMS if f["id"] == farm_id or farm_id in f["id"]), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Farm {farm_id} not found")
    return matched

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_farm(
    farm: FarmCreate,
    current_user: Dict[str, Any] = Depends(require_roles(["farmer", "admin"]))
):
    """
    Registers a farm parcel:
    - Validates GeoJSON polygon geometry & coordinate bounds
    - Calculates geodesic area in hectares via PostGIS / Shapely (EPSG:32643)
    - Compares declared vs mapped boundary
    - Stores GPS centroid and links to farmer
    """
    # 1. Geometry Validation
    is_valid, error_msg = validate_polygon_geometry(farm.boundary_geojson)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid farm polygon geometry: {error_msg}"
        )

    # 2. Geodesic area calculation
    geodesic_ha = compute_geodesic_area_hectares(farm.boundary_geojson)
    status_val, variance, notes, indicators = verify_farm_area(
        declared_ha=farm.declared_area_hectares,
        geodesic_ha=geodesic_ha
    )

    # 3. Calculate GPS centroid
    coords = farm.boundary_geojson.get("coordinates", [[]])[0]
    lons = [pt[0] for pt in coords]
    lats = [pt[1] for pt in coords]
    center_lat = round(sum(lats) / len(lats), 6) if lats else 23.25
    center_lon = round(sum(lons) / len(lons), 6) if lons else 77.41

    farmer_name = current_user.get("full_name", "Rajesh Kumar Patel")
    farmer_id = current_user.get("user_id", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")

    new_farm = {
        "id": f"fa{len(MOCK_FARMS)+1:06d}-0000-0000-0000-000000000001",
        "farmer_id": farmer_id,
        "farmer_name": farmer_name,
        "farmer_code": current_user.get("farmer_code", "FAR-MP-BHP-001"),
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
        "gps_center": {"latitude": center_lat, "longitude": center_lon},
        "verification_status": status_val,
        "discrepancy_indicators": indicators,
        "documents": [],
        "created_at": datetime.utcnow().isoformat()
    }
    MOCK_FARMS.append(new_farm)
    return new_farm

@router.put("/{farm_id}")
def update_farm(
    farm_id: str,
    update_data: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(require_roles(["farmer", "insurance_officer", "admin"]))
):
    """Updates farm details (crop, soil type, name)."""
    matched = next((f for f in MOCK_FARMS if f["id"] == farm_id or farm_id in f["id"]), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Farm {farm_id} not found")

    allowed_fields = ["farm_name", "current_crop", "season", "soil_type", "declared_area_hectares"]
    for field in allowed_fields:
        if field in update_data:
            matched[field] = update_data[field]

    return {
        "status": "success",
        "message": f"Farm '{matched['farm_name']}' updated successfully.",
        "farm": matched
    }

@router.post("/{farm_id}/documents")
async def upload_farm_document(
    farm_id: str,
    document_type: str = Form("Khasra Record"),
    file: UploadFile = File(...)
):
    """Uploads and links land-record / Khasra deed to the farm parcel."""
    matched = next((f for f in MOCK_FARMS if f["id"] == farm_id or farm_id in f["id"]), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Farm {farm_id} not found")

    content = await file.read()
    doc_entry = {
        "id": f"doc-{uuid.uuid4().hex[:8]}",
        "name": file.filename,
        "type": document_type,
        "size_bytes": len(content),
        "mime_type": file.content_type,
        "verification_status": "Verified",
        "uploaded_at": datetime.utcnow().isoformat()
    }
    matched.setdefault("documents", []).append(doc_entry)

    return {
        "status": "success",
        "message": f"Document '{file.filename}' uploaded and linked to Khasra {matched['khasra_number']}.",
        "document": doc_entry
    }

@router.get("/{farm_id}/documents")
def list_farm_documents(farm_id: str):
    """Lists all verified land documents associated with this farm."""
    matched = next((f for f in MOCK_FARMS if f["id"] == farm_id or farm_id in f["id"]), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Farm {farm_id} not found")
    return {
        "farm_id": matched["id"],
        "khasra_number": matched["khasra_number"],
        "documents": matched.get("documents", [])
    }
