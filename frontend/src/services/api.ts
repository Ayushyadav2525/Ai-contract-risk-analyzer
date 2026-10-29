import { Contract, ContractDetailResponse, Analysis, DashboardStats, Playbook, CategoryStat } from '../types';

const API_BASE = '/api';

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

export const fetchDashboardTrends = async (timeframe: string = 'Last 7 weeks') => {
  const res = await fetch(`${API_BASE}/dashboard/trends?timeframe=${encodeURIComponent(timeframe)}`);
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
};

export const fetchTopCategories = async (): Promise<CategoryStat[]> => {
  const res = await fetch(`${API_BASE}/dashboard/categories`);
  if (!res.ok) throw new Error('Failed to fetch top categories');
  return res.json();
};

export const fetchContracts = async (): Promise<Contract[]> => {
  const res = await fetch(`${API_BASE}/contracts`);
  if (!res.ok) throw new Error('Failed to fetch contracts');
  return res.json();
};

export const fetchContractById = async (id: number): Promise<ContractDetailResponse> => {
  const res = await fetch(`${API_BASE}/contracts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch contract detail');
  return res.json();
};

export const deleteContractApi = async (id: number) => {
  const res = await fetch(`${API_BASE}/contracts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete contract');
  return res.json();
};

export const uploadContractFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || 'Upload failed');
  }
  return res.json();
};

export const fetchAnalysis = async (contractId: number): Promise<Analysis> => {
  const res = await fetch(`${API_BASE}/analysis/${contractId}`);
  if (!res.ok) throw new Error('Failed to fetch analysis');
  return res.json();
};

export const fetchAnalysisStatus = async (contractId: number) => {
  const res = await fetch(`${API_BASE}/analysis/${contractId}/status`);
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
};

export const fetchPlaybooks = async (): Promise<Playbook[]> => {
  const res = await fetch(`${API_BASE}/playbooks`);
  if (!res.ok) throw new Error('Failed to fetch playbooks');
  return res.json();
};

export const compareContractsApi = async (contractAId: number, contractBId: number) => {
  const res = await fetch(`${API_BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contract_a_id: contractAId, contract_b_id: contractBId })
  });
  if (!res.ok) throw new Error('Comparison failed');
  return res.json();
};

export const submitFeedbackApi = async (data: { contract_id?: number; finding_id?: number; rating: string; comments?: string }) => {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Feedback submission failed');
  return res.json();
};

export const getReportDownloadUrl = (contractId: number) => {
  return `${API_BASE}/reports/${contractId}/download`;
};
