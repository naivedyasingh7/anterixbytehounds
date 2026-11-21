import React, { useState } from 'react';
import { History, Upload, CheckCircle2, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { StatusBadge } from '../../../components/common/StatusBadge';

export const ProcessAuditView: React.FC = () => {
  const [batchFileUploaded, setBatchFileUploaded] = useState(false);

  const sampleBatchResults = [
    { claim_id: "CLM-AUD-01", farmer: "Rajesh Patel", days: 7, status: "On Time", anomalies: "None" },
    { claim_id: "CLM-AUD-02", farmer: "Sunita Bai", days: 20, status: "On Time", anomalies: "Minor surveyor delay" },
    { claim_id: "CLM-AUD-03", farmer: "Mohan Verma", days: 42, status: "Critical Delay", anomalies: "Exceeded 21d SLA · Missing Khasra & Sowing Cert" },
    { claim_id: "CLM-AUD-04", farmer: "Kamal Kishore", days: 28, status: "Delayed", anomalies: "Exceeded 21d SLA · Missing Sowing Cert" },
    { claim_id: "CLM-AUD-05", farmer: "Deepak Rathore", days: 7, status: "On Time", anomalies: "None" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Verification Engine 3
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Insurance Process & Timeline SLA Audit</h1>
          <p className="text-xs text-slate-500">
            Ingests claim lifecycle timestamps to identify institutional bottlenecks, regulatory SLA breaches, and missing records.
          </p>
        </div>

        <label className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-1.5 self-start">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Audit CSV / Excel</span>
          <input 
            type="file" 
            accept=".csv,.xlsx" 
            onChange={() => setBatchFileUploaded(true)} 
            className="hidden" 
          />
        </label>
      </div>

      {batchFileUploaded && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span><b>Batch Analysis Complete:</b> Ingested 5 records. Detected 2 SLA breaches and missing mandatory records.</span>
        </div>
      )}

      {/* Batch Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-amber-600" />
          Claim Lifecycle Audit Batch Stream
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-3 px-3">Claim ID</th>
                <th className="py-3 px-3">Farmer</th>
                <th className="py-3 px-3">Days Elapsed</th>
                <th className="py-3 px-3">SLA Status</th>
                <th className="py-3 px-3">Detected Audit Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sampleBatchResults.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{row.claim_id}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{row.farmer}</td>
                  <td className="py-3 px-3 font-bold">{row.days} Days</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={row.status} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    {row.anomalies === "None" ? (
                      <span className="text-emerald-700 font-medium">No Anomalies</span>
                    ) : (
                      <span className="text-rose-700 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        {row.anomalies}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
