from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_user
from services import academic_service
import models
import schemas

router = APIRouter(
    prefix="/academic",
    tags=["Academic"]
)

@router.post("/grades", response_model=schemas.GradeResponse, status_code=status.HTTP_201_CREATED)
def create_grade(
    grade_data: schemas.GradeCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return academic_service.create_grade(db=db, grade_data=grade_data)

@router.post("/attendance", response_model=schemas.AttendanceResponse, status_code=status.HTTP_201_CREATED)
def register_attendance(
    attendance_data: schemas.AttendanceCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return academic_service.register_attendance(db=db, attendance_data=attendance_data)