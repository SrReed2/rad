# Backend RAD

API REST del sistema RAD, construida con FastAPI, SQLAlchemy, PostgreSQL y PyTorch.

El backend recibe peticiones del frontend Next.js, valida datos, comprueba permisos mediante JWT y persiste información en PostgreSQL.

## Arquitectura

```text
Frontend Next.js (:3000)
          |
          | HTTP + Authorization: Bearer <JWT>
          v
FastAPI (:8000)
          |
          | SQLAlchemy
          v
PostgreSQL (:5432)
```

## Cambios realizados para conectar frontend y backend

### `app.py`

- Registra routers de autenticación, aulas, información académica, predicciones y estudiantes.
- Configura CORS para `http://localhost:3000`.
- Crea las tablas al arrancar.
- Comprueba y agrega columnas nuevas del perfil de estudiante si la base ya existía.

### `core/database.py`

- Mantiene la conexión SQLAlchemy mediante `DATABASE_URL`.
- Proporciona `get_db()` para abrir y cerrar una sesión por petición.
- Añade `ensure_user_profile_columns()` para bases antiguas con las columnas `grade`, `attendance`, `subject` y `period`.

### `core/security.py`

- Genera tokens JWT durante el login.
- Valida tokens en endpoints protegidos.
- Busca el usuario autenticado en PostgreSQL.
- Permite configurar `SECRET_KEY` y duración del token con variables de entorno.

### `models.py`

El modelo `User` incluye los datos de perfil usados por el frontend:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Integer | Identificador |
| `name` | String | Nombre completo |
| `email` | String | Correo único |
| `password_hash` | String | Contraseña cifrada |
| `role` | String | `director`, `teacher` o `student` |
| `grade` | Float | Nota del estudiante |
| `attendance` | Float | Porcentaje de asistencia |
| `subject` | String | Materia opcional |
| `period` | String | Período académico opcional |

También se mantienen las tablas `classrooms`, `grades` y `attendance` para información académica detallada.

### `schemas.py`

Se añadieron contratos Pydantic para:

- creación: `StudentCreate`;
- modificación parcial: `StudentUpdate`;
- respuesta pública: `StudentResponse`;
- predicciones: `RiskPredictionResponse` y `RiskResult`.

Las contraseñas nunca se devuelven al frontend.

### `routes/students.py`

Se añadió el CRUD:

```text
GET    /students/
POST   /students/
PATCH  /students/{student_id}
DELETE /students/{student_id}
```

El listado requiere JWT. Crear, modificar y eliminar requiere JWT y uno de estos roles:

```text
director, teacher, admin
```

Los estudiantes no pueden gestionar otros estudiantes.

### `routes/auth.py` y `services/auth_service.py`

- `POST /register` registra usuarios y cifra contraseñas con bcrypt.
- `POST /login` valida correo y contraseña.
- El login devuelve `access_token`, `token_type` y datos públicos del usuario.

### `routes/predictions.py` y `dataset_helper.py`

- `GET /predictions/risk` requiere autenticación.
- La respuesta incluye total evaluado, indicador de simulación y resultados por estudiante.
- El dataset ML usa registros detallados de notas/asistencia cuando existen.
- Si no existen registros detallados, usa `grade` y `attendance` del perfil.

## Configuración

Variables disponibles:

```env
DATABASE_URL=postgresql://raduser:1234@localhost:5432/rad_db
SECRET_KEY=una-clave-larga-y-segura
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

En Docker, el host de PostgreSQL es `db`. Al ejecutar localmente, el host normalmente es `localhost`.

En producción se debe cambiar `SECRET_KEY`, la contraseña de PostgreSQL y restringir CORS.

## Ejecutar con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

La API estará disponible en:

```text
http://localhost:8000
http://localhost:8000/docs
```

Ver logs:

```bash
docker compose logs -f backend
```

Detener servicios:

```bash
docker compose down
```

Para eliminar también los datos de PostgreSQL:

```bash
docker compose down -v
```

El último comando es destructivo porque elimina el volumen `pgdata`.

## Ejecutar localmente

Desde la raíz:

```bash
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

Configurar variables:

```bash
export DATABASE_URL="postgresql://raduser:1234@localhost:5432/rad_db"
export SECRET_KEY="una-clave-larga-y-segura"
```

Iniciar FastAPI:

```bash
cd backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## Crear el primer usuario

Desde Swagger en `/docs`, usar `POST /register`, o ejecutar:

```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Docente","email":"docente@ejemplo.com","password":"secret123","role":"teacher"}'
```

Después se puede iniciar sesión desde el frontend con ese correo y contraseña.

## Ejemplo de estudiantes

Obtener un token:

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"docente@ejemplo.com","password":"secret123"}' \
  | python -c 'import json,sys; print(json.load(sys.stdin)["access_token"])')
```

Crear estudiante:

```bash
curl -X POST http://localhost:8000/students/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana López","email":"ana@ejemplo.com","password":"student123","grade":89,"attendance":95,"subject":"Matemáticas","period":"2026-I"}'
```

Listar estudiantes:

```bash
curl http://localhost:8000/students/ \
  -H "Authorization: Bearer $TOKEN"
```

## Endpoints principales

| Método | Ruta | Autenticación | Función |
|---|---|---|---|
| `GET` | `/` | No | Estado de la API |
| `POST` | `/register` | No | Registrar usuario |
| `POST` | `/login` | No | Obtener JWT |
| `GET` | `/students/` | JWT | Listar estudiantes |
| `POST` | `/students/` | JWT + rol gestor | Crear estudiante |
| `PATCH` | `/students/{id}` | JWT + rol gestor | Editar estudiante |
| `DELETE` | `/students/{id}` | JWT + rol gestor | Eliminar estudiante |
| `POST` | `/academic/grades` | JWT | Registrar nota detallada |
| `POST` | `/academic/attendance` | JWT | Registrar asistencia detallada |
| `GET` | `/predictions/risk` | JWT | Obtener predicciones ML |
| `GET` | `/classrooms/` | No | Listar aulas |
| `POST` | `/classrooms/` | No | Crear aula |

## Cómo modificar el backend

- Tablas o columnas: `models.py` y `core/database.py`.
- Validaciones de entrada/salida: `schemas.py`.
- Autenticación y permisos: `core/security.py` y dependencias de rutas.
- Nuevos endpoints: archivos dentro de `routes/` y registro en `app.py`.
- Reglas de negocio: `services/`.
- Variables usadas por ML: `dataset_helper.py`.
- Inferencia del modelo: `ml_model.py`.

Para cambios permanentes de base de datos se recomienda crear una migración de Alembic además de actualizar el modelo SQLAlchemy.

## Pruebas

Desde la raíz:

```bash
source venv/bin/activate
pytest -q
python -m compileall -q backend
```

También se puede probar la API manualmente desde Swagger: http://localhost:8000/docs.

## Errores frecuentes

### `401 Unauthorized`

El JWT falta, expiró o no es válido. Iniciar sesión nuevamente y enviarlo como `Bearer`.

### Error de conexión a PostgreSQL

Usar `db` dentro de Docker y `localhost` al ejecutar el backend directamente.

### El frontend no conecta

Comprobar que FastAPI está activo en `http://localhost:8000` y que el frontend usa `NEXT_PUBLIC_API_URL=http://localhost:8000`.

### Columna inexistente

Reiniciar el backend para ejecutar la comprobación de columnas. En desarrollo también se puede recrear la base con `docker compose down -v` y `docker compose up --build`.
