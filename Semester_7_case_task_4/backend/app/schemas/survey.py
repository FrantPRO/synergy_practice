from datetime import datetime
from typing import List

from pydantic import BaseModel


class SurveyBase(BaseModel):
    name: str
    description: str


class SurveyCreate(SurveyBase):
    questions: List[dict]

    class Config:
        from_attributes = True


class SurveyUpdate(SurveyBase):
    questions: List[dict]

    class Config:
        from_attributes = True


class SurveyOut(SurveyBase):
    id: int
    questions: List[dict]
    created_at: datetime

    class Config:
        from_attributes = True
