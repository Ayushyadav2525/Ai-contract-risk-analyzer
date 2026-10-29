import React, { useState, useEffect } from 'react';
import { GitCompare, ArrowRight } from 'lucide-react';
import { Contract } from '../types';
import { fetchContracts, compareContractsApi } from '../services/api';

export const CompareContracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractAId, setContractAId] = useState<number | ''>('');
  const [contractBId, setContractBId] = useState<number | ''>('');
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContracts().then(setContracts).catch(console.error);
  }, []);

  const handleCompare = async () => {
    if (!contractAId || !contractBId) return;
    setLoading(true);
    try {
      const res = await compareContractsApi(Number(contractAId), Number(contractBId));
      setComparisonResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-lg font-bold text-slate-900">Contract Side-by-Side Comparison</h1>
        <p className="text-xs text-slate-500">Compare risk posture, governing terms, and liability limits across two agreements.</p>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-5">
          <label className="text-xs font-semibold text-slate-500 block mb-1">Contract A (Base)</label>
          <select
            value={contractAId}
            onChange={(e) => setContractAId(Number(e.target.value))}
            className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 font-medium focus:outline-none"
          >
            <option value="">Select Contract A...</option>
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.risk_tier} Risk)
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 text-center">
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
            <GitCompare className="w-4 h-4" />
          </div>
        </div>

        <div className="md:col-span-5">
          <label className="text-xs font-semibold text-slate-500 block mb-1">Contract B (Comparison)</label>
          <select
            value={contractBId}
            onChange={(e) => setContractBId(Number(e.target.value))}
            className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-slate-800 font-medium focus:outline-none"
          >
            <option value="">Select Contract B...</option>
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.risk_tier} Risk)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleCompare}
          disabled={!contractAId || !contractBId || loading}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-xs transition disabled:opacity-50"
        >
          {loading ? 'Comparing...' : 'Run Side-by-Side Comparison'}
        </button>
      </div>

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Comparison Matrix</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h3 className="font-bold text-xs text-purple-700">{comparisonResult.contract_a.title}</h3>
              <p className="text-xs text-slate-600">Risk Score: <span className="font-bold text-slate-900">{comparisonResult.contract_a.risk_score}/100</span></p>
              <p className="text-xs text-slate-600">Risk Tier: <span className="font-bold text-red-600">{comparisonResult.contract_a.risk_tier}</span></p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h3 className="font-bold text-xs text-purple-700">{comparisonResult.contract_b.title}</h3>
              <p className="text-xs text-slate-600">Risk Score: <span className="font-bold text-slate-900">{comparisonResult.contract_b.risk_score}/100</span></p>
              <p className="text-xs text-slate-600">Risk Tier: <span className="font-bold text-amber-600">{comparisonResult.contract_b.risk_tier}</span></p>
            </div>
          </div>

          <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl text-xs text-slate-800">
            <span className="font-bold block text-purple-900 mb-1">Key Recommendation:</span>
            {comparisonResult.recommendation}
          </div>
        </div>
      )}
    </div>
  );
};
