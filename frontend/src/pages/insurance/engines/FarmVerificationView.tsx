import React, { useState } from 'react';
import { MOCK_FARMS_DATA } from '../../../services/mockData';
import { FarmMapViewer } from '../../../components/maps/FarmMapViewer';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Layers, MapPin, Calculator, ShieldCheck } from 'lucide-react';

export const FarmVerificationView: React.FC = () => {
  const [selectedFarm, setSelectedFarm] = useState(MOCK_FARMS_DATA[0]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Verification Engine 1
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-1">Farm Boundary & Geospatial Delineation</h1>
        <p className="text-xs text-slate-500">
          Computes PostGIS geodesic polygon area and compares with legal Khasra declarations to detect acreage inflation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Farm to Verify</span>
          {MOCK_FARMS_DATA.map((f) => (
            <div
              key={f.id}
              onClick={() => setSelectedFarm(f)}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                selectedFarm.id === f.id
                  ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900">{f.farm_name}</h4>
                <StatusBadge status={f.verification_status} size="sm" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Khasra: {f.khasra_number} · {f.district}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-400">Declared: {f.declared_area_hectares} Ha</span>
                <span className="font-semibold text-blue-700">Mapped: {f.geodesic_area_hectares} Ha</span>
              </div>
            </div>
          ))}
        </div>

        {/* Engine Output */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{selectedFarm.farm_name}</h3>
                <span className="text-xs text-slate-500">Khasra No: {selectedFarm.khasra_number}</span>
              </div>
              <StatusBadge status={selectedFarm.verification_status} />
            </div>

            <FarmMapViewer
              coordinates={selectedFarm.boundary_geojson.coordinates}
              khasra={selectedFarm.khasra_number}
              height="300px"
              interactive={true}
            />

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Declared Land Deed</span>
                <span className="font-bold text-slate-900">{selectedFarm.declared_area_hectares} Ha</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PostGIS Geodesic Area</span>
                <span className="font-bold text-blue-700">{selectedFarm.geodesic_area_hectares} Ha</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Discrepancy (Δ)</span>
                <span className={`font-bold ${selectedFarm.area_variance_percent > 15 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {selectedFarm.area_variance_percent}%
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
              <span className="font-bold block">Engine 1 Evaluation Rationale:</span>
              <p>
                {selectedFarm.area_variance_percent <= 5
                  ? 'Area is within the 5% regulatory margin of error. Cadastral boundary is verified.'
                  : selectedFarm.area_variance_percent > 15
                  ? 'Severe variance detected (> 15%). Field boundary indicates potential inflated land claim.'
                  : 'Moderate variance (5-15%). Manual surveyor inspection recommended.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
