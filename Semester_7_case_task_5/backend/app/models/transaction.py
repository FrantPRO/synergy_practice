from enum import Enum
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, \
    func
from sqlalchemy.orm import relationship
from ..database import Base


class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    date = Column(DateTime, default=func.now())
    type = Column(SQLEnum(TransactionType), nullable=False)

    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
