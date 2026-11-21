import { Claim, Farm, UnifiedWorkspaceData } from '../types';

export const MOCK_CLAIMS_DATA: Claim[] = [
  {
    id: "c0000001",
    claim_number: "CLM001",
    farmer_name: "Rajesh Kumar Patel",
    farmer_code: "FAR-MP-BHP-001",
    district: "Bhopal",
    crop: "Wheat",
    claimed_amount_inr: 113750,
    loss_cause: "Drought & Prolonged Dry Spell",
    claimed_loss_percentage: 65,
    status: "Pending",
    incident_date: "2026-11-05",
    khasra: "48/2",
    policy_number: "POL-PMFBY-BHP-2026-88"
  },
  {
    id: "c0000002",
    claim_number: "CLM002",
    farmer_name: "Sunita Bai Chouhan",
    farmer_code: "FAR-MP-SEH-002",
    district: "Sehore",
    crop: "Soybean",
    claimed_amount_inr: 182400,
    loss_cause: "Unseasonal Excessive Rain & Inundation",
    claimed_loss_percentage: 80,
    status: "Verified",
    incident_date: "2026-10-18",
    khasra: "112/1",
    policy_number: "POL-PMFBY-SEH-2026-14"
  },
  {
    id: "c0000003",
    claim_number: "CLM003",
    farmer_name: "Mohan Lal Verma",
    farmer_code: "FAR-MP-RSN-003",
    district: "Raisen",
    crop: "Paddy",
    claimed_amount_inr: 175000,
    loss_cause: "Pest Blight & False Smut",
    claimed_loss_percentage: 70,
    status: "Flagged",
    incident_date: "2026-10-25",
    khasra: "95/4",
    policy_number: "POL-PMFBY-RSN-2026-92"
  }
];

export const MOCK_FARMS_DATA: Farm[] = [
  {
    id: "fa000001",
    farmer_id: "aaaaaaaa",
    farmer_name: "Rajesh Kumar Patel",
    farm_name: "Patel Khasra 48/2 North Plot",
    khasra_number: "48/2",
    declared_area_hectares: 2.50,
    geodesic_area_hectares: 2.462,
    area_variance_percent: 1.52,
    current_crop: "Wheat",
    season: "Rabi",
    village: "Berasia",
    district: "Bhopal",
    soil_type: "Deep Black Cotton Soil",
    verification_status: "Verified",
    boundary_geojson: {
      type: "Polygon",
      coordinates: [[[77.4128, 23.2599], [77.4155, 23.2605], [77.4162, 23.2578], [77.4132, 23.2572], [77.4128, 23.2599]]]
    }
  },
  {
    id: "fa000002",
    farmer_id: "bbbbbbbb",
    farmer_name: "Sunita Bai Chouhan",
    farm_name: "Chouhan Riverbank Parcel",
    khasra_number: "112/1",
    declared_area_hectares: 3.80,
    geodesic_area_hectares: 3.751,
    area_variance_percent: 1.29,
    current_crop: "Soybean",
    season: "Kharif",
    village: "Ashta",
    district: "Sehore",
    soil_type: "Medium Black Soil",
    verification_status: "Verified",
    boundary_geojson: {
      type: "Polygon",
      coordinates: [[[77.0850, 23.1950], [77.0885, 23.1960], [77.0890, 23.1925], [77.0855, 23.1918], [77.0850, 23.1950]]]
    }
  },
  {
    id: "fa000003",
    farmer_id: "cccccccc",
    farmer_name: "Mohan Lal Verma",
    farm_name: "Verma Hillside Terrace",
    khasra_number: "95/4",
    declared_area_hectares: 4.20,
    geodesic_area_hectares: 2.304,
    area_variance_percent: 45.14,
    current_crop: "Paddy",
    season: "Kharif",
    village: "Gairatganj",
    district: "Raisen",
    soil_type: "Red and Yellow Alluvial Soil",
    verification_status: "Mismatch",
    boundary_geojson: {
      type: "Polygon",
      coordinates: [[[77.7810, 23.3320], [77.7835, 23.3325], [77.7840, 23.3300], [77.7815, 23.3295], [77.7810, 23.3320]]]
    }
  }
];

