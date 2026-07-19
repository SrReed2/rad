## aca se maneja que datos se van a recibir y enviar, que se permite y que no
## se valida la informacion ojo aca no guarda nada solo valida la informacion :v

from pydantic import BaseModel, EmailStr
from typing import Optional
from pydantic import Field
import datetime

# schemas para usuarios

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "student"  # puede ser estudiante etc... pero su valor por ddefecto es estudiantes

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True  # esto es para que se pueda convertir el modelo de la base de datos a un modelo de respuesta

# schemas para salonde de clases

class ClassroomCreate(BaseModel):
    name: str
    description: Optional[str] = None 
    teacher_id: int #  id del profesor numerico

class ClassroomResponse(BaseModel):
    id: int 
    name: str
    description: Optional[str] 
    teacher_id: int 

    class Config:
        from_attributes = True  # esto es para que se pueda convertir el modelo de la base de datos a un modelo de respuesta

# schemas para notas

class GradeCreate(BaseModel):
    score: float = Field(..., ge=0.0, le=100.0) # la nota debe ser entre 0.0 y 100.0 obligatoriamente
    evaluation_name: Optional[str] = None 
    student_id: int # id del estudiante al que pertenece la nota
    classroom_id: int # id del salón al que pertenece la materia

class GradeResponse(BaseModel):
    id: int
    score: float
    evaluation_name: Optional[str]
    student_id: int
    classroom_id: int

    class Config:
        from_attributes = True


# schemas para asistencia

class AttendanceCreate(BaseModel):
    student_id: int # id del estudiante
    classroom_id: int # id del salon
    is_present: Optional[bool] = True # por defecto asistio, si no se envía cambia a False
    date: Optional[datetime.date] = None # si no se envia, el controlador asignara la fecha de hoy

class AttendanceResponse(BaseModel):
    id: int
    date: datetime.date
    is_present: bool
    student_id: int
    classroom_id: int

    class Config:
        from_attributes = True

# espero le entiendan panchex por si andan de curiosos :v aca siempre les aclaro un poco que hace cada cosa :)