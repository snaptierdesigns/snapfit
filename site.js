(() => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((link) => {
        const href = new URL(link.getAttribute('href'), window.location.href).pathname.split('/').pop();
        link.classList.toggle('active', href === currentPage || (currentPage === '' && href === 'index.html'));
    });

    const lenis = typeof Lenis !== 'undefined'
        ? new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        })
        : null;

    if (lenis) {
        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (event) => {
                event.preventDefault();
                lenis.scrollTo(anchor.getAttribute('href'));
            });
        });
    }

    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = hamburgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-menu a').forEach((link) => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton ? submitButton.textContent : '';

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'SENDING...';
            }

            formStatus.textContent = '';
            formStatus.classList.remove('error', 'success');

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        Accept: 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Form submission failed');
                }

                contactForm.reset();
                formStatus.textContent = 'Message sent. We will get back to you soon.';
                formStatus.classList.add('success');
            } catch (error) {
                formStatus.textContent = 'Could not send right now. Please try again or contact us on WhatsApp.';
                formStatus.classList.add('error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            }
        });
    }

    const track = document.getElementById('reviewsTrack');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');

    if (track && nextBtn && prevBtn) {
        let scrollAmount = 0;
        let isPaused = false;
        const speed = 0.5;
        const cardAdvance = 380;

        const firstSetWidth = () => track.scrollWidth / 2;

        const step = () => {
            if (!isPaused) {
                scrollAmount += speed;

                if (scrollAmount >= firstSetWidth()) {
                    scrollAmount = 0;
                }

                track.style.transform = `translateX(-${scrollAmount}px)`;
            }

            requestAnimationFrame(step);
        };

        nextBtn.addEventListener('click', () => {
            scrollAmount += cardAdvance;
            if (scrollAmount >= firstSetWidth()) {
                scrollAmount = 0;
            }
        });

        prevBtn.addEventListener('click', () => {
            scrollAmount -= cardAdvance;
            if (scrollAmount < 0) {
                scrollAmount = firstSetWidth() - cardAdvance;
            }
        });

        track.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        track.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        requestAnimationFrame(step);
    }
})();
