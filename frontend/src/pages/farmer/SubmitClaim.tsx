import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck2, AlertCircle, UploadCloud, CheckCircle2, ArrowRight } from 'lucide-react';
import { MOCK_FARMS_DATA } from '../../services/mockData';
import { submitClaim } from '../../services/api';

export const SubmitClaim: React.FC = () => {
  const navigate = useNavigate();
  const farm = MOCK_FARMS_DATA[0];
  const [lossCause, setLossCause] = useState("Drought & Prolonged Dry Spell");
  const [lossPct, setLossPct] = useState(65);
  const claimedAmount = Math.round(175000 * (lossPct / 100));
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdClaimId, setCreatedClaimId] = useState("CLM001");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitClaim({
        farm_id: farm.id,
        policy_id: "POL-PMFBY-BHP-2026-88",
        loss_cause: lossCause,
        claimed_loss_percentage: lossPct,
        claimed_amount_inr: claimedAmount,
        incident_date: "2026-11-05"
      });
      if (res?.claim_number) {
        setCreatedClaimId(res.claim_number);
      }
    } catch (err) {
      console.warn('Backend offline or simulated response', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/farmer/track-claim');
      }, 1500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <div>
        <h1 className="text-3xl font-serif font-normal text-[#1B1D1C]">Submit Crop Loss Claim</h1>
        <p className="text-xs sm:text-sm text-[#68625B] mt-1 font-sans">
          File an evidence-backed claim under your active insurance policy for automated multi-engine verification.
        </p>
      </div>

      {submitted ? (
        <div className="bg-[#EBF2EA] border border-[#5B7553]/30 rounded-3xl p-10 text-center space-y-4 shadow-[0_4px_24px_rgba(27,29,28,0.03)]">
          <CheckCircle2 className="w-12 h-12 text-[#5B7553] mx-auto" />
          <h3 className="text-2xl font-serif font-normal text-[#1B1D1C]">Claim {createdClaimId} Filed Successfully!</h3>
          <p className="text-xs sm:text-sm text-[#5B7553] font-sans">
            Assigned to Insurance Officer Sharma for 3-engine verification. Redirecting to tracking...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#F5EFE6] p-8 sm:p-10 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] space-y-6">
          
          {/* Farm & Policy Selection */}
          <div className="p-5 bg-[#EAE3D9]/60 rounded-2xl border border-[#CAB4AA]/40 space-y-2">
            <span className="text-[10px] font-sans font-medium text-[#8B5F4D] uppercase tracking-wider block">Selected Parcel</span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
              <span className="font-serif font-semibold text-[#1B1D1C]">{farm.farm_name}</span>
              <span className="text-[#5B7553] font-sans font-medium">{farm.current_crop} ({farm.season})</span>
            </div>
            <div className="text-xs text-[#68625B] font-sans">
              Policy No: <span className="font-mono text-[#1B1D1C]">POL-PMFBY-BHP-2026-88</span> · Sum Insured: ₹1,75,000
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-sans font-medium text-[#68625B] mb-1.5 uppercase tracking-wider">Cause of Crop Damage</label>
              <select
                value={lossCause}
                onChange={(e) => setLossCause(e.target.value)}
                className="w-full text-xs font-sans px-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]"
              >
                <option>Drought & Prolonged Dry Spell</option>
                <option>Unseasonal Excessive Rain & Inundation</option>
                <option>Pest Blight & False Smut</option>
                <option>Hailstorm Damage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-medium text-[#68625B] mb-1.5 uppercase tracking-wider">Date of Damage Event</label>
              <input
                type="date"
                defaultValue="2026-11-05"
                required
                className="w-full text-xs font-sans px-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]"
              />
            </div>
          </div>

          {/* Damage estimate slider */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-sans font-medium text-[#68625B] uppercase tracking-wider">
                Estimated Crop Loss Percentage: <span className="font-bold text-[#1B1D1C]">{lossPct}%</span>
              </label>
              <span className="text-xs font-serif font-semibold text-[#8B5F4D]">
                Claimed Payout: ₹{claimedAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={lossPct}
              onChange={(e) => setLossPct(parseInt(e.target.value))}
              className="w-full accent-[#8B5F4D] cursor-pointer"
            />
          </div>

          {/* Photo upload */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-sans font-medium text-[#68625B] uppercase tracking-wider">
              Field Damage Photographs (Geotagged Evidence)
            </label>
            <div className="border-2 border-dashed border-[#CAB4AA] rounded-2xl p-6 text-center space-y-2 hover:border-[#8B5F4D] transition bg-[#FBF9F5]">
              <UploadCloud className="w-8 h-8 text-[#8B5F4D] mx-auto" />
              <div className="text-xs font-sans text-[#1B1D1C]">
                <span className="font-semibold text-[#8B5F4D] cursor-pointer">Upload ground inspection photos</span>
              </div>
              <p className="text-[11px] font-sans text-[#68625B]">JPG with EXIF metadata (GPS coords will be cross-checked with Sentinel-2 orbit)</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE3D9]">
            <button
              type="button"
              onClick={() => navigate('/farmer')}
              className="px-6 py-2.5 rounded-full border border-[#CAB4AA] text-xs font-sans font-medium text-[#68625B] hover:bg-[#EAE3D9] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-2.5 rounded-full bg-[#8B5F4D] hover:bg-[#74503F] disabled:opacity-50 text-[#FBF9F5] text-xs font-sans font-medium shadow-sm transition flex items-center gap-2 active:scale-95"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Claim for Verification'}</span>
            </button>
          </div>

        </form>
      )}
    </div>
  );
};
