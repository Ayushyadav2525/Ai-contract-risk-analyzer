import React, { useState } from 'react';
import { Clause } from '../types';
import { getRiskBadgeColor } from '../utils/riskColors';
import { Filter } from 'lucide-react';

interface ClauseMatrixProps {
  clauses: Clause[];
  onSelectClause: (clause: Clause) => void;
}

export const ClauseMatrixTable: React.FC<ClauseMatrixProps> = ({ clauses, onSelectClause }) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredClauses = clauses.filter((c) => {
    const matchesRisk = filter === 'ALL' || c.risk_level === filter;
    const matchesCat = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesRisk && matchesCat;
  });

  const categories = Array.from(new Set(clauses.map((c) => c.category)));

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Clause risk matrix</h2>
          <p className="text-xs text-slate-400">Detailed risk breakdown of extracted contractual provisions</p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          {/* Risk Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-3 py-1 rounded-md transition ${
                  filter === lvl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Section / Page</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Original Clause</th>
              <th className="py-2.5 px-3">Risk Level</th>
              <th className="py-2.5 px-3 text-right">Score</th>
              <th className="py-2.5 px-3 text-right">Confidence</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredClauses.map((clause) => (
              <tr
                key={clause.id}
                onClick={() => onSelectClause(clause)}
                className="hover:bg-slate-50/80 cursor-pointer transition"
              >
                <td className="py-3 px-3">
                  <span className="font-semibold text-slate-800">{clause.section || 'Clause'}</span>
                  <span className="text-[10px] text-slate-400 block">Page {clause.page_number}</span>
                </td>
                <td className="py-3 px-3">
                  <span className="font-medium text-slate-700">{clause.category}</span>
                </td>
                <td className="py-3 px-3 max-w-xs">
                  <p className="text-slate-600 truncate">{clause.original_text}</p>
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadgeColor(clause.risk_level)}`}>
                    {clause.risk_level}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-bold text-slate-900">
                  {clause.risk_score}
                </td>
                <td className="py-3 px-3 text-right font-medium text-slate-500">
                  {clause.confidence}%
                </td>
                <td className="py-3 px-3 text-center">
                  <button className="text-purple-600 hover:text-purple-700 font-semibold text-[11px]">
                    Inspect →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
