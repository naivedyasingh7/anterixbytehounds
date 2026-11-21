import React, { useState } from 'react';
import { MOCK_FARMS_DATA } from '../../../services/mockData';
import { FarmMapViewer } from '../../../components/maps/FarmMapViewer';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Layers, MapPin, Calculator, ShieldCheck } from 'lucide-react';

export const FarmVerificationView: React.FC = () => {
  const [selectedFarm, setSelectedFarm] = useState(MOCK_FARMS_DATA[0]);

  return (
    <div className="space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <div>
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#8B5F4D] bg-[#EAE3D9] px-3 py-1 rounded-full border border-[#CAB4AA]">
          Verification Engine 1
        </span>
        <h1 className="text-3xl font-serif font-normal text-[#1B1D1C] mt-2">Farm Boundary & Geospatial Delineation</h1>
        <p className="text-xs sm:text-sm text-[#68625B] mt-1 font-sans">
          Computes PostGIS geodesic polygon area and compares with legal Khasra declarations to detect acreage inflation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector */}
        <div className="space-y-3">
          <span className="text-xs font-sans font-medium uppercase text-[#68625B] tracking-wider block px-1">
            Select Farm to Verify
          </span>
          {MOCK_FARMS_DATA.map((f) => (
            <div
              key={f.id}
              onClick={() => setSelectedFarm(f)}
              className={`p-5 rounded-3xl border cursor-pointer transition shadow-[0_2px_12px_rgba(27,29,28,0.02)] ${
                selectedFarm.id === f.id
                  ? 'bg-[#EAE3D9] border-[#8B5F4D] shadow-sm ring-1 ring-[#8B5F4D]/30'
                  : 'bg-[#F5EFE6] border-[#EAE3D9] hover:bg-[#EAE3D9]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-semibold text-sm text-[#1B1D1C]">{f.farm_name}</h4>
                <StatusBadge status={f.verification_status} size="sm" />
              </div>
              <p className="text-xs text-[#68625B] mt-1 font-sans">Khasra: {f.khasra_number} · {f.district}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#CAB4AA]/30 text-xs font-sans">
                <span className="text-[#68625B]">Declared: {f.declared_area_hectares} Ha</span>
                <span className="font-serif font-semibold text-[#5B7553]">Mapped: {f.geodesic_area_hectares} Ha</span>
              </div>
            </div>
          ))}
        </div>

        {/* Engine Output */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#F5EFE6] p-8 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE3D9]">
              <div>
                <h3 className="text-2xl font-serif font-normal text-[#1B1D1C]">{selectedFarm.farm_name}</h3>
                <span className="text-xs font-mono text-[#8B5F4D]">Khasra No: {selectedFarm.khasra_number}</span>
              </div>
              <StatusBadge status={selectedFarm.verification_status} />
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#EAE3D9]">
              <FarmMapViewer
                coordinates={selectedFarm.boundary_geojson.coordinates}
                khasra={selectedFarm.khasra_number}
                height="320px"
                interactive={true}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 p-5 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/40 text-xs font-sans">
              <div>
                <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">Declared Deed</span>
                <span className="text-base font-serif font-semibold text-[#1B1D1C] mt-0.5 block">{selectedFarm.declared_area_hectares} Ha</span>
              </div>
              <div>
                <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">PostGIS Geodesic</span>
                <span className="text-base font-serif font-semibold text-[#5B7553] mt-0.5 block">{selectedFarm.geodesic_area_hectares} Ha</span>
              </div>
              <div>
                <span className="text-[#68625B] block text-[10px] uppercase tracking-wider">Discrepancy (Δ)</span>
                <span className={`text-base font-serif font-semibold mt-0.5 block ${selectedFarm.area_variance_percent > 15 ? 'text-[#9E3A3A]' : 'text-[#5B7553]'}`}>
                  {selectedFarm.area_variance_percent}%
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#EAE3D9]/60 border border-[#CAB4AA]/40 rounded-2xl text-xs font-sans text-[#1B1D1C] space-y-1">
              <span className="font-serif font-semibold text-sm text-[#8B5F4D] block">Engine 1 Evaluation Rationale:</span>
              <p className="text-[#68625B] leading-relaxed">
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
