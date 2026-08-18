import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import KFold
import numpy as np
from ml_model import StudentRiskModel, MODEL_PATH

def train_and_evaluate():
    # Datos simulados para entrenamiento y validación cruzada
    X = np.random.rand(100, 2).astype(np.float32)
    y = (X[:, 0] * 0.6 + X[:, 1] * 0.4 < 0.5).astype(np.float32).reshape(-1, 1)

    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    best_f1 = 0.0

    print("--- Iniciando Entrenamiento y Validación Cruzada ---")

    for fold, (train_idx, val_idx) in enumerate(kf.split(X)):
        X_train, X_val = torch.tensor(X[train_idx]), torch.tensor(X[val_idx])
        y_train, y_val = torch.tensor(y[train_idx]), torch.tensor(y[val_idx])

        model = StudentRiskModel()
        criterion = nn.BCELoss()
        optimizer = optim.Adam(model.parameters(), lr=0.01)

        # Training loop
        for epoch in range(50):
            model.train()
            optimizer.zero_grad()
            outputs = model(X_train)
            loss = criterion(outputs, y_train)
            loss.backward()
            optimizer.step()

        # Evaluación
        model.eval()
        with torch.no_grad():
            preds = model(X_val)
            preds_binary = (preds.numpy() > 0.5).astype(int)
            targets = y_val.numpy().astype(int)

            acc = accuracy_score(targets, preds_binary)
            prec = precision_score(targets, preds_binary, zero_division=0)
            rec = recall_score(targets, preds_binary, zero_division=0)
            f1 = f1_score(targets, preds_binary, zero_division=0)

            print(f"Fold {fold+1} | Acc: {acc:.2f} | Prec: {prec:.2f} | Rec: {rec:.2f} | F1: {f1:.2f}")

            if f1 >= best_f1:
                best_f1 = f1
                torch.save(model.state_dict(), MODEL_PATH)

    print(f"--- Mejor Checkpoint Guardado en {MODEL_PATH} ---")

if __name__ == "__main__":
    train_and_evaluate()