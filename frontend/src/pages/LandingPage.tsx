import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  ShieldCheck, 
  Satellite, 
  Layers, 
  Activity, 
  History, 
  FileCheck2, 
  TrendingUp, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginAs } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = (role: 'farmer' | 'insurance_officer', redirectPath: string) => {
    loginAs(role);
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
            <Cpu className="w-3.5 h-3.5" /> Next-Generation InsurTech Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            AgriVerify AI
          </h1>
          <p className="text-xl sm:text-2xl font-light text-emerald-200">
            AI-powered agricultural insurance verification
          </p>

          <p className="max-w-2xl mx-auto text-slate-300 text-base leading-relaxed">
            Eliminating claims ambiguity and settlement delays. AgriVerify AI combines Sentinel-2 multi-spectral satellite imagery, cadastral Khasra GIS delineation, and automated process audits to deliver evidence-backed claim adjudications.
          </p>

          {/* Quick Access Dual Portal Login Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={() => handleQuickLogin('farmer', '/farmer/dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-semibold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Sprout className="w-5 h-5" />
              <span>Enter Farmer Portal</span>
              <ArrowRight className="w-4 h-4 opacity-75" />
            </button>

            <button
              onClick={() => handleQuickLogin('insurance_officer', '/insurance/dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-semibold shadow-lg flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Insurance Officer Portal</span>
              <ArrowRight className="w-4 h-4 opacity-75" />
            </button>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            Instant Demo Access: One-click pre-authenticated roles for evaluation.
          </p>
        </div>
      </section>

      {/* How The Platform Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Unified Workflow</h2>
          <h3 className="text-3xl font-bold text-slate-900">How AgriVerify AI Works</h3>
          <p className="text-slate-600 text-sm">
            From farm boundary registration to final assessor sign-off in 4 transparent stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Farm Registration",
              desc: "Farmer maps plot boundary on satellite canvas and links local Khasra cadastral records.",
              icon: Layers
            },
            {
              step: "02",
              title: "Claim Submission",
              desc: "Filing crop loss incident with geotagged field photos and harvest loss details.",
              icon: FileCheck2
            },
            {
              step: "03",
              title: "3-Engine Verification",
              desc: "Automated spatial area matching, Sentinel-2 NDVI vegetative loss check, and timeline audit.",
              icon: Satellite
            },
            {
              step: "04",
              title: "Assessor Settlement",
              desc: "Underwriters review synthesized evidence in the Unified Workspace to approve or flag.",
              icon: ShieldCheck
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition">
              <span className="text-3xl font-black text-slate-100 absolute top-4 right-4 group-hover:text-emerald-50 transition">
                {item.step}
              </span>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">{item.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Three Core Verification Engines */}
      <section className="py-20 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Core Intelligence</span>
            <h3 className="text-3xl font-bold">The Three Verification Engines</h3>
            <p className="text-slate-400 text-sm">
              The foundational pillars that separate factual claims from inflated or fraudulent declarations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Engine 1 */}
            <div className="bg-slate-800/90 border border-slate-700 p-7 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Engine 1: Farm Verification</h4>
                  <p className="text-xs text-blue-300 font-medium">Cadastral & Geospatial Delineation</p>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Interactively verifies field polygons against high-resolution satellite imagery and cadastral land records. Computes geodesic area to detect boundary inflation.
                </p>
                <div className="p-3 bg-slate-950/60 rounded-lg text-xs space-y-1 font-mono text-slate-400 border border-slate-800">
                  <p className="text-slate-300 font-semibold">Outputs:</p>
                  <p>• Verified (Δ ≤ 5%)</p>
                  <p>• Mismatch (Δ &gt; 15%)</p>
                  <p>• Manual Review / Insufficient</p>
                </div>
              </div>
              <Link 
                to="/insurance/engines/farm" 
                className="mt-6 text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5"
              >
                Inspect Engine 1 Specifications <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Engine 2 */}
            <div className="bg-slate-800/90 border border-emerald-500/30 p-7 rounded-2xl flex flex-col justify-between relative shadow-lg shadow-emerald-950">
              <span className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Satellite AI
              </span>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Engine 2: Yield Verification</h4>
                  <p className="text-xs text-emerald-300 font-medium">Sentinel-2 NDVI & Agro-Weather</p>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Extracts 10-day Sentinel-2 vegetation indices and correlates with precipitation data to assess vegetative crash. Compares farmer loss against an XGBoost yield baseline.
                </p>
                <div className="p-3 bg-slate-950/60 rounded-lg text-xs space-y-1 font-mono text-slate-400 border border-slate-800">
                  <p className="text-slate-300 font-semibold">Outputs:</p>
                  <p>• Multi-date NDVI greenness curve</p>
                  <p>• 30-day drought/heat anomaly index</p>
                  <p>• Reported vs Estimated yield (kg/ha)</p>
                </div>
              </div>
              <Link 
                to="/insurance/engines/yield" 
                className="mt-6 text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5"
              >
                Inspect Engine 2 Specifications <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Engine 3 */}
            <div className="bg-slate-800/90 border border-slate-700 p-7 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Engine 3: Process Audit</h4>
                  <p className="text-xs text-amber-300 font-medium">Timeline SLA & Fraud Anomaly Ingestion</p>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Ingests batch claims data to flag processing bottlenecks, missing mandatory evidence (sowing certificates), and out-of-order chronological events.
                </p>
                <div className="p-3 bg-slate-950/60 rounded-lg text-xs space-y-1 font-mono text-slate-400 border border-slate-800">
                  <p className="text-slate-300 font-semibold">Outputs:</p>
                  <p>• SLA Breaches (&gt; 21 days)</p>
                  <p>• Missing Khasra / Sowing Deeds</p>
                  <p>• Anomaly Investigation Triggers</p>
                </div>
              </div>
              <Link 
                to="/insurance/engines/audit" 
                className="mt-6 text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
              >
                Inspect Engine 3 Specifications <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Farmers and Insurers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Farmer Benefits */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Benefits for Farmers</h4>
                <p className="text-xs text-slate-500">Fast, transparent and dignified settlements</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><b>Instant Satellite Verification:</b> Objective proof of drought or flooding without relying solely on slow physical surveyors.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><b>Live Claim Tracking:</b> Full visibility into which stage the claim is currently undergoing (SLA tracking).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><b>Seamless Land Parcel Vault:</b> Store Khasra deeds, boundaries, and past harvest yields in one secure wallet.</span>
              </li>
            </ul>
          </div>

          {/* Insurer Benefits */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Benefits for Insurance Underwriters</h4>
                <p className="text-xs text-slate-500">Loss ratio protection and regulatory compliance</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span><b>Zero Ghost Acreage:</b> Automatic PostGIS geodesic area checks eliminate phantom land claims.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span><b>Unified Claim Workspace:</b> Review geospatial boundaries, NDVI timeseries, and documents in one cockpit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span><b>Audit-Proof PDF Reports:</b> One-click generation of legally defensible dossiers with empirical evidence.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 border-t border-slate-800 py-8 px-4 text-center text-xs">
        <p className="text-slate-300 font-semibold mb-1">AgriVerify AI – AI-Powered Agricultural Insurance Verification</p>
        <p>Built with FastAPI, React, PostGIS, Sentinel-2 Multispectral Data, and Scikit-learn.</p>
      </footer>
    </div>
  );
};
