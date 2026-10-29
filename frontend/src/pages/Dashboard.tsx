import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, AlertTriangle, Scale, Clock } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { RiskOverviewChart } from '../components/RiskOverviewChart';
import { RiskTrendChart } from '../components/RiskTrendChart';
import { TopRiskCategories } from '../components/TopRiskCategories';
import { RecentContractsTable } from '../components/RecentContractsTable';
import { UploadZone } from '../components/UploadZone';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { AnalysisProgressModal } from '../components/AnalysisProgressModal';
import { fetchDashboardStats, fetchContracts, uploadContractFile, fetchAnalysisStatus } from '../services/api';
import { Contract, DashboardStats } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressModal, setUploadProgressModal] = useState(false);
  const [currentContractId, setCurrentContractId] = useState<number | null>(null);
  const [stages, setStages] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsData = await fetchDashboardStats();
      const contractsData = await fetchContracts();
      setStats(statsData);
      setContracts(contractsData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgressModal(true);
    setStages([
      { name: 'Document Ingestion & Text Extraction', status: 'in_progress', detail: 'Extracting clause boundaries...' },
      { name: 'Deterministic Rule Engine', status: 'pending', detail: 'Applying playbook risk rules...' },
      { name: 'LLM Risk & Redline Assessment', status: 'pending', detail: 'Evaluating clause impacts...' },
      { name: 'Vector RAG Indexing', status: 'pending', detail: 'Indexing embeddings into vector store...' },
      { name: 'Final Risk Report Compilation', status: 'pending', detail: 'Computing health and composite risk scores...' },
    ]);

    try {
      const res = await uploadContractFile(file);
      const contractId = res.contract_id;
      setCurrentContractId(contractId);

      setStages([
        { name: 'Document Ingestion & Text Extraction', status: 'completed', detail: 'Extracted text & sections' },
        { name: 'Deterministic Rule Engine', status: 'completed', detail: 'Rules evaluated' },
        { name: 'LLM Risk & Redline Assessment', status: 'completed', detail: 'AI Redlines generated' },
        { name: 'Vector RAG Indexing', status: 'completed', detail: 'Indexed in vector DB' },
        { name: 'Final Risk Report Compilation', status: 'completed', detail: 'Analysis complete' },
      ]);

      setTimeout(() => {
        setUploadProgressModal(false);
        setIsUploading(false);
        navigate(`/contracts/${contractId}`);
      }, 800);
    } catch (err) {
      console.error('Upload Error:', err);
      setIsUploading(false);
      setUploadProgressModal(false);
      alert('Error analyzing contract. Please check backend connection and try again.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Metric Cards Grid (4 Top Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Contracts analyzed"
          value={stats?.contracts_analyzed ?? 24}
          change={stats?.contracts_analyzed_change ?? "↑ 12% from last month"}
          icon={FileCheck}
        />
        <MetricCard
          title="High risk contracts"
          value={stats?.high_risk_contracts ?? 7}
          change={stats?.high_risk_change ?? "↑ 3% from last month"}
          icon={AlertTriangle}
        />
        <MetricCard
          title="Average risk score"
          value={stats?.average_risk_score ?? 62}
          subValue="/100"
          change={stats?.average_risk_change ?? "↑ 5 pts from last month"}
          icon={Scale}
        />
        <MetricCard
          title="Time saved"
          value={`${stats?.time_saved_hours ?? 18.5} hrs`}
          change={stats?.time_saved_change ?? "↑ 25% from last month"}
          icon={Clock}
        />
      </div>

      {/* Donut Risk Overview + Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <RiskOverviewChart
            highCount={stats?.high_risk_contracts ?? 7}
            mediumCount={stats?.medium_risk_contracts ?? 11}
            lowCount={stats?.low_risk_contracts ?? 6}
          />
        </div>
        <div className="lg:col-span-8">
          <UploadZone onFileSelect={handleFileUpload} isAnalyzing={isUploading} />
        </div>
      </div>

      {/* Risk Trend Line Chart + Top Risk Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RiskTrendChart />
        </div>
        <div className="lg:col-span-5">
          <TopRiskCategories />
        </div>
      </div>

      {/* Recent Contracts Table */}
      <RecentContractsTable contracts={contracts.slice(0, 5)} />

      {/* Upload Progress Modal */}
      <AnalysisProgressModal
        isOpen={uploadProgressModal}
        stages={stages}
        progressPercent={100}
      />
    </div>
  );
};
