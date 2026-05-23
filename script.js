// Menu Mobile
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Custom Cursor & Magnetic Elements
const cursor = document.getElementById('cursor');
const magneticElements = document.querySelectorAll('.nav-pill a, .arrow-btn, .hamburger');

if(window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            el.style.transform = '';
        });
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) - rect.width / 2;
            const y = (e.clientY - rect.top) - rect.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
    });
}

// Slider Antes/Depois (Página de Casos) Automático
const sliderInput = document.querySelector('.slider-input');
const beforeImg = document.querySelector('.before');
const sliderLine = document.querySelector('.slider-line');

if(sliderInput && beforeImg && sliderLine) {
    let autoPlay = true;
    let autoSlideVal = 50;
    let autoDirection = 0.2; // Velocidade do arraste

    const updateSlider = (val) => {
        beforeImg.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
        sliderLine.style.left = `${val}%`;
        sliderInput.value = val;
    };

    // Animação automática
    const animateSlider = () => {
        if(!autoPlay) return;
        
        autoSlideVal += autoDirection;
        if(autoSlideVal >= 80) autoDirection = -0.2; // Limites de movimento
        if(autoSlideVal <= 20) autoDirection = 0.2;
        
        updateSlider(autoSlideVal);
        requestAnimationFrame(animateSlider);
    };
    
    // Inicia a animação
    requestAnimationFrame(animateSlider);

    // Parar animação quando o usuário interagir
    const stopAutoPlay = () => { autoPlay = false; };
    
    sliderInput.addEventListener('mousedown', stopAutoPlay);
    sliderInput.addEventListener('touchstart', stopAutoPlay);

    // Atualização baseada na interação do usuário
    sliderInput.addEventListener('input', (e) => {
        updateSlider(e.target.value);
    });
}

// Scroll Reveal Animations
document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load
});