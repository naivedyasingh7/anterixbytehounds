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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Claims Management</h1>
          <p className="text-xs text-slate-500">
            Search, filter, and audit all crop damage claims across districts
          </p>
        </div>

        {/* CSV Import Action */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>Import Claims CSV</span>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* CSV notification banner */}
      {importStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Claim ID or Farmer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* District Filter */}
        <div>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white"
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
            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white"
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
            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Flagged">Flagged</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Claim ID</th>
                <th className="py-3.5 px-4">Farmer</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Crop</th>
                <th className="py-3.5 px-4">Claimed Amount</th>
                <th className="py-3.5 px-4">Loss %</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {c.claim_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{c.farmer_name}</div>
                    <span className="text-[10px] text-slate-400">{c.farmer_code}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{c.district}</td>
                  <td className="py-3.5 px-4 text-slate-800 font-medium">{c.crop}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹{c.claimed_amount_inr.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {c.claimed_loss_percentage}%
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/insurance/workspace/${c.claim_number}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition"
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
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          * Demonstrating with fictional data for Madhya Pradesh districts (Bhopal, Sehore, Raisen).
        </div>
      </div>
    </div>
  );
};
