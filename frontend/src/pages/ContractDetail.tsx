import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, Shield } from 'lucide-react';
import { ContractDetailResponse, Clause } from '../types';
import { fetchContractById, getReportDownloadUrl } from '../services/api';
import { getRiskBadgeColor } from '../utils/riskColors';
import { ExecutiveSummary } from '../components/ExecutiveSummary';
import { ClauseMatrixTable } from '../components/ClauseMatrixTable';
import { ClauseDetailModal } from '../components/ClauseDetailModal';
import { RedlineViewer } from '../components/RedlineViewer';
import { DocumentViewer } from '../components/DocumentViewer';

export const ContractDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ContractDetailResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'MATRIX' | 'REDLINES' | 'DOCUMENT'>('SUMMARY');
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadContract(parseInt(id, 10));
    }
  }, [id]);

  const loadContract = async (contractId: number) => {
    try {
      const res = await fetchContractById(contractId);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <p className="text-xs font-semibold">Loading contract risk analysis...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-sm font-semibold text-slate-700">Contract not found.</p>
        <Link to="/contracts" className="text-xs text-purple-600 hover:underline mt-2 block">
          Return to Legal Agreements
        </Link>
      </div>
    );
  }

  // Support both wrapped response { contract, analysis, clauses, metadata } and flat object fallback
  const contract = data.contract || (data as any);
  const analysis = data.analysis || {
    executive_summary: 'Analysis completed successfully.',
    negotiation_priorities: []
  };
  const clauses: Clause[] = data.clauses || [];
  const metadata = data.metadata || (data as any).metadata_info || {};

  const contractTitle = contract?.title || 'Contract Analysis';
  const riskTier = contract?.risk_tier || 'LOW';
  const riskScore = contract?.risk_score ?? 0;
  const healthScore = contract?.health_score ?? 100;
  const createdAt = contract?.created_at ? new Date(contract.created_at).toLocaleDateString() : 'Recent';
  const fileType = (contract?.file_type || 'PDF').toUpperCase();

  return (
    <div className="space-y-6 pb-12">
      {/* Back Link & Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/contracts"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900">{contractTitle}</h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadgeColor(riskTier)}`}>
                {riskTier} RISK
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyzed on {createdAt} • Format: {fileType}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {contract?.id && (
            <a
              href={getReportDownloadUrl(contract.id)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </a>
          )}
        </div>
      </div>

      {/* Top Risk Score & Health Meters Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Risk Score Meter */}
        <div className="md:col-span-6 lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">COMPOSITE RISK SCORE</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-slate-900">{riskScore}</span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Hybrid engine: 40% Deterministic Rules, 40% Contextual LLM, 20% Vector RAG.
            </p>
          </div>

          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <div className={`w-20 h-20 rounded-full border-8 border-slate-100 flex items-center justify-center ${
              riskTier === 'HIGH' ? 'border-t-red-500' : riskTier === 'MEDIUM' ? 'border-t-amber-500' : 'border-t-emerald-500'
            }`}>
              <Shield className={`w-8 h-8 ${
                riskTier === 'HIGH' ? 'text-red-500' : riskTier === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'
              }`} />
            </div>
          </div>
        </div>

        {/* Contract Health Score Meter */}
        <div className="md:col-span-6 lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">CONTRACT HEALTH SCORE</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-emerald-600">{healthScore}</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              {healthScore > 70 ? 'Strong Playbook Alignment' : 'Moderate Adjustments Needed'}
            </span>
          </div>

          {/* Health Bar */}
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Extracted Metadata Info Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Extracted Metadata</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Contract Type</span>
            <span className="font-semibold text-slate-800">{metadata.contract_type || 'General'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Parties</span>
            <span className="font-semibold text-slate-800 truncate block">{metadata.parties || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Governing Law</span>
            <span className="font-semibold text-slate-800">{metadata.governing_law || 'Unspecified'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Payment Terms</span>
            <span className="font-semibold text-slate-800">{metadata.payment_terms || 'Net 30'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Notice Period</span>
            <span className="font-semibold text-slate-800">{metadata.notice_period || '30 days'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Renewal Terms</span>
            <span className="font-semibold text-slate-800">{metadata.renewal_terms || 'Automatic'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('SUMMARY')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'SUMMARY'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Executive Summary & Priorities
        </button>
        <button
          onClick={() => setActiveTab('MATRIX')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'MATRIX'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Clause Risk Matrix ({clauses.length})
        </button>
        <button
          onClick={() => setActiveTab('REDLINES')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'REDLINES'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          AI Redlines
        </button>
        <button
          onClick={() => setActiveTab('DOCUMENT')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'DOCUMENT'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Interactive Document Reader
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'SUMMARY' && (
        <ExecutiveSummary
          summaryText={analysis.executive_summary || 'Analysis complete.'}
          priorities={analysis.negotiation_priorities || []}
        />
      )}

      {activeTab === 'MATRIX' && (
        <ClauseMatrixTable
          clauses={clauses}
          onSelectClause={(c) => setSelectedClause(c)}
        />
      )}

      {activeTab === 'REDLINES' && (
        <div className="space-y-4">
          {clauses.filter(c => c.suggested_redline).map(c => (
            <RedlineViewer
              key={c.id}
              category={c.category}
              originalText={c.original_text}
              suggestedText={c.suggested_redline || ''}
            />
          ))}
        </div>
      )}

      {activeTab === 'DOCUMENT' && (
        <DocumentViewer contractTitle={contractTitle} clauses={clauses} />
      )}

      {/* Detail Modal */}
      <ClauseDetailModal
        clause={selectedClause}
        onClose={() => setSelectedClause(null)}
      />
    </div>
  );
};
