from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base, ensure_user_profile_columns
from routes import auth, classrooms, academic, predictions
from routes import students

Base.metadata.create_all(bind=engine)
ensure_user_profile_columns()

app = FastAPI(title="API Backend - RAD")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(classrooms.router, prefix="/classrooms", tags=["Classrooms"])
app.include_router(academic.router)
app.include_router(predictions.router)
app.include_router(students.router)

@app.get("/")
def read_root():
    return {"message": "API de Gestión Académica y Predicción ML lista."}