document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const aside = document.querySelector('#layout aside');
    if (!aside) return;

    const SIDEBAR_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width')) || 260;
    const OPEN_TRIGGER_X = 20;
    const CLOSE_THRESHOLD_X = SIDEBAR_WIDTH + 60;
    let pointerInside = false;
    let closeTimeout = null;

    // Observer para ocultar la barra en la portada
    const observerPortada = new IntersectionObserver(([entry]) => {
        if(entry.isIntersecting){
            aside.classList.remove('ready');
        } else {
            aside.classList.add('ready'); // lista para expandirse
        }
    }, { threshold: 0.1 });

    const portada = document.querySelector('#portada');
    if(portada) observerPortada.observe(portada);

    function openSidebar() {
        aside.classList.add('visible');
        body.classList.add('sidebar-open');
    }

    function closeSidebar() {
        aside.classList.remove('visible');
        body.classList.remove('sidebar-open');
    }

    function scheduleClose() {
        clearTimeout(closeTimeout);
        closeTimeout = setTimeout(() => {
            if(!pointerInside) closeSidebar();
        }, 50);
    }

    // Mantener abierta mientras el mouse está sobre la barra
    aside.addEventListener('mouseenter', () => { pointerInside = true; clearTimeout(closeTimeout); });
    aside.addEventListener('mouseleave', () => { pointerInside = false; scheduleClose(); });

    // Abrir/ cerrar según la posición del mouse
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        if(x <= OPEN_TRIGGER_X && aside.classList.contains('ready')){
            openSidebar();
        } else if(x > CLOSE_THRESHOLD_X && !pointerInside){
            scheduleClose();
        }
    }, { passive: true });

    // Soporte táctil
    let touchStartX = null;
    window.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0]?.clientX || null;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;
        const x = e.touches[0].clientX;
        if (touchStartX < 40 && x > 60) {
            openSidebar();
            touchStartX = null;
        }
    }, { passive: true });
});