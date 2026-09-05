# RAD - Risk Analysis Dashboard

Plataforma web para gestionar estudiantes, registrar información académica y calcular indicadores de riesgo mediante un modelo de aprendizaje automático. El sistema está dividido en una API REST, una interfaz web y una base de datos PostgreSQL, todos ejecutados como servicios Docker.

Este documento describe el proyecto desde el punto de vista de arquitectura, código, red, persistencia, seguridad, ejecución y operación. El procedimiento soportado para levantar la aplicación es Docker Compose: no es necesario instalar Python, Node.js, npm ni PostgreSQL directamente en el equipo anfitrión.

## Índice

1. [Resumen técnico](#resumen-técnico)
2. [Lenguajes y herramientas](#lenguajes-y-herramientas)
3. [Arquitectura](#arquitectura)
4. [Estructura del repositorio](#estructura-del-repositorio)
5. [Requisitos del equipo](#requisitos-del-equipo)
6. [Configuración Docker](#configuración-docker)
7. [Ejecución completa](#ejecución-completa)
8. [Base de datos y persistencia](#base-de-datos-y-persistencia)
9. [Backend y API](#backend-y-api)
10. [Autenticación y autorización](#autenticación-y-autorización)
11. [Frontend](#frontend)
12. [Predicción de riesgo](#predicción-de-riesgo)
13. [Migraciones](#migraciones)
14. [Pruebas y validación](#pruebas-y-validación)
15. [Operación y mantenimiento](#operación-y-mantenimiento)
16. [Problemas frecuentes](#problemas-frecuentes)

## Resumen técnico

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| Interfaz | Next.js `15.5.19`, React `19.1.0`, TypeScript | Renderizar la aplicación web y gestionar la sesión del usuario |
| Estilos | Tailwind CSS `4`, PostCSS | Utilidades de estilo y procesamiento CSS |
| Gráficos | Chart.js `4.5.1`, `react-chartjs-2` | Visualizar estadísticas, asistencia y riesgo |
| API | Python `3.13`, FastAPI `0.136.3`, Uvicorn | Exponer endpoints HTTP y documentación OpenAPI |
| Validación | Pydantic `2.13.4`, `email-validator` | Validar cuerpos de petición y respuestas |
| Persistencia | PostgreSQL `13`, SQLAlchemy `2.0.50`, psycopg2 | Modelar y consultar la información relacional |
| Seguridad | JWT, `python-jose`, Passlib, bcrypt | Autenticación, hash de contraseñas y autorización |
| Machine Learning | PyTorch, NumPy, scikit-learn | Preparar características y estimar riesgo académico |
| Migraciones | Alembic `1.18.4` | Versionar cambios de esquema de PostgreSQL |
| Orquestación | Docker, Docker Compose | Construir imágenes y conectar los tres servicios |
| Pruebas | pytest, HTTPX | Ejecutar pruebas del backend y solicitudes HTTP |

El proyecto usa Python para backend y machine learning, TypeScript/React para frontend, SQL como lenguaje de persistencia a través de PostgreSQL y YAML para la configuración de Compose. HTML y CSS se generan mediante el App Router de Next.js y Tailwind.

## Lenguajes y herramientas

### Python

Python implementa la API, la lógica de negocio, el acceso a datos, la seguridad y la inferencia ML. El contenedor usa `python:3.13-slim`, por lo que el código se ejecuta en Python 3.13 dentro de Docker.

### FastAPI y Uvicorn

FastAPI define las rutas HTTP, integra dependencias como la sesión de SQLAlchemy y genera el esquema OpenAPI. Uvicorn es el servidor ASGI que arranca la aplicación con:

```text
uvicorn app:app --host 0.0.0.0 --port 8000
```

La documentación interactiva se genera automáticamente en `/docs` y el esquema OpenAPI en `/openapi.json`.

### SQLAlchemy y PostgreSQL

SQLAlchemy representa las tablas mediante clases declarativas, crea el engine usando `DATABASE_URL` y abre una sesión por petición mediante `get_db()`. PostgreSQL almacena usuarios, aulas, calificaciones y asistencias.

### Pydantic

Los esquemas de `backend/schemas.py` validan tipos de entrada y salida. Por ejemplo, `EmailStr` valida correos, `StudentCreate` define los campos necesarios para crear estudiantes y `RiskPredictionResponse` define la forma de una respuesta de predicción.

### JWT, Passlib y bcrypt

El login devuelve un token firmado con HS256. La contraseña nunca se guarda en texto plano: se transforma mediante bcrypt y solo se persiste `password_hash`. Las rutas protegidas extraen el token del encabezado `Authorization: Bearer <token>`, lo validan y consultan el usuario correspondiente.

### NumPy, scikit-learn y PyTorch

NumPy representa los vectores de características. `StandardScaler` de scikit-learn normaliza las características antes de la inferencia. PyTorch carga `backend/student_model.pth` y ejecuta una red neuronal con dos entradas: promedio de calificación y proporción de asistencia.

### Next.js, React y TypeScript

Next.js usa el App Router (`frontend/app`) y React organiza la interfaz en páginas, componentes y contextos. TypeScript aporta tipado estático. El cliente API centralizado en `frontend/lib/api.ts` añade automáticamente `Content-Type` y el JWT almacenado en `localStorage`.

### Tailwind, PostCSS y Chart.js

Tailwind CSS proporciona clases utilitarias y PostCSS procesa la hoja global. Los componentes de Chart.js muestran información de asistencia, estadísticas y predicciones.

## Arquitectura

```text
+------------------------------------------------------------+
| Navegador                                                  |
| Next.js / React / TypeScript                               |
| http://localhost:3000                                     |
+----------------------+-------------------------------------+
                       | HTTP + Authorization: Bearer JWT
                       v
+------------------------------------------------------------+
| backend                                                    |
| FastAPI + Uvicorn + SQLAlchemy + PyTorch                   |
| http://localhost:8000                                     |
+----------------------+-------------------------------------+
                       | PostgreSQL protocol, host: db
                       v
+------------------------------------------------------------+
| db                                                         |
| PostgreSQL 13                                              |
| http://localhost:5432                                     |
+------------------------------------------------------------+
```

Los tres servicios se conectan a la red Docker `app-network`. Dentro de esa red, el backend debe usar `db` como hostname de PostgreSQL. El navegador, en cambio, accede a los puertos publicados en el equipo anfitrión, por eso el frontend usa `http://localhost:8000` para llamar a la API.

## Estructura del repositorio

```text
.
├── docker-compose.yaml       # Orquestación de backend, frontend y PostgreSQL
├── alembic.ini               # Configuración de migraciones raíz
├── migration/                # Migraciones montadas por Compose
├── backend/
│   ├── Dockerfile            # Imagen Python 3.13
│   ├── requirements.txt      # Dependencias Python
│   ├── app.py                # Instancia FastAPI y registro de routers
│   ├── models.py             # Modelos SQLAlchemy
│   ├── schemas.py            # Contratos Pydantic
│   ├── ml_model.py           # Red PyTorch e inferencia
│   ├── dataset_helper.py     # Construcción de características ML
│   ├── core/
│   │   ├── database.py       # Engine, sesiones y compatibilidad de columnas
│   │   └── security.py       # JWT y usuario autenticado
│   ├── routes/               # Controladores HTTP por dominio
│   ├── services/             # Reglas de negocio
│   └── tests/                # Pruebas del backend
├── frontend/
│   ├── Dockerfile            # Imagen Node 20
│   ├── package.json          # Scripts y dependencias JavaScript
│   ├── app/                  # Páginas del App Router
│   ├── components/           # Componentes visuales reutilizables
│   ├── context/              # Estado de sesión y estudiantes
│   ├── data/                 # Datos auxiliares o de demostración
│   └── lib/api.ts            # Cliente HTTP hacia FastAPI
└── tests/                    # Pruebas adicionales del proyecto
```

## Requisitos del equipo

Solo se requiere:

- Docker Engine o Docker Desktop.
- Docker Compose v2, invocado como `docker compose`.
- Git, si el proyecto se obtiene desde un repositorio.
- Puertos `3000`, `5432` y `8000` disponibles.

No se necesita instalar Python, pip, Node.js, npm, PostgreSQL ni PyTorch en el equipo anfitrión. Todas esas herramientas se instalan o están disponibles dentro de las imágenes Docker.

Comprobar la instalación:

```bash
docker --version
docker compose version
```

## Configuración Docker

### Servicio `backend`

- Construye la imagen desde `backend/Dockerfile`.
- Usa Python 3.13 slim.
- Instala `backend/requirements.txt`.
- Publica el puerto `8000`.
- Ejecuta Uvicorn en `0.0.0.0:8000`.
- Monta `./backend` en `/app` para reflejar cambios de código durante el desarrollo.
- Monta el archivo `./alembic.ini` y el directorio `./migration`.
- Usa `db` como hostname de PostgreSQL.

Variables actuales:

```env
DATABASE_URL=postgresql://raduser:1234@db:5432/rad_db
SECRET_KEY=change-this-in-production
```

### Servicio `frontend`

- Construye la imagen desde `frontend/Dockerfile`.
- Usa Node.js 20.
- Instala dependencias con `npm ci`.
- Publica el puerto `3000`.
- Ejecuta `npm run dev`, que usa Next.js con Turbopack.
- Recibe `NEXT_PUBLIC_API_URL=http://localhost:8000`.

Esta URL se evalúa desde el navegador, no desde el contenedor frontend. Por eso debe apuntar a `localhost:8000`, que es el puerto de la API publicado en el host.

### Servicio `db`

- Usa la imagen oficial `postgres:13`.
- Publica PostgreSQL en `localhost:5432`.
- Crea el usuario `raduser`, la base `rad_db` y la contraseña definida en Compose.
- Persiste los datos en el volumen nombrado `pgdata`.

### Red y volumen

`app-network` permite que los servicios se resuelvan por nombre (`backend`, `frontend`, `db`). El volumen `pgdata` sobrevive a `docker compose down`; por tanto, eliminar contenedores no elimina la base salvo que se use `-v`.

## Ejecución completa

Todos los comandos siguientes se ejecutan desde la raíz del repositorio, donde está `docker-compose.yaml`.

### 1. Construir y arrancar

```bash
docker compose up --build
```

Para arrancar en segundo plano:

```bash
docker compose up --build -d
```

La primera construcción puede tardar porque instala dependencias Python, PyTorch, Node y las dependencias de npm.

### 2. Comprobar el estado

```bash
docker compose ps
curl http://localhost:8000/
```

La API debe responder:

```json
{"message":"API de Gestión Académica y Predicción ML lista."}
```

Abrir en el navegador:

- Aplicación: <http://localhost:3000>
- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>
- OpenAPI JSON: <http://localhost:8000/openapi.json>

### 3. Consultar logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

Todos los servicios:

```bash
docker compose logs -f
```

### 4. Detener la aplicación

Detener y eliminar contenedores, conservando datos:

```bash
docker compose down
```

Detener y eliminar también el volumen de PostgreSQL:

```bash
docker compose down -v
```

`down -v` es destructivo para los datos almacenados en `pgdata`. Después habrá que volver a registrar usuarios y crear estudiantes.

### 5. Reconstruir después de cambios

Cambios en Python montado desde `./backend` suelen reflejarse en el contenedor, pero un cambio en dependencias requiere reconstrucción:

```bash
docker compose up --build -d backend
```

Cambios en `package.json`, `package-lock.json` o en el Dockerfile del frontend:

```bash
docker compose up --build -d frontend
```

Recrear todo desde cero, conservando el volumen:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Base de datos y persistencia

### Tablas

SQLAlchemy define estas entidades en `backend/models.py`:

| Tabla | Propósito | Campos principales |
|---|---|---|
| `users` | Usuarios, docentes y estudiantes | `id`, `name`, `email`, `password_hash`, `role`, `grade`, `attendance`, `subject`, `period` |
| `classrooms` | Aulas asociadas a un docente | `id`, `name`, `description`, `teacher_id` |
| `grades` | Calificaciones detalladas | `id`, `score`, `evaluation_name`, `student_id`, `classroom_id` |
| `attendance` | Asistencia por fecha | `id`, `date`, `is_present`, `student_id`, `classroom_id` |

Un estudiante es un registro de `users` cuyo `role` es `student`. Su promedio y asistencia resumidos viven en el mismo registro; las tablas `grades` y `attendance` permiten guardar datos detallados.

### Inicialización

Al importar `backend/app.py`, el backend ejecuta:

```python
Base.metadata.create_all(bind=engine)
ensure_user_profile_columns()
```

Esto crea tablas ausentes y añade las columnas de perfil `grade`, `attendance`, `subject` y `period` cuando se detecta una base antigua. No sustituye a un sistema completo de migraciones para cambios complejos.

### Credenciales actuales de desarrollo

```text
Host dentro de Docker: db
Host desde el equipo: localhost
Puerto: 5432
Usuario: raduser
Contraseña: 1234
Base de datos: rad_db
URL interna: postgresql://raduser:1234@db:5432/rad_db
```

Estas credenciales están escritas en `docker-compose.yaml` y son exclusivamente de desarrollo. En un despliegue real deben sustituirse por secretos gestionados fuera del repositorio.

## Backend y API

`backend/app.py` crea la aplicación FastAPI, habilita CORS para `http://localhost:3000` y registra los routers. Las rutas se agrupan por dominio:

| Método | Ruta real | Autenticación | Descripción |
|---|---|---|---|
| `GET` | `/` | No | Comprobación de estado |
| `POST` | `/auth/register` | No | Registrar usuario |
| `POST` | `/auth/login` | No | Obtener JWT |
| `GET` | `/students/` | JWT | Listar estudiantes |
| `POST` | `/students/` | JWT + rol | Crear estudiante |
| `PATCH` | `/students/{student_id}` | JWT + rol | Actualizar estudiante |
| `DELETE` | `/students/{student_id}` | JWT + rol | Eliminar estudiante |
| `POST` | `/academic/grades` | JWT | Registrar calificación |
| `POST` | `/academic/attendance` | JWT | Registrar asistencia |
| `GET` | `/predictions/risk` | JWT | Calcular riesgo de estudiantes |
| `GET` | `/classrooms/` | Actualmente pública | Listar aulas |
| `POST` | `/classrooms/` | Actualmente pública | Crear aula |

La protección se indica como “actualmente pública” en aulas porque el router no añade una dependencia JWT en su implementación actual. Debe revisarse antes de exponer la API fuera de un entorno controlado.

### Registrar el primer usuario

Con los contenedores levantados:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Docente","email":"docente@ejemplo.com","password":"secret123","role":"teacher"}'
```

También se puede utilizar `POST /auth/register` desde Swagger.

### Iniciar sesión y usar un token

```bash
curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"docente@ejemplo.com","password":"secret123"}'
```

Copiar `access_token` desde la respuesta JSON y usarlo:

```bash
curl http://localhost:8000/students/ \
  -H "Authorization: Bearer TU_TOKEN"
```

### Crear un estudiante

```bash
curl -X POST http://localhost:8000/students/ \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana López","email":"ana@ejemplo.com","password":"student123","grade":89,"attendance":95,"subject":"Matemáticas","period":"2026-I"}'
```

Los roles `teacher`, `director` y `admin` pueden crear, modificar y eliminar estudiantes. Un usuario con rol `student` puede ser listado, pero no puede administrar otros estudiantes.

## Autenticación y autorización

1. El cliente envía correo y contraseña a `POST /auth/login`.
2. `auth_service.py` busca el correo y compara la contraseña con el hash bcrypt.
3. La API genera un JWT firmado con `SECRET_KEY`, algoritmo HS256 y una expiración configurada por `ACCESS_TOKEN_EXPIRE_MINUTES`.
4. El frontend guarda el token en `localStorage` bajo la clave `rad_token`.
5. `frontend/lib/api.ts` lo adjunta en cada solicitud.
6. `core/security.py` decodifica el token, obtiene el `sub` como ID de usuario y vuelve a consultar PostgreSQL.

Variables de seguridad:

```env
SECRET_KEY=change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

`ACCESS_TOKEN_EXPIRE_MINUTES` no está definido explícitamente en Compose, por lo que el backend usa su valor predeterminado de 1440 minutos. En producción se debe configurar una clave larga, aleatoria y secreta, además de restringir CORS y cambiar las credenciales de PostgreSQL.

## Frontend

El frontend usa Next.js con App Router. Sus páginas principales son:

- `app/login`: inicio de sesión.
- `app/dashboard`: resumen académico.
- `app/students`: listado y gestión de estudiantes.
- `app/attendance`: información de asistencia.
- `app/predictions`: visualización del riesgo calculado.

Responsabilidades principales:

- `context/AuthContext.tsx`: login, restauración y cierre de sesión.
- `context/StudentsContext.tsx`: carga y operaciones CRUD de estudiantes.
- `lib/api.ts`: cliente HTTP, URL de API, cabeceras y manejo de errores.
- `components/`: tablas, formularios, tarjetas y gráficos reutilizables.
- `app/globals.css`: variables de color, estilos globales y configuración Tailwind.

La variable pública del frontend es:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Como las variables `NEXT_PUBLIC_*` pueden llegar al navegador, no deben contener secretos.

## Predicción de riesgo

`GET /predictions/risk` obtiene todos los usuarios con `role = student` y construye dos características por estudiante:

1. Promedio de calificaciones. Si existen registros en `grades`, se calcula a partir de ellos; si no, se usa `users.grade`.
2. Tasa de asistencia. Si existen registros en `attendance`, se calcula como presentes entre días registrados; si no, se convierte `users.attendance` de porcentaje a proporción.

`dataset_helper.py` normaliza las dos características con `StandardScaler`. `ml_model.py` carga `student_model.pth`, crea una red neuronal PyTorch de dos entradas, una capa oculta de ocho neuronas, ReLU y salida sigmoide.

La respuesta tiene esta forma:

```json
{
  "total_evaluated": 1,
  "is_simulated": false,
  "results": [
    {
      "student_id": 2,
      "risk_score": 0.37,
      "status": "Bajo Riesgo"
    }
  ]
}
```

Si el archivo del modelo no existe, el backend calcula un indicador heurístico con una combinación ponderada de calificación y asistencia y marca `is_simulated` como `true`. Si la carga o inferencia del modelo falla, devuelve un valor neutral de `0.5` y también marca la respuesta como simulada. Si no hay estudiantes, la API devuelve HTTP 404.

## Migraciones

El repositorio contiene configuración de Alembic en la raíz y migraciones bajo `migration/`. El servicio backend monta ambos recursos dentro del contenedor. Compose no ejecuta `alembic upgrade head` automáticamente: el arranque usa `create_all` y la comprobación de compatibilidad descrita anteriormente.

Para aplicar las migraciones disponibles dentro del contenedor:

```bash
docker compose exec backend alembic -c /app/alembic.ini upgrade head
```

Antes de modificar tablas en un entorno persistente:

1. Actualizar el modelo SQLAlchemy.
2. Crear o editar la migración Alembic correspondiente.
3. Aplicar la migración con `docker compose exec`.
4. Verificar la estructura y los datos.
5. Actualizar esquemas Pydantic, servicios, rutas y frontend si cambia el contrato.

La creación automática de tablas es útil para desarrollo inicial, pero las migraciones explícitas son el mecanismo recomendado para cambios de esquema reproducibles.

## Pruebas y validación

Ejecutar las pruebas del backend dentro del contenedor para no depender de instalaciones locales:

```bash
docker compose exec backend pytest -q
```

Comprobar sintaxis Python:

```bash
docker compose exec backend python -m compileall -q /app
```

Validar el frontend:

```bash
docker compose exec frontend npm run lint
docker compose exec frontend npm run build
```

Comprobación funcional mínima:

1. Levantar Compose.
2. Consultar `/` y `/docs`.
3. Registrar un usuario `teacher` en `/auth/register`.
4. Iniciar sesión en la pantalla `/login`.
5. Crear un estudiante.
6. Comprobar el listado, dashboard, asistencia y predicciones.
7. Editar y eliminar el estudiante.
8. Revisar los logs de backend si alguna solicitud falla.

## Operación y mantenimiento

### Entrar en un contenedor

```bash
docker compose exec backend sh
docker compose exec frontend sh
docker compose exec db psql -U raduser -d rad_db
```

### Consultar la base de datos

```bash
docker compose exec db psql -U raduser -d rad_db -c '\\dt'
docker compose exec db psql -U raduser -d rad_db -c 'SELECT id, name, email, role FROM users;'
```

### Hacer una copia lógica de PostgreSQL

```bash
docker compose exec -T db pg_dump -U raduser -d rad_db > rad_db.sql
```

Restaurar en una base vacía:

```bash
cat rad_db.sql | docker compose exec -T db psql -U raduser -d rad_db
```

### Ver recursos y estado

```bash
docker compose ps
docker compose top
docker stats
docker volume ls
```

### Limpieza

Eliminar contenedores e imágenes del proyecto sin tocar el volumen:

```bash
docker compose down
docker image prune
```

Para reiniciar la base de datos de desarrollo desde cero:

```bash
docker compose down -v
docker compose up --build -d
```

## Problemas frecuentes

### `Failed to fetch` en el navegador

Confirmar que `backend` está activo, que `http://localhost:8000/` responde y que `NEXT_PUBLIC_API_URL` vale `http://localhost:8000`. Después de cambiar una variable pública de Next.js hay que recrear el contenedor frontend.

### `401 Unauthorized`

El token falta, expiró, está firmado con otra `SECRET_KEY` o el usuario ya no existe. Iniciar sesión de nuevo y confirmar que el navegador conserva `rad_token`.

### `403 Forbidden` al gestionar estudiantes

El token es válido, pero el usuario no tiene rol `teacher`, `director` o `admin`.

### Error de conexión a PostgreSQL

Dentro del backend el host correcto es `db`, no `localhost`. Confirmar que el servicio está activo:

```bash
docker compose ps db
docker compose logs db
```

Si se modificaron credenciales en Compose, actualizar también `DATABASE_URL` del backend y recrear los servicios.

### Puerto ocupado

Cambiar el lado izquierdo del mapeo en `docker-compose.yaml`, por ejemplo `8001:8000`, y usar después `http://localhost:8001`. Si se cambia el puerto público de la API, actualizar `NEXT_PUBLIC_API_URL`.

### No aparecen estudiantes

El listado filtra `users.role == "student"`. Debe existir al menos un estudiante y la solicitud debe llevar un JWT válido.

### No hay predicciones

La API devuelve 404 si no existen estudiantes. Crear al menos uno y volver a consultar `/predictions/risk`.

### El modelo ML aparece como simulado

Comprobar que `student_model.pth` esté presente en `backend/` y que el contenedor se haya construido con ese archivo. Aunque el modelo no pueda cargarse, la API conserva un cálculo de respaldo y lo indica mediante `is_simulated: true`.

### Se modificó un esquema y aparece una columna inexistente

Reiniciar el backend para ejecutar `ensure_user_profile_columns()`. Para cambios estructurales nuevos, crear y aplicar una migración Alembic. En una base de desarrollo descartable se puede usar `docker compose down -v`.

## Seguridad y límites actuales

La configuración incluida está orientada a desarrollo:

- La `SECRET_KEY` y las credenciales de PostgreSQL son valores de ejemplo visibles en Compose.
- CORS solo permite `http://localhost:3000`.
- Las rutas de aulas son públicas en la implementación actual.
- No hay un mecanismo de secrets externo ni TLS configurado en Compose.
- El frontend guarda el JWT en `localStorage`, por lo que debe evaluarse el modelo de amenazas antes de producción.

Para producción se debe usar una gestión de secretos, contraseñas únicas, HTTPS, CORS restringido al dominio real, políticas de autorización por recurso, backups automatizados y una estrategia explícita de migraciones.

## Puntos habituales de modificación

| Necesidad | Archivos principales |
|---|---|
| Nueva pantalla | `frontend/app/`, `frontend/components/` |
| Estado de autenticación | `frontend/context/AuthContext.tsx` |
| CRUD de estudiantes | `frontend/context/StudentsContext.tsx`, `backend/routes/students.py` |
| Contrato de API | `backend/schemas.py`, rutas y `frontend/lib/api.ts` |
| Nueva tabla o columna | `backend/models.py`, migración Alembic, servicios y rutas |
| Permisos | `backend/core/security.py` y dependencias de rutas |
| Consulta académica | `backend/services/academic_service.py`, `backend/routes/academic.py` |
| Lógica ML | `backend/dataset_helper.py`, `backend/ml_model.py`, `student_model.pth` |
| Conexión de base de datos | `backend/core/database.py`, `docker-compose.yaml` |
| Dependencias backend | `backend/requirements.txt`, `backend/Dockerfile` |
| Dependencias frontend | `frontend/package.json`, `frontend/package-lock.json`, `frontend/Dockerfile` |
