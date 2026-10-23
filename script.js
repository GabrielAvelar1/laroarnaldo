// Menu Mobile
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Alternar abas: Fazer Inscrição / Consultar Inscrição
function switchPalestraTab(aba) {
    const panelInscrever = document.getElementById('panelInscrever');
    const panelConsultar = document.getElementById('panelConsultar');
    const tabBtnInscrever = document.getElementById('tabBtnInscrever');
    const tabBtnConsultar = document.getElementById('tabBtnConsultar');

    if (aba === 'consultar') {
        if (panelInscrever) panelInscrever.style.display = 'none';
        if (panelConsultar) panelConsultar.style.display = 'block';
        if (tabBtnInscrever) tabBtnInscrever.classList.remove('active');
        if (tabBtnConsultar) tabBtnConsultar.classList.add('active');
    } else {
        if (panelInscrever) panelInscrever.style.display = 'block';
        if (panelConsultar) panelConsultar.style.display = 'none';
        if (tabBtnInscrever) tabBtnInscrever.classList.add('active');
        if (tabBtnConsultar) tabBtnConsultar.classList.remove('active');
    }
}

// Configuração Oficial do Supabase (Tabelas e Bucket Exclusivos da LARO Arnaldo)
const SUPABASE_LARO = {
    projectUrl: 'https://nscwgutnytrbytlzzvil.supabase.co',
    restUrl: 'https://nscwgutnytrbytlzzvil.supabase.co/rest/v1',
    storageUrl: 'https://nscwgutnytrbytlzzvil.supabase.co/storage/v1',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zY3dndXRueXRyYnl0bHp6dmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2Mjk5ODcsImV4cCI6MjEwMDIwNTk4N30.cTzm3Hs2aov367E2uFBT4ZDyUZQNmvhF5yF-5hZyPUA',
    tablePalestra: 'laro_arnaldo_palestra_inscricoes',
    tableSeletivo: 'laro_arnaldo_processo_seletivo',
    bucketComprovantes: 'laro_arnaldo_comprovantes'
};

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

    // Função auxiliar para converter arquivo em DataURL (backup seguro do comprovante)
    const fileToDataUrl = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
    });

    // =========================================================================
    // FORMULÁRIO 1: PROCESSO SELETIVO DA LIGA (SALVA NO SUPABASE)
    // =========================================================================
    const applyForm = document.getElementById('apply-form');

    if(applyForm && seletivoView) {
        applyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            if(submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Salvando inscrição...';
            }

            const name = document.getElementById('applicantName') ? document.getElementById('applicantName').value.trim() : 'Candidato(a)';
            const email = document.getElementById('applicantEmail') ? document.getElementById('applicantEmail').value.trim() : '';
            const periodSelect = document.getElementById('applicantPeriod');
            const period = periodSelect ? periodSelect.options[periodSelect.selectedIndex].text : '';
            const motivation = document.getElementById('applicantMotivation') ? document.getElementById('applicantMotivation').value.trim() : '';

            try {
                const res = await fetch(`${SUPABASE_LARO.restUrl}/${SUPABASE_LARO.tableSeletivo}`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_LARO.anonKey,
                        'Authorization': `Bearer ${SUPABASE_LARO.anonKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=Minimal'
                    },
                    body: JSON.stringify({
                        nome_completo: name,
                        email: email.toLowerCase(),
                        periodo: period,
                        motivacao: motivation
                    })
                });

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(errText || 'Erro ao salvar no banco de dados.');
                }
            } catch(err) {
                console.error('Erro Supabase Seletivo:', err);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Candidatura';
                }
                alert('Não foi possível registrar sua inscrição no momento. Verifique sua conexão e tente novamente.');
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
                        Seus dados foram salvos com segurança no sistema da L.A.R.O. (<strong style="color: var(--light-blue);">${email}</strong>).
                    </p>
                    <a href="#inicio" class="submit-btn" style="display: inline-block; text-decoration: none; max-width: 240px; margin: 0 auto; text-align: center;">Voltar ao Início</a>
                </div>
            `;
        });
    }

    // =========================================================================
    // FORMULÁRIO 2: INSCRIÇÃO NA 1ª PALESTRA + UPLOAD DE COMPROVANTE NO SUPABASE
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
    const receiptErrorMsg = document.getElementById('receiptErrorMsg');

    if (memberReceiptInput) {
        memberReceiptInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (receiptErrorMsg) receiptErrorMsg.style.display = 'none';

            if (!file) {
                if (receiptDropzone) receiptDropzone.classList.remove('has-file');
                if (receiptUploadDefault) receiptUploadDefault.style.display = 'flex';
                if (receiptUploadSelected) receiptUploadSelected.style.display = 'none';
                return;
            }

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

    if (lectureForm && palestraView) {
        lectureForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const receiptFile = memberReceiptInput && memberReceiptInput.files && memberReceiptInput.files[0];
            if (!receiptFile) {
                if (receiptErrorMsg) {
                    receiptErrorMsg.textContent = 'Por favor, anexe o comprovante do Pix de R$ 15,00 para concluir sua inscrição.';
                    receiptErrorMsg.style.display = 'block';
                }
                return;
            }

            const lectureSubmitBtn = document.getElementById('lectureSubmitBtn');
            if (lectureSubmitBtn) {
                lectureSubmitBtn.disabled = true;
                lectureSubmitBtn.textContent = 'Salvando inscrição e comprovante...';
            }

            const name = document.getElementById('memberName') ? document.getElementById('memberName').value.trim() : 'Membro(a)';
            const email = document.getElementById('memberEmail') ? document.getElementById('memberEmail').value.trim() : '';
            const phone = document.getElementById('memberPhone') ? document.getElementById('memberPhone').value.trim() : '';
            const periodSelect = document.getElementById('memberPeriod');
            const period = periodSelect ? periodSelect.options[periodSelect.selectedIndex].text : '';

            // Gera código de protocolo único (ex: LARO-8492)
            const protocolo = 'LARO-' + Math.floor(100000 + Math.random() * 900000);

            try {
                // 1) Faz upload do arquivo do comprovante para o Supabase Storage (bucket: laro_arnaldo_comprovantes)
                const safeName = receiptFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const storagePath = `${Date.now()}_${protocolo}_${safeName}`;
                let comprovantePublicUrl = '';

                try {
                    const uploadRes = await fetch(`${SUPABASE_LARO.storageUrl}/object/${SUPABASE_LARO.bucketComprovantes}/${storagePath}`, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_LARO.anonKey,
                            'Authorization': `Bearer ${SUPABASE_LARO.anonKey}`,
                            'Content-Type': receiptFile.type || 'application/octet-stream',
                            'x-upsert': 'true'
                        },
                        body: receiptFile
                    });

                    if (uploadRes.ok) {
                        comprovantePublicUrl = `${SUPABASE_LARO.storageUrl}/object/public/${SUPABASE_LARO.bucketComprovantes}/${storagePath}`;
                    }
                } catch (storageErr) {
                    console.warn('Aviso no upload para bucket, usando backup Base64:', storageErr);
                }

                // 2) Gera também cópia em Base64 como redundância para nunca perder o comprovante
                const comprovanteBase64 = await fileToDataUrl(receiptFile);
                if (!comprovantePublicUrl) {
                    comprovantePublicUrl = comprovanteBase64;
                }

                                // ---> NOVO: Captura o vínculo selecionado <---
                const vinculoInput = document.querySelector('input[name="vinculo"]:checked');
                const vinculoSelecionado = vinculoInput ? vinculoInput.value : 'Não informado';

                // 3) Salva os dados completos da inscrição na tabela laro_arnaldo_palestra_inscricoes
                const dbRes = await fetch(`${SUPABASE_LARO.restUrl}/${SUPABASE_LARO.tablePalestra}`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_LARO.anonKey,
                        'Authorization': `Bearer ${SUPABASE_LARO.anonKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        protocolo: protocolo,
                        nome_completo: name,
                        email: email.toLowerCase(),
                        whatsapp: phone,
                        periodo: period,
                        vinculo: vinculoSelecionado, // ---> NOVO CAMPO ENVIADO PARA O SUPABASE <---
                        evento: 'Hands-On: Técnica Classe IV com Muralha Palatina - Prof. Dr. Emilio Akaki (03/11 às 17h - UniBH)',
                        valor_pago: 'R$ 15,00',
                        comprovante_nome: receiptFile.name,
                        comprovante_url: comprovantePublicUrl,
                        comprovante_base64: comprovanteBase64,
                        status_inscricao: 'Confirmada'
                    })
                });

                if (!dbRes.ok) {
                    const errBody = await dbRes.text();
                    throw new Error(errBody || 'Erro ao gravar inscrição no banco de dados.');
                }

                // 4) Dispara aviso complementar por e-mail (FormSubmit) com o link direto do comprovante no Supabase
                if (window.location.protocol.startsWith('http') && comprovantePublicUrl.startsWith('http')) {
                    fetch('https://formsubmit.co/ajax/laroarnaldo@gmail.com', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            _subject: `Nova Inscrição (${protocolo}) - Hands-On Prof. Emilio Akaki`,
                            Protocolo: protocolo,
                            Nome: name,
                            Vinculo: vinculoSelecionado, // ---> NOVO: Também envia o vínculo no e-mail <---
                            Email: email,
                            WhatsApp: phone,
                            Periodo: period,
                            Valor: 'R$ 15,00 (Pix)',
                            Abrir_Comprovante: comprovantePublicUrl
                        })
                    }).catch(() => {});
                }


                const panelInscrever = document.getElementById('panelInscrever');
                if (panelInscrever) {
                    panelInscrever.innerHTML = `
                        <div style="text-align: center; padding: 15px 6px;">
                            <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(32, 180, 134, 0.22); border: 2px solid #20b486; display: inline-flex; justify-content: center; align-items: center; color: #7ef7d1; font-size: 1.8rem; margin-bottom: 1rem; box-shadow: 0 0 25px rgba(32, 180, 134, 0.35);">
                                <i class="fa-solid fa-check"></i>
                            </div>
                            <div class="lookup-status-pill" style="margin: 0 auto 0.8rem auto;">
                                <i class="fa-solid fa-shield-check"></i>
                                <span>Protocolo: ${protocolo}</span>
                            </div>
                            <h2 class="title-reveal" style="font-size: 2.1rem; margin-bottom: 0.6rem; color: #ffffff;">Inscrição Confirmada!</h2>
                            <p style="font-size: 1rem; line-height: 1.6; color: var(--light-blue); margin-bottom: 1rem;">
                                Parabéns, <strong>${name}</strong>! Sua inscrição e seu comprovante foram salvos no sistema da <strong>L.A.R.O.</strong>
                            </p>
                            <div class="lookup-card-item" style="text-align: left; margin-bottom: 1.4rem;">
                                <div class="lookup-row"><span>Evento:</span> Hands-On Técnica Classe IV — Prof. Dr. Emilio Akaki</div>
                                <div class="lookup-row"><span>Data e Local:</span> 03/11 às 17h • UniBH</div>
                                <div class="lookup-row"><span>Membro:</span> ${name} (${period})</div>
                                <div class="lookup-row"><span>E-mail:</span> ${email}</div>
                                <div class="lookup-row"><span>Comprovante:</span> ${receiptFile.name}</div>
                                ${comprovantePublicUrl.startsWith('http') ? `<a href="${comprovantePublicUrl}" target="_blank" rel="noopener" class="lookup-receipt-link"><i class="fa-solid fa-eye"></i> Visualizar Meu Comprovante</a>` : ''}
                            </div>
                            <button type="button" class="submit-btn" onclick="switchPalestraTab('consultar')" style="max-width: 280px; margin: 0 auto;">
                                <i class="fa-solid fa-magnifying-glass" style="margin-right: 6px;"></i> Consultar Minha Inscrição
                            </button>
                        </div>
                    `;
                }
            } catch (err) {
                console.error('Erro ao salvar inscrição no Supabase:', err);
                if (lectureSubmitBtn) {
                    lectureSubmitBtn.disabled = false;
                    lectureSubmitBtn.textContent = 'Confirmar Inscrição e Enviar Comprovante';
                }
                if (receiptErrorMsg) {
                    receiptErrorMsg.textContent = 'Não foi possível salvar no banco de dados. Verifique se o comando SQL já foi executado no Supabase e tente novamente.';
                    receiptErrorMsg.style.display = 'block';
                }
            }
        });
    }

    // =========================================================================
    // CONSULTA DE INSCRIÇÃO PELO PRÓPRIO MEMBRO (E-MAIL OU WHATSAPP)
    // =========================================================================
    const lookupForm = document.getElementById('lookup-form');
    const lookupQueryInput = document.getElementById('lookupQuery');
    const lookupResultBox = document.getElementById('lookupResultBox');
    const lookupSubmitBtn = document.getElementById('lookupSubmitBtn');

    if (lookupForm && lookupQueryInput && lookupResultBox) {
        lookupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const rawQuery = lookupQueryInput.value.trim();
            if (!rawQuery) return;

            if (lookupSubmitBtn) {
                lookupSubmitBtn.disabled = true;
                lookupSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Buscando...';
            }
            lookupResultBox.style.display = 'block';
            lookupResultBox.innerHTML = '<p style="text-align:center; color: var(--light-blue); margin: 0;">Consultando banco de dados da L.A.R.O....</p>';

            try {
                const cleanEmail = rawQuery.toLowerCase();
                const filterUrl = `${SUPABASE_LARO.restUrl}/${SUPABASE_LARO.tablePalestra}?select=protocolo,nome_completo,email,whatsapp,periodo,evento,valor_pago,comprovante_nome,comprovante_url,status_inscricao,created_at&email=ilike.${encodeURIComponent(cleanEmail)}&order=created_at.desc`;

                const res = await fetch(filterUrl, {
                    method: 'GET',
                    headers: {
                        'apikey': SUPABASE_LARO.anonKey,
                        'Authorization': `Bearer ${SUPABASE_LARO.anonKey}`,
                        'Accept': 'application/json'
                    }
                });

                if (!res.ok) {
                    throw new Error('Erro na consulta.');
                }

                const rows = await res.json();

                if (!rows || rows.length === 0) {
                    lookupResultBox.innerHTML = `
                        <div style="text-align: center; padding: 10px;">
                            <i class="fa-solid fa-circle-exclamation" style="font-size: 1.6rem; color: #ff9f7b; margin-bottom: 8px;"></i>
                            <p style="color: #ffffff; font-size: 0.92rem; margin-bottom: 4px;"><strong>Nenhuma inscrição encontrada</strong> para o e-mail "${rawQuery}".</p>
                            <p style="color: rgba(255,255,255,0.7); font-size: 0.8rem; margin: 0;">Verifique se digitou exatamente o mesmo e-mail utilizado na inscrição.</p>
                        </div>
                    `;
                } else {
                    lookupResultBox.innerHTML = rows.map((item) => {
                        const dataFormatada = item.created_at
                            ? new Date(item.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                            : '';
                        const linkComprovante = item.comprovante_url && item.comprovante_url.startsWith('http')
                            ? `<a href="${item.comprovante_url}" target="_blank" rel="noopener" class="lookup-receipt-link"><i class="fa-solid fa-file-invoice-dollar"></i> Ver Comprovante Enviado</a>`
                            : '';

                        return `
                            <div class="lookup-card-item">
                                <div class="lookup-status-pill">
                                    <i class="fa-solid fa-circle-check"></i>
                                    <span>Inscrição ${item.status_inscricao || 'Confirmada'} • ${item.protocolo || 'LARO'}</span>
                                </div>
                                <div class="lookup-row"><span>Membro:</span> ${item.nome_completo} (${item.periodo})</div>
                                <div class="lookup-row"><span>E-mail:</span> ${item.email}</div>
                                <div class="lookup-row"><span>WhatsApp:</span> ${item.whatsapp}</div>
                                <div class="lookup-row"><span>Evento:</span> Hands-On Prof. Dr. Emilio Akaki (03/11 às 17h - UniBH)</div>
                                <div class="lookup-row"><span>Comprovante:</span> ${item.comprovante_nome || 'Anexado'} (${item.valor_pago || 'R$ 15,00'})</div>
                                ${dataFormatada ? `<div class="lookup-row"><span>Data do Registro:</span> ${dataFormatada}</div>` : ''}
                                ${linkComprovante}
                            </div>
                        `;
                    }).join('');
                }
            } catch (err) {
                console.error('Erro na busca:', err);
                lookupResultBox.innerHTML = `
                    <p style="color: #ff7b7b; font-size: 0.85rem; text-align: center; margin: 0;">
                        Não foi possível consultar no momento. Verifique sua conexão e tente novamente.
                    </p>
                `;
            } finally {
                if (lookupSubmitBtn) {
                    lookupSubmitBtn.disabled = false;
                    lookupSubmitBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass" style="margin-right: 6px;"></i> Buscar Inscrição';
                }
            }
        });
    }
});