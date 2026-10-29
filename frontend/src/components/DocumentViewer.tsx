import React, { useState } from 'react';
import { Clause } from '../types';
import { getRiskBadgeColor } from '../utils/riskColors';
import { FileText, AlertTriangle } from 'lucide-react';

interface DocumentViewerProps {
  contractTitle: string;
  clauses: Clause[];
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ contractTitle, clauses }) => {
  const [selectedClauseId, setSelectedClauseId] = useState<number | null>(clauses[0]?.id || null);

  const selectedClause = clauses.find((c) => c.id === selectedClauseId) || clauses[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[600px]">
      {/* LEFT: Section Navigation (3 cols) */}
      <div className="lg:col-span-3 border-r border-slate-200 bg-slate-50/50 p-4 overflow-y-auto">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sections & Pages</h3>
        <div className="space-y-1.5">
          {clauses.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClauseId(c.id)}
              className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                selectedClauseId === c.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="truncate">
                <span className="font-semibold block truncate">{c.section || c.category}</span>
                <span className={`text-[10px] ${selectedClauseId === c.id ? 'text-purple-200' : 'text-slate-400'}`}>
                  Page {c.page_number}
                </span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                selectedClauseId === c.id ? 'bg-purple-700 text-white' : getRiskBadgeColor(c.risk_level)
              }`}>
                {c.risk_level}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* CENTER: Document Extracted Text (6 cols) */}
      <div className="lg:col-span-6 p-6 overflow-y-auto font-serif text-slate-800 leading-relaxed text-sm">
        <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
          <h2 className="font-sans text-base font-bold text-slate-900">{contractTitle}</h2>
          <span className="text-xs text-slate-400 font-sans">Document Preview</span>
        </div>

        {selectedClause ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-200/80">
              <span className="font-sans text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">
                Highlighted Provision: {selectedClause.section || selectedClause.category} (Page {selectedClause.page_number})
              </span>
              <p className="font-mono text-xs text-slate-900 leading-relaxed bg-white p-3 rounded-lg border border-purple-100 shadow-2xs">
                "{selectedClause.original_text}"
              </p>
            </div>

            <div className="pt-2 text-xs text-slate-500 font-sans">
              <p className="font-bold text-slate-700 mb-1">Extracted Clause Metadata:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Category: {selectedClause.category}</li>
                <li>Detected Risk Level: {selectedClause.risk_level}</li>
                <li>Engine Confidence: {selectedClause.confidence}%</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">Select a section to read extracted contract content.</p>
        )}
      </div>

      {/* RIGHT: Risk Findings Panel (3 cols) */}
      <div className="lg:col-span-3 border-l border-slate-200 bg-slate-50/30 p-4 overflow-y-auto">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Risk Findings</h3>

        {selectedClause ? (
          <div className="space-y-3">
            <div className={`p-3 rounded-xl border ${getRiskBadgeColor(selectedClause.risk_level)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs">{selectedClause.risk_level} RISK</span>
                <span className="font-bold text-xs">{selectedClause.risk_score}/100</span>
              </div>
              <p className="text-[11px] leading-snug">{selectedClause.explanation || 'Risky terms identified in clause.'}</p>
            </div>

            {selectedClause.recommendation && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-1">Recommendation</span>
                <p className="text-xs text-slate-700">{selectedClause.recommendation}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400">Select a finding.</p>
        )}
      </div>
    </div>
  );
};
