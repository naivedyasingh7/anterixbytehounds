import React from 'react';
import { Link } from 'react-router-dom';
import { DharaNav } from '../../components/common/DharaNav';
import { 
  ShieldCheck, 
  FileCheck, 
  Activity, 
  Clock, 
  MapPin, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  ShieldAlert,
  Download,
  Filter
} from 'lucide-react';
import { MOCK_CLAIMS_DATA } from '../../services/mockData';

export const InsurePortalHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <DharaNav />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-44 sm:pt-48 pb-20 space-y-12">
        
        {/* Header & Quick Action */}
        <div className="rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE3D9] text-[#68625B] text-xs font-sans font-medium uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#8B5F4D]"></span>
              <span>Officer Sharma • Senior Agriculture Underwriter</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight">
              DHARA Insure Cockpit
            </h1>

            <p className="text-[#68625B] text-base font-sans font-normal max-w-xl leading-relaxed">
              Unified institutional underwriting cockpit. Cross-verify multi-engine spatial geometry, 
              vegetative health curves, and compliance timelines to issue defensible claim settlements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/insure/claims"
              className="px-6 py-3.5 rounded-full bg-[#1B1D1C] text-[#FBF9F5] text-xs sm:text-sm font-sans font-medium uppercase tracking-wider hover:bg-[#333634] transition-all flex items-center gap-2 shadow-sm"
            >
              <FileCheck className="w-4 h-4" />
              <span>Claims Manager</span>
            </Link>

            <Link
              to="/insure/workspace/CLM001"
              className="px-6 py-3.5 rounded-full bg-[#8B5F4D] text-[#FBF9F5] hover:bg-[#74503F] text-xs sm:text-sm font-sans font-medium uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Launch CLM001 Workspace</span>
            </Link>
          </div>
        </div>

        {/* 4 Core Verification Engines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Link
            to="/insure/verification"
            className="group p-8 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all flex flex-col justify-between shadow-[0_2px_12px_rgba(27,29,28,0.02)] hover:shadow-md"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#1B1D1C] flex items-center justify-center mb-6 group-hover:bg-[#1B1D1C] group-hover:text-white transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-[#8B5F4D] tracking-wider">ENGINE 1</span>
              <h3 className="text-xl font-serif font-normal text-[#1B1D1C] mt-1 mb-2">
                Cadastral Land Audit
              </h3>
              <p className="text-xs sm:text-sm text-[#68625B] leading-relaxed">
                PostGIS ellipsoidal UTM 43N polygon area calculation. Cross-references Khasra boundaries to flag ghost acreage.
              </p>
            </div>
            <div className="pt-6 border-t border-[#EAE3D9] mt-6 flex items-center justify-between text-xs font-sans font-semibold text-[#1B1D1C] group-hover:text-[#8B5F4D]">
              <span>Audited: 1,482 Plots</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/insure/verification"
            className="group p-8 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all flex flex-col justify-between shadow-[0_2px_12px_rgba(27,29,28,0.02)] hover:shadow-md"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#1B1D1C] flex items-center justify-center mb-6 group-hover:bg-[#1B1D1C] group-hover:text-white transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-[#8B5F4D] tracking-wider">ENGINE 2</span>
              <h3 className="text-xl font-serif font-normal text-[#1B1D1C] mt-1 mb-2">
                Crop Yield Loss Model
              </h3>
              <p className="text-xs sm:text-sm text-[#68625B] leading-relaxed">
                XGBoost ML regression modeling Sentinel-2 NDVI temporal curves, weather deficits, and historical yields.
              </p>
            </div>
            <div className="pt-6 border-t border-[#EAE3D9] mt-6 flex items-center justify-between text-xs font-sans font-semibold text-[#1B1D1C] group-hover:text-[#8B5F4D]">
              <span>Yield Loss: 42.4%</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/insure/audit"
            className="group p-8 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all flex flex-col justify-between shadow-[0_2px_12px_rgba(27,29,28,0.02)] hover:shadow-md"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#1B1D1C] flex items-center justify-center mb-6 group-hover:bg-[#1B1D1C] group-hover:text-white transition-colors">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-[#8B5F4D] tracking-wider">ENGINE 3</span>
              <h3 className="text-xl font-serif font-normal text-[#1B1D1C] mt-1 mb-2">
                SLA Compliance Audit
              </h3>
              <p className="text-xs sm:text-sm text-[#68625B] leading-relaxed">
                Tracks milestone lifecycle against statutory 21-day PMFBY mandate. Detects back-dating and processing bottlenecks.
              </p>
            </div>
            <div className="pt-6 border-t border-[#EAE3D9] mt-6 flex items-center justify-between text-xs font-sans font-semibold text-[#1B1D1C] group-hover:text-[#8B5F4D]">
              <span>SLA Health: 94.2%</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/insure/workspace/CLM001"
            className="group p-8 rounded-3xl bg-[#1B1D1C] text-[#FBF9F5] border border-[#333634] hover:border-[#CAB4AA] transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#333634] text-[#CAB4AA] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase text-[#CAB4AA] tracking-wider">UNIFIED COCKPIT</span>
              <h3 className="text-xl font-serif font-normal text-[#FBF9F5] mt-1 mb-2">
                Claim Workspace
              </h3>
              <p className="text-xs sm:text-sm text-[#CAB4AA]/80 leading-relaxed">
                Single pane of glass combining cadastral map, satellite charts, loss calculation, and one-click settlement approval.
              </p>
            </div>
            <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs font-sans font-semibold text-[#CAB4AA]">
              <span>Active: CLM001</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

      </main>

      {/* Clean Workspace Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#68625B]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-[#1B1D1C]">DHARA INSURE</span>
          <span>·</span>
          <span>Underwriting & Audit Cockpit v2.4</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#8B5F4D]">
          <span className="w-2 h-2 rounded-full bg-[#5B7553]"></span>
          <span>PostGIS Equal-Area UTM 43N Active</span>
          <span>·</span>
          <span>© 2026 DHARA</span>
        </div>
      </footer>
    </div>
  );
};
