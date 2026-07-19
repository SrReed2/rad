## nueva version, aca lo que hice es integrar todos los cambios que hicimos :v

from fastapi import FastAPI

from routes.auth import router as auth_router
from routes.classrooms import router as classroom_router  # 1. IMPORTAMOS el router de salones
from routes.academic import router as academic_router    # 2. IMPORTAMOS el nuevo router académico
from database import Base, engine


# crear tablas definidas en model.py
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="R.A.D API",
    description="Backend del sistema educativo inteligente R.A.D",
    version="1.0.0"
)


# ruta  de autenticacion
app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)


# ruta de salones 
app.include_router(
    classroom_router,
    prefix="/classrooms",
    tags=["Classrooms"]
)


# ruta académica 
app.include_router(
    academic_router,
)


# endpoint de prueba
@app.get("/")
def read_root():
    return {
        "message": "R.A.D backend funcionando correctamente"
    }