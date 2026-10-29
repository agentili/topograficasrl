/* ==========================================================================
   Topografica — Prototype 2: Campo di rilievo / Cantiere
   Interactions: Live coordinate simulation, project expansion, scroll reveal
   ========================================================================== */

// ==========================================================================
// Live Coordinate Simulation (Instrument Display)
// ==========================================================================

class InstrumentDisplay {
  constructor() {
    this.ptEl = document.getElementById('disp-pt');
    this.eEl = document.getElementById('disp-e');
    this.nEl = document.getElementById('disp-n');
    this.hEl = document.getElementById('disp-h');

    this.baseCoords = {
      pt: 1042,
      e: 1642312.45,
      n: 4837215.89,
      h: 62.34
    };

    this.points = [
      { pt: 1042, e: 1642312.45, n: 4837215.89, h: 62.34 },
      { pt: 1043, e: 1642358.12, n: 4837241.67, h: 61.89 },
      { pt: 1044, e: 1642298.76, n: 4837189.23, h: 63.12 },
      { pt: 1045, e: 1642412.89, n: 4837287.45, h: 60.78 },
      { pt: 1046, e: 1642267.34, n: 4837156.78, h: 64.01 }
    ];

    this.currentIndex = 0;
    this.interval = null;
    this.isAnimating = false;

    this.init();
  }

  init() {
    this.startAnimation();
    this.addInteraction();
  }

  startAnimation() {
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.points.length;
      this.updateDisplay(this.points[this.currentIndex], true);
    }, 3500);
  }

  stopAnimation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  updateDisplay(coords, animate = false) {
    const duration = animate ? 800 : 0;

    if (animate) {
      this.animateValue(this.ptEl, coords.pt, duration, true);
      this.animateValue(this.eEl, coords.e, duration, false, 2);
      this.animateValue(this.nEl, coords.n, duration, false, 2);
      this.animateValue(this.hEl, coords.h, duration, false, 2);
    } else {
      this.ptEl.textContent = coords.pt;
      this.eEl.textContent = coords.e.toFixed(2);
      this.nEl.textContent = coords.n.toFixed(2);
      this.hEl.textContent = coords.h.toFixed(2);
    }
  }

  animateValue(el, target, duration, isInteger, decimals = 0) {
    const start = parseFloat(el.textContent.replace(',', '')) || 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      const current = start + (target - start) * eased;
      el.textContent = isInteger ? Math.round(current) : current.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  addInteraction() {
    const display = document.querySelector('.instrument-display');
    if (!display) return;

    display.addEventListener('mouseenter', () => this.stopAnimation());
    display.addEventListener('mouseleave', () => this.startAnimation());

    display.addEventListener('click', () => {
      this.currentIndex = (this.currentIndex + 1) % this.points.length;
      this.updateDisplay(this.points[this.currentIndex], true);
    });

    // Keyboard support
    display.setAttribute('tabindex', '0');
    display.setAttribute('role', 'button');
    display.setAttribute('aria-label', 'Display stazione totale Leica TSA15 - clicca per cambiare punto');
    display.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.currentIndex = (this.currentIndex + 1) % this.points.length;
        this.updateDisplay(this.points[this.currentIndex], true);
      }
    });
  }
}

// ==========================================================================
// Project Expansion
// ==========================================================================

function initProjectExpansion() {
  document.querySelectorAll('.project-expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const detailsId = btn.getAttribute('aria-controls');
      const details = document.getElementById(detailsId);
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', !isExpanded);
      details.hidden = isExpanded;
      btn.textContent = isExpanded ? 'Dettagli' : 'Chiudi';
    });
  });
}

// ==========================================================================
// Smooth Scroll for Anchor Links
// ==========================================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 72;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        target.focus({ preventScroll: true });
      }
    });
  });
}

// ==========================================================================
// Scroll Reveal Animation
// ==========================================================================

function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('section:not(.hero)').forEach(s => s.style.opacity = '1');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('section:not(.hero)').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
  });
}

// ==========================================================================
// Entry Hover Effects (Field Book)
// ==========================================================================

function initEntryHover() {
  document.querySelectorAll('.field-entry').forEach(entry => {
    entry.addEventListener('mouseenter', () => {
      entry.style.borderLeft = '4px solid var(--color-instrument-orange)';
    });
    entry.addEventListener('mouseleave', () => {
      entry.style.borderLeft = 'none';
    });
  });
}

// ==========================================================================
// Project Ref Navigation
// ==========================================================================

function initProjectRefs() {
  document.querySelectorAll('.project-ref').forEach(ref => {
    ref.addEventListener('click', (e) => {
      const href = ref.getAttribute('href');
      if (!href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (target) {
        // Expand the project if collapsed
        const expandBtn = target.querySelector('.project-expand');
        if (expandBtn && expandBtn.getAttribute('aria-expanded') === 'false') {
          expandBtn.click();
        }

        // Highlight briefly
        target.style.outline = '2px solid var(--color-instrument-orange)';
        target.style.outlineOffset = '4px';
        setTimeout(() => {
          target.style.outline = 'none';
          target.style.outlineOffset = '0';
        }, 1500);
      }
    });
  });
}

// ==========================================================================
// Main Initialization
// ==========================================================================

function init() {
  // Initialize instrument display
  try { new InstrumentDisplay(); } catch (err) { console.error('InstrumentDisplay init failed:', err); }

  // Initialize interactions
  try { initProjectExpansion(); } catch (err) { console.error('Project expansion init failed:', err); }
  try { initSmoothScroll(); } catch (err) { console.error('Smooth scroll init failed:', err); }
  try { initScrollReveal(); } catch (err) { console.error('Scroll reveal init failed:', err); }
  try { initEntryHover(); } catch (err) { console.error('Entry hover init failed:', err); }
  try { initProjectRefs(); } catch (err) { console.error('Project refs init failed:', err); }
}

// Start when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}