import re
from typing import List, Dict, Any

CLAUSE_CATEGORIES = [
    {"name": "Indemnity", "patterns": [r"indemnify", r"indemnification", r"hold harmless"]},
    {"name": "Limitation of Liability", "patterns": [r"limitation of liability", r"liability cap", r"consequential damages"]},
    {"name": "Termination", "patterns": [r"termination", r"terminate", r"cancellation"]},
    {"name": "Non-Compete", "patterns": [r"non-compete", r"covenant not to compete", r"exclusivity"]},
    {"name": "Confidentiality", "patterns": [r"confidential", r"non-disclosure", r"proprietary information"]},
    {"name": "Intellectual Property", "patterns": [r"intellectual property", r"ip rights", r"work for hire", r"patent", r"trademark"]},
    {"name": "Payment Terms", "patterns": [r"payment", r"fees", r"invoicing", r"late payment"]},
    {"name": "Governing Law", "patterns": [r"governing law", r"jurisdiction", r"choice of law"]},
    {"name": "Dispute Resolution", "patterns": [r"dispute resolution", r"arbitration", r"mediation"]},
    {"name": "Warranty", "patterns": [r"warranty", r"warranties", r"disclaimer of warranties"]},
    {"name": "Data Protection", "patterns": [r"data protection", r"gdpr", r"privacy", r"security"]},
    {"name": "Insurance", "patterns": [r"insurance", r"policy limit", r"coverage"]},
    {"name": "Force Majeure", "patterns": [r"force majeure", r"acts of god", r"unforeseeable events"]},
    {"name": "Renewal", "patterns": [r"renewal", r"auto-renew", r"automatic renewal"]},
    {"name": "Assignment", "patterns": [r"assignment", r"assignability", r"subcontracting"]}
]

def extract_clauses(text: str, pages: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    extracted = []
    # Split text into paragraphs/sections
    sections = re.split(r'\n\s*\n|\n(?=[0-9]+\.|\bSECTION\b|\bARTICLE\b)', text)
    
    for idx, sec in enumerate(sections):
        sec_text = sec.strip()
        if len(sec_text) < 40:
            continue
            
        matched_cat = None
        for cat in CLAUSE_CATEGORIES:
            for pat in cat["patterns"]:
                if re.search(pat, sec_text, re.IGNORECASE):
                    matched_cat = cat["name"]
                    break
            if matched_cat:
                break
                
        if not matched_cat:
            matched_cat = "General Terms"

        # Determine page number estimation
        page_num = 1
        if pages:
            for p in pages:
                if sec_text[:40] in p["text"]:
                    page_num = p["page_number"]
                    break

        section_title = f"Section {idx + 1}"
        sec_title_match = re.search(r"^([0-9]+\.[0-9]*\s+[A-Z\s]+|SECTION\s+[0-9]+|ARTICLE\s+[0-9]+)", sec_text, re.IGNORECASE)
        if sec_title_match:
            section_title = sec_title_match.group(0).strip()

        extracted.append({
            "section": section_title,
            "page_number": page_num,
            "category": matched_cat,
            "original_text": sec_text
        })

    return extracted
