import React, { useState } from 'react';
import { DharaNav } from '../../components/common/DharaNav';
import { 
  Satellite, 
  Layers, 
  Calendar, 
  Sliders, 
  Info, 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  Maximize2 
} from 'lucide-react';
import { NdviChart } from '../../components/charts/NdviChart';

export const SatelliteMonitoringPage: React.FC = () => {
  const [selectedDateIdx, setSelectedDateIdx] = useState(3);
  const [showNdviOverlay, setShowNdviOverlay] = useState(true);

  const passes = [
    { date: '2026-10-15', ndvi: 0.28, stage: 'Emergence', status: 'Optimal Germination', moistureDeficit: 'Low' },
    { date: '2026-10-30', ndvi: 0.42, stage: 'Tillering', status: 'Healthy Canopy Extension', moistureDeficit: 'Low' },
    { date: '2026-11-05', ndvi: 0.58, stage: 'Stem Elongation', status: 'Rapid Nitrogen Absorption', moistureDeficit: 'Normal' },
    { date: '2026-11-12', ndvi: 0.68, stage: 'Booting / Flag Leaf', status: 'Vigorous Vegetative Peak', moistureDeficit: 'Moderate' },
    { date: '2026-11-18', ndvi: 0.64, stage: 'Early Heading', status: 'Localized Dry Spell Warning', moistureDeficit: 'High (-22mm)' },
  ];

  const currentPass = passes[selectedDateIdx];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <DharaNav />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-44 sm:pt-48 pb-20 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium uppercase tracking-wider">
            <Satellite className="w-3.5 h-3.5 text-[#8B5F4D]" />
            <span>Copernicus Sentinel-2 L2A (10M Multispectral)</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight">
            Satellite NDVI Monitoring
          </h1>
          <p className="text-[#68625B] text-base font-sans font-normal leading-relaxed">
            Track multi-temporal surface reflectance and vegetative vigour across every square meter of your farmland. 
            Identify moisture stress before canopy collapse occurs.
          </p>
        </div>

        {/* Date Timeline Stepper Slider */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans">
            <span className="text-[#8B5F4D] font-semibold uppercase tracking-wider">
              SELECT SATELLITE PASS DATE:
            </span>
            <span className="text-[#68625B]">
              Selected Observation: <strong className="text-[#1B1D1C]">{currentPass.date}</strong> ({currentPass.stage})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {passes.map((p, idx) => (
              <button
                key={p.date}
                onClick={() => setSelectedDateIdx(idx)}
                className={`p-4 rounded-2xl text-center border font-sans text-xs transition-all ${
                  selectedDateIdx === idx
                    ? 'bg-[#1B1D1C] text-[#FBF9F5] border-[#1B1D1C] shadow-md'
                    : 'bg-[#FBF9F5] border-[#EAE3D9] text-[#68625B] hover:text-[#1B1D1C] hover:bg-[#EAE3D9]'
                }`}
              >
                <div className="font-semibold">{p.date}</div>
                <div className={`text-xs mt-1 ${selectedDateIdx === idx ? 'text-[#CAB4AA]' : 'text-[#8B5F4D]'}`}>
                  NDVI {p.ndvi}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Satellite Map & Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Satellite Map Display (Reference D) */}
          <div className="lg:col-span-8 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] relative overflow-hidden shadow-[0_4px_24px_rgba(27,29,28,0.03)] space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4">
              <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#8B5F4D] uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Sentinel-2 False-Color Spectral Map</span>
              </div>
              <span className="text-xs font-mono text-[#5B7553] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                10-METER RESOLUTION
              </span>
            </div>

            {/* Satellite Map Viewport */}
            <div className="relative rounded-2xl overflow-hidden border border-[#EAE3D9] shadow-inner h-[400px] group bg-[#141716]">
              <img 
                src="/assets/reference-d-ndvi.jpg" 
                alt="Sentinel-2 Multispectral Surface Reflectance"
                className={`w-full h-full object-cover filter contrast-105 transition-opacity duration-500 ${
                  showNdviOverlay ? 'opacity-95' : 'opacity-40'
                }`}
              />

              {/* Cadastral Polygon Layer */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-48 border-2 border-dashed border-[#C5E86C] bg-[#C5E86C]/15 rounded-xl shadow-[0_0_25px_rgba(197,232,108,0.4)] flex flex-col items-center justify-between p-3">
                  <span className="bg-black/80 text-[#C5E86C] text-[10px] font-mono px-2 py-0.5 rounded border border-[#C5E86C]/40">
                    KHASRA 48/2 • 2.50 HA
                  </span>
                  <div className="bg-black/90 px-3 py-1 rounded-full text-white text-xs font-mono border border-white/20">
                    Mean NDVI: {currentPass.ndvi} ({currentPass.status})
                  </div>
                </div>
              </div>

              {/* Viewport Control Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white">
                <button
                  onClick={() => setShowNdviOverlay(!showNdviOverlay)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  {showNdviOverlay ? 'Hide NDVI Overlay' : 'Show NDVI Overlay'}
                </button>
                <span>Bands: B04 (Red) · B08 (NIR) · SCL Mask Applied</span>
              </div>
            </div>

            {/* Vegetation Index Legend */}
            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-[#68625B]">
              <span className="font-semibold text-[#1B1D1C]">Vegetation Scale:</span>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#1b5e20]"></span> &gt;0.6 Dense Canopy</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#4caf50]"></span> 0.4 - 0.6 Moderate</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ff9800]"></span> 0.2 - 0.4 Emerging</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#f44336]"></span> &lt;0.2 Water / Soil / Stress</span>
              </div>
            </div>

          </div>

          {/* Right: Timeseries Trend Chart */}
          <div className="lg:col-span-4 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-6 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
            <h3 className="text-2xl font-serif font-normal text-[#1B1D1C]">
              Temporal NDVI Trend
            </h3>
            <p className="text-xs sm:text-sm text-[#68625B] leading-relaxed">
              Comparison between current Kharif 2026 phenology curve against historical district normal.
            </p>

            <div className="rounded-2xl bg-[#FBF9F5] p-4 border border-[#EAE3D9]">
              <NdviChart farmId="FARM001" />
            </div>

            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] space-y-2 text-xs">
              <div className="font-semibold text-[#1B1D1C]">Agronomic Assessment:</div>
              <p className="text-[#68625B] leading-relaxed">
                Vegetation curve indicates peak physiological vigor at Day 65. Mild localized moisture deficit detected in south-east corner (0.28 Ha).
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Clean Workspace Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#68625B]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-[#1B1D1C]">DHARA FARMER</span>
          <span>·</span>
          <span>Satellite Remote Sensing Module</span>
        </div>
        <div className="text-xs font-mono text-[#8B5F4D]">
          <span>© 2026 DHARA</span>
        </div>
      </footer>
    </div>
  );
};
export default SatelliteMonitoringPage;
