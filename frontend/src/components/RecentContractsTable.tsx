import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { Contract } from '../types';
import { getRiskBadgeColor } from '../utils/riskColors';

interface RecentContractsProps {
  contracts: Contract[];
}

export const RecentContractsTable: React.FC<RecentContractsProps> = ({ contracts }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900">Recent contracts</h2>
        <Link
          to="/contracts"
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Contract name</th>
              <th className="py-2.5 px-3">File type</th>
              <th className="py-2.5 px-3">Risk level</th>
              <th className="py-2.5 px-3 text-right">Risk score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contracts.map((contract) => (
              <tr
                key={contract.id}
                onClick={() => navigate(`/contracts/${contract.id}`)}
                className="hover:bg-slate-50/80 cursor-pointer transition"
              >
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800 hover:text-purple-600 transition truncate max-w-[200px] md:max-w-[280px]">
                      {contract.title}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="uppercase font-semibold text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {contract.file_type}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${getRiskBadgeColor(contract.risk_tier)}`}>
                    {contract.risk_tier}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-bold text-slate-900">
                  {contract.risk_score} <span className="text-slate-400 text-[10px] font-normal">/100</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
