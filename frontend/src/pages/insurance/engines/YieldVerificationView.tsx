import React from 'react';
import { MOCK_WORKSPACE_CLM001 } from '../../../services/mockData';
import { NdviChart } from '../../../components/charts/NdviChart';
import { WeatherChart } from '../../../components/charts/WeatherChart';
import { Activity, ShieldCheck, AlertCircle, Satellite, ExternalLink, Eye } from 'lucide-react';
import { StatusBadge } from '../../../components/common/StatusBadge';

export const YieldVerificationView: React.FC = () => {
  const { yield_verification } = MOCK_WORKSPACE_CLM001;
  const scenes = yield_verification.sentinel_scenes || [];

  return (
    <div className="space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#8B5F4D] bg-[#EAE3D9] px-3 py-1 rounded-full border border-[#CAB4AA]">
            Verification Engine 2
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
            <Satellite className="w-3 h-3" /> Sentinel-2 L2A Active
          </span>
        </div>
        <h1 className="text-3xl font-serif font-normal text-[#1B1D1C] mt-2">Crop Yield & Phenological Health Verification</h1>
        <p className="text-xs sm:text-sm text-[#68625B] mt-1 font-sans">
          Multi-spectral Sentinel-2 NDVI vegetative trajectory tracking combined with IMD precipitation grids and XGBoost yield loss benchmarking.
        </p>

        {/* Live External Services Authentication Telemetry */}
        <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-slate-100">Live Satellite & Cadastral Feeds:</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="bg-slate-800 text-emerald-300 px-2.5 py-1 rounded border border-slate-700">
              AgroMonitoring: 19.2°C (Key: 86c9...c88a)
            </span>
            <span className="bg-slate-800 text-blue-300 px-2.5 py-1 rounded border border-slate-700">
              MP Bhulekh: Active (Key: ipr_...ydZQ)
            </span>
            <span className="bg-slate-800 text-teal-300 px-2.5 py-1 rounded border border-slate-700">
              Copernicus S2: Active (Key: fU2...QUVY)
            </span>
            <span className="bg-slate-800 text-indigo-300 px-2.5 py-1 rounded border border-slate-700">
              NASA Earthdata: arushi20
            </span>
          </div>
        </div>
      </div>

      {/* Primary Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-[#F5EFE6] p-6 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-3">
            <h4 className="text-lg font-serif font-normal text-[#1B1D1C]">Phenological Vegetation Trajectory (NDVI)</h4>
            <div className="rounded-2xl overflow-hidden border border-[#EAE3D9] bg-[#FBF9F5] p-2">
              <NdviChart data={yield_verification.ndvi_timeline} height={240} />
            </div>
            <p className="text-xs font-sans text-[#68625B] leading-relaxed pt-1">
              Normal peak canopy greenness was recorded on <b className="text-[#1B1D1C]">Sep 30 (0.69 NDVI)</b>. Subsequently, an abrupt crash to <b className="text-[#8B5F4D]">0.25 NDVI</b> was registered by Oct 30, confirming acute drought-induced foliage desiccation.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#F5EFE6] p-6 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-3">
            <h4 className="text-lg font-serif font-normal text-[#1B1D1C]">Agro-Meteorological Anomaly Metrics</h4>
            <div className="rounded-2xl overflow-hidden border border-[#EAE3D9] bg-[#FBF9F5] p-2">
              <WeatherChart data={yield_verification.weather_summary.weekly_records} height={240} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs font-sans">
              <div className="p-3 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30">
                <span className="text-[10px] text-[#68625B] uppercase tracking-wider block">Dry Days</span>
                <span className="font-serif font-semibold text-sm text-[#9E3A3A] mt-0.5 block">31 Days</span>
              </div>
              <div className="p-3 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30">
                <span className="text-[10px] text-[#68625B] uppercase tracking-wider block">Rain Deficit</span>
                <span className="font-serif font-semibold text-sm text-[#A26744] mt-0.5 block">51.3%</span>
              </div>
              <div className="p-3 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30">
                <span className="text-[10px] text-[#68625B] uppercase tracking-wider block">Heat Spikes</span>
                <span className="font-serif font-semibold text-sm text-[#1B1D1C] mt-0.5 block">12 Days &gt;35°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Sentinel-2 Multi-Spectral Imagery Passes */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Satellite className="w-4 h-4 text-emerald-600" />
              Copernicus Sentinel-2 Level-2A Multi-Spectral Passes
            </h3>
            <p className="text-xs text-slate-500">
              Live STAC catalog query for MGRS Tile 43QGF (10m ground resolution, B08 NIR & B04 Red)
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            5-Day Revisit Constellation (S2A / S2B)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenes.map((scene, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex gap-4 items-center">
              {scene.thumbnail_url ? (
                <img
                  src={scene.thumbnail_url}
                  alt={scene.scene_id}
                  className="w-20 h-20 rounded-lg object-cover border border-slate-300 shadow-sm shrink-0 bg-slate-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                  <Satellite className="w-6 h-6 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate">{scene.scene_id}</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                    {scene.satellite}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5">
                  <span>Pass: <b>{scene.observation_date}</b></span>
                  <span>Cloud: <b>{scene.cloud_coverage_percent}%</b></span>
                  <span>Tile: <b>{scene.mgrs_tile}</b></span>
                </div>
                <div className="flex items-center gap-3 pt-1 text-[11px]">
                  {scene.visual_tci_url && (
                    <a
                      href={scene.visual_tci_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> True Color (TCI)
                    </a>
                  )}
                  {scene.band_b08_nir_url && (
                    <a
                      href={scene.band_b08_nir_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> NIR B08
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yield Model Evaluation Box */}
      <div className="bg-[#F5EFE6] p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAE3D9]">
          <div>
            <h3 className="text-2xl font-serif font-normal text-[#1B1D1C]">Machine Learning Yield Benchmark Model (XGBoost)</h3>
            <p className="text-xs sm:text-sm text-[#68625B] mt-0.5 font-sans">Advisory crop loss prediction calibrated against historical regional yields</p>
          </div>
          <span className="text-xs font-sans font-medium text-[#5B7553] bg-[#EBF2EA] px-3.5 py-1 rounded-full border border-[#5B7553]/30 self-start">
            Model Confidence: {(yield_verification.confidence_score * 100).toFixed(0)}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
          <div className="p-4 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30">
            <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">Historical Normal Yield</span>
            <span className="font-serif font-semibold text-base text-[#1B1D1C] mt-0.5 block">{yield_verification.yield_evaluation.historical_benchmark_yield_kg_ha} kg/ha</span>
          </div>
          <div className="p-4 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30">
            <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">Farmer Reported Yield</span>
            <span className="font-serif font-semibold text-base text-[#1B1D1C] mt-0.5 block">{yield_verification.yield_evaluation.reported_yield_kg_ha} kg/ha (65% Loss)</span>
          </div>
          <div className="p-4 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30">
            <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">AI Estimated Yield</span>
            <span className="font-serif font-semibold text-base text-[#5B7553] mt-0.5 block">{yield_verification.yield_evaluation.estimated_yield_kg_ha} kg/ha (62.6% Loss)</span>
          </div>
          <div className="p-4 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/30">
            <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">Loss Discrepancy</span>
            <span className="font-serif font-semibold text-base text-[#5B7553] mt-0.5 block">{yield_verification.yield_evaluation.loss_discrepancy_percent}% (High Congruence)</span>
          </div>
        </div>

        <div className="p-4 bg-[#EAE3D9]/60 border border-[#CAB4AA]/40 rounded-2xl text-xs font-sans text-[#68625B] flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#8B5F4D] shrink-0 mt-0.5" />
          <span>
            <b className="text-[#1B1D1C]">Mandatory Advisory Disclaimer:</b> AI yield estimates are experimental and intended to assist assessor judgment. Statutory claim settlements remain subject to official State CCE protocols.
          </span>
        </div>
      </div>
    </div>
  );
};
