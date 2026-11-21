import React, { useState } from 'react';
import { MOCK_FARMS_DATA } from '../../services/mockData';
import { FarmMapViewer } from '../../components/maps/FarmMapViewer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MapPin, Layers, FileText, CheckCircle2, User } from 'lucide-react';

export const FarmersAndFarms: React.FC = () => {
  const [selectedFarm, setSelectedFarm] = useState(MOCK_FARMS_DATA[0]);
  const activeFarm = selectedFarm || MOCK_FARMS_DATA[0];

  if (!activeFarm) {
    return (
      <div className="p-8 text-center text-[#68625B] font-sans">
        No registered land parcels found in directory.
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <div>
        <h1 className="text-3xl font-serif font-normal text-[#1B1D1C]">Farmers & Land Parcels Directory</h1>
        <p className="text-xs sm:text-sm text-[#68625B] mt-1 font-sans">
          Cadastral Khasra profiles, mapped geospatial boundaries, and legal land ownership records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Farmers List */}
        <div className="space-y-3">
          <span className="text-xs font-sans font-medium uppercase text-[#68625B] tracking-wider block px-1">
            Registered Land Parcels
          </span>
          {MOCK_FARMS_DATA.map((farm) => {
            const isSelected = selectedFarm.id === farm.id;
            return (
              <div
                key={farm.id}
                onClick={() => setSelectedFarm(farm)}
                className={`p-5 rounded-3xl border cursor-pointer transition shadow-[0_2px_12px_rgba(27,29,28,0.02)] ${
                  isSelected 
                    ? 'bg-[#EAE3D9] border-[#8B5F4D] shadow-sm ring-1 ring-[#8B5F4D]/30' 
                    : 'bg-[#F5EFE6] border-[#EAE3D9] hover:bg-[#EAE3D9]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-semibold text-sm text-[#1B1D1C]">{farm.farm_name}</h4>
                  <StatusBadge status={farm.verification_status} size="sm" />
                </div>
                <p className="text-xs text-[#68625B] mt-1 flex items-center gap-1 font-sans">
                  <User className="w-3.5 h-3.5 text-[#8B5F4D]" /> {farm.farmer_name}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#CAB4AA]/30 text-xs font-sans">
                  <span className="text-[#68625B]">Khasra: <b className="text-[#1B1D1C]">{farm.khasra_number}</b></span>
                  <span className="font-serif font-semibold text-[#5B7553]">{farm.current_crop} ({farm.declared_area_hectares} Ha)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Geospatial & Cadastral Profile */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#F5EFE6] p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#EAE3D9]">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-serif font-normal text-[#1B1D1C]">{activeFarm.farm_name}</h2>
                  <StatusBadge status={activeFarm.verification_status} />
                </div>
                <p className="text-xs sm:text-sm text-[#68625B] mt-1 flex items-center gap-1.5 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[#8B5F4D]" />
                  Village: {activeFarm.village} · District: {activeFarm.district}, Madhya Pradesh
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-sans text-[#68625B] uppercase tracking-wider block">Cultivation</span>
                <div className="text-base font-serif font-semibold text-[#5B7553] mt-0.5">
                  {activeFarm.current_crop} ({activeFarm.season})
                </div>
              </div>
            </div>

            {/* Farm Boundary Map (Leaflet Satellite Canvas) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-medium text-[#1B1D1C] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#8B5F4D]" /> Delineated Cadastral Boundary (PostGIS Polygon)
                </span>
                <span className="text-[#68625B] font-mono">CRS: EPSG:4326 (WGS 84)</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-[#EAE3D9]">
                <FarmMapViewer
                  coordinates={activeFarm.boundary_geojson?.coordinates}
                  farmName={activeFarm.farm_name}
                  khasra={activeFarm.khasra_number}
                  height="320px"
                />
              </div>
            </div>

            {/* Cadastral Comparison Metric Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/40 text-xs font-sans">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#68625B] block">Declared Khasra</span>
                <span className="text-base font-serif font-semibold text-[#1B1D1C] mt-0.5 block">{activeFarm.declared_area_hectares} Ha</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#68625B] block">PostGIS Geodesic</span>
                <span className="text-base font-serif font-semibold text-[#5B7553] mt-0.5 block">{activeFarm.geodesic_area_hectares} Ha</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#68625B] block">Area Variance</span>
                <span className={`text-base font-serif font-semibold mt-0.5 block ${(activeFarm.area_variance_percent ?? 0) > 15 ? 'text-[#9E3A3A]' : 'text-[#5B7553]'}`}>
                  {activeFarm.area_variance_percent}%
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#68625B] block">Soil Class</span>
                <span className="text-base font-serif font-semibold text-[#1B1D1C] mt-0.5 block">{activeFarm.soil_type || 'Medium Black'}</span>
              </div>
            </div>

            {/* Document Vault */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-sans font-medium uppercase tracking-wider text-[#68625B]">Uploaded Cadastral Documents</h4>
              <div className="p-4 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#8B5F4D]" />
                  <span className="font-serif font-semibold text-sm text-[#1B1D1C]">MP_Bhulekh_Khasra_{(activeFarm.khasra_number || '48_2').replace('/', '_')}_Deed.pdf</span>
                </div>
                <span className="text-[#5B7553] font-medium bg-[#EBF2EA] px-3 py-1 rounded-full border border-[#5B7553]/30 self-start sm:self-auto">
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
