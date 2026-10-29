import json
from typing import Dict, Any, Optional
from app.core.config import settings

SYSTEM_PROMPT = """You are an expert LegalTech Contract Risk Analyst.
Analyze only the supplied contract content.
Do not invent contractual language.
If information is missing, return null.
Do not provide definitive legal advice.
Clearly distinguish contract facts from recommendations.
Return strictly valid JSON with no markdown formatting around it.

Expected JSON output format:
{
  "llm_score": 75.0,
  "executive_summary": "Executive overview text...",
  "negotiation_priorities": [
    {
      "rank": 1,
      "title": "Cap indemnification exposure",
      "category": "Indemnity",
      "risk_level": "HIGH",
      "recommendation": "Negotiate mutual cap equal to 1x contract value."
    }
  ]
}
"""

def analyze_contract_with_llm(contract_text: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    if not settings.OPENAI_API_KEY:
        return _fallback_llm_analysis(contract_text, metadata)

    try:
        import openai
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        
        prompt = f"""Contract Title: {metadata.get('title', 'Unknown')}
Contract Type: {metadata.get('contract_type', 'General')}

Excerpt of contract text:
{contract_text[:4000]}

Evaluate potential risks, overall risk score (0-100), executive summary narrative, and top 3 negotiation priorities."""

        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]

        parsed = json.loads(content)
        return {
            "llm_score": float(parsed.get("llm_score", 50.0)),
            "executive_summary": parsed.get("executive_summary", "Contract analysis completed."),
            "negotiation_priorities": parsed.get("negotiation_priorities", []),
            "is_demo": "false"
        }
    except Exception as e:
        print(f"[LLM Service] Fallback triggered due to error/key: {e}")
        return _fallback_llm_analysis(contract_text, metadata)

def _fallback_llm_analysis(contract_text: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    # Rule-Based Contextual Analysis Fallback
    text_lower = contract_text.lower()
    score = 35.0
    priorities = []
    
    if "indemnify" in text_lower or "indemnification" in text_lower:
        score += 25.0
        priorities.append({
            "rank": 1,
            "title": "Cap indemnification exposure",
            "category": "Indemnity",
            "risk_level": "HIGH",
            "recommendation": "Cap indemnification obligations to direct losses resulting from gross negligence."
        })

    if "limitation of liability" in text_lower or "liability" in text_lower:
        score += 20.0
        priorities.append({
            "rank": 2,
            "title": "Establish mutual aggregate liability cap",
            "category": "Limitation of Liability",
            "risk_level": "HIGH",
            "recommendation": "Ensure maximum liability is capped at 12 months of total fees paid."
        })

    if "terminate for convenience" in text_lower or "without cause" in text_lower:
        score += 15.0
        priorities.append({
            "rank": 3,
            "title": "Make termination rights mutual",
            "category": "Termination",
            "risk_level": "MEDIUM",
            "recommendation": "Require 30 days prior written notice for convenience termination."
        })

    if not priorities:
        priorities.append({
            "rank": 1,
            "title": "Standardize governing law and dispute terms",
            "category": "Governing Law",
            "risk_level": "LOW",
            "recommendation": "Confirm local venue and governing jurisdiction for dispute resolution."
        })

    score = min(score, 95.0)

    summary_text = (
        f"This contract presents {'elevated' if score > 65 else 'moderate' if score > 35 else 'low'} risk "
        f"primarily due to key provisions around {', '.join([p['category'] for p in priorities])}. "
        "Reviewing high-priority items prior to execution is strongly recommended."
    )

    return {
        "llm_score": score,
        "executive_summary": summary_text,
        "negotiation_priorities": priorities,
        "is_demo": "true"
    }
