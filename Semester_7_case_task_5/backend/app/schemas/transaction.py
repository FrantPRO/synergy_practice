from enum import Enum
from datetime import datetime
from pydantic import BaseModel


class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"


class TransactionBase(BaseModel):
    amount: float
    description: str
    category_id: int
    user_id: int
    date: datetime
    type: TransactionType


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(TransactionBase):
    pass


class TransactionOut(TransactionBase):
    id: int
    date: datetime

    class Config:
        from_attributes = True
