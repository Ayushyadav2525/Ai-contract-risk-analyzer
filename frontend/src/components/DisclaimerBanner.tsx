import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-slate-100/80 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-600 flex items-center space-x-2.5 my-4">
      <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
      <p>
        <span className="font-semibold text-slate-700">Legal Disclaimer:</span> ContractAI provides AI-assisted preliminary contract analysis and does not constitute legal advice. Users should consult qualified legal counsel for binding legal decisions.
      </p>
    </div>
  );
};
