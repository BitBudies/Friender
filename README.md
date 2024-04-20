# Back End
### Configuración del Entorno Virtual
1. Crea un entorno virtual con el comando:
   ```
   python -m venv venv
   ```

2. Activa el entorno virtual en Windows con el comando:     
    ```
    venv\Scripts\activate
    ```
3. Una vez que el entorno virtual esté activo, instala las dependencias necesarias con:
    ```
    pip install -r requirements.txt
    ```

### Configuración de la Base de Datos
Crea un archivo `.env` en la raíz del proyecto y añade las credenciales de la base de datos de la siguiente manera:
```
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=your_database_port
EMAIL_HOST_USER=friender.oficial@gmail.com
EMAIL_HOST_PASSWORD='jexk hixp firy oyzr'
```
### Ejecutando el servidor Django
Para iniciar el servidor Django, ejecuta el siguiente comando:
```
python manage.py runserver
```
# Front End
### Configuración del Cliente
1. Navega al directorio del cliente:
    ```
    cd ./client
    ```
2. Instala las dependencias del cliente con:
    ```
    npm install
    ```
3. Inicia el servidor de desarrolo del cliente con:
    ```
    npm start
    ```

![gato](https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif)