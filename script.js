document.addEventListener('DOMContentLoaded', () => {

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const titikKursor = document.getElementById('cursor');
    const ringKursor = document.getElementById('cursor-ring');

    if (titikKursor && ringKursor && !reduceMotion) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            titikKursor.style.left = `${x}px`;
            titikKursor.style.top = `${y}px`;

            ringKursor.style.left = `${x}px`;
            ringKursor.style.top = `${y}px`;
        });
    }

    const canvas = document.getElementById('canvas');
    if (canvas && !reduceMotion) {
        const ctx = canvas.getContext('2d');
        let partikelArray = [];
        let animasiId = null;

        function jumlahPartikelIdeal() {
            return window.innerWidth < 640 ? 18 : 40;
        }

        function aturUkuran() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        aturUkuran();
        window.addEventListener('resize', () => {
            aturUkuran();
            inisialisasi();
        });

        class Partikel {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.ukuran = Math.random() * 1.5 + 0.5;
                this.kecepatanX = Math.random() * 0.3 - 0.15;
                this.kecepatanY = Math.random() * 0.3 - 0.15;
            }

            update() {
                this.x += this.kecepatanX;
                this.y += this.kecepatanY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            gambar() {
                ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.ukuran, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function inisialisasi() {
            partikelArray = [];
            const jumlah = jumlahPartikelIdeal();
            for (let i = 0; i < jumlah; i++) {
                partikelArray.push(new Partikel());
            }
        }

        function animasi() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < partikelArray.length; i++) {
                partikelArray[i].update();
                partikelArray[i].gambar();
            }
            animasiId = requestAnimationFrame(animasi);
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (animasiId) cancelAnimationFrame(animasiId);
                animasiId = null;
            } else if (!animasiId) {
                animasi();
            }
        });

        inisialisasi();
        animasi();
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

        panelMenu.querySelectorAll('a').forEach((tautan) => {
            tautan.addEventListener('click', tutupMenu);
        });
    }

    const elemenReveal = document.querySelectorAll('.reveal');
    if (elemenReveal.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        elemenReveal.forEach((el) => observer.observe(el));
    } else {
        elemenReveal.forEach((el) => el.classList.add('in-view'));
    }


    const baganLog = document.getElementById('log-line');
    if (baganLog) {
        const daftarLog = [
            '> git commit -m "fix bug"',
            '> npm run dev',
            '> serve_ball() -> ace!',
            '> belajar.next_topic()',
            '> status: masih ngulik'
        ];
        let indeks = 0;
        baganLog.textContent = daftarLog[0];

        if (!reduceMotion) {
            setInterval(() => {
                indeks = (indeks + 1) % daftarLog.length;
                baganLog.style.opacity = '0';
                setTimeout(() => {
                    baganLog.textContent = daftarLog[indeks];
                    baganLog.style.opacity = '1';
                }, 200);
            }, 2800);
            baganLog.style.transition = 'opacity 0.2s ease';
        }
    }

    const modalKontak = document.getElementById('contact-modal');
    const tombolKontak = document.getElementById('btn-hire');
    const tombolKontakMobile = document.getElementById('btn-hire-mobile');
    const tombolCopyEmail = document.getElementById('btn-copy-email');
    const teksEmail = document.getElementById('contact-email');

    if (modalKontak) {
        const bukaModal = () => {
            modalKontak.classList.add('open');
            modalKontak.setAttribute('aria-hidden', 'false');
        };

        const tutupModal = () => {
            modalKontak.classList.remove('open');
            modalKontak.setAttribute('aria-hidden', 'true');
        };

        [tombolKontak, tombolKontakMobile].forEach((tombol) => {
            if (tombol) tombol.addEventListener('click', bukaModal);
        });

        modalKontak.querySelectorAll('[data-close-modal]').forEach((el) => {
            el.addEventListener('click', tutupModal);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') tutupModal();
        });

        if (tombolCopyEmail && teksEmail) {
            tombolCopyEmail.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(teksEmail.textContent.trim());
                    const labelAsli = tombolCopyEmail.textContent;
                    tombolCopyEmail.textContent = 'Tersalin!';
                    setTimeout(() => {
                        tombolCopyEmail.textContent = labelAsli;
                    }, 1800);
                } catch (err) {
                    console.error('Gagal menyalin email:', err);
                }
            });
        }
    }
});