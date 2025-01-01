from datetime import datetime
from typing import List, Any, Dict

from pydantic import BaseModel, Field


class ResponseOut(BaseModel):
    id: int
    survey_id: int
    user_id: int
    response: List[Dict[str, Any]]
    created_at: datetime


# Модель для валидации отдельного ответа
class ResponseItem(BaseModel):
    question_id: int
    answer: Any


# Модель для входящих данных
class ResponseCreate(BaseModel):
    responses: List[ResponseItem] = Field(..., min_length=1)  # как минимум 1 ответ должен быть
