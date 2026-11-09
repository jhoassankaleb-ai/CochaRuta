-- Activa las claves foráneas: no se pueden guardar opiniones de rutas que no existen.
PRAGMA foreign_keys = ON;

-- Tabla de rutas: identificador (3V, B, G...), tipo de transporte y nombre.
CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    mode TEXT NOT NULL,
    name TEXT NOT NULL
);

-- Tabla de tarifas: servicio (urbano o tren), descripción, monto en Bs y orden de aparición; no permite repetir servicio + descripción.
CREATE TABLE IF NOT EXISTS fares (
    id INTEGER PRIMARY KEY,
    service TEXT NOT NULL CHECK (service IN ('urbano', 'tren')),
    label TEXT NOT NULL,
    amount REAL NOT NULL CHECK (amount >= 0),
    sort_order INTEGER NOT NULL,
    UNIQUE (service, label)
);

-- Limpieza: borra tarifas repetidas y deja la primera de cada servicio + descripción.
DELETE FROM fares
WHERE id NOT IN (
    SELECT MIN(id) FROM fares GROUP BY service, label
);

-- Índice único que impide volver a duplicar tarifas.
CREATE UNIQUE INDEX IF NOT EXISTS fares_service_label
    ON fares(service, label);

-- Tabla de opiniones: ruta, calificación (1 a 5), nombre, texto y fecha automática.
CREATE TABLE IF NOT EXISTS opinions (
    id INTEGER PRIMARY KEY,
    route_id TEXT NOT NULL REFERENCES routes(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 30),
    text TEXT NOT NULL CHECK (length(text) BETWEEN 1 AND 300),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índice para obtener rápido las opiniones de una ruta, de la más reciente a la más antigua.
CREATE INDEX IF NOT EXISTS opinions_route_created
    ON opinions(route_id, created_at DESC);

-- Tabla de favoritos: cada navegador (client_id) guarda lugares con título, detalle y coordenadas; no permite repetir el mismo lugar.
CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY,
    client_id TEXT NOT NULL,
    title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
    detail TEXT NOT NULL CHECK (length(detail) <= 500),
    latitude REAL NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude REAL NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    UNIQUE (client_id, latitude, longitude)
);

-- Datos iniciales: las 10 rutas (OR IGNORE evita duplicarlas cada vez que se inicia el servidor).
INSERT OR IGNORE INTO routes (id, mode, name) VALUES
    ('3V', 'Micro', 'Av. Circunvalación – Centro – Zona Sur'),
    ('B', 'Micro', 'Calle Las Buganvillas – Av. Melchor Pérez de Olguín'),
    ('G', 'Micro', 'Calle Alipio Valencia Vega – Calle Honduras'),
    ('S', 'Micro', 'Av. Mar del Plata – zona oeste'),
    ('9', 'Trufi', 'Aeropuerto – La Cancha – Plaza – América'),
    ('138', 'Trufi', 'Terminal – Av. Oquendo – La Cancha'),
    ('106', 'Taxitrufi', 'La Cancha – Plaza – Cala Cala'),
    ('T1', 'Minibús', 'Plaza – Av. América – Tiquipaya'),
    ('Roja', 'Tren', 'San Antonio – Av. Petrolera – Agronomía'),
    ('Verde', 'Tren', 'San Antonio – Colcapirhua – Quillacollo');

-- Datos iniciales: tarifas del pasaje urbano y del tren.
INSERT OR IGNORE INTO fares (service, label, amount, sort_order) VALUES
    ('urbano', 'General', 3.00, 1),
    ('urbano', 'Adulto mayor / discapacidad', 2.50, 2),
    ('urbano', 'Estudiante', 2.00, 3),
    ('urbano', 'Escolar', 1.00, 4),
    ('tren', 'Línea Roja (hasta Kiñiloma)', 3.50, 1),
    ('tren', 'Línea Verde (a Quillacollo)', 4.00, 2),
    ('tren', 'Preferencial', 2.00, 3),
    ('tren', 'Estudiantil', 1.00, 4);

-- Horarios del tren (solo trenes): primera y última salida (HH:MM) y minutos entre trenes, por tipo de día (semana, sabado, domingo).
-- Está vacía a propósito: llénala con los horarios OFICIALES de "Mi Tren". Ejemplo con valores inventados (no los uses tal cual):
--   INSERT OR REPLACE INTO train_schedules (route_id, day_type, first_departure, last_departure, headway_min) VALUES ('Verde', 'semana', '06:00', '20:00', 30);
CREATE TABLE IF NOT EXISTS train_schedules (
    id INTEGER PRIMARY KEY,
    route_id TEXT NOT NULL REFERENCES routes(id),
    day_type TEXT NOT NULL CHECK (day_type IN ('semana', 'sabado', 'domingo')),
    first_departure TEXT NOT NULL CHECK (first_departure GLOB '[0-2][0-9]:[0-5][0-9]'),
    last_departure TEXT NOT NULL CHECK (last_departure GLOB '[0-2][0-9]:[0-5][0-9]'),
    headway_min INTEGER NOT NULL CHECK (headway_min BETWEEN 1 AND 240),
    UNIQUE (route_id, day_type)
);

-- Reportes de la comunidad: tipo, ruta opcional, nota corta, ubicación y fecha; el servidor solo muestra los de las últimas 2 horas.
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY,
    client_id TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('bloqueo', 'accidente', 'desvio', 'lleno', 'retraso')),
    route_id TEXT REFERENCES routes(id),
    note TEXT NOT NULL DEFAULT '' CHECK (length(note) <= 140),
    latitude REAL NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude REAL NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS reports_created ON reports(created_at DESC);

-- Votos sobre un reporte: cada navegador vota una vez ("sigue ahí" = 1, "ya no está" = 0).
CREATE TABLE IF NOT EXISTS report_votes (
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    client_id TEXT NOT NULL,
    still_there INTEGER NOT NULL CHECK (still_there IN (0, 1)),
    PRIMARY KEY (report_id, client_id)
);