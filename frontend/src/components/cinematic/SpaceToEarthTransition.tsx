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
  Compass
} from 'lucide-react';

export const SpaceToEarthTransition: React.FC = () => {
  const [activeStage, setActiveStage] = useState<'satellite' | 'farmland'>('satellite');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const animFrameRef = useRef<number | null>(null);

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

  const handleStageSelect = (stage: 'satellite' | 'farmland') => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsPlaying(false);
    setActiveStage(stage);
    setProgress(stage === 'satellite' ? 0.25 : 0.75);
  };

  const handleReset = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsPlaying(false);
    setActiveStage('satellite');
    setProgress(0);
    setHasCompleted(false);
  };

  const scrollToNextSection = () => {
    const el = document.getElementById('how-we-help-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section 
      id="dhara-animation-stage" 
      className="relative w-full py-20 bg-[#FBF9F5] text-[#1B1D1C] border-t border-[#EAE3D9]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Serein Header for the Animation Showcase */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-sans font-semibold uppercase tracking-[0.22em] text-[#68625B] mb-3">
              SIGNATURE DUAL ANIMATION SEQUENCE
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight">
              Planetary Observation & <br />
              <span className="italic text-[#8B5F4D]">Cadastral Verification.</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#68625B] font-sans max-w-md leading-relaxed">
            From 786 kilometers in sun-synchronous orbit to the individual survey parcel on the ground. 
            Two interconnected animations demonstrating the DHARA pipeline.
          </p>
        </div>

        {/* Serein-Style Interactive Showcase Container */}
        <div className="relative rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] p-4 sm:p-8 shadow-[0_12px_40px_rgba(27,29,28,0.04)] overflow-hidden">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#EAE3D9]">
            
            {/* Stage Selector Pills */}
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#EAE3D9]/60 border border-[#EAE3D9]">
              <button
                onClick={() => handleStageSelect('satellite')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans font-medium transition-all duration-200 ${
                  activeStage === 'satellite'
                    ? 'bg-[#1B1D1C] text-[#FBF9F5] shadow-sm'
                    : 'text-[#68625B] hover:text-[#1B1D1C]'
                }`}
              >
                <Satellite className="w-3.5 h-3.5" />
                <span>01 · Satellite Orbit & Swath</span>
              </button>

              <button
                onClick={() => handleStageSelect('farmland')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans font-medium transition-all duration-200 ${
                  activeStage === 'farmland'
                    ? 'bg-[#1B1D1C] text-[#FBF9F5] shadow-sm'
                    : 'text-[#68625B] hover:text-[#1B1D1C]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>02 · Farmland Cadastre & NDVI</span>
              </button>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3">
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
          <div className="relative mt-6 rounded-2xl overflow-hidden bg-[#141716] text-[#FBF9F5] min-h-[460px] sm:min-h-[520px] flex items-center justify-center shadow-inner">
            
            {/* STAGE 1: SATELLITE ORBIT ANIMATION */}
            {activeStage === 'satellite' && (
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn">
                
                {/* Orbital Starfield Background */}
                <div className="absolute inset-0 bg-radial-gradient from-[#1B2B3A] via-[#141716] to-[#0A0C0B] opacity-90 pointer-events-none"></div>
                
                {/* Orbital Ring Geometry */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[600px] h-[600px] rounded-full border border-dashed border-[#CAB4AA]/20 animate-spin" style={{ animationDuration: '60s' }}></div>
                  <div className="w-[450px] h-[450px] rounded-full border border-[#83CFFF]/15"></div>
                  <div className="w-[300px] h-[300px] rounded-full border border-[#C5E86C]/10"></div>
                </div>

                {/* Top HUD Telemetry */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#C5E86C]">
                      <span className="w-2 h-2 rounded-full bg-[#C5E86C] animate-ping"></span>
                      <span>ORBITAL TELEMETRY SYNCHRONIZED</span>
                    </div>
                    <p className="text-[11px] font-mono text-[#CAB4AA]">SENTINEL-2 MULTISPECTRAL INSTRUMENT (MSI)</p>
                  </div>

                  <div className="text-right space-y-0.5 text-[11px] font-mono text-[#FBF9F5]/70">
                    <div>ALT: 786.4 KM · SUN-SYNCHRONOUS</div>
                    <div className="text-[#83CFFF]">SWATH: 290 KM · REVISIT: 5 DAYS</div>
                  </div>
                </div>

                {/* Central Satellite Model (Sleek Vector Simulation) */}
                <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                  <div className="relative w-72 sm:w-96 flex items-center justify-center">
                    
                    {/* Left Solar Array */}
                    <div className="w-24 sm:w-32 h-14 bg-gradient-to-r from-[#1E3A5F] to-[#2A4D78] border border-[#83CFFF]/40 rounded-sm grid grid-cols-4 gap-0.5 p-1 shadow-lg transform -skew-y-3">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-[#142336] border border-[#83CFFF]/20 rounded-xs"></div>
                      ))}
                    </div>

                    {/* Central Satellite Chassis & Lens */}
                    <div className="relative z-20 w-16 sm:w-20 h-20 sm:h-24 bg-gradient-to-b from-[#C5A059] via-[#8B7341] to-[#3A3326] rounded-lg border border-[#F5EFE6]/40 flex flex-col items-center justify-center shadow-2xl mx-1">
                      {/* Aperture Optics */}
                      <div className="w-10 h-10 rounded-full bg-[#0A0C0B] border-2 border-[#83CFFF] flex items-center justify-center shadow-[0_0_15px_#83CFFF]">
                        <div className="w-4 h-4 rounded-full bg-[#1E3A5F] border border-white/60 animate-pulse"></div>
                      </div>
                      <span className="text-[8px] font-mono tracking-widest text-[#FBF9F5] mt-1">MSI-L2A</span>
                    </div>

                    {/* Right Solar Array */}
                    <div className="w-24 sm:w-32 h-14 bg-gradient-to-l from-[#1E3A5F] to-[#2A4D78] border border-[#83CFFF]/40 rounded-sm grid grid-cols-4 gap-0.5 p-1 shadow-lg transform skew-y-3">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-[#142336] border border-[#83CFFF]/20 rounded-xs"></div>
                      ))}
                    </div>

                    {/* Scanning Cone Downward */}
                    <div className="absolute top-20 w-48 sm:w-64 h-36 bg-gradient-to-b from-[#83CFFF]/20 to-transparent clip-path-polygon opacity-75 pointer-events-none transform origin-top"></div>
                  </div>

                  {/* Dynamic Status Callout */}
                  <div className="mt-8 px-4 py-2 rounded-full bg-[#1B1D1C]/80 border border-[#CAB4AA]/30 backdrop-blur-md flex items-center gap-3 text-xs font-mono">
                    <Scan className="w-4 h-4 text-[#C5E86C] animate-spin" />
                    <span>ACQUIRING BANDS: B04 (RED 665nm) · B08 (NIR 842nm) · B11 (SWIR 1610nm)</span>
                  </div>
                </div>

                {/* Bottom Bar: Quick Trigger to Farmland */}
                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-[#CAB4AA]">
                  <span>LAT: 23°15'35" N · LON: 77°24'45" E</span>
                  <button
                    onClick={() => handleStageSelect('farmland')}
                    className="text-[#FBF9F5] hover:text-[#C5E86C] underline flex items-center gap-1 transition-colors"
                  >
                    <span>View Resulting Farmland Cadastre →</span>
                  </button>
                </div>

              </div>
            )}

            {/* STAGE 2: FARMLAND CADASTRAL & NDVI ANALYSIS ANIMATION */}
            {activeStage === 'farmland' && (
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn bg-[#111A15]">
                
                {/* Cadastral Grid Aerial Simulation */}
                <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
                  backgroundImage: 'radial-gradient(#5B7553 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}></div>

                {/* Top HUD */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#C5E86C]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5E86C]" />
                      <span>CADASTRAL GROUND TRUTH RESOLVED</span>
                    </div>
                    <p className="text-[11px] font-mono text-[#CAB4AA]">KHASRA PARCEL IDENTIFIER: 48/2 · VILLAGE KHAJURI</p>
                  </div>

                  <div className="text-right space-y-0.5 text-[11px] font-mono text-[#FBF9F5]/70">
                    <div>UTM ZONE 43N GEODESIC</div>
                    <div className="text-[#C5E86C]">CLAIM GAP: -0.8% (PASS)</div>
                  </div>
                </div>

                {/* Cadastral Parcel Interactive Visual */}
                <div className="relative z-10 my-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  
                  {/* Left: Interactive Parcel Grid */}
                  <div className="md:col-span-2 relative h-64 sm:h-72 rounded-xl border border-[#5B7553]/40 bg-[#0E1511] p-4 overflow-hidden">
                    {/* Simulated Farm Boundaries with SVG */}
                    <svg className="w-full h-full" viewBox="0 0 400 240">
                      {/* Parcel 1 - High NDVI (Healthy) */}
                      <polygon 
                        points="20,20 180,35 160,140 30,120" 
                        fill="#2E7D32" 
                        fillOpacity="0.75" 
                        stroke="#C5E86C" 
                        strokeWidth="2"
                      />
                      <text x="65" y="80" fill="#FBF9F5" fontSize="10" fontFamily="monospace">Khasra 48/2 (2.48 Ha)</text>
                      <text x="75" y="95" fill="#C5E86C" fontSize="9" fontFamily="monospace">NDVI: 0.68 Vigorous</text>

                      {/* Parcel 2 - Moderate / Mixed */}
                      <polygon 
                        points="180,35 370,25 350,110 160,140" 
                        fill="#689F38" 
                        fillOpacity="0.65" 
                        stroke="#8BC34A" 
                        strokeWidth="1.5"
                      />
                      <text x="210" y="75" fill="#FBF9F5" fontSize="10" fontFamily="monospace">Khasra 48/3 (1.92 Ha)</text>
                      <text x="220" y="90" fill="#8BC34A" fontSize="9" fontFamily="monospace">NDVI: 0.54 Normal</text>

                      {/* Parcel 3 - Moisture Stress Alert */}
                      <polygon 
                        points="30,120 160,140 140,225 15,210" 
                        fill="#D32F2F" 
                        fillOpacity="0.6" 
                        stroke="#FF5252" 
                        strokeWidth="2"
                        strokeDasharray="4"
                      />
                      <text x="35" y="170" fill="#FBF9F5" fontSize="10" fontFamily="monospace">Khasra 49/1 (1.10 Ha)</text>
                      <text x="35" y="185" fill="#FF8A80" fontSize="9" fontFamily="monospace">NDVI: 0.28 Stress Zone</text>

                      {/* Parcel 4 - Fallow / Prepared */}
                      <polygon 
                        points="160,140 350,110 380,220 140,225" 
                        fill="#F57C00" 
                        fillOpacity="0.5" 
                        stroke="#FFA726" 
                        strokeWidth="1.5"
                      />
                      <text x="200" y="175" fill="#FBF9F5" fontSize="10" fontFamily="monospace">Khasra 50/1 (3.40 Ha)</text>
                      <text x="210" y="190" fill="#FFE082" fontSize="9" fontFamily="monospace">NDVI: 0.42 Emerging</text>
                    </svg>

                    {/* Legend */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-[#0A0C0B]/80 px-3 py-1 rounded-md text-[10px] font-mono border border-white/10">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#2E7D32] rounded-xs"></span> 0.6+ Healthy</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#F57C00] rounded-xs"></span> 0.4 Medium</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[#D32F2F] rounded-xs"></span> &lt;0.3 Deficit</span>
                    </div>
                  </div>

                  {/* Right: Verification Telemetry Card */}
                  <div className="space-y-3 p-4 rounded-xl bg-[#0E1511]/90 border border-[#CAB4AA]/25 font-mono text-xs">
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
                      <span className="text-[#68625B]">Mean NDVI:</span>
                      <span className="text-[#C5E86C]">0.68 (Normal Vigour)</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#68625B]">Audit SLA:</span>
                      <span className="text-[#83CFFF]">Day 4 of 21 (On Track)</span>
                    </div>

                    <div className="pt-2 text-center">
                      <span className="inline-block px-3 py-1 rounded bg-[#123D2B] text-[#C5E86C] text-[11px] font-semibold border border-[#C5E86C]/40">
                        EVIDENCE VERIFIED · READY
                      </span>
                    </div>
                  </div>

                </div>

                {/* Bottom Bar: Back to Satellite */}
                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-[#CAB4AA]">
                  <span>SURVEY RECORDS: REVENUE DEPT 2024-25</span>
                  <button
                    onClick={() => handleStageSelect('satellite')}
                    className="text-[#FBF9F5] hover:text-[#C5E86C] underline flex items-center gap-1 transition-colors"
                  >
                    <span>← Revisit Satellite Orbit</span>
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
