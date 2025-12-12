// js/sidebar-float.js
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const aside = document.querySelector('#layout aside');
    const toggle = document.getElementById('toggleBubble');
    if (!aside || !toggle) return;

    const SIDEBAR_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260;
    const OPEN_TRIGGER_X = 48;             // px desde el borde izquierdo para abrir automáticamente
    const CLOSE_THRESHOLD_X = SIDEBAR_WIDTH + 60; // px a la derecha para cerrar automáticamente

    let manualOpen = false;   // si el usuario abrió manualmente con el botón, respetamos hasta nuevo clic
    let pointerInside = false; // si el puntero está sobre el sidebar
    let closeTimeout = null;

    const observerPortada = new IntersectionObserver(([entry]) => {
        if(entry.isIntersecting){
            toggle.classList.remove('visible');
            toggle.style.pointerEvents = 'none'; // bloquea interacciones
        } else {
            toggle.classList.add('visible');
            toggle.style.pointerEvents = 'auto'; // permite interacciones
        }
    }, { threshold: 0.1 });

    observerPortada.observe(document.querySelector('#portada'));

    function openSidebar(source = 'auto') {
        // no abrir si portada está visible
        const portadaVisible = portada.getBoundingClientRect().bottom > 0;
        if (portadaVisible) return;

        body.classList.add('sidebar-open');
        aside.classList.add('visible');
        toggle.setAttribute('aria-expanded', 'true');
        // si apertura manual por click, marcamos manualOpen para evitar cierres automáticos inmediatos
        if (source === 'manual') manualOpen = true;
    }

    function closeSidebar(force = false) {
        // no forzar si manualOpen true y no viene fuerza externa
        if (manualOpen && !force) return;
        body.classList.remove('sidebar-open');
        aside.classList.remove('visible');
        toggle.setAttribute('aria-expanded', 'false');
    }

  // click en el botón: toggle manual (útil en móvil)
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (body.classList.contains('sidebar-open')) {
        manualOpen = false; // cerrar manual limpia la preferencia
            closeSidebar(true);
        } else {
            openSidebar('manual');
        }
    });

  // detectar entrada/salida del mouse al sidebar para mantenerlo abierto mientras se interactúa
    aside.addEventListener('mouseenter', () => { pointerInside = true; clearTimeout(closeTimeout); });
    aside.addEventListener('mouseleave', () => { pointerInside = false; scheduleClose(); });

  // si haces click fuera del sidebar y no fue manualOpen, cerramos
    document.addEventListener('click', (e) => {
    if (!aside.contains(e.target) && !toggle.contains(e.target)) {
      // si usuario abrió manualmente, cerrar con click fuera también lo quita
        manualOpen = false;
        closeSidebar(true);
    }
    });

  // función para programar cierre (pequeño delay para evitar parpadeos)
    function scheduleClose() {
        clearTimeout(closeTimeout);
        closeTimeout = setTimeout(() => {
            if (!pointerInside) closeSidebar();
        }, 50); // 50ms
    }

  // detectar proximidad al borde izquierdo
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        if (x <= OPEN_TRIGGER_X) {
            openSidebar('auto');
        } else if (x > CLOSE_THRESHOLD_X) {
        // si el puntero está lejos y no se está interactuando, cerramos (si no fue abierto manualmente)
            if (!pointerInside) scheduleClose();
        }
    }, { passive: true });

    // soporte táctil: deslizar desde el borde (simple heurístico)
    let touchStartX = null;
    window.addEventListener('touchstart', (e) => {
        touchStartX = e.touches && e.touches[0] ? e.touches[0].clientX : null;
        }, { passive: true });
        window.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;
        const x = e.touches[0].clientX;
        if (touchStartX < 40 && x > 60) {
        // gesto de arrastre desde borde hacia dentro -> abrir
            openSidebar('auto');
            touchStartX = null;
        }
    }, { passive: true });
});