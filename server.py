import argparse
from contextlib import contextmanager
import json
import math
import mimetypes
import os
import socket
import sqlite3
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit


# Carpeta donde está este archivo; de aquí salen la base de datos y los archivos de la página.
ROOT = Path(__file__).resolve().parent
# Archivo de la base de datos SQLite (se crea solo al iniciar).
DATABASE = ROOT / "cocharuta.db"
# Únicos archivos que el servidor entrega al navegador (lista permitida por seguridad).
STATIC_FILES = {"index.html", "script.js", "style.css", "logo.png.jpg", "manifest.json", "sw.js", "icon-192.png", "icon-512.png"}
# Tamaño máximo, en bytes, de lo que se acepta en una petición POST.
MAX_BODY_SIZE = 16_384
# Tipos de reporte permitidos y zona (sur, norte, oeste, este) donde se aceptan reportes.
REPORT_KINDS = {"bloqueo", "accidente", "desvio", "lleno", "retraso"}
REPORT_ZONE = (-17.55, -17.25, -66.40, -65.95)


# Abre una conexión a SQLite que guarda los cambios al terminar y siempre se cierra; activa las claves foráneas.
@contextmanager
def connect():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    try:
        with connection:
            yield connection
    finally:
        connection.close()


# Crea las tablas y carga los datos iniciales ejecutando database.sql.
def initialize_database():
    with connect() as connection:
        connection.executescript((ROOT / "database.sql").read_text(encoding="utf-8"))


# Error controlado: lleva el código HTTP (por ejemplo 400) y el mensaje que se devuelve al navegador.
class RequestError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status


