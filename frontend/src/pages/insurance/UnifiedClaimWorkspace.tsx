import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUnifiedWorkspace, submitAssessmentDecision, getReportPdfUrl } from '../../services/api';
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
  const [data, setData] = useState<UnifiedWorkspaceData | null>(null);
  const [decision, setDecision] = useState<'Approved' | 'Rejected' | 'Flagged_Investigation' | 'More_Info_Required'>('Approved');
  const [remarks, setRemarks] = useState(
    'Satellite NDVI confirms severe vegetative crash matching IMD drought records. Geodesic area matches Khasra deed within 1.5%.'
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUnifiedWorkspace(claimId).then(setData);
  }, [claimId]);

  if (!data) {
    return <div className="p-8 text-center text-slate-500">Loading Unified Claim Workspace...</div>;
  }

  const { claim_overview, farm_verification, yield_verification, process_audit, evidence_locker } = data;

  const handleDecisionSubmit = async () => {
    await submitAssessmentDecision(claimId, decision, remarks, claim_overview.claimed_amount_inr);
    setActionMessage(`Adjudication saved: Claim ${claimId} marked as '${decision}'. Audit log registered.`);
    setTimeout(() => setActionMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Workspace Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              The Unified Claim Workspace
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-xs text-slate-300 font-mono">Assessor: R. K. Sharma</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">Claim Assessment Dossier: {claim_overview.claim_number}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Farmer: <b>{claim_overview.farmer_name}</b> ({claim_overview.farmer_code}) · {claim_overview.district}, MP
          </p>
        </div>

        {/* Action Button: Download Audit Dossier PDF */}
        <div className="flex items-center gap-3">
          <a
            href={getReportPdfUrl(claimId)}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Dossier</span>
          </a>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Section 1: Claim Overview */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" /> 1. Claim & Policy Overview
          </h3>
          <StatusBadge status={claim_overview.status} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Policy Number</span>
            <span className="font-bold text-slate-900">{claim_overview.policy_number}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Crop & Season</span>
            <span className="font-bold text-slate-900">{claim_overview.crop} ({claim_overview.season})</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Claimed Amount</span>
            <span className="font-bold text-emerald-700 text-sm">₹{claim_overview.claimed_amount_inr.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Declared Cause</span>
            <span className="font-bold text-slate-900">{claim_overview.loss_cause}</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Engine 1 (Farm) & Engine 2 (Yield) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 2: Farm Verification (Engine 1) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" /> 2. Engine 1: Farm Boundary Verification
              </h3>
              <p className="text-xs text-slate-500">PostGIS geodesic polygon vs Khasra declared acreage</p>
            </div>
            <StatusBadge status={farm_verification.verdict} size="sm" />
          </div>

          <FarmMapViewer
            coordinates={farm_verification.boundary_geojson.coordinates}
            khasra={farm_verification.khasra_number}
            height="260px"
          />

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Declared Khasra</span>
              <span className="font-bold text-slate-900">{farm_verification.declared_area_ha} Ha</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Mapped Geodesic</span>
              <span className="font-bold text-emerald-700">{farm_verification.geodesic_area_ha} Ha</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Variance Status</span>
              <span className="font-bold text-emerald-600">{farm_verification.variance_percent}% (Match)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">{farm_verification.notes}</p>
        </div>

        {/* Section 3: Yield Verification (Engine 2) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> 3. Engine 2: Crop Yield Verification
              </h3>
              <p className="text-xs text-slate-500">Sentinel-2 NDVI curve & agro-meteorological correlation</p>
            </div>
            <StatusBadge status={yield_verification.verdict} size="sm" />
          </div>

          <NdviChart data={yield_verification.ndvi_timeline} height={190} />

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Reported Loss</span>
              <span className="font-bold text-slate-900">{yield_verification.yield_evaluation.reported_loss_percent}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ML Estimated Loss</span>
              <span className="font-bold text-emerald-700">{yield_verification.yield_evaluation.estimated_loss_percent}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Model Confidence</span>
              <span className="font-bold text-blue-600">{(yield_verification.confidence_score * 100).toFixed(0)}%</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic">
            * {yield_verification.yield_evaluation.regulatory_disclaimer}
          </p>
        </div>

      </div>

      {/* Meteorological Deep Dive (Engine 2 Weather) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
          <span>Regional Agro-Meteorological Evidence</span>
          <span className="text-[11px] font-normal text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold">
            {yield_verification.weather_summary.consecutive_dry_days} Consecutive Dry Days (IMD Anomaly)
          </span>
        </h4>
        <WeatherChart data={yield_verification.weather_summary.weekly_records} height={180} />
      </div>

      {/* Section 4 & 5: Process Audit & Evidence Locker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 4: Process Audit (Engine 3) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-600" /> 4. Engine 3: Process Audit & SLA
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {process_audit.sla_status} (4 Days)
            </span>
          </div>

          <div className="space-y-2">
            {process_audit.timeline_events.map((evt, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs">
                <span className="font-medium text-slate-800">{evt.stage}</span>
                <span className="text-slate-400 font-mono text-[11px]">{evt.date}</span>
                <span className="text-emerald-700 font-semibold">{evt.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Evidence Locker */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" /> 5. Evidence Locker
          </h3>

          <div className="space-y-2">
            {evidence_locker.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">{doc.name}</span>
                  <span className="text-[10px] text-slate-400">{doc.type} · {doc.size}</span>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section 6: Official Assessor Cockpit (Final Assessment & Human Sign-Off) */}
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-lg space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              6. Official Assessor Adjudication Cockpit
            </h3>
            <p className="text-xs text-slate-500">
              AI synthesizes empirical evidence. Statutory settlement decision rests exclusively with the authorized officer.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Assessor ID: OFF-BHP-004</span>
        </div>

        {/* Action Choice Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setDecision('Approved')}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              decision === 'Approved'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve Claim
          </button>

          <button
            type="button"
            onClick={() => setDecision('Flagged_Investigation')}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              decision === 'Flagged_Investigation'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Flag for Field Survey
          </button>

          <button
            type="button"
            onClick={() => setDecision('More_Info_Required')}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              decision === 'More_Info_Required'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Request Documents
          </button>

          <button
            type="button"
            onClick={() => setDecision('Rejected')}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              decision === 'Rejected'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                : 'bg-slate-50 hover:bg-rose-50 text-slate-700 border-slate-200'
            }`}
          >
            <XCircle className="w-4 h-4" />
            Reject Claim
          </button>
        </div>

        {/* Remarks Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Assessor Remarks & Legal Justification
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400">
            Fiduciary Notice: Signature cryptographically signed to audit trail.
          </span>
          <button
            type="button"
            onClick={handleDecisionSubmit}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
          >
            Save Assessor Adjudication
          </button>
        </div>

      </div>

    </div>
  );
};
