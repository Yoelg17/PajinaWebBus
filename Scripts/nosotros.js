const contadores = document.querySelectorAll(".contador");

function animar(el) {
  const meta = parseInt(el.dataset.meta);
  const sufijo = el.dataset.sufijo || "";
  const duracion = 1500;
  const inicio = performance.now();

  function paso(ahora) {
    const progreso = Math.min((ahora - inicio) / duracion, 1);
    el.textContent = Math.floor(meta * progreso).toLocaleString("es-PE") + sufijo;
    if (progreso < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

if (contadores.length) {
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) {
        animar(e.target);
        observador.unobserve(e.target);   // que solo cuente una vez
      }
    });
  }, { threshold: 0.5 });

  contadores.forEach(function (c) { observador.observe(c); });
}