from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.db.session import get_db
from app.models.feedback import Feedback

router = APIRouter(prefix="/feedback", tags=["feedback"])

class FeedbackCreate(BaseModel):
    contract_id: Optional[int] = None
    finding_id: Optional[int] = None
    rating: str  # Correct, Incorrect, Not sure
    comments: Optional[str] = None

@router.post("")
def submit_feedback(fb_in: FeedbackCreate, db: Session = Depends(get_db)):
    fb = Feedback(
        contract_id=fb_in.contract_id,
        finding_id=fb_in.finding_id,
        rating=fb_in.rating,
        comments=fb_in.comments
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return {"message": "Feedback submitted successfully.", "id": fb.id}
