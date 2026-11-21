import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_FARMS_DATA } from '../../services/mockData';
import { FarmMapViewer } from '../../components/maps/FarmMapViewer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PlusCircle, MapPin, Layers, FileText } from 'lucide-react';

export const MyFarms: React.FC = () => {
  const farm = MOCK_FARMS_DATA[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Registered Farms</h1>
          <p className="text-xs text-slate-500">Manage your land parcels, cadastral boundaries, and crop history</p>
        </div>
        <Link
          to="/farmer/register-farm"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          Register New Farm
        </Link>
      </div>

      {/* Farm Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{farm.farm_name}</h2>
              <StatusBadge status={farm.verification_status} />
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Khasra No: <b>{farm.khasra_number}</b> · {farm.village}, {farm.district}, MP
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Current Cultivation</span>
            <div className="text-sm font-bold text-emerald-800">{farm.current_crop} ({farm.season})</div>
          </div>
        </div>

        {/* Satellite Map with PostGIS boundary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" /> Delineated Field Boundary (Geodesic Polygon)
            </span>
            <span className="text-slate-400">CRS: EPSG:4326 (WGS 84)</span>
          </div>
          <FarmMapViewer 
            coordinates={farm.boundary_geojson.coordinates}
            farmName={farm.farm_name}
            khasra={farm.khasra_number}
            height="300px"
          />
        </div>

        {/* Cadastral Area Verification Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-[11px] text-slate-400 block">Declared Acreage</span>
            <span className="text-sm font-bold text-slate-900">{farm.declared_area_hectares} Ha</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Satellite Mapped</span>
            <span className="text-sm font-bold text-emerald-700">{farm.geodesic_area_hectares} Ha</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Variance</span>
            <span className="text-sm font-bold text-emerald-600">{farm.area_variance_percent}% (Match)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Cadastral Record</span>
            <span className="text-sm font-bold text-slate-900">MP Bhulekh Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
