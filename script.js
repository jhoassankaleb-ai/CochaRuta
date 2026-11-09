// CochaRuta: 10 rutas de ejemplo de Cochabamba. Los recorridos son APROXIMADOS (demostración):
// reemplaza las paradas por las reales de cada línea: [lat, lng, "Nombre"].
// Puntos de referencia de Cochabamba: [latitud, longitud, nombre]. Las rutas de demostración los usan como paradas.
const P = {
  plaza: [-17.3938, -66.1569, "Plaza 14 de Septiembre"],
  cancha: [-17.4010, -66.1515, "La Cancha"],
  terminal: [-17.3955, -66.1685, "Terminal de buses"],
  america: [-17.3750, -66.1600, "Av. América"],
  cristo: [-17.3844, -66.1346, "Cristo de la Concordia"],
  bg: [-17.3925, -66.2000, "Av. Blanco Galindo"],
  quillacollo: [-17.3970, -66.2780, "Quillacollo"],
  sacaba: [-17.4027, -66.0413, "Sacaba"],
  villazon: [-17.3900, -66.1300, "Av. Villazón"],
  aeropuerto: [-17.4211, -66.1771, "Aeropuerto"],
  calacala: [-17.3730, -66.1480, "Cala Cala"],
  oquendo: [-17.4020, -66.1640, "Av. Oquendo"],
  tiquipaya: [-17.3380, -66.2160, "Tiquipaya"],
  sanantonio: [-17.4040, -66.1540, "Estación San Antonio"],
  agronomia: [-17.4370, -66.1690, "Facultad de Agronomía"],
  colcapirhua: [-17.3935, -66.2130, "Colcapirhua"],
};

// Las 10 rutas. Cada una tiene id, tipo, color (c), tarifa, nombre y paradas [lat, lng, nombre]. Las de Trufi traen extras: via (calle), km, np (total de paradas), modo y real.
const RUTAS = [
  { id: "3V", tipo: "Micro", c: "#d84315", tarifa: 3, nombre: "Av. Circunvalación – Centro – Zona Sur", via: "Calle Tómas Gamboa", km: "14,6 km", np: 68, modo: "Bus", real: true,
    paradas: [
      [-17.3529, -66.1967, "Avenida Circunvalación"],
      [-17.3561, -66.1898, "Avenida Circunvalación y Calle Los Pinos"],
      [-17.3617, -66.1869, "Avenida Circunvalación"],
      [-17.3658, -66.1830, "Calle General Bilbao Rioja"],
      [-17.3705, -66.1794, ""], [-17.3748, -66.1651, ""], [-17.3856, -66.1621, ""], [-17.3938, -66.1580, ""],
      [-17.4047, -66.1562, ""], [-17.4144, -66.1584, ""], [-17.4238, -66.1601, ""], [-17.4355, -66.1594, ""],
    ] },
  { id: "B", tipo: "Micro", c: "#6a1b9a", tarifa: 3, nombre: "Calle Las Buganvillas – Av. Melchor Pérez de Olguín", via: "Pasaje F", km: "15,2 km", np: 54, modo: "Bus", real: true,
    paradas: [[-17.3642, -66.1399, "Calle Las Buganvillas"], [-17.3637, -66.1454, ""], [-17.3687, -66.1431, ""], [-17.3712, -66.1407, ""], [-17.3763, -66.1437, ""], [-17.3818, -66.1438, ""], [-17.3894, -66.1486, ""], [-17.3945, -66.1511, ""], [-17.3962, -66.1608, ""], [-17.4138, -66.1581, ""], [-17.4181, -66.1615, ""], [-17.4151, -66.1743, ""], [-17.4106, -66.1809, ""], [-17.4029, -66.1867, "Avenida Melchor Pérez de Olguín y Rotonda M…"]] },
  { id: "G", tipo: "Micro", c: "#1565c0", tarifa: 3, nombre: "Calle Alipio Valencia Vega – Calle Honduras", via: "Avenida Arquímedes", km: "7,7 km", np: 38, modo: "Bus", real: true,
    paradas: [[-17.3544, -66.163, "Calle Alipio Valencia Vega"], [-17.3575, -66.1593, ""], [-17.3612, -66.1569, ""], [-17.3635, -66.1542, ""], [-17.369, -66.155, ""], [-17.3716, -66.1523, ""], [-17.3745, -66.1549, ""], [-17.3815, -66.1555, ""], [-17.3872, -66.1535, ""], [-17.391, -66.1583, ""], [-17.3966, -66.157, ""], [-17.4063, -66.155, "Calle Honduras"]] },
  { id: "S", tipo: "Micro", c: "#c62828", tarifa: 3, nombre: "Av. Mar del Plata – zona oeste", via: "21 de Enero", km: "18,7 km", np: 79, modo: "Bus", real: true,
    paradas: [[-17.4297, -66.1172, "Avenida Mar del Plata"], [-17.4227, -66.1179, "Innominada"], [-17.4216, -66.1264, "Avenida Guayacán"], [-17.4177, -66.1273, "Avenida Guayacán y Calle Las Golondrinas"], [-17.4005, -66.1399, ""], [-17.4016, -66.1496, ""], [-17.3932, -66.1524, ""], [-17.3952, -66.164, ""], [-17.3957, -66.1755, ""], [-17.395, -66.1904, ""], [-17.3945, -66.2044, ""], [-17.394, -66.2205, ""], [-17.3988, -66.2221, ""], [-17.3961, -66.2318, ""]] },
  // Rutas de demostración: usan los puntos de referencia de P (trazado aproximado).
  { id: "9", tipo: "Trufi", c: "#2e7d32", tarifa: 3, nombre: "Aeropuerto – La Cancha – Plaza – América", paradas: [P.aeropuerto, P.cancha, P.plaza, P.america] },
  { id: "138", tipo: "Trufi", c: "#00838f", tarifa: 3, nombre: "Terminal – Av. Oquendo – La Cancha", paradas: [P.terminal, P.oquendo, P.cancha] },
  { id: "106", tipo: "Taxitrufi", c: "#ef6c00", tarifa: 3, nombre: "La Cancha – Plaza – Cala Cala", paradas: [P.cancha, P.plaza, P.calacala] },
  { id: "T1", tipo: "Minibús", c: "#ad1457", tarifa: 3, nombre: "Plaza – Av. América – Tiquipaya", paradas: [P.plaza, P.america, P.tiquipaya], lejos: true },
  { id: "Roja", tipo: "Tren", c: "#b71c1c", tarifa: 3.5, nombre: "San Antonio – Av. Petrolera – Agronomía", paradas: [P.sanantonio, P.agronomia] },
  { id: "Verde", tipo: "Tren", c: "#33691e", tarifa: 4, nombre: "San Antonio – Colcapirhua – Quillacollo", paradas: [P.sanantonio, P.colcapirhua, P.quillacollo] },
];

// Emoji que se muestra según el tipo de transporte.
const ICONO = { Micro: "🚌", Trufi: "🚐", Taxitrufi: "🚕", Minibús: "🚌", Tren: "🚆" };
// Atajos: $ busca un elemento del HTML, money da formato 'Bs 3,00' y nodo crea un elemento con clase y contenido.
const $ = (s) => document.querySelector(s);
const money = (n) => "Bs " + n.toFixed(2).replace(".", ",");
const nodo = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };

