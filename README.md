# RAD - Risk Analysis Dashboard

Sistema web para gestionar estudiantes, consultar indicadores académicos y calcular predicciones de riesgo.

## 1. Arquitectura

```text
Navegador / Next.js (:3000)
          |
          | HTTP + JWT
          v
FastAPI (:8000)
          |
          | SQLAlchemy
          v
PostgreSQL (:5432)
```

El proyecto tiene dos aplicaciones:

- `frontend/`: aplicación Next.js, React, TypeScript y Tailwind.
- `backend/`: API FastAPI, SQLAlchemy, PostgreSQL y modelo ML.
- `docker-compose.yaml`: orquesta frontend, backend y base de datos.

Los estudiantes se almacenan como usuarios con `role = "student"`. Su perfil contiene nombre, nota, asistencia, materia y período. Las tablas `grades` y `attendance` guardan registros académicos detallados.

## 2. Requisitos

### Opción recomendada: Docker

- Docker
- Docker Compose

### Desarrollo sin Docker

- Python 3.10 o superior
- Node.js 18 o superior
- npm
- PostgreSQL accesible localmente

## 3. Ejecutar con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Servicios disponibles:

- Frontend: http://localhost:3000
- API: http://localhost:8000
- Swagger: http://localhost:8000/docs
- PostgreSQL: `localhost:5432`

Para detener los servicios:

```bash
docker compose down
```

Para detenerlos y eliminar también los datos de PostgreSQL:

```bash
docker compose down -v
```

El último comando es destructivo: borra el volumen `pgdata`.

Ver logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

## 4. Ejecutar sin Docker

### Backend

Crear o activar el entorno virtual:

```bash
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

Configurar la conexión local a PostgreSQL:

```bash
export DATABASE_URL="postgresql://raduser:1234@localhost:5432/rad_db"
export SECRET_KEY="una-clave-larga-para-desarrollo"
```

Iniciar FastAPI:

```bash
cd backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

En Windows PowerShell, usar:

```powershell
$env:DATABASE_URL = "postgresql://raduser:1234@localhost:5432/rad_db"
$env:SECRET_KEY = "una-clave-larga-para-desarrollo"
```

### Frontend

En otra terminal:

```bash
cd frontend
npm install
```

