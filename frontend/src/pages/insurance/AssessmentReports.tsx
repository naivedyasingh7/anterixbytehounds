import React from 'react';
import { getReportPdfUrl } from '../../services/api';
import { Download, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export const AssessmentReports: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Downloadable Assessment Reports</h1>
          <p className="text-xs text-slate-500">
            Audit-ready PDF dossiers compiling satellite evidence, weather anomalies, and assessor adjudication
          </p>
        </div>
      </div>

      {/* Report Showcase Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified Claim Dossier
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-1">Claim CLM001 Assessment Dossier</h2>
            <p className="text-xs text-slate-500">Beneficiary: Rajesh Kumar Patel · Bhopal, Madhya Pradesh</p>
          </div>
          <a
            href={getReportPdfUrl('CLM001')}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>

        {/* Contents Checklist */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700">Included In This Official Report:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Farmer & Policy:</b> Khasra deed reference, Aadhaar hash, sum insured.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Engine 1 Farm Verification:</b> Declared vs PostGIS geodesic mapped area.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Engine 2 Yield Verification:</b> Multi-date Sentinel-2 NDVI crash table.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><b>Engine 3 Process Audit:</b> Full lifecycle timestamped turnaround log.</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Format: Standard PDF (Letter / A4) · Encrypted Audit Trail Hash</span>
          <span className="font-mono text-[11px] text-slate-400">SHA-256 Verified</span>
        </div>
      </div>
    </div>
  );
};
