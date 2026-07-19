## aca preparo los datos de la base de datos para que mi ia los pueda entender
## extraigo las notas y asistencias y las convierto en numeros limpios con scikit-learn :v

import numpy as np
from sqlalchemy.orm import Session
import models
from sklearn.preprocessing import StandardScaler

def prepare_student_features(db: Session):
    # traigo a todos los usuarios que tengan rol de estudiante
    students = db.query(models.User).filter(models.User.role == "student").all()
    
    raw_features = []
    student_ids = []

    for student in students:
        # saco el promedio de notas de este estudiante
        student_grades = db.query(models.Grade).filter(models.Grade.student_id == student.id).all()
        if student_grades:
            grade_avg = sum([g.score for g in student_grades]) / len(student_grades)
        else:
            # si el estudiante es nuevo y no tiene notas le pongo 0.0 
            grade_avg = 0.0

        # calculo su porcentaje de asistencia
        total_days = db.query(models.Attendance).filter(models.Attendance.student_id == student.id).count()
        if total_days > 0:
            presents = db.query(models.Attendance).filter(
                models.Attendance.student_id == student.id, 
                models.Attendance.is_present == True
            ).count()
            attendance_rate = presents / total_days
        else:
            # si no tiene registros asumo que tiene asistencia perfecta por defecto
            attendance_rate = 1.0

        # guardo las dos caracteristicas juntas y meto el id del alumno
        raw_features.append([grade_avg, attendance_rate])
        student_ids.append(student.id)

    # si de plano no hay alumnos guardados devuelvo arreglos vacios para evitar errores
    if not raw_features:
        return np.array([]), np.array([])

    # normalizo los datos con scikit-learn para emparejar las escalas antes de meterlos a la ia
    X_raw = np.array(raw_features, dtype=np.float32)
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_raw)

    return X_scaled, np.array(student_ids)