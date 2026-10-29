from typing import Dict, Any, List
from app.services.embedding_service import vector_store_service

def retrieve_playbook_context(clause_category: str, clause_text: str) -> Dict[str, Any]:
    query = f"{clause_category} risk guidance: {clause_text[:200]}"
    similar_chunks = vector_store_service.search_similar(query, top_k=3)
    
    rag_score = 30.0
    if clause_category in ["Indemnity", "Limitation of Liability", "Termination", "Non-Compete", "IP"]:
        rag_score = 75.0
    elif clause_category in ["Payment Terms", "Governing Law", "Renewal"]:
        rag_score = 50.0

    return {
        "rag_score": rag_score,
        "matched_guidance": [chunk["text"] for chunk in similar_chunks]
    }
