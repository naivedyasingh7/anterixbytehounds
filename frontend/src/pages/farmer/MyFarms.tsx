import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_FARMS_DATA } from '../../services/mockData';
import { FarmMapViewer } from '../../components/maps/FarmMapViewer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PlusCircle, MapPin, Layers } from 'lucide-react';

export const MyFarms: React.FC = () => {
  const farm = MOCK_FARMS_DATA && MOCK_FARMS_DATA.length > 0 ? MOCK_FARMS_DATA[0] : null;

  if (!farm) {
    return (
      <div className="p-8 text-center text-[#68625B] font-sans">
        No farm records found.
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-normal text-[#1B1D1C]">My Registered Farms</h1>
          <p className="text-xs sm:text-sm text-[#68625B] mt-1 font-sans">
            Manage your land parcels, cadastral boundaries, and historical crop rotations.
          </p>
        </div>
        <Link
          to="/farmer/register-farm"
          className="px-6 py-2.5 bg-[#8B5F4D] hover:bg-[#74503F] text-[#FBF9F5] text-xs sm:text-sm font-sans font-medium rounded-full shadow-sm transition flex items-center gap-2 self-start active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Farm</span>
        </Link>
      </div>

      {/* Farm Card in Serein Style */}
      <div className="bg-[#F5EFE6] rounded-3xl border border-[#EAE3D9] p-8 shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#EAE3D9]">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-serif font-normal text-[#1B1D1C]">{farm.farm_name}</h2>
              <StatusBadge status={farm.verification_status} />
            </div>
            <p className="text-xs sm:text-sm text-[#68625B] flex items-center gap-1.5 mt-1 font-sans">
              <MapPin className="w-3.5 h-3.5 text-[#8B5F4D]" />
              Khasra No: <span className="font-semibold text-[#1B1D1C]">{farm.khasra_number}</span> · {farm.village}, {farm.district}, Madhya Pradesh
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-xs font-sans text-[#68625B] uppercase tracking-wider block">Current Cultivation</span>
            <div className="text-base font-serif font-semibold text-[#1B1D1C] mt-0.5">
              {farm.current_crop} ({farm.season})
            </div>
          </div>
        </div>

        {/* Satellite Map with PostGIS boundary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="font-medium text-[#1B1D1C] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8B5F4D]" /> Delineated Field Boundary (Geodesic Polygon)
            </span>
            <span className="text-[#68625B] font-mono">CRS: EPSG:4326 (WGS 84)</span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#EAE3D9]">
            <FarmMapViewer 
              coordinates={farm.boundary_geojson.coordinates}
              farmName={farm.farm_name}
              khasra={farm.khasra_number}
              height="320px"
            />
          </div>
        </div>

        {/* Cadastral Area Verification Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/40">
          <div>
            <span className="text-[11px] font-sans text-[#68625B] uppercase tracking-wider block">Declared Acreage</span>
            <span className="text-lg font-serif font-semibold text-[#1B1D1C]">{farm.declared_area_hectares} Ha</span>
          </div>
          <div>
            <span className="text-[11px] font-sans text-[#68625B] uppercase tracking-wider block">Satellite Mapped</span>
            <span className="text-lg font-serif font-semibold text-[#5B7553]">{farm.geodesic_area_hectares} Ha</span>
          </div>
          <div>
            <span className="text-[11px] font-sans text-[#68625B] uppercase tracking-wider block">Area Variance</span>
            <span className="text-lg font-serif font-semibold text-[#5B7553]">{farm.area_variance_percent}% (Valid)</span>
          </div>
          <div>
            <span className="text-[11px] font-sans text-[#68625B] uppercase tracking-wider block">Verification Engine</span>
            <span className="text-lg font-serif font-semibold text-[#8B5F4D]">Engine 1 Cadastre</span>
          </div>
        </div>
      </div>
    </div>
  );
};
