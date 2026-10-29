import React, { useState } from 'react';
import { Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';

interface RedlineProps {
  originalText: string;
  suggestedText: string;
  category: string;
}

export const RedlineViewer: React.FC<RedlineProps> = ({ originalText, suggestedText, category }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">{category} Redline Comparison</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Redline'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="p-4 bg-red-50/30 border border-red-200/60 rounded-xl">
          <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block mb-2">ORIGINAL TEXT</span>
          <p className="text-xs text-slate-800 font-mono leading-relaxed">{originalText}</p>
        </div>

        {/* Suggested */}
        <div className="p-4 bg-emerald-50/30 border border-emerald-200/60 rounded-xl">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-2">SUGGESTED REDLINE</span>
          <p className="text-xs text-slate-800 font-mono leading-relaxed">{suggestedText}</p>
        </div>
      </div>
    </div>
  );
};
