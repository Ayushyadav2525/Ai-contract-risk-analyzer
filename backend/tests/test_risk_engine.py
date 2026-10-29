from app.core.rules import evaluate_deterministic_rules
from app.services.risk_engine import compute_composite_risk_score

def test_deterministic_rules():
    risky_text = "Supplier shall indemnify Customer against any and all losses without limitation. There shall be no limitation of liability for damages."
    res = evaluate_deterministic_rules(risky_text)
    assert res["rule_score"] > 70.0
    assert len(res["findings"]) >= 2
    cats = [f["category"] for f in res["findings"]]
    assert "Indemnity" in cats
    assert "Limitation of Liability" in cats

def test_composite_risk_engine():
    sample_text = "Supplier agrees to provide services. Payments Net 30."
    clauses = [{"category": "Payment Terms", "original_text": "Payments Net 30."}]
    metadata = {"title": "Test Contract", "contract_type": "General"}
    
    score_res = compute_composite_risk_score(sample_text, clauses, metadata)
    assert "overall_score" in score_res
    assert "risk_tier" in score_res
    assert score_res["overall_score"] >= 0.0
    assert score_res["health_score"] <= 100.0
