import React, { useState } from 'react';
import { X, Copy, Check, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { Clause } from '../types';
import { getRiskBadgeColor } from '../utils/riskColors';
import { submitFeedbackApi } from '../services/api';

interface ClauseDetailModalProps {
  clause: Clause | null;
  onClose: () => void;
}

export const ClauseDetailModal: React.FC<ClauseDetailModalProps> = ({ clause, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);

  if (!clause) return null;

  const handleCopyRedline = () => {
    if (clause.suggested_redline) {
      navigator.clipboard.writeText(clause.suggested_redline);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedback = async (rating: string) => {
    try {
      await submitFeedbackApi({
        finding_id: clause.id,
        rating,
        comments: `User marked as ${rating}`
      });
      setFeedbackSent(rating);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{clause.category} CLAUSE ANALYSIS</span>
            <h2 className="text-lg font-bold text-slate-900">{clause.section || 'Extracted Clause Detail'}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Original Clause */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-semibold border-b border-slate-200 pb-2">
                <span>Section: {clause.section || 'General'}</span>
                <span>Page: {clause.page_number}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">Original Clause Text</h3>
              <p className="text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                "{clause.original_text}"
              </p>
            </div>
          </div>

          {/* RIGHT: AI Risk Assessment */}
          <div className="space-y-4">
            {/* Risk Badges */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">RISK TIER</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border mt-0.5 ${getRiskBadgeColor(clause.risk_level)}`}>
                  {clause.risk_level}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">SCORE</span>
                <span className="text-sm font-bold text-slate-900">{clause.risk_score} / 100</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">CONFIDENCE</span>
                <span className="text-sm font-bold text-slate-900">{clause.confidence}%</span>
              </div>
            </div>

            {/* Why this matters */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Why this matters</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/50 border border-amber-200/60 p-3 rounded-lg">
                {clause.explanation || 'Clause carries potential contractual risk requiring attention.'}
              </p>
            </div>

            {/* Business Impact */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Business Impact</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/60 p-3 rounded-lg">
                {clause.business_impact || 'Potential financial exposure or operational restrictions.'}
              </p>
            </div>

            {/* Negotiation Recommendation */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Recommendation</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-purple-50/50 border border-purple-200/60 p-3 rounded-lg font-medium text-purple-900">
                {clause.recommendation || 'Negotiate balanced limits and clear notice periods.'}
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Redline Block */}
        {clause.suggested_redline && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Suggested Redline</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyRedline}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Redline'}</span>
                </button>

                <div className="flex items-center space-x-1 pl-2 border-l border-slate-200">
                  <button
                    onClick={() => handleFeedback('Correct')}
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      feedbackSent === 'Correct' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title="Correct"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFeedback('Incorrect')}
                    className={`p-1.5 rounded-lg border text-xs transition ${
                      feedbackSent === 'Incorrect' ? 'bg-red-50 text-red-600 border-red-300' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title="Incorrect"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl text-xs text-slate-800 font-mono leading-relaxed">
              {clause.suggested_redline}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
