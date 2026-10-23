// Menu Mobile
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Função para copiar Chave Pix ou Código Pix Copia e Cola
function copyPixValue(text, btnId, defaultLabel) {
    const btn = document.getElementById(btnId);
    const applyCopiedVisual = () => {
        if (!btn) return;
        btn.classList.add('copied');
        btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Copiado!</span>`;
        setTimeout(() => {
            btn.classList.remove('copied');
            const iconClass = btnId === 'copyPayloadBtn' ? 'fa-solid fa-qrcode' : 'fa-regular fa-copy';
            btn.innerHTML = `<i class="${iconClass}"></i> <span>${defaultLabel}</span>`;
        }, 2400);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(applyCopiedVisual).catch(() => {
            const tempInput = document.createElement('input');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            applyCopiedVisual();
        });
    } else {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        applyCopiedVisual();
    }
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

    // =========================================================================
    // CONFIGURAÇÃO DA VIRADA AUTOMÁTICA (PROCESSO SELETIVO -> 1ª PALESTRA LARO)
    // =========================================================================
    const CONFIG_TRANSICAO = {
        // Meia-noite de hoje (virada de 22/10/2026 para 23/10/2026 - Horário de Brasília)
        dataViradaISO: '2026-10-23T00:00:00-03:00',
        // Opções: 'auto' (vira automaticamente à meia-noite), 'palestra' (força palestra), 'seletivo' (força seletivo)
        modoManual: 'auto'
    };

    const seletivoView = document.getElementById('seletivo-view');
    const palestraView = document.getElementById('palestra-view');
    const countdownText = document.getElementById('countdownText');
    const navCta = document.getElementById('navCta');
    const mobileNavCta = document.getElementById('mobileNavCta');

    // Permite pré-visualizar via URL: ?modo=palestra ou ?modo=seletivo
    const urlParams = new URLSearchParams(window.location.search);
    const modoUrl = urlParams.get('modo') || urlParams.get('preview');

    const ativarModoPalestra = () => {
        if (seletivoView) seletivoView.style.display = 'none';
        if (palestraView) {
            palestraView.style.display = 'block';
            palestraView.classList.add('visible');
        }
        if (navCta) {
            navCta.textContent = '1ª Palestra';
            navCta.setAttribute('href', 'palestra.html');
        }
        if (mobileNavCta) {
            mobileNavCta.textContent = '1ª Palestra';
            mobileNavCta.setAttribute('href', 'palestra.html');
        }
    };

    const ativarModoSeletivo = () => {
        if (palestraView) palestraView.style.display = 'none';
        if (seletivoView) {
            seletivoView.style.display = 'block';
            seletivoView.classList.add('visible');
        }
        if (navCta) {
            navCta.textContent = 'Junte-se';
            navCta.setAttribute('href', '#seletivo');
        }
        if (mobileNavCta) {
            mobileNavCta.textContent = 'Processo Seletivo';
            mobileNavCta.setAttribute('href', '#seletivo');
        }
    };

    const atualizarEstadoInscricao = () => {
        // Se estiver na página exclusiva palestra.html (onde não há #seletivo-view), mantém sempre visível
        if (!seletivoView && palestraView) {
            palestraView.style.display = 'block';
            palestraView.classList.add('visible');
            return true;
        }

        const modoEfetivo = modoUrl || CONFIG_TRANSICAO.modoManual;

        if (modoEfetivo === 'palestra') {
            ativarModoPalestra();
            return true; // Já virou
        }
        if (modoEfetivo === 'seletivo') {
            ativarModoSeletivo();
            return false;
        }

        const agora = new Date();
        const dataVirada = new Date(CONFIG_TRANSICAO.dataViradaISO);
        const diffMs = dataVirada - agora;

        if (diffMs <= 0) {
            ativarModoPalestra();
            return true; // Já passou da meia-noite
        } else {
            ativarModoSeletivo();
            if (countdownText) {
                const horas = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
                const minutos = String(Math.floor((diffMs / (1000 * 60)) % 60)).padStart(2, '0');
                const segundos = String(Math.floor((diffMs / 1000) % 60)).padStart(2, '0');
                countdownText.textContent = `Encerra hoje à meia-noite • Restam ${horas}h ${minutos}m ${segundos}s`;
            }
            return false;
        }
    };

    // Verifica imediatamente ao carregar e a cada 1 segundo até a meia-noite
    const jaVirou = atualizarEstadoInscricao();
    if (!jaVirou) {
        const timerInterval = setInterval(() => {
            if (atualizarEstadoInscricao()) {
                clearInterval(timerInterval);
            }
        }, 1000);
    }

    // Máscara de WhatsApp automática para o formulário da palestra
    const memberPhoneInput = document.getElementById('memberPhone');
    if (memberPhoneInput) {
        memberPhoneInput.addEventListener('input', (e) => {
            let digits = e.target.value.replace(/\D/g, '').slice(0, 11);
            if (digits.length > 6) {
                e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
            } else if (digits.length > 2) {
                e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
            } else if (digits.length > 0) {
                e.target.value = `(${digits}`;
            }
        });
    }

    // =========================================================================
    // FORMULÁRIO 1: PROCESSO SELETIVO DA LIGA (ATÉ MEIA-NOITE)
    // =========================================================================
    const applyForm = document.getElementById('apply-form');

    if(applyForm && seletivoView) {
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

            const formData = new FormData(applyForm);

            try {
                const response = await fetch('https://formsubmit.co/ajax/laroarnaldo@gmail.com', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const resData = await response.json();

                if (!response.ok || resData.success === 'false' || resData.success === false) {
                    throw new Error(resData.message || 'Falha no envio do formulário.');
                }
            } catch(err) {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Candidatura';
                }
                if (window.location.protocol === 'file:') {
                    alert('Atenção: O serviço de e-mail (FormSubmit) bloqueia testes feitos abrindo o arquivo direto da pasta (file://). Para testar o envio de e-mail, abra pelo servidor local (http://localhost) ou pelo link publicado no GitHub Pages.');
                } else {
                    alert('Não foi possível confirmar o envio da sua inscrição. Verifique sua conexão e tente novamente.');
                }
                return;
            }

            seletivoView.innerHTML = `
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

    // =========================================================================
    // FORMULÁRIO 2: INSCRIÇÃO NA 1ª PALESTRA + UPLOAD DE COMPROVANTE PIX
    // =========================================================================
    const lectureForm = document.getElementById('lecture-form');
    const memberReceiptInput = document.getElementById('memberReceipt');
    const receiptDropzone = document.getElementById('receiptDropzone');
    const receiptUploadDefault = document.getElementById('receiptUploadDefault');
    const receiptUploadSelected = document.getElementById('receiptUploadSelected');
    const receiptPreviewImg = document.getElementById('receiptPreviewImg');
    const receiptPdfIcon = document.getElementById('receiptPdfIcon');
    const receiptFileName = document.getElementById('receiptFileName');
    const receiptFileSize = document.getElementById('receiptFileSize');
    const receiptFileNameField = document.getElementById('receiptFileNameField');
    const receiptErrorMsg = document.getElementById('receiptErrorMsg');

    if (memberReceiptInput) {
        memberReceiptInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (receiptErrorMsg) receiptErrorMsg.style.display = 'none';

            if (!file) {
                if (receiptDropzone) receiptDropzone.classList.remove('has-file');
                if (receiptUploadDefault) receiptUploadDefault.style.display = 'flex';
                if (receiptUploadSelected) receiptUploadSelected.style.display = 'none';
                if (receiptFileNameField) receiptFileNameField.value = '';
                return;
            }

            // Limite de 5MB do FormSubmit para anexos
            const maxBytes = 5 * 1024 * 1024;
            if (file.size > maxBytes) {
                memberReceiptInput.value = '';
                if (receiptDropzone) receiptDropzone.classList.remove('has-file');
                if (receiptUploadDefault) receiptUploadDefault.style.display = 'flex';
                if (receiptUploadSelected) receiptUploadSelected.style.display = 'none';
                if (receiptErrorMsg) {
                    receiptErrorMsg.textContent = 'O arquivo excede 5MB. Por favor, envie uma captura de tela ou PDF menor que 5MB.';
                    receiptErrorMsg.style.display = 'block';
                }
                return;
            }

            const sizeKB = (file.size / 1024).toFixed(0);
            const sizeFormatted = file.size >= 1024 * 1024
                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                : `${sizeKB} KB`;

            if (receiptDropzone) receiptDropzone.classList.add('has-file');
            if (receiptUploadDefault) receiptUploadDefault.style.display = 'none';
            if (receiptUploadSelected) receiptUploadSelected.style.display = 'flex';
            if (receiptFileName) receiptFileName.textContent = file.name;
            if (receiptFileSize) receiptFileSize.textContent = `${sizeFormatted} • Comprovante anexado`;
            if (receiptFileNameField) receiptFileNameField.value = `${file.name} (${sizeFormatted})`;

            if (file.type && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (receiptPreviewImg) {
                        receiptPreviewImg.src = ev.target.result;
                        receiptPreviewImg.style.display = 'block';
                    }
                    if (receiptPdfIcon) receiptPdfIcon.style.display = 'none';
                };
                reader.readAsDataURL(file);
            } else {
                if (receiptPreviewImg) receiptPreviewImg.style.display = 'none';
                if (receiptPdfIcon) receiptPdfIcon.style.display = 'flex';
            }
        });
    }

    const renderizarConfirmacaoPalestra = (dados) => {
        if (!palestraView) return;
        palestraView.style.display = 'block';
        palestraView.classList.add('visible');
        if (seletivoView) seletivoView.style.display = 'none';

        palestraView.innerHTML = `
            <div style="text-align: center; padding: 20px 10px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(15, 94, 181, 0.25); border: 2px solid var(--sapphire-blue); display: inline-flex; justify-content: center; align-items: center; color: var(--light-blue); font-size: 1.8rem; margin-bottom: 1.2rem; box-shadow: 0 0 25px rgba(15, 94, 181, 0.5);">
                    <i class="fa-solid fa-user-check"></i>
                </div>
                <div class="status-badge exclusive-badge" style="margin: 0 auto 1rem auto;">
                    <i class="fa-solid fa-user-shield"></i>
                    <span>Membro Confirmado • 1ª Palestra LARO</span>
                </div>
                <h2 class="title-reveal" style="font-size: 2.2rem; margin-bottom: 0.8rem; color: #ffffff;">Inscrição e Comprovante Enviados!</h2>
                <p style="font-size: 1.05rem; line-height: 1.6; color: var(--light-blue); margin-bottom: 1rem;">
                    Parabéns, <strong>${dados.name || 'Membro(a)'}</strong>! Sua inscrição no <strong>Hands-On — Prof. Dr. Emilio Akaki</strong> foi registrada com sucesso.
                </p>
                <p style="font-size: 0.95rem; line-height: 1.6; opacity: 0.85; margin-bottom: 1.8rem; color: #ffffff;">
                    ${dados.period ? `Vínculo: <strong>${dados.period}</strong> • ` : ''}${dados.phone ? `WhatsApp: <strong>${dados.phone}</strong><br>` : ''}
                    ${dados.fileName ? `Comprovante anexado: <strong style="color: #7ef7d1;">${dados.fileName}</strong><br>` : ''}
                    ${dados.email ? `Confirmação enviada para: <strong style="color: var(--light-blue);">${dados.email}</strong>` : ''}
                </p>
                <a href="index.html#inicio" class="submit-btn" style="display: inline-block; text-decoration: none; max-width: 240px; margin: 0 auto; text-align: center;">Voltar ao Início</a>
            </div>
        `;
    };

    // Se retornou do redirecionamento pós-envio do FormSubmit (?inscrito=1), exibe a confirmação
    if (urlParams.get('inscrito') === '1' && palestraView) {
        let dadosSalvos = {};
        try {
            dadosSalvos = JSON.parse(sessionStorage.getItem('laro_palestra_inscrito') || '{}');
        } catch (e) {}
        renderizarConfirmacaoPalestra(dadosSalvos);
    }

    if (lectureForm && palestraView) {
        lectureForm.addEventListener('submit', (e) => {
            const receiptFile = memberReceiptInput && memberReceiptInput.files && memberReceiptInput.files[0];
            if (!receiptFile) {
                e.preventDefault();
                if (receiptErrorMsg) {
                    receiptErrorMsg.textContent = 'Por favor, anexe o comprovante do Pix de R$ 15,00 para concluir sua inscrição.';
                    receiptErrorMsg.style.display = 'block';
                }
                return;
            }

            if (window.location.protocol === 'file:') {
                e.preventDefault();
                if (receiptErrorMsg) {
                    receiptErrorMsg.textContent = 'Atenção: O FormSubmit bloqueia envios feitos abrindo o arquivo direto da pasta (file://). Para que o e-mail com anexo chegue, abra pelo link oficial do GitHub Pages.';
                    receiptErrorMsg.style.display = 'block';
                }
                return;
            }

            const name = document.getElementById('memberName') ? document.getElementById('memberName').value.trim() : 'Membro(a)';
            const email = document.getElementById('memberEmail') ? document.getElementById('memberEmail').value.trim() : '';
            const phone = document.getElementById('memberPhone') ? document.getElementById('memberPhone').value.trim() : '';
            const periodSelect = document.getElementById('memberPeriod');
            const period = periodSelect ? periodSelect.options[periodSelect.selectedIndex].text : '';

            // Salva dados na sessão para exibir o card personalizado ao retornar do envio nativo
            try {
                sessionStorage.setItem('laro_palestra_inscrito', JSON.stringify({
                    name,
                    email,
                    phone,
                    period,
                    fileName: receiptFile.name
                }));
            } catch (err) {}

            // Configura URL de retorno (_next) para a página atual com ?inscrito=1
            const nextInput = document.getElementById('lectureNextUrl');
            if (nextInput && window.location.protocol.startsWith('http')) {
                const baseUrl = window.location.origin + window.location.pathname;
                nextInput.value = `${baseUrl}?inscrito=1`;
            }

            const lectureSubmitBtn = document.getElementById('lectureSubmitBtn');
            if (lectureSubmitBtn) {
                lectureSubmitBtn.textContent = 'Enviando comprovante em anexo... Aguarde';
            }
            // IMPORTANTE: Não usamos e.preventDefault() nem /ajax/ aqui!
            // O envio nativo multipart/form-data para https://formsubmit.co/laroarnaldo@gmail.com
            // garante que o arquivo real (name="attachment") chegue anexado ao e-mail no Gmail.
        });
    }
});