from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserOut, UserUpdate

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/", response_model=List[UserOut])
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.post("/", response_model=UserOut, status_code=201)
def create_user_endpoint(data: UserCreate, db: Session = Depends(get_db)):
    return create_user(data, db)


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int, user_data: UserUpdate,
                db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.name = user_data.name
    user.hashed_password = pwd_context.hash(user_data.password)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return


def get_user_by_name(db: Session, name: str):
    return db.query(User).filter(User.name == name).first()


def get_user_by_id(db: Session, id: int):
    return db.query(User).filter(User.name == id).first()


def create_user(user: UserCreate, db: Session):
    existing_user = db.query(User).filter(User.name == user.name).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail=f"User name '{user.name}' is already taken."
        )

    db_user = User()
    db_user.name = user.name
    db_user.hashed_password = pwd_context.hash(user.password)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
