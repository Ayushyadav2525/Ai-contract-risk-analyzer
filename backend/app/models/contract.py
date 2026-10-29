from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # pdf, docx
    file_size = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False, default="completed")  # queued, uploading, extracting, chunking, embedding, analyzing, generating, completed, failed
    risk_score = Column(Float, nullable=True, default=0.0)
    risk_tier = Column(String, nullable=True, default="LOW")  # LOW, MEDIUM, HIGH
    health_score = Column(Float, nullable=True, default=100.0)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    metadata_info = relationship("ContractMetadata", back_populates="contract", uselist=False, cascade="all, delete-orphan")
    clauses = relationship("Clause", back_populates="contract", cascade="all, delete-orphan")
    analyses = relationship("Analysis", back_populates="contract", cascade="all, delete-orphan")


class ContractMetadata(Base):
    __tablename__ = "contract_metadata"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    title = Column(String, nullable=True)
    contract_type = Column(String, nullable=True)  # MSA, NDA, Vendor, Freelancer, etc.
    parties = Column(Text, nullable=True)
    effective_date = Column(String, nullable=True)
    expiration_date = Column(String, nullable=True)
    governing_law = Column(String, nullable=True)
    jurisdiction = Column(String, nullable=True)
    renewal_terms = Column(Text, nullable=True)
    notice_period = Column(String, nullable=True)
    payment_terms = Column(String, nullable=True)
    currency = Column(String, nullable=True, default="USD")

    contract = relationship("Contract", back_populates="metadata_info")
