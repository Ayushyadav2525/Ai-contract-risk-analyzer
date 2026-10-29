from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.contract import Contract
from app.services.document_parser import extract_document_text

router = APIRouter(prefix="/parse", tags=["parse"])

@router.post("/{contract_id}")
def parse_contract_by_id(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found.")
    
    parsed = extract_document_text(contract.file_path)
    return {
        "contract_id": contract.id,
        "page_count": parsed["page_count"],
        "snippet": parsed["full_text"][:500]
    }
