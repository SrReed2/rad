Documentación Técnica del Backend - Sistema "no se el nombre oficial"

Este escrito constituye el nucleo del sistema "nombre", Esta desarrollado  con FastAPI y gestiona la logica, la pesistencia de datos en PostgreSQL y la validacion de peticiones mediante SQLAlchemy y Pydantic.

## 1. ARQUITECTURA DE CAPAS
    (1) app.py: Punto de entrada de la aplicación. Configura la instancia de FastAPI, expone los middlewares e incluye los enrutadores de los módulos.

    (2) database.py: Administra la conexión con el motor de la base de datos a través de SQLAlchemy. Implementa el patrón de inyección de dependencias (función get_db) para asegurar que cada petición HTTP abra y cierre su sesión de forma aislada.

    (3) models.py: Define la estructura de las tablas en la base de datos física mediante el ORM, asegurando los tipos de datos y restricciones de integridad.

    (4) schemas.py: Capa de validación de tipado basada en Pydantic. Actúa como filtro para los datos de entrada (Data Transfer Objects) y define las estructuras de salida para proteger datos sensibles.

    (5) routes/: Directorio que aísla los controladores por dominio de negocio (Autenticación y Salones).
    

## 2. MODELO DE DATOS Y RELACION
    (1) Tabla Users: Almacena el identificador único, el correo electrónico (con restricción Unique), la contraseña encriptada (hashed_password) y el rol del usuario dentro de la plataforma (director, teacher, student).

    (2) Tabla Classrooms: Registra los salones de clase. Contiene un identificador único, el nombre de la materia, una descripción opcional y la clave foránea (teacher_id) que apunta directamente a la tabla de usuarios.\

El sistema implementa dos entidades principales con integridad referencial.

## 3. LOGICA Y RESTRICCIONES EN ENDPOINTS
    (1) Validación de Existencia: El sistema toma el teacher_id provisto en la petición y realiza una consulta previa en la tabla de usuarios. Si el identificador no corresponde a ningún registro, la operación se aborta y retorna un estado HTTP 404 Not Found.

    (2) Validación de Rol: Si el usuario existe, el backend evalúa su propiedad de rol. El acceso está restringido únicamente a usuarios con rol "teacher" o "director". En caso de que un usuario con rol "student" intente la creación de un salón, el sistema deniega la petición devolviendo un estado HTTP 400 Bad Request.

El controlador de salones (routes/classrooms.py) implementa validaciones específicas en el método POST para proteger la integridad de los datos antes de realizar operaciones de escritura

## 4. DESPLIEGUE EINTERACION EN CONTENEDORES

La conexión con la base de datos se encuentra integrada dentro del entorno de Docker. La URL de conexión utiliza variables dinámicas resueltas mediante el nombre del servicio de la base de datos definido en el archivo de orquestación (postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}), eliminando la dependencia de variables de entorno manuales en la máquina local.

El archivo de arranque incluye la ejecución automática de la función de creación de tablas del ORM. Esto garantiza que el esquema relacional se despliegue de forma automática en el momento en que los contenedores se inicializan por primera vez.

# API Backend - Gestión Académica & Predicción ML

Backend desarrollado con FastAPI, PostgreSQL/SQLAlchemy y PyTorch para evaluación de riesgo académico.

## Requisitos
- Docker & Docker Compose
- Python 3.10+ (para desarrollo local)

## Instalación y Ejecución con Docker

1. Construir la imagen:
   ```bash
   docker compose build