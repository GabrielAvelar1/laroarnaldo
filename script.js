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

// Slider Antes/Depois (Página de Casos) Automático com Arraste Direto
const sliderInput = document.querySelector('.slider-input');
const beforeImg = document.querySelector('.before');
const sliderLine = document.querySelector('.slider-line');
const sliderContainer = document.querySelector('.comparison-slider');

if(sliderInput && beforeImg && sliderLine && sliderContainer) {
    let autoPlay = true;
    let autoSlideVal = 50;
    let autoDirection = 0.2; // Velocidade do arraste automático

    const updateSlider = (val) => {
        val = Math.max(0, Math.min(100, val));
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

    // Função para calcular posição a partir do toque ou clique
    const handleMove = (clientX) => {
        stopAutoPlay();
        const rect = sliderContainer.getBoundingClientRect();
        const x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        updateSlider(percentage);
    };

    let isDragging = false;

    // Mouse Events
    sliderContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        handleMove(e.clientX);
    });

    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
        if(isDragging) handleMove(e.clientX);
    });

    // Touch Events (Celular / Tablet)
    sliderContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        if(e.touches && e.touches[0]) {
            handleMove(e.touches[0].clientX);
        }
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
        if(isDragging && e.touches && e.touches[0]) {
            handleMove(e.touches[0].clientX);
        }
    }, { passive: true });

    // Atualização caso o input range emita evento nativo
    sliderInput.addEventListener('input', (e) => {
        stopAutoPlay();
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

    // Processo Seletivo - Envio para laroarnaldo@gmail.com via FormSubmit & Confirmação
    const applyForm = document.getElementById('apply-form');
    const formWrapper = document.querySelector('.form-wrapper');

    if(applyForm && formWrapper) {
        applyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            if(submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
            }

            const name = document.getElementById('applicantName') ? document.getElementById('applicantName').value.trim() : 'Candidato(a)';
            const email = document.getElementById('applicantEmail') ? document.getElementById('applicantEmail').value.trim() : '';
            const periodSelect = document.getElementById('applicantPeriod');
            const period = periodSelect ? periodSelect.options[periodSelect.selectedIndex].text : '';
            const motivation = document.getElementById('applicantMotivation') ? document.getElementById('applicantMotivation').value.trim() : '';

            // Dados a enviar
            const formData = new FormData(applyForm);

            try {
                // Envio assíncrono para o FormSubmit (laroarnaldo@gmail.com)
                await fetch('https://formsubmit.co/ajax/laroarnaldo@gmail.com', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            } catch(err) {
                console.log('Envio registrado:', err);
            }

            // Feedback visual imediato e elegante na tela
            formWrapper.innerHTML = `
                <div style="text-align: center; padding: 20px 10px;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(15, 94, 181, 0.25); border: 2px solid var(--sapphire-blue); display: inline-flex; justify-content: center; align-items: center; color: var(--light-blue); font-size: 1.8rem; margin-bottom: 1.2rem; box-shadow: 0 0 25px rgba(15, 94, 181, 0.5);">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <h2 class="title-reveal" style="font-size: 2.2rem; margin-bottom: 0.8rem; color: #ffffff;">Inscrição Confirmada!</h2>
                    <p style="font-size: 1.05rem; line-height: 1.6; color: var(--light-blue); margin-bottom: 1rem;">
                        Obrigado pelo seu interesse, <strong>${name}</strong>!
                    </p>
                    <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.85; margin-bottom: 1.8rem; color: #ffffff;">
                        Recebemos sua candidatura referente ao <strong>${period}</strong>.<br>
                        Os dados foram transmitidos e em breve entraremos em contato através de: <br><strong style="color: var(--light-blue);">${email}</strong>
                    </p>
                    <a href="#inicio" class="submit-btn" style="display: inline-block; text-decoration: none; max-width: 240px; margin: 0 auto; text-align: center;">Voltar ao Início</a>
                </div>
            `;
        });
    }
});