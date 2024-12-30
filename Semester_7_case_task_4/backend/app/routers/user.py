from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from ..database import get_db
from ..models.role import Role
from ..models.user import User
from ..schemas.user import UserCreate, UserOut, UserUpdate, RolesOut

router = APIRouter(prefix="/users", tags=["Users"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/", response_model=List[UserOut])
def read_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [UserOut.from_orm_with_role(user) for user in users]


@router.get("/roles", response_model=List[RolesOut])
def read_users_roles(db: Session = Depends(get_db)):
    return db.query(Role.name).distinct().all()

@router.post("/", response_model=UserOut, status_code=201)
def read_users(data: UserCreate, db: Session = Depends(get_db)):
    return UserOut.from_orm_with_role(create_user(data, db))

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

    user.username = user_data.username
    user.role = db.query(Role).filter(Role.name == user_data.role).first()

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


def create_user(user: UserCreate, db: Session):
    existing_user = db.query(User).filter(
        User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail=f"Username '{user.username}' is already taken."
        )

    db_user = User()
    db_user.username = user.username
    db_user.hashed_password = pwd_context.hash(user.password)
    db_user.role = db.query(Role).filter(Role.name == user.role).first()

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
