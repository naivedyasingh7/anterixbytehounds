import React from 'react';
import { 
  Cpu, 
  Satellite, 
  Database, 
  Code2, 
  Globe, 
  Binary, 
  Layers, 
  Terminal, 
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TechnologySection: React.FC = () => {
  const technologies = [
    {
      category: 'Artificial Intelligence & Vision',
      items: [
        { name: 'Computer Vision', desc: 'ResNet / MobileNet convolutional neural models for multi-class foliar disease classification.', icon: Cpu },
        { name: 'Machine Learning Yield Regressors', desc: 'Gradient boosted trees (XGBoost & Random Forest) trained on district agro-climatic indices.', icon: Binary },
      ]
    },
    {
      category: 'Earth Observation & Remote Sensing',
      items: [
        { name: 'Sentinel-2 L2A (ESA Copernicus)', desc: 'Multi-spectral instrument (MSI) capturing 13 spectral bands at 10m to 60m ground sampling distance.', icon: Satellite },
        { name: 'NDVI & Google Earth Engine', desc: 'Normalized Difference Vegetation Index pipeline with automated cloud and shadow masking.', icon: Globe },
      ]
    },
    {
      category: 'Geospatial Analytics & Backend',
      items: [
        { name: 'Geospatial Analytics (PostGIS / Shapely)', desc: 'Equal-area UTM Zone 43N ellipsoidal geodesics for cadastral plot area and overlap verification.', icon: Layers },
        { name: 'Python & FastAPI Microservice', desc: 'High-throughput asynchronous REST microservices with OAuth2 JWT security and Pydantic v2.', icon: Terminal },
      ]
    },
    {
      category: 'Enterprise Persistence',
      items: [
        { name: 'PostgreSQL 15 + PostGIS', desc: '13 normalized relational tables storing spatial parcel polygons, policies, and immutable audit logs.', icon: Database },
        { name: 'ReportLab PDF Dossier Engine', desc: 'Server-side legal dossier compilation with cryptographic hashes and surveyor signature fields.', icon: Code2 },
      ]
    }
  ];

  return (
    <section className="relative w-full py-24 bg-[#F5EFE6] text-[#1B1D1C] border-t border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBF9F5] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium uppercase tracking-[0.18em] mb-4 shadow-sm">
            <span>Rigorous Engineering Foundation</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight mb-4">
            The Technology Stack.
          </h2>

          <p className="text-base text-[#68625B] font-sans font-normal leading-relaxed">
            Every architectural decision is built on open standards, empirical satellite science, and verifiable mathematical algorithms.
          </p>
        </div>

        {/* Tech Stack Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {technologies.map((cat, idx) => (
            <div 
              key={idx}
              className="p-8 sm:p-10 rounded-3xl bg-[#FBF9F5] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all shadow-[0_4px_24px_rgba(27,29,28,0.03)]"
            >
              <h3 className="text-xl font-serif font-normal text-[#8B5F4D] mb-6 pb-3 border-b border-[#EAE3D9]">
                {cat.category}
              </h3>

              <div className="space-y-6">
                {cat.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] border border-[#EAE3D9] flex items-center justify-center text-[#1B1D1C] shrink-0">
                        <Icon className="w-4 h-4 text-[#8B5F4D]" />
                      </div>
                      <div>
                        <div className="text-base font-serif font-normal text-[#1B1D1C] mb-1">
                          {item.name}
                        </div>
                        <p className="text-xs sm:text-sm font-sans text-[#68625B] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* View Full Architecture Link */}
        <div className="text-center pt-6">
          <Link
            to="/technology"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B1D1C] text-[#FBF9F5] text-xs font-sans font-medium uppercase tracking-wider hover:bg-[#333634] transition-all shadow-sm"
          >
            <span>View Full Technical Architecture Specifications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
