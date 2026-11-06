// ===== CONTACTOS =====

// ---------- DATOS DE EJEMPLO: CÁMBIALOS POR LOS REALES ----------
const HORARIO = { abre: 5, cierra: 22 };   // 5:00 a. m. a 10:00 p. m., todos los días

const agencias = [
  { ciudad: "Pomabamba", direccion: "Terminal terrestre de Pomabamba", telefono: "999 999 991",
    horario: "Todos los días · 5:00 a. m. a 10:00 p. m.", mapa: "Pomabamba, Áncash, Perú" },
  { ciudad: "Huaraz", direccion: "Av. Principal 123, Huaraz", telefono: "999 999 992",
    horario: "Todos los días · 5:00 a. m. a 9:00 p. m.", mapa: "Huaraz, Áncash, Perú" },
  { ciudad: "Lima", direccion: "Terminal terrestre, Lima", telefono: "999 999 993",
    horario: "Todos los días · 24 horas", mapa: "Lima, Perú" }
];

// El número de WhatsApp se pone en menu.js (const WHATSAPP). Si está vacío, no se muestra.
const numeroWa = (typeof WHATSAPP !== "undefined") ? WHATSAPP : "";

const $ = function (id) { return document.getElementById(id); };
const form = $("formContacto");

if (form) {

  // ---------- AVISO FLOTANTE ----------
  function aviso(texto) {
    let t = document.querySelector(".toast-pe");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast-pe";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = texto;
    t.classList.add("visible");
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.classList.remove("visible"); }, 2200);
  }

  // ---------- COPIAR TELÉFONO Y CORREO ----------
  document.querySelectorAll("[data-copiar]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const texto = btn.dataset.copiar;
      const listo = function () {
        const original = btn.textContent;
        btn.textContent = "¡Copiado!";
        aviso("Copiado: " + texto);
        setTimeout(function () { btn.textContent = original; }, 1500);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(listo);
      } else {
        const ta = document.createElement("textarea");
        ta.value = texto;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        listo();
      }
    });
  });

  // ---------- ABIERTO / CERRADO (hora de Lima) ----------
  function horaTexto(h) {
    const sufijo = h >= 12 ? "p. m." : "a. m.";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":00 " + sufijo;
  }
  function estadoAtencion() {
    const ahora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Lima" }));
    const h = ahora.getHours() + ahora.getMinutes() / 60;
    const el = $("estadoAtencion");
    if (h >= HORARIO.abre && h < HORARIO.cierra) {
      el.className = "estado-atencion abierto";
      el.textContent = "● Abierto ahora · cierra a las " + horaTexto(HORARIO.cierra);
    } else {
      el.className = "estado-atencion cerrado";
      el.textContent = "● Cerrado ahora · abre a las " + horaTexto(HORARIO.abre);
    }
  }
  estadoAtencion();
  setInterval(estadoAtencion, 60000);

  // ---------- WHATSAPP (solo si hay número) ----------
  function linkWa(texto) {
    return "https://wa.me/" + numeroWa + "?text=" + encodeURIComponent(texto);
  }
  if (numeroWa) {
    $("cardWhatsapp").classList.remove("d-none");
    $("linkWhatsapp").href = linkWa("Hola, quiero información sobre pasajes en Pomabamba Express.");
  }

  // ---------- AGENCIAS Y MAPA ----------
  const lista = $("listaAgencias");
  agencias.forEach(function (a, i) {
    lista.innerHTML += `
      <button type="button" class="agencia${i === 0 ? " activa" : ""}" data-i="${i}">
        <strong>${a.ciudad}</strong>
        <span>${a.direccion}</span>
        <span>${a.horario}</span>
        <span class="agencia-tel">${a.telefono}</span>
      </button>`;
  });

  function verMapa(i) {
    const q = encodeURIComponent(agencias[i].mapa);
    $("mapaFrame").src = "https://maps.google.com/maps?q=" + q + "&z=13&output=embed";
    $("mapaLink").href = "https://www.google.com/maps/search/?api=1&query=" + q;
  }
  lista.addEventListener("click", function (e) {
    const b = e.target.closest(".agencia");
    if (!b) return;
    lista.querySelectorAll(".agencia").forEach(function (x) { x.classList.remove("activa"); });
    b.classList.add("activa");
    verMapa(b.dataset.i);
  });
  verMapa(0);

  // ---------- FORMULARIO: REGLAS ----------
  const reglas = {
    cMotivo:   function (v) { return v ? "" : "Elige un motivo."; },
    cNombre:   function (v) {
      return v.trim().length >= 5 && /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/.test(v.trim())
        ? "" : "Escribe tus nombres y apellidos.";
    },
    cTelefono: function (v) { return /^9\d{8}$/.test(v) ? "" : "Debe tener 9 números y empezar con 9."; },
    cCorreo:   function (v) { return /^\S+@\S+\.\S+$/.test(v.trim()) ? "" : "Escribe un correo válido."; },
    cReserva:  function (v) {
      const m = $("cMotivo").value;
      if (!v.trim()) return (m === "reserva" || m === "equipaje") ? "Escribe tu código de reserva." : "";
      return /^PE-[A-Z0-9]{6}$/.test(v.trim().toUpperCase()) ? "" : "El código tiene el formato PE-ABC123.";
    },
    cEmpresa:  function (v) { return v.trim().length >= 3 ? "" : "Escribe el nombre de tu empresa."; },
    cMensaje:  function (v) { return v.trim().length >= 15 ? "" : "Cuéntanos un poco más (mínimo 15 caracteres)."; },
    cAcepto:   function (v) { return v ? "" : "Debes aceptar para poder enviar tu mensaje."; }
  };
  const ids = Object.keys(reglas);

  function validarCampo(id) {
    const el = $(id);
    const grupo = el.closest(".grupo");
    if (grupo.classList.contains("d-none")) return true;   // campo oculto: no se valida
    const valor = el.type === "checkbox" ? el.checked : el.value;
    const msg = reglas[id](valor);
    grupo.querySelector(".error-campo").textContent = msg;
    if (el.type !== "checkbox") {
      el.classList.toggle("invalido", !!msg);
      el.classList.toggle("valido", !msg && valor !== "");
    }
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  form.addEventListener("focusout", function (e) { if (reglas[e.target.id]) validarCampo(e.target.id); });
  form.addEventListener("change",   function (e) { if (reglas[e.target.id]) validarCampo(e.target.id); });
  form.addEventListener("input", function (e) {
    if (reglas[e.target.id] && e.target.classList.contains("invalido")) validarCampo(e.target.id);
  });

  // Formatos mientras escribe
  $("cTelefono").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 9);
  });
  $("cReserva").addEventListener("input", function () {
    this.value = this.value.toUpperCase();
  });
  $("cMensaje").addEventListener("input", function () {
    $("contadorMsg").textContent = this.value.length + " / 500";
  });

  // Campos extra según el motivo
  function mostrarGrupo(id, si) {
    const g = $(id);
    g.classList.toggle("d-none", !si);
    if (!si) {
      const input = g.querySelector("input");
      input.value = "";
      input.classList.remove("invalido", "valido");
      g.querySelector(".error-campo").textContent = "";
    }
  }
  function ajustarMotivo() {
    const m = $("cMotivo").value;
    mostrarGrupo("grupoReserva", ["reserva", "reclamo", "equipaje"].includes(m));
    mostrarGrupo("grupoEmpresa", m === "aliada");
  }
  $("cMotivo").addEventListener("change", ajustarMotivo);

  // Si llegan desde "Quiero ser aliada": contactos.html?asunto=aliada
  const asunto = new URLSearchParams(window.location.search).get("asunto");
  if (asunto && Array.from($("cMotivo").options).some(function (o) { return o.value === asunto; })) {
    $("cMotivo").value = asunto;
    ajustarMotivo();
  }

  // ---------- ENVÍO ----------
  // AHORA ES SIMULADO: no envía nada a ningún lado.
  // Para recibir los mensajes de verdad, cambia el contenido de esta función
  // por un servicio de formularios. Ejemplo con Formspree:
  //
  //   return fetch("https://formspree.io/f/TU_CODIGO", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json", "Accept": "application/json" },
  //     body: JSON.stringify(datos)
  //   }).then(function (r) { if (!r.ok) throw new Error("fallo"); });
  function enviarMensaje(datos) {
    return new Promise(function (resolve) { setTimeout(resolve, 1200); });
  }

  function cargando(si) {
    const b = $("btnEnviar");
    b.disabled = si;
    b.innerHTML = si ? '<span class="spinner-mini"></span> Enviando...' : "Enviar mensaje";
  }

  function mostrarExito(codigo, datos) {
    $("tCodigo").textContent = codigo;
    $("tCorreo").textContent = datos.correo;
    if (numeroWa) {
      const wa = $("btnWaExito");
      wa.href = linkWa("Hola, soy " + datos.nombre + ". Envié el mensaje " + codigo +
        " desde la web (" + datos.motivo + ").");
      wa.classList.remove("d-none");
    }
    form.classList.add("d-none");
    $("exitoContacto").classList.remove("d-none");
    $("exitoContacto").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    $("errorEnvio").textContent = "";

    const datos = {
      motivo: $("cMotivo").options[$("cMotivo").selectedIndex].text,
      nombre: $("cNombre").value.trim(),
      telefono: $("cTelefono").value,
      correo: $("cCorreo").value.trim(),
      reserva: $("cReserva").value.trim(),
      empresa: $("cEmpresa").value.trim(),
      mensaje: $("cMensaje").value.trim()
    };
    const codigo = "CT-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    if ($("cWeb").value) { mostrarExito(codigo, datos); return; }   // un robot llenó el campo trampa

    let primero = null;
    ids.forEach(function (id) {
      if (!validarCampo(id) && !primero) primero = $(id);
    });
    if (primero) { primero.focus(); return; }

    cargando(true);
    enviarMensaje(datos)
      .then(function () { mostrarExito(codigo, datos); })
      .catch(function () {
        $("errorEnvio").textContent =
          "No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por teléfono.";
      })
      .finally(function () { cargando(false); });
  });

  // ---------- "ENVIAR OTRO MENSAJE" ----------
  $("btnOtro").addEventListener("click", function () {
    form.reset();
    ids.forEach(function (id) {
      const el = $(id);
      el.classList.remove("invalido", "valido");
      el.removeAttribute("aria-invalid");
      el.closest(".grupo").querySelector(".error-campo").textContent = "";
    });
    ajustarMotivo();
    $("contadorMsg").textContent = "0 / 500";
    $("btnWaExito").classList.add("d-none");
    $("exitoContacto").classList.add("d-none");
    form.classList.remove("d-none");
  });
}