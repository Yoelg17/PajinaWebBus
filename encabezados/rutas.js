const rutas = [
  // ===== RUTAS ORIGINALES =====
  { origen: "Pomabamba", destino: "Huaraz", tipo: "Viaje directo", duracion: "3h 30m aprox.", precio: 22,
    imagen: "../imagenes/sliders/pomabamba1.png", servicios: "Asiento semi-cama · WiFi",
    horarios: ["05:00 a. m.", "09:00 a. m.", "02:00 p. m."] },
  { origen: "Pomabamba", destino: "Huaraz", tipo: "Con paradas", duracion: "4h aprox.", precio: 25,
    imagen: "../imagenes/sliders/pomabamba2.png", servicios: "Asiento estándar · Baño",
    horarios: ["06:30 a. m.", "11:00 a. m.", "04:00 p. m."] },
  { origen: "Pomabamba", destino: "Lima", tipo: "Viaje directo", duracion: "7h 40m aprox.", precio: 60,
    imagen: "../imagenes/sliders/pomabamba3.png", servicios: "Asiento cama · WiFi · Baño",
    horarios: ["07:00 p. m.", "09:00 p. m."] },
  { origen: "Pomabamba", destino: "Lima", tipo: "Con paradas", duracion: "8h 20m aprox.", precio: 62,
    imagen: "../imagenes/sliders/pomabamba4.png", servicios: "Asiento semi-cama · Baño",
    horarios: ["06:00 p. m.", "08:00 p. m.", "10:00 p. m."] },

  // ===== HUARAZ: MÁS TURNOS =====
  { origen: "Pomabamba", destino: "Huaraz", tipo: "Madrugador", duracion: "3h 30m aprox.", precio: 24,
    imagen: "../imagenes/sliders/huaraz1.jpg", servicios: "Asiento semi-cama · Baño · Desayuno",
    horarios: ["03:30 a. m.", "04:15 a. m.", "05:30 a. m.", "07:00 a. m."] },
  { origen: "Pomabamba", destino: "Huaraz", tipo: "Turno mañana", duracion: "3h 45m aprox.", precio: 23,
    imagen: "../imagenes/sliders/huarraz2.jpg", servicios: "Asiento estándar · Baño",
    horarios: ["08:00 a. m.", "10:00 a. m.", "12:00 p. m."] },
  { origen: "Pomabamba", destino: "Huaraz", tipo: "Turno tarde", duracion: "3h 45m aprox.", precio: 23,
    imagen: "../imagenes/sliders/huaraz1.jpg", servicios: "Asiento semi-cama · WiFi",
    horarios: ["01:00 p. m.", "03:00 p. m.", "05:00 p. m.", "06:30 p. m."] },
  { origen: "Pomabamba", destino: "Huaraz", tipo: "Económico", duracion: "4h 30m aprox.", precio: 18,
    imagen: "../imagenes/sliders/huarraz2.jpg", servicios: "Asiento estándar · Varias paradas",
    horarios: ["05:45 a. m.", "09:30 a. m.", "01:30 p. m.", "04:30 p. m."] },

  // ===== LIMA: MÁS TURNOS =====
  { origen: "Pomabamba", destino: "Lima", tipo: "Bus cama VIP", duracion: "7h 30m aprox.", precio: 85,
    imagen: "../imagenes/sliders/lima1.jpg", servicios: "Asiento cama 180° · WiFi · Baño · Cena",
    horarios: ["06:30 p. m.", "08:30 p. m.", "10:30 p. m."] },
  { origen: "Pomabamba", destino: "Lima", tipo: "Turno mañana", duracion: "8h aprox.", precio: 58,
    imagen: "../imagenes/sliders/lima2.jpg", servicios: "Asiento semi-cama · Baño",
    horarios: ["05:00 a. m.", "07:30 a. m.", "09:00 a. m."] },
  { origen: "Pomabamba", destino: "Lima", tipo: "Turno tarde", duracion: "8h aprox.", precio: 58,
    imagen: "../imagenes/sliders/lima1.jpg", servicios: "Asiento semi-cama · WiFi · Baño",
    horarios: ["12:00 p. m.", "02:00 p. m.", "04:00 p. m.", "05:30 p. m."] },
  { origen: "Pomabamba", destino: "Lima", tipo: "Económico", duracion: "9h aprox.", precio: 50,
    imagen: "../imagenes/sliders/lima2.jpg", servicios: "Asiento estándar · Varias paradas",
    horarios: ["06:00 a. m.", "11:00 a. m.", "03:00 p. m.", "07:30 p. m."] }
];


const contenedor = document.getElementById("listaRutas");

