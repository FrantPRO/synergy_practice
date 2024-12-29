from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, func
from sqlalchemy.orm import relationship

from ..database import Base

class Survey(Base):
    __tablename__ = "surveys"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    questions = Column(JSON, default=list)
    created_at = Column(DateTime, default=func.now())

    responses = relationship("Response", back_populates="survey")
