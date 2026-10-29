import React, { useState, useEffect } from 'react';
import { Download, FileText, BarChart3, CheckCircle } from 'lucide-react';
import { Contract } from '../types';
import { fetchContracts, getReportDownloadUrl } from '../services/api';
import { getRiskBadgeColor } from '../utils/riskColors';

export const RiskReports: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    fetchContracts().then(setContracts).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Executive Risk Reports</h1>
        <p className="text-xs text-slate-500">Download formatted PDF risk summaries and executive negotiation briefs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contracts.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadgeColor(c.risk_tier)}`}>
                  {c.risk_tier} RISK
                </span>
                <span className="text-xs font-bold text-slate-900">{c.risk_score} / 100</span>
              </div>
              <h3 className="font-bold text-xs text-slate-900 mb-1">{c.title}</h3>
              <p className="text-[11px] text-slate-400 mb-4">Generated on {new Date(c.created_at).toLocaleDateString()}</p>
            </div>

            <a
              href={getReportDownloadUrl(c.id)}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2 rounded-lg transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Executive Report</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
