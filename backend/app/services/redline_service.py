from typing import Dict, Any

def generate_redline_suggestion(clause_category: str, original_text: str) -> str:
    category_lower = clause_category.lower()
    
    if "indemnify" in category_lower or "indemnity" in category_lower:
        return (
            "Each party ('Indemnifying Party') shall defend and indemnify the other party against direct third-party losses "
            "arising directly from gross negligence, willful misconduct, or material breach of confidentiality, "
            "subject strictly to the Limitation of Liability cap set forth in Section 12."
        )
    elif "liability" in category_lower:
        return (
            "IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. "
            "EXCEPT FOR BREACH OF CONFIDENTIALITY OBLIGATIONS, EACH PARTY'S MAXIMUM AGGREGATE LIABILITY UNDER THIS AGREEMENT "
            "SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM."
        )
    elif "termination" in category_lower:
        return (
            "Either party may terminate this Agreement without cause upon providing at least thirty (30) days prior written notice. "
            "In the event of a material breach, the non-breaching party may terminate upon fifteen (15) days written notice if such breach remains uncured."
        )
    elif "compete" in category_lower:
        return (
            "During the term of this Agreement and for a period of six (6) months thereafter, Contractor agrees not to directly solicit "
            "active client accounts of Customer served during the contract term within the designated operating territory."
        )
    elif "ip" in category_lower or "intellectual" in category_lower:
        return (
            "Customer shall retain all right, title, and interest in its Pre-existing Intellectual Property. "
            "Supplier hereby assigns to Customer all right, title, and interest in custom deliverables created exclusively for Customer under this Agreement."
        )
    else:
        return f"Standard balanced term replacement for {clause_category}: Reasonable mutual obligations with defined notice periods and liability bounds."