function mostrarRutas(filtro) {
  contenedor.innerHTML = "";
  rutas.forEach(function (ruta, i) {
    if (filtro !== "todos" && ruta.destino !== filtro) return;
    contenedor.innerHTML += `
      <div class="col-12 col-md-6 col-lg-3">
        <div class="tarjeta-ruta">
          <img src="${ruta.imagen}" alt="Ruta de ${ruta.origen} a ${ruta.destino}">
          <div class="tarjeta-ruta-info">
            <h5>${ruta.origen} ➭ ${ruta.destino}</h5>
            <p>${ruta.tipo} · ${ruta.duracion}</p>
            <p class="precio-desde">Desde S/ ${ruta.precio.toFixed(2)}</p>
            <button class="btn-ruta" data-id="${i}">Ver horarios</button>
          </div>
        </div>
      </div>`;
  });
}
let seleccion = { ruta: null, hora: null, fecha: null, asientos: [] };
let metodoActual = "yape";
const MAX_ASIENTOS = 5;
const vendidos = {};   // asientos comprados en esta sesión

const nombresMetodo = { yape: "Yape", plin: "Plin", tarjeta: "Tarjeta", agencia: "Pago en agencia" };

function dinero(n) {
  return "S/ " + n.toFixed(2);
}

function fechaBonita(f) {
  const p = f.split("-");
  return p[2] + "/" + p[1] + "/" + p[0];
}

function fechaISO(d) {
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + mes + "-" + dia;
}

// ---------- ASIENTOS OCUPADOS "DE EJEMPLO" ----------
// Estas dos funciones hacen que el mismo viaje (ruta + hora + fecha)
// siempre tenga los mismos asientos ocupados.
function semilla(texto) {
  let h = 0;
  for (let i = 0; i < texto.length; i++) {
    h = (Math.imul(31, h) + texto.charCodeAt(i)) | 0;
  }
  return h;
}

