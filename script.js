/* ===================================================================
   AHALADHA RESORTS — Main JavaScript
   Handles navigation, animations, lightbox, forms, parallax
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------
     1. STICKY NAVIGATION
     ------------------------------------------------------------------ */
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Scroll-based navbar styling
  const handleNavScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll(); // run on load

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------------------------------
     2. SCROLL REVEAL ANIMATIONS
     ------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');
  const staggerContainers = document.querySelectorAll('.stagger-children');

  // Set stagger CSS variable on children
  staggerContainers.forEach(container => {
    const children = container.children;
    Array.from(children).forEach((child, i) => {
      child.style.setProperty('--i', i);
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     3. PARALLAX EFFECT
     ------------------------------------------------------------------ */
  const parallaxElements = document.querySelectorAll('.parallax-bg');

  const handleParallax = () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  };

  if (parallaxElements.length) {
    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  /* ------------------------------------------------------------------
     4. BACK TO TOP BUTTON
     ------------------------------------------------------------------ */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     5. LIGHTBOX
     ------------------------------------------------------------------ */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentLightboxIndex = 0;
  let galleryImages = [];

  if (lightbox && galleryItems.length) {
    // Collect gallery images
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        galleryImages.push(img.src);
        item.addEventListener('click', () => openLightbox(index));
      }
    });

    function openLightbox(index) {
      currentLightboxIndex = index;
      lightboxImg.src = galleryImages[index];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
      currentLightboxIndex += direction;
      if (currentLightboxIndex < 0) currentLightboxIndex = galleryImages.length - 1;
      if (currentLightboxIndex >= galleryImages.length) currentLightboxIndex = 0;
      lightboxImg.src = galleryImages[currentLightboxIndex];
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  /* ------------------------------------------------------------------
     6. BOOKING FORM
     ------------------------------------------------------------------ */
  const bookingForm = document.getElementById('bookingForm');
  const formContainer = document.querySelector('.booking-form-container');
  const confirmationEl = document.querySelector('.booking-confirmation');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const inputs = bookingForm.querySelectorAll('[required]');
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#e74c3c';
          input.addEventListener('input', () => {
            input.style.borderColor = '';
          }, { once: true });
        }
      });

      // Date validation
      const checkin = bookingForm.querySelector('#checkin');
      const checkout = bookingForm.querySelector('#checkout');
      if (checkin && checkout && checkin.value && checkout.value) {
        if (new Date(checkout.value) <= new Date(checkin.value)) {
          valid = false;
          checkout.style.borderColor = '#e74c3c';
          alert('Check-out date must be after check-in date.');
        }
      }

      if (valid) {
        // Show confirmation
        bookingForm.style.display = 'none';
        if (confirmationEl) {
          confirmationEl.classList.add('show');
        }
      }
    });

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = bookingForm.querySelector('#checkin');
    const checkoutInput = bookingForm.querySelector('#checkout');
    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;

    if (checkinInput && checkoutInput) {
      checkinInput.addEventListener('change', () => {
        checkoutInput.min = checkinInput.value;
        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
          checkoutInput.value = '';
        }
      });
    }
  }

  /* ------------------------------------------------------------------
     7. IMAGE LAZY LOADING
     ------------------------------------------------------------------ */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });

  /* ------------------------------------------------------------------
     8. SMOOTH SCROLL FOR ANCHOR LINKS
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ------------------------------------------------------------------
     9. COUNTER ANIMATION (for stats)
     ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const increment = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 25);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(c => counterObserver.observe(c));

  /* ------------------------------------------------------------------
     10. CONTACT FORM (on contact page)
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = contactForm.querySelectorAll('[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#e74c3c';
          input.addEventListener('input', () => {
            input.style.borderColor = '';
          }, { once: true });
        }
      });
      if (valid) {
        alert('Thank you for your message! We will get back to you shortly.');
        contactForm.reset();
      }
    });
  }

  /* ------------------------------------------------------------------
     11. PERFORMANCE: Throttle scroll events
     ------------------------------------------------------------------ */
  // NOTE: We intentionally keep scroll handlers lightweight.
  // The parallax & nav handlers are simple transforms/class toggles.
});
