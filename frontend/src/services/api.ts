import { Claim, Farm, UnifiedWorkspaceData } from '../types';
import { MOCK_CLAIMS_DATA, MOCK_FARMS_DATA, MOCK_WORKSPACE_CLM001 } from './mockData';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function fetchClaims(filters?: { district?: string; crop?: string; status?: string; search?: string }): Promise<Claim[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.district) params.append('district', filters.district);
    if (filters?.crop) params.append('crop', filters.crop);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/claims?${params.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API unreachable, falling back to mock dataset.');
  }

  // Fallback to local filter
  let data = [...MOCK_CLAIMS_DATA];
  if (filters?.district && filters.district !== 'All') {
    data = data.filter(c => c.district.toLowerCase() === filters.district!.toLowerCase());
  }
  if (filters?.crop && filters.crop !== 'All') {
    data = data.filter(c => c.crop.toLowerCase() === filters.crop!.toLowerCase());
  }
  if (filters?.status && filters.status !== 'All') {
    data = data.filter(c => c.status.toLowerCase() === filters.status!.toLowerCase());
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    data = data.filter(c => c.claim_number.toLowerCase().includes(s) || c.farmer_name.toLowerCase().includes(s));
  }
  return data;
}

export async function fetchClaimsMetrics() {
  try {
    const res = await fetch(`${API_BASE}/claims/metrics`);
    if (res.ok) return await res.json();
  } catch (e) {}

  return {
    total_claims: 3,
    pending_claims: 1,
    verified_claims: 1,
    flagged_claims: 1,
    delayed_claims: 0,
    district_distribution: { "Bhopal": 1, "Sehore": 1, "Raisen": 1 },
    recent_activity: [
      { action: "Claim Filed", claim: "CLM001", time: "2 hours ago", user: "Rajesh Kumar" },
      { action: "Satellite NDVI Analyzed", claim: "CLM002", time: "5 hours ago", user: "Engine 2" },
      { action: "Area Mismatch Flagged", claim: "CLM003", time: "1 day ago", user: "Engine 1" }
    ]
  };
}

export async function fetchFarms(): Promise<Farm[]> {
  try {
    const res = await fetch(`${API_BASE}/farms`);
    if (res.ok) return await res.json();
  } catch (e) {}
  return MOCK_FARMS_DATA;
}

export async function registerFarm(farmData: any): Promise<Farm> {
  try {
    const res = await fetch(`${API_BASE}/farms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmData)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API unreachable during farm registration.');
  }
  return {
    id: `fa${Date.now()}`,
    farmer_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    farmer_name: "Rajesh Kumar Patel",
    farm_name: farmData.farm_name,
    khasra_number: farmData.khasra_number,
    declared_area_hectares: farmData.declared_area_hectares,
    geodesic_area_hectares: 2.462,
    area_variance_percent: 1.52,
    current_crop: farmData.current_crop,
    season: farmData.season,
    village: "Berasia",
    district: "Bhopal",
    verification_status: "Verified",
    boundary_geojson: farmData.boundary_geojson
  };
}

export async function submitClaim(claimData: any): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/claims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimData)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('API unreachable during claim submission.');
  }
  return {
    id: `c${Date.now()}`,
    claim_number: "CLM004",
    status: "Pending"
  };
}

export async function fetchUnifiedWorkspace(claimId: string): Promise<UnifiedWorkspaceData> {
  try {
    const res = await fetch(`${API_BASE}/workspace/${claimId}`);
    if (res.ok) return await res.json();
  } catch (e) {}
  return MOCK_WORKSPACE_CLM001;
}

export async function submitAssessmentDecision(claimId: string, decision: string, remarks: string, amount?: number) {
  try {
    const res = await fetch(`${API_BASE}/workspace/${claimId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, remarks, approved_amount_inr: amount })
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  return { status: 'success', message: `Decision recorded: ${decision}` };
}

export function getReportPdfUrl(claimId: string): string {
  return `${API_BASE}/reports/${claimId}/pdf`;
}
