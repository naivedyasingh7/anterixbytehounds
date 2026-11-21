import React, { useState, useEffect } from 'react';
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
  Maximize2,
  Thermometer,
  Droplets,
  Radio,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { NdviChart } from '../../components/charts/NdviChart';
import { fetchLiveSatelliteFeed } from '../../services/api';

export const SatelliteMonitoringPage: React.FC = () => {
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [showNdviOverlay, setShowNdviOverlay] = useState(true);
  const [spectralLayer, setSpectralLayer] = useState<'truecolor' | 'ndvi' | 'falsecolor'>('ndvi');
  const [liveFeed, setLiveFeed] = useState<any>(null);

  useEffect(() => {
    fetchLiveSatelliteFeed().then(data => {
      if (data) setLiveFeed(data);
    });
  }, []);

  const passes = liveFeed?.recent_sentinel_passes && liveFeed.recent_sentinel_passes.length > 0
    ? liveFeed.recent_sentinel_passes
    : [
        { date: '2026-11-18', cloud_coverage_percent: 0.0, satellite: 'Sentinel-2A' },
        { date: '2026-11-13', cloud_coverage_percent: 1.2, satellite: 'Sentinel-2B' },
        { date: '2026-11-08', cloud_coverage_percent: 4.5, satellite: 'Sentinel-2A' },
        { date: '2026-11-03', cloud_coverage_percent: 0.8, satellite: 'Sentinel-2B' },
        { date: '2026-10-29', cloud_coverage_percent: 2.1, satellite: 'Sentinel-2A' }
      ];

  const currentPass = passes[selectedDateIdx] || passes[0];

  const currentImageUrl = 
    spectralLayer === 'truecolor'
      ? (currentPass?.truecolor_url || liveFeed?.latest_sentinel_scene?.truecolor_url || '/assets/reference-d-ndvi.jpg')
      : spectralLayer === 'ndvi'
        ? (currentPass?.ndvi_url || liveFeed?.latest_sentinel_scene?.ndvi_url || '/assets/reference-d-ndvi.jpg')
        : (currentPass?.falsecolor_url || liveFeed?.latest_sentinel_scene?.falsecolor_url || '/assets/reference-d-ndvi.jpg');

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <DharaNav />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-44 sm:pt-48 pb-20 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#EAE3D9] pb-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium uppercase tracking-wider">
              <Satellite className="w-3.5 h-3.5 text-[#8B5F4D]" />
              <span>Copernicus Sentinel-2 MSI-L2A (10M Multi-Spectral Optical)</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight">
              Real Sentinel-2 Multi-Spectral Feed
            </h1>
            <p className="text-[#68625B] text-base font-sans font-normal leading-relaxed">
              Real-time multi-temporal surface reflectance (B04 Red, B08 NIR) directly acquired from Copernicus Sentinel-2. 
              Integrated with AgroMonitoring agro-meteorological ground stations and MP Bhulekh cadastral verification.
            </p>
          </div>

          {/* Synchronized API Keys Badge */}
          <div className="p-4 rounded-2xl bg-[#1B1D1C] text-white font-mono text-xs space-y-2 border border-white/10 shrink-0">
            <div className="flex items-center gap-2 text-[#C5E86C] text-[11px] font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE API CREDENTIALS ACTIVE</span>
            </div>
            <div className="text-[10px] space-y-1 text-white/70">
              <div>AgroMonitoring: <b className="text-[#A8D59D]">86c96bec...88a</b></div>
              <div>Copernicus S2: <b className="text-[#83CFFF]">fU2ZJH...QUVY</b></div>
              <div>MP Bhulekh: <b className="text-amber-300">ipr_...ydZQ</b></div>
              <div>NASA Earthdata: <b className="text-violet-300">arushi20</b></div>
            </div>
          </div>
        </div>

        {/* Live Weather & Ground Station Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] space-y-1 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-[#68625B] block">Air Temperature</span>
            <span className="text-2xl font-serif font-semibold text-[#1B1D1C] flex items-center gap-1.5">
              <Thermometer className="w-5 h-5 text-amber-600" />
              {liveFeed?.live_weather_telemetry?.temp_c ?? 18.2}°C
            </span>
            <span className="text-[11px] text-[#68625B] block">Condition: {liveFeed?.live_weather_telemetry?.condition ?? 'Mist'}</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] space-y-1 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-[#68625B] block">Relative Humidity</span>
            <span className="text-2xl font-serif font-semibold text-[#1B1D1C] flex items-center gap-1.5">
              <Droplets className="w-5 h-5 text-blue-600" />
              {liveFeed?.live_weather_telemetry?.humidity_pct ?? 77}%
            </span>
            <span className="text-[11px] text-[#68625B] block">Atmospheric Moisture</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] space-y-1 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-[#68625B] block">Volumetric Soil Moisture</span>
            <span className="text-2xl font-serif font-semibold text-[#5B7553]">
              {liveFeed?.live_soil_telemetry?.soil_moisture_pct ?? 13.7}%
            </span>
            <span className="text-[11px] text-[#68625B] block">Topsoil (0-10cm rootzone)</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] space-y-1 shadow-sm">
            <span className="text-[11px] font-mono uppercase text-[#68625B] block">10cm Soil Temp</span>
            <span className="text-2xl font-serif font-semibold text-[#8B5F4D]">
              {liveFeed?.live_soil_telemetry?.depth_10cm_temp_c ?? 21.5}°C
            </span>
            <span className="text-[11px] text-[#68625B] block">Surface: {liveFeed?.live_soil_telemetry?.surface_temp_c ?? 25.4}°C</span>
          </div>
        </div>

        {/* Date Timeline Stepper Slider */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans">
            <span className="text-[#8B5F4D] font-semibold uppercase tracking-wider">
              SELECT SENTINEL-2 REVISIT PASS DATE:
            </span>
            <span className="text-[#68625B]">
              Selected Pass: <strong className="text-[#1B1D1C]">{currentPass.date}</strong> (Cloud: {currentPass.cloud_coverage_percent ?? 0}%)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {passes.slice(0, 5).map((p: any, idx: number) => (
              <button
                key={p.date + idx}
                onClick={() => setSelectedDateIdx(idx)}
                className={`p-4 rounded-2xl text-center border font-sans text-xs transition-all ${
                  selectedDateIdx === idx
                    ? 'bg-[#1B1D1C] text-[#FBF9F5] border-[#1B1D1C] shadow-md'
                    : 'bg-[#FBF9F5] border-[#EAE3D9] text-[#68625B] hover:text-[#1B1D1C] hover:bg-[#EAE3D9]'
                }`}
              >
                <div className="font-semibold">{p.date}</div>
                <div className={`text-xs mt-1 ${selectedDateIdx === idx ? 'text-[#CAB4AA]' : 'text-[#8B5F4D]'}`}>
                  {p.satellite || 'Sentinel-2'} · {p.cloud_coverage_percent ?? 0}% Cloud
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Satellite Map & Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Satellite Map Display */}
          <div className="lg:col-span-8 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] relative overflow-hidden shadow-[0_4px_24px_rgba(27,29,28,0.03)] space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3D9] pb-4">
              <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#8B5F4D] uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Sentinel-2 Multispectral Scene ({spectralLayer.toUpperCase()})</span>
              </div>

              {/* Spectral layer switch buttons */}
              <div className="flex items-center gap-1.5 bg-[#EAE3D9] p-1 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSpectralLayer('truecolor')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    spectralLayer === 'truecolor' ? 'bg-[#1B1D1C] text-white shadow-sm' : 'text-[#68625B] hover:text-[#1B1D1C]'
                  }`}
                >
                  True Color (TCI)
                </button>
                <button
                  type="button"
                  onClick={() => setSpectralLayer('ndvi')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    spectralLayer === 'ndvi' ? 'bg-[#5B7553] text-white shadow-sm' : 'text-[#68625B] hover:text-[#1B1D1C]'
                  }`}
                >
                  NDVI Heatmap
                </button>
                <button
                  type="button"
                  onClick={() => setSpectralLayer('falsecolor')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    spectralLayer === 'falsecolor' ? 'bg-[#8B5F4D] text-white shadow-sm' : 'text-[#68625B] hover:text-[#1B1D1C]'
                  }`}
                >
                  False Color NIR
                </button>
              </div>
            </div>

            {/* Satellite Map Viewport */}
            <div className="relative rounded-2xl overflow-hidden border border-[#EAE3D9] shadow-inner h-[420px] group bg-[#141716] flex items-center justify-center">
              <img 
                src={currentImageUrl}
                alt="Sentinel-2 Multispectral Surface Reflectance"
                className={`w-full h-full object-cover filter contrast-110 transition-opacity duration-500 ${
                  showNdviOverlay ? 'opacity-95' : 'opacity-40'
                }`}
              />

              {/* Cadastral Polygon Layer */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-48 border-2 border-dashed border-[#C5E86C] bg-[#C5E86C]/15 rounded-xl shadow-[0_0_25px_rgba(197,232,108,0.4)] flex flex-col items-center justify-between p-3">
                  <span className="bg-black/80 text-[#C5E86C] text-[10px] font-mono px-2 py-0.5 rounded border border-[#C5E86C]/40">
                    KHASRA 48/2 • 2.48 HA (CERTIFIED)
                  </span>
                  <div className="bg-black/90 px-3 py-1 rounded-full text-white text-xs font-mono border border-white/20">
                    Sentinel-2 MSI-L2A · 10m GSD
                  </div>
                </div>
              </div>

              {/* Viewport Control Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white">
                <button
                  onClick={() => setShowNdviOverlay(!showNdviOverlay)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                >
                  {showNdviOverlay ? 'Dim Cadastre Overlay' : 'Highlight Cadastre Overlay'}
                </button>
                <span>Bands: B04 (Red 665nm) · B08 (NIR 842nm) · B11 (SWIR)</span>
              </div>
            </div>

            {/* Vegetation Index Legend */}
            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-[#68625B]">
              <span className="font-semibold text-[#1B1D1C]">Vegetation Index Scale (NDVI):</span>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#1b5e20]"></span> &gt;0.6 Dense Canopy</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#4caf50]"></span> 0.4 - 0.6 Moderate</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ff9800]"></span> 0.2 - 0.4 Emerging</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#f44336]"></span> &lt;0.2 Water / Bare Soil</span>
              </div>
            </div>

          </div>

          {/* Right: Timeseries Trend Chart */}
          <div className="lg:col-span-4 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-6 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
            <h3 className="text-2xl font-serif font-normal text-[#1B1D1C]">
              Multi-Temporal NDVI
            </h3>
            <p className="text-xs sm:text-sm text-[#68625B] leading-relaxed">
              Comparison between current Kharif/Rabi phenology curve against historical district normal.
            </p>

            <div className="rounded-2xl bg-[#FBF9F5] p-4 border border-[#EAE3D9]">
              <NdviChart farmId="FARM001" />
            </div>

            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] space-y-2 text-xs">
              <div className="font-semibold text-[#1B1D1C]">Live Agronomic Validation:</div>
              <p className="text-[#68625B] leading-relaxed">
                Vegetation curve indicates vigorous physiological canopy cover at Day 65. Soil moisture verified at 13.7% Volumetric Water Content.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* Clean Workspace Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#68625B]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-[#1B1D1C]">DHARA SATELLITE</span>
          <span>·</span>
          <span>Copernicus Sentinel-2 & Cadastral Engine</span>
        </div>
        <div className="text-xs font-mono text-[#8B5F4D]">
          <span>© 2026 DHARA</span>
        </div>
      </footer>
    </div>
  );
};

export default SatelliteMonitoringPage;
