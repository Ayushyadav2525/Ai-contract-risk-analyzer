from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class PlaybookCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    rules: Optional[List[Dict[str, Any]]] = []

class PlaybookResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: str
    rules_count: int
    rules: Optional[List[Dict[str, Any]]] = []
    is_default: str
    updated_at: datetime

    class Config:
        from_attributes = True
