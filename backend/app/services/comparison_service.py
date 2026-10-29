from typing import Dict, Any

def compare_contracts(contract_a: Any, analysis_a: Any, contract_b: Any, analysis_b: Any) -> Dict[str, Any]:
    score_diff = round(analysis_b.overall_score - analysis_a.overall_score, 1)
    health_diff = round(contract_b.health_score - contract_a.health_score, 1)

    status_trend = "Improved" if score_diff < 0 else "Worsened" if score_diff > 0 else "Unchanged"

    findings_a_cats = set(f.category for f in analysis_a.risk_findings)
    findings_b_cats = set(f.category for f in analysis_b.risk_findings)

    new_risks = list(findings_b_cats - findings_a_cats)
    resolved_risks = list(findings_a_cats - findings_b_cats)

    return {
        "contract_a": {
            "id": contract_a.id,
            "title": contract_a.title,
            "risk_score": analysis_a.overall_score,
            "risk_tier": analysis_a.risk_tier,
            "health_score": contract_a.health_score
        },
        "contract_b": {
            "id": contract_b.id,
            "title": contract_b.title,
            "risk_score": analysis_b.overall_score,
            "risk_tier": analysis_b.risk_tier,
            "health_score": contract_b.health_score
        },
        "comparison": {
            "score_difference": score_diff,
            "health_difference": health_diff,
            "trend": status_trend,
            "new_risk_categories": new_risks,
            "resolved_risk_categories": resolved_risks
        }
    }
