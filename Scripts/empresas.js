const empresas = [
  {
    nombre: "Transportes Cordillera",
    descripcion: "Más de 10 años conectando Pomabamba con la costa, con buses modernos y conductores capacitados.",
    detalle: "Transportes Cordillera nació para unir Pomabamba con Lima y Huaraz de forma segura. Sus buses pasan revisión técnica antes de cada salida y sus conductores reciben capacitación constante.",
    imagen: "../imagenes/buses/empresas1.jpg",
    calificacion: 4.5, opiniones: 120,
    anios: 10, buses: 25, salidas: 8,
    direccion: "Terminal terrestre de Pomabamba",
    telefono: "999 999 991",
    horario: "Todos los días, 5:00 a. m. a 10:00 p. m.",
    flota: "Bus cama, semi-cama y estándar",
    rutas: ["Pomabamba ➭ Lima", "Pomabamba ➭ Huaraz"],
    servicios: ["WiFi", "Baño", "Asiento cama"]
  },
  {
    nombre: "Turismo Andino Sur",
    descripcion: "Especialistas en viajes cómodos de larga distancia, con salidas en la mañana y en la noche.",
    detalle: "Turismo Andino Sur se enfoca en la comodidad del pasajero en trayectos largos. Ofrece cena a bordo en los viajes nocturnos y asientos que se reclinan para dormir mejor.",
    imagen: "../imagenes/buses/empresas2.jpg",
    calificacion: 4.2, opiniones: 86,
    anios: 7, buses: 14, salidas: 5,
    direccion: "Av. Principal 123, Huaraz",
    telefono: "999 999 992",
    horario: "Lunes a sábado, 6:00 a. m. a 9:00 p. m.",
    flota: "Semi-cama y bus cama",
    rutas: ["Lima ➭ Pomabamba", "Huaraz ➭ Lima"],
    servicios: ["Baño", "Semi-cama", "Cena a bordo"]
  },
  {
    nombre: "Expreso Callejón",
    descripcion: "Servicio económico y puntual, con varias salidas al día y paradas en los principales pueblos.",
    detalle: "Expreso Callejón apuesta por precios accesibles y salidas frecuentes. Es una buena opción para quienes viajan a pueblos intermedios o buscan ahorrar.",
    imagen: "../imagenes/buses/empresas3.jpg",
    calificacion: 3.9, opiniones: 54,
    anios: 5, buses: 9, salidas: 10,
    direccion: "Jr. Comercio 456, Pomabamba",
    telefono: "999 999 993",
    horario: "Todos los días, 4:30 a. m. a 8:00 p. m.",
    flota: "Estándar y semi-cama",
    rutas: ["Pomabamba ➭ Huaraz", "Huaraz ➭ Pomabamba"],
    servicios: ["Asiento estándar", "Baño", "Varias paradas"]
  }
];

function estrellas(n) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += i <= Math.round(n) ? "★" : "☆";
  }
  return html;
}

function chips(lista) {
  return lista.map(function (s) {
    return '<span class="chip-servicio">' + s + "</span>";
  }).join("");
}

const contenedorEmpresas = document.getElementById("listaEmpresas");

if (contenedorEmpresas) {

  // ---------- TARJETAS ----------
  empresas.forEach(function (e, i) {
    contenedorEmpresas.innerHTML += `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="tarjeta-ruta">
          <img src="${e.imagen}" alt="Bus de ${e.nombre}">
          <div class="tarjeta-ruta-info">
            <h5>${e.nombre}</h5>
            <p class="estrellas">
              <span class="estrellas-icono">${estrellas(e.calificacion)}</span>
              <strong>${e.calificacion.toFixed(1)}</strong>
              <span class="estrellas-num">(${e.opiniones} opiniones)</span>
            </p>
            <div class="datos-rapidos">
              <div><strong>${e.anios}+</strong><span>años</span></div>
              <div><strong>${e.buses}</strong><span>buses</span></div>
              <div><strong>${e.salidas}</strong><span>salidas/día</span></div>
            </div>
            <p>${e.descripcion}</p>
            <div class="mb-3">${chips(e.servicios)}</div>
            <button type="button" class="btn-ruta btn-detalle" data-id="${i}">Ver más</button>
            <a href="rutas.html" class="btn-ruta-borde">Ver rutas</a>
          </div>
        </div>
      </div>`;
  });

  // ---------- VENTANA DE DETALLE ----------
  function abrirEmpresa(e) {
    const rutasHtml = e.rutas.map(function (r) { return "<li>" + r + "</li>"; }).join("");

    document.getElementById("empTitulo").textContent = e.nombre;
    document.getElementById("empCuerpo").innerHTML = `
      <img src="${e.imagen}" class="emp-foto" alt="Bus de ${e.nombre}">
      <p class="estrellas mt-3">
        <span class="estrellas-icono">${estrellas(e.calificacion)}</span>
        <strong>${e.calificacion.toFixed(1)}</strong>
        <span class="estrellas-num">(${e.opiniones} opiniones)</span>
      </p>
      <p>${e.detalle}</p>
      <ul class="resumen-lista emp-datos">
        <li><span>Terminal</span><strong>${e.direccion}</strong></li>
        <li><span>Teléfono</span><strong>${e.telefono}</strong></li>
        <li><span>Atención</span><strong>${e.horario}</strong></li>
        <li><span>Flota</span><strong>${e.flota}</strong></li>
        <li><span>Salidas por día</span><strong>${e.salidas}</strong></li>
      </ul>
      <p class="mb-1 mt-3"><strong>Rutas que atiende:</strong></p>
      <ul class="lista-rutas-empresa">${rutasHtml}</ul>
      <div>${chips(e.servicios)}</div>`;

    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEmpresa")).show();
  }

  contenedorEmpresas.addEventListener("click", function (ev) {
    const boton = ev.target.closest(".btn-detalle");
    if (!boton) return;
    abrirEmpresa(empresas[boton.dataset.id]);
  });
}