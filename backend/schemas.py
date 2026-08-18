from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

# --- USUARIOS ---
class UserBase(BaseModel):
    name: str
    email: str
    role: Optional[str] = "student"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- AULAS (CLASSROOMS) ---
class ClassroomBase(BaseModel):
    name: str
    description: Optional[str] = None

class ClassroomCreate(ClassroomBase):
    teacher_id: int

class ClassroomResponse(ClassroomBase):
    id: int
    teacher_id: int
    class Config:
        from_attributes = True

# --- CALIFICACIONES (GRADES) ---
class GradeBase(BaseModel):
    score: float
    evaluation_name: Optional[str] = None

class GradeCreate(GradeBase):
    student_id: int
    classroom_id: int

class GradeResponse(GradeBase):
    id: int
    student_id: int
    classroom_id: int
    class Config:
        from_attributes = True

# --- ASISTENCIA (ATTENDANCE) ---
class AttendanceBase(BaseModel):
    date: date
    is_present: bool = True

class AttendanceCreate(AttendanceBase):
    student_id: int
    classroom_id: int

class AttendanceResponse(AttendanceBase):
    id: int
    student_id: int
    classroom_id: int
    class Config:
        from_attributes = True

# --- PREDICCIONES Y RIESGO ---
class RiskPredictionResponse(BaseModel):
    student_id: int
    risk_level: str  # Ejemplo: "bajo", "medio", "alto"
    probability: float
    factors: Optional[list] = None

    class Config:
        from_attributes = True