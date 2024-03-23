*Back End*

Crea un entorno virtual con el comando python -m venv venv. Esto creará un nuevo entorno virtual llamado venv en tu directorio actual.

Activa el entorno virtual en windows, con el comando venv\Scripts\activate.

Una vez que tu entorno virtual está activo, instalar las dependencias necesarias con el comando pip install -r requirements.txt.

Crear un archivo .env y añadir las credenciales de la base de datos esta manera 

```
DB_NAME=your_database_name

DB_USER=your_database_user

DB_PASSWORD=your_database_password

DB_HOST=your_database_host

DB_PORT=your_database_port
```

*Para el front end*

```
cd ./client
npm i
npm start
```