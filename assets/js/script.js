const app = {
    whatsappNumber: "551938133809",

    init: function() {
        this.setupNavigation();
        this.setupScrollReveal();
        this.generateBubbles();
        this.setupTouchEvents();
        
        // Navegar para hash se existir
        const hash = window.location.hash.substring(1);
        if(hash) this.navigate(hash);
        
        // Prevenir zoom duplo no iOS
        this.preventDoubleTapZoom();
    },

    setupNavigation: function() {
        const mobileBtn = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        // Criar overlay se não existir
        if (!document.querySelector('.mobile-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-overlay';
            document.body.appendChild(overlay);
        }
        
        const overlay = document.querySelector('.mobile-overlay');

        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Fechar menu ao clicar no overlay
        overlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // Fechar menu ao clicar em qualquer link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Fechar menu com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });

        // Prevenir comportamento padrão de links
        document.querySelectorAll('a[href="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
    },

    navigate: function(pageId) {
        // Atualizar links ativos
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const onclick = link.getAttribute('onclick');
            if(onclick && onclick.includes(pageId)) {
                link.classList.add('active');
            }
        });

        // Esconder todas as páginas
        document.querySelectorAll('.page-view').forEach(page => {
            page.classList.remove('active');
        });

        // Mostrar página alvo
        const targetPage = document.getElementById(pageId);
        if(targetPage) {
            targetPage.classList.add('active');
            // Scroll suave para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Fechar menu mobile se aberto
            this.closeMobileMenu();
            
            // Atualizar URL hash sem recarregar a página
            window.history.pushState(null, null, `#${pageId}`);
        }
    },

    toggleMobileMenu: function() {
        const navMenu = document.getElementById('nav-menu');
        const overlay = document.querySelector('.mobile-overlay');
        const mobileBtn = document.getElementById('mobile-toggle');
        const icon = mobileBtn.querySelector('i');
        
        const isActive = navMenu.classList.contains('active');
        
        if (!isActive) {
            // Abrir menu
            navMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Mudar ícone para X
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            // Adicionar classe para body
            document.body.classList.add('menu-open');
        } else {
            // Fechar menu
            this.closeMobileMenu();
        }
    },

    closeMobileMenu: function() {
        const navMenu = document.getElementById('nav-menu');
        const overlay = document.querySelector('.mobile-overlay');
        const mobileBtn = document.getElementById('mobile-toggle');
        const icon = mobileBtn.querySelector('i');
        
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            // Mudar ícone para hambúrguer
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            // Remover classe do body
            document.body.classList.remove('menu-open');
        }
    },

    contactWhatsapp: function(serviceName) {
        const message = `Olá, vim pelo site da Codogno Contabilidade e tenho interesse na área: ${serviceName}. Gostaria de mais informações.`;
        const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    },

    sendEmail: function(e) {
        e.preventDefault();
        
        const name = document.getElementById('c-name').value.trim();
        const phone = document.getElementById('c-phone').value.trim();
        const email = document.getElementById('c-email').value.trim();
        const service = document.getElementById('c-service').value;
        const message = document.getElementById('c-message').value.trim();

        // Validação básica
        if (!name || !phone || !email) {
            alert('Por favor, preencha os campos obrigatórios: Nome, Telefone e E-mail.');
            return;
        }

        const subject = `Contato Site - ${service} - ${name}`;
        const body = `Nome: ${name}%0D%0ATelefone: ${phone}%0D%0AEmail: ${email}%0D%0AServiço: ${service}%0D%0A%0D%0AMensagem:%0D%0A${message}`;

        window.location.href = `mailto:contato@codognocontabilidade.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    },

    setupScrollReveal: function() {
        const reveals = document.querySelectorAll('.reveal');
        
        const checkScroll = () => {
            const triggerBottom = window.innerHeight * 0.85;
            
            reveals.forEach(reveal => {
                const boxTop = reveal.getBoundingClientRect().top;
                if(boxTop < triggerBottom) {
                    reveal.classList.add('active');
                }
            });
        }

        // Verificar no carregamento
        checkScroll();
        
        // Verificar no scroll com throttle
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    checkScroll();
                    scrollTimeout = null;
                }, 100);
            }
        });

        // Verificar no resize
        window.addEventListener('resize', checkScroll);
    },

    generateBubbles: function() {
        const container = document.getElementById('hero-anim');
        if (!container) return;
        
        // Limpar bolhas existentes
        container.innerHTML = '';
        
        const bubbleCount = window.innerWidth < 768 ? 8 : 15;

        for(let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            const size = Math.random() * (window.innerWidth < 768 ? 40 : 60) + 20;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
            bubble.style.animationDelay = `${Math.random() * 5}s`;
            
            container.appendChild(bubble);
        }
    },

    setupTouchEvents: function() {
        // Prevenir scroll do body quando o menu está aberto
        document.addEventListener('touchmove', (e) => {
            if (document.body.classList.contains('menu-open')) {
                e.preventDefault();
            }
        }, { passive: false });

        // Melhorar toque em botões
        document.querySelectorAll('.btn, .nav-link').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });

            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    },

    preventDoubleTapZoom: function() {
        // Prevenir zoom duplo no iOS
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    },

    // Função para recriar bolhas no resize (para responsividade)
    handleResize: function() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.generateBubbles();
        }, 250);
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    
    // Adicionar listener para resize
    window.addEventListener('resize', () => {
        app.handleResize();
    });
    
    // Lidar com navegação pelo botão voltar/avançar
    window.addEventListener('popstate', function(event) {
        const hash = window.location.hash.substring(1);
        if (hash) {
            app.navigate(hash);
        } else {
            app.navigate('home');
        }
    });
});

// Prevenir comportamento padrão de formulário
document.addEventListener('submit', function(e) {
    if (e.target.tagName === 'FORM') {
        const form = e.target;
        if (!form.checkValidity()) {
            e.preventDefault();
            form.reportValidity();
        }
    }
});

// Adicionar classe para melhorar toque no iOS
document.documentElement.classList.add('ios-device');