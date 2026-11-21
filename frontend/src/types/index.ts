export type UserRole = 'farmer' | 'insurance_officer' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  designation?: string;
}

export interface Farm {
  id: string;
  farmer_id: string;
  farmer_name: string;
  farm_name: string;
  khasra_number: string;
  declared_area_hectares: number;
  geodesic_area_hectares: number;
  area_variance_percent: number;
  current_crop: string;
  season: string;
  village: string;
  district: string;
  soil_type?: string;
  verification_status: 'Verified' | 'Mismatch' | 'Insufficient Data' | 'Manual Review' | 'Pending';
  boundary_geojson: {
    type: string;
    coordinates: number[][][];
  };
}

export interface Claim {
  id: string;
  claim_number: string;
  farmer_name: string;
  farmer_code: string;
  district: string;
  crop: string;
  claimed_amount_inr: number;
  loss_cause: string;
  claimed_loss_percentage: number;
  status: 'Pending' | 'Verified' | 'Flagged' | 'Delayed' | 'Approved' | 'Rejected';
  incident_date: string;
  khasra: string;
  policy_number: string;
}

export interface NdviObservation {
  date: string;
  mean_ndvi: number;
  district_normal_ndvi: number;
  anomaly: number;
  phenology_stage: string;
  satellite_mission?: string;
  bands_used?: string;
}

export interface WeatherWeek {
  week: string;
  rainfall_mm: number;
  temp_max: number;
  soil_moisture: number;
}

export interface SentinelScene {
  scene_id: string;
  observation_date: string;
  observation_timestamp?: string;
  satellite: string;
  mgrs_tile: string;
  cloud_coverage_percent: number;
  sun_elevation_deg?: number;
  thumbnail_url?: string;
  visual_tci_url?: string;
  band_b04_red_url?: string;
  band_b08_nir_url?: string;
  status: string;
}

export interface UnifiedWorkspaceData {
  claim_overview: {
    claim_number: string;
    farmer_name: string;
    farmer_code: string;
    policy_number: string;
    village: string;
    district: string;
    state: string;
    crop: string;
    season: string;
    claimed_amount_inr: number;
    sum_insured_inr: number;
    loss_cause: string;
    claimed_loss_percentage: number;
    incident_date: string;
    status: string;
  };
  farm_verification: {
    khasra_number: string;
    declared_area_ha: number;
    geodesic_area_ha: number;
    variance_percent: number;
    verdict: string;
    notes: string;
    boundary_geojson: any;
    land_record_matched: boolean;
  };
  yield_verification: {
    ndvi_timeline: NdviObservation[];
    sentinel_satellite_mission?: string;
    sentinel_scenes?: SentinelScene[];
    weather_summary: {
      district: string;
      total_season_rainfall_mm: number;
      district_normal_rainfall_mm: number;
      rainfall_deficit_pct: number;
      consecutive_dry_days: number;
      extreme_heat_days: number;
      drought_severity: string;
      weekly_records: WeatherWeek[];
    };
    yield_evaluation: {
      crop_type: string;
      historical_benchmark_yield_kg_ha: number;
      reported_yield_kg_ha: number;
      estimated_yield_kg_ha: number;
      reported_loss_percent: number;
      estimated_loss_percent: number;
      loss_discrepancy_percent: number;
      model_confidence_score: number;
      is_experimental: boolean;
      verdict: string;
      regulatory_disclaimer: string;
    };
    verdict: string;
    confidence_score: number;
  };
  process_audit: {
    claim_number: string;
    total_turnaround_days: number;
    stages_completed: number;
    sla_status: string;
    missing_records: string[];
    anomalies_detected: string[];
    timeline_events: {
      stage: string;
      date: string;
      status: string;
      sla_days: number;
    }[];
    audit_health_score: number;
  };
  evidence_locker: {
    type: string;
    name: string;
    size: string;
    status: string;
  }[];
  assessment: {
    decision: string;
    approved_amount_inr?: number;
    remarks?: string;
    assessor_name: string;
  };
}
