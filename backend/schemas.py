from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Optional[str] = "student"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    grade: float = 0
    attendance: float = 0
    subject: Optional[str] = None
    period: Optional[str] = None

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    grade: Optional[float] = None
    attendance: Optional[float] = None
    subject: Optional[str] = None
    period: Optional[str] = None

class StudentResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    grade: float
    attendance: float
    subject: Optional[str] = None
    period: Optional[str] = None

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


class AttendanceBase(BaseModel):
    date: Optional[date] = None
    is_present: bool = True

class AttendanceCreate(AttendanceBase):
    student_id: int
    classroom_id: int

class AttendanceResponse(BaseModel):
    id: int
    date: date
    is_present: bool
    student_id: int
    classroom_id: int
    class Config:
        from_attributes = True

# --- PREDICCIONES Y RIESGO ---
class RiskResult(BaseModel):
    student_id: int
    risk_score: float
    status: str

class RiskPredictionResponse(BaseModel):
    total_evaluated: int
    is_simulated: bool
    results: List[RiskResult]

    class Config:
        from_attributes = True