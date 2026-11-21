import React, { useState } from 'react';
import { 
  Scan, 
  Satellite, 
  Cpu, 
  LineChart, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const ConnectedIntelligenceSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const steps = [
    {
      id: 0,
      title: 'Ground Observations',
      icon: Scan,
      tag: 'LEAF STAGE',
      description: 'Cultivators upload mobile leaf photos and delineate cadastral field polygon boundaries.',
      metric: '0.1 mm resolution foliar imagery & localized Khasra geotags'
    },
    {
      id: 1,
      title: 'Satellite Intelligence',
      icon: Satellite,
      tag: 'ORBITAL STAGE',
      description: 'Sentinel-2 L2A captures multi-spectral surface reflectance across 13 VNIR/SWIR bands every 5 days.',
      metric: '10m GSD BOA reflectance • 290 km optical swath width'
    },
    {
      id: 2,
      title: 'Neural AI Analysis',
      icon: Cpu,
      tag: 'INFERENCE STAGE',
      description: 'Computer vision classifies foliar pathogens while XGBoost correlates phenological NDVI dips with rainfall deficits.',
      metric: 'Real-time inference & 94.8% pathogen classification'
    },
    {
      id: 3,
      title: 'Agricultural Insights',
      icon: LineChart,
      tag: 'ADVISORY STAGE',
      description: 'Automated synthesis generates parcel-level moisture deficit warnings and seasonal yield trajectories.',
      metric: 'Actionable spray timing & irrigation deficit alerts'
    },
    {
      id: 4,
      title: 'Insurance Verification',
      icon: ShieldCheck,
      tag: 'SETTLEMENT STAGE',
      description: 'Underwriters receive evidence-backed claim dossiers, eliminating manual survey friction and speeding payouts.',
      metric: '100% audit-traceable, tamper-proof legal settlements'
    }
  ];

  return (
    <section className="relative w-full py-24 bg-[#FBF9F5] text-[#1B1D1C] border-t border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium uppercase tracking-[0.18em] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5F4D]" />
            <span>End-to-End Traceability</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight mb-4">
            From the leaf on the ground <br />
            <span className="italic text-[#8B5F4D]">
              to the settlement in the ledger.
            </span>
          </h2>

          <p className="text-base text-[#68625B] font-sans font-normal leading-relaxed">
            A single, continuous chain of verifiable evidence connecting ground truth, satellite physics, and automated underwriting.
          </p>
        </div>

        {/* 5-Step Horizontal Flow / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          {steps.map((st, i) => {
            const Icon = st.icon;
            const isCurrent = activeStep === i;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStep(i)}
                onMouseEnter={() => setActiveStep(i)}
                className={`p-6 rounded-3xl text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1B1D1C] text-[#FBF9F5] shadow-lg scale-102 border border-[#333634]'
                    : 'bg-[#F5EFE6] text-[#1B1D1C] hover:bg-[#EAE3D9] border border-[#EAE3D9] hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-mono tracking-widest ${isCurrent ? 'text-[#CAB4AA]' : 'text-[#8B5F4D]'}`}>
                      STAGE 0{i + 1}
                    </span>
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-[#CAB4AA]' : 'text-[#68625B]'}`} />
                  </div>
                  <div className={`text-xs font-sans uppercase tracking-wider mb-1 font-semibold ${isCurrent ? 'text-[#CAB4AA]' : 'text-[#8B5F4D]'}`}>
                    {st.tag}
                  </div>
                  <h4 className="text-lg font-serif font-normal leading-snug">
                    {st.title}
                  </h4>
                </div>

                <div className={`mt-4 pt-3 border-t text-[11px] font-sans transition-colors ${isCurrent ? 'border-white/10 text-[#CAB4AA]' : 'border-[#EAE3D9] text-[#68625B]'}`}>
                  {isCurrent ? 'Active Stage' : 'Hover to inspect'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Panel (Serein Card Style with smooth fade) */}
        <div 
          key={activeStep}
          className="rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] p-8 sm:p-12 shadow-[0_4px_24px_rgba(27,29,28,0.03)] flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-300 ease-out"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-medium text-[#8B5F4D] uppercase tracking-wider">
                STAGE 0{activeStep + 1} · {steps[activeStep].tag}
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-serif font-normal text-[#1B1D1C]">
              {steps[activeStep].title}
            </h3>
            <p className="text-base text-[#68625B] font-sans leading-relaxed">
              {steps[activeStep].description}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#EAE3D9] text-[#1B1D1C] text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5B7553]" />
              <span>{steps[activeStep].metric}</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 4))}
              className="px-4 py-2 rounded-full bg-[#EAE3D9] text-[#1B1D1C] hover:bg-[#CAB4AA] text-xs font-sans font-medium transition-colors"
            >
              ← Previous Stage
            </button>
            <button
              onClick={() => setActiveStep((prev) => (prev < 4 ? prev + 1 : 0))}
              className="px-5 py-2 rounded-full bg-[#1B1D1C] text-[#FBF9F5] hover:bg-[#333634] text-xs font-sans font-medium transition-colors shadow-sm"
            >
              Next Stage →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