function aleatorio(seed) {
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function claveViaje() {
  const r = seleccion.ruta;
  return [r.origen, r.destino, r.tipo, seleccion.hora, seleccion.fecha].join("|");
}

// ---------- VENTANA DE HORARIOS ----------
function abrirHorarios(ruta) {
  seleccion = { ruta: ruta, hora: null, fecha: null, asientos: [] };
  document.getElementById("avisoHorario").textContent = "";
  document.getElementById("modalTitulo").textContent = ruta.origen + " ➭ " + ruta.destino;

  let chips = "";
  ruta.horarios.forEach(function (h) {
    chips += `<button type="button" class="horario-chip" data-hora="${h}">${h}</button>`;
  });

  document.getElementById("modalCuerpo").innerHTML = `
    <p><strong>${ruta.tipo}</strong> · ${ruta.duracion}</p>
    <p>${ruta.servicios}</p>
    <p class="mb-2">Elige tu hora de salida:</p>
    <div>${chips}</div>
    <p class="precio-desde mt-3 mb-0">${dinero(ruta.precio)} por persona</p>`;

  bootstrap.Modal.getOrCreateInstance(document.getElementById("modalHorarios")).show();
}

document.getElementById("modalCuerpo").addEventListener("click", function (e) {
  const chip = e.target.closest(".horario-chip");
  if (!chip) return;
  document.querySelectorAll(".horario-chip").forEach(function (c) {
    c.classList.remove("elegido");
  });
  chip.classList.add("elegido");
  seleccion.hora = chip.dataset.hora;
  document.getElementById("avisoHorario").textContent = "";
});

document.getElementById("modalComprar").addEventListener("click", function () {
  if (!seleccion.hora) {
    document.getElementById("avisoHorario").textContent = "Elige una hora de salida.";
    return;
  }
  const elHorarios = document.getElementById("modalHorarios");
  elHorarios.addEventListener("hidden.bs.modal", abrirPago, { once: true });
  bootstrap.Modal.getInstance(elHorarios).hide();
});

// ---------- VENTANA DE COMPRA ----------
function mostrarPaso(id, titulo) {
  ["pasoAsientos", "pasoPago", "pasoExito"].forEach(function (p) {
    document.getElementById(p).classList.add("d-none");
  });
  document.getElementById(id).classList.remove("d-none");
  document.getElementById("tituloPago").textContent = titulo;
}

function abrirPago() {
  const r = seleccion.ruta;
  seleccion.asientos = [];
  seleccion.fecha = fechaISO(new Date(Date.now() + 24 * 60 * 60 * 1000)); // mañana

  const inputFecha = document.getElementById("asFecha");
  inputFecha.min = fechaISO(new Date());
  inputFecha.value = seleccion.fecha;

  document.getElementById("asRuta").textContent = r.origen + " ➭ " + r.destino;
  document.getElementById("asTipo").textContent = r.tipo + " · " + r.duracion;
  document.getElementById("asHora").textContent = seleccion.hora;
  document.getElementById("asPrecio").textContent = dinero(r.precio);

  ["pNombre", "pDni", "pTelefono", "pCorreo", "tNumero", "tVence", "tCvv"].forEach(function (id) {
    document.getElementById(id).value = "";
  });
  document.getElementById("errorPago").textContent = "";
  document.getElementById("errorAsientos").textContent = "";

  mostrarPaso("pasoAsientos", "Elige tus asientos");
  dibujarBus();
  actualizarResumen();
  bootstrap.Modal.getOrCreateInstance(document.getElementById("modalPago")).show();
}

// ---------- MAPA DEL BUS ----------
function dibujarBus() {
  const mapa = document.getElementById("mapaBus");

  if (!seleccion.fecha) {
    mapa.className = "";
    mapa.innerHTML = '<p class="text-center mb-0">Elige la fecha de viaje para ver los asientos.</p>';
    document.getElementById("asLibres").textContent = "";
    return;
  }

  const esCama = seleccion.ruta.servicios.includes("Asiento cama");
  const porFila = esCama ? 3 : 4;   // cama: 2+1 · normal: 2+2
  const filas = esCama ? 9 : 10;
  const azar = aleatorio(semilla(claveViaje()));
  const yaVendidos = vendidos[claveViaje()] || [];

  let html = "";
  for (let f = 0; f < filas; f++) {
    html += '<div class="fila-bus">';
    for (let c = 0; c < porFila; c++) {
      const n = f * porFila + c + 1;
      const ocupado = azar() < 0.3 || yaVendidos.includes(n);
      if (c === 2) html += '<span class="pasillo"></span>';
      if (ocupado) {
        html += `<button type="button" class="asiento ocupado" disabled>✕</button>`;
      } else {
        html += `<button type="button" class="asiento libre" data-n="${n}">${n}</button>`;
      }
    }
    html += "</div>";
  }

  mapa.className = esCama ? "mapa-cama" : "";
  mapa.innerHTML = html;

  const libres = mapa.querySelectorAll(".asiento.libre").length;
  document.getElementById("asLibres").textContent =
    "Quedan " + libres + " asientos libres" + (esCama ? " · Bus cama" : "");
}

function actualizarResumen() {
  const cant = seleccion.asientos.length;
  const total = seleccion.ruta.precio * cant;
  document.getElementById("asAsientos").textContent = cant ? seleccion.asientos.join(", ") : "—";
  document.getElementById("asTotal").textContent = dinero(total);
}

function textoBotonPagar() {
  const total = seleccion.ruta.precio * seleccion.asientos.length;
  document.getElementById("btnPagar").textContent =
    (metodoActual === "agencia" ? "Reservar pasaje · " : "Pagar ") + dinero(total);
}

// Elegir o quitar un asiento
document.getElementById("mapaBus").addEventListener("click", function (e) {
  const boton = e.target.closest(".asiento");
  if (!boton || boton.disabled) return;

  const n = parseInt(boton.dataset.n);
  const pos = seleccion.asientos.indexOf(n);
  const error = document.getElementById("errorAsientos");

  if (pos >= 0) {
    seleccion.asientos.splice(pos, 1);
    boton.classList.remove("elegido");
  } else {
    if (seleccion.asientos.length >= MAX_ASIENTOS) {
      error.textContent = "Máximo " + MAX_ASIENTOS + " asientos por compra.";
      return;
    }
    seleccion.asientos.push(n);
    seleccion.asientos.sort(function (a, b) { return a - b; });
    boton.classList.add("elegido");
  }
  error.textContent = "";
  actualizarResumen();
});

// Cambiar la fecha: se vuelve a dibujar el bus
document.getElementById("asFecha").addEventListener("change", function () {
  seleccion.fecha = this.value;
  seleccion.asientos = [];
  document.getElementById("errorAsientos").textContent = "";
  dibujarBus();
  actualizarResumen();
});

// Continuar a datos y pago
document.getElementById("btnContinuar").addEventListener("click", function () {
  const error = document.getElementById("errorAsientos");
  if (!seleccion.fecha) { error.textContent = "Elige la fecha de viaje."; return; }
  if (seleccion.asientos.length === 0) { error.textContent = "Elige al menos un asiento."; return; }
  error.textContent = "";

  const r = seleccion.ruta;
  const total = r.precio * seleccion.asientos.length;
  document.getElementById("resRuta").textContent = r.origen + " ➭ " + r.destino;
  document.getElementById("resTipo").textContent = r.tipo + " · " + r.duracion;
  document.getElementById("resFecha").textContent = fechaBonita(seleccion.fecha);
  document.getElementById("resHora").textContent = seleccion.hora;
  document.getElementById("resAsientos").textContent = seleccion.asientos.join(", ");
  document.getElementById("resPrecio").textContent = dinero(r.precio);
  document.getElementById("resTotal").textContent = dinero(total);
  textoBotonPagar();

  mostrarPaso("pasoPago", "Completa tu compra");
});

document.getElementById("btnVolver").addEventListener("click", function () {
  mostrarPaso("pasoAsientos", "Elige tus asientos");
});

// ---------- MÉTODOS DE PAGO ----------
document.querySelectorAll(".metodo").forEach(function (btn) {
  btn.addEventListener("click", function () {
    metodoActual = btn.dataset.metodo;
    document.querySelectorAll(".metodo").forEach(function (b) { b.classList.remove("activo"); });
    btn.classList.add("activo");
    document.querySelectorAll(".detalle-metodo").forEach(function (d) { d.classList.add("d-none"); });
    document.getElementById("detalle-" + metodoActual).classList.remove("d-none");
    textoBotonPagar();
  });
});

function soloNumeros(id) {
  document.getElementById(id).addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });
}
soloNumeros("pDni");
soloNumeros("pTelefono");
soloNumeros("tCvv");

