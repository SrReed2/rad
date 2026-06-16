##Docker
    #comandos de docker
        docker run --> crea un contenedor
        docker ps --> muestra contenedores activos
        docker stop --> detiene un contenedor
        docker star --> continua el proceso de contenedor detenido
        prune --> borra todo de una clase (contenedores, network, images, etc)
        rm --> elimina un contendor (--rm hace que se borren una vez se detenga)
        -a ---> sew le puede agregar a a un comando para que afecte a algo que normalmnte no afecta (prune -a, ps -a, etc)
        docker create image --> crea una imagen
        docker logs --> para ver la salida de un contenedor que esta en segundo plano
        docker attach --> para ver un contenedor que se esta ejecutando en segundo plano en tiempo real

    #opciones de docker run
        -d --> arranca un contenedor en segundo plano
        -p --> mapea el puerto de un contenedor al puerto del host
        -v --> mapea el volumen del host al contenedor
        --name --> asigna un nombre al contenedor
        -e --> define una variable del entorno
        --env-file --> define un archivo de variable de entorno
        
    #politica de reinicio
        no: No reinicia el contenedor.
        always: Reinicia el contenedor siempre.
        unless-stopped: Reinicia el contenedor siempre que no lo paremos.
        on-failure: Reinicia el contenedor solo si falla.
        on-failure:<n>: Reinicia el contenedor solo si falla n veces.

##alembic
# 1. Inicializar Alembic
alembic init migrations

# 2. Crear primera migración
alembic revision --autogenerate -m "create users table"

# 3. Aplicar migración
alembic upgrade head

# siempre usar docker compose exec backend 'command'