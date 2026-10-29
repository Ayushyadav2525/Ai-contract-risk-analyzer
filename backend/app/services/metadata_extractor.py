import re
from typing import Dict, Any, Optional

def extract_metadata(text: str, filename: str) -> Dict[str, Any]:
    metadata = {
        "title": None,
        "contract_type": "General Commercial",
        "parties": None,
        "effective_date": None,
        "expiration_date": None,
        "governing_law": None,
        "jurisdiction": None,
        "renewal_terms": None,
        "notice_period": None,
        "payment_terms": None,
        "currency": "USD"
    }

    text_lower = text.lower()

    # Document Title Heuristics
    title_match = re.search(r"^[^\n]*(AGREEMENT|CONTRACT|NDA|SERVICES|MASTER SERVICE|PARTNERSHIP)[^\n]*", text, re.IGNORECASE | re.MULTILINE)
    if title_match:
        metadata["title"] = title_match.group(0).strip()
    else:
        metadata["title"] = filename.rsplit(".", 1)[0].replace("_", " ").title()

    # Contract Type Detection
    if "non-disclosure" in text_lower or "nda" in text_lower:
        metadata["contract_type"] = "NDA"
    elif "master service" in text_lower or "msa" in text_lower:
        metadata["contract_type"] = "MSA"
    elif "vendor" in text_lower or "supplier" in text_lower:
        metadata["contract_type"] = "Vendor Agreement"
    elif "freelancer" in text_lower or "independent contractor" in text_lower:
        metadata["contract_type"] = "Freelancer Agreement"
    elif "partnership" in text_lower:
        metadata["contract_type"] = "Partnership Agreement"

    # Effective Date Pattern
    date_match = re.search(r"(effective\s+as\s+of|entered\s+into\s+on|dated)\s+([A-Za-z]+\s+\d{1,2},\s+\d{4}|\d{1,2}/\d{1,2}/\d{4}|\d{4}-\d{2}-\d{2})", text, re.IGNORECASE)
    if date_match:
        metadata["effective_date"] = date_match.group(2)

    # Expiration Date Pattern
    exp_match = re.search(r"(expire|terminate|term\s+shall\s+end)\s+on\s+([A-Za-z]+\s+\d{1,2},\s+\d{4}|\d{1,2}/\d{1,2}/\d{4}|\d{4}-\d{2}-\d{2})", text, re.IGNORECASE)
    if exp_match:
        metadata["expiration_date"] = exp_match.group(2)

    # Governing Law
    law_match = re.search(r"governed\s+by\s+(and\s+construed\s+in\s+accordance\s+with\s+)?the\s+laws\s+of\s+([A-Z][a-z]+(\s+[A-Z][a-z]+)?)", text)
    if law_match:
        metadata["governing_law"] = law_match.group(2).strip()

    # Payment terms
    payment_match = re.search(r"(net\s+(15|30|45|60|90)|within\s+\d+\s+days)", text, re.IGNORECASE)
    if payment_match:
        metadata["payment_terms"] = payment_match.group(0).upper()

    # Notice period
    notice_match = re.search(r"(\d+\s+days\s+prior\s+written\s+notice|\d+\s+days\s+written\s+notice)", text, re.IGNORECASE)
    if notice_match:
        metadata["notice_period"] = notice_match.group(0)

    # Parties
    parties_match = re.search(r"between\s+([A-Z0-9\s,\.]+)\s+and\s+([A-Z0-9\s,\.]+)", text, re.IGNORECASE)
    if parties_match:
        p1 = parties_match.group(1).strip()[:50]
        p2 = parties_match.group(2).strip()[:50]
        metadata["parties"] = f"{p1} and {p2}"

    return metadata
