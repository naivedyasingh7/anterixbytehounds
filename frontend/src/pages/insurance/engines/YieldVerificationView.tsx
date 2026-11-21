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
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Verification Engine 2
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
            <Satellite className="w-3 h-3" /> Sentinel-2 L2A Active
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mt-1">Crop Yield & Phenological Health Verification</h1>
        <p className="text-xs text-slate-500">
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
          <NdviChart data={yield_verification.ndvi_timeline} height={260} />
          
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2">
            <h4 className="font-bold text-slate-900">Phenological Vegetation Trajectory</h4>
            <p className="text-slate-600 leading-relaxed">
              Normal peak canopy greenness was recorded on <b>Sep 30 (0.69 NDVI)</b>. Subsequently, an abrupt crash to <b>0.25 NDVI</b> was registered by Oct 30, confirming acute drought-induced foliage desiccation.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <WeatherChart data={yield_verification.weather_summary.weekly_records} height={260} />

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2">
            <h4 className="font-bold text-slate-900">Agro-Meteorological Anomaly Metrics</h4>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Dry Days</span>
                <span className="font-bold text-rose-600">31 Days</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Rain Deficit</span>
                <span className="font-bold text-amber-600">51.3%</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Heat Spikes</span>
                <span className="font-bold text-slate-800">12 Days &gt;35°C</span>
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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Machine Learning Yield Benchmark Model (XGBoost)</h3>
            <p className="text-xs text-slate-500">Advisory crop loss prediction calibrated against historical regional yields</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Model Confidence: {(yield_verification.confidence_score * 100).toFixed(0)}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Historical Normal Yield</span>
            <span className="font-bold text-slate-900">{yield_verification.yield_evaluation.historical_benchmark_yield_kg_ha} kg/ha</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Farmer Reported Yield</span>
            <span className="font-bold text-slate-900">{yield_verification.yield_evaluation.reported_yield_kg_ha} kg/ha (65% Loss)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">AI Estimated Yield</span>
            <span className="font-bold text-emerald-700">{yield_verification.yield_evaluation.estimated_yield_kg_ha} kg/ha (62.6% Loss)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Loss Discrepancy</span>
            <span className="font-bold text-emerald-600">{yield_verification.yield_evaluation.loss_discrepancy_percent}% (High Congruence)</span>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <b>Mandatory Advisory Disclaimer:</b> AI yield estimates are experimental and intended to assist assessor judgment. Statutory claim settlements remain subject to official State CCE protocols.
          </span>
        </div>
      </div>
    </div>
  );
};
