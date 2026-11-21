import React from 'react';
import { MOCK_WORKSPACE_CLM001 } from '../../../services/mockData';
import { NdviChart } from '../../../components/charts/NdviChart';
import { WeatherChart } from '../../../components/charts/WeatherChart';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../../../components/common/StatusBadge';

export const YieldVerificationView: React.FC = () => {
  const { yield_verification } = MOCK_WORKSPACE_CLM001;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Verification Engine 2
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-1">Crop Yield & Phenological Health Verification</h1>
        <p className="text-xs text-slate-500">
          Multi-spectral Sentinel-2 NDVI vegetative trajectory tracking combined with IMD precipitation grids and XGBoost yield loss benchmarking.
        </p>
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
