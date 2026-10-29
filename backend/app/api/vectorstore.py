from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.contract import Contract
from app.models.clause import Clause
from app.services.embedding_service import vector_store_service

router = APIRouter(prefix="/vectorstore", tags=["vectorstore"])

@router.post("/{contract_id}")
def index_contract_in_vectorstore(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found.")
    
    clauses = db.query(Clause).filter(Clause.contract_id == contract_id).all()
    chunks = [
        {
            "original_text": c.original_text,
            "category": c.category,
            "section": c.section,
            "page_number": c.page_number
        }
        for c in clauses
    ]
    
    vector_store_service.add_chunks(contract_id, chunks)
    return {"message": f"Indexed {len(chunks)} clause chunks for contract {contract_id}."}
