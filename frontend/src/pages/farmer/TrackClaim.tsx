import React from 'react';
import { MOCK_WORKSPACE_CLM001 } from '../../services/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Clock, CheckCircle2, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export const TrackClaim: React.FC = () => {
  const { claim_overview, process_audit } = MOCK_WORKSPACE_CLM001;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Track Claim Settlement</h1>
        <p className="text-xs text-slate-500">Live SLA timeline and stage-by-stage verification progress</p>
      </div>

      {/* Claim Summary Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Claim ID: {claim_overview.claim_number}</h2>
              <StatusBadge status={claim_overview.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Policy: {claim_overview.policy_number} · Crop: {claim_overview.crop} ({claim_overview.season})
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Claim Amount</span>
            <div className="text-lg font-bold text-emerald-800">
              ₹{claim_overview.claimed_amount_inr.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Timeline (Engine 3 Process Audit) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Claim Processing Lifecycle
          </h3>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            SLA Status: {process_audit.sla_status} (4 Days Elapsed)
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {process_audit.timeline_events.map((evt, idx) => {
            const isDone = evt.status === 'Completed';
            return (
              <div key={idx} className="relative flex items-start gap-4">
                <div
                  className={`absolute -left-6 mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                    isDone ? 'bg-emerald-600' : 'bg-blue-600 animate-pulse'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : '•'}
                </div>
                <div className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{evt.stage}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] font-semibold ${
                        isDone ? 'text-emerald-700' : 'text-blue-700'
                      }`}
                    >
                      {evt.status}
                    </span>
                    <span className="text-[10px] text-slate-400">· Turnaround: {evt.sla_days} day(s)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
