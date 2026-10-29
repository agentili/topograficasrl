/* ==========================================================================
   Topografica — Prototype 5: Cantiere Vivo / Site Survey
   Interactions: Live coordinate simulation, field book entries, project cards,
   drawer panel, scroll reveal, dust particles
   ========================================================================== */

// ==========================================================================
// Live Coordinate Simulation (Instrument Display)
// ==========================================================================

class InstrumentDisplay {
  constructor() {
    this.elements = {
      pt: document.getElementById('disp-pt'),
      hz: document.getElementById('disp-hz'),
      v: document.getElementById('disp-v'),
      sd: document.getElementById('disp-sd'),
      e: document.getElementById('disp-e'),
      n: document.getElementById('disp-n'),
      h: document.getElementById('disp-h'),
      status: document.getElementById('display-status')
    };

    this.points = [
      { pt: 1042, hz: '124°32\'15"', v: '87°45\'30"', sd: 142.356, e: 1642312.45, n: 4837215.89, h: 62.340, status: '● TRACKING', statusColor: 'var(--color-signal-green)' },
      { pt: 1043, hz: '125°18\'42"', v: '88°12\'10"', sd: 158.742, e: 1642358.12, n: 4837241.67, h: 61.890, status: '● TRACKING', statusColor: 'var(--color-signal-green)' },
      { pt: 1044, hz: '126°05\'08"', v: '86°59\'45"', sd: 133.219, e: 1642298.76, n: 4837189.23, h: 63.120, status: '○ LOCKED', statusColor: 'var(--color-text-dim)' },
      { pt: 1045, hz: '127°33\'21"', v: '89°01\'55"', sd: 167.451, e: 1642412.89, n: 4837287.45, h: 60.780, status: '● TRACKING', statusColor: 'var(--color-signal-green)' },
      { pt: 1046, hz: '128°10\'37"', v: '87°22\'30"', sd: 129.874, e: 1642267.34, n: 4837156.78, h: 64.010, status: '○ LOCKED', statusColor: 'var(--color-text-dim)' }
    ];

    this.currentIndex = 0;
    this.interval = null;
    this.isAnimating = false;
    this.interactionPaused = false;

    this.init();
  }

  init() {
    this.updateDisplay(this.points[this.currentIndex]);
    this.startAnimation();
    this.addInteraction();
  }

  startAnimation() {
    this.stopAnimation();
    this.interval = setInterval(() => {
      if (this.interactionPaused) return;
      this.currentIndex = (this.currentIndex + 1) % this.points.length;
      this.updateDisplay(this.points[this.currentIndex], true);
    }, 4000);
  }

  stopAnimation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  updateDisplay(coords, animate = false) {
    const duration = animate ? 600 : 0;

    if (animate) {
      this.animateValue(this.elements.pt, coords.pt, duration, true);
      this.animateValue(this.elements.hz, coords.hz, duration, false);
      this.animateValue(this.elements.v, coords.v, duration, false);
      this.animateValue(this.elements.sd, coords.sd, duration, false, 3);
      this.animateValue(this.elements.e, coords.e, duration, false, 2);
      this.animateValue(this.elements.n, coords.n, duration, false, 2);
      this.animateValue(this.elements.h, coords.h, duration, false, 3);
    } else {
      this.elements.pt.textContent = coords.pt;
      this.elements.hz.textContent = coords.hz;
      this.elements.v.textContent = coords.v;
      this.elements.sd.textContent = coords.sd.toFixed(3);
      this.elements.e.textContent = coords.e.toFixed(2);
      this.elements.n.textContent = coords.n.toFixed(2);
      this.elements.h.textContent = coords.h.toFixed(3);
    }

    if (coords.status) {
      this.elements.status.textContent = coords.status;
      this.elements.status.style.color = coords.statusColor;
    }
  }

