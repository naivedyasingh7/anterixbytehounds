import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, MapPin, FileCheck2, Clock, PlusCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">Farmer Self-Service Portal</span>
          <h1 className="text-2xl font-bold mt-1">Namaste, {user?.full_name || 'Rajesh Kumar'}!</h1>
          <p className="text-xs text-emerald-100 mt-1">
            Village Berasia · District Bhopal, Madhya Pradesh · Farmer ID: FAR-MP-BHP-001
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/farmer/submit-claim"
            className="px-4 py-2 bg-white text-emerald-800 text-xs font-bold rounded-xl shadow-md hover:bg-emerald-50 transition flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            File Crop Claim
          </Link>
          <Link
            to="/farmer/register-farm"
            className="px-4 py-2 bg-emerald-900/60 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl border border-emerald-400/30 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Farm
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Registered Farms</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">1 Plot</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">2.5 Hectares (Verified)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Active Policy</span>
          <div className="text-xl font-bold text-slate-900 mt-1 truncate">POL-PMFBY-BHP</div>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 inline-block">Sum Insured: ₹1,75,000</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Filed Claims</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">1 Claim</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">CLM001 (Under Review)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Claim Settlement Est.</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">₹1,13,750</div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Pending Assessor Sign-Off</span>
        </div>
      </div>

      {/* Active Claim Spotlight */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Current Claim Status (CLM001)</h3>
            <p className="text-xs text-slate-500">Rabi 2026 Wheat Crop Loss · Incident Date: Nov 05, 2026</p>
          </div>
          <StatusBadge status="Pending Review" />
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Stage 1</span>
            <h4 className="text-xs font-bold text-slate-900 mt-0.5">Submitted</h4>
            <p className="text-[11px] text-slate-500">Nov 06, 10:30 IST</p>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Stage 2</span>
            <h4 className="text-xs font-bold text-slate-900 mt-0.5">Cadastral Matched</h4>
            <p className="text-[11px] text-slate-500">Khasra 48/2 Area: 1.5% Δ</p>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Stage 3</span>
            <h4 className="text-xs font-bold text-slate-900 mt-0.5">Satellite Verified</h4>
            <p className="text-[11px] text-slate-500">NDVI Drought Stress Confirmed</p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-[10px] font-bold text-blue-700 uppercase">Stage 4</span>
            <h4 className="text-xs font-bold text-slate-900 mt-0.5">Assessor Review</h4>
            <p className="text-[11px] text-blue-600 font-semibold">Under Final Verification</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Link
            to="/farmer/track-claim"
            className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
          >
            Track detailed timeline & view evidence <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
