from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.db.session import Base

class Clause(Base):
    __tablename__ = "clauses"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    section = Column(String, nullable=True)
    page_number = Column(Integer, nullable=True, default=1)
    category = Column(String, nullable=False, index=True)  # Indemnity, Liability, Termination, IP, etc.
    original_text = Column(Text, nullable=False)
    risk_level = Column(String, nullable=False, default="LOW")  # LOW, MEDIUM, HIGH
    risk_score = Column(Float, nullable=False, default=0.0)
    confidence = Column(Float, nullable=False, default=90.0)
    explanation = Column(Text, nullable=True)
    business_impact = Column(Text, nullable=True)
    recommendation = Column(Text, nullable=True)
    suggested_redline = Column(Text, nullable=True)
    is_reviewed = Column(String, default="false")

    contract = relationship("Contract", back_populates="clauses")
