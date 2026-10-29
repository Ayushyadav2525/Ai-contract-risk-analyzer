export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

export interface ContractMetadata {
  title?: string;
  contract_type?: string;
  parties?: string;
  effective_date?: string;
  expiration_date?: string;
  governing_law?: string;
  jurisdiction?: string;
  renewal_terms?: string;
  notice_period?: string;
  payment_terms?: string;
  currency?: string;
}

export interface Clause {
  id: number;
  section?: string;
  page_number: number;
  category: string;
  original_text: string;
  risk_level: RiskTier;
  risk_score: number;
  confidence: number;
  explanation?: string;
  business_impact?: string;
  recommendation?: string;
  suggested_redline?: string;
  is_reviewed?: string;
}

export interface RiskFinding {
  id?: number;
  rule_id?: string;
  category: string;
  title: string;
  risk_level: RiskTier;
  score: number;
  confidence: number;
  explanation?: string;
  business_impact?: string;
  negotiation_recommendation?: string;
  redline_suggestion?: string;
  page: number;
  section?: string;
}

export interface NegotiationPriority {
  rank: number;
  title: string;
  category: string;
  risk_level: RiskTier;
  recommendation: string;
}

export interface Analysis {
  id: number;
  contract_id: number;
  overall_score: number;
  risk_tier: RiskTier;
  rule_score: number;
  llm_score: number;
  rag_score: number;
  executive_summary?: string;
  negotiation_priorities?: NegotiationPriority[];
  is_demo?: string;
  risk_findings: RiskFinding[];
  created_at: string;
}

export interface Contract {
  id: number;
  title: string;
  filename: string;
  file_type: string;
  file_size: number;
  status: string;
  risk_score: number;
  risk_tier: RiskTier;
  health_score: number;
  created_at: string;
  metadata_info?: ContractMetadata;
  clauses?: Clause[];
}

export interface ContractDetailResponse {
  contract: Contract;
  analysis: Analysis;
  clauses: Clause[];
  metadata: ContractMetadata;
}

export interface Playbook {
  id: number;
  name: string;
  description?: string;
  category: string;
  rules_count: number;
  is_default: string;
  updated_at: string;
}

export interface DashboardStats {
  contracts_analyzed: number;
  contracts_analyzed_change: string;
  high_risk_contracts: number;
  high_risk_change: string;
  medium_risk_contracts: number;
  low_risk_contracts: number;
  average_risk_score: number;
  average_risk_change: string;
  time_saved_hours: number;
  time_saved_change: string;
}

export interface CategoryStat {
  category: string;
  icon: string;
  count: number;
  progress: number;
}
