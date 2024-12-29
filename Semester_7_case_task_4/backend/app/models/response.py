from sqlalchemy import Column, Integer, JSON, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base

class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id", ondelete="CASCADE"), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    response = Column(JSON, default=list)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="response")
    survey = relationship("Survey", back_populates="response")
