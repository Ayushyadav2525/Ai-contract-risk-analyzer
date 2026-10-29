import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import docx

# Ensure backend path is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal, engine, Base
from app.models.user import User
from app.models.contract import Contract, ContractMetadata
from app.models.clause import Clause
from app.models.analysis import Analysis, RiskFinding
from app.models.playbook import Playbook
from app.core.security import get_password_hash

SAMPLE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "sample_contracts")
os.makedirs(SAMPLE_DIR, exist_ok=True)

def create_sample_pdf(filepath: str, title: str, content: str):
    doc = SimpleDocTemplate(filepath, pagesize=letter)
    styles = getSampleStyleSheet()
    story = [
        Paragraph(f"<b>{title}</b>", styles['Heading1']),
        Spacer(1, 15)
    ]
    for para in content.split("\n\n"):
        if para.strip():
            story.append(Paragraph(para.strip(), styles['BodyText']))
            story.append(Spacer(1, 10))
    doc.build(story)

def create_sample_docx(filepath: str, title: str, content: str):
    doc = docx.Document()
    doc.add_heading(title, level=1)
    for para in content.split("\n\n"):
        if para.strip():
            doc.add_paragraph(para.strip())
    doc.save(filepath)

def generate_sample_documents():
    # 1. MSA PDF
    msa_text = """MASTER SERVICE AGREEMENT

1. SERVICES AND DELIVERABLES
Supplier shall provide IT consulting services to Customer as outlined in Statements of Work.

2. INDEMNIFICATION
Supplier shall indemnify, defend, and hold harmless Customer against any and all third-party losses, liabilities, claims, and expenses without limitation arising out of any breach or performance under this Agreement.

3. LIMITATION OF LIABILITY
IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR CONSEQUENTIAL OR INDIRECT LOSSES. CUSTOMER'S MAXIMUM AGGREGATE LIABILITY SHALL NOT EXCEED TOTAL FEES PAID IN THE LAST 12 MONTHS. SUPPLIER'S LIABILITY SHALL NOT BE LIMITED.

4. TERMINATION
Customer may terminate this Agreement without cause at any time upon 7 days prior notice. Supplier may only terminate upon 90 days written notice for material breach."""
    create_sample_pdf(os.path.join(SAMPLE_DIR, "Master_Service_Agreement.pdf"), "MASTER SERVICE AGREEMENT", msa_text)

    # 2. NDA DOCX
    nda_text = """MUTUAL NON-DISCLOSURE AGREEMENT

1. CONFIDENTIAL INFORMATION
Confidential Information includes all proprietary software code, financial projections, and customer lists disclosed by either party.

2. OBLIGATIONS
Receiving party agrees to hold Confidential Information in strict confidence for a period of 5 years.

3. GOVERNING LAW AND VENUE
This Agreement shall be governed by the laws of the Cayman Islands, and disputes shall be exclusively submitted to courts in George Town."""
    create_sample_docx(os.path.join(SAMPLE_DIR, "NDA_Acme_Corp.docx"), "MUTUAL NON-DISCLOSURE AGREEMENT", nda_text)

    # 3. Service Agreement DOCX
    svc_text = """COMMERCIAL SERVICE AGREEMENT

1. SCOPE OF WORK
Provider agrees to deliver web application maintenance and support services.

2. PAYMENT TERMS
Invoices are payable Net 30 days. Late payments shall incur a monthly interest fee of 1.5%.

3. INTELLECTUAL PROPERTY
All Background IP remains the property of Provider. Custom deliverables belong to Customer upon full payment."""
    create_sample_docx(os.path.join(SAMPLE_DIR, "Service_Agreement.docx"), "COMMERCIAL SERVICE AGREEMENT", svc_text)

    # 4. MSA GlobalTech PDF
    msa_global_text = """GLOBAL TECH SERVICES AGREEMENT

1. TERM AND RENEWAL
This Agreement shall automatically renew for successive 1-year terms unless non-renewal notice is given at least 90 days prior to term end.

2. NON-COMPETE
Contractor agrees not to engage in any competing business worldwide for a period of 2 years following contract termination."""
    create_sample_pdf(os.path.join(SAMPLE_DIR, "MSA_GlobalTech.pdf"), "GLOBAL TECH SERVICES AGREEMENT", msa_global_text)

    # 5. Partnership Agreement DOCX
    partner_text = """STRATEGIC PARTNERSHIP AGREEMENT

1. INDEMNITY EXPOSURE
Partner A agrees to fully indemnify Partner B for all operational liabilities, indirect damages, and attorneys' fees without limitation.

2. DISPUTE RESOLUTION
All disputes shall be subject to binding arbitration under foreign rules with costs borne equally."""
    create_sample_docx(os.path.join(SAMPLE_DIR, "Partnership_Agreement.docx"), "STRATEGIC PARTNERSHIP AGREEMENT", partner_text)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Create admin user
    user = db.query(User).filter(User.email == "ayush@contractai.com").first()
    if not user:
        user = User(
            email="ayush@contractai.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Ayush Yadav",
            role="Admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Seed Contracts matching Recent Contracts UI reference:
    demo_contracts = [
        {"title": "Master Service Agreement.pdf", "filename": "Master_Service_Agreement.pdf", "file_type": "pdf", "file_size": 245000, "risk_score": 78.0, "risk_tier": "HIGH", "health_score": 22.0},
        {"title": "NDA – Acme Corp.docx", "filename": "NDA_Acme_Corp.docx", "file_type": "docx", "file_size": 128000, "risk_score": 54.0, "risk_tier": "MEDIUM", "health_score": 46.0},
        {"title": "Service Agreement.docx", "filename": "Service_Agreement.docx", "file_type": "docx", "file_size": 95000, "risk_score": 28.0, "risk_tier": "LOW", "health_score": 72.0},
        {"title": "MSA – GlobalTech.pdf", "filename": "MSA_GlobalTech.pdf", "file_type": "pdf", "file_size": 310000, "risk_score": 49.0, "risk_tier": "MEDIUM", "health_score": 51.0},
        {"title": "Partnership Agreement.docx", "filename": "Partnership_Agreement.docx", "file_type": "docx", "file_size": 180000, "risk_score": 81.0, "risk_tier": "HIGH", "health_score": 19.0}
    ]

    for c in demo_contracts:
        existing = db.query(Contract).filter(Contract.filename == c["filename"]).first()
        if not existing:
            fpath = os.path.join(SAMPLE_DIR, c["filename"])
            contract = Contract(
                title=c["title"],
                filename=c["filename"],
                file_path=fpath if os.path.exists(fpath) else os.path.join(SAMPLE_DIR, "Master_Service_Agreement.pdf"),
                file_type=c["file_type"],
                file_size=c["file_size"],
                status="completed",
                risk_score=c["risk_score"],
                risk_tier=c["risk_tier"],
                health_score=c["health_score"],
                user_id=user.id
            )
            db.add(contract)
            db.commit()
            db.refresh(contract)

            meta = ContractMetadata(
                contract_id=contract.id,
                title=c["title"],
                contract_type="MSA" if "MSA" in c["title"] else "NDA" if "NDA" in c["title"] else "General Commercial",
                parties="Acme Corp and GlobalTech Inc.",
                effective_date="October 1, 2026",
                expiration_date="October 1, 2027",
                governing_law="Delaware, USA",
                jurisdiction="Courts of Delaware",
                payment_terms="Net 30",
                notice_period="30 Days Written Notice"
            )
            db.add(meta)

            analysis = Analysis(
                contract_id=contract.id,
                overall_score=c["risk_score"],
                risk_tier=c["risk_tier"],
                rule_score=c["risk_score"] + 2.0,
                llm_score=c["risk_score"] - 1.0,
                rag_score=c["risk_score"] - 5.0,
                executive_summary=f"This contract presents elevated risk primarily due to broad indemnification obligations, an uncapped limitation of liability exception, and unilateral termination rights.",
                negotiation_priorities=[
                    {"rank": 1, "title": "Cap indemnification exposure", "category": "Indemnity", "risk_level": "HIGH", "recommendation": "Negotiate cap to 1x contract value."},
                    {"rank": 2, "title": "Make termination rights mutual", "category": "Termination", "risk_level": "HIGH", "recommendation": "Add 30-day reciprocal notice requirement."},
                    {"rank": 3, "title": "Narrow non-compete scope", "category": "Non-Compete", "risk_level": "MEDIUM", "recommendation": "Limit non-compete to 6 months in direct territories."}
                ],
                is_demo="true"
            )
            db.add(analysis)
            db.commit()
            db.refresh(analysis)

            # Add demo findings
            finding = RiskFinding(
                analysis_id=analysis.id,
                rule_id="RULE_INDEMNITY_UNCAPPED",
                category="Indemnity",
                title="Broad or Uncapped Indemnification",
                risk_level="HIGH",
                score=85.0,
                confidence=95.0,
                explanation="Clause requires broad indemnification covering 'any and all' losses without liability cap.",
                business_impact="Severe financial exposure if third party claim occurs.",
                negotiation_recommendation="Cap indemnification exposure to direct losses.",
                redline_suggestion="Replace broad wording with: 'Each party shall indemnify the other against direct losses arising from gross negligence.'",
                page=1,
                section="Section 2.1"
            )
            db.add(finding)

            # Add demo clause
            clause = Clause(
                contract_id=contract.id,
                section="Section 2.1",
                page_number=1,
                category="Indemnity",
                original_text="The Supplier shall indemnify, defend, and hold harmless the Customer against any and all losses, liabilities, claims, and expenses without limitation.",
                risk_level="HIGH",
                risk_score=85.0,
                confidence=95.0,
                explanation="Uncapped indemnification clause.",
                business_impact="Financial exposure beyond fee values.",
                recommendation="Cap indemnification to direct losses.",
                suggested_redline="The Supplier shall indemnify the Customer against direct losses arising from gross negligence, subject to Section 12 liability limits."
            )
            db.add(clause)
            db.commit()

    db.close()
    print("[Seed] Synthetic sample documents and database seeded successfully!")

if __name__ == "__main__":
    generate_sample_documents()
    seed_database()
