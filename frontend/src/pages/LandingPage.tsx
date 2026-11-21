import React from 'react';
import { DharaNav } from '../components/common/DharaNav';
import { HeroSection } from '../components/cinematic/HeroSection';
import { FourCornersCollageSection } from '../components/cinematic/FourCornersCollageSection';
import { SpaceToEarthTransition } from '../components/cinematic/SpaceToEarthTransition';
import { HowWeHelpSection } from '../components/cinematic/HowWeHelpSection';
import { MissionPhilosophySection } from '../components/cinematic/MissionPhilosophySection';
import { BreatheEasierSection } from '../components/cinematic/BreatheEasierSection';
import { TwoEcosystemsSection } from '../components/cinematic/TwoEcosystemsSection';
import { ConnectedIntelligenceSection } from '../components/cinematic/ConnectedIntelligenceSection';
import { TechnologySection } from '../components/cinematic/TechnologySection';
import { FinalCtaFooter } from '../components/cinematic/FinalCtaFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      {/* 1. Global Serein Floating Pill Navigation */}
      <DharaNav />

      {/* 2. Opening Hero with Continuously Playing Background Video (hero-loop.mp4) */}
      <HeroSection />

      {/* 3. Serein 4-Corner Image Collage (Reference A, B, C, D around "taking care of the details") */}
      <FourCornersCollageSection />

      {/* 4. Signature Dual In-Place DHARA Sequence (01: Satellite Orbit & Scan, 02: Farmland Cadastre & NDVI) */}
      <SpaceToEarthTransition />

      {/* 5. Serein "How We Help." Carousel with Powder-Blue Cards & In-Card Images */}
      <HowWeHelpSection />

      {/* 6. Serein "Our Mission" & "Our Philosophy" with Botanical Flora Illustration */}
      <MissionPhilosophySection />

      {/* 7. Serein Ocean Reveal Video with Frosted Glass 4-Column Card ("The kind of technology that lets you breathe easier") */}
      <BreatheEasierSection />

      {/* 8. One Platform. Two Ecosystems (DHARA Farmer & DHARA Insure) */}
      <TwoEcosystemsSection />

      {/* 9. Connected Intelligence Flow (Leaf to Orbit to Settlement) */}
      <ConnectedIntelligenceSection />

      {/* 10. Technology Stack Specifications */}
      <TechnologySection />

      {/* 11. Serein Terracotta Contact Form & Giant Brand Footer */}
      <FinalCtaFooter />
    </div>
  );
};

export default LandingPage;
