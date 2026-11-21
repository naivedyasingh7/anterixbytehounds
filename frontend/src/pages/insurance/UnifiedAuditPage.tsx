import React, { useState } from 'react';
import { DharaNav } from '../../components/common/DharaNav';
import { 
  Clock, 
  FileCheck2, 
  AlertTriangle, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  FileText,
  UserCheck
} from 'lucide-react';
import { MOCK_WORKSPACE_CLM001 } from '../../services/mockData';

export const UnifiedAuditPage: React.FC = () => {
  const [selectedClaimNumber, setSelectedClaimNumber] = useState('CLM001');

  const timelineEvents = [
    { stage: '1. Intimation Filed', actor: 'Cultivator (Rajesh Kumar)', date: '2026-11-01', sla_days: 0, status: 'Completed' },
    { stage: '2. Document Verification', actor: 'Portal Ingestion Bot', date: '2026-11-02', sla_days: 1, status: 'Completed' },
    { stage: '3. Satellite Inspection Pass', actor: 'Sentinel-2 L2A Automated Pipeline', date: '2026-11-05', sla_days: 3, status: 'Completed' },
    { stage: '4. Surveyor Field Assessment', actor: 'Loss Assessor Sharma', date: '2026-11-08', sla_days: 3, status: 'Completed' },
    { stage: '5. Final Disbursement SLA', actor: 'Underwriting Lead', date: 'Pending (Target: Nov 22)', sla_days: 7, status: 'In Review' },
  ];

  const totalDays = 7;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <DharaNav />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-44 sm:pt-48 pb-20 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#8B5F4D]" />
            <span>Engine 3: Regulatory SLA & Anomaly Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight">
            Insurance Process & SLA Audit
          </h1>
          <p className="text-[#68625B] text-base font-sans font-normal leading-relaxed">
            Track claim lifecycle turnaround times against statutory limits (PMFBY 21-day mandate). 
            Verify mandatory legal documents, flag out-of-order timestamps, and prevent claim disputes.
          </p>
        </div>

        {/* Claim Selector & SLA Status Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="font-sans text-xs font-semibold text-[#68625B] uppercase tracking-wider">CLAIM UNDER AUDIT:</div>
            <select
              value={selectedClaimNumber}
              onChange={(e) => setSelectedClaimNumber(e.target.value)}
              className="bg-[#FBF9F5] border border-[#CAB4AA] text-[#1B1D1C] rounded-full px-5 py-2 font-sans text-xs focus:outline-none shadow-sm"
            >
              <option value="CLM001">CLM001 • Rajesh Kumar (Bhopal)</option>
              <option value="CLM002">CLM002 • Sunita Bai (Sehore)</option>
              <option value="CLM003">CLM003 • Mohan Lal (Raisen)</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-sans text-xs">
            <div className="px-4 py-2 rounded-full bg-[#FBF9F5] border border-[#EAE3D9]">
              <span className="text-[#68625B]">Elapsed Turnaround:</span>{' '}
              <strong className="text-[#1B1D1C]">{totalDays} Days</strong>
            </div>
            <div className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-[#5B7553] font-semibold">
              ✓ STATUTORY SLA: ON TIME (&le; 21 DAYS)
            </div>
          </div>
        </div>

        {/* Main Audit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Sequential Timeline Stepper */}
          <div className="lg:col-span-8 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-6 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4 text-xs font-sans font-semibold text-[#8B5F4D] uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Milestone Lifecycle Timeline</span>
              </div>
              <span className="text-[#68625B]">
                4 OF 5 STAGES COMPLETED
              </span>
            </div>

            <div className="space-y-4 font-sans text-xs">
              {timelineEvents.map((evt, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      evt.status === 'Completed' ? 'bg-emerald-50 text-[#5B7553] border border-emerald-200' : 'bg-amber-50 text-[#8B5F4D] border border-amber-200 animate-pulse'
                    }`}>
                      {evt.status === 'Completed' ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-serif text-lg font-normal text-[#1B1D1C]">{evt.stage}</div>
                      <div className="text-xs text-[#68625B]">Actor: {evt.actor}</div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs">
                    <div className="text-[#1B1D1C] font-semibold">{evt.date}</div>
                    <div className="text-[#8B5F4D] font-medium">{evt.sla_days} Day(s) Turnaround</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-emerald-200 text-xs font-sans text-[#5B7553] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#5B7553] shrink-0 mt-0.5" />
              <span>
                <strong>Zero Anomaly Detected:</strong> All uploaded surveyor photos match the timestamp of satellite overpass 
                within a 48-hour geocoded threshold. No back-dating detected.
              </span>
            </div>
          </div>

          {/* Right: Mandatory Legal Dossier Checklist */}
          <div className="lg:col-span-4 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-6 shadow-[0_4px_24px_rgba(27,29,28,0.03)] font-sans text-xs">
            <h3 className="text-2xl font-serif font-normal text-[#1B1D1C]">
              Statutory Documents
            </h3>
            <p className="text-[#68625B] leading-relaxed">
              Section 14(b) compliance checklist required for insurance claim authorization.
            </p>

            <div className="space-y-3">
              {[
                { name: 'Khasra Revenue B-1 Record', status: 'Verified', date: 'Uploaded Nov 01' },
                { name: 'Aadhaar e-KYC Identity', status: 'Verified', date: 'Biometric Authenticated' },
                { name: 'Geotagged Damage Leaf Photos', status: 'Verified', date: '4 Photos Analyzed' },
                { name: 'Sentinel-2 BOA Spectral Dossier', status: 'Verified', date: '10m GSD Calibrated' },
                { name: 'Loss Assessment Committee Signature', status: 'Verified', date: 'Officer Sharma Signoff' },
              ].map((doc, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[#1B1D1C]">{doc.name}</div>
                    <div className="text-[#68625B] text-[11px] mt-0.5">{doc.date}</div>
                  </div>
                  <span className="text-[11px] text-[#5B7553] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] space-y-2">
              <div className="text-[10px] font-sans font-semibold uppercase text-[#8B5F4D] tracking-wider">STATUTORY AUDITOR REMARK</div>
              <p className="text-[#68625B] text-xs leading-relaxed">
                Eligible under PMFBY Mid-Season Adversity clause. Claim is fully cleared for settlement disbursement.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Clean Workspace Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#68625B]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-[#1B1D1C]">DHARA INSURE</span>
          <span>·</span>
          <span>Statutory SLA Audit Engine</span>
        </div>
        <div className="text-xs font-mono text-[#8B5F4D]">
          <span>© 2026 DHARA</span>
        </div>
      </footer>
    </div>
  );
};
export default UnifiedAuditPage;
