import os
import torch
import torch.nn as nn
import numpy as np

class StudentRiskModel(nn.Module):
    def __init__(self):
        super(StudentRiskModel, self).__init__()
        self.fc1 = nn.Linear(2, 8)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(8, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        out = self.sigmoid(out)
        return out

MODEL_PATH = "student_model.pth"

def predict_risk(features):
    if not os.path.exists(MODEL_PATH):
        predictions = []
        for feat in features:
            grade_avg, attendance_rate = feat[0], feat[1]
            risk = 1.0 - ((grade_avg / 100.0) * 0.6 + attendance_rate * 0.4)
            predictions.append(float(np.clip(risk, 0.0, 1.0)))
        return np.array(predictions), True

    try:
        model = StudentRiskModel()
        model.load_state_dict(torch.load(MODEL_PATH))
        model.eval()

        with torch.no_grad():
            inputs = torch.tensor(features, dtype=torch.float32)
            predictions = model(inputs)
            return predictions.numpy().flatten(), False
    except Exception:
        predictions = [0.5 for _ in range(len(features))]
        return np.array(predictions), True