Crear `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Iniciar Next.js:

```bash
npm run dev
```

## 5. Base de datos

La configuración principal está en `backend/core/database.py`.

La variable `DATABASE_URL` tiene prioridad. Si no existe, el backend usa por defecto:

```text
postgresql://raduser:1234@db:5432/rad_db
```

Dentro de Docker, `db` es el nombre del servicio PostgreSQL. Desde el equipo local se debe usar `localhost`.

Las tablas se crean al iniciar FastAPI. El backend también comprueba y agrega las columnas nuevas del perfil de estudiante cuando encuentra una base creada con una versión anterior.

Credenciales de PostgreSQL usadas por Docker:

```text
Usuario: raduser
Contraseña: 1234
Base: rad_db
Puerto: 5432
```

Para cambiar estas credenciales, modifica `docker-compose.yaml` y también `DATABASE_URL`.

## 6. Autenticación

El frontend inicia sesión llamando a:

```text
POST /login
```

Cuerpo:

```json
{
  "email": "docente@ejemplo.com",
  "password": "secret123"
}
```

La respuesta contiene un JWT:

```json
{
  "access_token": "...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Docente",
    "email": "docente@ejemplo.com",
    "role": "teacher"
  }
}
```

El token se guarda en el navegador como `rad_token` y se envía automáticamente en cada petición mediante:

```text
Authorization: Bearer <token>
```

Para crear el primer usuario se puede usar Swagger (`/docs`) o ejecutar una petición:

```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Docente","email":"docente@ejemplo.com","password":"secret123","role":"teacher"}'
```

Los roles principales son `director`, `teacher` y `student`. Solo `director`, `teacher` y `admin` pueden crear, modificar o eliminar estudiantes.

## 7. Endpoints principales

Todos los endpoints protegidos necesitan el encabezado `Authorization`.

| Método | Ruta | Uso | Protección |
|---|---|---|---|
| `GET` | `/` | Comprobar que la API está activa | No |
| `POST` | `/register` | Registrar usuario | No |
| `POST` | `/login` | Iniciar sesión | No |
| `GET` | `/students/` | Listar estudiantes | JWT |
| `POST` | `/students/` | Crear estudiante | JWT + rol gestor |
| `PATCH` | `/students/{id}` | Actualizar estudiante | JWT + rol gestor |
| `DELETE` | `/students/{id}` | Eliminar estudiante | JWT + rol gestor |
| `POST` | `/academic/grades` | Registrar calificación detallada | JWT |
| `POST` | `/academic/attendance` | Registrar asistencia detallada | JWT |
| `POST` | `/classrooms/` | Crear aula | No actualmente |
| `GET` | `/classrooms/` | Listar aulas | No actualmente |
| `GET` | `/predictions/risk` | Obtener riesgo ML | JWT |

La documentación interactiva completa está en http://localhost:8000/docs.

## 8. Cómo funciona el frontend

### Cliente API

`frontend/lib/api.ts` centraliza las peticiones HTTP. Lee `NEXT_PUBLIC_API_URL`, agrega `Content-Type` y adjunta el JWT guardado en `localStorage`.

### Sesión

`frontend/context/AuthContext.tsx`:

- inicia sesión contra FastAPI;
- guarda y restaura el usuario;
- guarda el token;
- elimina la sesión al cerrar sesión.

### Estudiantes

`frontend/context/StudentsContext.tsx`:

- carga estudiantes desde `GET /students/`;
- crea mediante `POST /students/`;
- actualiza mediante `PATCH /students/{id}`;
- elimina mediante `DELETE /students/{id}`.

Las páginas de estudiantes, asistencia, dashboard y predicciones consumen este contexto.

### Predicciones

`frontend/app/predictions/page.tsx` consulta `/predictions/risk`. Si el backend todavía no tiene suficientes registros ML, la pantalla conserva un cálculo visual de respaldo basado en nota y asistencia.

## 9. Dónde modificar cada cosa

### Cambiar la interfaz

- Rutas/pantallas: `frontend/app/`
- Componentes reutilizables: `frontend/components/`
- Sesión: `frontend/context/AuthContext.tsx`
- Estudiantes: `frontend/context/StudentsContext.tsx`
- URL de API: `frontend/lib/api.ts` o `frontend/.env.local`
- Estilos globales: `frontend/app/globals.css`

### Cambiar la API

- Entrada de FastAPI: `backend/app.py`
- Modelos de base de datos: `backend/models.py`
- Validación de requests/responses: `backend/schemas.py`
- Conexión a PostgreSQL: `backend/core/database.py`
- JWT y permisos: `backend/core/security.py`
- Endpoints: `backend/routes/`
- Reglas de negocio: `backend/services/`
- Preparación de datos ML: `backend/dataset_helper.py`
- Inferencia: `backend/ml_model.py`

Cuando se agregue una tabla o columna nueva, hay que actualizar el modelo, el esquema Pydantic, las rutas que la usan y la migración de Alembic correspondiente.

## 10. Pruebas y validación

Backend:

```bash
source venv/bin/activate
pytest -q
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Comprobación manual recomendada:

1. Abrir `/docs` y registrar un usuario `teacher`.
2. Iniciar sesión desde `/login`.
3. Crear un estudiante desde `/students`.
4. Confirmar que aparece en dashboard, asistencia y predicciones.
5. Editar y eliminar el estudiante.
6. Revisar los errores del backend con `docker compose logs -f backend`.

## 11. Problemas frecuentes

### `Failed to fetch` en el frontend

Comprobar que FastAPI está activo en `http://localhost:8000` y que `NEXT_PUBLIC_API_URL` apunta a esa dirección. Después de cambiar una variable pública de Next.js, reiniciar el frontend.

### Error `401 Unauthorized`

La sesión no existe o el JWT expiró. Cerrar sesión, volver a iniciar sesión y comprobar que `rad_token` existe en el almacenamiento del navegador.

### Error de conexión con PostgreSQL

- En Docker, usar el host `db` dentro de `DATABASE_URL`.
- Fuera de Docker, usar `localhost`.
- Confirmar que el contenedor está activo con `docker compose ps`.

### No aparecen estudiantes

Debe existir al menos un usuario con `role = "student"`. El listado requiere sesión válida.

### Cambié el modelo y aparece una columna inexistente

Reiniciar el backend. El arranque intenta agregar las columnas nuevas del perfil. En un entorno de desarrollo completamente descartable también se puede recrear el volumen con `docker compose down -v` y luego `docker compose up --build`.
