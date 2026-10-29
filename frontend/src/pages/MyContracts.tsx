import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Search, Filter, Trash2, Download, ExternalLink, GitCompare, Plus } from 'lucide-react';
import { Contract } from '../types';
import { fetchContracts, deleteContractApi, getReportDownloadUrl } from '../services/api';
import { getRiskBadgeColor } from '../utils/riskColors';

export const MyContracts: React.FC = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const data = await fetchContracts();
      setContracts(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      try {
        await deleteContractApi(id);
        setContracts(contracts.filter((c) => c.id !== id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filtered = contracts.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || c.risk_tier === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Legal Agreements & Contracts</h1>
          <p className="text-xs text-slate-500">Manage, review, and inspect all analyzed legal agreements.</p>
        </div>

        <Link
          to="/upload"
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Upload contract</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter contracts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        {/* Risk Pills */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400">Risk:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-3 py-1 rounded-md transition ${
                  riskFilter === lvl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contracts Table / Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No contracts found</h3>
          <p className="text-xs text-slate-400 mb-4">Upload your first contract to start identifying contractual risks.</p>
          <Link
            to="/upload"
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition"
          >
            Upload contract
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Contract Title</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Risk Tier</th>
                  <th className="py-3 px-4 text-right">Risk Score</th>
                  <th className="py-3 px-4 text-right">Health Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((contract) => (
                  <tr key={contract.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <Link
                            to={`/contracts/${contract.id}`}
                            className="font-bold text-slate-900 hover:text-purple-600 transition block"
                          >
                            {contract.title}
                          </Link>
                          <span className="text-[10px] text-slate-400">
                            {new Date(contract.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase font-semibold text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        {contract.file_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getRiskBadgeColor(contract.risk_tier)}`}>
                        {contract.risk_tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {contract.risk_score} <span className="text-slate-400 text-[10px] font-normal">/100</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                      {contract.health_score} <span className="text-slate-400 text-[10px] font-normal">/100</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/contracts/${contract.id}`)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="Open Analysis"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <a
                          href={getReportDownloadUrl(contract.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                          title="Download PDF Executive Report"
                        >
                          <Download className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleDelete(contract.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Contract"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
