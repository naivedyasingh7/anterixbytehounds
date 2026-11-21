import React, { useState } from 'react';
import { DharaNav } from '../../components/common/DharaNav';
import { 
  MapPin, 
  Activity, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileText
} from 'lucide-react';
import { MOCK_FARMS_DATA } from '../../services/mockData';
import { NdviChart } from '../../components/charts/NdviChart';

export const UnifiedVerificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'farm' | 'yield'>('farm');
  const [selectedFarmIdx, setSelectedFarmIdx] = useState(0);

  const farms = MOCK_FARMS_DATA;
  const currentFarm = farms[selectedFarmIdx];

  const yieldLossData = [
    { metric: 'Peak Observed NDVI (Booting Stage)', value: '0.41', normal: '0.68', deficit: '-39.7%' },
    { metric: 'Cumulative Phenological AUC', value: '18.4', normal: '31.2', deficit: '-41.0%' },
    { metric: 'Rainfall Deficit (Crucial Grain Fill)', value: '-48 mm', normal: 'Normal', deficit: 'Severe Drought' },
    { metric: 'Modeled Yield Loss (XGBoost Regressor)', value: '42.4%', normal: 'Base Yield', deficit: 'High Loss' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <DharaNav />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-44 sm:pt-48 pb-20 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-[#8B5F4D]" />
            <span>Dual-Engine Evidence Suite (E1 & E2)</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight">
            Farm & Yield Verification Engine
          </h1>
          <p className="text-[#68625B] text-base font-sans font-normal leading-relaxed">
            Cross-verify declared cadastral geometry with PostGIS geodesic ellipsoids and evaluate multi-temporal 
            Sentinel-2 vegetation trajectories to establish empirical loss certainty.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-[#EAE3D9] pb-4">
          <button
            onClick={() => setActiveTab('farm')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-medium uppercase tracking-wider transition-all ${
              activeTab === 'farm'
                ? 'bg-[#1B1D1C] text-[#FBF9F5] shadow-sm'
                : 'bg-[#F5EFE6] text-[#68625B] hover:text-[#1B1D1C]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Engine 1: Farm Boundary & Geodesics</span>
          </button>

          <button
            onClick={() => setActiveTab('yield')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-medium uppercase tracking-wider transition-all ${
              activeTab === 'yield'
                ? 'bg-[#1B1D1C] text-[#FBF9F5] shadow-sm'
                : 'bg-[#F5EFE6] text-[#68625B] hover:text-[#1B1D1C]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Engine 2: Sentinel-2 NDVI & Yield Loss</span>
          </button>
        </div>

        {/* ================= TAB 1: ENGINE 1 (FARM VERIFICATION) ================= */}
        {activeTab === 'farm' && (
          <div className="space-y-8">
            {/* Plot Selector */}
            <div className="space-y-3">
              <div className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#8B5F4D]">
                Select cadastral parcel to audit:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {farms.map((f, idx) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFarmIdx(idx)}
                    className={`p-4 rounded-2xl text-left border font-sans transition-all ${
                      selectedFarmIdx === idx
                        ? 'bg-[#1B1D1C] text-[#FBF9F5] border-[#1B1D1C] shadow-md'
                        : 'bg-[#F5EFE6] border-[#EAE3D9] text-[#68625B] hover:text-[#1B1D1C] hover:bg-[#EAE3D9]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">Khasra {f.khasra_number}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                        selectedFarmIdx === idx
                          ? 'bg-white/20 text-white'
                          : f.verification_status === 'Verified' ? 'text-[#5B7553] bg-emerald-50 border border-emerald-200' :
                            f.verification_status === 'Mismatch' ? 'text-rose-700 bg-rose-50 border border-rose-200' :
                            'text-[#8B5F4D] bg-amber-50 border border-amber-200'
                      }`}>
                        {f.verification_status}
                      </span>
                    </div>
                    <div className="text-xs truncate">{f.farm_name}</div>
                    <div className={`text-[11px] mt-1 ${selectedFarmIdx === idx ? 'text-[#CAB4AA]' : 'text-[#8B5F4D]'}`}>
                      {f.district} • {f.current_crop}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Farm Verification Deep-Dive Display */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Map Preview */}
              <div className="lg:col-span-7 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-6 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
                <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4">
                  <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#8B5F4D] uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Cadastral Satellite Overlay (UTM Zone 43N)</span>
                  </div>
                  <span className="font-mono text-xs text-[#5B7553] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    EPSG:32643 EQUAL-AREA
                  </span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-[#EAE3D9] h-[360px] group shadow-inner bg-[#141716]">
                  <img 
                    src="/assets/reference-c-farmland.jpg" 
                    alt="Aerial Farm Cadastral Boundary" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Polygon overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <polygon 
                      points="100,80 320,95 360,260 130,240" 
                      fill="rgba(139, 95, 77, 0.3)" 
                      stroke="#C5E86C" 
                      strokeWidth="2.5" 
                      strokeDasharray="4 2"
                    />
                  </svg>

                  <div className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur-md p-3.5 rounded-xl border border-white/10 font-mono text-xs text-white">
                    <div className="text-[#C5E86C] font-bold">{currentFarm.farm_name}</div>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      Declared: {currentFarm.declared_area_hectares} Ha • Geodesic: {currentFarm.geodesic_area_hectares} Ha
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] text-xs font-sans text-[#68625B]">
                  <strong className="text-[#1B1D1C]">Cadastral Geodesic Rule:</strong> Variance is computed as |Declared - Geodesic| / Declared * 100%. 
                  Tolerances: &le; 5% (Verified), 5-15% (Manual Review), &gt; 15% (Mismatch).
                </div>
              </div>

              {/* Rationale & Metrics */}
              <div className="lg:col-span-5 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-6 shadow-[0_4px_24px_rgba(27,29,28,0.03)] font-sans text-xs">
                
                <div>
                  <div className="text-[11px] text-[#8B5F4D] uppercase font-semibold">ENGINE 1 AUDIT VERDICT</div>
                  <div className="text-3xl font-serif font-normal text-[#1B1D1C] mt-1">
                    {currentFarm.verification_status} Status
                  </div>
                  <div className="text-xs font-mono text-[#8B5F4D] mt-0.5 font-medium">
                    Variance: {currentFarm.area_variance_percent}%
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#EAE3D9]">
                    <span className="text-[#68625B]">Declared Land Revenue Area:</span>
                    <strong className="text-[#1B1D1C]">{currentFarm.declared_area_hectares} Hectares</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#EAE3D9]">
                    <span className="text-[#68625B]">Calculated Geodesic Polygon:</span>
                    <strong className="text-[#1B1D1C]">{currentFarm.geodesic_area_hectares} Hectares</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#68625B]">Discrepancy (Acreage Deficit):</span>
                    <strong className={currentFarm.area_variance_percent > 10 ? 'text-rose-700' : 'text-[#5B7553]'}>
                      {(currentFarm.declared_area_hectares - currentFarm.geodesic_area_hectares).toFixed(3)} Ha
                    </strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] text-xs leading-relaxed text-[#68625B]">
                  {(currentFarm as any).verification_notes || `PostGIS geodesic verification confirms cadastral boundary for ${currentFarm.farm_name} with ${currentFarm.area_variance_percent}% acreage variance.`}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: ENGINE 2 (YIELD LOSS VERIFICATION) ================= */}
        {activeTab === 'yield' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left: NDVI Phenology Chart */}
              <div className="lg:col-span-7 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-6 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
                <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4">
                  <div className="flex items-center gap-2 text-xs font-sans font-semibold text-[#8B5F4D] uppercase tracking-wider">
                    <Activity className="w-4 h-4" />
                    <span>Multi-Temporal NDVI Trajectory vs Baseline</span>
                  </div>
                  <span className="text-xs font-mono text-[#8B5F4D]">
                    PASS REVISIT: 5 DAYS
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9]">
                  <NdviChart farmId="FARM001" />
                </div>

                <p className="text-xs text-[#68625B] leading-relaxed">
                  Notice the sharp divergence occurring at Day 60 during the critical reproductive boot stage, 
                  triggered by an unmitigated 24-day dry spell across the Sehore/Bhopal agro-climatic sub-basin.
                </p>
              </div>

              {/* Right: XGBoost Empirical Regressor Table */}
              <div className="lg:col-span-5 bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] space-y-6 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
                <div>
                  <div className="text-[11px] text-[#8B5F4D] uppercase font-semibold">ENGINE 2 REGRESSION VERDICT</div>
                  <h3 className="text-3xl font-serif font-normal text-[#1B1D1C] mt-1">
                    42.4% Modeled Yield Loss
                  </h3>
                  <div className="text-xs text-[#68625B] mt-0.5">
                    Model: XGBoost Crop Loss v3.2 • R²: 0.892
                  </div>
                </div>

                <div className="space-y-3">
                  {yieldLossData.map((d, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE3D9] flex items-center justify-between text-xs font-sans">
                      <div>
                        <div className="font-medium text-[#1B1D1C]">{d.metric}</div>
                        <div className="text-[#68625B] text-[11px] mt-0.5">Observed: {d.value} • Normal: {d.normal}</div>
                      </div>
                      <span className="font-semibold text-[#8B5F4D] shrink-0 ml-3">{d.deficit}</span>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* Clean Workspace Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#68625B]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-[#1B1D1C]">DHARA INSURE</span>
          <span>·</span>
          <span>Dual-Engine Verification Cockpit</span>
        </div>
        <div className="text-xs font-mono text-[#8B5F4D]">
          <span>© 2026 DHARA</span>
        </div>
      </footer>
    </div>
  );
};
export default UnifiedVerificationPage;
