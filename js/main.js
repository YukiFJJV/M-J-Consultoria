let scrollBloqueado = false;

// Desactivar el restablecimiento automático del scroll al navegar
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const observerPortada = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && !scrollBloqueado) {
        // El usuario salió de la portada
        scrollBloqueado = true;
    }
}, { threshold: 0.1 });

observerPortada.observe(portada);

window.addEventListener('scroll', () => {
    if (scrollBloqueado && window.scrollY < window.innerHeight) {
        // Mantener la posición mínima en la parte inferior de la portada
        window.scrollTo(0, window.innerHeight);
    }
});