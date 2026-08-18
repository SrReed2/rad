from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from services import auth_service
import schemas

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return auth_service.register_user(db=db, user=user)

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    return auth_service.authenticate_user(db=db, user=user)