/**
 * =============================================================================
 * CHRISTOPHER THEO PURNOMO — PERSONAL PORTOFOLIO (VITE MODULE)
 * Tema: MODERN CLEAN MINIMALIST DARK
 * Fitur:
 * 1. Minimalist 0-100% Numeric Loading Screen with Sleek Progress Bar
 * 2. Spotify Interactive Player Card in Hero Section
 * 3. About Me: Smooth Spring-Physics Spotlight Reveal (Persis Referensi Eka Wahyu)
 * 4. Dual Synchronized Navigation (Top Pill Navbar + Vertical Side-Rail ^ & v)
 * 5. Interactive Canvas Grid, Precision Cursor, Copy Email, Resume Modal
 * =============================================================================
 */

import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------------
   * 1. INTRO: MODERN MINIMALIST DARK LOADING SCREEN
   *    - 0-100% numeric counter with sleek progress line
   *    - Ambient dust particles floating gently upward (monochrome & cyan accent)
   *    - Shutter reveal transition
   * --------------------------------------------------------------------------- */
  const introScreen = document.getElementById('introScreen');
  const loadingPercent = document.getElementById('loadingPercent');
  const loadingBarFill = document.getElementById('loadingBarFill');
  const introCanvas = document.getElementById('introParticleCanvas');

  if (introScreen && loadingPercent && loadingBarFill && introCanvas) {
    const ctx = introCanvas.getContext('2d');
    let cW = introCanvas.width = window.innerWidth;
    let cH = introCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      cW = introCanvas.width = window.innerWidth;
      cH = introCanvas.height = window.innerHeight;
    });

    // --- Minimalist Ambient Dust Particle System ---
    const particles = [];
    const MAX_PARTICLES = 60;

    class MinimalDust {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * cW;
        this.y = cH + Math.random() * 80;
        this.size = 1.0 + Math.random() * 2.2;
        this.speedY = -(0.3 + Math.random() * 0.9);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.opacity = 0.12 + Math.random() * 0.45;
        this.maxOpacity = this.opacity;
        this.life = 1;
        this.decay = 0.002 + Math.random() * 0.0035;
        this.isAccent = Math.random() > 0.82; // Subtle electric sky highlight
        this.waveAmp = 0.4 + Math.random() * 1.2;
        this.waveFreq = 0.01 + Math.random() * 0.02;
        this.waveOffset = Math.random() * Math.PI * 2;
        this.age = 0;
      }
      update(progress) {
        this.age++;
        this.y += this.speedY * (0.6 + progress * 1.2);
        this.x += this.speedX + Math.sin(this.age * this.waveFreq + this.waveOffset) * this.waveAmp * 0.08;
        this.life -= this.decay;
        this.opacity = this.maxOpacity * this.life * (0.35 + progress * 0.65);

        if (this.life <= 0 || this.y < -40) {
          this.reset();
        }
      }
      draw(ctx) {
        if (this.opacity <= 0.01) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.isAccent
          ? `rgba(56, 189, 248, ${this.opacity * 0.9})`
          : `rgba(248, 250, 252, ${this.opacity * 0.75})`;
        ctx.fill();
      }
    }

    // Initialize particles scattered throughout canvas
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = new MinimalDust();
      p.y = Math.random() * cH; // Pre-scatter
      particles.push(p);
    }

    // --- Loading Counter ---
    const duration = 2400; // ~2.4 seconds for cinematic pace
    const startTime = performance.now();
    let loadProgress = 0;
    let loadingDone = false;

    function updateLoading(now) {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / duration);

      // Easing: ease-out-cubic for natural deceleration
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      loadProgress = eased;
      const currentPct = Math.min(100, Math.floor(eased * 100));

      loadingPercent.textContent = `${currentPct}%`;
      loadingBarFill.style.width = `${currentPct}%`;

      // --- Draw particles ---
      ctx.clearRect(0, 0, cW, cH);

      // Subtle neutral ambient backdrop fog
      const fogAlpha = 0.015 + eased * 0.025;
      const fogGrad = ctx.createRadialGradient(cW / 2, cH / 2, 0, cW / 2, cH / 2, cW * 0.55);
      fogGrad.addColorStop(0, `rgba(56, 189, 248, ${fogAlpha * 0.4})`);
      fogGrad.addColorStop(0.5, `rgba(255, 255, 255, ${fogAlpha * 0.15})`);
      fogGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, cW, cH);

      particles.forEach(p => {
        p.update(eased);
        p.draw(ctx);
      });

      if (rawProgress < 1) {
        requestAnimationFrame(updateLoading);
      } else {
        loadingPercent.textContent = '100%';
        loadingBarFill.style.width = '100%';
        loadingDone = true;

        // Hold briefly at 100% then trigger shutter reveal
        setTimeout(() => {
          // Make shutters solid before sliding them away
          const shutters = introScreen.querySelectorAll('.intro-shutter');
          shutters.forEach(s => {
            s.style.backgroundColor = '#09090b';
            s.style.pointerEvents = 'auto';
          });
          // Small delay to let shutters render solid, then slide
          requestAnimationFrame(() => {
            introScreen.classList.add('intro-finished');
            setTimeout(() => {
              introScreen.style.display = 'none';
            }, 850);
          });
        }, 300);
      }
    }

    requestAnimationFrame(updateLoading);
  }

  /* ---------------------------------------------------------------------------
   * 2. SPOTIFY PLAYER INTERACTION (HERO RIGHT SECTION)
   * --------------------------------------------------------------------------- */
  const btnPlayPause = document.getElementById('btnPlayPause');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const vinylDisc = document.getElementById('vinylDisc');
  const equalizerBars = document.querySelectorAll('.eq-bar');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressBarBg = document.getElementById('progressBarBg');
  const timeCurrent = document.getElementById('timeCurrent');

  let isPlaying = true;
  let currentSeconds = 102; // 01:42
  const totalSeconds = 198;  // 03:18

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function setPlayState(playing) {
    isPlaying = playing;
    if (isPlaying) {
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconPause) iconPause.style.display = 'block';
      if (vinylDisc) vinylDisc.style.animationPlayState = 'running';
      equalizerBars.forEach(bar => bar.style.animationPlayState = 'running');
    } else {
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconPause) iconPause.style.display = 'none';
      if (vinylDisc) vinylDisc.style.animationPlayState = 'paused';
      equalizerBars.forEach(bar => bar.style.animationPlayState = 'paused');
    }
  }

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      setPlayState(!isPlaying);
    });
  }

  // Ticking track progress
  setInterval(() => {
    if (isPlaying) {
      currentSeconds = (currentSeconds + 1) % totalSeconds;
      const pct = (currentSeconds / totalSeconds) * 100;
      if (progressBarFill) progressBarFill.style.width = `${pct}%`;
      if (timeCurrent) timeCurrent.textContent = formatTime(currentSeconds);
    }
  }, 1000);

  // Click on progress bar to seek
  if (progressBarBg) {
    progressBarBg.addEventListener('click', (e) => {
      const rect = progressBarBg.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      currentSeconds = Math.floor(pct * totalSeconds);
      if (progressBarFill) progressBarFill.style.width = `${pct * 100}%`;
      if (timeCurrent) timeCurrent.textContent = formatTime(currentSeconds);
    });
  }

  /* ---------------------------------------------------------------------------
   * 3. ABOUT ME: SMOOTH SPRING-PHYSICS SPOTLIGHT REVEAL (PERSIS REFERENSI EKA WAHYU)
   * Formula Framer Motion: { damping: 25, stiffness: 250, mass: 0.5 }
   * Mask: radial-gradient(circle 120px at X px Y px, black 60%, transparent 100%)
   * --------------------------------------------------------------------------- */
  const aboutSpotlightContainer = document.getElementById('aboutSpotlightContainer');
  const aboutPhotoReveal = document.getElementById('aboutPhotoReveal');
  const spotlightCursorDot = document.getElementById('spotlightCursorDot');

  if (aboutSpotlightContainer && aboutPhotoReveal) {
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let vx = 0;
    let vy = 0;
    let isHovering = false;
    let rafId = null;

    // Exact Framer Motion spring constants from reference:
    const stiffness = 250;
    const damping = 25;
    const mass = 0.5;

    let lastTime = performance.now();

    function animateSpring(now) {
      const dt = Math.min(0.032, Math.max(0.008, (now - lastTime) / 1000));
      lastTime = now;

      // Semi-implicit Euler integration:
      const fx = -stiffness * (currentX - targetX) - damping * vx;
      const fy = -stiffness * (currentY - targetY) - damping * vy;

      const ax = fx / mass;
      const ay = fy / mass;

      vx += ax * dt;
      vy += ay * dt;

      currentX += vx * dt;
      currentY += vy * dt;

      // Feathered spotlight mask exactly matching reference (circle 120px, black 60%, transparent 100%)
      const maskGradient = `radial-gradient(circle 120px at ${currentX.toFixed(1)}px ${currentY.toFixed(1)}px, black 60%, transparent 100%)`;
      aboutPhotoReveal.style.webkitMaskImage = maskGradient;
      aboutPhotoReveal.style.maskImage = maskGradient;

      if (spotlightCursorDot) {
        spotlightCursorDot.style.left = `${currentX.toFixed(1)}px`;
        spotlightCursorDot.style.top = `${currentY.toFixed(1)}px`;
      }

      // Loop while hovering or until spring reaches rest state
      const distSq = (currentX - targetX) ** 2 + (currentY - targetY) ** 2;
      const speedSq = vx ** 2 + vy ** 2;

      if (isHovering || distSq > 0.5 || speedSq > 0.5) {
        rafId = requestAnimationFrame(animateSpring);
      } else {
        rafId = null;
      }
    }

    function ensureSpringLoop() {
      if (!rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(animateSpring);
      }
    }

    aboutSpotlightContainer.addEventListener('mouseenter', (e) => {
      isHovering = true;
      aboutSpotlightContainer.classList.add('is-hovering');

      const rect = aboutSpotlightContainer.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      // Smooth instant entry without flying from off-screen
      if (currentX < -500 || currentY < -500) {
        currentX = targetX;
        currentY = targetY;
        vx = 0;
        vy = 0;
      }

      ensureSpringLoop();
    });

    aboutSpotlightContainer.addEventListener('mousemove', (e) => {
      const rect = aboutSpotlightContainer.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      ensureSpringLoop();
    });

    aboutSpotlightContainer.addEventListener('mouseleave', () => {
      isHovering = false;
      aboutSpotlightContainer.classList.remove('is-hovering');
      targetX = -1000;
      targetY = -1000;
      ensureSpringLoop();
    });
  }

  /* ---------------------------------------------------------------------------
   * 4. SECTION LIST & DUAL SYNCHRONIZED NAVIGATION (PILL & VERTICAL RAIL)
   * --------------------------------------------------------------------------- */
  const sectionIds = ['home', 'about', 'portfolio', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const pillNavbar = document.getElementById('pillNavbar');
  const navIndicator = document.getElementById('navIndicator');
  const navLinks = document.querySelectorAll('.nav-link');

  const sideNavPrev = document.getElementById('sideNavPrev');
  const sideNavNext = document.getElementById('sideNavNext');
  const sideDots = document.querySelectorAll('.side-dot');
  const counterCurrent = document.getElementById('counterCurrent');

  let currentSectionIndex = 0;

  function updateNavIndicator(targetLink) {
    if (!targetLink || !navIndicator || !pillNavbar) return;
    const navRect = pillNavbar.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    const left = linkRect.left - navRect.left;
    const width = linkRect.width;

    navIndicator.style.left = `${left}px`;
    navIndicator.style.width = `${width}px`;
  }

  function setActiveSection(index) {
    if (index < 0 || index >= sections.length) return;
    currentSectionIndex = index;
    const currentId = sectionIds[index];

    navLinks.forEach(link => {
      const isMatch = link.getAttribute('data-section') === currentId;
      link.classList.toggle('active', isMatch);
      if (isMatch) updateNavIndicator(link);
    });

    sideDots.forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-section') === currentId);
    });

    if (counterCurrent) {
      counterCurrent.textContent = String(index + 1).padStart(2, '0');
    }

    if (sideNavPrev) sideNavPrev.style.opacity = index === 0 ? '0.35' : '1';
    if (sideNavNext) sideNavNext.style.opacity = index === sections.length - 1 ? '0.35' : '1';
  }

  setTimeout(() => {
    const activeLink = document.querySelector('.nav-link.active') || navLinks[0];
    if (activeLink) updateNavIndicator(activeLink);
  }, 100);

  window.addEventListener('resize', () => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) updateNavIndicator(activeLink);
  });

  function navigateToSection(index) {
    if (index >= 0 && index < sections.length) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
      setActiveSection(index);
    }
  }

  if (sideNavPrev) {
    sideNavPrev.addEventListener('click', () => {
      if (currentSectionIndex > 0) navigateToSection(currentSectionIndex - 1);
    });
  }

  if (sideNavNext) {
    sideNavNext.addEventListener('click', () => {
      if (currentSectionIndex < sections.length - 1) navigateToSection(currentSectionIndex + 1);
    });
  }

  sideDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => navigateToSection(idx));
  });

  navLinks.forEach((link, idx) => {
    link.addEventListener('click', () => {
      setTimeout(() => setActiveSection(idx), 50);
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const idx = sectionIds.indexOf(id);
        if (idx !== -1) {
          setActiveSection(idx);
        }
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // Keyboard navigation
  let keyThrottle = false;
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('resumeModal');
    if (modal && modal.classList.contains('is-open')) return;

    if (e.key === 'PageDown' || (e.altKey && e.key === 'ArrowDown')) {
      e.preventDefault();
      if (!keyThrottle && currentSectionIndex < sections.length - 1) {
        keyThrottle = true;
        navigateToSection(currentSectionIndex + 1);
        setTimeout(() => { keyThrottle = false; }, 600);
      }
    } else if (e.key === 'PageUp' || (e.altKey && e.key === 'ArrowUp')) {
      e.preventDefault();
      if (!keyThrottle && currentSectionIndex > 0) {
        keyThrottle = true;
        navigateToSection(currentSectionIndex - 1);
        setTimeout(() => { keyThrottle = false; }, 600);
      }
    }
  });

  /* ---------------------------------------------------------------------------
   * 5. ATMOSPHERIC MINIMALIST CANVAS: SUBTLE GRID + SCENE-WARP PARTICLES
   *    - Responsive dot/cross grid reacting to mouse with subtle silver/cyan stroke
   *    - Depth-layered monochrome & electric sky motes
   *    - Scroll-Velocity Inertia: When jumping/scrolling between sections, particles
   *      streak vertically with lightspeed momentum, mimicking scene transitions
   *    - Mouse parallax depth drift
   * --------------------------------------------------------------------------- */
  const canvas = document.getElementById('bgCanvas');
  if (canvas && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    const spacing = 48;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    });

    // --- Minimalist Dust Particles ---
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 24 : 48;
    const dustParticles = [];

    class GridMote {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : (Math.random() > 0.5 ? -10 : height + 10);
        this.depth = 0.2 + Math.random() * 0.8; // 0.2 (far) to 1.0 (near)
        this.radius = (1.1 + Math.random() * 2.4) * this.depth;
        this.baseVx = (Math.random() - 0.5) * 0.35 * this.depth;
        this.baseVy = -(0.15 + Math.random() * 0.45) * this.depth;
        this.alpha = 0.18 + Math.random() * 0.50;
        this.isAccent = Math.random() > 0.75; // Electric sky accent vs pure slate/white
        this.pulseSpeed = 0.015 + Math.random() * 0.025;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(scrollVelocity) {
        this.pulseOffset += this.pulseSpeed;

        // Mouse Parallax drift
        const mouseParallaxX = (mouse.x - width / 2) * 0.015 * this.depth;

        // Position update influenced by natural drift and cinematic scroll velocity
        this.x += this.baseVx + mouseParallaxX * 0.05;
        this.y += this.baseVy - scrollVelocity * 0.65 * this.depth;

        // Wrap around viewport boundaries
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -40) this.y = height + 40;
        if (this.y > height + 40) this.y = -40;
      }

      draw(ctx, scrollVelocity) {
        const currentAlpha = Math.max(0.06, this.alpha * (0.8 + 0.2 * Math.sin(this.pulseOffset)));
        const color = this.isAccent
          ? `rgba(56, 189, 248, ${currentAlpha})`
          : `rgba(248, 250, 252, ${currentAlpha * 0.75})`;

        const absVel = Math.abs(scrollVelocity);

        if (absVel > 2.5) {
          // --- Cinematic Motion Streak (Warp Transition Effect) ---
          const streakLength = Math.min(32, absVel * 0.6 * this.depth);
          const dir = scrollVelocity > 0 ? -1 : 1;

          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = Math.max(1, this.radius * 0.8);
          ctx.lineCap = 'round';
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x, this.y + streakLength * dir);
          ctx.stroke();

          // Spark center
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, Math.max(0.8, this.radius * 0.4), 0, Math.PI * 2);
          ctx.fill();
        } else {
          // --- Calm Ambient Glowing Mote ---
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          // Soft specular highlight on close particles
          if (this.depth > 0.6) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.85})`;
            ctx.fill();
          }
        }
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      dustParticles.push(new GridMote());
    }

    // Scroll Velocity Tracking
    let lastScrollPos = window.scrollY;
    let scrollVelocity = 0;

    function renderAtmosphere() {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Scroll velocity inertia & decay
      const currentScrollPos = window.scrollY;
      const rawDelta = currentScrollPos - lastScrollPos;
      lastScrollPos = currentScrollPos;

      scrollVelocity += (rawDelta - scrollVelocity) * 0.28;
      scrollVelocity *= 0.90; // smooth exponential decay

      // 1. Draw Tactical Grid Dots & Crosses (Silver / Subtle Cyan)
      for (let x = spacing; x < width; x += spacing) {
        for (let y = spacing; y < height; y += spacing) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180;

          if (dist < maxDist) {
            const factor = 1 - dist / maxDist;
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 + factor * 0.35})`;
            ctx.lineWidth = 1;

            const arm = 3 + factor * 4.5;
            ctx.beginPath();
            ctx.moveTo(x - arm, y);
            ctx.lineTo(x + arm, y);
            ctx.moveTo(x, y - arm);
            ctx.lineTo(x, y + arm);
            ctx.stroke();
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
            ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
          }
        }
      }

      // 2. Draw Dust Particles with Scene Warp
      dustParticles.forEach(p => {
        p.update(scrollVelocity);
        p.draw(ctx, scrollVelocity);
      });

      requestAnimationFrame(renderAtmosphere);
    }

    requestAnimationFrame(renderAtmosphere);
  }

  /* ---------------------------------------------------------------------------
   * 6. CUSTOM PRECISION CURSOR
   * --------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mousePos = { x: -100, y: -100 };
    let ringPos = { x: -100, y: -100 };

    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      cursorDot.style.left = `${mousePos.x}px`;
      cursorDot.style.top = `${mousePos.y}px`;
    });

    function renderRing() {
      ringPos.x += (mousePos.x - ringPos.x) * 0.18;
      ringPos.y += (mousePos.y - ringPos.y) * 0.18;
      cursorRing.style.left = `${ringPos.x}px`;
      cursorRing.style.top = `${ringPos.y}px`;
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    const hoverables = document.querySelectorAll('a, button, .case-study-card, .contact-card, .focus-card, .spotify-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-active'));
    });
  }

  /* ---------------------------------------------------------------------------
   * 7. EMAIL COPY MICRO-INTERACTION
   * --------------------------------------------------------------------------- */
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const emailText = document.getElementById('emailText');
  const copyBtnText = document.getElementById('copyBtnText');

  if (btnCopyEmail && emailText && copyBtnText) {
    btnCopyEmail.addEventListener('click', async () => {
      const email = emailText.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyBtnText.textContent;
        copyBtnText.textContent = 'Tersalin!';
        btnCopyEmail.style.borderColor = 'var(--status-green)';
        btnCopyEmail.style.color = 'var(--status-green)';

        setTimeout(() => {
          copyBtnText.textContent = originalText;
          btnCopyEmail.style.borderColor = '';
          btnCopyEmail.style.color = '';
        }, 2200);
      } catch (err) {
        prompt('Silakan salin email ini:', email);
      }
    });
  }

  /* ---------------------------------------------------------------------------
   * 8. RESUME MODAL CONTROLLER
   * --------------------------------------------------------------------------- */
  const btnOpenResume = document.getElementById('btnOpenResume');
  const btnCloseResume = document.getElementById('btnCloseResume');
  const btnModalCloseSecondary = document.getElementById('btnModalCloseSecondary');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const resumeModal = document.getElementById('resumeModal');

  function openResume() {
    if (!resumeModal) return;
    resumeModal.classList.add('is-open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    if (!resumeModal) return;
    resumeModal.classList.remove('is-open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (btnOpenResume) btnOpenResume.addEventListener('click', openResume);
  if (btnCloseResume) btnCloseResume.addEventListener('click', closeResume);
  if (btnModalCloseSecondary) btnModalCloseSecondary.addEventListener('click', closeResume);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeResume);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('is-open')) {
      closeResume();
    }
  });

  /* ---------------------------------------------------------------------------
   * 9. SCROLL-TRIGGERED ENTRANCE ANIMATIONS (IntersectionObserver)
   *    - All elements with [data-anim] start invisible
   *    - When scrolled into view, .anim-visible is added
   *    - Hero section triggers after loading screen finishes
   * --------------------------------------------------------------------------- */
  const animElements = document.querySelectorAll('[data-anim]');

  // Hero elements (in #home) should animate after loading finishes, not on scroll
  const heroElements = document.querySelectorAll('#home [data-anim]');
  const nonHeroElements = Array.from(animElements).filter(el => !el.closest('#home'));

  // Trigger hero animations after loading screen completes
  const loadingDuration = 2400 + 300 + 100; // loading + hold + buffer
  setTimeout(() => {
    heroElements.forEach(el => {
      el.classList.add('anim-visible');
    });
  }, loadingDuration);

  // IntersectionObserver for non-hero sections
  if (nonHeroElements.length > 0) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-visible');
          scrollObserver.unobserve(entry.target); // Only animate once
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -12% 0px', // Trigger slightly before fully in view
      threshold: 0.15
    });

    nonHeroElements.forEach(el => scrollObserver.observe(el));
  }

  /* ---------------------------------------------------------------------------
   * 10. TACTILE 3D CARD TILT & DEPTH ENGINE (DESKTOP)
   *     - Smooth spring-dampened 3D tilt for Project Cards & Spotify Card
   *     - Subtle Parallax depth floating for spotlight and focus cards
   * --------------------------------------------------------------------------- */
  const tiltCards = document.querySelectorAll('.case-study-card, .spotify-card');

  if (window.matchMedia('(pointer: fine)').matches) {
    tiltCards.forEach(card => {
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let isHovered = false;
      let tiltRaf = null;

      function updateTilt() {
        currentRotX += (targetRotX - currentRotX) * 0.12;
        currentRotY += (targetRotY - currentRotY) * 0.12;

        const activeZ = isHovered ? 12 : 0;
        card.style.transform = `perspective(1200px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateZ(${activeZ}px)`;

        const dist = Math.abs(targetRotX - currentRotX) + Math.abs(targetRotY - currentRotY);
        if (isHovered || dist > 0.05) {
          tiltRaf = requestAnimationFrame(updateTilt);
        } else {
          card.style.transform = '';
          tiltRaf = null;
        }
      }

      card.addEventListener('mouseenter', () => {
        isHovered = true;
        if (!tiltRaf) tiltRaf = requestAnimationFrame(updateTilt);
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const normY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

        const maxAngle = card.classList.contains('spotify-card') ? 7 : 5;
        targetRotX = -normY * maxAngle;
        targetRotY = normX * maxAngle;

        if (!tiltRaf) tiltRaf = requestAnimationFrame(updateTilt);
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        if (!tiltRaf) tiltRaf = requestAnimationFrame(updateTilt);
      });
    });
  }

  // Subtle Parallax float on remaining elements
  const parallaxElements = document.querySelectorAll('.about-spotlight-container, .focus-card');
  let ticking = false;

  function updateParallax() {
    const viewH = window.innerHeight;
    parallaxElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewH && rect.bottom > 0) {
        const centerOffset = (rect.top + rect.height / 2 - viewH / 2) / viewH;
        const yShift = centerOffset * 8;
        el.style.transform = `translateY(${yShift.toFixed(1)}px)`;
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }, { passive: true });

});
