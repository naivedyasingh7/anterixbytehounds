import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, MapPin, UploadCloud, CheckCircle2, ArrowRight } from 'lucide-react';
import { FarmMapViewer } from '../../components/maps/FarmMapViewer';

export const RegisterFarm: React.FC = () => {
  const navigate = useNavigate();
  const [declaredArea, setDeclaredArea] = useState<number>(2.5);
  const mappedArea = 2.462;
  const variance = Math.abs((declaredArea - mappedArea) / declaredArea * 100).toFixed(2);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/farmer/farms');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Register New Farm Parcel</h1>
        <p className="text-xs text-slate-500">
          Engine 1 Farm Verification: Delineate boundary polygon and link Khasra records.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-emerald-950">Farm Registered & Verified!</h3>
          <p className="text-xs text-emerald-700">
            Geodesic area calculation confirmed {mappedArea} Ha ({variance}% variance). Redirecting to your farms...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card 1: Cadastral Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              1. Land Record & Khasra Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  defaultValue="Patel Khasra 48/2 North Plot"
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Khasra / Survey Number</label>
                <input
                  type="text"
                  defaultValue="48/2"
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Declared Area (Hectares)</label>
                <input
                  type="number"
                  step="0.01"
                  value={declaredArea}
                  onChange={(e) => setDeclaredArea(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  defaultValue="Bhopal"
                  disabled
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sown Crop</label>
                <select className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white">
                  <option>Wheat</option>
                  <option>Soybean</option>
                  <option>Paddy</option>
                  <option>Gram</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Season</label>
                <select className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white">
                  <option>Rabi 2026</option>
                  <option>Kharif 2026</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Satellite Polygon Tool */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  2. Satellite Boundary Delineation (Engine 1)
                </h3>
                <p className="text-xs text-slate-500">Interactive polygon vertices mapped on high-res Sentinel-2 / ESRI canvas</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                Polygon Closed (5 Nodes)
              </span>
            </div>

            <FarmMapViewer height="320px" interactive={true} />

            {/* Area Comparison Widget */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-500">Declared Area:</span> <b className="text-slate-900">{declaredArea} Ha</b>
                <span className="mx-2 text-slate-300">|</span>
                <span className="text-slate-500">PostGIS Geodesic:</span> <b className="text-emerald-800">{mappedArea} Ha</b>
              </div>
              <div className="text-xs font-bold text-emerald-700">
                Variance: {variance}% (Status: Verified)
              </div>
            </div>
          </div>

          {/* Card 3: Document Upload */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              3. Upload Land & Cultivation Documents
            </h3>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 hover:border-emerald-500 transition">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-emerald-600 cursor-pointer">Click to upload Khasra document</span> or drag & drop
              </div>
              <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB (Bhopal Land Record Extract)</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/farmer/farms')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              Submit & Verify Farm Boundary <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}
    </div>
  );
};
