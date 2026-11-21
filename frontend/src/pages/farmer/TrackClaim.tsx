import React from 'react';
import { MOCK_WORKSPACE_CLM001 } from '../../services/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Clock, CheckCircle2, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export const TrackClaim: React.FC = () => {
  const { claim_overview, process_audit } = MOCK_WORKSPACE_CLM001;

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <div>
        <h1 className="text-3xl font-serif font-normal text-[#1B1D1C]">Track Claim Settlement</h1>
        <p className="text-xs sm:text-sm text-[#68625B] mt-1 font-sans">
          Live statutory PMFBY SLA timeline and stage-by-stage multi-engine verification progress.
        </p>
      </div>

      {/* Claim Summary Header in Serein Style */}
      <div className="bg-[#F5EFE6] p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-serif font-normal text-[#1B1D1C]">Claim ID: {claim_overview.claim_number}</h2>
              <StatusBadge status={claim_overview.status} />
            </div>
            <p className="text-xs sm:text-sm text-[#68625B] mt-1 font-sans">
              Policy: <span className="font-mono text-[#1B1D1C]">{claim_overview.policy_number}</span> · Crop: {claim_overview.crop} ({claim_overview.season})
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-xs font-sans text-[#68625B] uppercase tracking-wider block">Claim Amount</span>
            <div className="text-2xl font-serif font-semibold text-[#8B5F4D]">
              ₹{claim_overview.claimed_amount_inr.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Timeline (Engine 3 Process Audit) */}
      <div className="bg-[#F5EFE6] p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D9]">
          <h3 className="text-xl font-serif font-normal text-[#1B1D1C] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8B5F4D]" />
            <span>Claim Processing Lifecycle</span>
          </h3>
          <span className="text-xs font-sans font-medium text-[#5B7553] bg-[#EBF2EA] px-3.5 py-1 rounded-full border border-[#5B7553]/30 self-start">
            SLA Status: {process_audit.sla_status} (4 Days Elapsed)
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#CAB4AA]/50">
          {process_audit.timeline_events.map((evt, idx) => {
            const isDone = evt.status === 'Completed';
            return (
              <div key={idx} className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                    isDone ? 'bg-[#5B7553]' : 'bg-[#8B5F4D] animate-pulse'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : '•'}
                </div>
                <div className="flex-1 bg-[#FBF9F5] p-5 rounded-2xl border border-[#EAE3D9]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-serif font-semibold text-sm text-[#1B1D1C]">{evt.stage}</span>
                    <span className="text-xs font-mono text-[#68625B]">{evt.date}</span>
                  </div>
                  <p className="text-xs text-[#68625B] font-sans mt-1">Status: {evt.status} · Turnaround: {evt.sla_days} Days</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
