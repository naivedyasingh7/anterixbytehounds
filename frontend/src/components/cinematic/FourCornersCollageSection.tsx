import React from 'react';
import { ArrowDown } from 'lucide-react';

export const FourCornersCollageSection: React.FC = () => {
  const scrollToNext = () => {
    const el = document.getElementById('dhara-animation-stage');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="details-collage-section" 
      className="relative min-h-screen w-full bg-[#FBF9F5] text-[#1B1D1C] flex items-center justify-center px-6 py-24 overflow-hidden border-t border-[#EAE3D9]"
    >
      
      {/* 4 FLOATING CORNER IMAGES (Matching Serein Wealth Reference Composition) */}
      
      {/* TOP-LEFT CORNER: REFERENCE A — EARTH HERO */}
      <div className="absolute top-10 left-6 sm:left-12 lg:left-16 z-10 w-44 sm:w-60 md:w-72 group">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(27,29,28,0.08)] border border-[#EAE3D9] transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl">
          <img 
            src="/assets/reference-a-earth.jpg" 
            alt="Reference A: Earth Orbit Synoptic View" 
            className="w-full h-32 sm:h-40 md:h-48 object-cover filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-2.5 left-3 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white font-medium">
            01 · Earth Horizon
          </div>
        </div>
      </div>

      {/* TOP-RIGHT CORNER: REFERENCE B — SATELLITE ORBIT */}
      <div className="absolute top-10 right-6 sm:right-12 lg:right-16 z-10 w-44 sm:w-60 md:w-72 group">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(27,29,28,0.08)] border border-[#EAE3D9] transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl">
          <img 
            src="/assets/reference-b-satellite.jpg" 
            alt="Reference B: Satellite In Orbit" 
            className="w-full h-32 sm:h-40 md:h-48 object-cover filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-2.5 left-3 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white font-medium">
            02 · Sentinel-2 Sensor
          </div>
        </div>
      </div>

      {/* BOTTOM-LEFT CORNER: REFERENCE C — AGRICULTURAL LAND */}
      <div className="absolute bottom-10 left-6 sm:left-12 lg:left-16 z-10 w-44 sm:w-60 md:w-72 group">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(27,29,28,0.08)] border border-[#EAE3D9] transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl">
          <img 
            src="/assets/reference-c-farmland.jpg" 
            alt="Reference C: Aerial Cadastral Farmland" 
            className="w-full h-32 sm:h-40 md:h-48 object-cover filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-2.5 left-3 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white font-medium">
            03 · Cadastral Farmland
          </div>
        </div>
      </div>

      {/* BOTTOM-RIGHT CORNER: REFERENCE D — NDVI SATELLITE MAP */}
      <div className="absolute bottom-10 right-6 sm:right-12 lg:right-16 z-10 w-44 sm:w-60 md:w-72 group">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(27,29,28,0.08)] border border-[#EAE3D9] transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl">
          <img 
            src="/assets/reference-d-ndvi.jpg" 
            alt="Reference D: NDVI Multispectral Vegetation Map" 
            className="w-full h-32 sm:h-40 md:h-48 object-cover filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-2.5 left-3 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-white font-medium">
            04 · NDVI Vegetation Map
          </div>
        </div>
      </div>

      {/* CENTER EDITORIAL HEADLINE (Serein Exact Reference) */}
      <div className="relative z-20 max-w-2xl mx-auto text-center px-4 py-28 sm:py-36">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-normal font-serif text-[#1B1D1C] tracking-tight leading-[1.08]">
          Imagine having <span className="font-semibold text-[#1B1D1C]">DHARA</span> intelligence <br />
          quietly taking care of <br />
          <span className="italic font-normal text-[#8B5F4D]">
            the details.
          </span>
        </h2>

        <p className="mt-8 text-sm sm:text-base text-[#68625B] font-sans max-w-lg mx-auto leading-relaxed">
          From high-resolution orbit to equal-area cadastral geometry and multi-spectral vegetation indices — 
          DHARA synchronizes each layer into empirical certainty.
        </p>

        {/* Action Link to the Interactive Animation */}
        <button
          onClick={scrollToNext}
          className="mt-10 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#1B1D1C] hover:bg-[#EAE3D9] text-xs font-sans font-medium uppercase tracking-wider transition-all shadow-sm"
        >
          <span>Watch Orbital To Cadastral Transition</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#8B5F4D]" />
        </button>
      </div>

    </section>
  );
};
