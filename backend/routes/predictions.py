from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_user
from dataset_helper import prepare_student_features
from ml_model import predict_risk
import models
import schemas

router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)

@router.get("/risk", response_model=schemas.RiskPredictionResponse)
def get_students_risk(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    X_scaled, student_ids = prepare_student_features(db)

    if X_scaled.size == 0:
        raise HTTPException(status_code=404, detail="No hay datos de estudiantes para evaluar")

    predictions, is_simulated = predict_risk(X_scaled)

    results = []
    for idx, risk_score in zip(student_ids, predictions):
        results.append({
            "student_id": int(idx),
            "risk_score": float(risk_score),
            "status": "Alto Riesgo" if risk_score > 0.5 else "Bajo Riesgo"
        })

    return {
        "total_evaluated": len(results),
        "is_simulated": is_simulated,
        "results": results
    }