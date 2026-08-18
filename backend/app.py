from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base
from routes import auth, classrooms, academic, predictions

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Backend - RAD")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(classrooms.router)
app.include_router(academic.router)
app.include_router(predictions.router)

@app.get("/")
def read_root():
    return {"message": "API de Gestión Académica y Predicción ML lista."}