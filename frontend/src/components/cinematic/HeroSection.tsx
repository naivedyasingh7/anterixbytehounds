import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const handleScrollToNext = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('details-collage-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      
      {/* Serein Wealth Continuously Playing Looping Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          src="/assets/hero-loop.mp4" 
          poster="/assets/hero-loop-poster.webp"
          className="w-full h-full object-cover object-center filter brightness-95"
        />
        {/* Soft Warm Cinematic Overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FBF9F5] to-transparent"></div>
      </div>

      {/* Hero Content (Serein Exact Typography & Layout) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pt-24 sm:pt-20">
        
        {/* Prominent DHARA Brand Pre-Kicker */}
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-sans tracking-[0.2em] uppercase mb-6 shadow-lg">
          <span className="font-serif font-bold text-base sm:text-xl tracking-wider text-white">DHARA</span>
          <span className="text-white/40">·</span>
          <span className="text-white/90">INDEPENDENT · EVIDENCE-BASED</span>
        </div>

        {/* Primary Headline (Cormorant Garamond Luxury Typography) */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-normal font-serif text-[#FBF9F5] tracking-tight leading-[1.04] mb-8 drop-shadow-lg">
          Agricultural intelligence, <br />
          <span className="italic font-normal text-[#FBF9F5]">
            built around you.
          </span>
        </h1>

        {/* Supporting Paragraph */}
        <p className="max-w-2xl text-base sm:text-lg text-[#FBF9F5]/90 font-sans font-normal leading-relaxed mb-10 drop-shadow">
          We bring your land boundaries, satellite vegetation indices, and long-term verification priorities into one coordinated approach.
        </p>

        {/* Serein Terracotta Pill Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleScrollToNext}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#8B5F4D] text-[#FBF9F5] font-serif italic text-base sm:text-lg hover:bg-[#74503F] hover:shadow-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore DHARA</span>
          </button>
        </div>

        {/* Subtle Scroll Indicator */}
        <button
          onClick={handleScrollToNext}
          className="mt-12 inline-flex items-center gap-2 text-xs font-sans tracking-widest text-[#FBF9F5]/70 hover:text-white uppercase transition-colors group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-[#1B1D1C] transition-all">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </button>

      </div>

    </section>
  );
};
