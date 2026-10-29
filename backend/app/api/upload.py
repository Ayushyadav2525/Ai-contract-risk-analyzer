import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.config import settings
from app.models.contract import Contract, ContractMetadata
from app.models.clause import Clause
from app.models.analysis import Analysis, RiskFinding
from app.services.document_parser import extract_document_text
from app.services.metadata_extractor import extract_metadata
from app.services.clause_extractor import extract_clauses
from app.services.risk_engine import compute_composite_risk_score
from app.services.redline_service import generate_redline_suggestion

router = APIRouter(prefix="/upload", tags=["upload"])

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

@router.post("", status_code=201)
async def upload_contract(file: UploadFile = File(...), db: Session = Depends(get_db)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Supported formats: PDF, DOCX."
        )

    # Secure unique file path to avoid traversal attacks
    safe_filename = f"{uuid.uuid4().hex}_{os.path.basename(file.filename)}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size exceeds 50MB limit.")
        buffer.write(content)

    file_size = os.path.getsize(file_path)

    # Create Contract DB entry
    contract = Contract(
        title=file.filename.rsplit(".", 1)[0].replace("_", " ").title(),
        filename=file.filename,
        file_path=file_path,
        file_type=ext.replace(".", ""),
        file_size=file_size,
        status="extracting"
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)

    try:
        # Step 1: Extract Document Text & Structure
        parsed_doc = extract_document_text(file_path)
        full_text = parsed_doc["full_text"]
        pages = parsed_doc["pages"]

        # Step 2: Extract Metadata
        meta_dict = extract_metadata(full_text, file.filename)
        contract_meta = ContractMetadata(
            contract_id=contract.id,
            **meta_dict
        )
        db.add(contract_meta)

        # Step 3: Clause Extraction
        extracted_clauses = extract_clauses(full_text, pages)

        # Step 4: Hybrid Risk Analysis Engine
        risk_res = compute_composite_risk_score(full_text, extracted_clauses, meta_dict)

        contract.risk_score = risk_res["overall_score"]
        contract.risk_tier = risk_res["risk_tier"]
        contract.health_score = risk_res["health_score"]
        contract.status = "completed"
        db.commit()

        # Save Analysis
        analysis = Analysis(
            contract_id=contract.id,
            overall_score=risk_res["overall_score"],
            risk_tier=risk_res["risk_tier"],
            rule_score=risk_res["rule_score"],
            llm_score=risk_res["llm_score"],
            rag_score=risk_res["rag_score"],
            executive_summary=risk_res["executive_summary"],
            negotiation_priorities=risk_res["negotiation_priorities"],
            is_demo=risk_res["is_demo"]
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        # Save Risk Findings & Clauses
        for f in risk_res["findings"]:
            finding = RiskFinding(
                analysis_id=analysis.id,
                rule_id=f.get("rule_id"),
                category=f["category"],
                title=f["title"],
                risk_level=f["risk_level"],
                score=f["score"],
                confidence=f.get("confidence", 90.0),
                explanation=f.get("explanation"),
                business_impact=f.get("business_impact"),
                negotiation_recommendation=f.get("negotiation_recommendation"),
                redline_suggestion=f.get("redline_suggestion"),
                page=f.get("page", 1),
                section=f.get("section", "Clause")
            )
            db.add(finding)

        for c in extracted_clauses:
            r_level = "LOW"
            r_score = 20.0
            for f in risk_res["findings"]:
                if f["category"] == c["category"]:
                    r_level = f["risk_level"]
                    r_score = f["score"]

            redline = generate_redline_suggestion(c["category"], c["original_text"]) if r_level in ["HIGH", "MEDIUM"] else None
            clause_obj = Clause(
                contract_id=contract.id,
                section=c.get("section"),
                page_number=c.get("page_number", 1),
                category=c["category"],
                original_text=c["original_text"],
                risk_level=r_level,
                risk_score=r_score,
                confidence=90.0,
                explanation=f"Clause evaluated under {c['category']} standards.",
                suggested_redline=redline
            )
            db.add(clause_obj)

        db.commit()

        return {
            "message": "File uploaded and analyzed successfully.",
            "contract_id": contract.id,
            "status": "completed",
            "risk_score": contract.risk_score,
            "risk_tier": contract.risk_tier
        }

    except Exception as e:
        contract.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Contract processing error: {str(e)}")
