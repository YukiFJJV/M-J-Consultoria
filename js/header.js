(function(){
    const header  = document.querySelector('#layout header');
    const portada = document.querySelector('#portada');
    if(!header || !portada) return;

    const observerPortada = new IntersectionObserver(([entry]) => {
        if(entry.isIntersecting){
            // Si el elemento portada está en pantalla → ocultamos header
            header.classList.remove('visible');
            document.body.classList.remove('header-shown');
        } else {
            // Si ya no está en pantalla → mostramos header
            header.classList.add('visible');
            document.body.classList.add('header-shown');
        }
    }, { threshold: 0.1 });

    observerPortada.observe(portada);
})();
