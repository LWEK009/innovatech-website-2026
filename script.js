/**
 * INNOVATECH AI & TECH CLUB - CU ILLIZI
 * Interactive Logic: Neural Canvas, Modals, Gallery Filters, Lightbox, Counters
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initTextRotator();
  initCounters();
  initGalleryFilter();
  initLightbox();
  initModals();
  initMobileNav();
  initScrollNav();
});

/* ==========================================================================
   1. Interactive Neural Network Background Canvas
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  // Track mouse on hero container
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1.2;
      this.color = Math.random() > 0.3 ? '#0DB59E' : '#0DF5C4';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push/pull
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0DB59E';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Determine density based on screen width
  const count = Math.min(Math.floor((width * height) / 12000), 75);
  particles = Array.from({ length: Math.max(35, count) }, () => new Particle());

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting synapses
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(13, 181, 158, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Connect to mouse
    if (mouse.x !== null && mouse.y !== null) {
      for (let i = 0; i < particles.length; i++) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(13, 245, 196, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update & draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Dynamic Text Rotator (Hero Specialities)
   ========================================================================== */
function initTextRotator() {
  const el = document.getElementById('specialityRotator');
  if (!el) return;

  const specialties = [
    'Artificial Intelligence & Deep Learning',
    'YOLOv8 Camel Collision Detection',
    'Smart Robotics & Autonomous Rovers',
    'Virtual Reality & Immersive Tech',
    'Smart Reverse Vending Machines (RVM)',
    'Youth STEM & School Caravans'
  ];

  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentText = specialties[currentIndex];

    if (isDeleting) {
      el.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      el.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typeSpeed = 2200; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % specialties.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   3. Animated Numerical Counters
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  let hasRun = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 1800;
          const start = 0;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = start;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('statsSection');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   4. Gallery Filtering System
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active styling
      filterBtns.forEach(b => {
        b.classList.remove('bg-teal-500', 'text-slate-900', 'shadow-lg', 'shadow-teal-500/25');
        b.classList.add('bg-slate-800/60', 'text-slate-300', 'hover:bg-slate-700/60');
      });
      btn.classList.remove('bg-slate-800/60', 'text-slate-300', 'hover:bg-slate-700/60');
      btn.classList.add('bg-teal-500', 'text-slate-900', 'shadow-lg', 'shadow-teal-500/25');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Lightbox Modal for Gallery Images
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxTag = document.getElementById('lightboxTag');
  const closeBtn = document.getElementById('closeLightbox');

  if (!lightbox) return;

  const openTriggers = document.querySelectorAll('.project-card, .lightbox-trigger');

  openTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      // Prevent double trigger if clicking button inside card
      if (trigger.classList.contains('project-card') && e.target.closest('.lightbox-trigger')) {
        return;
      }
      const src = trigger.getAttribute('data-src') || trigger.closest('.project-card')?.getAttribute('data-src');
      const title = trigger.getAttribute('data-title') || trigger.closest('.project-card')?.getAttribute('data-title');
      const desc = trigger.getAttribute('data-desc') || trigger.closest('.project-card')?.getAttribute('data-desc');
      const tag = trigger.getAttribute('data-tag') || trigger.closest('.project-card')?.getAttribute('data-tag');

      if (!src) return;

      lightboxImg.src = src;
      lightboxTitle.textContent = title || 'Innovatech Project';
      lightboxDesc.textContent = desc || '';
      lightboxTag.textContent = tag || 'Innovation';

      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        lightbox.classList.add('opacity-100');
      }, 10);
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('opacity-100');
    setTimeout(() => {
      lightbox.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 250);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   6. Contact & Join Us Modals
   ========================================================================== */
function initModals() {
  // Contact Modal
  const contactModal = document.getElementById('contactModal');
  const openContactBtns = document.querySelectorAll('.open-contact-btn');
  const closeContactBtn = document.getElementById('closeContactModal');

  // Join Us Modal
  const joinModal = document.getElementById('joinModal');
  const openJoinBtns = document.querySelectorAll('.open-join-btn');
  const closeJoinBtn = document.getElementById('closeJoinModal');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      modal.classList.add('opacity-100');
    }, 10);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('opacity-100');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 250);
  }

  // Contact triggers
  openContactBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(contactModal);
    });
  });
  if (closeContactBtn) {
    closeContactBtn.addEventListener('click', () => closeModal(contactModal));
  }
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal(contactModal);
    });
  }

  // Join Us triggers
  openJoinBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(joinModal);
    });
  });
  if (closeJoinBtn) {
    closeJoinBtn.addEventListener('click', () => closeModal(joinModal));
  }
  if (joinModal) {
    joinModal.addEventListener('click', (e) => {
      if (e.target === joinModal) closeModal(joinModal);
    });
  }

  // Handle Form Submissions with Toast Feedback
  const contactForm = document.getElementById('contactForm');
  const contactModalForm = document.getElementById('contactModalForm');
  const joinForm = document.getElementById('joinForm');

  function handleFormSubmit(form, successMsg, closeParentModal = null) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Sending...
      `;

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (closeParentModal) closeModal(closeParentModal);
        showToast(successMsg);
      }, 1200);
    });
  }

  handleFormSubmit(contactForm, 'Message sent successfully! The Innovatech team will contact you soon.');
  handleFormSubmit(contactModalForm, 'Thank you! We received your message and will reach out shortly.', contactModal);
  handleFormSubmit(joinForm, 'Welcome to Innovatech! Your application has been submitted. Check your email for next steps.', joinModal);
}

// Toast notification helper
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-teal-500/50 text-white px-5 py-4 rounded-xl shadow-2xl shadow-teal-500/20 transform transition-all duration-300 translate-y-10 opacity-0';
  toast.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    </div>
    <div class="text-sm font-medium pr-2">${message}</div>
  `;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ==========================================================================
   7. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   8. Navbar Scroll Blur & Active State
   ========================================================================== */
function initScrollNav() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('shadow-xl', 'shadow-black/50', 'bg-slate-950/90');
      navbar.classList.remove('bg-slate-950/70');
    } else {
      navbar.classList.remove('shadow-xl', 'shadow-black/50', 'bg-slate-950/90');
      navbar.classList.add('bg-slate-950/70');
    }
  });
}
