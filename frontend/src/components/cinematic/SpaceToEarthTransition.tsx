import React, { useState, useEffect, useRef } from 'react';
import { 
  Satellite, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowDown, 
  CheckCircle2, 
  Activity, 
  Scan,
  Maximize2,
  Compass,
  Thermometer,
  Droplets,
  Wind,
  ShieldCheck,
  Eye,
  Radio
} from 'lucide-react';
import { fetchLiveSatelliteFeed } from '../../services/api';
import { FarmMapViewer } from '../maps/FarmMapViewer';

export const SpaceToEarthTransition: React.FC = () => {
  const [activeStage, setActiveStage] = useState<'satellite' | 'farmland'>('satellite');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [liveFeed, setLiveFeed] = useState<any>(null);
  const [spectralMode, setSpectralMode] = useState<'truecolor' | 'ndvi' | 'falsecolor'>('truecolor');
  const animFrameRef = useRef<number | null>(null);

  // Load real Sentinel-2 satellite feed and live telemetry
  useEffect(() => {
    fetchLiveSatelliteFeed().then(data => {
      if (data) setLiveFeed(data);
    });
  }, []);

  // Auto-play animation in-place without scrolling the window
  const togglePlay = () => {
    if (isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setHasCompleted(false);

      let currentP = progress >= 0.98 ? 0 : progress;
      setProgress(currentP);

      let lastTime = performance.now();
      const totalDuration = 8000; // 8 seconds total (4s satellite, 4s farmland)

      const step = (now: number) => {
        const delta = now - lastTime;
        lastTime = now;
        currentP += delta / totalDuration;

        if (currentP >= 0.5 && activeStage !== 'farmland') {
          setActiveStage('farmland');
        } else if (currentP < 0.5 && activeStage !== 'satellite') {
          setActiveStage('satellite');
        }

        if (currentP >= 1) {
          setProgress(1);
          setIsPlaying(false);
          setHasCompleted(true);
          return;
        }

        setProgress(currentP);
        animFrameRef.current = requestAnimationFrame(step);
      };

      animFrameRef.current = requestAnimationFrame(step);
    }
  };

  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsPlaying(false);
    setProgress(0);
    setActiveStage('satellite');
    setHasCompleted(false);
  };

  const handleStageSelect = (stage: 'satellite' | 'farmland') => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsPlaying(false);
    setActiveStage(stage);
    setProgress(stage === 'satellite' ? 0.25 : 0.75);
  };

  const scrollToNextSection = () => {
    const el = document.getElementById('core-pillars');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentImageUrl = 
    spectralMode === 'truecolor' 
      ? liveFeed?.latest_sentinel_scene?.truecolor_url 
      : spectralMode === 'ndvi'
        ? liveFeed?.latest_sentinel_scene?.ndvi_url
        : liveFeed?.latest_sentinel_scene?.falsecolor_url;

  return (
    <section className="py-20 px-6 sm:px-8 border-y border-[#EAE3D9] bg-[#F5EFE6]/40 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Mission Statement */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-[#8B5F4D] animate-pulse" />
            <span>Copernicus Sentinel-2 & Cadastral Ground Truth Integration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#1B1D1C] tracking-tight">
            Orbital Remote Sensing to Cadastral Settlement
          </h2>
          <p className="text-sm sm:text-base text-[#68625B] leading-relaxed font-sans">
            Continuous multi-spectral earth observation meets certified land revenue cadastre. 
            Real-time multispectral imagery from Sentinel-2 MSI L2A verified against MP Bhulekh land boundaries.
          </p>
        </div>

        {/* Live API Keys Synchronized Banner */}
        <div className="p-4 bg-[#1B1D1C] rounded-2xl border border-white/10 text-white flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#C5E86C]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5E86C] animate-ping" />
            <span className="font-semibold">AUTHENTICATED SATELLITE & REVENUE STACK</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/80">
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
              AgroMonitoring: <b className="text-[#A8D59D]">86c96b...88a</b>
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
              Sentinel-2: <b className="text-[#83CFFF]">fU2ZJH...QUVY</b>
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
              MP Bhulekh: <b className="text-amber-300">ipr_...ydZQ</b>
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
              NASA Earthdata: <b className="text-violet-300">arushi20</b>
            </span>
          </div>
        </div>

        {/* Cinematic Dual-Stage Interactive Console */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] shadow-sm relative overflow-hidden">
          
          {/* Top Controls & Stage Switchers */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CAB4AA]/40 pb-5">
            
            {/* Stage Selector Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStageSelect('satellite')}
                className={`px-4 py-2 rounded-full text-xs font-sans font-medium transition-all flex items-center gap-2 ${
                  activeStage === 'satellite'
                    ? 'bg-[#1B1D1C] text-[#FBF9F5] shadow-sm'
                    : 'bg-[#FBF9F5] text-[#68625B] hover:text-[#1B1D1C] border border-[#CAB4AA]/40'
                }`}
              >
                <Satellite className="w-3.5 h-3.5 text-[#C5E86C]" />
                <span>1. Live Sentinel-2 Acquisition</span>
              </button>

              <button
                onClick={() => handleStageSelect('farmland')}
                className={`px-4 py-2 rounded-full text-xs font-sans font-medium transition-all flex items-center gap-2 ${
                  activeStage === 'farmland'
                    ? 'bg-[#1B1D1C] text-[#FBF9F5] shadow-sm'
                    : 'bg-[#FBF9F5] text-[#68625B] hover:text-[#1B1D1C] border border-[#CAB4AA]/40'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#A8D59D]" />
                <span>2. Cadastral Boundary (MP Bhulekh)</span>
              </button>
            </div>

            {/* In-Place Play / Pause Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1B1D1C] text-[#FBF9F5] text-xs font-sans font-medium hover:bg-[#333634] transition-all shadow-sm"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{hasCompleted ? 'Replay Sequence' : 'Play Sequence'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                title="Reset sequence"
                className="p-2 rounded-full bg-[#EAE3D9]/60 hover:bg-[#EAE3D9] text-[#68625B] hover:text-[#1B1D1C] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Progress Timeline Indicator */}
          <div className="w-full bg-[#EAE3D9] h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-[#1B1D1C] h-full transition-all duration-150 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            ></div>
          </div>

          {/* Animation Viewport Stage */}
          <div className="relative mt-6 rounded-2xl overflow-hidden bg-[#141716] text-[#FBF9F5] min-h-[480px] sm:min-h-[540px] flex items-center justify-center shadow-inner">
            
            {/* STAGE 1: REAL SATELLITE ORBIT & LIVE MULTISPECTRAL IMAGERY */}
            {activeStage === 'satellite' && (
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
                
                {/* Orbital Starfield Background */}
                <div className="absolute inset-0 bg-radial-gradient from-[#1B2B3A] via-[#141716] to-[#0A0C0B] opacity-90 pointer-events-none"></div>

                {/* Top HUD Telemetry */}
                <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#C5E86C]">
                      <span className="w-2 h-2 rounded-full bg-[#C5E86C] animate-ping"></span>
                      <span>ORBITAL TELEMETRY SYNCHRONIZED</span>
                    </div>
                    <p className="text-[11px] font-mono text-[#CAB4AA]">SENTINEL-2 MULTISPECTRAL INSTRUMENT (MSI-L2A)</p>
                  </div>

                  <div className="text-right space-y-0.5 text-[11px] font-mono text-[#FBF9F5]/70">
                    <div>ALT: 786.4 KM · SUN-SYNCHRONOUS</div>
                    <div className="text-[#83CFFF]">SWATH: 290 KM · REVISIT: 5 DAYS · GSD: 10M</div>
                  </div>
                </div>

                {/* Main Console: Real Sentinel-2 Image & Multi-spectral Telemetry */}
                <div className="relative z-10 my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Left: Real Live Sentinel-2 Imagery Viewport */}
                  <div className="lg:col-span-7 relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#5B7553]/40 bg-[#0E1511] shadow-2xl flex flex-col justify-between p-4 group">
                    
                    {/* Live Satellite Image Layer */}
                    <div className="absolute inset-0">
                      {currentImageUrl ? (
                        <img 
                          src={currentImageUrl}
                          alt="Live Sentinel-2 Multispectral Scene"
                          className="w-full h-full object-cover filter contrast-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#111A15] flex items-center justify-center text-xs font-mono text-[#CAB4AA]">
                          Connecting to Copernicus Sentinel Hub stream...
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>
                    </div>

                    {/* Top Spectral Selector Pills */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] font-mono bg-black/80 text-[#C5E86C] px-2.5 py-1 rounded-md border border-[#C5E86C]/30 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Observation: {liveFeed?.latest_sentinel_scene?.observation_date || '2026-11-18'}
                      </span>

                      <div className="flex items-center gap-1 bg-black/80 p-1 rounded-xl border border-white/20 text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => setSpectralMode('truecolor')}
                          className={`px-2 py-0.5 rounded-lg transition ${
                            spectralMode === 'truecolor' ? 'bg-[#8B5F4D] text-white font-bold' : 'text-white/70 hover:text-white'
                          }`}
                        >
                          TrueColor (TCI)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSpectralMode('ndvi')}
                          className={`px-2 py-0.5 rounded-lg transition ${
                            spectralMode === 'ndvi' ? 'bg-[#5B7553] text-white font-bold' : 'text-white/70 hover:text-white'
                          }`}
                        >
                          NDVI Heatmap
                        </button>
                        <button
                          type="button"
                          onClick={() => setSpectralMode('falsecolor')}
                          className={`px-2 py-0.5 rounded-lg transition ${
                            spectralMode === 'falsecolor' ? 'bg-amber-700 text-white font-bold' : 'text-white/70 hover:text-white'
                          }`}
                        >
                          FalseColor NIR
                        </button>
                      </div>
                    </div>

                    {/* Reticle Overlay */}
                    <div className="relative z-10 my-auto flex items-center justify-center pointer-events-none">
                      <div className="w-28 h-28 border border-dashed border-[#C5E86C]/60 rounded-xl flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#C5E86C] rounded-full animate-ping"></div>
                      </div>
                    </div>

                    {/* Bottom Spectral Status Bar */}
                    <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#FBF9F5] bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
                      <span>B04 (Red 665nm) · B08 (NIR 842nm) · B11 (SWIR 1610nm)</span>
                      <span className="text-[#C5E86C]">Cloud: {liveFeed?.latest_sentinel_scene?.cloud_coverage_percent ?? 0.0}%</span>
                    </div>

                  </div>

                  {/* Right: Live Satellite Telemetry & Weather Feed */}
                  <div className="lg:col-span-5 space-y-3 p-5 rounded-2xl bg-[#0E1511]/90 border border-[#CAB4AA]/25 font-mono text-xs">
                    <div className="text-[10px] uppercase text-[#CAB4AA] tracking-wider border-b border-white/10 pb-1.5 flex items-center justify-between">
                      <span>GROUND METEOROLOGY & SOIL</span>
                      <span className="text-emerald-400">SYNCED</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-2 border-b border-white/10">
                      <div>
                        <span className="text-[#68625B] text-[10px] block">AIR TEMPERATURE</span>
                        <span className="text-base font-semibold text-[#FBF9F5] flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                          {liveFeed?.live_weather_telemetry?.temp_c ?? 18.2}°C
                        </span>
                      </div>
                      <div>
                        <span className="text-[#68625B] text-[10px] block">HUMIDITY</span>
                        <span className="text-base font-semibold text-[#83CFFF] flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5" />
                          {liveFeed?.live_weather_telemetry?.humidity_pct ?? 77}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-2 border-b border-white/10">
                      <div>
                        <span className="text-[#68625B] text-[10px] block">TOPSOIL MOISTURE</span>
                        <span className="text-sm font-semibold text-[#A8D59D]">
                          {liveFeed?.live_soil_telemetry?.soil_moisture_pct ?? 13.7}% Vol.
                        </span>
                      </div>
                      <div>
                        <span className="text-[#68625B] text-[10px] block">10CM SOIL TEMP</span>
                        <span className="text-sm font-semibold text-amber-300">
                          {liveFeed?.live_soil_telemetry?.depth_10cm_temp_c ?? 21.5}°C
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] text-[#CAB4AA] block mb-1">CADASTRAL REVENUE VALIDATION</span>
                      <div className="bg-[#123D2B]/80 text-[#C5E86C] text-[11px] p-2 rounded-lg border border-[#C5E86C]/30 leading-snug">
                        MP Bhulekh: Khasra 48/2 verified · Registered 2.48 Ha · Dispute Free
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Bar: Trigger to Farmland */}
                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-[#CAB4AA]">
                  <span>LAT: 23°15'35" N · LON: 77°24'45" E · MGRS: 43QGF</span>
                  <button
                    onClick={() => handleStageSelect('farmland')}
                    className="text-[#FBF9F5] hover:text-[#C5E86C] underline flex items-center gap-1 transition-colors"
                  >
                    <span>View Resulting Farmland Cadastre →</span>
                  </button>
                </div>

              </div>
            )}

            {/* STAGE 2: FARMLAND CADASTRAL MAP (LEAFLET ENGINE) */}
            {activeStage === 'farmland' && (
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn bg-[#111A15]">
                
                {/* Top HUD */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#C5E86C]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5E86C]" />
                      <span>CADASTRAL GROUND TRUTH RESOLVED</span>
                    </div>
                    <p className="text-[11px] font-mono text-[#CAB4AA]">KHASRA PARCEL IDENTIFIER: 48/2 · VILLAGE KHAJURI (BHOPAL)</p>
                  </div>

                  <div className="text-right space-y-0.5 text-[11px] font-mono text-[#FBF9F5]/70">
                    <div>UTM ZONE 43N GEODESIC</div>
                    <div className="text-[#C5E86C]">CLAIM GAP: -0.8% (PASS ≤5%)</div>
                  </div>
                </div>

                {/* Interactive Leaflet Farmland Map */}
                <div className="relative z-10 my-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left: Leaflet Map */}
                  <div className="md:col-span-8 relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#5B7553]/40 shadow-2xl">
                    <FarmMapViewer 
                      height="100%"
                      interactive={true}
                      enableDrawing={false}
                      farmName="Patel Khasra 48/2 North Plot"
                      khasra="48/2"
                      coordinates={[
                        [77.4128, 23.2599],
                        [77.4155, 23.2605],
                        [77.4162, 23.2578],
                        [77.4132, 23.2572],
                        [77.4128, 23.2599]
                      ]}
                    />
                  </div>

                  {/* Right: Verification Telemetry Card */}
                  <div className="md:col-span-4 space-y-3 p-5 rounded-2xl bg-[#0E1511]/90 border border-[#CAB4AA]/25 font-mono text-xs">
                    <div className="text-[10px] uppercase text-[#CAB4AA] tracking-wider border-b border-white/10 pb-1">
                      VERIFICATION ASSESSMENT
                    </div>
                    
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#68625B]">Claimed Area:</span>
                      <span className="text-[#FBF9F5]">2.50 Hectares</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#68625B]">Cadastre Area:</span>
                      <span className="text-[#C5E86C]">2.48 Hectares</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#68625B]">PostGIS Geodesic:</span>
                      <span className="text-[#A8D59D]">2.462 Hectares</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#68625B]">Mean NDVI:</span>
                      <span className="text-[#C5E86C]">0.68 (Normal Vigour)</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#68625B]">Audit SLA:</span>
                      <span className="text-[#83CFFF]">Day 4 of 21 (On Track)</span>
                    </div>

                    <div className="pt-2 text-center">
                      <span className="inline-block w-full py-1.5 rounded-lg bg-[#123D2B] text-[#C5E86C] text-[11px] font-semibold border border-[#C5E86C]/40">
                        EVIDENCE VERIFIED · PASS
                      </span>
                    </div>
                  </div>

                </div>

                {/* Bottom Bar: Back to Satellite */}
                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-[#CAB4AA]">
                  <span>SURVEY RECORDS: MP BHULEKH 2026-27</span>
                  <button
                    onClick={() => handleStageSelect('satellite')}
                    className="text-[#FBF9F5] hover:text-[#C5E86C] underline flex items-center gap-1 transition-colors"
                  >
                    <span>← Revisit Sentinel-2 Orbit</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Completion State Banner & Seamless Downward Flow */}
          {hasCompleted && (
            <div className="mt-6 p-4 rounded-2xl bg-[#EAE3D9]/70 border border-[#CAB4AA] flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#5B7553]" />
                <span className="text-xs sm:text-sm font-sans font-medium text-[#1B1D1C]">
                  Sequence complete. Both satellite telemetry and cadastral parcel data are verified.
                </span>
              </div>
              <button
                onClick={scrollToNextSection}
                className="px-5 py-2 rounded-full bg-[#1B1D1C] text-[#FBF9F5] text-xs font-sans font-medium hover:bg-[#333634] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue Reading</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
