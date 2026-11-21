import React from 'react';

export const BreatheEasierSection: React.FC = () => {
  const pillars = [
    {
      title: 'Be Heard.',
      tagline: "Active listening isn't a feature. It's the foundation.",
      desc: 'Cultivators file crop loss claims directly with geotagged foliar photographs and cadastral survey numbers. Every submission is immutably timestamped and enters the verification pipeline without bureaucratic gatekeeping.'
    },
    {
      title: 'Feel Safe.',
      tagline: 'Trust through competence + transparency.',
      desc: 'We explain exactly what is happening, why it matters, and how it relates to policy terms. PostGIS equal-area projections compute plot geometry down to four decimal places, eliminating acreage disputes.'
    },
    {
      title: 'Feel Delivered.',
      tagline: 'Proactive, anticipatory service.',
      desc: 'We seek to identify potential vegetative stress and disease early through automated Sentinel-2 passes. Cultivators receive early warnings and underwriters receive continuous loss trajectory curves.'
    },
    {
      title: 'Perform Reliably.',
      tagline: 'Clear communication grounded in ground reality.',
      desc: "Technology doesn't replace human assessors; it empowers them. Clear communication, thoughtful perspective, and empirical data guarantee statutory 21-day settlement compliance."
    }
  ];

  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#FBF9F5] border-t border-[#EAE3D9] overflow-hidden">
      
      {/* Serein Ocean Reveal Video Container (Matching Images 3, 5, 8) */}
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden min-h-[580px] sm:min-h-[640px] flex items-center justify-center p-6 sm:p-12 shadow-2xl">
        
        {/* Continuously Playing Background Video: ocean-reveal.mp4 */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          src="/assets/ocean-reveal.mp4" 
          poster="/assets/ocean-reveal-poster.webp"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
        />

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-black/25"></div>

        {/* Floating Frosted Glass Card (Matching Image 5) */}
        <div className="relative z-10 w-full rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-xl border border-white/35 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/20">
            {pillars.map((p, idx) => (
              <div 
                key={idx} 
                className={`${idx > 0 ? 'pt-6 lg:pt-0 lg:pl-6' : ''} flex flex-col justify-start`}
              >
                <h3 className="text-3xl sm:text-4xl font-serif font-normal text-white mb-3">
                  {p.title}
                </h3>

                <p className="text-xs sm:text-sm font-sans font-medium text-white/90 mb-3 leading-snug">
                  {p.tagline}
                </p>

                <p className="text-xs font-sans text-white/80 leading-relaxed font-light">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
};
