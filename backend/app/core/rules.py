import re
from typing import List, Dict, Any

RISK_RULES = [
    {
        "id": "RULE_INDEMNITY_UNCAPPED",
        "category": "Indemnity",
        "keywords": ["indemnify", "indemnification", "hold harmless", "defend and hold harmless"],
        "risky_patterns": [
            r"indemnify.*against\s+any\s+and\s+all",
            r"indemnify.*without\s+limitation",
            r"indemnify.*consequential\s+damages",
            r"indemnify.*indirect\s+losses"
        ],
        "risk_level": "HIGH",
        "base_score": 85,
        "title": "Broad or Uncapped Indemnification",
        "explanation": "The clause requires broad indemnification covering 'any and all' losses, potentially exposing the party to unlimited financial liability including indirect/consequential damages.",
        "business_impact": "Severe financial exposure if a third-party claim arises, as liabilities are not capped by contract value.",
        "negotiation_recommendation": "Cap indemnification obligations to direct damages only, subject to the total contract liability cap.",
        "redline_suggestion": "Replace broad wording with: 'Each party shall indemnify the other against direct third-party losses resulting directly from gross negligence or willful misconduct, capped at total fees paid under this Agreement.'"
    },
    {
        "id": "RULE_LIABILITY_UNCAPPED",
        "category": "Limitation of Liability",
        "keywords": ["limitation of liability", "aggregate liability", "consequential damages", "maximum liability"],
        "risky_patterns": [
            r"no\s+limitation\s+of\s+liability",
            r"liability\s+shall\s+not\s+be\s+limited",
            r"exceeding\s+the\s+total\s+contract\s+value\s+is\s+permitted",
            r"excluding\s+gross\s+negligence.*without\s+cap"
        ],
        "risk_level": "HIGH",
        "base_score": 88,
        "title": "Uncapped or Missing Limitation of Liability",
        "explanation": "The agreement lacks an effective overall liability cap or contains carve-outs that leave liability unlimited.",
        "business_impact": "In the event of a breach, damages could exceed total fees collected under the contract and threaten company solvency.",
        "negotiation_recommendation": "Insist on a mutual cap equal to 1x to 2x the annual contract value or fees paid in the preceding 12 months.",
        "redline_suggestion": "Add: 'Except for breach of confidentiality or gross negligence, each party's maximum aggregate liability shall not exceed total fees paid by Customer in the 12 months preceding the claim.'"
    },
    {
        "id": "RULE_TERMINATION_UNILATERAL",
        "category": "Termination",
        "keywords": ["terminate for convenience", "termination without cause", "immediate termination"],
        "risky_patterns": [
            r"may\s+terminate.*without\s+cause.*upon\s+\d+\s+days",
            r"unilateral\s+right\s+to\s+terminate",
            r"terminate\s+immediately\s+without\s+notice"
        ],
        "risk_level": "HIGH",
        "base_score": 75,
        "title": "Unilateral Termination Rights",
        "explanation": "One party holds the right to terminate the contract immediately or for convenience without reciprocal rights.",
        "business_impact": "Operational disruption and unrecoverable initial investments if the contract is abruptly terminated.",
        "negotiation_recommendation": "Make termination rights mutual with a standard 30-day written notice requirement.",
        "redline_suggestion": "Change to: 'Either party may terminate this Agreement for convenience upon providing at least thirty (30) days prior written notice to the other party.'"
    },
    {
        "id": "RULE_NON_COMPETE_BROAD",
        "category": "Non-Compete",
        "keywords": ["non-compete", "covenant not to compete", "exclusivity", "restraint of trade"],
        "risky_patterns": [
            r"shall\s+not\s+engage\s+in\s+any\s+competing\s+business",
            r"worldwide.*period\s+of\s+[2-9]\s+years",
            r"directly\s+or\s+indirectly\s+compete"
        ],
        "risk_level": "HIGH",
        "base_score": 80,
        "title": "Overly Broad Geographic or Duration Non-Compete",
        "explanation": "The non-compete clause covers extensive geographical regions or lasts for more than 1 year.",
        "business_impact": "Restricts future business expansion, client acquisition, and commercial freedom.",
        "negotiation_recommendation": "Narrow scope to specific named direct competitors and limit duration to 6-12 months max within actual market regions.",
        "redline_suggestion": "Modify to: 'Party shall not solicit key client accounts directly served during the term for a period of six (6) months following termination.'"
    },
    {
        "id": "RULE_GOVERNING_LAW_FOREIGN",
        "category": "Governing Law",
        "keywords": ["governing law", "jurisdiction", "venue", "courts of"],
        "risky_patterns": [
            r"governed\s+by\s+the\s+laws\s+of\s+(England|Cayman|Delaware|Singapore|Hong Kong)",
            r"exclusive\s+jurisdiction\s+in\s+foreign"
        ],
        "risk_level": "MEDIUM",
        "base_score": 55,
        "title": "Foreign Governing Law and Venue",
        "explanation": "Disputes must be litigated under a foreign legal jurisdiction, increasing legal expenses and complexity.",
        "business_impact": "High litigation costs if a dispute arises due to local counsel retainers abroad.",
        "negotiation_recommendation": "Request neutral arbitration or local jurisdiction.",
        "redline_suggestion": "Replace foreign venue with: 'This Agreement shall be governed by and construed in accordance with the laws of the home jurisdiction of Customer.'"
    },
    {
        "id": "RULE_AUTO_RENEWAL_LONG_NOTICE",
        "category": "Renewal",
        "keywords": ["auto-renew", "automatic renewal", "renew automatically"],
        "risky_patterns": [
            r"automatically\s+renew.*unless.*notice.*prior",
            r"notice\s+of\s+non-renewal\s+at\s+least\s+90\s+days"
        ],
        "risk_level": "MEDIUM",
        "base_score": 50,
        "title": "Strict Auto-Renewal Window",
        "explanation": "Contract automatically renews unless notice of non-renewal is provided 60-90 days before expiration.",
        "business_impact": "Risk of accidentally being locked into unwanted long-term contract commitments.",
        "negotiation_recommendation": "Shorten non-renewal notice period to 30 days and add annual opt-in reminders.",
        "redline_suggestion": "Update notice window to 30 days prior to term expiration."
    },
    {
        "id": "RULE_PAYMENT_LATE_PENALTY",
        "category": "Payment Terms",
        "keywords": ["payment", "invoice", "late fee", "interest", "net 90", "net 60"],
        "risky_patterns": [
            r"net\s+90",
            r"late\s+payment\s+fee\s+of\s+[2-9]%",
            r"compound\s+interest\s+per\s+month"
        ],
        "risk_level": "MEDIUM",
        "base_score": 45,
        "title": "Extended Payment Terms or High Late Penalties",
        "explanation": "Payment terms exceed Net 30 or impose steep late payment penalties.",
        "business_impact": "Cash flow strain or excessive interest penalties for administrative invoice delays.",
        "negotiation_recommendation": "Standardize to Net 30 days with interest capped at 1.5% per month.",
        "redline_suggestion": "Change to Net 30 days with standard statutory late interest limits."
    },
    {
        "id": "RULE_IP_ASSIGNMENT_BROAD",
        "category": "Intellectual Property",
        "keywords": ["intellectual property", "work for hire", "assignment of rights", "background ip"],
        "risky_patterns": [
            r"all\s+ip\s+created.*shall\s+belong\s+exclusively",
            r"assigns\s+all\s+background\s+ip",
            r"transfer\s+of\s+pre-existing\s+ip"
        ],
        "risk_level": "HIGH",
        "base_score": 78,
        "title": "Broad IP Assignment including Pre-existing IP",
        "explanation": "Clause attempts to transfer pre-existing background IP or un-segregated proprietary tools.",
        "business_impact": "Potential loss of proprietary software, tools, core methodologies, or trademark assets.",
        "negotiation_recommendation": "Explicitly retain ownership of Background IP and grant a non-exclusive license instead.",
        "redline_suggestion": "Insert: 'Each party retains sole ownership of its Background IP. Customer receives a non-exclusive license to use deliverables developed specifically for Customer.'"
    }
]

