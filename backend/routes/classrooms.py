from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from services import classroom_service
import schemas

router = APIRouter()

@router.post("/", response_model=schemas.ClassroomResponse)
def create_classroom(classroom: schemas.ClassroomCreate, db: Session = Depends(get_db)):
    return classroom_service.create_classroom(db=db, classroom=classroom)

@router.get("/", response_model=List[schemas.ClassroomResponse])
def get_classrooms(db: Session = Depends(get_db)):
    return classroom_service.get_classrooms(db=db)