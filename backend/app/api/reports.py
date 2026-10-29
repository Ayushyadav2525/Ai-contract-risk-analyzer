import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.config import settings
from app.models.contract import Contract
from app.models.analysis import Analysis, RiskFinding
from app.services.report_service import generate_pdf_report

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("")
def list_reports(db: Session = Depends(get_db)):
    contracts = db.query(Contract).filter(Contract.status == "completed").all()
    reports = []
    for c in contracts:
        analysis = db.query(Analysis).filter(Analysis.contract_id == c.id).first()
        score = analysis.overall_score if analysis else c.risk_score
        reports.append({
            "id": c.id,
            "contract_title": c.title,
            "file_type": c.file_type,
            "risk_score": score,
            "risk_tier": c.risk_tier,
            "generated_at": c.created_at,
            "report_type": "PDF Executive Report"
        })
    return reports

@router.get("/{contract_id}/download")
def download_pdf_report(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found.")

    analysis = db.query(Analysis).filter(Analysis.contract_id == contract_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis report not found.")

    findings = db.query(RiskFinding).filter(RiskFinding.analysis_id == analysis.id).all()

    report_filename = f"Executive_Report_{contract_id}.pdf"
    report_path = os.path.join(settings.REPORT_DIR, report_filename)

    generate_pdf_report(contract, analysis, findings, report_path)

    return FileResponse(
        report_path,
        media_type="application/pdf",
        filename=f"{contract.title.replace(' ', '_')}_Executive_Risk_Report.pdf"
    )
