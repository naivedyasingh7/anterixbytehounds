import React from 'react';
import { Link } from 'react-router-dom';

export const MissionPhilosophySection: React.FC = () => {
  return (
    <section className="relative w-full pt-28 pb-36 bg-[#FBF9F5] text-[#1B1D1C] border-t border-[#EAE3D9] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Two-Column Serein Layout (Matching Image 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: OUR MISSION */}
          <div className="space-y-6">
            <div className="text-xs font-sans font-semibold uppercase tracking-[0.24em] text-[#8B5F4D]">
              OUR MISSION
            </div>

            <h2 className="text-4xl sm:text-6xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-[1.08]">
              Prepared for every <br />
              <span className="italic font-normal">season of growth.</span>
            </h2>

            <p className="text-base text-[#68625B] font-sans leading-relaxed">
              Our purpose is to help the agrarian ecosystem navigate climate volatility with clarity, confidence, and peace of mind. 
              Creating an empirical foundation that protects cultivators and underwriters alike is one of the most consequential ways we serve.
            </p>

            <p className="text-sm font-sans font-medium text-[#1B1D1C]">
              Our verification decisions are guided by ground-truth spectral physics, revenue cadastral records, and agreed-upon insurance contracts.
            </p>

            <div className="pt-4">
              <Link
                to="/vision"
                className="inline-flex px-8 py-3.5 rounded-full border border-[#1B1D1C] text-[#1B1D1C] font-serif italic text-base hover:bg-[#1B1D1C] hover:text-[#FBF9F5] transition-all shadow-sm"
              >
                Explore our vision
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: OUR PHILOSOPHY */}
          <div className="space-y-6">
            <div className="text-xs font-sans font-semibold uppercase tracking-[0.24em] text-[#8B5F4D]">
              OUR PHILOSOPHY
            </div>

            <h2 className="text-4xl sm:text-6xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-[1.08]">
              We believe agricultural guidance should bring clarity, confidence, and <br />
              <span className="italic font-normal">peace of mind.</span>
            </h2>

            <p className="text-base text-[#68625B] font-sans leading-relaxed">
              We care for the agrarian ecosystem the way a conscientious steward cares for the land: anticipating drought and pest vectors, 
              honoring statutory settlement timelines, and treating crop loss evidence with the highest evidentiary rigor.
            </p>

            <p className="text-sm font-sans font-medium text-[#1B1D1C]">
              Every algorithmic inference we make answers to that fiduciary commitment.
            </p>

            <div className="pt-4">
              <Link
                to="/technology"
                className="inline-flex px-8 py-3.5 rounded-full border border-[#1B1D1C] text-[#1B1D1C] font-serif italic text-base hover:bg-[#1B1D1C] hover:text-[#FBF9F5] transition-all shadow-sm"
              >
                Read our methodology
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Serein Exact Botanical Flowers Illustration Across Bottom (Matching Image 2) */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none opacity-45 flex justify-center">
        <img 
          src="/assets/botanical-flowers.png" 
          alt="Botanical wildflower illustration"
          className="w-full max-w-5xl h-auto object-contain object-bottom" 
        />
      </div>

    </section>
  );
};
