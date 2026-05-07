// 1. LÓGICA DO PRELOADER ODONTOLÓGICO CORRIGIDA
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }, 1500); 
});

// 2. Registro do GSAP
gsap.registerPlugin(ScrollTrigger);

// 3. Lógica de Transição de Página com GSAP (SPA) - Velocidade 0.4s
const links = document.querySelectorAll('.nav-link');
const overlay = document.querySelector('.transition-overlay');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPageId = link.getAttribute('data-page');
        const currentPage = document.querySelector('.page.active');
        
        if (targetPageId === currentPage.id) return;

        gsap.to(overlay, {
            left: 0,
            duration: 0.4,
            ease: "power3.inOut",
            onComplete: () => {
                currentPage.classList.remove('active');
                document.getElementById(targetPageId).classList.add('active');
                
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                runPageAnimations(targetPageId);

                gsap.to(overlay, {
                    left: "100%",
                    duration: 0.4,
                    ease: "power3.inOut",
                    onStart: () => { window.scrollTo(0,0); },
                    onComplete: () => { 
                        gsap.set(overlay, { left: "-100%" }); 
                    }
                });
            }
        });
    });
});

// 4. Animações Internas (Fade-in com GSAP)
function runPageAnimations(pageId) {
    const tl = gsap.timeline();

    if (pageId === 'inicio') {
        tl.from("#inicio .reveal", { y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: "power3.out" });
    }
    if (pageId === 'restauracao') {
        tl.from("#restauracao .title-reveal", { y: 30, opacity: 0, duration: 0.8 })
          .from(".reveal-left", { x: -50, opacity: 0, duration: 0.8 }, "-=0.4")
          .from(".reveal-right", { x: 50, opacity: 0, duration: 0.8 }, "-=0.8");
    }
    if (pageId === 'protese') {
        tl.from("#protese .title-reveal", { y: 30, opacity: 0, duration: 0.8 })
          .from(".stagger", { y: 50, opacity: 0, stagger: 0.2, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4");
    }
    if (pageId === 'casos') {
        tl.from("#casos .title-reveal", { y: 30, opacity: 0, duration: 0.8 })
          .from(".comparison-slider", { scale: 0.95, opacity: 0, duration: 1 }, "-=0.4");
    }
    if (pageId === 'seletivo') {
        tl.from("#seletivo .title-reveal", { y: 30, opacity: 0, duration: 0.8 })
          .from(".form-wrapper", { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.4");
    }
}

runPageAnimations('inicio');

// 5. Slider Antes/Depois (Página de Casos)
const sliderInput = document.querySelector('.slider-input');
const beforeImg = document.querySelector('.before');
const sliderLine = document.querySelector('.slider-line');

if(sliderInput) {
    sliderInput.addEventListener('input', (e) => {
        let val = e.target.value;
        beforeImg.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
        sliderLine.style.left = `${val}%`;
    });
}

// 6. Menu Mobile (Hamburguer Interativo)
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinksMobile = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('nav-active');
        
        // Alterna o ícone entre barras e "X"
        const icon = hamburger.querySelector('i');
        if(navMenu.classList.contains('nav-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}

// Fecha o menu Mobile automaticamente quando clicar em algum link
navLinksMobile.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('nav-active');
        if(hamburger) {
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
});