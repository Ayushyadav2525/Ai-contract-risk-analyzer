from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.analysis import AnalysisResponse

class MetadataResponse(BaseModel):
    title: Optional[str] = None
    contract_type: Optional[str] = None
    parties: Optional[str] = None
    effective_date: Optional[str] = None
    expiration_date: Optional[str] = None
    governing_law: Optional[str] = None
    jurisdiction: Optional[str] = None
    renewal_terms: Optional[str] = None
    notice_period: Optional[str] = None
    payment_terms: Optional[str] = None
    currency: Optional[str] = "USD"

    class Config:
        from_attributes = True

class ClauseResponse(BaseModel):
    id: int
    section: Optional[str] = None
    page_number: int
    category: str
    original_text: str
    risk_level: str
    risk_score: float
    confidence: float
    explanation: Optional[str] = None
    business_impact: Optional[str] = None
    recommendation: Optional[str] = None
    suggested_redline: Optional[str] = None
    is_reviewed: Optional[str] = "false"

    class Config:
        from_attributes = True

class ContractResponse(BaseModel):
    id: int
    title: str
    filename: str
    file_type: str
    file_size: int
    status: str
    risk_score: Optional[float] = 0.0
    risk_tier: Optional[str] = "LOW"
    health_score: Optional[float] = 100.0
    created_at: datetime
    metadata_info: Optional[MetadataResponse] = None

    class Config:
        from_attributes = True

class ContractDetailResponse(BaseModel):
    contract: ContractResponse
    analysis: Optional[AnalysisResponse] = None
    clauses: List[ClauseResponse] = []
    metadata: Optional[MetadataResponse] = None

    class Config:
        from_attributes = True

