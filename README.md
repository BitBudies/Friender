Crea un entorno virtual. Puedes hacer esto con el comando python -m venv venv. Esto creará un nuevo entorno virtual llamado venv en tu directorio actual.

Activa el entorno virtual. En Windows, puedes hacer esto con el comando venv\Scripts\activate.

Una vez que tu entorno virtual está activo, puedes instalar las dependencias necesarias con el comando pip install -r requirements.txt.

una ves creado añadir las credenciales de la base de datos. Crear un archivo .env y añadir las credenciales de esta manera 

DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=your_database_port

