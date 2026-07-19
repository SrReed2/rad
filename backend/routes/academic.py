from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import datetime

router = APIRouter(
    prefix="/academic",
    tags=["Academic"]
)

# endpoint para notas (grades)

@router.post("/grades", response_model=schemas.GradeResponse, status_code=status.HTTP_201_CREATED)
def create_grade(grade_data: schemas.GradeCreate, db: Session = Depends(get_db)):
    # 1. validar que el estudiante este 
    student = db.query(models.User).filter(models.User.id == grade_data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="El estudiante especificado no existe.")
    if student.role != "student":
        raise HTTPException(status_code=400, detail="No se le pueden asignar notas a usuarios que no sean estudiantes.")

    # 2. validar que el salon de clases este
    classroom = db.query(models.Classroom).filter(models.Classroom.id == grade_data.classroom_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="El salón de clases especificado no existe.")

    # 3. guardar en la base de datos si todo está en orden
    new_grade = models.Grade(
        score=grade_data.score,
        evaluation_name=grade_data.evaluation_name,
        student_id=grade_data.student_id,
        classroom_id=grade_data.classroom_id
    )
    db.add(new_grade)
    db.commit()
    db.refresh(new_grade)
    return new_grade

# endpoint para asistencia (attendance)

@router.post("/attendance", response_model=schemas.AttendanceResponse, status_code=status.HTTP_201_CREATED)
def register_attendance(attendance_data: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    # 1. validar existencia del estudiante
    student = db.query(models.User).filter(models.User.id == attendance_data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="El estudiante especificado no existe.")

    # 2. validar existencia del salon
    classroom = db.query(models.Classroom).filter(models.Classroom.id == attendance_data.classroom_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="El salón de clases especificado no existe.")

    # 3. asignar fecha por defecto si no viene en la peticion
    final_date = attendance_data.date if attendance_data.date else datetime.date.today()

    # 4. registrar la asistencia
    new_attendance = models.Attendance(
        date=final_date,
        is_present=attendance_data.is_present,
        student_id=attendance_data.student_id,
        classroom_id=attendance_data.classroom_id
    )
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance