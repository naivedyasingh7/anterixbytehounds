import React from 'react';
import { Link } from 'react-router-dom';
import { DharaNav } from '../../components/common/DharaNav';
import { 
  Sprout, 
  Scan, 
  Layers, 
  Satellite, 
  FileText, 
  FileCheck2, 
  ArrowRight, 
  CloudSun, 
  AlertCircle, 
  CheckCircle2, 
  MapPin,
  Clock
} from 'lucide-react';

export const FarmerPortalHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <DharaNav />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-44 sm:pt-48 pb-20 space-y-12">
        
        {/* Welcome Banner (Serein Luxury Editorial Card) */}
        <div className="rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE3D9] text-[#68625B] text-xs font-sans font-medium uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#5B7553]"></span>
              <span>Logged in as Rajesh Kumar Patel • Berasia, Bhopal</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight">
              Welcome to <span className="font-semibold">DHARA Farmer</span>
            </h1>

            <p className="text-[#68625B] text-base font-sans font-normal max-w-xl leading-relaxed">
              Your direct portal to satellite-based field monitoring, instant AI plant disease diagnosis, and evidence-backed crop insurance claims.
            </p>
          </div>

          <Link
            to="/farmer/disease"
            className="px-8 py-4 rounded-full bg-[#8B5F4D] text-[#FBF9F5] font-sans font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-[#74503F] transition-all flex items-center gap-2.5 shrink-0 shadow-md active:scale-95"
          >
            <Scan className="w-4 h-4" />
            <span>Scan Leaf For Disease</span>
          </Link>
        </div>

        {/* Quick KPI Cards (Serein Clean Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all flex items-center justify-between shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
            <div>
              <div className="text-xs font-sans uppercase tracking-wider text-[#68625B]">Registered Land</div>
              <div className="text-3xl font-serif font-normal text-[#1B1D1C] mt-1.5">2.50 Ha</div>
              <div className="text-xs font-sans text-[#8B5F4D] mt-0.5">Khasra 48/2 • Berasia</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#1B1D1C] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#8B5F4D]" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all flex items-center justify-between shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
            <div>
              <div className="text-xs font-sans uppercase tracking-wider text-[#68625B]">Active Coverage</div>
              <div className="text-3xl font-serif font-normal text-[#1B1D1C] mt-1.5">₹1,75,000</div>
              <div className="text-xs font-sans text-[#5B7553] mt-0.5">PMFBY Rabi 2026 (Active)</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#5B7553] flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all flex items-center justify-between shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
            <div>
              <div className="text-xs font-sans uppercase tracking-wider text-[#68625B]">Satellite Health</div>
              <div className="text-3xl font-serif font-normal text-[#1B1D1C] mt-1.5">NDVI 0.68</div>
              <div className="text-xs font-sans text-[#8B5F4D] mt-0.5">Pass 3 days ago • Normal</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#1B1D1C] flex items-center justify-center">
              <Satellite className="w-5 h-5 text-[#8B5F4D]" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all flex items-center justify-between shadow-[0_2px_12px_rgba(27,29,28,0.02)]">
            <div>
              <div className="text-xs font-sans uppercase tracking-wider text-[#68625B]">Active Claims</div>
              <div className="text-3xl font-serif font-normal text-[#1B1D1C] mt-1.5">1 Pending</div>
              <div className="text-xs font-sans text-[#8B5F4D] mt-0.5">CLM001 • In Assessment</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#8B5F4D] flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Feature Hub Grid (6 Luxury Cards Matching Serein Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Crop Disease Scanner */}
          <Link
            to="/farmer/disease"
            className="group rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_36px_rgba(27,29,28,0.05)]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#1B1D1C] flex items-center justify-center mb-6 group-hover:bg-[#1B1D1C] group-hover:text-white transition-colors">
                <Scan className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-serif font-normal text-[#1B1D1C] mb-3 group-hover:text-[#8B5F4D] transition-colors">
                AI Crop Disease Diagnostics
              </h3>

              <p className="text-sm font-sans text-[#68625B] leading-relaxed mb-8">
                Take or upload a picture of an affected crop leaf. The computer vision model detects rust, blight, and pests with instant organic and chemical treatment advice.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#1B1D1C] group-hover:text-[#8B5F4D] uppercase tracking-wider transition-colors pt-4 border-t border-[#EAE3D9]">
              <span>Launch Scanner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Farm Boundary & Geodesics */}
          <Link
            to="/farmer/farms"
            className="group rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_36px_rgba(27,29,28,0.05)]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#1B1D1C] flex items-center justify-center mb-6 group-hover:bg-[#1B1D1C] group-hover:text-white transition-colors">
                <Layers className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-serif font-normal text-[#1B1D1C] mb-3 group-hover:text-[#8B5F4D] transition-colors">
                Farm Registration & Map
              </h3>

              <p className="text-sm font-sans text-[#68625B] leading-relaxed mb-8">
                Draw plot boundaries on satellite imagery, compute exact geodesic hectares, and link Khasra land revenue survey records.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#1B1D1C] group-hover:text-[#8B5F4D] uppercase tracking-wider transition-colors pt-4 border-t border-[#EAE3D9]">
              <span>View Plot Map</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Sentinel-2 NDVI */}
          <Link
            to="/farmer/satellite"
            className="group rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_36px_rgba(27,29,28,0.05)]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#1B1D1C] flex items-center justify-center mb-6 group-hover:bg-[#1B1D1C] group-hover:text-white transition-colors">
                <Satellite className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-serif font-normal text-[#1B1D1C] mb-3 group-hover:text-[#8B5F4D] transition-colors">
                Sentinel-2 NDVI Monitoring
              </h3>

              <p className="text-sm font-sans text-[#68625B] leading-relaxed mb-8">
                Inspect 10-day false-color NDVI satellite passes for your land parcels. Monitor vegetative chlorophyll density and detect moisture stress early.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#1B1D1C] group-hover:text-[#8B5F4D] uppercase tracking-wider transition-colors pt-4 border-t border-[#EAE3D9]">
              <span>Explore NDVI Imagery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Health Reports */}
          <Link
            to="/farmer/reports"
            className="group rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_36px_rgba(27,29,28,0.05)]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#1B1D1C] flex items-center justify-center mb-6 group-hover:bg-[#1B1D1C] group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-serif font-normal text-[#1B1D1C] mb-3 group-hover:text-[#8B5F4D] transition-colors">
                Agricultural Health Dossiers
              </h3>

              <p className="text-sm font-sans text-[#68625B] leading-relaxed mb-8">
                Download verified agronomic health certificates and weather risk summaries to share with banks, cooperatives, or assessors.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#1B1D1C] group-hover:text-[#8B5F4D] uppercase tracking-wider transition-colors pt-4 border-t border-[#EAE3D9]">
              <span>Download Dossiers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Submit Claim */}
          <Link
            to="/farmer/submit-claim"
            className="group rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_36px_rgba(27,29,28,0.05)]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#8B5F4D] flex items-center justify-center mb-6 group-hover:bg-[#8B5F4D] group-hover:text-white transition-colors">
                <AlertCircle className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-serif font-normal text-[#1B1D1C] mb-3 group-hover:text-[#8B5F4D] transition-colors">
                File Crop Loss Claim
              </h3>

              <p className="text-sm font-sans text-[#68625B] leading-relaxed mb-8">
                Incurred damage from drought, unseasonal rain, or pest infestation? File an evidence-backed claim under your active insurance policy in minutes.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#1B1D1C] group-hover:text-[#8B5F4D] uppercase tracking-wider transition-colors pt-4 border-t border-[#EAE3D9]">
              <span>Start Claim Wizard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 6: Track Claim */}
          <Link
            to="/farmer/track-claim"
            className="group rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_36px_rgba(27,29,28,0.05)]"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAE3D9] text-[#1B1D1C] flex items-center justify-center mb-6 group-hover:bg-[#1B1D1C] group-hover:text-white transition-colors">
                <Clock className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-serif font-normal text-[#1B1D1C] mb-3 group-hover:text-[#8B5F4D] transition-colors">
                Track Claim Progress
              </h3>

              <p className="text-sm font-sans text-[#68625B] leading-relaxed mb-8">
                Follow your claim through the audit timeline: document verification, satellite inspection, officer review, and disbursement.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#1B1D1C] group-hover:text-[#8B5F4D] uppercase tracking-wider transition-colors pt-4 border-t border-[#EAE3D9]">
              <span>Track CLM001</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

      </main>

      {/* Clean Workspace Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#68625B]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-[#1B1D1C]">DHARA FARMER</span>
          <span>·</span>
          <span>Cultivator Operating Workspace v2.4</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#8B5F4D]">
          <span className="w-2 h-2 rounded-full bg-[#5B7553]"></span>
          <span>Sentinel-2 API Connected</span>
          <span>·</span>
          <span>© 2026 DHARA</span>
        </div>
      </footer>
    </div>
  );
};
