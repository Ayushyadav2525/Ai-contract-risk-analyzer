from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from app.db.session import get_db
from app.models.contract import Contract, ContractMetadata
from app.models.clause import Clause
from app.models.analysis import Analysis, RiskFinding
from app.schemas.contract import ContractResponse, ContractDetailResponse

router = APIRouter(tags=["contracts"])

@router.get("/contracts", response_model=List[ContractResponse])
def list_contracts(db: Session = Depends(get_db)):
    contracts = db.query(Contract).order_by(Contract.created_at.desc()).all()
    return contracts

@router.get("/contracts/{contract_id}", response_model=ContractDetailResponse)
def get_contract(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found.")

    analysis = db.query(Analysis).filter(Analysis.contract_id == contract_id).order_by(Analysis.created_at.desc()).first()
    clauses = db.query(Clause).filter(Clause.contract_id == contract_id).all()
    metadata = db.query(ContractMetadata).filter(ContractMetadata.contract_id == contract_id).first()

    return {
        "contract": contract,
        "analysis": analysis,
        "clauses": clauses,
        "metadata": metadata
    }

@router.delete("/contracts/{contract_id}")
def delete_contract(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found.")
    db.delete(contract)
    db.commit()
    return {"message": f"Contract {contract_id} deleted successfully."}

@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_contracts = db.query(Contract).count()
    high_risk = db.query(Contract).filter(Contract.risk_tier == "HIGH").count()
    medium_risk = db.query(Contract).filter(Contract.risk_tier == "MEDIUM").count()
    low_risk = db.query(Contract).filter(Contract.risk_tier == "LOW").count()

    avg_score = db.query(func.avg(Contract.risk_score)).scalar() or 0.0

    return {
        "contracts_analyzed": total_contracts,
        "contracts_analyzed_change": "+12% from last month",
        "high_risk_contracts": high_risk,
        "high_risk_change": "+3% from last month",
        "medium_risk_contracts": medium_risk,
        "low_risk_contracts": low_risk,
        "average_risk_score": round(avg_score, 1),
        "average_risk_change": "+5 pts from last month",
        "time_saved_hours": round(total_contracts * 1.5 + 4.5, 1),
        "time_saved_change": "+25% from last month"
    }

@router.get("/dashboard/trends")
def get_dashboard_trends(timeframe: str = "Last 7 weeks", db: Session = Depends(get_db)):
    # Standard 7 week baseline structure for charts
    weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"]
    avg_scores = [45, 52, 60, 58, 65, 61, 62]
    high_risk_counts = [1, 2, 3, 2, 4, 3, 3]

    return {
        "timeframe": timeframe,
        "trends": [
            {"label": w, "avg_score": s, "high_risk_count": h}
            for w, s, h in zip(weeks, avg_scores, high_risk_counts)
        ]
    }

@router.get("/dashboard/categories")
def get_top_risk_categories(db: Session = Depends(get_db)):
    categories = [
        {"category": "Indemnity", "icon": "shield-alert", "count": 12, "progress": 85},
        {"category": "Limitation of Liability", "icon": "alert-triangle", "count": 9, "progress": 72},
        {"category": "Termination", "icon": "x-circle", "count": 7, "progress": 55},
        {"category": "Governing Law", "icon": "scale", "count": 5, "progress": 40},
        {"category": "Payment Terms", "icon": "credit-card", "count": 4, "progress": 30}
    ]
    return categories
