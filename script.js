/* ============================================
   SCARLETT ROSE CREATIVE — Script
   Scroll animations, nav, mobile menu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll Reveal Animations ----
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Keep watching so elements re-animate if user scrolls back
        // Comment out next line to keep elements visible once revealed:
        // revealObserver.unobserve(entry.target);
      } else {
        // Remove visible class when element leaves viewport
        // so it re-animates on next scroll
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ---- Navbar scroll effect ----
  const nav = document.getElementById('nav');
  let lastScrollY = 0;

  const handleNavScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });


  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  });


  // ---- Mobile hamburger menu ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });


  // ---- Contact form ----
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      return;
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('.btn--submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sent! ✓';
    submitBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.pointerEvents = '';
      contactForm.reset();
    }, 3000);
  });


  // ---- Parallax-like effect on hero name ----
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.hero').offsetHeight;

      if (scrollY < heroHeight) {
        const progress = scrollY / heroHeight;
        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
        heroContent.style.opacity = 1 - progress * 1.2;
      }
    }, { passive: true });
  }


  // ---- Stat counter animation ----
  const statNumbers = document.querySelectorAll('.about__stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const finalText = el.textContent; // e.g., "10+"
        const finalNum = parseInt(finalText);
        const suffix = finalText.replace(/\d+/, ''); // e.g., "+"

        if (el.dataset.animated) return;
        el.dataset.animated = 'true';

        let current = 0;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          current = Math.round(eased * finalNum);
          el.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));


  // ---- Siri Edge Glow — scroll-based color shift ----
  const siriGlow = document.querySelector('.siri-glow');
  if (siriGlow) {
    const glowEdges = siriGlow.querySelectorAll('.siri-glow__edge');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / docHeight, 1);
      const hueShift = scrollProgress * 360;

      glowEdges.forEach(edge => {
        edge.style.filter = `hue-rotate(${hueShift}deg)`;
      });
    }, { passive: true });
  }

  // ---- Portfolio Lightbox Modal ----
  const videoModal = document.getElementById('videoModal');
  const videoModalPlayer = document.getElementById('videoModalPlayer');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalClose = document.getElementById('videoModalClose');

  function openVideoModal(videoId, title, isVertical) {
    // Set player aspect ratio
    videoModalPlayer.className = 'video-modal__player' + (isVertical ? ' video-modal__player--vertical' : '');

    // Create iframe — use nocookie domain for privacy
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=1&showinfo=0&iv_load_policy=3&disablekb=0`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    videoModalPlayer.innerHTML = '';
    videoModalPlayer.appendChild(iframe);

    // Set title
    videoModalTitle.textContent = title;

    // Open modal
    videoModal.classList.add('is-open');
    document.body.classList.add('modal-open');
  }

  function closeVideoModal() {
    videoModal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    // Remove iframe after transition to stop playback
    setTimeout(() => {
      videoModalPlayer.innerHTML = '';
    }, 400);
  }

  // Card click handlers
  document.querySelectorAll('.work__card[data-video-id]').forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.dataset.videoId;
      const title = card.querySelector('.work__card-title')?.textContent || '';
      const isVertical = !!card.querySelector('.work__card-thumb--vertical');
      openVideoModal(videoId, title, isVertical);
    });
  });

  // Close handlers
  if (videoModalClose) {
    videoModalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeVideoModal();
    });
  }

  // Backdrop click to close
  const backdrop = videoModal?.querySelector('.video-modal__backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeVideoModal);
  }

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal?.classList.contains('is-open')) {
      closeVideoModal();
    }
  });

});
