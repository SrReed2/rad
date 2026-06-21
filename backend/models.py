## aca se define como seran los datos en las tablas de la base de datos, 
## se crean las clases que representan cada tabla, con sus respectivas columnas y tipos de datos

from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String)

class teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    classroom = Column(String)
    
class classroom(Base):
    __tablename__ = "clases"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)