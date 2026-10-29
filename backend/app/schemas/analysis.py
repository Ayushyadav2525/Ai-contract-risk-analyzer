from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class RiskFindingResponse(BaseModel):
    id: Optional[int] = None
    rule_id: Optional[str] = None
    category: str
    title: str
    risk_level: str
    score: float
    confidence: float
    explanation: Optional[str] = None
    business_impact: Optional[str] = None
    negotiation_recommendation: Optional[str] = None
    redline_suggestion: Optional[str] = None
    page: int = 1
    section: Optional[str] = None

    class Config:
        from_attributes = True

class NegotiationPriority(BaseModel):
    rank: int
    title: str
    category: str
    risk_level: str
    recommendation: str

class AnalysisResponse(BaseModel):
    id: int
    contract_id: int
    overall_score: float
    risk_tier: str
    rule_score: float
    llm_score: float
    rag_score: float
    executive_summary: Optional[str] = None
    negotiation_priorities: Optional[List[Dict[str, Any]]] = []
    is_demo: Optional[str] = "false"
    risk_findings: List[RiskFindingResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True
