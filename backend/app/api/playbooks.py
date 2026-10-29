from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.playbook import Playbook
from app.schemas.playbook import PlaybookResponse, PlaybookCreate

router = APIRouter(prefix="/playbooks", tags=["playbooks"])

@router.get("", response_model=List[PlaybookResponse])
def get_playbooks(db: Session = Depends(get_db)):
    playbooks = db.query(Playbook).all()
    if not playbooks:
        _seed_playbooks(db)
        playbooks = db.query(Playbook).all()
    return playbooks

@router.post("", response_model=PlaybookResponse)
def create_playbook(playbook_in: PlaybookCreate, db: Session = Depends(get_db)):
    playbook = Playbook(
        name=playbook_in.name,
        description=playbook_in.description,
        category=playbook_in.category,
        rules_count=len(playbook_in.rules or []),
        rules=playbook_in.rules,
        is_default="false"
    )
    db.add(playbook)
    db.commit()
    db.refresh(playbook)
    return playbook

def _seed_playbooks(db: Session):
    defaults = [
        {"name": "General Commercial", "description": "Standard rules for commercial contracts, service agreements, and B2B orders.", "category": "Commercial", "rules_count": 18},
        {"name": "Vendor Agreement", "description": "Strict procurement rules covering SLAs, payment terms, and vendor indemnities.", "category": "Procurement", "rules_count": 22},
        {"name": "NDA", "description": "Confidentiality playbooks defining standard exclusions, term limits, and return of materials.", "category": "Confidentiality", "rules_count": 14},
        {"name": "MSA", "description": "Master Service Agreement standards for liability caps, SOW hierarchy, and IP allocation.", "category": "Services", "rules_count": 25},
        {"name": "Freelancer Agreement", "description": "Rules for contractor work-for-hire, non-solicitation, and milestone payment schedules.", "category": "Contractor", "rules_count": 12},
        {"name": "Procurement", "description": "Enterprise buying standards, compliance requirements, and audit rights.", "category": "Enterprise", "rules_count": 20}
    ]
    for d in defaults:
        pb = Playbook(**d)
        db.add(pb)
    db.commit()
