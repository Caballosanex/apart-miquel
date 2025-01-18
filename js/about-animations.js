document.addEventListener('DOMContentLoaded', function() {
    // Configuració de l'Intersection Observer
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // 20% de l'element ha de ser visible
    };

    // Observer per les seccions
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, options);

    // Observer específic per els elements de la llista
    const listObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Afegim un retard progressiu per cada element
                const li = entry.target;
                const delay = Array.from(li.parentNode.children).indexOf(li) * 200;
                setTimeout(() => {
                    li.classList.add('visible');
                }, delay);
            }
        });
    }, options);

    // Observem totes les seccions
    document.querySelectorAll('.about-section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Observem cada element de la llista individualment
    document.querySelectorAll('.values-list li').forEach(item => {
        listObserver.observe(item);
    });
}); 