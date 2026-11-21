import React from 'react';
import { Link } from 'react-router-dom';
import { DharaNav } from '../components/common/DharaNav';
import { FinalCtaFooter } from '../components/cinematic/FinalCtaFooter';
import { Globe, Heart, Shield, Sparkles, Sprout, ArrowRight, Compass, Eye, CheckCircle2 } from 'lucide-react';

export const VisionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#CAB4AA]/30 selection:text-[#1B1D1C]">
      <DharaNav />

      {/* Hero Header in Serein Luxury Style */}
      <section className="relative pt-44 sm:pt-48 pb-20 px-6 sm:px-8 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#F5EFE6] rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium tracking-[0.2em] uppercase mb-6 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-[#8B5F4D]" />
            <span>Our Vision & Philosophy</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-[1.06] mb-8">
            Reconciling the view from space <br />
            <span className="italic text-[#8B5F4D]">
              with the soil at our feet.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#68625B] font-sans font-normal leading-relaxed max-w-2xl mx-auto">
            We believe that no cultivator should suffer the indignity of protracted bureaucratic disputes 
            when climate adversity strikes — and no insurer should be forced to underwrite risk in the dark.
          </p>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 px-6 sm:px-8 border-t border-[#EAE3D9] bg-[#F5EFE6]">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FBF9F5] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all flex flex-col justify-between shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] text-[#5B7553] flex items-center justify-center mb-6">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-normal text-[#1B1D1C] mb-3">
                  Farmer Dignity & Transparency
                </h3>
                <p className="text-sm text-[#68625B] leading-relaxed font-sans font-normal">
                  Farming is inherently exposed to unpredictable meteorological shocks. We give cultivators access 
                  to the exact same orbital indices used by underwriters, ensuring decisions are never opaque or arbitrary.
                </p>
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-[#FBF9F5] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all flex flex-col justify-between shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] text-[#8B5F4D] flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-normal text-[#1B1D1C] mb-3">
                  Underwriting Integrity
                </h3>
                <p className="text-sm text-[#68625B] leading-relaxed font-sans font-normal">
                  Crop insurance schemes cannot survive systemic fraud or fictitious claims. PostGIS parcel boundary 
                  mapping eliminates phantom acreages and enforces mathematical truth.
                </p>
              </div>
            </div>

            <div className="p-8 sm:p-10 rounded-3xl bg-[#FBF9F5] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all flex flex-col justify-between shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] text-[#1B1D1C] flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-normal text-[#1B1D1C] mb-3">
                  Statutory 21-Day Settlement
                </h3>
                <p className="text-sm text-[#68625B] leading-relaxed font-sans font-normal">
                  PMFBY mandates claim settlement within 21 days of crop loss notification. Our automated audit 
                  engine flags SLA bottlenecks in real time, upholding the societal pact between state and grower.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Serein Editorial Narrative */}
      <section className="py-24 px-6 sm:px-8 max-w-4xl mx-auto space-y-12">
        <div className="text-xs font-sans font-semibold uppercase tracking-[0.22em] text-[#8B5F4D]">
          THE DHARA CONVICTION
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight">
          When evidence replaces conjecture, trust becomes inevitable.
        </h2>
        <div className="prose prose-lg text-[#68625B] font-sans leading-relaxed space-y-6">
          <p>
            For generations, the agricultural insurance claim has been marked by adversarial tension. 
            Cultivators perceive insurance companies as distant gatekeepers looking for reasons to reject claims. 
            Insurers perceive moral hazard, ghost acreage, and inflated crop cut figures that undermine solvency.
          </p>
          <p>
            DHARA reconciles this divide not through persuasion, but through empirical data. 
            By cross-referencing Sentinel-2 optical imagery with cadastral Khasra maps and computer vision foliar 
            disease scans, we create a single immutable truth that both parties can inspect and respect.
          </p>
        </div>
      </section>

      <FinalCtaFooter />
    </div>
  );
};
