from sqlalchemy import Column, Integer, JSON, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base

class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"), index=True, ondelete="CASCADE")
    user_id = Column(Integer, ForeignKey("users.id"), index=True, ondelete="CASCADE")
    response = Column(JSON, default=list)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="responses")
    survey = relationship("Survey", back_populates="responses")
