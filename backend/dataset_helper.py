import numpy as np
from sqlalchemy.orm import Session
from sklearn.preprocessing import StandardScaler
import models

def prepare_student_features(db: Session):
    students = db.query(models.User).filter(models.User.role == "student").all()
    
    raw_features = []
    student_ids = []

    for student in students:
        student_grades = db.query(models.Grade).filter(models.Grade.student_id == student.id).all()
        if student_grades:
            grade_avg = sum([g.score for g in student_grades]) / len(student_grades)
        else:
            grade_avg = student.grade

        total_days = db.query(models.Attendance).filter(models.Attendance.student_id == student.id).count()
        if total_days > 0:
            presents = db.query(models.Attendance).filter(
                models.Attendance.student_id == student.id, 
                models.Attendance.is_present == True
            ).count()
            attendance_rate = presents / total_days
        else:
            attendance_rate = student.attendance / 100

        raw_features.append([grade_avg, attendance_rate])
        student_ids.append(student.id)

    if not raw_features:
        return np.array([]), np.array([])

    X_raw = np.array(raw_features, dtype=np.float32)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_raw)

    return X_scaled, np.array(student_ids)