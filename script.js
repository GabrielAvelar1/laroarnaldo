// 1. LÓGICA DO PRELOADER ODONTOLÓGICO CORRIGIDA
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    
    // Força o preloader a sumir após 1.5 segundos
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800); // Tempo da transição CSS
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

        // Cortina Entrando (Desliza da esquerda para a direita)
        gsap.to(overlay, {
            left: 0,
            duration: 0.4,
            ease: "power3.inOut",
            onComplete: () => {
                // Troca a página por trás da cortina
                currentPage.classList.remove('active');
                document.getElementById(targetPageId).classList.add('active');
                
                // Atualiza o menu
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Roda as animações da página
                runPageAnimations(targetPageId);

                // Cortina Saindo (Continua deslizando para a direita)
                gsap.to(overlay, {
                    left: "100%",
                    duration: 0.4,
                    ease: "power3.inOut",
                    onStart: () => { window.scrollTo(0,0); },
                    onComplete: () => { 
                        // Reseta a cortina lá na esquerda para o próximo clique
                        gsap.set(overlay, { left: "-100%" }); 
                    }
                });
            }
        });
    });
});

// 6. Animações Internas (Fade-in com GSAP)
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

// Inicia animação inicial ao carregar
runPageAnimations('inicio');

// 7. Slider Antes/Depois (Página de Casos)
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

