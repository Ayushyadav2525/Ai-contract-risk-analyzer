import React, { useState, useEffect } from 'react';
import { BookOpen, Check, Plus, Shield } from 'lucide-react';
import { Playbook } from '../types';
import { fetchPlaybooks } from '../services/api';

export const Playbooks: React.FC = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);

  useEffect(() => {
    fetchPlaybooks().then(setPlaybooks).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Contract Playbooks</h1>
          <p className="text-xs text-slate-500">Configure corporate risk policies, clause limits, and fallback positions.</p>
        </div>
        <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition">
          <Plus className="w-4 h-4" />
          <span>New Playbook</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playbooks.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                  {p.category}
                </span>
                {p.is_default === 'true' && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Default
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">{p.name}</h3>
              <p className="text-xs text-slate-500 mb-4">{p.description || 'Corporate standards for contract review.'}</p>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{p.rules_count} Rules active</span>
              <button className="text-purple-600 font-semibold hover:underline">Edit Policy →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
