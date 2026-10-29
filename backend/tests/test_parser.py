import os
import pytest
from app.services.document_parser import extract_document_text
from app.services.metadata_extractor import extract_metadata
from app.services.clause_extractor import extract_clauses

def test_metadata_extraction():
    sample_text = """MASTER SERVICE AGREEMENT
This Agreement is entered into on October 1, 2026 by and between Acme Corp and GlobalTech Inc.
This Agreement shall be governed by the laws of Delaware. Payments shall be made Net 30 days."""
    
    meta = extract_metadata(sample_text, "master_service_agreement.pdf")
    assert meta["contract_type"] == "MSA"
    assert "Acme Corp" in meta["parties"]
    assert meta["governing_law"] == "Delaware"
    assert meta["payment_terms"] == "NET 30"

def test_clause_extraction():
    sample_text = """SECTION 1. INDEMNIFICATION
The Supplier shall indemnify and hold harmless the Customer against any and all claims.

SECTION 2. LIMITATION OF LIABILITY
Neither party shall be liable for indirect damages under this agreement."""
    
    clauses = extract_clauses(sample_text)
    assert len(clauses) >= 2
    categories = [c["category"] for c in clauses]
    assert "Indemnity" in categories
    assert "Limitation of Liability" in categories
