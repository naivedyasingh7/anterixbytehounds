import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, ArrowRight, Scan, Satellite, FileSpreadsheet, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

export const TwoEcosystemsSection: React.FC = () => {
  return (
    <section className="relative w-full py-24 bg-[#FBF9F5] text-[#1B1D1C] border-t border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium uppercase tracking-[0.18em] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5F4D]" />
            <span>Harmonized Dual Architecture</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-[1.08] mb-6">
            One Platform. <br />
            <span className="italic text-[#8B5F4D]">
              Two Ecosystems.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#68625B] font-sans font-normal leading-relaxed">
            A symbiotic data bridge connecting the individual tiller of the soil to the underwriters of national food security.
          </p>
        </div>

        {/* Dual Ecosystem Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* ECOSYSTEM 1: DHARA FARMER */}
          <div className="group relative rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] p-8 sm:p-12 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
            <div>
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE3D9] text-[#1B1D1C] text-xs font-sans font-medium uppercase tracking-wider">
                  <Sprout className="w-3.5 h-3.5 text-[#5B7553]" />
                  <span>DHARA FARMER</span>
                </div>
                <span className="text-xs font-mono text-[#68625B]">FOR CULTIVATORS & FPOs</span>
              </div>

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl font-serif font-normal text-[#1B1D1C] mb-4 leading-tight">
                Understand your crops. <br />
                <span className="italic text-[#5B7553]">Monitor your land.</span>
              </h3>

              <p className="text-[#68625B] text-sm sm:text-base font-sans leading-relaxed mb-8">
                Puts optical remote sensing and artificial intelligence directly into the hands of farmers. 
                Actionable diagnostics delivered in simple language, with zero bureaucratic friction.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3.5 mb-10">
                {[
                  'Mobile foliar pathogen diagnosis (Rust, Blight, Pests)',
                  'Cadastral parcel mapping cross-referenced with Revenue Khasra records',
                  'Sentinel-2 multi-spectral NDVI vegetation vigor indices',
                  'Multilingual agricultural advisory & localized treatment reports'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#1B1D1C] font-sans">
                    <CheckCircle2 className="w-4 h-4 text-[#5B7553] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/farmer"
              className="w-full py-4 rounded-full bg-[#1B1D1C] text-[#FBF9F5] font-sans font-medium text-xs uppercase tracking-wider hover:bg-[#333634] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Explore DHARA Farmer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* ECOSYSTEM 2: DHARA INSURE */}
          <div className="group relative rounded-3xl bg-[#1B1D1C] text-[#FBF9F5] border border-[#333634] p-8 sm:p-12 flex flex-col justify-between transition-all duration-300 shadow-[0_12px_40px_rgba(27,29,28,0.12)]">
            <div>
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#333634] text-[#CAB4AA] text-xs font-sans font-medium uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CAB4AA]" />
                  <span>DHARA INSURE</span>
                </div>
                <span className="text-xs font-mono text-[#CAB4AA]/70">FOR UNDERWRITERS & AUDITORS</span>
              </div>

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl font-serif font-normal text-[#FBF9F5] mb-4 leading-tight">
                Evidence. Verification. <br />
                <span className="italic text-[#CAB4AA]">Intelligence.</span>
              </h3>

              <p className="text-[#CAB4AA]/80 text-sm sm:text-base font-sans leading-relaxed mb-8">
                The institutional operating system for crop insurance verification. 
                Replaces manual delay with mathematical consensus and satellite audit trails.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3.5 mb-10">
                {[
                  'Engine 1: Cadastral verification with UTM Zone 43N polygon gap analysis',
                  'Engine 2: Empirical XGBoost yield loss modeling & phenological AUC',
                  'Engine 3: Automated statutory 21-day PMFBY audit milestone tracking',
                  'Unified Cockpit: One-click settlement approval with cryptographic evidence'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-[#FBF9F5]/90 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-[#CAB4AA] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/insure"
              className="w-full py-4 rounded-full bg-[#F5EFE6] text-[#1B1D1C] font-sans font-medium text-xs uppercase tracking-wider hover:bg-[#EAE3D9] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Explore DHARA Insure</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
