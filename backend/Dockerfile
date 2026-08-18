FROM python:3.13-slim

WORKDIR /app

# 1. Copiar SOLO el archivo de requerimientos primero (Aprovecha el caché)
COPY requirements.txt .

# 2. Instalar dependencias sin guardar caché temporal de pip
RUN pip install --no-cache-dir -r requirements.txt

# 3. Copiar el resto del código del proyecto
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]