// ---------- Mapa ----------
// Si la librería del mapa (Leaflet) no cargó, muestra un aviso y detiene el script.
if (typeof L === "undefined") { document.body.insertAdjacentHTML("afterbegin", "<p style='padding:20px'>No se pudo cargar el mapa. Revisa tu internet.</p>"); throw new Error("Leaflet no cargó"); }
// Crea el mapa centrado en Cochabamba (zoom 13), sin los botones de zoom por defecto.
const mapa = L.map("map", { zoomControl: false }).setView([-17.3935, -66.157], 13);
// Botones de zoom arriba a la derecha.
L.control.zoom({ position: "topright" }).addTo(mapa);
// Capa con las imágenes de las calles (Esri, no pide clave).
L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, attribution: "Tiles © Esri" }).addTo(mapa);
// Recalcula el tamaño del mapa cuando la página termina de cargar.
window.addEventListener("load", () => mapa.invalidateSize());
// Grupo donde se dibuja la ruta elegida (línea y paradas); se vacía al cambiar de ruta.
const capa = L.layerGroup().addTo(mapa);

// Guarda los trazados ya calculados para no pedirlos otra vez.
const cache = {};
// Devuelve los puntos del trazado: pide a OSRM que siga las calles (el tren va en línea recta entre estaciones); si falla, une las paradas con rectas.
async function trazado(r) {
  if (cache[r.id]) return cache[r.id];
  const rect = r.paradas.map((p) => [p[0], p[1]]);
  if (r.tipo === "Tren") return (cache[r.id] = rect); // el tren va por sus rieles, en línea recta entre estaciones
  try {
    const cs = r.paradas.map((p) => `${p[1]},${p[0]}`).join(";");
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${cs}?overview=full&geometries=geojson`);
    const d = await res.json();
    if (d.code !== "Ok") throw 0;
    return (cache[r.id] = d.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]));
  } catch (e) { return (cache[r.id] = rect); }
}

// ---------- Filtros y lista ----------
// filtro = tipo de transporte activo; sel = ruta seleccionada.
let filtro = "Todos", sel = null;
// Crea los botones (chips) para filtrar la lista por tipo de transporte.
const tipos = ["Todos", "Micro", "Trufi", "Taxitrufi", "Minibús", "Tren"];
tipos.forEach((t) => {
  const b = nodo("button", "chip" + (t === filtro ? " on" : ""), (ICONO[t] || "★") + " " + t);
  b.addEventListener("click", () => {
    filtro = t;
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === b));
    volver();
  });
  $("#chips").appendChild(b);
});

// Pinta la lista de rutas según el filtro; al tocar una se abre su detalle.
function lista() {
  const el = $("#lista");
  el.innerHTML = "";
  RUTAS.filter((r) => filtro === "Todos" || r.tipo === filtro).forEach((r) => {
    const b = nodo("button", "ruta",
      `<span class="badge" style="background:${r.c}">${r.id}</span><span class="txt"><b>${ICONO[r.tipo]} ${r.tipo} ${r.id}</b><small>${r.nombre}</small></span>`);
    b.addEventListener("click", () => elegir(r));
    el.appendChild(b);
  });
}

// Vuelve del detalle a la lista y borra la ruta dibujada en el mapa.
function volver() {
  sel = null;
  capa.clearLayers();
  $("#detalle").hidden = true;
  $("#lista").hidden = false;
  lista();
}

// Muestra el detalle de la ruta (distancia, paradas...) y la dibuja en el mapa. 'extra' es el lugar buscado, que se incluye al ajustar el zoom.
async function elegir(r, extra, origen) {
  sel = r;
  const d = $("#detalle");
  $("#lista").hidden = true;
  d.hidden = false;
  d.innerHTML = `<button class="atras">← Todas las rutas</button>
    <h2>${ICONO[r.tipo]} ${r.tipo} ${r.id}</h2>
    <span class="dato" style="background:${r.c};color:#fff">${r.tipo}</span>
    <p style="margin:8px 0 0">${r.nombre}${r.via ? `<br><small style="color:var(--g)">${r.via}</small>` : ""}</p>
    ${r.km ? `<div class="stats"><div><b>${r.km}</b><small>Distancia</small></div><div><b>${r.np}</b><small>Paradas</small></div><div><b>${r.modo}</b><small>Modo</small></div></div>` : ""}
    <h2>Paradas</h2>
    <ol>${r.paradas.filter((p) => p[2]).map((p) => `<li>${p[2]}</li>`).join("")}${r.np ? `<li style="list-style:none;color:var(--g)">… y ${r.np - r.paradas.filter((p) => p[2]).length} paradas más</li>` : ""}</ol>
    <button class="sec" id="ir-op">★ Ver y dejar opiniones</button>
    <p class="aviso">${r.real ? "Trazado aproximado, estimado a partir de la app Trufi." : "Recorrido aproximado de demostración."}</p>`;
  d.querySelector(".atras").addEventListener("click", volver);
  d.querySelector("#ir-op").addEventListener("click", () => { $("#op-ruta").value = r.id; tab("opiniones"); pintarOpiniones(); });

  capa.clearLayers();
  // Obtiene el trazado y lo dibuja: contorno blanco + línea de color, un marcador por parada, y ajusta el zoom.
  const pts = await trazado(r);
  // Si el usuario eligió otra ruta mientras cargaba, cancela este dibujo.
  if (sel !== r) return;
  // Distancia aproximada (suma de los tramos del trazado) y pasaje, como etiquetas del detalle.
  const km = pts.reduce((s, p, k) => s + (k ? L.latLng(pts[k - 1]).distanceTo(L.latLng(p)) : 0), 0) / 1000;
  d.querySelector(".dato").insertAdjacentHTML("afterend", `${r.km ? "" : `<span class="dato">≈ ${km.toFixed(1).replace(".", ",")} km</span>`}<span class="dato">Pasaje ${money(r.tarifa)}</span>`);
  L.polyline(pts, { color: "#fff", weight: 9, opacity: 0.9 }).addTo(capa);
  L.polyline(pts, { color: r.c, weight: 5 }).addTo(capa);
  r.paradas.forEach((p) => L.marker([p[0], p[1]], { icon: L.divIcon({ className: "", html: `<div class="parada" style="--c:${r.c}"></div>`, iconSize: [12, 12], iconAnchor: [6, 6] }) }).bindTooltip(p[2] || "Parada").addTo(capa));
  mapa.fitBounds(L.latLngBounds(pts.concat([extra, origen].filter(Boolean).map((e) => [e.lat, e.lng]))), { paddingTopLeft: [30, 190], paddingBottomRight: [30, Math.round(innerHeight * 0.46)] });
  infoRuta(r);
}

// ---------- Mostrar / ocultar el panel ----------
// Botón que oculta o muestra el panel inferior.
$("#asa").addEventListener("click", () => {
  const oculta = $(".hoja").classList.toggle("oculta");
  $("#asa").setAttribute("aria-expanded", String(!oculta));
  $("#asa-t").textContent = oculta ? "Mostrar rutas" : "Ocultar";
});

// ---------- Pestañas ----------
// Cambia de pestaña: marca la activa y muestra solo su panel.
function tab(nombre) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.dataset.tab === nombre));
  ["rutas", "tarifas", "opiniones", "favoritos", "avisos"].forEach((n) => ($("#p-" + n).hidden = n !== nombre));
}
// Al tocar una pestaña se activa; si es Opiniones, recarga las opiniones.
document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => { tab(t.dataset.tab); if (t.dataset.tab === "opiniones") pintarOpiniones(); if (t.dataset.tab === "avisos") cargarReportes(); }));

// ---------- Persistencia en SQLite a través del servidor ----------
// Ayuda para hablar con el servidor (server.py): hace la petición, lee el JSON y lanza un error si falla.
async function api(url, options) {
  let response, data;
  // Si no hay servidor (o responde algo que no es JSON, como "Forbidden"), usa el modo local sin mostrar errores.
  try { response = await fetch(url, options); data = await response.json(); } catch (e) { return apiLocal(url, options); }
  if (!response.ok) throw new Error(data.error || "No se pudo completar la solicitud.");
  return data;
}

// Identificador anónimo de este navegador, guardado en localStorage; asocia los favoritos a cada usuario.
// ---------- Modo local (sin servidor) ----------
// Imita la API de server.py guardando opiniones y favoritos en este navegador, con las mismas respuestas.
const TARIFAS_BASE = [["urbano", "General", 3], ["urbano", "Adulto mayor / discapacidad", 2.5], ["urbano", "Estudiante", 2], ["urbano", "Escolar", 1], ["tren", "Línea Roja (hasta Kiñiloma)", 3.5], ["tren", "Línea Verde (a Quillacollo)", 4], ["tren", "Preferencial", 2], ["tren", "Estudiantil", 1]];
function apiLocal(url, options = {}) {
  const u = new URL(url, location.href), ruta = u.pathname, metodo = options.method || "GET";
  const leer = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } };
  const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const cuerpo = options.body ? JSON.parse(options.body) : {};
  $("#nota-local").hidden = false;
  if (ruta === "/api/fares") return { fares: TARIFAS_BASE.map(([service, label, amount]) => ({ service, label, amount })) };
  if (ruta === "/api/opinions") {
    if (metodo === "POST") {
      const l = leer("cocharuta-op");
      l.unshift({ ruta: cuerpo.ruta, e: cuerpo.e, texto: cuerpo.texto, nombre: cuerpo.nombre, fecha: new Date().toLocaleDateString("es-BO") });
      guardar("cocharuta-op", l);
      return { ok: true };
    }
    return { opiniones: leer("cocharuta-op").filter((o) => o.ruta === u.searchParams.get("route")) };
  }
  if (ruta === "/api/favorites") {
    let l = leer("cocharuta-fav");
    if (metodo === "POST") { l = l.filter((f) => !mismo(f, cuerpo)); l.push({ id: Date.now(), titulo: cuerpo.titulo, detalle: cuerpo.detalle, lat: cuerpo.lat, lng: cuerpo.lng }); guardar("cocharuta-fav", l); return { ok: true }; }
    if (metodo === "DELETE") { guardar("cocharuta-fav", l.filter((f) => String(f.id) !== u.searchParams.get("id"))); return { ok: true }; }
    return { favoritos: l };
  }
  throw new Error("No se pudo completar la solicitud.");
}

// UUID alternativo para cuando crypto.randomUUID no existe (navegador viejo o http en red local); sin esto fallaban opiniones y favoritos.
function uuidManual() {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
const CLIENTE_ID = (() => {
  const key = "cocharuta-cliente";
  let id = localStorage.getItem(key);
  if (!id) { id = crypto.randomUUID ? crypto.randomUUID() : uuidManual(); localStorage.setItem(key, id); }
  return id;
})();

// ---------- Opiniones ----------
// opiniones = las de la ruta mostrada; estrellas = calificación elegida en el formulario.
let opiniones = [], estrellas = 0;

// Llena el selector de rutas del formulario de opiniones.
RUTAS.forEach((r) => $("#op-ruta").appendChild(new Option(`${r.tipo} ${r.id} · ${r.nombre}`, r.id)));
$("#op-ruta").addEventListener("change", pintarOpiniones);

// Crea las 5 estrellas clicables de la calificación.
for (let i = 1; i <= 5; i++) {
  const b = nodo("button", "", "★");
  b.type = "button";
  b.setAttribute("aria-label", i + " estrellas");
  b.addEventListener("click", () => { estrellas = i; [...$("#estrellas").children].forEach((x, k) => x.classList.toggle("on", k < i)); });
  $("#estrellas").appendChild(b);
}

// Publica la opinión: valida estrellas y texto, la envía al servidor (POST) y recarga la lista.
$("#op-enviar").addEventListener("click", async () => {
  const texto = $("#op-texto").value.trim();
  if (!estrellas || !texto) { alert("Elige las estrellas y escribe tu opinión."); return; }
  const boton = $("#op-enviar");
  boton.disabled = true;
  try {
    await api("/api/opinions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ruta: $("#op-ruta").value, e: estrellas, texto, nombre: $("#op-nombre").value.trim() || "Anónimo" }),
    });
    $("#op-texto").value = "";
    estrellas = 0;
    [...$("#estrellas").children].forEach((x) => x.classList.remove("on"));
    await pintarOpiniones();
  } catch (e) { alert("No se pudo publicar la opinión: " + e.message); }
  finally { boton.disabled = false; }
});

// Pide al servidor las opiniones de la ruta elegida, calcula el promedio y las muestra.
async function pintarOpiniones() {
  const el = $("#op-lista"), id = $("#op-ruta").value;
  el.innerHTML = "";
  try {
    const data = await api("/api/opinions?route=" + encodeURIComponent(id));
    if ($("#op-ruta").value !== id) return;
    opiniones = data.opiniones;
    if (!opiniones.length) { el.appendChild(nodo("p", "nota", "Aún no hay opiniones de esta ruta. ¡Sé el primero!")); return; }
    const media = opiniones.reduce((s, o) => s + o.e, 0) / opiniones.length;
    el.appendChild(nodo("p", "media", `★ ${media.toFixed(1).replace(".", ",")} · ${opiniones.length} opinión(es)`));
    opiniones.forEach((o) => {
      const d = nodo("div", "op");
      const b = nodo("b"); b.textContent = o.nombre;
      const e = nodo("span", "e"); e.textContent = "★".repeat(o.e);
      const f = nodo("small"); f.textContent = " " + o.fecha;
      const t = nodo("div"); t.textContent = o.texto;
      d.append(b, e, f, t);
      el.appendChild(d);
    });
  } catch (e) { el.appendChild(nodo("p", "nota", "No se pudieron cargar las opiniones. Comprueba que el servidor esté activo.")); }
}

// Pide las tarifas al servidor y arma las tablas de pasaje urbano y tren.
async function cargarTarifas() {
  const contenedor = $("#tarifas-lista");
  try {
    const { fares } = await api("/api/fares");
    [["urbano", "Pasaje urbano (micros, trufis, taxitrufis, minibuses)"], ["tren", "Tren metropolitano"]].forEach(([service, title]) => {
      const filas = fares.filter((fare) => fare.service === service);
      const heading = nodo("h2"); heading.textContent = title;
      const table = nodo("table");
      filas.forEach((fare) => {
        const row = document.createElement("tr"), label = document.createElement("td"), amount = document.createElement("td");
        label.textContent = fare.label;
        amount.textContent = money(fare.amount);
        row.append(label, amount);
        table.appendChild(row);
      });
      contenedor.append(heading, table);
    });
  } catch (e) { contenedor.appendChild(nodo("p", "nota", "No se pudieron cargar las tarifas. Comprueba que el servidor esté activo.")); }
}

// ---------- Buscador de lugares (sugerencias mientras escribes) ----------
// Zona de búsqueda (oeste, sur, este, norte) para limitar los resultados a Cochabamba.
const ZONA = "-66.40,-17.55,-65.95,-17.25";
// res = sugerencias actuales; txtRes = texto al que pertenecen; espera = temporizador; ctl = cancela búsquedas viejas; lugar = lugar elegido.
let res = [], txtRes = "", espera, ctl, lugar = null;
// Dos capas del mapa: una para el lugar buscado y otra para las estrellas de favoritos.
const capaLugar = L.layerGroup().addTo(mapa), capaFav = L.layerGroup().addTo(mapa);

// Convierte un resultado de Photon al formato de la app (titulo, detalle, lat, lng).
function norm(f) {
  const p = f.properties || {}, c = [p.street, p.housenumber].filter(Boolean).join(" ");
  return { titulo: p.name || c || p.district || p.city || "Lugar", detalle: [p.name && c ? c : null, p.district || p.suburb, p.city || p.county].filter(Boolean).join(", "), lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] };
}
// Busca lugares en Photon (autocompletado), cancela la búsqueda anterior y quita repetidos.
async function pedir(t) {
  if (ctl) ctl.abort();
  ctl = new AbortController();
  const r = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(t)}&limit=6&lat=-17.3935&lon=-66.157&bbox=${ZONA}`, { signal: ctl.signal });
  const vistos = new Set();
  return (await r.json()).features.map(norm).filter((i) => { const k = i.titulo + i.detalle; if (vistos.has(k)) return false; vistos.add(k); return true; });
}
// Muestra la lista desplegable de sugerencias bajo el buscador.
function sugerir(items) {
  const u = $("#sug");
  u.innerHTML = "";
  if (!items.length) u.appendChild(nodo("li", "vacio", "No encontramos ese lugar en Cochabamba."));
  items.forEach((i) => {
    const li = nodo("li"), b = nodo("button"), t = nodo("b"), d = nodo("span");
    t.textContent = i.titulo; d.textContent = i.detalle;
    b.append(t, d);
    b.addEventListener("click", () => ir(i));
    li.appendChild(b); u.appendChild(li);
  });
  u.hidden = false;
}
// Mientras escribes: espera 350 ms y, con 3 letras o más, busca y muestra sugerencias (sin mover el mapa).
$("#q").addEventListener("input", () => {
  const t = $("#q").value.trim();
  clearTimeout(espera);
  if (t.length < 3) { $("#sug").hidden = true; return; }
  espera = setTimeout(async () => {
    try { const r = await pedir(t); if ($("#q").value.trim() !== t) return; res = r; txtRes = t; sugerir(r); } catch (e) { /* se ignora mientras escribes */ }
  }, 350);
});
// Al terminar de escribir: Enter o botón Buscar (no salta solo mientras escribes)
async function buscarYIr() {
  const t = $("#q").value.trim();
  if (t.length < 2) return;
  clearTimeout(espera);
  if (!(res.length && txtRes === t)) {
    try { res = await pedir(t); txtRes = t; } catch (e) { if (e.name !== "AbortError") alert("No se pudo buscar. Revisa tu internet."); return; }
  }
  res.length ? ir(res[0]) : sugerir([]);
}
// Enter busca y va al lugar; Escape cierra las sugerencias.
$("#q").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); buscarYIr(); } else if (e.key === "Escape") $("#sug").hidden = true; });
// Botón Buscar.
$("#q-ir").addEventListener("click", buscarYIr);
// Un clic fuera del buscador cierra las sugerencias.
document.addEventListener("click", (e) => { if (!e.target.closest(".buscar")) $("#sug").hidden = true; });

