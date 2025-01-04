from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import exists, and_
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt

from ..database import get_db, SessionLocal
from ..models.user import User
from ..schemas.user import UserCreate, UserOut
from ..routers.user import create_user, get_user_by_name, get_user_by_id

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@router.post("/register", response_model=UserOut)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_name(db, user.name)
    if db_user:
        raise HTTPException(status_code=400,
                            detail="Username already registered")
    return create_user(user, db)


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(get_db)):
    user = get_user_by_name(db, form_data.username)
    print(user, form_data.username, form_data.password,user.hashed_password )
    if not user or not pwd_context.verify(form_data.password,
                                          user.hashed_password):
        raise HTTPException(status_code=400,
                            detail="Incorrect username or password")
    token_data = {"sub": str(user.id), "name": user.name}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def get_current_user(token: str = Depends(oauth2_scheme),
                     db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = get_user_by_id(db, user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_user_id(token: str = Depends(oauth2_scheme)) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401,
                                detail="Invalid authentication credentials")
        return int(user_id)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def authentication(token: str = Depends(oauth2_scheme)):
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def create_first_user():
    with SessionLocal() as db:
        admin_user = db.query(User).filter(User.name == "admin").first()
        if not admin_user:
            admin_user = User()
            admin_user.name = "admin"
            admin_user.hashed_password = pwd_context.hash("admin")
            db.add(admin_user)
            db.commit()


def is_user_admin(user_id: int, db: Session) -> bool:
    return db.query(
        exists().where(
            and_(
                User.id == user_id,
                User.name == 'admin'
            )
        )
    ).scalar()
