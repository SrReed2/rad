## aca se define como seran los datos en las tablas de la base de datos, 
## se crean las clases que representan cada tabla con sus respectivas columnas y tipos de datos :v

from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date, Boolean
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="student")   # gracias a esto ya no hay duplicado de informacion y todo es un solo registro.


class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    # panchexs el encargado del salon es un usuario con rol de teacher
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # en pocas palbrases que se le asigna la clase o numero de clase segun el id del usuario profesor


class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float, nullable=False)
    evaluation_name = Column(String, nullable=True) 

    # se le asigna la nota al estudiante segun su id de usuario
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # se especifica a qué salon pertenece esta calificacion
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today, nullable=False)
    is_present = Column(Boolean, default=True, nullable=False)

    # se registra la asistencia del estudiante segun su id de usuario
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # se especifica en que salon se esta tomando la asistencia
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)