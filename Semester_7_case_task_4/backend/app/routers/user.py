from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from ..database import get_db
from ..models.role import Role
from ..models.user import User
from ..schemas.user import UserCreate, UserOut, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/", response_model=List[UserOut])
def read_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [UserOut.from_orm_with_role(user) for user in users]


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut.from_orm_with_role(user)


@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int, user_data: UserUpdate,
                db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user_data.dict(exclude_unset=True).items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return UserOut.from_orm_with_role(user)


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return


def get_user_by_name(db: Session, name: str):
    return db.query(User).filter(User.username == name).first()


def get_user_by_id(db: Session, id: int):
    return db.query(User).filter(User.username == id).first()


def create_user(db: Session, user: UserCreate):
    db_user = User()
    db_user.username = user.username
    db_user.hashed_password = pwd_context.hash(user.password)
    db_user.role = db.query(Role).filter(Role.name == user.role).first()

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