  animateValue(el, target, duration, isInteger, decimals = 0) {
    const startStr = el.textContent.replace(/[^\d.-]/g, '');
    const start = parseFloat(startStr) || 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = start + (target - start) * eased;
      if (isInteger) {
        el.textContent = Math.round(current);
      } else if (decimals > 0 && el === this.elements.sd || el === this.elements.e || el === this.elements.n || el === this.elements.h) {
        el.textContent = current.toFixed(decimals);
      } else if (el === this.elements.hz || el === this.elements.v) {
        el.textContent = target;
      } else {
        el.textContent = current.toFixed(decimals);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  addInteraction() {
    const display = document.getElementById('instrument-display');
    if (!display) return;

    display.addEventListener('mouseenter', () => {
      this.interactionPaused = true;
      this.stopAnimation();
    });
    display.addEventListener('mouseleave', () => {
      this.interactionPaused = false;
      this.startAnimation();
    });

    display.addEventListener('click', () => {
      if (this.interactionPaused) {
        this.currentIndex = (this.currentIndex + 1) % this.points.length;
        this.updateDisplay(this.points[this.currentIndex], true);
      }
    });

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

    // Dust interaction - mouse influence
    window.addEventListener('mousemove', (e) => {
      if (window.dustParticles) {
        window.dustParticles.setMouse(e.clientX, e.clientY);
      }
    });
  }
}

// ==========================================================================
// Dust Particles Canvas
// ==========================================================================

class DustParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000 };
    this.width = 0;
    this.height = 0;
    this.animationId = null;
    this.init();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  init() {
    const count = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      life: Math.random() * 100 + 50,
      age: 0
    };
  }

  setMouse(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Mouse repulsion
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        p.vx += (dx / dist) * force * 0.05;
        p.vy += (dy / dist) * force * 0.05;
      }

      // Friction
      p.vx *= 0.96;
      p.vy *= 0.96;

      // Bounds
      if (p.x < 0) { p.x = this.width; p.vx = Math.abs(p.vx); }
      if (p.x > this.width) { p.x = 0; p.vx = -Math.abs(p.vx); }
      if (p.y < 0) { p.y = this.height; p.vy = Math.abs(p.vy); }
      if (p.y > this.height) { p.y = 0; p.vy = -Math.abs(p.vy); }

      // Drift downward slowly
      p.y += 0.15;

      // Draw
      this.ctx.fillStyle = `rgba(255, 107, 53, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Respawn if too old
      p.age++;
      if (p.age > p.life) {
        Object.assign(p, this.createParticle());
        p.x = Math.random() * this.width;
        p.y = this.height + 10;
        p.age = 0;
      }
    });
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

// ==========================================================================
// Field Book Entries
// ==========================================================================

const FIELD_ENTRIES = [
  {
    code: 'TP-01',
    name: 'Topografia e Catasto',
    desc: 'Rilievi planimetrici, planoaltimetrici, catastali; livellazioni alta precisione (stadie normali e Invar); rilevazioni subalveo; controllo confini; elaborazione tempo reale.',
    tools: 'Stazioni totali Leica TSA15, TCA2003; GNSS multi-costellazione; livelli precisione',
    deliverables: 'DWG/DXF, XML Catasto, Excel, relazioni tecniche',
    projects: ['careggi', 'nuove-acque', 'riconfinamenti']
  },
  {
    code: 'MN-02',
    name: 'Monitoraggio Discariche, Cave e Dighe',
    desc: 'Stazioni totali motorizzate (Leica TSA15, TCA2003) con telemetria GSM; cicli periodici, giornalieri o continui; marker su capisaldi fissi; grafici spostamenti e velocità.',
    tools: 'Stazioni totali motorizzate Leica, sistema GSM, pilastrini CLS, marker precisione',
    deliverables: 'File AutoCAD, Excel, grafici spostamento, report velocità',
    projects: ['careggi', 'frascari']
  },
  {
    code: 'SS-03',
    name: 'Rilievo Sottoservizi – Ispezione Ipogea',
    desc: 'Reti fognarie/acquedotto: rilievo superficiale + prospezioni ipogee/subacquee; georeferenziazione IGM; precisione sub-centimetrica; 35 km area fiorentina, 27 km 3ª cerchia Pistoia.',
    tools: 'Attrezzatura radiocomandata, TPS/GPS/Livello integrati, georeferenziazione IGM',
    deliverables: 'Banche dati reti, DWG, GIS',
    projects: ['ex-breda', 'agip']
  },
  {
    code: 'AR-04',
    name: 'Rilievi Architettonici di Fabbricati',
    desc: 'Stazione totale 3D + fotogrammetria referenziata; laser scanner via partner per nuvole dense; modelli 3D interrogabili (x,y,z per punto); piante, prospetti, sezioni, rendering.',
    tools: 'Stazione totale 3D, fotogrammetria, laser scanner (partner), software nuvole punti',
    deliverables: 'Nuvole punti (.las/.e57), modelli 3D, DWG piante/prospetti/sezioni, rendering',
    projects: ['legnorosso', 'frascari']
  },
  {
    code: 'CT-05',
    name: 'Assistenza e Sicurezza Cantieri',
    desc: 'Tracciamenti viabilità, aggiornamento plano-altimetrici, quote "rosse" da rilievo "nero"; redazione POS e piani sicurezza D.Lgs 81/08; supporto L. 818/84 prevenzione incendi.',
    tools: 'Soci abilitati D.Lgs 81/08, redazione POS, piani intervento sicurezza',
    deliverables: 'POS, piani sicurezza, elaborati antincendio, tracciamenti esecutivi',
    projects: ['ss66', 'sr66']
  }
];

const PROJECT_PAGES = [
  {
    key: 'careggi',
    title: 'Manutenzione straordinaria Pad. Maternità — Osp. Careggi',
    category: 'Edilizia · Firenze',
    client: 'Azienda Ospedaliero-Universitaria Careggi',
    services: 'Topografia cantiere, tracciamenti, quote rosse/nerie',
    tools: 'Stazione totale, GPS, livellazione precisione',
    detail: 'Rilievi topografici per posizionamento fabbricati e viabilità interna; calcolo e rappresentazione quote "rosse" derivate da rilievo "nero"; aggiornamento continuo piante, profili, sezioni durante avanzamento lavori.'
  },
  {
    key: 'ex-breda',
    title: 'Rilievo Area "Ex-Breda"',
    category: 'Infrastrutture · Pistoia',
    client: 'Giusti per l\'Edilizia S.p.A.',
    services: 'Rilievo topografico area industriale dismessa, riconfinamenti, catasto',
    tools: 'Stazione totale, GPS, laser scanner (partner)',
    detail: 'Rilievo integrato stazione totale + laser scanner per modellazione 3D area ex industriale; supporto a pianificazione riconversione urbanistica; georeferenziazione IGM.'
  },
  {
    key: 'ss66',
    title: 'Tracciamento Variante SS.66',
    category: 'Infrastrutture · Pistoia',
    client: 'Provincia di Pistoia',
    services: 'Tracciamento variante stradale, aggiornamento planimetrie/profili/sezioni',
    tools: 'Stazione totale motorizzata, GPS, livellazione',
    detail: 'Tracciamento esecutivo nuova viabilità; fornitura quote rosse per controllo getti; aggiornamento continuo elaborati per direzione lavori; coordinamento con impresa esecutrice.'
  },
  {
    key: 'legnorosso',
    title: 'Ristrutturazione Impianto "Legnorosso"',
    category: 'Edilizia · Pistoia',
    client: 'CONI Comitato Provinciale Pistoia',
    services: 'Rilievo architettonico esistente, tracciamento nuovo impianto, assistenza cantiere',
    tools: 'Stazione totale 3D, fotogrammetria, GPS',
    detail: 'Rilievo architettonico impianto sportivo esistente (piante, prospetti, sezioni); tracciamento nuova struttura; assistenza topografica continua durante lavori; redazione POS sicurezza.'
  },
  {
    key: 'frascari',
    title: 'Ristrutturazione Impianto "Frascari"',
    category: 'Edilizia · Pistoia',
    client: 'Provincia di Pistoia',
    services: 'Rilievo architettonico, tracciamento, monitoraggio strutturale',
    tools: 'Stazione totale, livellazione precisione, GPS',
    detail: 'Rilievo completo impianto sportivo; monitoraggio deformazioni strutturali durante ristrutturazione; livellazioni alta precisione per controllo cedimenti; georeferenziazione catastale.'
  },
  {
    key: 'agip',
    title: 'Aggiornamenti Catastali Oleodotto Gaeta-Pomezia',
    category: 'Catasto · Lazio',
    client: 'Agip Petroli S.p.A.',
    services: 'Aggiornamenti catastali tracciato oleodotto, servitù, espropri',
    tools: 'GPS, stazione totale, software catasto',
    detail: 'Aggiornamento mappali catastali per tracciato oleodotto Gaeta-Pomezia; rilevazione servitù ed espropri; redazione tipi di frazionamento e mappe di aggiornamento per Agenzia delle Entrate.'
  }
];

const CREW = [
  {
    initials: 'GG',
    name: 'Giampiero Gori',
    role: 'Caposquadra — Topografo senior',
    focus: 'Rilievi catasto, infrastrutture, direzione tecnica',
    skills: ['Catasto', 'Infrastrutture', 'Direzione']
  },
  {
    initials: 'AL',
    name: 'Alberto Lucarelli',
    role: 'Socio — Topografo senior',
    focus: 'Monitoraggi, sottoservizi, laser scanner, sicurezza cantieri',
    skills: ['Monitoraggio', 'Sottoservizi', 'Sicurezza']
  },
  {
    initials: 'MB',
    name: 'Marco Biagini',
    role: 'Socio — Topografo senior',
    focus: 'Rilievi architettonici, fotogrammetria, 3D modeling',
    skills: ['Architettonico', 'Fotogrammetria', '3D Modeling']
  }
];

function populateFieldBook() {
  const container = document.getElementById('field-book');
  if (!container) return;

  FIELD_ENTRIES.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'field-entry';
    div.dataset.entry = entry.code;

    div.innerHTML = `
      <div class="entry-header">
        <span class="entry-code">${entry.code}</span>
        <h4 class="entry-name">${entry.name}</h4>
        <span class="entry-expand" aria-hidden="true">▼</span>
      </div>
      <div class="entry-body">
        <p class="entry-desc">${entry.desc}</p>
        <div class="entry-specs">
          <div class="specs-grid">
            <div><dt>Strumentazione</dt><dd>${entry.tools}</dd></div>
            <div><dt>Restituzioni</dt><dd>${entry.deliverables}</dd></div>
          </div>
        </div>
        <div class="entry-projects">
          <span class="projects-label">Progetti:</span>
          ${entry.projects.map(p => `<span class="project-ref">${p}</span>`).join('')}
        </div>
      </div>
    `;

    const header = div.querySelector('.entry-header');
    const body = div.querySelector('.entry-body');
    const expand = div.querySelector('.entry-expand');

    header.addEventListener('click', () => {
      const isOpen = div.classList.contains('open');
      div.classList.toggle('open');
      expand.textContent = isOpen ? '▼' : '▲';
      div.setAttribute('aria-expanded', !isOpen);
    });

    container.appendChild(div);
  });
}

function populateFieldPages() {
  const container = document.getElementById('field-pages');
  if (!container) return;

  PROJECT_PAGES.forEach(project => {
    const article = document.createElement('article');
    article.className = 'field-page';

    article.innerHTML = `
      <header class="page-header">
        <div class="page-sketch" role="img" aria-label="Schizzo quotato ${project.title}"></div>
        <div class="page-overlay"></div>
        <span class="page-category">${project.category}</span>
      </header>
      <div class="page-body">
        <h3 class="page-title">${project.title}</h3>
        <dl class="page-meta">
          <div><dt>Committente</dt><dd>${project.client}</dd></div>
          <div><dt>Servizi</dt><dd>${project.services}</dd></div>
          <div><dt>Strumentazione</dt><dd>${project.tools}</dd></div>
        </dl>
        <p class="page-detail">${project.detail}</p>
      </div>
    `;

    container.appendChild(article);
  });
}

function populateCrew() {
  const container = document.getElementById('crew-grid');
  if (!container) return;

  CREW.forEach(member => {
    const div = document.createElement('div');
    div.className = 'crew-member';

    div.innerHTML = `
      <span class="member-badge">Nodo Fondante</span>
      <div class="member-photo" aria-label="${member.name}">${member.initials}</div>
      <h3 class="member-name">${member.name}</h3>
      <p class="member-role">${member.role}</p>
      <p class="member-focus">${member.focus}</p>
      <div class="member-skills">
        ${member.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    `;

    container.appendChild(div);
  });
}

// ==========================================================================
// Scroll Reveal
// ==========================================================================

function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('[data-scroll-reveal]').forEach(s => {
      s.style.opacity = '1';
      s.style.transform = 'translateY(0)';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

  document.querySelectorAll('[data-scroll-reveal]').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = 'opacity 0.8s var(--ease-out), transform 0.8s var(--ease-out)';
    observer.observe(section);
  });
}

// ==========================================================================
// Header Scroll State
// ==========================================================================

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ==========================================================================
// Smooth Scroll
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
// Main Initialization
// ==========================================================================

let instrumentDisplay = null;
let dustParticles = null;

function safeInit(fn, label) {
  try {
    fn();
  } catch (err) {
    console.error(`Init error in ${label}:`, err);
  }
}

function init() {
  safeInit(() => { instrumentDisplay = new InstrumentDisplay(); }, 'InstrumentDisplay');
  safeInit(() => { dustParticles = new DustParticles(document.getElementById('dust-canvas')); }, 'DustParticles');
  safeInit(populateFieldBook, 'populateFieldBook');
  safeInit(populateFieldPages, 'populateFieldPages');
  safeInit(populateCrew, 'populateCrew');
  safeInit(initScrollReveal, 'initScrollReveal');
  safeInit(initHeaderScroll, 'initHeaderScroll');
  safeInit(initSmoothScroll, 'initSmoothScroll');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('beforeunload', () => {
  if (instrumentDisplay) instrumentDisplay.stopAnimation();
  if (dustParticles) dustParticles.destroy();
});