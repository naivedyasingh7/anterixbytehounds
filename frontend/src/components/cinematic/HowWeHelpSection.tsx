import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const HowWeHelpSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const [activeStep, setActiveStep] = useState(1);

  const services = [
    {
      id: '01',
      title: 'AI Crop Disease Diagnostics',
      description: 'A living diagnostic model built around your crops, detecting foliar pathogens from mobile photos with actionable organic and chemical spray schedules.',
      link: '/farmer/disease',
      badge: 'FARMER',
      image: '/assets/reference-d-ndvi.jpg'
    },
    {
      id: '02',
      title: 'Farm Boundary & Geodesics',
      description: 'Interactive satellite polygon delineation cross-checked against Khasra land revenue records. Computes equal-area UTM Zone 43N acreage to eliminate boundary disputes.',
      link: '/farmer/farms',
      badge: 'CADASTRE',
      image: '/assets/reference-c-farmland.jpg'
    },
    {
      id: '03',
      title: 'Sentinel-2 NDVI Monitoring',
      description: 'A clearer picture of the phenological cycle: tracking Near-Infrared and Red surface reflectance to identify localized moisture stress and canopy vigour every 5 days.',
      link: '/farmer/satellite',
      badge: 'ORBITAL',
      image: '/assets/reference-b-satellite.jpg'
    },
    {
      id: '04',
      title: 'Crop Yield Loss Modeling',
      description: 'Empirical machine learning yield loss estimation combining peak NDVI, phenological AUC, cumulative rainfall deficits, and historical district production records.',
      link: '/insure/verification',
      badge: 'INSURE',
      image: '/assets/reference-a-earth.jpg'
    },
    {
      id: '05',
      title: 'PMFBY 21-Day SLA Audit',
      description: 'Automated milestone lifecycle tracking against the statutory PMFBY mandate, detecting missing surveyor documents, retroactive back-dating, and payout anomalies.',
      link: '/insure/audit',
      badge: 'AUDIT',
      image: '/assets/reference-c-farmland.jpg'
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let ctx: gsap.Context;

    const setupScrollAnimation = () => {
      ctx = gsap.context(() => {
        // Calculate dynamic travel distance: track's scrollWidth minus viewport width + margin
        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 140);
        const scrollDistance = getDistance();
        const pinDuration = Math.max(window.innerHeight * 1.5, scrollDistance * 1.2);

        // Main horizontal translation timeline pinned to viewport
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${pinDuration}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              if (progressRef.current) {
                progressRef.current.style.width = `${Math.min(100, Math.max(0, p * 100)).toFixed(1)}%`;
              }
              const step = Math.min(5, Math.max(1, Math.floor(p * 5) + 1));
              setActiveStep(step);
              if (counterRef.current) {
                counterRef.current.textContent = `0${step} / 05`;
              }
            }
          }
        });

        // Glide track horizontally
        tl.to(track, {
          x: () => -getDistance(),
          ease: 'none'
        });

        // Subtle entrance scale/opacity reveal for subsequent cards
        const cards = track.querySelectorAll<HTMLElement>('.capability-card');
        cards.forEach((card, idx) => {
          if (idx > 0) {
            tl.fromTo(
              card,
              { opacity: 0.7, scale: 0.94 },
              { opacity: 1, scale: 1, ease: 'none', duration: 0.35 },
              idx * 0.18
            );
          }
        });
      }, section);

      ScrollTrigger.refresh();
    };

    // Delay slightly for accurate DOM bounding client rects
    const timer = setTimeout(setupScrollAnimation, 120);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      if (ctx) ctx.revert();
    };
  }, []);

  // Helper buttons to scroll seamlessly through cards
  const scrollNextCard = () => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const getDistance = Math.max(0, track.scrollWidth - window.innerWidth + 140);
    const pinDuration = Math.max(window.innerHeight * 1.5, getDistance * 1.2);
    const stepSize = pinDuration / 4.5;
    window.scrollBy({ top: stepSize, behavior: 'smooth' });
  };

  const scrollPrevCard = () => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const getDistance = Math.max(0, track.scrollWidth - window.innerWidth + 140);
    const pinDuration = Math.max(window.innerHeight * 1.5, getDistance * 1.2);
    const stepSize = pinDuration / 4.5;
    window.scrollBy({ top: -stepSize, behavior: 'smooth' });
  };

  return (
    <section 
      ref={sectionRef} 
      id="how-we-help-section" 
      className="relative w-full bg-[#FBF9F5] text-[#1B1D1C] border-t border-[#EAE3D9]"
    >
      {/* Pinned Viewport Container */}
      <div className="w-full h-screen min-h-[640px] max-h-[1080px] flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-10 overflow-hidden relative">
        
        {/* Top Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8B5F4D] block mb-1">
                Institutional Capabilities
              </span>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#1B1D1C] tracking-tight">
                How We Help.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#68625B] font-sans max-w-md leading-relaxed">
              A comprehensive suite of capabilities designed to bring radical clarity to agricultural cultivation, risk assessment, and claims settlement.
            </p>
          </div>
        </div>

        {/* Horizontal Track Viewport */}
        <div className="relative w-full overflow-hidden flex-1 flex items-center my-auto py-2">
          <div 
            ref={trackRef} 
            className="flex gap-6 sm:gap-8 px-6 sm:px-12 md:px-20 will-change-transform items-stretch"
          >
            {services.map((item, idx) => (
              <div 
                key={item.id}
                className="capability-card shrink-0 w-[340px] sm:w-[410px] lg:w-[460px] min-w-[340px] sm:min-w-[410px] lg:min-w-[460px] select-none"
              >
                <div className={`group rounded-3xl bg-[#E8ECEF] border border-[#D5DCE2] p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_50px_rgba(27,29,28,0.08)] hover:-translate-y-1.5 h-full min-h-[460px] sm:min-h-[480px] ${activeStep === idx + 1 ? 'ring-2 ring-[#8B5F4D]/20 shadow-md' : ''}`}>
                  <div>
                    {/* Title and Dark Pill Explore Button */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#1B1D1C] leading-snug">
                        {item.title}
                      </h3>
                      <Link
                        to={item.link}
                        className="px-4 py-1.5 rounded-full bg-[#1B1D1C] text-[#FBF9F5] text-xs font-sans font-medium hover:bg-[#8B5F4D] transition-colors shrink-0 shadow-sm"
                      >
                        Explore
                      </Link>
                    </div>

                    <p className="text-xs sm:text-sm font-sans text-[#4A5568] leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom In-Card Image with Rounded Corners */}
                  <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden border border-white/50 shadow-inner mt-auto bg-slate-200">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      loading="eager"
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider font-medium">
                      {item.badge}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Progress Bar & Stage Controls */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full shrink-0 flex items-center justify-between gap-4 sm:gap-6 text-xs font-sans text-[#68625B]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#5B7553] animate-pulse"></span>
            <span className="font-mono text-[11px] tracking-wider text-[#1B1D1C] uppercase hidden sm:inline">
              Scroll down to traverse cards
            </span>
          </div>

          {/* Synchronized Progress Track */}
          <div className="flex-1 max-w-md h-1.5 bg-[#EAE3D9] rounded-full overflow-hidden">
            <div 
              ref={progressRef}
              className="h-full bg-[#8B5F4D] rounded-full origin-left transition-all duration-75"
              style={{ width: '0%' }}
            />
          </div>

          {/* Interactive Step Navigator Buttons + Step Counter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={scrollPrevCard}
                aria-label="Previous capability card"
                className="w-7 h-7 rounded-full border border-[#CAB4AA] flex items-center justify-center text-[#1B1D1C] hover:bg-[#8B5F4D] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={scrollNextCard}
                aria-label="Next capability card"
                className="w-7 h-7 rounded-full border border-[#CAB4AA] flex items-center justify-center text-[#1B1D1C] hover:bg-[#8B5F4D] hover:text-white transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-[#8B5F4D] tracking-wider">
              <span ref={counterRef}>01 / 05</span>
              <span className="hidden md:inline text-[#CAB4AA]">·</span>
              <span className="hidden md:inline text-[#68625B]">Capabilities</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};