def evaluate_deterministic_rules(text: str) -> Dict[str, Any]:
    text_lower = text.lower()
    matched_findings = []
    category_scores = {}
    total_rule_score = 0

    for rule in RISK_RULES:
        # Check keyword presence first
        has_keyword = any(kw in text_lower for kw in rule["keywords"])
        if not has_keyword:
            continue

        # Check regex patterns or keyword matches
        pattern_matches = 0
        for pattern in rule["risky_patterns"]:
            if re.search(pattern, text, re.IGNORECASE):
                pattern_matches += 1

        if pattern_matches > 0 or (has_keyword and rule["risk_level"] == "HIGH"):
            match_score = rule["base_score"]
            finding = {
                "rule_id": rule["id"],
                "category": rule["category"],
                "title": rule["title"],
                "risk_level": rule["risk_level"],
                "score": match_score,
                "confidence": min(80 + (pattern_matches * 5), 98),
                "explanation": rule["explanation"],
                "business_impact": rule["business_impact"],
                "negotiation_recommendation": rule["negotiation_recommendation"],
                "redline_suggestion": rule["redline_suggestion"],
                "page": 1,
                "section": "General Clause"
            }
            matched_findings.append(finding)
            cat = rule["category"]
            category_scores[cat] = max(category_scores.get(cat, 0), match_score)

    if matched_findings:
        avg_score = sum(f["score"] for f in matched_findings) / len(matched_findings)
        max_score = max(f["score"] for f in matched_findings)
        total_rule_score = round(0.6 * max_score + 0.4 * avg_score, 1)
    else:
        total_rule_score = 25.0  # Base default clean contract score

    return {
        "rule_score": total_rule_score,
        "findings": matched_findings,
        "categories_analyzed": list(category_scores.keys())
    }
