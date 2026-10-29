import os
from types import SimpleNamespace
from datetime import datetime
from app.services.report_service import generate_pdf_report

def test_pdf_report_generation(tmp_path):
    output_pdf = os.path.join(tmp_path, "test_report.pdf")
    
    contract = SimpleNamespace(
        title="Test MSA Contract",
        file_type="pdf",
        created_at=datetime.utcnow()
    )
    analysis = SimpleNamespace(
        overall_score=78.5,
        risk_tier="HIGH",
        executive_summary="Elevated risk detected due to indemnification clauses."
    )
    finding = SimpleNamespace(
        category="Indemnity",
        risk_level="HIGH",
        score=85.0,
        title="Broad Indemnification",
        explanation="Clause requires broad indemnification.",
        negotiation_recommendation="Cap exposure.",
        redline_suggestion="Replace broad wording."
    )

    result_path = generate_pdf_report(contract, analysis, [finding], output_pdf)
    assert os.path.exists(result_path)
    assert os.path.getsize(result_path) > 1000
