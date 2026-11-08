# CochaRuta

## Iniciar la aplicación

Se necesita Python 3. No hay paquetes adicionales que instalar. En Windows, haz doble clic en `Iniciar CochaRuta.bat`. También puedes abrir una terminal en la carpeta del proyecto y ejecutar `python server.py`.

Deja abierta la ventana del servidor mientras uses la aplicación; al cerrarla, el servidor se detiene. Abre `http://127.0.0.1:8000` en el navegador. Si aparece un mensaje de que el puerto está ocupado, probablemente ya hay otra instancia ejecutándose.

El servidor usa `cocharuta.db` en la carpeta del proyecto. Si no puede iniciar porque la base está bloqueada, y DB Browser la tiene abierta, guarda los cambios y cierra la base desde DB Browser (no hace falta cerrar el programa); después vuelve a iniciar CochaRuta. El archivo `database.sql` define el esquema y los datos iniciales. Las opiniones y tarifas son compartidas por quienes usan el servidor; los favoritos se separan por navegador.

Si el servidor no responde, la pestaña Tarifas muestra valores de referencia e indica que podrían no estar actualizados. Inicia el servidor y recarga la página para ver las tarifas guardadas.
