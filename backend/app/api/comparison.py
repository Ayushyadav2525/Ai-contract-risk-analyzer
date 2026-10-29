from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.session import get_db
from app.models.contract import Contract
from app.models.analysis import Analysis
from app.services.comparison_service import compare_contracts

router = APIRouter(prefix="/compare", tags=["comparison"])

class CompareRequest(BaseModel):
    contract_a_id: int
    contract_b_id: int

@router.post("")
def compare_two_contracts(req: CompareRequest, db: Session = Depends(get_db)):
    cA = db.query(Contract).filter(Contract.id == req.contract_a_id).first()
    cB = db.query(Contract).filter(Contract.id == req.contract_b_id).first()
    if not cA or not cB:
        raise HTTPException(status_code=404, detail="One or both contracts not found.")

    anA = db.query(Analysis).filter(Analysis.contract_id == cA.id).first()
    anB = db.query(Analysis).filter(Analysis.contract_id == cB.id).first()
    if not anA or not anB:
        raise HTTPException(status_code=400, detail="Analyses incomplete for selected contracts.")

    return compare_contracts(cA, anA, cB, anB)