export const MOCK_WORKSPACE_CLM001: UnifiedWorkspaceData = {
  claim_overview: {
    claim_number: "CLM001",
    farmer_name: "Rajesh Kumar Patel",
    farmer_code: "FAR-MP-BHP-001",
    policy_number: "POL-PMFBY-BHP-2026-88",
    village: "Berasia",
    district: "Bhopal",
    state: "Madhya Pradesh",
    crop: "Wheat",
    season: "Rabi 2026",
    claimed_amount_inr: 113750,
    sum_insured_inr: 175000,
    loss_cause: "Drought & Prolonged Dry Spell",
    claimed_loss_percentage: 65,
    incident_date: "2026-11-05",
    status: "Pending"
  },
  farm_verification: {
    khasra_number: "48/2",
    declared_area_ha: 2.50,
    geodesic_area_ha: 2.462,
    variance_percent: 1.52,
    verdict: "Verified",
    notes: "Area matches within standard cadastral tolerance (1.52% variance). Khasra 48/2 ownership confirmed in MP Bhulekh.",
    boundary_geojson: {
      type: "Polygon",
      coordinates: [[[77.4128, 23.2599], [77.4155, 23.2605], [77.4162, 23.2578], [77.4132, 23.2572], [77.4128, 23.2599]]]
    },
    land_record_matched: true
  },
  yield_verification: {
    sentinel_satellite_mission: "Copernicus Sentinel-2 L2A (10m Optical)",
    sentinel_scenes: [
      {
        scene_id: "S2A_43QGF_20241126_0_L2A",
        observation_date: "2026-11-26",
        satellite: "Sentinel-2A",
        mgrs_tile: "43QGF",
        cloud_coverage_percent: 0.09,
        sun_elevation_deg: 48.2,
        thumbnail_url: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/43/Q/GF/2024/11/S2A_43QGF_20241126_0_L2A/thumbnail.jpg",
        visual_tci_url: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/43/Q/GF/2024/11/S2A_43QGF_20241126_0_L2A/TCI.tif",
        band_b04_red_url: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/43/Q/GF/2024/11/S2A_43QGF_20241126_0_L2A/B04.tif",
        band_b08_nir_url: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/43/Q/GF/2024/11/S2A_43QGF_20241126_0_L2A/B08.tif",
        status: "Available in STAC Catalog"
      },
      {
        scene_id: "S2B_43QGF_20241121_0_L2A",
        observation_date: "2026-11-21",
        satellite: "Sentinel-2B",
        mgrs_tile: "43QGF",
        cloud_coverage_percent: 0.31,
        sun_elevation_deg: 49.5,
        thumbnail_url: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/43/Q/GF/2024/11/S2B_43QGF_20241121_0_L2A/thumbnail.jpg",
        visual_tci_url: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/43/Q/GF/2024/11/S2B_43QGF_20241121_0_L2A/TCI.tif",
        band_b04_red_url: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/43/Q/GF/2024/11/S2B_43QGF_20241121_0_L2A/B04.tif",
        band_b08_nir_url: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/43/Q/GF/2024/11/S2B_43QGF_20241121_0_L2A/B08.tif",
        status: "Available in STAC Catalog"
      }
    ],
    ndvi_timeline: [
      { date: "Sep 01", mean_ndvi: 0.28, district_normal_ndvi: 0.30, anomaly: -0.02, phenology_stage: "Germination" },
      { date: "Sep 10", mean_ndvi: 0.42, district_normal_ndvi: 0.45, anomaly: -0.03, phenology_stage: "Early Vegetative" },
      { date: "Sep 20", mean_ndvi: 0.58, district_normal_ndvi: 0.60, anomaly: -0.02, phenology_stage: "Tillering" },
      { date: "Sep 30", mean_ndvi: 0.69, district_normal_ndvi: 0.72, anomaly: -0.03, phenology_stage: "Peak Canopy" },
      { date: "Oct 10", mean_ndvi: 0.51, district_normal_ndvi: 0.74, anomaly: -0.23, phenology_stage: "Moisture Stress" },
      { date: "Oct 20", mean_ndvi: 0.36, district_normal_ndvi: 0.71, anomaly: -0.35, phenology_stage: "Severe Wilt (Drought)" },
      { date: "Oct 30", mean_ndvi: 0.25, district_normal_ndvi: 0.55, anomaly: -0.30, phenology_stage: "Premature Senescence" },
      { date: "Nov 10", mean_ndvi: 0.21, district_normal_ndvi: 0.35, anomaly: -0.14, phenology_stage: "Crop Failure" }
    ],
    weather_summary: {
      district: "Bhopal",
      total_season_rainfall_mm: 78.0,
      district_normal_rainfall_mm: 160.0,
      rainfall_deficit_pct: 51.3,
      consecutive_dry_days: 31,
      extreme_heat_days: 12,
      drought_severity: "Severe Dry Spell (31 rainless days)",
      weekly_records: [
        { week: "Sep W1", rainfall_mm: 35.4, temp_max: 30.5, soil_moisture: 0.68 },
        { week: "Sep W2", rainfall_mm: 28.0, temp_max: 31.0, soil_moisture: 0.62 },
        { week: "Sep W3", rainfall_mm: 12.5, temp_max: 32.2, soil_moisture: 0.51 },
        { week: "Sep W4", rainfall_mm: 0.0, temp_max: 34.0, soil_moisture: 0.38 },
        { week: "Oct W1", rainfall_mm: 0.0, temp_max: 36.5, soil_moisture: 0.22 },
        { week: "Oct W2", rainfall_mm: 0.0, temp_max: 37.1, soil_moisture: 0.14 },
        { week: "Oct W3", rainfall_mm: 0.0, temp_max: 35.8, soil_moisture: 0.10 },
        { week: "Oct W4", rainfall_mm: 2.1, temp_max: 33.0, soil_moisture: 0.09 }
      ]
    },
    yield_evaluation: {
      crop_type: "Wheat",
      historical_benchmark_yield_kg_ha: 3800,
      reported_yield_kg_ha: 1300,
      estimated_yield_kg_ha: 1420,
      reported_loss_percent: 65.0,
      estimated_loss_percent: 62.6,
      loss_discrepancy_percent: 2.4,
      model_confidence_score: 0.89,
      is_experimental: true,
      verdict: "Strong Environmental Evidence of Loss",
      regulatory_disclaimer: "Experimental advisory model. Calibrated with Sentinel-2 L2A BOA reflectance & IMD meteorological grids."
    },
    verdict: "Severe Stress Confirmed",
    confidence_score: 0.89
  },
  process_audit: {
    claim_number: "CLM001",
    total_turnaround_days: 4,
    stages_completed: 4,
    sla_status: "On Time",
    missing_records: [],
    anomalies_detected: [],
    timeline_events: [
      { stage: "Submission", date: "2026-11-06 10:30", status: "Completed", sla_days: 1 },
      { stage: "Document Verification", date: "2026-11-08 14:15", status: "Completed", sla_days: 2 },
      { stage: "Farm Verification (E1)", date: "2026-11-09 11:00", status: "Completed", sla_days: 1 },
      { stage: "Yield Verification (E2)", date: "2026-11-10 16:45", status: "Completed", sla_days: 1 },
      { stage: "Officer Assessment", date: "Pending", status: "In Progress", sla_days: 0 }
    ],
    audit_health_score: 95
  },
  evidence_locker: [
    { type: "Khasra Deed", name: "Bhopal_Khasra_48_2_Certified.pdf", size: "1.2 MB", status: "Verified" },
    { type: "Sowing Certificate", name: "Panchayat_Sowing_Receipt_2026.pdf", size: "450 KB", status: "Verified" },
    { type: "Field Photo", name: "Geotagged_Field_Crop_Stress.jpg", size: "2.8 MB", status: "Geotag Matched" },
    { type: "Satellite Snapshot", name: "Sentinel2_FalseColor_B08_B04.png", size: "3.1 MB", status: "Processed" }
  ],
  assessment: {
    decision: "Pending Review",
    approved_amount_inr: undefined,
    remarks: undefined,
    assessor_name: "R. K. Sharma (Senior Claims Officer)"
  }
};
