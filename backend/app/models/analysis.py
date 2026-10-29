from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    overall_score = Column(Float, nullable=False, default=0.0)
    risk_tier = Column(String, nullable=False, default="LOW")
    rule_score = Column(Float, nullable=False, default=0.0)
    llm_score = Column(Float, nullable=False, default=0.0)
    rag_score = Column(Float, nullable=False, default=0.0)
    executive_summary = Column(Text, nullable=True)
    negotiation_priorities = Column(JSON, nullable=True)
    is_demo = Column(String, default="false")
    created_at = Column(DateTime, default=datetime.utcnow)

    contract = relationship("Contract", back_populates="analyses")
    risk_findings = relationship("RiskFinding", back_populates="analysis", cascade="all, delete-orphan")


class RiskFinding(Base):
    __tablename__ = "risk_findings"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    rule_id = Column(String, nullable=True)
    category = Column(String, nullable=False)
    title = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False, default=90.0)
    explanation = Column(Text, nullable=True)
    business_impact = Column(Text, nullable=True)
    negotiation_recommendation = Column(Text, nullable=True)
    redline_suggestion = Column(Text, nullable=True)
    page = Column(Integer, default=1)
    section = Column(String, nullable=True)

    analysis = relationship("Analysis", back_populates="risk_findings")
