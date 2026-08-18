import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import models
import schemas

def create_grade(db: Session, grade_data: schemas.GradeCreate):
    student = db.query(models.User).filter(models.User.id == grade_data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="El estudiante especificado no existe.")
    if student.role != "student":
        raise HTTPException(status_code=400, detail="No se le pueden asignar notas a usuarios que no sean estudiantes.")

    classroom = db.query(models.Classroom).filter(models.Classroom.id == grade_data.classroom_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="El salón de clases especificado no existe.")

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


def register_attendance(db: Session, attendance_data: schemas.AttendanceCreate):
    student = db.query(models.User).filter(models.User.id == attendance_data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="El estudiante especificado no existe.")

    classroom = db.query(models.Classroom).filter(models.Classroom.id == attendance_data.classroom_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="El salón de clases especificado no existe.")

    final_date = attendance_data.date if attendance_data.date else datetime.date.today()

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