import React from 'react';
import { DharaNav } from '../../components/common/DharaNav';
import { FileText, Download, CheckCircle, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

export const HealthReportsPage: React.FC = () => {
  const reports = [
    {
      id: 'REP-2026-001',
      title: 'Kharif 2026 Mid-Season Agronomic Health Certificate',
      date: '2026-11-15',
      crop: 'Wheat (Triticum aestivum)',
      status: 'Audited & Certified',
      statusColor: 'text-[#5B7553] bg-emerald-50 border-emerald-200',
      summary: 'Comprehensive multi-spectral report establishing 0.68 peak NDVI, zero foliar necrosis, and 98.2% cadastral parity.'
    },
    {
      id: 'REP-2026-002',
      title: 'Geodesic Cadastral Land Parcel Dossier (UTM Zone 43N)',
      date: '2026-10-20',
      crop: 'Wheat / Gram Intercrop',
      status: 'Verified',
      statusColor: 'text-[#8B5F4D] bg-[#F5EFE6] border-[#CAB4AA]',
      summary: 'Geodesic boundary validation executed for Khasra 48/2; 2.48 Ha mapped with 0.8% variance against state revenue records.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1D1C] font-sans selection:bg-[#8B5F4D]/25 selection:text-[#1B1D1C]">
      <DharaNav />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-44 sm:pt-48 pb-20 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5EFE6] border border-[#CAB4AA] text-[#68625B] text-xs font-sans font-medium uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-[#8B5F4D]" />
            <span>Certified Agronomic Dossiers</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-[#1B1D1C] tracking-tight leading-tight">
            Agricultural Health Reports
          </h1>
          <p className="text-[#68625B] text-base font-sans font-normal leading-relaxed">
            Certified seasonal crop health dossiers compiled from Sentinel-2 satellite passes, 
            local meteorological logs, and AI disease diagnostics. Downloadable as legal audit-ready PDFs.
          </p>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {reports.map((rep) => (
            <div 
              key={rep.id}
              className="p-8 sm:p-10 rounded-3xl bg-[#F5EFE6] border border-[#EAE3D9] hover:border-[#CAB4AA] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-[0_4px_24px_rgba(27,29,28,0.03)]"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono text-[#8B5F4D] font-semibold">{rep.id}</span>
                  <span className={`text-xs font-sans px-3 py-0.5 rounded-full border ${rep.statusColor}`}>
                    {rep.status}
                  </span>
                  <span className="text-xs text-[#68625B] font-sans flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {rep.date}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#1B1D1C]">
                  {rep.title}
                </h3>
                <div className="text-xs font-sans text-[#68625B]">
                  Crop: {rep.crop} • Parcel: Khasra 48/2 (Bhopal)
                </div>

                <p className="text-sm font-sans text-[#68625B] max-w-3xl leading-relaxed pt-1">
                  {rep.summary}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <a
                  href="/api/v1/reports/CLM001/pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#1B1D1C] text-[#FBF9F5] hover:bg-[#333634] font-sans font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Dossier</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Clean Workspace Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 py-8 border-t border-[#EAE3D9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#68625B]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-[#1B1D1C]">DHARA FARMER</span>
          <span>·</span>
          <span>Certified Report Export Engine</span>
        </div>
        <div className="text-xs font-mono text-[#8B5F4D]">
          <span>© 2026 DHARA</span>
        </div>
      </footer>
    </div>
  );
};
export default HealthReportsPage;
