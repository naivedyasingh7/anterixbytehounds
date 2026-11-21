import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchClaimsMetrics } from '../../services/api';
import { 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  MapPin, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const InsuranceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetchClaimsMetrics().then(setMetrics);
  }, []);

  if (!metrics) {
    return <div className="p-8 text-center text-slate-500">Loading underwriting dashboard...</div>;
  }

  const districtData = Object.entries(metrics.district_distribution).map(([district, count]) => ({
    district,
    count
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            Insurance Assessor Operations
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Underwriting & Claims Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time portfolio verification across Madhya Pradesh (Bhopal, Sehore, Raisen)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/insurance/claims"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            Manage Claims Table
          </Link>
          <Link
            to="/insurance/workspace/CLM001"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            Open Unified Workspace
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Claims</span>
            <FileCheck2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{metrics.total_claims}</div>
          <span className="text-[10px] text-slate-500">Active portfolio</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Review</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 mt-2">{metrics.pending_claims}</div>
          <span className="text-[10px] text-blue-600 font-medium">Awaiting sign-off</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">{metrics.verified_claims}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Empirical proof matched</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Flagged Claims</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">{metrics.flagged_claims}</div>
          <span className="text-[10px] text-amber-600 font-medium">Area / Yield anomaly</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Delayed Claims</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-2">{metrics.delayed_claims}</div>
          <span className="text-[10px] text-rose-600 font-medium">SLA breaches (&gt;21d)</span>
        </div>
      </div>

      {/* Main Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* District-wise Claim Distribution */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> District-Wise Claim Distribution
              </h3>
              <p className="text-xs text-slate-500">Volume distribution across insured agro-climatic clusters</p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Realtime Query</span>
          </div>

          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="district" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Total Claims" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Claim Activity Stream */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" /> Recent Claim Activity
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">Live Events</span>
          </div>

          <div className="space-y-3">
            {metrics.recent_activity.map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.action}</span>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <Link to={`/insurance/workspace/${item.claim}`} className="text-emerald-700 font-semibold hover:underline">
                    {item.claim}
                  </Link>
                  <span className="text-slate-500 text-[11px]">{item.user}</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/insurance/claims"
            className="block text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 pt-2"
          >
            View all claims in Claims Management →
          </Link>
        </div>

      </div>
    </div>
  );
};
