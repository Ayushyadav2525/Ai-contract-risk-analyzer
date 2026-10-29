from typing import Dict, Any, List
from app.core.config import settings
from app.core.rules import evaluate_deterministic_rules
from app.services.rag_service import retrieve_playbook_context
from app.services.llm_service import analyze_contract_with_llm

def compute_composite_risk_score(
    full_text: str,
    extracted_clauses: List[Dict[str, Any]],
    metadata: Dict[str, Any]
) -> Dict[str, Any]:
    # 1. Deterministic Rule Score (40%)
    rules_res = evaluate_deterministic_rules(full_text)
    rule_score = rules_res["rule_score"]
    findings = rules_res["findings"]

    # 2. LLM Contextual Score (40%)
    llm_res = analyze_contract_with_llm(full_text, metadata)
    llm_score = llm_res["llm_score"]

    # 3. RAG / Playbook Score (20%)
    rag_scores = []
    for clause in extracted_clauses[:5]:
        r_ctx = retrieve_playbook_context(clause.get("category", "General"), clause.get("original_text", ""))
        rag_scores.append(r_ctx["rag_score"])
    rag_score = sum(rag_scores) / len(rag_scores) if rag_scores else 40.0

    # Composite Score Calculation
    overall_score = round(
        (settings.WEIGHT_RULES * rule_score) +
        (settings.WEIGHT_LLM * llm_score) +
        (settings.WEIGHT_RAG * rag_score),
        1
    )

    # Health score (inverse of risk)
    health_score = round(max(0.0, 100.0 - overall_score), 1)

    # Tier mapping: 0-30 = LOW, 31-65 = MEDIUM, 66-100 = HIGH
    if overall_score <= 30.0:
        risk_tier = "LOW"
    elif overall_score <= 65.0:
        risk_tier = "MEDIUM"
    else:
        risk_tier = "HIGH"

    return {
        "overall_score": overall_score,
        "risk_tier": risk_tier,
        "health_score": health_score,
        "rule_score": rule_score,
        "llm_score": llm_score,
        "rag_score": rag_score,
        "executive_summary": llm_res["executive_summary"],
        "negotiation_priorities": llm_res["negotiation_priorities"],
        "is_demo": llm_res["is_demo"],
        "findings": findings
    }
