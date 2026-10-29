from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.contract import Contract
from app.models.clause import Clause
from app.models.analysis import Analysis, RiskFinding
from app.schemas.analysis import AnalysisResponse

router = APIRouter(tags=["analyze"])

@router.post("/analyze/{contract_id}", response_model=AnalysisResponse)
def trigger_analysis(contract_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.contract_id == contract_id).order_by(Analysis.created_at.desc()).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found for this contract.")
    return analysis

@router.get("/analysis/{contract_id}", response_model=AnalysisResponse)
def get_analysis_by_contract_id(contract_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.contract_id == contract_id).order_by(Analysis.created_at.desc()).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis report not found for this contract.")
    return analysis

@router.get("/analysis/{contract_id}/status")
def get_analysis_status(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found.")
    
    stages = [
        {"name": "Uploading document", "status": "completed"},
        {"name": "Validating file", "status": "completed"},
        {"name": "Extracting contract text", "status": "completed"},
        {"name": "Identifying clauses", "status": "completed" if contract.status == "completed" else "in_progress"},
        {"name": "Building semantic index", "status": "completed" if contract.status == "completed" else "pending"},
        {"name": "Checking risk playbook", "status": "completed" if contract.status == "completed" else "pending"},
        {"name": "Running AI analysis", "status": "completed" if contract.status == "completed" else "pending"},
        {"name": "Generating recommendations", "status": "completed" if contract.status == "completed" else "pending"},
        {"name": "Finalizing report", "status": "completed" if contract.status == "completed" else "pending"}
    ]
    
    return {
        "contract_id": contract.id,
        "status": contract.status,
        "progress_percent": 100 if contract.status == "completed" else 50,
        "stages": stages
    }

@router.get("/analysis/{contract_id}/clauses")
def get_analysis_clauses(contract_id: int, db: Session = Depends(get_db)):
    clauses = db.query(Clause).filter(Clause.contract_id == contract_id).all()
    return clauses