// Ruta más cercana (distancia aproximada en línea recta a los tramos entre paradas)
function masCercana(ll) {
  // Divide cada tramo entre paradas en 20 puntos y se queda con el más cercano al lugar buscado.
  let m = null;
  RUTAS.forEach((r) => {
    for (let i = 0; i < r.paradas.length - 1; i++) {
      const a = r.paradas[i], b = r.paradas[i + 1];
      for (let k = 0; k <= 20; k++) {
        const f = k / 20, d = ll.distanceTo([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
        if (!m || d < m.d) m = { r, d };
      }
    }
  });
  return m;
}

// Al tocar el marcador de "Mi ubicación" muestra una ventanita con la opción de guardarla en favoritos.
function ofrecerGuardar(i, ll) {
  const caja = nodo("div"), t = nodo("b"), b = nodo("button", "primario"), ya = posFav(i) >= 0;
  t.textContent = i.titulo;
  b.textContent = ya ? "★ Ya está en favoritos" : "☆ Guardar en favoritos";
  b.disabled = ya;
  b.addEventListener("click", () => { mapa.closePopup(); alternar(i); });
  caja.append(t, document.createElement("br"), b);
  L.popup({ offset: [0, -8] }).setLatLng(ll).setContent(caja).openOn(mapa);
}

// Va a un lugar: marca el punto en el mapa, muestra su tarjeta (distancia y botón de favorito) y dibuja la ruta más cercana.
function ir(i, soloUbicacion) {
  detener();
  lugar = i;
  clearTimeout(espera);
  if (ctl) ctl.abort();
  $("#q").value = soloUbicacion ? "" : i.titulo; $("#sug").hidden = true; $("#q").blur();
  // ll = posición del lugar; m = ruta más cercana y su distancia.
  const ll = L.latLng(i.lat, i.lng), m = soloUbicacion ? null : masCercana(ll);
  capaLugar.clearLayers();
  L.marker(ll, { icon: L.divIcon({ className: "", html: '<div class="pin"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }), zIndexOffset: 2000 })
    .bindTooltip(i.titulo, { permanent: true, direction: "top", offset: [0, -10] }).addTo(capaLugar)
    .on("click", () => { if (soloUbicacion) ofrecerGuardar(i, ll); });
  // Arma la tarjeta del lugar que aparece sobre las pestañas.
  const c = $("#lugar");
  c.hidden = false;
  c.innerHTML = '<div class="li"><b id="l-t"></b><small id="l-d"></small><small id="l-m"></small></div><button id="estrella" class="est"></button><button id="cerrar" class="x" aria-label="Quitar lugar">✕</button>';
  $("#l-t").textContent = i.titulo;
  $("#l-d").textContent = i.detalle;
  // Distancia en metros, o en km si pasa de 1000.
  const dist = !m ? "" : m.d >= 1000 ? (m.d / 1000).toFixed(1).replace(".", ",") + " km" : Math.round(m.d) + " m";
  $("#l-m").textContent = m ? `Más cercana: ${m.r.tipo} ${m.r.id} · a ${dist} (aprox.)` : "Toca ☆ Guardar para ponerla en favoritos (por ejemplo, Mi casa).";
  $("#estrella").addEventListener("click", () => alternar(i));
  $("#cerrar").addEventListener("click", () => { detener(); lugar = null; c.hidden = true; capaLugar.clearLayers(); $("#q").value = ""; volver(); });
  pintarFavs();
  // Cambia a la pestaña Rutas y dibuja la ruta más cercana incluyendo el lugar en el zoom.
  tab("rutas");
  if (m) { elegir(m.r, i); planearViaje(i, ll); }
  else { volver(); mapa.setView(ll, 16); }
}

// ---------- Favoritos ----------
// favs = favoritos del usuario (vienen del servidor); mismo() compara lugares por coordenadas; posFav() busca la posición en favs.
let favs = [];
const mismo = (a, b) => Math.abs(a.lat - b.lat) < 5e-5 && Math.abs(a.lng - b.lng) < 5e-5;
const posFav = (i) => favs.findIndex((f) => mismo(f, i));

// Pide al servidor los favoritos de este navegador y los pinta.
async function cargarFavoritos() {
  const data = await api("/api/favorites?client_id=" + encodeURIComponent(CLIENTE_ID));
  favs = data.favoritos;
  pintarFavs();
}

// Guarda el lugar como favorito (POST) o lo quita si ya lo era (DELETE) y recarga la lista.
async function alternar(i) {
  const k = posFav(i);
  let datos = i;
  if (k < 0 && i.gps) {
    const n = prompt("¿Cómo quieres llamar este lugar?", "Mi casa");
    if (n === null) return;
    datos = { ...i, titulo: n.trim() || "Mi ubicación", detalle: "Guardado desde el GPS" };
  }
  try {
    if (k >= 0) {
      await api(`/api/favorites?id=${favs[k].id}&client_id=${encodeURIComponent(CLIENTE_ID)}`, { method: "DELETE" });
    } else {
      await api("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: CLIENTE_ID, titulo: datos.titulo, detalle: datos.detalle, lat: datos.lat, lng: datos.lng }),
      });
    }
    await cargarFavoritos();
  } catch (e) { alert("No se pudo actualizar el favorito: " + e.message); }
}

// Dibuja la pestaña Favoritos y las estrellas del mapa, y actualiza el botón ☆/★ de la tarjeta del lugar.
function pintarFavs() {
  const p = $("#p-favoritos");
  p.innerHTML = "";
  if (!favs.length) p.appendChild(nodo("p", "nota", "Aún no tienes favoritos. Busca un lugar y toca “☆ Guardar”."));
  capaFav.clearLayers();
  favs.forEach((f) => {
    const d = nodo("div", "fav"), b = nodo("button", "ir"), t = nodo("b"), s = nodo("span"), x = nodo("button", "x", "✕");
    t.textContent = f.titulo; s.textContent = f.detalle;
    b.append(t, s);
    b.addEventListener("click", () => ir(f));
    x.setAttribute("aria-label", "Quitar " + f.titulo);
    x.addEventListener("click", () => alternar(f));
    d.append(b, x);
    p.appendChild(d);
    L.marker([f.lat, f.lng], { icon: L.divIcon({ className: "", html: '<div class="favm">★</div>', iconSize: [22, 22], iconAnchor: [11, 11] }) })
      .bindTooltip(f.titulo).on("click", () => ir(f)).addTo(capaFav);
  });
  const e = $("#estrella");
  if (e && lugar) { const es = posFav(lugar) >= 0; e.textContent = es ? "★ Guardado" : "☆ Guardar"; e.classList.toggle("on", es); }
}

// Arranque: pinta la lista de rutas y carga favoritos, opiniones y tarifas desde el servidor.
lista();
pintarFavs();
void pintarOpiniones();
void cargarTarifas();
void cargarFavoritos().catch((e) => alert("No se pudieron cargar los favoritos: " + e.message));

// ---------- Mi ubicación (GPS del dispositivo) ----------
// Pide la posición con navigator.geolocation y reutiliza ir() para mostrar la ruta más cercana.
$("#gps").addEventListener("click", () => {
  if (!navigator.geolocation) { alert("Tu navegador no permite usar el GPS."); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => { miPos = L.latLng(pos.coords.latitude, pos.coords.longitude); ir({ titulo: "Mi ubicación", detalle: "Detectada por GPS", lat: pos.coords.latitude, lng: pos.coords.longitude, gps: true }, true); },
    () => alert("No se pudo obtener tu ubicación. Activa el GPS y da permiso al navegador."),
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

// ---------- Tiempo de llegada y tráfico ----------
// Clave GRATIS de https://developer.tomtom.com (Traffic API y Routing API). Con la clave vacía no hay tráfico en vivo.
const TOMTOM_KEY = "3uHLCEgWCEliCUOT9juBiUOtcYlmlizC";
// Velocidad promedio estimada (km/h) de cada tipo de transporte en la ciudad.
const VEL = { Micro: 16, Trufi: 18, Taxitrufi: 18, Minibús: 20, Tren: 30 };
// miPos = última posición GPS conocida.
let miPos = null;
// Pide tu posición al GPS (usa la última si falla); devuelve null si no hay ninguna.
const posicion = () => new Promise((ok) => navigator.geolocation
  ? navigator.geolocation.getCurrentPosition((p) => ok((miPos = L.latLng(p.coords.latitude, p.coords.longitude))), () => ok(miPos), { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 })
  : ok(null));

// Pide un mosaico de prueba a TomTom y, si responde con error, explica qué pasa (la capa no se vería).
function probarTrafico() {
  const z = 13, n = 2 ** z, la = -17.3935 * Math.PI / 180;
  const x = Math.floor((-66.157 + 180) / 360 * n), y = Math.floor((1 - Math.log(Math.tan(la) + 1 / Math.cos(la)) / Math.PI) / 2 * n);
  fetch(`https://api.tomtom.com/traffic/map/4/tile/flow/relative/${z}/${x}/${y}.png?key=${TOMTOM_KEY}`)
    .then((res) => { if (!res.ok) alert(`TomTom respondió ${res.status}. ` + (res.status === 403 || res.status === 401 ? "Revisa en developer.tomtom.com que tu clave tenga activada la Traffic API, que no tenga restricción de dominio y que no superaste el límite diario." : "La capa de tráfico no está disponible ahora.")); })
    .catch(() => { /* sin respuesta legible (por ejemplo, sin internet): no se avisa */ });
}
// Botón 🚦: muestra u oculta las capas de tráfico de TomTom sobre el mapa.
let capaTrafico = null;
mapa.createPane("trafico").style.zIndex = 250; // capa propia: el modo oscuro no le cambia los colores
$("#trafico").addEventListener("click", () => {
  if (!TOMTOM_KEY) { alert("Para ver el tráfico en vivo pega tu clave gratuita de TomTom en TOMTOM_KEY, al inicio del bloque “Tiempo de llegada y tráfico” de script.js."); return; }
  if (capaTrafico) { mapa.removeLayer(capaTrafico); capaTrafico = null; $("#trafico").style.opacity = ""; return; }
  capaTrafico = L.tileLayer(`https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${TOMTOM_KEY}`, { maxZoom: 19, opacity: 0.85, pane: "trafico" }).addTo(mapa);
  $("#trafico").style.opacity = "1";
  probarTrafico();
  $("#trafico").style.outline = "2px solid #00695c";
});

// Tiempo en auto de A a B: con clave usa TomTom (incluye demora por tráfico); sin clave usa OSRM (sin tráfico).
async function tiempoAuto(a, b) {
  try {
    if (TOMTOM_KEY) {
      const d = await (await fetch(`https://api.tomtom.com/routing/1/calculateRoute/${a.lat},${a.lng}:${b.lat},${b.lng}/json?traffic=true&key=${TOMTOM_KEY}`)).json();
      const s = d.routes[0].summary;
      return { seg: s.travelTimeInSeconds, demora: s.trafficDelayInSeconds, m: s.lengthInMeters };
    }
    const d = await (await fetch(`https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=false`)).json();
    return { seg: d.routes[0].duration, demora: null, m: d.routes[0].distance };
  } catch (e) { return null; }
}

// Elige la ruta que mejor sirve para ir de o (tu ubicación) a d (destino): la que minimiza lo que caminas hasta subir y desde que bajas.
function planear(o, d) {
  let mejor = null;
  RUTAS.forEach((r) => {
    const pts = [];
    for (let i = 0; i < r.paradas.length - 1; i++) {
      const a = r.paradas[i], b = r.paradas[i + 1];
      for (let k = 0; k < 20; k++) pts.push(L.latLng(a[0] + (b[0] - a[0]) * k / 20, a[1] + (b[1] - a[1]) * k / 20));
    }
    const u = r.paradas[r.paradas.length - 1]; pts.push(L.latLng(u[0], u[1]));
    let io = 0, id = 0;
    pts.forEach((p, k) => { if (o.distanceTo(p) < o.distanceTo(pts[io])) io = k; if (d.distanceTo(p) < d.distanceTo(pts[id])) id = k; });
    const dO = o.distanceTo(pts[io]), dD = d.distanceTo(pts[id]);
    if (!mejor || dO + dD < mejor.dO + mejor.dD) {
      const tramo = pts.slice(Math.min(io, id), Math.max(io, id) + 1);
      mejor = { r, dO, dD, bajada: pts[id], viaje: tramo.reduce((s, p, k) => s + (k ? tramo[k - 1].distanceTo(p) : 0), 0) };
    }
  });
  return mejor;
}

// Calcula y muestra, arriba del detalle de la ruta: tiempo total, hora de llegada, nivel de tráfico y comparación en auto.
async function planearViaje(i, ll) {
  const poner = (h) => { const v = $("#viaje"); if (v) v.remove(); const a = $("#detalle .atras"); if (a) a.insertAdjacentHTML("afterend", `<div id="viaje">${h}</div>`); };
  poner('<p class="nota">Calculando tiempo de llegada…</p>');
  const o = await posicion();
  if (lugar !== i) return;
  if (!o) { poner('<p class="nota">Activa el GPS y da permiso al navegador para ver el tiempo de llegada desde tu ubicación.</p>'); return; }
  const p = planear(o, ll);
  elegir(p.r, i, o);
  yo = L.circleMarker(o, { radius: 8, color: "#fff", weight: 3, fillColor: "#1565c0", fillOpacity: 1 }).bindTooltip("Tú").addTo(capaLugar);
  poner('<p class="nota">Calculando tiempo de llegada…</p>');
  const auto = await tiempoAuto(o, ll);
  await Promise.all([cargarReportes(), cargarHorarios()]);
  if (lugar !== i) return;
  const factor = auto && auto.demora != null ? 1 + auto.demora / Math.max(auto.seg - auto.demora, 60) : 1;
  const niv = !auto || auto.demora == null ? "Sin datos" : factor < 1.1 ? "Fluido" : factor < 1.3 ? "Moderado" : "Pesado";
  const ride = (p.viaje * 1.3 / 1000) / VEL[p.r.tipo] * 60 * factor;
  const tr = horarioTren(p.r), av = avisosRuta(p.r);
  const total = Math.round((p.dO + p.dD) / 80 + (tr ? tr.espera : 5) + ride + av.extra);
  const hora = new Date(Date.now() + total * 60000).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
  const m = (x) => (x >= 1000 ? (x / 1000).toFixed(1).replace(".", ",") + " km" : Math.round(x) + " m");
  poner(`<div class="stats"><div><b>${total} min</b><small>Tiempo total</small></div><div><b>${hora}</b><small>Llegada aprox.</small></div><div><b>${niv}</b><small>Tráfico</small></div></div>
    <p class="nota">🚶 ${m(p.dO)} hasta la parada · ⏱ espera ~${tr ? tr.espera : 5} min · ${ICONO[p.r.tipo]} ${Math.round(ride)} min en ${p.r.tipo} ${p.r.id} · 🚶 ${m(p.dD)} hasta tu destino</p>
    ${auto ? `<p class="nota">🚗 En auto: ${Math.round(auto.seg / 60)} min · ${m(auto.m)}</p>` : ""}
    ${niv === "Sin datos" ? '<p class="nota">Tiempos estimados sin tráfico en vivo (agrega tu clave de TomTom para activarlo).</p>' : ""}
    ${av.html}
    <button class="sec" id="iniciar">▶ Iniciar viaje y avisarme al bajar</button><p id="seguir" class="nota" hidden></p>`);
  $("#iniciar").addEventListener("click", () => seguir(p));
}

// ---------- Viaje en vivo y aviso de bajada ----------
// yo = marcador azul "Tú"; vigia = id del seguimiento GPS; bloqueo = pantalla encendida; avisado = ya sonó la alerta.
let yo = null, vigia = null, bloqueo = null, avisado = false;
// Detiene el seguimiento GPS y suelta el bloqueo de pantalla.
function detener() {
  if (vigia !== null) navigator.geolocation.clearWatch(vigia);
  vigia = null;
  if (bloqueo) { bloqueo.release().catch(() => {}); bloqueo = null; }
  const b = $("#iniciar"), t = $("#seguir");
  if (b) b.textContent = "▶ Iniciar viaje y avisarme al bajar";
  if (t) t.hidden = true;
}
// Botón "Iniciar viaje": sigue tu posición, mueve el punto azul y avisa (vibración + alerta) a menos de 250 m de donde bajas.
async function seguir(p) {
  if (vigia !== null) { detener(); return; }
  if (!navigator.geolocation) { alert("Tu navegador no permite usar el GPS."); return; }
  const b = $("#iniciar"), t = $("#seguir");
  avisado = false;
  b.textContent = "■ Detener viaje";
  t.hidden = false; t.textContent = "Buscando tu posición…";
  try { bloqueo = await navigator.wakeLock.request("screen"); } catch (e) { /* no todos los navegadores lo permiten */ }
  L.marker(p.bajada, { icon: L.divIcon({ className: "", html: '<div class="favm">🔔</div>', iconSize: [22, 22], iconAnchor: [11, 11] }) }).bindTooltip("Baja aquí").addTo(capaLugar);
  vigia = navigator.geolocation.watchPosition((pos) => {
    const o = L.latLng(pos.coords.latitude, pos.coords.longitude), d = o.distanceTo(p.bajada);
    miPos = o;
    if (yo) yo.setLatLng(o);
    if (!mapa.getBounds().contains(o)) mapa.panTo(o);
    t.textContent = d < 250 ? `🔔 ¡Prepárate para bajar! Estás a ${Math.round(d)} m de tu parada.` : `Te faltan ${d >= 1000 ? (d / 1000).toFixed(1).replace(".", ",") + " km" : Math.round(d) + " m"} para bajar.`;
    if (d < 250 && !avisado) {
      avisado = true;
      if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
      setTimeout(() => alert(`🔔 ¡Prepárate para bajar! Estás a ${Math.round(d)} m de tu parada.`), 150);
    }
  }, () => { t.textContent = "No se pudo seguir tu posición. Revisa el GPS y el permiso."; }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 });
}

// ---------- Horarios del tren ----------
// horarios = filas de /api/schedules (ruta, dia, primero, ultimo, cada). Si el servidor no tiene datos, queda vacío.
let horarios = [];
async function cargarHorarios() {
  if (horarios.length) return;
  try { horarios = (await api("/api/schedules")).horarios; } catch (e) { horarios = []; }
}
// Convierte "HH:MM" a minutos desde la medianoche.
const aMin = (h) => { const [a, b] = h.split(":"); return +a * 60 + +b; };
// Minutos desde la medianoche a "HH:MM", y próximo tren (la serie parte de la primera salida cada 'cada' minutos).
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const proximo = (h, ahora) => { const a = aMin(h.primero), t = a + Math.max(0, Math.ceil((ahora - a) / h.cada)) * h.cada; return t > aMin(h.ultimo) ? "ya no hay más trenes hoy" : hhmm(t); };
// Para una ruta de tren devuelve la espera promedio (mitad de la frecuencia) y el texto del horario de hoy; null si no es tren.
function horarioTren(r) {
  if (r.tipo !== "Tren") return null;
  const f = new Date(), dia = f.getDay() === 0 ? "domingo" : f.getDay() === 6 ? "sabado" : "semana";
  const h = horarios.find((x) => x.ruta === r.id && x.dia === dia);
  if (!h) return { espera: 5, html: '<p class="nota">Horario del tren aún no confirmado: se usa una espera de 5 min. Verifícalo con Mi Tren.</p>' };
  const ahora = f.getHours() * 60 + f.getMinutes(), fuera = ahora < aMin(h.primero) || ahora > aMin(h.ultimo);
  return { espera: Math.max(1, Math.round(h.cada / 2)), html: `<p class="nota">🚆 Hoy: ${h.primero}–${h.ultimo}, un tren cada ${h.cada} min.${fuera ? " ⚠ Ahora el tren está fuera de servicio." : " Próximo tren: " + proximo(h, ahora) + "."}</p>` };
}

// ---------- Reportes de la comunidad ----------
// TIPOS = emoji y nombre de cada tipo de reporte; reportes = avisos activos del servidor; capaRep = sus marcadores en el mapa.
const TIPOS = { bloqueo: ["🚧", "Bloqueo"], accidente: ["🚨", "Accidente"], desvio: ["↪️", "Desvío"], lleno: ["👥", "Micro lleno"], retraso: ["⏳", "Retraso"] };
let reportes = [];
const capaRep = L.layerGroup().addTo(mapa);
// Llena los selectores del formulario de avisos.
Object.entries(TIPOS).forEach(([k, [ic, n]]) => $("#av-tipo").appendChild(new Option(`${ic} ${n}`, k)));
$("#av-ruta").appendChild(new Option("Sin línea específica", ""));
RUTAS.forEach((r) => $("#av-ruta").appendChild(new Option(`${r.tipo} ${r.id}`, r.id)));

// Pide los avisos activos al servidor y los pinta (si no hay servidor, la lista queda vacía).
async function cargarReportes() {
  try { reportes = (await api("/api/reports")).reportes; } catch (e) { reportes = []; }
  pintarReportes();
}
// Dibuja la lista de avisos (con botones de votar) y sus marcadores rojos en el mapa.
function pintarReportes() {
  const p = $("#p-avisos-lista");
  p.innerHTML = "";
  capaRep.clearLayers();
  if (!reportes.length) p.appendChild(nodo("p", "nota", "No hay avisos activos en este momento."));
  reportes.forEach((r) => {
    const [ic, nom] = TIPOS[r.tipo] || ["⚠", r.tipo];
    L.marker([r.lat, r.lng], { icon: L.divIcon({ className: "", html: `<div class="favm" style="background:#c62828">${ic}</div>`, iconSize: [22, 22], iconAnchor: [11, 11] }) })
      .bindTooltip(`${nom} · hace ${r.min} min`).addTo(capaRep);
    const d = nodo("div", "op"), t = nodo("b"), s = nodo("small"), n = nodo("div"), v = nodo("div");
    t.textContent = `${ic} ${nom}${r.ruta ? " · " + r.ruta : ""}`;
    s.textContent = ` hace ${r.min} min · ✔ ${r.si} · ✖ ${r.no}`;
    n.textContent = r.nota;
    const si = nodo("button", "sec", "✔ Sigue ahí"), no = nodo("button", "sec", "✖ Ya no está");
    si.addEventListener("click", () => votar(r.id, true));
    no.addEventListener("click", () => votar(r.id, false));
    v.append(si, " ", no);
    d.append(t, s, n, v);
    p.appendChild(d);
  });
}
// Envía tu voto sobre un aviso y recarga la lista.
async function votar(id, vigente) {
  try {
    await api("/api/reports/vote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: CLIENTE_ID, id, vigente }) });
    await cargarReportes();
  } catch (e) { alert("No se pudo registrar tu voto: " + e.message); }
}
// Botón "Reportar": toma tu GPS y envía el aviso al servidor.
$("#av-enviar").addEventListener("click", async () => {
  const pos = await posicion();
  if (!pos) { alert("Activa el GPS y da permiso al navegador para reportar en tu ubicación."); return; }
  const b = $("#av-enviar");
  b.disabled = true;
  try {
    await api("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: CLIENTE_ID, tipo: $("#av-tipo").value, ruta: $("#av-ruta").value, nota: $("#av-nota").value.trim(), lat: pos.lat, lng: pos.lng }) });
    $("#av-nota").value = "";
    await cargarReportes();
  } catch (e) { alert("No se pudo enviar el reporte: " + e.message); }
  finally { b.disabled = false; }
});
// Distancia mínima (m) entre un punto y el recorrido de una ruta.
function distRuta(r, ll) {
  let m = Infinity;
  for (let i = 0; i < r.paradas.length - 1; i++) {
    const a = r.paradas[i], b = r.paradas[i + 1];
    for (let k = 0; k <= 20; k++) m = Math.min(m, ll.distanceTo([a[0] + (b[0] - a[0]) * k / 20, a[1] + (b[1] - a[1]) * k / 20]));
  }
  return m;
}
// Avisos que afectan a una ruta (de esa línea o a menos de 300 m). Si otra persona los confirmó, suman demora al viaje.
function avisosRuta(r) {
  let extra = 0, html = "";
  reportes.forEach((x) => {
    if (x.ruta !== r.id && distRuta(r, L.latLng(x.lat, x.lng)) > 300) return;
    const conf = x.si >= 1, [ic, nom] = TIPOS[x.tipo] || ["⚠", x.tipo];
    if (conf) extra += { bloqueo: 10, accidente: 10, desvio: 5, retraso: 5 }[x.tipo] || 0;
    html += `<p class="nota">${ic} ${nom} reportado hace ${x.min} min ${x.ruta === r.id ? "en esta línea" : "cerca de la ruta"} (${conf ? "confirmado" : "sin confirmar"}).</p>`;
  });
  return { extra, html };
}
void cargarReportes();

// ---------- Tráfico por delante en la ruta elegida ----------
// Distancia legible: metros o km.
const fmt = (x) => (x >= 1000 ? (x / 1000).toFixed(1).replace(".", ",") + " km" : Math.round(x) + " m");
// Pide a TomTom el recorrido por las paradas ps con tráfico en vivo; devuelve la ruta, {error: código} o null.
async function rutaTrafico(ps) {
  try {
    const res = await fetch(`https://api.tomtom.com/routing/1/calculateRoute/${ps.map((p) => p[0] + "," + p[1]).join(":")}/json?traffic=true&computeTravelTimeFor=all&key=${TOMTOM_KEY}`);
    if (!res.ok) return { error: res.status };
    return (await res.json()).routes[0];
  } catch (e) { return null; }
}
// Bajo el título de la ruta: horario y próximo tren (si es tren) o tráfico por delante + llegada aproximada (demás transportes).
// "Por delante" = desde la parada más cercana a ti hacia el extremo más lejano de la línea (sin GPS: toda la línea).
async function infoRuta(r) {
  const poner = (h) => { const e = $("#tr-ruta"); if (e) e.remove(); const t = $("#detalle h2"); if (t && sel === r) t.insertAdjacentHTML("afterend", `<div id="tr-ruta">${h}</div>`); };
  if (r.tipo === "Tren") { await cargarHorarios(); poner(horarioTren(r).html); return; }
  if (!TOMTOM_KEY) { poner('<p class="nota">Pega tu clave de TomTom en script.js para ver el tráfico por delante.</p>'); return; }
  poner('<p class="nota">Calculando tráfico por delante…</p>');
  const o = await posicion();
  if (sel !== r) return;
  let ps = r.paradas, ya = 0;
  if (o) {
    const k = ps.reduce((b, p, j) => (o.distanceTo([p[0], p[1]]) < o.distanceTo([ps[b][0], ps[b][1]]) ? j : b), 0);
    ps = k <= (ps.length - 1) / 2 ? ps.slice(k) : ps.slice(0, k + 1).reverse();
    ya = o.distanceTo([ps[0][0], ps[0][1]]);
    if (ps.length < 2) { ps = r.paradas; ya = 0; }
  }
  const d = await rutaTrafico(ps);
  if (sel !== r) return;
  if (!d || d.error || !d.summary) { poner(`<p class="nota">No se pudo obtener el tráfico${d && d.error ? " (TomTom respondió " + d.error + (d.error === 403 ? ": revisa que tu clave tenga activada la Routing API o que no superaste el límite diario" : "") + ")" : ". Revisa tu internet"}.</p>`); return; }
  // Pinta cada tramo entre paradas con el color de su tráfico: verde fluido, amarillo moderado, rojo pesado.
  d.legs.forEach((g) => {
    const dl = g.summary.trafficDelayInSeconds || 0, f = 1 + dl / Math.max(g.summary.travelTimeInSeconds - dl, 30);
    L.polyline(g.points.map((q) => [q.latitude, q.longitude]), { color: f < 1.1 ? "#2e7d32" : f < 1.3 ? "#f9a825" : "#c62828", weight: 5 }).addTo(capa);
  });
  const s = d.summary, delay = s.trafficDelayInSeconds || 0, f = 1 + delay / Math.max(s.travelTimeInSeconds - delay, 60);
  const niv = f < 1.1 ? "Fluido" : f < 1.3 ? "Moderado" : "Pesado";
  const total = Math.round(ya / 80 + 5 + (s.lengthInMeters / 1000) / (VEL[r.tipo] || 16) * 60 * f);
  const hora = new Date(Date.now() + total * 60000).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
  const sinDatos = s.liveTrafficIncidentsTravelTimeInSeconds !== undefined && s.noTrafficTravelTimeInSeconds === s.liveTrafficIncidentsTravelTimeInSeconds && s.noTrafficTravelTimeInSeconds === s.historicTrafficTravelTimeInSeconds;
  poner(`<div class="stats"><div><b>${niv}</b><small>Tráfico por delante</small></div><div><b>${total} min</b><small>Hasta el final</small></div><div><b>${hora}</b><small>Llegada aprox.</small></div></div>
    <p class="nota">${fmt(s.lengthInMeters)} por delante · +${Math.round(delay / 60)} min por tráfico. En el mapa: verde fluido, amarillo moderado, rojo pesado.${o ? ` Incluye ${fmt(ya)} caminando hasta la parada más cercana y 5 min de espera.` : " Activa el GPS para contar desde tu posición."}${sinDatos ? " ⚠ TomTom parece no tener datos de tráfico en esta zona: el tiempo es sin tráfico." : ""}</p>`);
}

// ---------- Modo oscuro / claro ----------
// Activa o quita la clase 'oscuro' del body (los estilos están en style.css) y recuerda la elección.
const oscuro = (on) => {
  document.body.classList.toggle("oscuro", on);
  $("#tema").textContent = on ? "☀️" : "🌙";
  try { localStorage.setItem("cocharuta-tema", on ? "oscuro" : "claro"); } catch (e) {}
};
$("#tema").addEventListener("click", () => oscuro(!document.body.classList.contains("oscuro")));
// Al abrir: usa la elección guardada o, si no hay, el tema del dispositivo.
oscuro((() => { try { const t = localStorage.getItem("cocharuta-tema"); if (t) return t === "oscuro"; } catch (e) {} return matchMedia("(prefers-color-scheme: dark)").matches; })());

// ---------- App instalable (PWA) y uso sin conexión ----------
// Registra el Service Worker (sw.js), que guarda en caché lo que la app va usando.
if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});