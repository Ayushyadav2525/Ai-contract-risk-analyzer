import React from 'react';
import { Library, ShieldAlert, CheckCircle, Search } from 'lucide-react';

export const ClauseLibrary: React.FC = () => {
  const categories = [
    { title: 'Indemnification', count: 42, description: 'Standard mutual and supplier indemnification provisions.' },
    { title: 'Limitation of Liability', count: 38, description: 'Cap on direct damages and mutual indirect damage waivers.' },
    { title: 'Termination for Convenience', count: 24, description: '30-day notice periods and post-termination transition obligations.' },
    { title: 'Confidentiality & Non-Disclosure', count: 56, description: '3-5 year survival obligations and standard exclusions.' },
    { title: 'Governing Law & Dispute Resolution', count: 31, description: 'Jurisdiction choices and mandatory binding arbitration clauses.' },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Standard Clause Library</h1>
        <p className="text-xs text-slate-500">Repository of pre-approved language and market-standard fallback clauses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.title} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Library className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">{c.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{c.description}</p>
            </div>
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">{c.count} Standard clauses</span>
              <button className="text-purple-600 font-semibold hover:underline">Explore →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
