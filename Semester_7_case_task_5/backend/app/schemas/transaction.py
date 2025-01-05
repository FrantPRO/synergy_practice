from datetime import datetime
from pydantic import BaseModel


class TransactionBase(BaseModel):
    amount: float
    description: str
    category_id: int
    user_id: int


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(TransactionBase):
    pass


class TransactionOut(TransactionBase):
    id: int
    date: datetime

    class Config:
        from_attributes = True
