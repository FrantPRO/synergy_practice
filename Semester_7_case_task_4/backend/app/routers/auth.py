from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt

from ..database import get_db, SessionLocal
from ..models.role import Role
from ..models.user import User
from ..schemas.user import UserCreate, UserOut
from ..routers.user import create_user, get_user_by_name, get_user_by_id

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Registration
@router.post("/register", response_model=UserOut)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_name(db, user.username)
    if db_user:
        raise HTTPException(status_code=400,
                            detail="Username already registered")
    return create_user(db, user)


# Login
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(get_db)):
    user = get_user_by_name(db, form_data.username)
    if not user or not pwd_context.verify(form_data.password,
                                          user.hashed_password):
        raise HTTPException(status_code=400,
                            detail="Incorrect username or password")
    token_data = {"sub": user.id, "role": user.role.name}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}


# Get current user
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
            raise HTTPException(status_code=401, detail="User not found")
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
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def authentication(token: str = Depends(oauth2_scheme)):
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role")
        if role != "admin":
            raise HTTPException(status_code=403,
                                detail="Not enough permissions")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def create_admin_user():
    with SessionLocal() as db:
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        if not admin_role:
            admin_role = Role()
            admin_role.name = "admin"
            db.add(admin_role)
            db.commit()
            db.refresh(admin_role)

        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            admin_user = User()
            admin_user.username = "admin"
            admin_user.hashed_password = pwd_context.hash("admin")
            admin_user.role_id = admin_role.id
            db.add(admin_user)
            db.commit()
