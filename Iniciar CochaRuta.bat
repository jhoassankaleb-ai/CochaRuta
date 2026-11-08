@echo off
rem Inicia CochaRuta: enciende el servidor y abre el navegador. Solo haz doble clic en este archivo.
cd /d "%~dp0"
start "" /min cmd /c "timeout /t 3 /nobreak >nul & start http://127.0.0.1:8000"
python server.py || py server.py
echo.
echo Si ves un error de Python, instalalo desde python.org y marca "Add Python to PATH".
pause
 