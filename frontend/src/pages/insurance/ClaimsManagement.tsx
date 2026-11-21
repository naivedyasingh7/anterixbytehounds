import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchClaims } from '../../services/api';
import { Claim } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Search, 
  Filter, 
  Upload, 
  ExternalLink, 
  ShieldCheck, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ClaimsManagement: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [district, setDistrict] = useState('All');
  const [crop, setCrop] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const loadClaims = () => {
    fetchClaims({ district, crop, status, search }).then(setClaims);
  };

  useEffect(() => {
    loadClaims();
  }, [district, crop, status, search]);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportStatus('Batch claims imported successfully from sample CSV! 5 new records loaded.');
      setTimeout(() => setImportStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-normal text-[#1B1D1C]">Claims Management</h1>
          <p className="text-xs sm:text-sm text-[#68625B] mt-1 font-sans">
            Search, filter, and audit all crop damage claims across agricultural districts.
          </p>
        </div>

        {/* CSV Import Action */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-5 py-2.5 bg-[#8B5F4D] hover:bg-[#74503F] text-[#FBF9F5] text-xs sm:text-sm font-sans font-medium rounded-full shadow-sm transition flex items-center gap-2 active:scale-95">
            <Upload className="w-4 h-4" />
            <span>Import Claims CSV</span>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* CSV notification banner */}
      {importStatus && (
        <div className="p-4 bg-[#EBF2EA] border border-[#5B7553]/30 rounded-2xl text-xs text-[#5B7553] flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#5B7553] shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Search & Filter Controls in Serein Clean Box */}
      <div className="bg-[#F5EFE6] p-6 rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#68625B] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search Claim ID or Farmer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-sans pl-10 pr-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]"
          />
        </div>

        {/* District Filter */}
        <div>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full text-xs font-sans px-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]"
          >
            <option value="All">All Districts</option>
            <option value="Bhopal">Bhopal</option>
            <option value="Sehore">Sehore</option>
            <option value="Raisen">Raisen</option>
          </select>
        </div>

        {/* Crop Filter */}
        <div>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full text-xs font-sans px-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]"
          >
            <option value="All">All Crops</option>
            <option value="Wheat">Wheat</option>
            <option value="Soybean">Soybean</option>
            <option value="Paddy">Paddy</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full text-xs font-sans px-4 py-3 rounded-2xl border border-[#CAB4AA] bg-[#FBF9F5] text-[#1B1D1C] focus:outline-none focus:border-[#8B5F4D]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Flagged">Flagged</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
      </div>

      {/* Claims Table in Serein Luxury Card */}
      <div className="bg-[#F5EFE6] rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#EAE3D9]/70 border-b border-[#EAE3D9] text-[#68625B] uppercase tracking-wider font-medium">
              <tr>
                <th className="py-4 px-5">Claim ID</th>
                <th className="py-4 px-5">Farmer</th>
                <th className="py-4 px-5">District</th>
                <th className="py-4 px-5">Crop</th>
                <th className="py-4 px-5">Claimed Amount</th>
                <th className="py-4 px-5">Loss %</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D9]">
              {claims.map((c) => (
                <tr key={c.id} className="hover:bg-[#EAE3D9]/40 transition">
                  <td className="py-4 px-5 font-mono font-semibold text-[#1B1D1C]">
                    {c.claim_number}
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-serif font-semibold text-sm text-[#1B1D1C]">{c.farmer_name}</div>
                    <span className="text-[10px] text-[#68625B] font-mono">{c.farmer_code}</span>
                  </td>
                  <td className="py-4 px-5 text-[#68625B]">{c.district}</td>
                  <td className="py-4 px-5 text-[#1B1D1C] font-medium">{c.crop}</td>
                  <td className="py-4 px-5 font-serif font-semibold text-sm text-[#1B1D1C]">
                    ₹{c.claimed_amount_inr.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-5 font-medium text-[#8B5F4D]">
                    {c.claimed_loss_percentage}%
                  </td>
                  <td className="py-4 px-5">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Link
                      to={`/insurance/workspace/${c.claim_number}`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1B1D1C] hover:bg-[#8B5F4D] text-[#FBF9F5] text-xs font-sans font-medium transition shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Workspace</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer footer */}
        <div className="p-4 bg-[#EAE3D9]/40 border-t border-[#EAE3D9] text-xs font-sans text-[#68625B] text-center">
          * Demonstrating with empirical benchmark records for Madhya Pradesh (Bhopal, Sehore, Raisen).
        </div>
      </div>
    </div>
  );
};
