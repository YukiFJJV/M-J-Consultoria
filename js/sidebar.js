document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const sidebar = document.querySelector('#layout aside');
    const portada = document.querySelector('#portada');

    if (!sidebar || !portada) return;

    const OPEN_TRIGGER_X = 20; // px desde el borde izquierdo para abrir automáticamente
    let pointerInside = false;
    let portadaVisible = true;

    // Observer para detectar si la portada está visible
    const observerPortada = new IntersectionObserver(([entry]) => {
        portadaVisible = entry.isIntersecting;
        if (portadaVisible) {
            sidebar.classList.remove('ready'); // no mostrar mientras portada visible
        } else {
            sidebar.classList.add('ready');    // listo para mostrar
        }
    }, { threshold: 0.1 });

    observerPortada.observe(portada);

    // Funciones para abrir/cerrar sidebar
    function openSidebar() {
        sidebar.classList.add('expanded', 'visible');
        body.classList.add('sidebar-open');
    }

    function closeSidebar() {
        sidebar.classList.remove('expanded', 'visible');
        body.classList.remove('sidebar-open');
    }

    // Mantener abierto mientras el mouse esté dentro
    sidebar.addEventListener('mouseenter', () => {
        pointerInside = true;
        openSidebar();
    });

    sidebar.addEventListener('mouseleave', () => {
    pointerInside = false;
    closeSidebar();
    });

  // Abrir si el mouse se acerca al borde izquierdo
    window.addEventListener('mousemove', e => {
        if (!portadaVisible) { // solo si ya no estamos en la portada
            if (e.clientX <= OPEN_TRIGGER_X && !pointerInside) {
            openSidebar();
            }
        }
    });
});

