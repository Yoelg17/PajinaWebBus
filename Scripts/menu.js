// ===== MENÚ Y EFECTOS COMPARTIDOS (se carga en TODAS las páginas) =====

// Pon tu número con código de país, sin + ni espacios. Ejemplo: "51999999999"
// Si lo dejas vacío, el botón de WhatsApp no aparece.
const WHATSAPP = "";

(function () {
  const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".encabezado");
  const nav = document.querySelector(".btnEncabezado");

  // ---------- 1. MENÚ HAMBURGUESA ----------
  if (header && nav) {
    const boton = document.createElement("button");
    boton.className = "hamburguesa";
    boton.type = "button";
    boton.setAttribute("aria-label", "Abrir menú");
    boton.setAttribute("aria-expanded", "false");
    boton.innerHTML = "<span></span><span></span><span></span>";
    header.appendChild(boton);

    function alternar(abrir) {
      const abierto = abrir !== undefined ? abrir : !nav.classList.contains("abierto");
      nav.classList.toggle("abierto", abierto);
      boton.classList.toggle("abierto", abierto);
      boton.setAttribute("aria-expanded", abierto);
      boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    }

    boton.addEventListener("click", function () { alternar(); });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) alternar(false);
    });
    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) alternar(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") alternar(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 992) alternar(false);
    });
  }

  // ---------- 2. BARRA DE PROGRESO, ENCABEZADO Y BOTÓN SUBIR ----------
  const barra = document.createElement("div");
  barra.className = "barra-progreso";
  document.body.appendChild(barra);

  const subir = document.createElement("button");
  subir.className = "subir";
  subir.type = "button";
  subir.setAttribute("aria-label", "Volver arriba");
  subir.textContent = "↑";
  document.body.appendChild(subir);
  subir.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reducir ? "auto" : "smooth" });
  });

  function alScroll() {
    const y = window.scrollY;
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.width = (alto > 0 ? (y / alto) * 100 : 0) + "%";
    if (header) header.classList.toggle("scrolled", y > 20);
    subir.classList.toggle("visible", y > 500);
  }
  window.addEventListener("scroll", alScroll, { passive: true });
  alScroll();

  // ---------- 3. BOTÓN DE WHATSAPP ----------
  if (WHATSAPP) {
    const wa = document.createElement("a");
    wa.className = "whatsapp";
    wa.href = "https://wa.me/" + WHATSAPP + "?text=" +
      encodeURIComponent("Hola, quiero información sobre pasajes en Pomabamba Express.");
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.setAttribute("aria-label", "Escríbenos por WhatsApp");
    wa.textContent = "💬";
    document.body.appendChild(wa);
  }

  // ---------- 4. APARICIÓN SUAVE AL BAJAR ----------
  if (!reducir && "IntersectionObserver" in window) {
        const selector = ".tarjeta-ruta, .rutasbrder, .otrasemprs, .cuadro, .buscador, " +
      ".tarjeta-mv, .valor-item, .nos-historia, .numeros-fondo, .aliada, .accordion-item, " +
      ".dato-contacto, .form-card, .agencia, .mapa-marco, .footer";

    const observador = new IntersectionObserver(function (entradas) {
      let n = 0;
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.style.animationDelay = (n++ * 0.08) + "s";   // una tras otra
        el.classList.remove("rev-oculto");
        el.classList.add("rev-entra");
        observador.unobserve(el);
      });
    }, { threshold: 0.12 });

    function preparar() {
      document.querySelectorAll(selector).forEach(function (el) {
        if (el.dataset.rev) return;
        el.dataset.rev = "1";
        el.classList.add("rev-oculto");
        observador.observe(el);
      });
    }
    preparar();
    // También detecta las tarjetas que crean los otros scripts
    new MutationObserver(preparar).observe(document.body, { childList: true, subtree: true });
  }
    // ---------- 4b. TÍTULO QUE ENTRA PALABRA POR PALABRA ----------
  if (!reducir) {
    document.querySelectorAll(".titulo-pagina-h1").forEach(function (h1) {
      let n = 0;
      (function dividir(nodo) {
        Array.from(nodo.childNodes).forEach(function (hijo) {
          if (hijo.nodeType === 3) {
            const frag = document.createDocumentFragment();
            hijo.textContent.split(/(\s+)/).forEach(function (parte) {
              if (!parte) return;
              if (/^\s+$/.test(parte)) { frag.appendChild(document.createTextNode(" ")); return; }
              const s = document.createElement("span");
              s.className = "palabra";
              s.style.setProperty("--i", n++);
              s.textContent = parte;
              frag.appendChild(s);
            });
            nodo.replaceChild(frag, hijo);
          } else if (hijo.nodeType === 1) {
            dividir(hijo);
          }
        });
      })(h1);
    });
  }

  // ---------- 5. TRANSICIÓN ENTRE PÁGINAS ----------
  document.addEventListener("click", function (e) {
    if (reducir) return;
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || a.target === "_blank" || a.hasAttribute("download")) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    if (!/^(https?|file):$/.test(a.protocol) || a.origin !== location.origin) return;

    e.preventDefault();
    document.body.classList.add("saliendo");
    setTimeout(function () { window.location.href = a.href; }, 250);
  });
  window.addEventListener("pageshow", function () {
    document.body.classList.remove("saliendo");   // al volver atrás con el botón del navegador
  });
})();