# Atiende cada petición HTTP (GET, POST y DELETE) que llega al servidor.
class Handler(BaseHTTPRequestHandler):
    # Responde en formato JSON con el código de estado indicado.
    def send_json(self, status, data):
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    # Lee y valida el cuerpo JSON de una petición (tamaño, formato y que sea un objeto).
    def read_json(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError as error:
            raise RequestError(400, "Longitud de solicitud inválida.") from error
        if length < 1 or length > MAX_BODY_SIZE:
            raise RequestError(400, "El cuerpo de la solicitud está vacío o es demasiado grande.")
        try:
            value = json.loads(self.rfile.read(length))
        except (UnicodeDecodeError, json.JSONDecodeError) as error:
            raise RequestError(400, "El cuerpo debe contener JSON válido.") from error
        if not isinstance(value, dict):
            raise RequestError(400, "Se esperaba un objeto JSON.")
        return value

    # Comprueba que el identificador del navegador sea un UUID válido.
    def client_id(self, value):
        if not isinstance(value, str):
            raise RequestError(400, "Identificador de cliente inválido.")
        try:
            return str(uuid.UUID(value))
        except ValueError as error:
            raise RequestError(400, "Identificador de cliente inválido.") from error

    # GET: /api/fares (tarifas), /api/opinions (opiniones de una ruta) y /api/favorites (favoritos); cualquier otra dirección entrega un archivo de la página.
    def do_GET(self):
        parsed = urlsplit(self.path)
        # Devuelve todas las tarifas ordenadas.
        if parsed.path == "/api/fares":
            with connect() as connection:
                fares = connection.execute(
                    "SELECT service, label, amount FROM fares ORDER BY service, sort_order"
                ).fetchall()
            return self.send_json(200, {"fares": [dict(row) for row in fares]})

        # Devuelve las opiniones de la ruta pedida (?route=...), de la más nueva a la más antigua.
        if parsed.path == "/api/opinions":
            route_id = parse_qs(parsed.query).get("route", [""])[0]
            with connect() as connection:
                if not connection.execute("SELECT 1 FROM routes WHERE id = ?", (route_id,)).fetchone():
                    return self.send_json(400, {"error": "La ruta seleccionada no existe."})
                rows = connection.execute(
                    """SELECT route_id, rating, text, name,
                              strftime('%d/%m/%Y', created_at) AS date
                       FROM opinions WHERE route_id = ? ORDER BY id DESC""",
                    (route_id,),
                ).fetchall()
            opinions = [
                {"ruta": row["route_id"], "e": row["rating"], "texto": row["text"],
                 "nombre": row["name"], "fecha": row["date"]}
                for row in rows
            ]
            return self.send_json(200, {"opiniones": opinions})

        # Devuelve los favoritos del cliente indicado (?client_id=...).
        if parsed.path == "/api/favorites":
            query = parse_qs(parsed.query)
            try:
                client_id = self.client_id(query.get("client_id", [""])[0])
            except RequestError as error:
                return self.send_json(error.status, {"error": str(error)})
            with connect() as connection:
                rows = connection.execute(
                    """SELECT id, title, detail, latitude, longitude
                       FROM favorites WHERE client_id = ? ORDER BY id""",
                    (client_id,),
                ).fetchall()
            favorites = [
                {"id": row["id"], "titulo": row["title"], "detalle": row["detail"],
                 "lat": row["latitude"], "lng": row["longitude"]}
                for row in rows
            ]
            return self.send_json(200, {"favoritos": favorites})

        # Devuelve los horarios del tren (primera y última salida y frecuencia por tipo de día).
        if parsed.path == "/api/schedules":
            with connect() as connection:
                rows = connection.execute(
                    "SELECT route_id, day_type, first_departure, last_departure, headway_min FROM train_schedules"
                ).fetchall()
            return self.send_json(200, {"horarios": [
                {"ruta": r["route_id"], "dia": r["day_type"], "primero": r["first_departure"],
                 "ultimo": r["last_departure"], "cada": r["headway_min"]} for r in rows]})

        # Devuelve los reportes de las últimas 2 horas con sus votos; oculta los que 2 o más personas dicen que ya no están.
        if parsed.path == "/api/reports":
            with connect() as connection:
                rows = connection.execute(
                    """SELECT r.id, r.kind, r.route_id, r.note, r.latitude, r.longitude,
                              CAST((julianday('now') - julianday(r.created_at)) * 1440 AS INTEGER) AS minutes,
                              (SELECT COUNT(*) FROM report_votes v WHERE v.report_id = r.id AND v.still_there = 1) AS yes,
                              (SELECT COUNT(*) FROM report_votes v WHERE v.report_id = r.id AND v.still_there = 0) AS no
                       FROM reports r WHERE r.created_at >= datetime('now', '-2 hours')
                       ORDER BY r.id DESC LIMIT 100"""
                ).fetchall()
            reports = [
                {"id": r["id"], "tipo": r["kind"], "ruta": r["route_id"], "nota": r["note"],
                 "lat": r["latitude"], "lng": r["longitude"], "min": r["minutes"], "si": r["yes"], "no": r["no"]}
                for r in rows if not (r["no"] >= 2 and r["no"] > r["yes"])
            ]
            return self.send_json(200, {"reportes": reports})

        # Si empieza con /api/ pero no existe responde 404; si no, entrega un archivo estático.
        if parsed.path.startswith("/api/"):
            return self.send_json(404, {"error": "Recurso API no encontrado."})
        self.serve_static(parsed.path)

    # POST: crea una opinión o un favorito y convierte los errores en respuestas JSON.
    def do_POST(self):
        try:
            if urlsplit(self.path).path == "/api/opinions":
                return self.create_opinion()
            if urlsplit(self.path).path == "/api/favorites":
                return self.create_favorite()
            if urlsplit(self.path).path == "/api/reports":
                return self.create_report()
            if urlsplit(self.path).path == "/api/reports/vote":
                return self.vote_report()
            return self.send_json(404, {"error": "Recurso API no encontrado."})
        except RequestError as error:
            return self.send_json(error.status, {"error": str(error)})
        except sqlite3.IntegrityError:
            return self.send_json(400, {"error": "Los datos no cumplen las reglas de la base de datos."})

    # DELETE: borra un favorito, solo si pertenece al cliente que lo pide.
    def do_DELETE(self):
        try:
            parsed = urlsplit(self.path)
            if parsed.path != "/api/favorites":
                return self.send_json(404, {"error": "Recurso API no encontrado."})
            query = parse_qs(parsed.query)
            client_id = self.client_id(query.get("client_id", [""])[0])
            try:
                favorite_id = int(query.get("id", [""])[0])
            except ValueError as error:
                raise RequestError(400, "Identificador de favorito inválido.") from error
            with connect() as connection:
                connection.execute(
                    "DELETE FROM favorites WHERE id = ? AND client_id = ?",
                    (favorite_id, client_id),
                )
            return self.send_json(200, {"ok": True})
        except RequestError as error:
            return self.send_json(error.status, {"error": str(error)})

    # Valida y guarda una opinión: ruta existente, calificación de 1 a 5, texto hasta 300 caracteres y nombre hasta 30 (sin nombre queda 'Anónimo').
    def create_opinion(self):
        data = self.read_json()
        route_id = data.get("ruta")
        rating = data.get("e")
        text = data.get("texto")
        name = data.get("nombre")
        if not isinstance(route_id, str) or not isinstance(text, str) or not isinstance(name, str):
            raise RequestError(400, "Ruta, nombre y opinión deben ser texto.")
        text, name = text.strip(), name.strip() or "Anónimo"
        if type(rating) is not int or not 1 <= rating <= 5:
            raise RequestError(400, "La calificación debe estar entre 1 y 5.")
        if not 1 <= len(text) <= 300 or len(name) > 30:
            raise RequestError(400, "La opinión debe tener de 1 a 300 caracteres y el nombre hasta 30.")
        with connect() as connection:
            if not connection.execute("SELECT 1 FROM routes WHERE id = ?", (route_id,)).fetchone():
                raise RequestError(400, "La ruta seleccionada no existe.")
            connection.execute(
                "INSERT INTO opinions (route_id, rating, name, text) VALUES (?, ?, ?, ?)",
                (route_id, rating, name, text),
            )
        return self.send_json(201, {"ok": True})

    # Valida y guarda un favorito; si ya existía en esas coordenadas, solo actualiza su título y detalle.
    def create_favorite(self):
        data = self.read_json()
        client_id = self.client_id(data.get("client_id"))
        title, detail = data.get("titulo"), data.get("detalle", "")
        latitude, longitude = data.get("lat"), data.get("lng")
        if not isinstance(title, str) or not isinstance(detail, str):
            raise RequestError(400, "El título y el detalle deben ser texto.")
        title, detail = title.strip(), detail.strip()
        if not 1 <= len(title) <= 200 or len(detail) > 500:
            raise RequestError(400, "El título o el detalle excede el tamaño permitido.")
        if (type(latitude) not in (int, float) or type(longitude) not in (int, float)
                or not math.isfinite(latitude) or not math.isfinite(longitude)
                or not -90 <= latitude <= 90 or not -180 <= longitude <= 180):
            raise RequestError(400, "Las coordenadas no son válidas.")
        with connect() as connection:
            connection.execute(
                """INSERT INTO favorites (client_id, title, detail, latitude, longitude)
                   VALUES (?, ?, ?, ?, ?)
                   ON CONFLICT(client_id, latitude, longitude) DO UPDATE SET
                       title = excluded.title, detail = excluded.detail""",
                (client_id, title, detail, latitude, longitude),
            )
        return self.send_json(201, {"ok": True})

    # Valida y guarda un reporte: tipo permitido, ubicación dentro de Cochabamba, nota de hasta 140 caracteres y máximo 5 reportes por hora por navegador.
    def create_report(self):
        data = self.read_json()
        client_id = self.client_id(data.get("client_id"))
        kind, route_id, note = data.get("tipo"), data.get("ruta") or None, data.get("nota", "")
        latitude, longitude = data.get("lat"), data.get("lng")
        if kind not in REPORT_KINDS:
            raise RequestError(400, "Tipo de reporte inválido.")
        if (route_id is not None and not isinstance(route_id, str)) or not isinstance(note, str) or len(note.strip()) > 140:
            raise RequestError(400, "La ruta o la nota no son válidas (la nota admite hasta 140 caracteres).")
        if (type(latitude) not in (int, float) or type(longitude) not in (int, float)
                or not math.isfinite(latitude) or not math.isfinite(longitude)
                or not REPORT_ZONE[0] <= latitude <= REPORT_ZONE[1] or not REPORT_ZONE[2] <= longitude <= REPORT_ZONE[3]):
            raise RequestError(400, "Solo se aceptan reportes dentro de Cochabamba.")
        with connect() as connection:
            if route_id and not connection.execute("SELECT 1 FROM routes WHERE id = ?", (route_id,)).fetchone():
                raise RequestError(400, "La ruta seleccionada no existe.")
            recent = connection.execute(
                "SELECT COUNT(*) FROM reports WHERE client_id = ? AND created_at >= datetime('now', '-1 hour')",
                (client_id,),
            ).fetchone()[0]
            if recent >= 5:
                raise RequestError(429, "Enviaste muchos reportes seguidos. Intenta de nuevo más tarde.")
            connection.execute(
                "INSERT INTO reports (client_id, kind, route_id, note, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)",
                (client_id, kind, route_id, note.strip(), latitude, longitude),
            )
        return self.send_json(201, {"ok": True})

    # Registra el voto "sigue ahí" / "ya no está" sobre un reporte; no se puede votar el propio y cada navegador vota una sola vez (puede cambiarlo).
    def vote_report(self):
        data = self.read_json()
        client_id = self.client_id(data.get("client_id"))
        report_id, still_there = data.get("id"), data.get("vigente")
        if type(report_id) is not int or type(still_there) is not bool:
            raise RequestError(400, "Voto inválido.")
        with connect() as connection:
            row = connection.execute("SELECT client_id FROM reports WHERE id = ?", (report_id,)).fetchone()
            if not row:
                raise RequestError(404, "El reporte ya no existe.")
            if row["client_id"] == client_id:
                raise RequestError(400, "No puedes votar tu propio reporte.")
            connection.execute(
                """INSERT INTO report_votes (report_id, client_id, still_there) VALUES (?, ?, ?)
                   ON CONFLICT(report_id, client_id) DO UPDATE SET still_there = excluded.still_there""",
                (report_id, client_id, int(still_there)),
            )
        return self.send_json(200, {"ok": True})

    # Entrega index.html, script.js o style.css; rechaza cualquier otro archivo.
    def serve_static(self, requested_path):
        name = unquote(requested_path).lstrip("/") or "index.html"
        if name not in STATIC_FILES:
            return self.send_json(404, {"error": "Archivo no encontrado."})
        path = ROOT / name
        content = path.read_bytes()
        content_type = mimetypes.guess_type(name)[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", content_type + ("; charset=utf-8" if content_type.startswith("text/") or name.endswith(".js") else ""))
        self.send_header("Content-Length", str(len(content)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(content)

    # Imprime en la consola cada petición recibida.
    def log_message(self, fmt, *args):
        print(f"{self.address_string()} - {fmt % args}")


# Punto de arranque: lee --host y --port, prepara la base de datos y mantiene el servidor activo hasta Ctrl+C.
def main():
    parser = argparse.ArgumentParser(description="Servidor local de CochaRuta con SQLite.")
    parser.add_argument("--host", default=os.environ.get("HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", 8000)))
    args = parser.parse_args()
    initialize_database()
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"CochaRuta disponible en http://{args.host}:{args.port}")
    if args.host == "0.0.0.0":
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
                s.connect(("8.8.8.8", 80))  # no envía datos: solo averigua qué IP usa tu red
                print(f"Desde otros dispositivos del mismo Wi-Fi: http://{s.getsockname()[0]}:{args.port}")
        except OSError:
            pass
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()


# Solo arranca el servidor si se ejecuta este archivo directamente (python server.py).
if __name__ == "__main__":
    main()