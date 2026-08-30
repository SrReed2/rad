import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date, Boolean
from sqlalchemy.orm import relationship
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="student")
    grade = Column(Float, default=0, nullable=False)
    attendance = Column(Float, default=0, nullable=False)
    subject = Column(String, nullable=True)
    period = Column(String, nullable=True)

    classrooms_taught = relationship("Classroom", back_populates="teacher", foreign_keys="Classroom.teacher_id")
    grades = relationship("Grade", back_populates="student", foreign_keys="Grade.student_id")
    attendances = relationship("Attendance", back_populates="student", foreign_keys="Attendance.student_id")


class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    teacher = relationship("User", back_populates="classrooms_taught", foreign_keys=[teacher_id])
    grades = relationship("Grade", back_populates="classroom", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="classroom", cascade="all, delete-orphan")


class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float, nullable=False)
    evaluation_name = Column(String, nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)

    student = relationship("User", back_populates="grades", foreign_keys=[student_id])
    classroom = relationship("Classroom", back_populates="grades", foreign_keys=[classroom_id])


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today, nullable=False)
    is_present = Column(Boolean, default=True, nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)

    student = relationship("User", back_populates="attendances", foreign_keys=[student_id])
    classroom = relationship("Classroom", back_populates="attendances", foreign_keys=[classroom_id])