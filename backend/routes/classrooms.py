from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal
import models
import schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ruta para crear un nuevo salón de clases
@router.post("/", response_model=schemas.ClassroomResponse)
def create_classroom(classroom: schemas.ClassroomCreate, db: Session = Depends(get_db)):
    
    # Verificar si el profesor asignado realmente existe en la tabla de usurios
    teacher = db.query(models.User).filter(models.User.id == classroom.teacher_id).first()
    if not teacher:
        raise HTTPException(
            status_code=404,
            detail="El profesor asignado no existe en el sistema"
        )
        
    # Verificar que el usuario asignado realmente temga el rol de profesor o director
    if teacher.role not in ["teacher", "director"]:
        raise HTTPException(
            status_code=400,
            detail="El usuario asignado debe tener el rol de profesor o director"
        )

    # si todo eso esta bien entonces se crea el nuevo salon de clases
    new_classroom = models.Classroom(
        name=classroom.name,
        description=classroom.description,
        teacher_id=classroom.teacher_id
    )
    
    db.add(new_classroom)
    db.commit()
    db.refresh(new_classroom)
    
    return new_classroom


# ruta para obtener todos los salones de clases 
@router.get("/", response_model=List[schemas.ClassroomResponse])
def get_classrooms(db: Session = Depends(get_db)):
    classrooms = db.query(models.Classroom).all()
    return classrooms