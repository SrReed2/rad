from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from core.security import get_current_user
import models
import schemas
from services import classroom_service

router = APIRouter()

@router.post("/", response_model=schemas.ClassroomResponse, status_code=status.HTTP_201_CREATED)
def create_classroom(
    classroom: schemas.ClassroomCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "director":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los directores pueden crear aulas y asignar profesores."
        )
    return classroom_service.create_classroom(db=db, classroom=classroom)

@router.get("/", response_model=List[schemas.ClassroomResponse])
def get_classrooms(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return classroom_service.get_classrooms(db=db)