document.getElementById("tNumero").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
});
document.getElementById("tVence").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 4);
  if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
  this.value = v;
});

// ---------- PAGAR ----------
document.getElementById("btnPagar").addEventListener("click", function () {
  const error = document.getElementById("errorPago");
  const nombre = document.getElementById("pNombre").value.trim();
  const dni = document.getElementById("pDni").value;
  const tel = document.getElementById("pTelefono").value;
  const correo = document.getElementById("pCorreo").value.trim();

  if (nombre.length < 5) { error.textContent = "Escribe tus nombres y apellidos."; return; }
  if (!/^\d{8}$/.test(dni)) { error.textContent = "El DNI debe tener 8 números."; return; }
  if (!/^9\d{8}$/.test(tel)) { error.textContent = "El celular debe tener 9 números y empezar con 9."; return; }
  if (!/^\S+@\S+\.\S+$/.test(correo)) { error.textContent = "Escribe un correo válido."; return; }

  if (metodoActual === "tarjeta") {
    if (document.getElementById("tNumero").value.replace(/\s/g, "").length !== 16) {
      error.textContent = "El número de tarjeta debe tener 16 dígitos."; return;
    }
    if (!/^\d{2}\/\d{2}$/.test(document.getElementById("tVence").value)) {
      error.textContent = "Escribe el vencimiento como MM/AA."; return;
    }
    if (document.getElementById("tCvv").value.length < 3) {
      error.textContent = "Escribe el CVV de tu tarjeta."; return;
    }
  }

  error.textContent = "";
  const r = seleccion.ruta;
  const total = r.precio * seleccion.asientos.length;
  const codigo = "PE-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  document.getElementById("exCodigo").textContent = codigo;
  document.getElementById("exNombre").textContent = nombre;
  document.getElementById("exRuta").textContent = r.origen + " ➭ " + r.destino;
  document.getElementById("exFecha").textContent = fechaBonita(seleccion.fecha);
  document.getElementById("exHora").textContent = seleccion.hora;
  document.getElementById("exAsientos").textContent = seleccion.asientos.join(", ");
  document.getElementById("exMetodo").textContent = nombresMetodo[metodoActual];
  document.getElementById("exTotal").textContent = dinero(total);
  document.getElementById("exCorreo").textContent = correo;

  // Marcar esos asientos como vendidos para este viaje
  const clave = claveViaje();
  vendidos[clave] = (vendidos[clave] || []).concat(seleccion.asientos);

  mostrarPaso("pasoExito", "Compra realizada");
});

// ---------- DESCARGAR BOLETO EN .TXT ----------
document.getElementById("btnDescargar").addEventListener("click", function () {
  const get = function (id) { return document.getElementById(id).textContent; };

  const texto =
`POMABAMBA EXPRESS - BOLETO DE VIAJE
====================================
Código de reserva: ${get("exCodigo")}
Pasajero:  ${get("exNombre")}
Ruta:      ${get("exRuta")}
Fecha:     ${get("exFecha")}
Salida:    ${get("exHora")}
Asientos:  ${get("exAsientos")}
Método:    ${get("exMetodo")}
Total:     ${get("exTotal")}
====================================
Llegue 30 minutos antes con su DNI.
`;

  const archivo = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = "boleto-" + get("exCodigo") + ".txt";
  enlace.click();
  URL.revokeObjectURL(enlace.href);
});

// ---------- TARJETAS Y FILTROS ----------
contenedor.addEventListener("click", function (e) {
  const boton = e.target.closest(".btn-ruta");
  if (!boton) return;
  abrirHorarios(rutas[boton.dataset.id]);
});

document.querySelectorAll(".filtro").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelector(".filtro.activo").classList.remove("activo");
    btn.classList.add("activo");
    mostrarRutas(btn.dataset.filtro);
  });
});

mostrarRutas("todos");