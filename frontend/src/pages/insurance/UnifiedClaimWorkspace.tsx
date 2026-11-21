import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUnifiedWorkspace, submitAssessmentDecision, getReportPdfUrl } from '../../services/api';
import { MOCK_WORKSPACE_CLM001 } from '../../services/mockData';
import { UnifiedWorkspaceData } from '../../types';
import { FarmMapViewer } from '../../components/maps/FarmMapViewer';
import { NdviChart } from '../../components/charts/NdviChart';
import { WeatherChart } from '../../components/charts/WeatherChart';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  ShieldCheck, 
  MapPin, 
  Layers, 
  Activity, 
  History, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle,
  Download,
  AlertCircle
} from 'lucide-react';

export const UnifiedClaimWorkspace: React.FC = () => {
  const { claimId = 'CLM001' } = useParams();
  const [data, setData] = useState<UnifiedWorkspaceData | null>(MOCK_WORKSPACE_CLM001);
  const [decision, setDecision] = useState<'Approved' | 'Rejected' | 'Flagged_Investigation' | 'More_Info_Required'>('Approved');
  const [remarks, setRemarks] = useState(
    'Satellite NDVI confirms severe vegetative crash matching IMD drought records. Geodesic area matches Khasra deed within 1.5%.'
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUnifiedWorkspace(claimId).then((res) => {
      if (res && res.claim_overview) {
        setData(res);
      }
    });
  }, [claimId]);

  const activeData = data || MOCK_WORKSPACE_CLM001;
  const { claim_overview, farm_verification, yield_verification, process_audit, evidence_locker } = activeData;

  const handleDecisionSubmit = async () => {
    await submitAssessmentDecision(claimId, decision, remarks, claim_overview.claimed_amount_inr);
    setActionMessage(`Adjudication saved: Claim ${claimId} marked as '${decision}'. Audit log registered.`);
    setTimeout(() => setActionMessage(null), 5000);
  };

  return (
    <div className="space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      
      {/* Workspace Header Banner in Serein Editorial Style */}
      <div className="bg-[#F5EFE6] text-[#1B1D1C] p-8 sm:p-10 rounded-3xl border border-[#EAE3D9] shadow-[0_4px_24px_rgba(27,29,28,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#8B5F4D] bg-[#EAE3D9] px-3 py-1 rounded-full border border-[#CAB4AA]">
              Unified Claim Dossier
            </span>
            <span className="text-[#CAB4AA] text-xs">·</span>
            <span className="text-xs text-[#68625B] font-mono">Assessor: R. K. Sharma</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#1B1D1C] tracking-tight">
            Claim Dossier: {claim_overview.claim_number}
          </h1>
          <p className="text-xs sm:text-sm text-[#68625B] font-sans">
            Farmer: <span className="font-semibold text-[#1B1D1C]">{claim_overview.farmer_name}</span> ({claim_overview.farmer_code}) · {claim_overview.district}, Madhya Pradesh
          </p>
        </div>

        {/* Action Button: Download Audit Dossier PDF */}
        <div className="flex items-center gap-3">
          <a
            href={getReportPdfUrl(claimId)}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-[#8B5F4D] hover:bg-[#74503F] text-[#FBF9F5] text-xs sm:text-sm font-sans font-medium rounded-full shadow-sm transition flex items-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Dossier</span>
          </a>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-[#EBF2EA] border border-[#5B7553]/30 rounded-2xl text-xs font-sans text-[#5B7553] flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#5B7553] shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Section 1: Claim Overview */}
      <div className="bg-[#F5EFE6] p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
          <h3 className="text-xl font-serif font-normal text-[#1B1D1C] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#8B5F4D]" />
            <span>1. Claim & Policy Overview</span>
          </h3>
          <StatusBadge status={claim_overview.status} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          <div>
            <span className="text-[#68625B] block text-[11px] uppercase tracking-wider">Policy Number</span>
            <span className="font-mono font-semibold text-sm text-[#1B1D1C] mt-0.5 block">{claim_overview.policy_number}</span>
          </div>
          <div>
            <span className="text-[#68625B] block text-[11px] uppercase tracking-wider">Crop & Season</span>
            <span className="font-serif font-semibold text-sm text-[#1B1D1C] mt-0.5 block">{claim_overview.crop} ({claim_overview.season})</span>
          </div>
          <div>
            <span className="text-[#68625B] block text-[11px] uppercase tracking-wider">Claimed Amount</span>
            <span className="font-serif font-semibold text-base text-[#8B5F4D] mt-0.5 block">₹{claim_overview.claimed_amount_inr.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[#68625B] block text-[11px] uppercase tracking-wider">Declared Cause</span>
            <span className="font-sans font-medium text-xs text-[#1B1D1C] mt-0.5 block">{claim_overview.loss_cause}</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Engine 1 (Farm) & Engine 2 (Yield) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 2: Farm Verification (Engine 1) */}
        <div className="bg-[#F5EFE6] p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-normal text-[#1B1D1C] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#8B5F4D]" />
                <span>2. Engine 1: Cadastral Boundary</span>
              </h3>
              <p className="text-xs text-[#68625B] font-sans mt-0.5">PostGIS geodesic polygon vs Khasra declared acreage</p>
            </div>
            <StatusBadge status={farm_verification.verdict} size="sm" />
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#EAE3D9]">
            <FarmMapViewer
              coordinates={farm_verification?.boundary_geojson?.coordinates}
              khasra={farm_verification?.khasra_number}
              height="260px"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/40 text-xs font-sans">
            <div>
              <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">Declared Khasra</span>
              <span className="font-serif font-semibold text-sm text-[#1B1D1C]">{farm_verification.declared_area_ha} Ha</span>
            </div>
            <div>
              <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">Mapped Geodesic</span>
              <span className="font-serif font-semibold text-sm text-[#5B7553]">{farm_verification.geodesic_area_ha} Ha</span>
            </div>
            <div>
              <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">Variance Status</span>
              <span className="font-sans font-semibold text-xs text-[#5B7553]">{farm_verification.variance_percent}% (Match)</span>
            </div>
          </div>
          <p className="text-xs text-[#68625B] font-sans leading-relaxed">{farm_verification.notes}</p>
        </div>

        {/* Section 3: Yield Verification (Engine 2) */}
        <div className="bg-[#F5EFE6] p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-normal text-[#1B1D1C] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#8B5F4D]" />
                <span>3. Engine 2: Crop Yield Loss</span>
              </h3>
              <p className="text-xs text-[#68625B] font-sans mt-0.5">Sentinel-2 NDVI curve & agro-meteorological correlation</p>
            </div>
            <StatusBadge status={yield_verification.verdict} size="sm" />
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#EAE3D9] bg-[#FBF9F5] p-2">
            <NdviChart data={yield_verification.ndvi_timeline} height={200} />
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/40 text-xs font-sans">
            <div>
              <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">Reported Loss</span>
              <span className="font-serif font-semibold text-sm text-[#1B1D1C]">{yield_verification.yield_evaluation.reported_loss_percent}%</span>
            </div>
            <div>
              <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">ML Estimated Loss</span>
              <span className="font-serif font-semibold text-sm text-[#8B5F4D]">{yield_verification.yield_evaluation.estimated_loss_percent}%</span>
            </div>
            <div>
              <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">Confidence</span>
              <span className="font-sans font-semibold text-xs text-[#5B7553]">{(yield_verification.confidence_score * 100).toFixed(0)}%</span>
            </div>
          </div>

          <p className="text-[11px] text-[#68625B] italic font-sans">
            * {yield_verification.yield_evaluation.regulatory_disclaimer}
          </p>
        </div>

      </div>

      {/* Meteorological Deep Dive (Engine 2 Weather) */}
      <div className="bg-[#F5EFE6] p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE3D9]">
          <h4 className="text-xl font-serif font-normal text-[#1B1D1C]">
            Regional Agro-Meteorological Evidence
          </h4>
          <span className="text-xs font-sans font-medium text-[#9E3A3A] bg-[#FDF2F2] px-3.5 py-1 rounded-full border border-[#E5B5B5] self-start">
            {yield_verification.weather_summary.consecutive_dry_days} Consecutive Dry Days (IMD Anomaly)
          </span>
        </div>
        <div className="rounded-2xl overflow-hidden border border-[#EAE3D9] bg-[#FBF9F5] p-2">
          <WeatherChart data={yield_verification.weather_summary.weekly_records} height={190} />
        </div>
      </div>

      {/* Section 4 & 5: Process Audit & Evidence Locker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 4: Process Audit (Engine 3) */}
        <div className="bg-[#F5EFE6] p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
            <h3 className="text-xl font-serif font-normal text-[#1B1D1C] flex items-center gap-2">
              <History className="w-5 h-5 text-[#8B5F4D]" />
              <span>4. Engine 3: SLA Timeline</span>
            </h3>
            <span className="text-xs font-sans font-medium text-[#5B7553] bg-[#EBF2EA] px-3.5 py-1 rounded-full border border-[#5B7553]/30">
              {process_audit.sla_status} (4 Days)
            </span>
          </div>

          <div className="space-y-2.5">
            {process_audit.timeline_events.map((evt: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-[#EAE3D9]/60 rounded-2xl text-xs font-sans border border-[#CAB4AA]/30">
                <span className="font-serif font-semibold text-[#1B1D1C]">{evt.stage}</span>
                <span className="text-[#68625B] font-mono text-[11px]">{evt.date}</span>
                <span className="text-[#5B7553] font-medium">{evt.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Evidence Locker */}
        <div className="bg-[#F5EFE6] p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
            <h3 className="text-xl font-serif font-normal text-[#1B1D1C] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#8B5F4D]" />
              <span>5. Evidence Locker</span>
            </h3>
            <span className="text-xs font-mono text-[#68625B]">4 Documents</span>
          </div>

          <div className="space-y-2.5">
            {evidence_locker.map((doc: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-[#EAE3D9]/60 rounded-2xl text-xs font-sans border border-[#CAB4AA]/30">
                <div>
                  <span className="font-serif font-semibold text-[#1B1D1C] block">{doc.name}</span>
                  <span className="text-[10px] text-[#68625B] font-mono">{doc.type} · {doc.size}</span>
                </div>
                <span className="text-[#5B7553] font-medium bg-[#EBF2EA] px-2.5 py-0.5 rounded-full text-[11px]">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section 6: Official Assessor Cockpit (Final Assessment & Human Sign-Off) */}
      <div className="bg-[#F5EFE6] p-8 sm:p-10 rounded-3xl border-2 border-[#8B5F4D] shadow-[0_8px_32px_rgba(139,95,77,0.08)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D9]">
          <div>
            <h3 className="text-2xl font-serif font-normal text-[#1B1D1C] flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#8B5F4D]" />
              <span>6. Official Assessor Adjudication Cockpit</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#68625B] font-sans mt-1">
              AI synthesizes empirical evidence. Statutory settlement decision rests exclusively with the authorized officer.
            </p>
          </div>
          <span className="text-xs font-mono text-[#8B5F4D] bg-[#EAE3D9] px-3.5 py-1.5 rounded-full self-start">
            Assessor ID: OFF-BHP-004
          </span>
        </div>

        {/* Action Choice Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setDecision('Approved')}
            className={`p-4 rounded-2xl border text-xs font-sans font-medium flex items-center justify-center gap-2 transition ${
              decision === 'Approved'
                ? 'bg-[#5B7553] text-[#FBF9F5] border-[#5B7553] shadow-md'
                : 'bg-[#FBF9F5] hover:bg-[#EAE3D9] text-[#1B1D1C] border-[#CAB4AA]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve Claim</span>
          </button>

          <button
            type="button"
            onClick={() => setDecision('Flagged_Investigation')}
            className={`p-4 rounded-2xl border text-xs font-sans font-medium flex items-center justify-center gap-2 transition ${
              decision === 'Flagged_Investigation'
                ? 'bg-[#A26744] text-[#FBF9F5] border-[#A26744] shadow-md'
                : 'bg-[#FBF9F5] hover:bg-[#EAE3D9] text-[#1B1D1C] border-[#CAB4AA]'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Flag for Survey</span>
          </button>

          <button
            type="button"
            onClick={() => setDecision('More_Info_Required')}
            className={`p-4 rounded-2xl border text-xs font-sans font-medium flex items-center justify-center gap-2 transition ${
              decision === 'More_Info_Required'
                ? 'bg-[#8B5F4D] text-[#FBF9F5] border-[#8B5F4D] shadow-md'
                : 'bg-[#FBF9F5] hover:bg-[#EAE3D9] text-[#1B1D1C] border-[#CAB4AA]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Request Records</span>
          </button>

          <button
            type="button"
            onClick={() => setDecision('Rejected')}
            className={`p-4 rounded-2xl border text-xs font-sans font-medium flex items-center justify-center gap-2 transition ${
              decision === 'Rejected'
                ? 'bg-[#9E3A3A] text-[#FBF9F5] border-[#9E3A3A] shadow-md'
                : 'bg-[#FBF9F5] hover:bg-[#EAE3D9] text-[#1B1D1C] border-[#CAB4AA]'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Claim</span>
          </button>
        </div>

        {/* Remarks Input */}
        <div>
          <label className="block text-xs font-sans font-medium text-[#68625B] mb-1.5 uppercase tracking-wider">
            Assessor Remarks & Statutory Justification
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full text-xs font-sans p-4 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D] leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-xs font-sans text-[#68625B]">
            Fiduciary Notice: Cryptographically committed to the PMFBY institutional audit trail.
          </span>
          <button
            type="button"
            onClick={handleDecisionSubmit}
            className="px-7 py-3 rounded-full bg-[#1B1D1C] hover:bg-[#8B5F4D] text-[#FBF9F5] text-xs font-sans font-medium shadow-sm transition active:scale-95"
          >
            Save Assessor Adjudication
          </button>
        </div>

      </div>

    </div>
  );
};
