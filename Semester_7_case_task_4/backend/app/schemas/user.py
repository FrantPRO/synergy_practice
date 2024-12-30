from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from ..models.user import User


class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: Optional[str]

    class Config:
        from_attributes = True

class UserOut(UserBase):
    id: int
    created_at: datetime
    role: Optional[str]

    @staticmethod
    def from_orm_with_role(user: User):
        user_dict = user.__dict__.copy()
        user_dict["role"] = user.role.name if user.role else None
        return UserOut(**user_dict)

    class Config:
        from_attributes = True


class UserUpdate(UserBase):
    role: str

    class Config:
        from_attributes = True


class RolesOut(BaseModel):
    name: str

    class Config:
        from_attributes = True
