import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

interface Stage {
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
}

interface ProgressModalProps {
  isOpen: boolean;
  stages: Stage[];
  progressPercent: number;
}

export const AnalysisProgressModal: React.FC<ProgressModalProps> = ({ isOpen, stages, progressPercent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <h3 className="text-base font-bold text-slate-900 mb-1">Analyzing contract</h3>
        <p className="text-xs text-slate-500 mb-4">Processing contract structure, risk playbooks, and LLM analysis.</p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stage List */}
        <div className="space-y-3">
          {stages.map((stage, idx) => (
            <div key={idx} className="flex items-center space-x-3 text-xs">
              {stage.status === 'completed' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
              {stage.status === 'in_progress' && (
                <Loader2 className="w-4 h-4 text-purple-600 animate-spin shrink-0" />
              )}
              {stage.status === 'pending' && (
                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span
                className={`font-medium ${
                  stage.status === 'completed'
                    ? 'text-slate-800'
                    : stage.status === 'in_progress'
                    ? 'text-purple-700 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
