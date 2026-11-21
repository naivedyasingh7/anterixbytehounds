import React from 'react';
import { getReportPdfUrl } from '../../services/api';
import { Download, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export const AssessmentReports: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <div>
        <h1 className="text-3xl font-serif font-normal text-[#1B1D1C]">Downloadable Assessment Reports</h1>
        <p className="text-xs sm:text-sm text-[#68625B] mt-1 font-sans">
          Audit-ready PDF dossiers compiling satellite evidence, weather anomalies, and assessor adjudication.
        </p>
      </div>

      {/* Report Showcase Card */}
      <div className="bg-[#F5EFE6] p-8 sm:p-10 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D9]">
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#5B7553] bg-[#EBF2EA] px-3 py-1 rounded-full border border-[#5B7553]/30">
              Verified Claim Dossier
            </span>
            <h2 className="text-2xl font-serif font-normal text-[#1B1D1C] mt-2">Claim CLM001 Assessment Dossier</h2>
            <p className="text-xs sm:text-sm text-[#68625B] font-sans">Beneficiary: Rajesh Kumar Patel · Bhopal, Madhya Pradesh</p>
          </div>
          <a
            href={getReportPdfUrl('CLM001')}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-[#8B5F4D] hover:bg-[#74503F] text-[#FBF9F5] text-xs sm:text-sm font-sans font-medium rounded-full shadow-sm transition flex items-center gap-2 self-start sm:self-auto active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>

        {/* Contents Checklist */}
        <div className="space-y-4">
          <h4 className="text-xs font-sans font-medium uppercase tracking-wider text-[#68625B]">Included In This Official Dossier:</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
            <div className="p-4 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#5B7553] shrink-0 mt-0.5" />
              <div>
                <span className="font-serif font-semibold text-sm text-[#1B1D1C] block">Engine 1 Cadastral Map</span>
                <span className="text-[#68625B]">UTM 43N geodesic boundary vs Khasra 48/2 deed.</span>
              </div>
            </div>

            <div className="p-4 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#5B7553] shrink-0 mt-0.5" />
              <div>
                <span className="font-serif font-semibold text-sm text-[#1B1D1C] block">Engine 2 NDVI Trajectory</span>
                <span className="text-[#68625B]">Sentinel-2 10-day chlorophyll index & IMD rainfall deficit.</span>
              </div>
            </div>

            <div className="p-4 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#5B7553] shrink-0 mt-0.5" />
              <div>
                <span className="font-serif font-semibold text-sm text-[#1B1D1C] block">Engine 3 SLA Timeline</span>
                <span className="text-[#68625B]">Milestone audit verifying 4-day statutory turnaround.</span>
              </div>
            </div>

            <div className="p-4 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#5B7553] shrink-0 mt-0.5" />
              <div>
                <span className="font-serif font-semibold text-sm text-[#1B1D1C] block">Assessor Adjudication</span>
                <span className="text-[#68625B]">Cryptographic officer signature and fiduciary remarks.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
