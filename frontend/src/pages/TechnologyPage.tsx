import React from 'react';
import { DharaNav } from '../components/common/DharaNav';
import { FinalCtaFooter } from '../components/cinematic/FinalCtaFooter';
import { 
  Cpu, 
  Satellite, 
  Layers, 
  Database, 
  Terminal, 
  Binary, 
  CheckCircle2, 
  Code2, 
  ExternalLink 
} from 'lucide-react';

export const TechnologyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#CAB4AA]/30 selection:text-[#1B1D1C]">
      <DharaNav />

      {/* Header in Serein Luxury Style */}
      <section className="relative pt-44 sm:pt-48 pb-20 px-6 sm:px-8 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#F5EFE6] rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium tracking-[0.2em] uppercase mb-6 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#8B5F4D]" />
            <span>Architecture & Scientific Foundations</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-[1.06] mb-8">
            Where remote sensing <br />
            <span className="italic text-[#8B5F4D]">
              meets geospatial intelligence.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#68625B] font-sans font-normal leading-relaxed max-w-2xl mx-auto">
            A comprehensive overview of the mathematical, spectral, and machine learning pipelines powering DHARA.
          </p>
        </div>
      </section>

      {/* Technical Deep Dives */}
      <section className="py-16 px-6 sm:px-8 max-w-7xl mx-auto space-y-16">
        
        {/* SPEC 1: SENTINEL-2 & NDVI */}
        <div className="rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] p-8 sm:p-12 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
          <div className="flex items-center gap-3 text-xs font-mono text-[#8B5F4D] uppercase tracking-wider mb-4">
            <Satellite className="w-4 h-4" />
            <span>SPECTRAL PHYSICS · ESA SENTINEL-2 L2A</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#1B1D1C] mb-6">
            10-Meter Multi-Spectral Canopy Reflectance
          </h2>
          <p className="text-sm sm:text-base text-[#68625B] leading-relaxed mb-6 font-sans">
            DHARA computes Bottom-Of-Atmosphere (BOA) surface reflectance calibrated via the Sen2Cor atmospheric correction processor. 
            By capturing Band 4 (Red: 665 nm) and Band 8 (Near-Infrared: 842 nm), our service evaluates the Normalized Difference Vegetation Index (NDVI):
          </p>
          
          <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] font-mono text-xs sm:text-sm text-[#1B1D1C] mb-8 overflow-x-auto">
            NDVI = (Band 8 [NIR] - Band 4 [Red]) / (Band 8 [NIR] + Band 4 [Red])
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EAE3D9]">
              <span className="text-[#68625B] block mb-1">Spatial Resolution</span>
              <span className="text-base text-[#1B1D1C] font-semibold">10m Ground Pixel</span>
            </div>
            <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EAE3D9]">
              <span className="text-[#68625B] block mb-1">Temporal Constellation</span>
              <span className="text-base text-[#1B1D1C] font-semibold">5-Day Revisit Cycle</span>
            </div>
            <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#EAE3D9]">
              <span className="text-[#68625B] block mb-1">Cloud / Shadow Mask</span>
              <span className="text-base text-[#1B1D1C] font-semibold">SCL Band QA (Zero Noise)</span>
            </div>
          </div>
        </div>

        {/* SPEC 2: POSTGIS EQUAL-AREA GEODESICS */}
        <div className="rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] p-8 sm:p-12 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
          <div className="flex items-center gap-3 text-xs font-mono text-[#8B5F4D] uppercase tracking-wider mb-4">
            <Layers className="w-4 h-4" />
            <span>CADASTRAL COMPUTATIONAL GEOMETRY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#1B1D1C] mb-6">
            Ellipsoidal Geodesics in UTM Zone 43N
          </h2>
          <p className="text-sm sm:text-base text-[#68625B] leading-relaxed mb-6 font-sans">
            Spherical area approximations on Web Mercator (EPSG:3857) exaggerate acreage in tropical and sub-tropical latitudes by up to 25%. 
            DHARA projects all cadastral geometries into equal-area EPSG:32643 (UTM Zone 43N) using PostGIS `ST_Transform` and `ST_Area`.
          </p>

          <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] font-mono text-xs sm:text-sm text-[#1B1D1C] mb-8 overflow-x-auto">
            SELECT ST_Area(ST_Transform(geom, 32643)) / 10000.0 AS area_hectares FROM farm_parcels WHERE khasra_id = $1;
          </div>
        </div>

        {/* SPEC 3: FASTAPI & POSTGRESQL ARCHITECTURE */}
        <div className="rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] p-8 sm:p-12 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
          <div className="flex items-center gap-3 text-xs font-mono text-[#8B5F4D] uppercase tracking-wider mb-4">
            <Database className="w-4 h-4" />
            <span>ENTERPRISE PERSISTENCE & SECURITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#1B1D1C] mb-6">
            PostgreSQL 15 Relational Schema & SLA Engine
          </h2>
          <p className="text-sm sm:text-base text-[#68625B] leading-relaxed mb-6 font-sans">
            13 normalized relational tables manage farmers, survey polygons, insurance policies, claim dossiers, 
            and immutable auditor logs with row-level timestamps to support legal dispute resolution.
          </p>
        </div>

      </section>

      <FinalCtaFooter />
    </div>
  );
};
