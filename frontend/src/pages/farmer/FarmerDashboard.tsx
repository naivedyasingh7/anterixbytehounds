import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, MapPin, FileCheck2, Clock, PlusCircle, ArrowUpRight, ShieldCheck, Layers, FileText } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      {/* Welcome Banner in Serein Editorial Style */}
      <div className="bg-[#F5EFE6] border border-[#EAE3D9] text-[#1B1D1C] rounded-3xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(27,29,28,0.03)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE3D9] text-[#68625B] text-xs font-sans font-medium uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#5B7553]"></span>
            <span>Farmer Self-Service Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#1B1D1C] tracking-tight">
            Namaste, <span className="font-semibold">{user?.full_name || 'Rajesh Kumar'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#68625B] font-sans">
            Village Berasia · District Bhopal, Madhya Pradesh · Farmer ID: <span className="font-mono text-[#8B5F4D]">FAR-MP-BHP-001</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/farmer/submit-claim"
            className="px-5 py-2.5 bg-[#8B5F4D] hover:bg-[#74503F] text-[#FBF9F5] text-xs sm:text-sm font-sans font-medium rounded-full shadow-sm transition flex items-center gap-1.5 active:scale-95"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>File Crop Claim</span>
          </Link>
          <Link
            to="/farmer/register-farm"
            className="px-5 py-2.5 bg-[#EAE3D9] hover:bg-[#DED5CA] text-[#1B1D1C] text-xs sm:text-sm font-sans font-medium rounded-full border border-[#CAB4AA] transition flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#8B5F4D]" />
            <span>Add New Farm</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row in Serein Clean Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#F5EFE6] p-6 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
          <span className="text-xs font-sans uppercase tracking-wider text-[#68625B] font-medium">Registered Farms</span>
          <div className="text-3xl font-serif font-normal text-[#1B1D1C] mt-2">1 Plot</div>
          <span className="text-xs text-[#5B7553] font-medium mt-1 inline-block">2.5 Hectares (Verified)</span>
        </div>

        <div className="bg-[#F5EFE6] p-6 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
          <span className="text-xs font-sans uppercase tracking-wider text-[#68625B] font-medium">Active Policy</span>
          <div className="text-2xl font-serif font-normal text-[#1B1D1C] mt-2 truncate">POL-PMFBY-BHP</div>
          <span className="text-xs text-[#8B5F4D] font-medium mt-1 inline-block">Sum Insured: ₹1,75,000</span>
        </div>

        <div className="bg-[#F5EFE6] p-6 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
          <span className="text-xs font-sans uppercase tracking-wider text-[#68625B] font-medium">Filed Claims</span>
          <div className="text-3xl font-serif font-normal text-[#1B1D1C] mt-2">1 Claim</div>
          <span className="text-xs text-[#8B5F4D] font-medium mt-1 inline-block">CLM001 (Under Review)</span>
        </div>

        <div className="bg-[#F5EFE6] p-6 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
          <span className="text-xs font-sans uppercase tracking-wider text-[#68625B] font-medium">Settlement Estimate</span>
          <div className="text-3xl font-serif font-normal text-[#1B1D1C] mt-2">₹1,13,750</div>
          <span className="text-xs text-[#68625B] mt-1 inline-block">Pending Assessor Sign-Off</span>
        </div>
      </div>

      {/* Active Claim Spotlight in Serein Editorial Layout */}
      <div className="bg-[#F5EFE6] rounded-3xl border border-[#EAE3D9] p-8 shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D9]">
          <div>
            <h3 className="text-2xl font-serif font-normal text-[#1B1D1C]">Current Claim Status: CLM001</h3>
            <p className="text-xs sm:text-sm text-[#68625B] font-sans mt-0.5">
              Rabi 2026 Wheat Crop Loss · Incident Date: Nov 05, 2026
            </p>
          </div>
          <StatusBadge status="Pending Review" />
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#EAE3D9]/60 border border-[#CAB4AA]/40 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#5B7553] font-semibold">Stage 1</span>
            <h4 className="text-sm font-serif font-semibold text-[#1B1D1C] mt-0.5">Submitted</h4>
            <p className="text-xs text-[#68625B] mt-0.5">Nov 06, 10:30 IST</p>
          </div>
          <div className="p-4 bg-[#EAE3D9]/60 border border-[#CAB4AA]/40 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#5B7553] font-semibold">Stage 2</span>
            <h4 className="text-sm font-serif font-semibold text-[#1B1D1C] mt-0.5">Cadastral Matched</h4>
            <p className="text-xs text-[#68625B] mt-0.5">Khasra 48/2 Area: 1.5% Δ</p>
          </div>
          <div className="p-4 bg-[#EAE3D9]/60 border border-[#CAB4AA]/40 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#5B7553] font-semibold">Stage 3</span>
            <h4 className="text-sm font-serif font-semibold text-[#1B1D1C] mt-0.5">Satellite Verified</h4>
            <p className="text-xs text-[#68625B] mt-0.5">NDVI Drought Crash Confirmed</p>
          </div>
          <div className="p-4 bg-[#EAE3D9]/90 border border-[#8B5F4D]/40 rounded-2xl">
            <span className="text-[10px] font-mono uppercase text-[#8B5F4D] font-semibold">Stage 4</span>
            <h4 className="text-sm font-serif font-semibold text-[#1B1D1C] mt-0.5">Assessor Review</h4>
            <p className="text-xs text-[#8B5F4D] font-medium mt-0.5">Under Final Adjudication</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Link
            to="/farmer/track-claim"
            className="text-xs sm:text-sm font-sans font-medium text-[#8B5F4D] hover:text-[#1B1D1C] flex items-center gap-1.5 transition-colors"
          >
            <span>Track detailed timeline & view evidence</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
