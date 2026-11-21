import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export const FinalCtaFooter: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <footer className="relative w-full bg-[#8B5F4D] text-[#FBF9F5] overflow-hidden">
      
      {/* Serein Exact Terracotta Contact & Brand Section (Matching Image 1) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: INQUIRY FORM */}
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-6xl font-serif font-normal text-[#FBF9F5] tracking-tight leading-[1.08]">
              Let's talk about what DHARA <br />
              <span className="italic font-normal">could look like for your fields.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#FBF9F5]/85 font-sans font-light leading-relaxed max-w-lg">
              A first conversation is unhurried, objective, and free of any obligation. 
              The same way we'd want to be treated.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#C5E86C]" />
                <span className="text-sm font-sans font-medium text-white">
                  Thank you! An agricultural verification specialist will reach out shortly.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 rounded-full bg-[#EAE0DA] text-[#1B1D1C] placeholder-[#8B7C75] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-white/80 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-full bg-[#EAE0DA] text-[#1B1D1C] placeholder-[#8B7C75] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-white/80 transition-all shadow-inner"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full bg-[#FBF9F5] text-[#1B1D1C] hover:bg-white font-sans font-medium text-sm transition-all shadow-md hover:scale-102"
                  >
                    Let's Get Started
                  </button>
                </div>
              </form>
            )}

            {/* Regulatory Disclaimer (Matching Image 1) */}
            <div className="pt-8 text-[11px] font-sans text-[#FBF9F5]/70 space-y-2 leading-relaxed border-t border-white/15">
              <p className="font-semibold text-white/90">PMFBY & Cadastral Compliance Verification</p>
              <p>
                Advisory and verification services powered through DHARA Agricultural Intelligence Platform. 
                Satellite observations calibrated to European Space Agency Copernicus Sentinel-2 L2A BOA reflectance standards.
              </p>
              <p>
                All cadastral geometry projections calculated in ellipsoidal UTM Zone 43N (EPSG:32643) against state land revenue records.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: BRAND IDENTITY & NAVIGATION */}
          <div className="flex flex-col justify-between space-y-12">
            
            <div className="grid grid-cols-2 gap-8 text-xs font-sans">
              <div>
                <h4 className="font-serif text-lg font-normal text-white mb-4">About</h4>
                <ul className="space-y-2.5 text-[#FBF9F5]/80">
                  <li><Link to="/vision" className="hover:text-white transition-colors">Philosophy</Link></li>
                  <li><Link to="/vision" className="hover:text-white transition-colors">Who We Serve</Link></li>
                  <li><Link to="/technology" className="hover:text-white transition-colors">Our Methodology</Link></li>
                  <li><Link to="/farmer" className="hover:text-white transition-colors">Connect With Us</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif text-lg font-normal text-white mb-4">Services</h4>
                <ul className="space-y-2.5 text-[#FBF9F5]/80">
                  <li><Link to="/farmer/disease" className="hover:text-white transition-colors">AI Disease Diagnostics</Link></li>
                  <li><Link to="/farmer/farms" className="hover:text-white transition-colors">Cadastral Boundary Mapping</Link></li>
                  <li><Link to="/farmer/satellite" className="hover:text-white transition-colors">Sentinel-2 NDVI Monitoring</Link></li>
                  <li><Link to="/insure/verification" className="hover:text-white transition-colors">Crop Yield Verification</Link></li>
                  <li><Link to="/insure/audit" className="hover:text-white transition-colors">PMFBY 21-Day SLA Audit</Link></li>
                </ul>
              </div>
            </div>

            {/* Giant Serein-Style Serif Brand Signature (Matching Image 1) */}
            <div className="space-y-4 pt-12 border-t border-white/15">
              <div className="text-6xl sm:text-7xl md:text-8xl font-serif tracking-widest text-[#FBF9F5] font-light">
                DHARA
              </div>
              <p className="text-sm font-sans text-[#FBF9F5]/85 leading-relaxed max-w-md font-light">
                Sanskrit for the Earth. It's the feeling you want every cultivator and underwriter to experience: 
                clarity, calm, and the comfort of knowing your land is being cared for with intention.
              </p>
            </div>

          </div>

        </div>

      </div>

    </footer>
  );
};
