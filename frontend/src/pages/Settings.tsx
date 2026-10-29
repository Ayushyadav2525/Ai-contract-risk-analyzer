import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Key, User, Shield } from 'lucide-react';

export const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      <div>
        <h1 className="text-lg font-bold text-slate-900">System Settings</h1>
        <p className="text-xs text-slate-500">Configure AI models, API keys, and workspace preferences.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-1">OpenAI API Configuration</h2>
          <p className="text-xs text-slate-400 mb-4">
            If left blank, ContractAI runs in <span className="font-semibold text-purple-600">Deterministic Offline Rule Engine Mode</span> with complete risk detection.
          </p>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">OpenAI API Key</label>
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Selected Model: <strong className="text-slate-800">gpt-4o-mini</strong></span>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{saved ? 'Saved!' : 'Save Configuration'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-sm font-bold text-slate-900 mb-1">User Account</h2>
          <p className="text-xs text-slate-400">Logged in as <strong className="text-slate-700">ayush@contractai.com</strong> (Administrator)</p>
        </div>
      </div>
    </div>
  );
};
