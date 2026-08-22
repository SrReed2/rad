from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
import models
import schemas

router = APIRouter(prefix="/students", tags=["Students"])


def require_manager(current_user: models.User) -> models.User:
    if current_user.role not in {"teacher", "director", "admin"}:
        raise HTTPException(status_code=403, detail="No tienes permisos para gestionar estudiantes")
    return current_user


@router.get("/", response_model=List[schemas.StudentResponse])
def get_students(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.User).filter(models.User.role == "student").all()


@router.post("/", response_model=schemas.StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(
    student: schemas.StudentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_manager(current_user)
    if db.query(models.User).filter(models.User.email == student.email).first():
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    from services.auth_service import get_password_hash
    new_student = models.User(
        name=student.name,
        email=student.email,
        password_hash=get_password_hash(student.password),
        role="student",
        grade=student.grade,
        attendance=student.attendance,
        subject=student.subject,
        period=student.period,
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student


@router.patch("/{student_id}", response_model=schemas.StudentResponse)
def update_student(
    student_id: int,
    student: schemas.StudentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_manager(current_user)
    existing = db.query(models.User).filter(
        models.User.id == student_id, models.User.role == "student"
    ).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    if student.email and db.query(models.User).filter(
        models.User.email == student.email, models.User.id != student_id
    ).first():
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    for field, value in student.model_dump(exclude_unset=True).items():
        setattr(existing, field, value)
    db.commit()
    db.refresh(existing)
    return existing


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    require_manager(current_user)
    existing = db.query(models.User).filter(
        models.User.id == student_id, models.User.role == "student"
    ).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    db.delete(existing)
    db.commit()