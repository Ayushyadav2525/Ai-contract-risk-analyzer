import React from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { NegotiationPriority } from '../types';
import { getRiskBadgeColor } from '../utils/riskColors';

interface ExecutiveSummaryProps {
  summaryText: string;
  priorities: NegotiationPriority[];
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summaryText, priorities }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      {/* Executive Summary Block */}
      <div>
        <h2 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">EXECUTIVE SUMMARY</h2>
        <p className="text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
          "{summaryText}"
        </p>
      </div>

      {/* Top Negotiation Priorities */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">TOP NEGOTIATION PRIORITIES</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priorities.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-purple-300 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {item.rank || idx + 1}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadgeColor(item.risk_level)}`}>
                    {item.risk_level}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-[11px] text-slate-500">{item.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
