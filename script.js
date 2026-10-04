document.addEventListener('DOMContentLoaded', () => {
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const greetingElement = document.getElementById('dynamic-greeting');
    if (greetingElement) {
        const jam = new Date().getHours();
        let sapaan = 'Halo';
        if (jam >= 5 && jam < 11) {
            sapaan = 'Selamat pagi';
        } else if (jam >= 11 && jam < 15) {
            sapaan = 'Selamat siang';
        } else if (jam >= 15 && jam < 18) {
            sapaan = 'Selamat sore';
        } else {
            sapaan = 'Selamat malam';
        }
        greetingElement.textContent = sapaan;
    }
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playClickSound() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(550, audioCtx.currentTime); 
        
        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.05);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    }
    document.querySelectorAll('a, button, .project-row, .filter-btn').forEach(el => {
        el.addEventListener('click', () => {
            if (!reduceMotion) playClickSound();
        });
    });
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeToggleBtn && themeIcon) {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'light') {
            document.documentElement.classList.add('light-mode');
            themeIcon.textContent = '🌙';
        }

        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('light-mode');
            if (isLight) {
                localStorage.setItem('theme', 'light');
                themeIcon.textContent = '🌙';
            } else {
                localStorage.setItem('theme', 'dark');
                themeIcon.textContent = '☀️';
            }
        });
    }
    const filterButtons = document.querySelectorAll('.filter-btn-gold, .filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card[data-category], .project-row[data-category]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            portfolioCards.forEach(card => {
                const cat = card.getAttribute('data-category');
                if (filterValue === 'all' || cat === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ── Skill bar animation on scroll ──
    const skillBars = document.querySelectorAll('.skill-bar-fill[data-width]');
    if ('IntersectionObserver' in window && skillBars.length) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    bar.style.width = bar.getAttribute('data-width') + '%';
                    barObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });
        skillBars.forEach(bar => barObserver.observe(bar));
    } else {
        skillBars.forEach(bar => { bar.style.width = bar.getAttribute('data-width') + '%'; });
    }
    const titikKursor = document.getElementById('cursor');
    const ringKursor = document.getElementById('cursor-ring');

    if (titikKursor && ringKursor && !reduceMotion) {
        document.addEventListener('mousemove', (e) => {
            titikKursor.style.left = `${e.clientX}px`;
            titikKursor.style.top = `${e.clientY}px`;
            ringKursor.style.left = `${e.clientX}px`;
            ringKursor.style.top = `${e.clientY}px`;
        });
    }

    const canvas = document.getElementById('canvas');
    if (canvas && !reduceMotion) {
        const ctx = canvas.getContext('2d');
        let partikelArray = [];
        let animasiId = null;

        function jumlahPartikelIdeal() { return window.innerWidth < 640 ? 18 : 40; }
        function aturUkuran() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        aturUkuran();
        window.addEventListener('resize', () => { aturUkuran(); inisialisasi(); });

        class Partikel {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.ukuran = Math.random() * 1.5 + 0.5;
                this.kecepatanX = Math.random() * 0.3 - 0.15;
                this.kecepatanY = Math.random() * 0.3 - 0.15;
            }
            update() {
                this.x += this.kecepatanX; this.y += this.kecepatanY;
                if (this.x > canvas.width) this.x = 0; if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0; if (this.y < 0) this.y = canvas.height;
            }
            gambar() {
                ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
                ctx.beginPath(); ctx.arc(this.x, this.y, this.ukuran, 0, Math.PI * 2); ctx.fill();
            }
        }

        function inisialisasi() {
            partikelArray = [];
            const jumlah = jumlahPartikelIdeal();
            for (let i = 0; i < jumlah; i++) partikelArray.push(new Partikel());
        }

        function animasi() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < partikelArray.length; i++) {
                partikelArray[i].update(); partikelArray[i].gambar();
            }
            animasiId = requestAnimationFrame(animasi);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) { if (animasiId) cancelAnimationFrame(animasiId); animasiId = null; }
            else if (!animasiId) animasi();
        });
        inisialisasi(); animasi();
    }

    const tombolMenu = document.getElementById('btn-menu');
    const panelMenu = document.getElementById('mobile-menu');

    if (tombolMenu && panelMenu) {
        const tutupMenu = () => {
            panelMenu.classList.remove('open');
            panelMenu.setAttribute('aria-hidden', 'true');
            tombolMenu.setAttribute('aria-expanded', 'false');
        };
        tombolMenu.addEventListener('click', () => {
            const sedangTerbuka = panelMenu.classList.toggle('open');
            panelMenu.setAttribute('aria-hidden', sedangTerbuka ? 'false' : 'true');
            tombolMenu.setAttribute('aria-expanded', sedangTerbuka ? 'true' : 'false');
        });
        panelMenu.querySelectorAll('a').forEach((tautan) => { tautan.addEventListener('click', tutupMenu); });
    }

    const elemenReveal = document.querySelectorAll('.reveal');
    if (elemenReveal.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        elemenReveal.forEach((el) => observer.observe(el));
    } else {
        elemenReveal.forEach((el) => el.classList.add('in-view'));
    }

    const baganLog = document.getElementById('log-line');
    if (baganLog) {
        const daftarLog = ['> git commit -m "fix bug"', '> npm run dev', '> serve_ball() -> ace!', '> belajar.next_topic()', '> status: masih ngulik'];
        let indeks = 0; baganLog.textContent = daftarLog[0];
        if (!reduceMotion) {
            setInterval(() => {
                indeks = (indeks + 1) % daftarLog.length;
                baganLog.style.opacity = '0';
                setTimeout(() => { baganLog.textContent = daftarLog[indeks]; baganLog.style.opacity = '1'; }, 200);
            }, 2800);
            baganLog.style.transition = 'opacity 0.2s ease';
        }
    }
    const tombolCopyEmail = document.getElementById('btn-copy-email');
    const teksEmail = document.getElementById('contact-email');
    if (tombolCopyEmail && teksEmail) {
        tombolCopyEmail.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(teksEmail.textContent.trim());
                const labelAsli = tombolCopyEmail.textContent;
                tombolCopyEmail.textContent = 'Tersalin!';
                setTimeout(() => { tombolCopyEmail.textContent = labelAsli; }, 1800);
            } catch (err) { console.error('Gagal menyalin email:', err); }
        });
    }
});