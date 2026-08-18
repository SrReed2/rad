from sqlalchemy.orm import Session
from fastapi import HTTPException
import models
import schemas

def create_classroom(db: Session, classroom: schemas.ClassroomCreate):
    teacher = db.query(models.User).filter(models.User.id == classroom.teacher_id).first()
    if not teacher:
        raise HTTPException(
            status_code=404,
            detail="El profesor asignado no existe en el sistema"
        )
        
    if teacher.role not in ["teacher", "director"]:
        raise HTTPException(
            status_code=400,
            detail="El usuario asignado debe tener el rol de profesor o director"
        )

    new_classroom = models.Classroom(
        name=classroom.name,
        description=classroom.description,
        teacher_id=classroom.teacher_id
    )
    
    db.add(new_classroom)
    db.commit()
    db.refresh(new_classroom)
    
    return new_classroom

def get_classrooms(db: Session):
    return db.query(models.Classroom).all()