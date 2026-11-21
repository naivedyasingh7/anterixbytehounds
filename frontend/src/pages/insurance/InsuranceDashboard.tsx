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
    return <div className="p-8 text-center text-[#68625B] font-sans">Loading underwriting dashboard...</div>;
  }

  const districtData = Object.entries(metrics.district_distribution).map(([district, count]) => ({
    district,
    count
  }));

  return (
    <div className="space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      {/* Top Banner in Serein Editorial Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#F5EFE6] p-8 sm:p-10 rounded-3xl border border-[#EAE3D9] shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE3D9] text-[#68625B] text-xs font-sans font-medium uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#8B5F4D]"></span>
            <span>Institutional Underwriter Operations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#1B1D1C] tracking-tight">
            Underwriting & Claims Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#68625B] font-sans">
            Real-time portfolio verification across Madhya Pradesh (Bhopal, Sehore, Raisen).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/insurance/claims"
            className="px-5 py-2.5 bg-[#8B5F4D] hover:bg-[#74503F] text-[#FBF9F5] text-xs sm:text-sm font-sans font-medium rounded-full shadow-sm transition flex items-center gap-2 active:scale-95"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Manage Claims</span>
          </Link>
          <Link
            to="/insurance/workspace/CLM001"
            className="px-5 py-2.5 bg-[#1B1D1C] hover:bg-[#333634] text-[#FBF9F5] text-xs sm:text-sm font-sans font-medium rounded-full shadow-sm transition flex items-center gap-2 active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-[#CAB4AA]" />
            <span>Open CLM001 Workspace</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-[#F5EFE6] p-5 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans uppercase tracking-wider text-[#68625B] font-medium">Total Claims</span>
            <FileCheck2 className="w-4 h-4 text-[#8B5F4D]" />
          </div>
          <div className="text-3xl font-serif font-normal text-[#1B1D1C] mt-2">{metrics.total_claims}</div>
          <span className="text-[11px] font-sans text-[#68625B] mt-0.5 block">Active portfolio</span>
        </div>

        <div className="bg-[#F5EFE6] p-5 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans uppercase tracking-wider text-[#68625B] font-medium">Pending Review</span>
            <Clock className="w-4 h-4 text-[#8B5F4D]" />
          </div>
          <div className="text-3xl font-serif font-normal text-[#8B5F4D] mt-2">{metrics.pending_claims}</div>
          <span className="text-[11px] font-sans text-[#8B5F4D] mt-0.5 block">Awaiting sign-off</span>
        </div>

        <div className="bg-[#F5EFE6] p-5 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans uppercase tracking-wider text-[#68625B] font-medium">Verified</span>
            <CheckCircle2 className="w-4 h-4 text-[#5B7553]" />
          </div>
          <div className="text-3xl font-serif font-normal text-[#5B7553] mt-2">{metrics.verified_claims}</div>
          <span className="text-[11px] font-sans text-[#5B7553] mt-0.5 block">Empirical proof matched</span>
        </div>

        <div className="bg-[#F5EFE6] p-5 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans uppercase tracking-wider text-[#68625B] font-medium">Flagged Claims</span>
            <AlertTriangle className="w-4 h-4 text-[#A26744]" />
          </div>
          <div className="text-3xl font-serif font-normal text-[#A26744] mt-2">{metrics.flagged_claims}</div>
          <span className="text-[11px] font-sans text-[#A26744] mt-0.5 block">Area / Yield anomaly</span>
        </div>

        <div className="bg-[#F5EFE6] p-5 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans uppercase tracking-wider text-[#68625B] font-medium">Delayed Claims</span>
            <Clock className="w-4 h-4 text-[#9E3A3A]" />
          </div>
          <div className="text-3xl font-serif font-normal text-[#9E3A3A] mt-2">{metrics.delayed_claims}</div>
          <span className="text-[11px] font-sans text-[#9E3A3A] mt-0.5 block">SLA breaches (&gt;21d)</span>
        </div>
      </div>

      {/* Main Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* District-wise Claim Distribution */}
        <div className="lg:col-span-2 bg-[#F5EFE6] p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-normal text-[#1B1D1C] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#8B5F4D]" />
                <span>District-Wise Claim Distribution</span>
              </h3>
              <p className="text-xs text-[#68625B] font-sans mt-0.5">Volume distribution across insured agro-climatic clusters</p>
            </div>
            <span className="text-xs font-mono text-[#8B5F4D] bg-[#EAE3D9] px-3 py-1 rounded-full">Realtime Query</span>
          </div>

          <div style={{ height: 260 }} className="pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE3D9" />
                <XAxis dataKey="district" tick={{ fontSize: 11, fill: '#68625B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#68625B' }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FBF9F5', 
                    borderRadius: '16px', 
                    border: '1px solid #EAE3D9',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="count" name="Total Claims" fill="#8B5F4D" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Claim Activity Stream */}
        <div className="bg-[#F5EFE6] p-6 sm:p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D9]">
              <h3 className="text-xl font-serif font-normal text-[#1B1D1C] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#8B5F4D]" />
                <span>Recent Activity</span>
              </h3>
              <span className="text-[10px] font-mono text-[#5B7553] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full uppercase">Live</span>
            </div>

            <div className="space-y-3 pt-3">
              {metrics.recent_activity.map((item: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-semibold text-[#1B1D1C]">{item.action}</span>
                    <span className="text-[10px] font-mono text-[#68625B]">{item.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans">
                    <Link to={`/insurance/workspace/${item.claim}`} className="text-[#8B5F4D] font-medium hover:underline">
                      {item.claim}
                    </Link>
                    <span className="text-[#68625B] text-[11px]">{item.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/insurance/claims"
            className="block text-center text-xs font-sans font-medium text-[#8B5F4D] hover:text-[#1B1D1C] pt-4 transition-colors"
          >
            View all claims in Claims Management →
          </Link>
        </div>

      </div>
    </div>
  );
};
