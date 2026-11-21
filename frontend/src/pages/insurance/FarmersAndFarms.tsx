import React, { useState } from 'react';
import { MOCK_FARMS_DATA } from '../../services/mockData';
import { FarmMapViewer } from '../../components/maps/FarmMapViewer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MapPin, Layers, FileText, CheckCircle2, User } from 'lucide-react';

export const FarmersAndFarms: React.FC = () => {
  const [selectedFarm, setSelectedFarm] = useState(MOCK_FARMS_DATA[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Farmers & Land Parcels Directory</h1>
        <p className="text-xs text-slate-500">
          Cadastral Khasra profiles, mapped geospatial boundaries, and land ownership records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Farmers List */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Registered Farms</span>
          {MOCK_FARMS_DATA.map((farm) => {
            const isSelected = selectedFarm.id === farm.id;
            return (
              <div
                key={farm.id}
                onClick={() => setSelectedFarm(farm)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  isSelected 
                    ? 'bg-emerald-50/60 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{farm.farm_name}</h4>
                  <StatusBadge status={farm.verification_status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" /> {farm.farmer_name}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400">Khasra: <b>{farm.khasra_number}</b></span>
                  <span className="font-semibold text-emerald-700">{farm.current_crop} ({farm.declared_area_hectares} Ha)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Geospatial & Cadastral Profile */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{selectedFarm.farm_name}</h2>
                  <StatusBadge status={selectedFarm.verification_status} />
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Village: {selectedFarm.village} · District: {selectedFarm.district}, Madhya Pradesh
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Cultivation</span>
                <div className="text-sm font-bold text-emerald-700">{selectedFarm.current_crop} ({selectedFarm.season})</div>
              </div>
            </div>

            {/* Farm Boundary Map (Leaflet Satellite Canvas) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" /> Delineated Cadastral Boundary (PostGIS Polygon)
                </span>
                <span className="text-slate-400">EPSG:4326</span>
              </div>
              <FarmMapViewer
                coordinates={selectedFarm.boundary_geojson.coordinates}
                farmName={selectedFarm.farm_name}
                khasra={selectedFarm.khasra_number}
                height="320px"
              />
            </div>

            {/* Cadastral Comparison Metric Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[11px] text-slate-400 block">Declared Khasra Area</span>
                <span className="text-sm font-bold text-slate-900">{selectedFarm.declared_area_hectares} Ha</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">PostGIS Geodesic Area</span>
                <span className="text-sm font-bold text-emerald-700">{selectedFarm.geodesic_area_hectares} Ha</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Area Variance</span>
                <span className={`text-sm font-bold ${selectedFarm.area_variance_percent > 15 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {selectedFarm.area_variance_percent}%
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Soil Classification</span>
                <span className="text-sm font-bold text-slate-900">{selectedFarm.soil_type || 'Medium Black'}</span>
              </div>
            </div>

            {/* Document Vault */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Uploaded Cadastral Documents</h4>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-900">MP_Bhulekh_Khasra_{selectedFarm.khasra_number.replace('/', '_')}_Deed.pdf</span>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Cadastral Match Confirmed
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
