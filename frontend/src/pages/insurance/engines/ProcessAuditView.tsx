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
    <div className="space-y-8 font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#8B5F4D] bg-[#EAE3D9] px-3 py-1 rounded-full border border-[#CAB4AA]">
            Verification Engine 3
          </span>
          <h1 className="text-3xl font-serif font-normal text-[#1B1D1C] mt-2">Insurance Process & Timeline SLA Audit</h1>
          <p className="text-xs sm:text-sm text-[#68625B] mt-1 font-sans">
            Ingests claim lifecycle timestamps to identify institutional bottlenecks, regulatory SLA breaches, and missing records.
          </p>
        </div>

        <label className="cursor-pointer px-6 py-2.5 bg-[#8B5F4D] hover:bg-[#74503F] text-[#FBF9F5] text-xs sm:text-sm font-sans font-medium rounded-full shadow-sm transition flex items-center gap-2 self-start active:scale-95">
          <Upload className="w-4 h-4" />
          <span>Upload Audit CSV</span>
          <input 
            type="file" 
            accept=".csv,.xlsx" 
            onChange={() => setBatchFileUploaded(true)} 
            className="hidden" 
          />
        </label>
      </div>

      {batchFileUploaded && (
        <div className="p-4 bg-[#EBF2EA] border border-[#5B7553]/30 rounded-2xl text-xs font-sans text-[#5B7553] flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#5B7553] shrink-0" />
          <span><b>Batch Analysis Complete:</b> Ingested 5 records. Detected 2 statutory SLA breaches and missing mandatory records.</span>
        </div>
      )}

      {/* Batch Audit Table */}
      <div className="bg-[#F5EFE6] rounded-3xl border border-[#EAE3D9] shadow-[0_2px_12px_rgba(27,29,28,0.02)] overflow-hidden space-y-4 p-6 sm:p-8">
        <h3 className="text-xl font-serif font-normal text-[#1B1D1C] flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#8B5F4D]" />
          <span>Claim Lifecycle Audit Batch Stream</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#EAE3D9]/70 border-b border-[#EAE3D9] text-[#68625B] uppercase tracking-wider font-medium">
              <tr>
                <th className="py-4 px-4">Claim ID</th>
                <th className="py-4 px-4">Farmer</th>
                <th className="py-4 px-4">Days Elapsed</th>
                <th className="py-4 px-4">SLA Status</th>
                <th className="py-4 px-4">Detected Audit Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D9]">
              {sampleBatchResults.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#EAE3D9]/40 transition">
                  <td className="py-4 px-4 font-mono font-semibold text-[#1B1D1C]">{row.claim_id}</td>
                  <td className="py-4 px-4 font-serif font-semibold text-sm text-[#1B1D1C]">{row.farmer}</td>
                  <td className="py-4 px-4 font-sans font-medium text-[#1B1D1C]">{row.days} Days</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={row.status} size="sm" />
                  </td>
                  <td className="py-4 px-4">
                    {row.anomalies === "None" ? (
                      <span className="text-[#5B7553] font-medium">No Anomalies</span>
                    ) : (
                      <span className="text-[#9E3A3A] font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-[#9E3A3A] shrink-0" />
                        <span>{row.anomalies}</span>
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
