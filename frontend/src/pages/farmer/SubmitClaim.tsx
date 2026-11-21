import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck2, AlertCircle, UploadCloud, CheckCircle2 } from 'lucide-react';
import { MOCK_FARMS_DATA } from '../../services/mockData';

export const SubmitClaim: React.FC = () => {
  const navigate = useNavigate();
  const farm = MOCK_FARMS_DATA[0];
  const [lossCause, setLossCause] = useState("Drought & Prolonged Dry Spell");
  const [lossPct, setLossPct] = useState(65);
  const claimedAmount = Math.round(175000 * (lossPct / 100));
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/farmer/track-claim');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Submit Crop Loss Claim</h1>
        <p className="text-xs text-slate-500">
          File an insurance claim with photographic evidence and cause of loss for satellite verification.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-emerald-950">Claim CLM001 Filed Successfully!</h3>
          <p className="text-xs text-emerald-700">
            Assigned to Insurance Officer Sharma for 3-engine verification. Redirecting to tracking...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Farm & Policy Selection */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Selected Parcel</span>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">{farm.farm_name}</span>
              <span className="text-emerald-700 font-semibold">{farm.current_crop} ({farm.season})</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Policy No: <b>POL-PMFBY-BHP-2026-88</b> · Sum Insured: ₹1,75,000
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cause of Crop Damage</label>
              <select
                value={lossCause}
                onChange={(e) => setLossCause(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option>Drought & Prolonged Dry Spell</option>
                <option>Unseasonal Excessive Rain & Inundation</option>
                <option>Pest Blight & False Smut</option>
                <option>Hailstorm Damage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Damage Event</label>
              <input
                type="date"
                defaultValue="2026-11-05"
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          {/* Loss Percentage Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Estimated Crop Loss Percentage</label>
              <span className="text-sm font-bold text-emerald-700">{lossPct}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={lossPct}
              onChange={(e) => setLossPct(parseInt(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs flex justify-between items-center">
              <span className="text-slate-600">Calculated Claimed Compensation:</span>
              <span className="text-base font-bold text-emerald-800">₹{claimedAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Geotagged Field Photos Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Geotagged Field Photos</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center space-y-1 hover:border-emerald-500 transition">
              <UploadCloud className="w-7 h-7 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-emerald-600 cursor-pointer">Upload ground inspection photos</span>
              </p>
              <p className="text-[10px] text-slate-400">Photos will be verified against GPS coordinates of Khasra 48/2</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/farmer/dashboard')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
            >
              Submit Claim for Verification
            </button>
          </div>

        </form>
      )}
    </div>
  );
};
