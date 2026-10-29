/* ==========================================================================
   Topografica — Prototype 6: Sezioni Topografiche
   Interactions: Contour canvas background, elevation SVG draw-on-scroll,
   scroll reveal, data population
   ========================================================================== */

// ==========================================================================
// Data
// ==========================================================================

const SERVICE_DATA = [
  {
    key: 'catasto',
    name: 'Topografia e Catasto',
    desc: 'Rilievi planimetrici, planoaltimetrici, catastali; livellazioni alta precisione (stadie normali e Invar); rilevazioni subalveo; controllo confini.',
    tools: 'Stazioni totali Leica (TSA15, TCA2003), GNSS multi-costellazione, livelli precisione',
    deliverables: 'DWG/DXF, XML Catasto, Excel, relazioni tecniche'
  },
  {
    key: 'monitoraggio',
    name: 'Monitoraggio Discariche, Cave e Dighe',
    desc: 'Stazioni totali motorizzate (Leica TSA15, TCA2003) con telemetria GSM; cicli periodici, giornalieri o continui; grafici spostamenti e velocità.',
    tools: 'Stazioni totali motorizzate Leica, sistema comunicazione GSM, pilastrini CLS, marker precisione',
    deliverables: 'File AutoCAD, Excel, grafici spostamento, report velocità'
  },
  {
    key: 'sottoservizi',
    name: 'Rilievo Sottoservizi – Ispezione Ipogea',
    desc: 'Reti fognarie e acquedotto: rilievo superficiale + prospezioni ipogee/subacquee; georeferenziazione IGM; precisione sub-centimetrica.',
    tools: 'Attrezzatura radiocomandata, TPS/GPS/Livello integrati, georeferenziazione IGM',
    deliverables: 'Banche dati reti, DWG, GIS'
  },
  {
    key: 'architettonico',
    name: 'Rilievi Architettonici di Fabbricati',
    desc: 'Stazione totale 3D + fotogrammetria referenziata; laser scanner via partner; modelli 3D realistici interrogabili (x,y,z per punto).',
    tools: 'Stazione totale 3D, fotogrammetria, laser scanner (partner), software nuvole punti',
    deliverables: 'Nuvole punti (.las/.e57), modelli 3D, DWG piante/prospetti/sezioni, rendering'
  },
  {
    key: 'cantieri',
    name: 'Assistenza e Sicurezza Cantieri',
    desc: 'Tracciamenti viabilità, aggiornamento plano-altimetrici, quote "rosse" da rilievo "nero"; redazione POS e piani sicurezza D.Lgs 81/08.',
    tools: 'Soci abilitati D.Lgs 81/08, redazione POS, piani intervento sicurezza',
    deliverables: 'POS, piani sicurezza, elaborati antincendio, tracciamenti esecutivi'
  }
];

const PROFILE_DATA = [
  {
    name: 'Careggi — Pad. Maternità',
    category: 'Edilizia',
    client: 'AOU Careggi, Firenze',
    services: 'Topografia cantiere, quote rosse/nerie',
    elevation: '62.34 m → 58.14 m',
    gradient: '2.8%'
  },
  {
    name: 'Ex-Breda — Area Industriale',
    category: 'Infrastrutture',
    client: 'Giusti per l\'Edilizia, Pistoia',
    services: 'Rilievo topografico, riconfinamenti',
    elevation: '45.20 m → 41.80 m',
    gradient: '3.4%'
  },
  {
    name: 'SS.66 — Variante',
    category: 'Infrastrutture',
    client: 'Provincia di Pistoia',
    services: 'Tracciamento stradale, planimetrie',
    elevation: '52.10 m → 48.90 m',
    gradient: '2.1%'
  },
  {
    name: 'Legnorosso — Impianto Sportivo',
    category: 'Edilizia',
    client: 'CONI Pistoia',
    services: 'Rilievo architettonico, tracciamento',
    elevation: '38.75 m → 36.20 m',
    gradient: '1.9%'
  },
  {
    name: 'SR.66 — Variante Pistoia',
    category: 'Infrastrutture',
    client: 'Provincia di Pistoia',
    services: 'Tracciamento, assistenza cantiere',
    elevation: '54.30 m → 50.10 m',
    gradient: '2.6%'
  }
];

const PROJECT_DATA = [
  {
    key: 'careggi',
    title: 'Manutenzione straordinaria Pad. Maternità — Osp. Careggi',
    category: 'Edilizia · Firenze',
    client: 'Azienda Ospedaliero-Universitaria Careggi',
    services: 'Topografia cantiere, tracciamenti, quote rosse/nerie',
    tools: 'Stazione totale, GPS, livellazione precisione',
    detail: 'Rilievi topografici per posizionamento fabbricati e viabilità interna; calcolo e rappresentazione quote "rosse" derivate da rilievo "nero"; aggiornamento continuo piante, profili, sezioni.'
  },
  {
    key: 'ex-breda',
    title: 'Rilievo Area "Ex-Breda"',
    category: 'Infrastrutture · Pistoia',
    client: 'Giusti per l\'Edilizia S.p.A.',
    services: 'Rilievo topografico area industriale dismessa, riconfinamenti, catasto',
    tools: 'Stazione totale, GPS, laser scanner (partner)',
    detail: 'Rilievo integrato stazione totale + laser scanner per modellazione 3D area ex industriale; georeferenziazione IGM.'
  },
  {
    key: 'ss66',
    title: 'Tracciamento Variante SS.66',
    category: 'Infrastrutture · Pistoia',
    client: 'Provincia di Pistoia',
    services: 'Tracciamento variante stradale, aggiornamento planimetrie/profili/sezioni',
    tools: 'Stazione totale motorizzata, GPS, livellazione',
    detail: 'Tracciamento esecutivo nuova viabilità; fornitura quote rosse per controllo getti; aggiornamento continuo elaborati per direzione lavori.'
  }
];

const CREW_DATA = [
  {
    initials: 'GG',
    name: 'Giampiero Gori',
    role: 'Socio / Topografo senior',
    focus: 'Rilievi catasto, infrastrutture, direzione tecnica',
    skills: ['Catasto', 'Infrastrutture', 'Direzione']
  },
  {
    initials: 'AL',
    name: 'Alberto Lucarelli',
    role: 'Socio / Topografo senior',
    focus: 'Monitoraggi, sottoservizi, laser scanner, sicurezza cantieri',
    skills: ['Monitoraggio', 'Sottoservizi', 'Sicurezza']
  },
  {
    initials: 'MB',
    name: 'Marco Biagini',
    role: 'Socio / Topografo senior',
    focus: 'Rilievi architettonici, fotogrammetria, 3D modeling',
    skills: ['Architettonico', 'Fotogrammetria', '3D Modeling']
  }
];

// ==========================================================================
// Contour Canvas Background
// ==========================================================================

class ContourCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.contours = [];
    this.animationId = null;
    this.scrollProgress = 0;
    this.init();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('scroll', () => this.updateScroll());
    this.animate();
  }

  init() {
    // Generate contour lines - horizontal waves at different elevations
    const colors = [
      'rgba(0, 212, 170, 0.15)',
      'rgba(0, 153, 255, 0.12)',
      'rgba(184, 122, 255, 0.10)',
      'rgba(232, 93, 26, 0.12)'
    ];

    for (let i = 0; i < 6; i++) {
      this.contours.push({
        y: (i / 5) * 100, // percentage height
        color: colors[i % colors.length],
        amplitude: 40 + i * 15,
        frequency: 0.002 + i * 0.0005,
        phase: i * 0.5,
        drawProgress: 0,
        lineWidth: 1 + i * 0.3
      });
    }
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

  updateScroll() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.width, this.height);

    const time = Date.now() * 0.001;

    this.contours.forEach((contour, i) => {
      const y = (contour.y / 100) * this.height;
      const drawEnd = Math.min(this.scrollProgress * 1.2 - i * 0.15, 1);

      if (drawEnd <= 0) return;

      this.ctx.beginPath();
      this.ctx.strokeStyle = contour.color;
      this.ctx.lineWidth = contour.lineWidth;
      this.ctx.lineCap = 'round';

      const points = 100;
      let started = false;

      for (let p = 0; p <= points; p++) {
        const x = (p / points) * this.width;
        if (x / this.width > drawEnd) break;

        const wave = Math.sin(x * contour.frequency + time * 0.5 + contour.phase) * contour.amplitude;
        const yy = y + wave;

        if (!started) {
          this.ctx.moveTo(x, yy);
          started = true;
        } else {
          this.ctx.lineTo(x, yy);
        }
      }

      this.ctx.stroke();

      // Draw small contour markers (elevation ticks)
      if (drawEnd > 0.3) {
        this.ctx.fillStyle = contour.color;
        for (let p = 0; p <= points; p += 10) {
          const x = (p / points) * this.width;
          if (x / this.width > drawEnd) break;
          const wave = Math.sin(x * contour.frequency + time * 0.5 + contour.phase) * contour.amplitude;
          const yy = y + wave;
          this.ctx.fillRect(x - 1.5, yy - 1.5, 3, 3);
        }
      }
    });
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

// ==========================================================================
// Elevation SVG Draw-on-Scroll
// ==========================================================================

class ElevationSVG {
  constructor(svg) {
    this.svg = svg;
    this.paths = [];
    this.init();
    window.addEventListener('scroll', () => this.updateScroll());
    this.animate();
  }

  init() {
    // Generate a terrain profile with multiple segments
    const width = 1200;
    const height = 400;
    const baseY = 300;

    // Create the main terrain line
    const points = [];
    const segments = 40;
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      // Generate terrain with some structure
      const noise = Math.sin(i * 0.5) * 15 + Math.sin(i * 2.3) * 8 + Math.sin(i * 0.1) * 25;
      const y = baseY - noise;
      points.push({ x, y });
    }

    // Create path data
    let pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i].x} ${points[i].y}`;
    }

    // Main terrain path
    const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mainPath.setAttribute('d', pathData);
    mainPath.setAttribute('fill', 'none');
    mainPath.setAttribute('stroke', '#00d4aa');
    mainPath.setAttribute('stroke-width', '2');
    mainPath.setAttribute('stroke-dasharray', pathData.length);
    mainPath.setAttribute('stroke-dashoffset', pathData.length);
    this.svg.appendChild(mainPath);
    this.paths.push({ element: mainPath, totalLength: pathData.length });

    // Fill area under terrain
    const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const fillData = `M ${points[0].x} ${baseY} L ${points[0].x} ${points[0].y} ${pathData} L ${points[points.length-1].x} ${baseY} Z`;
    fillPath.setAttribute('d', fillData);
    fillPath.setAttribute('fill', 'rgba(0, 212, 170, 0.1)');
    fillPath.setAttribute('stroke', 'none');
    this.svg.appendChild(fillPath);

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const gy = (i / 4) * height;
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('x1', '0');
      gridLine.setAttribute('y1', gy);
      gridLine.setAttribute('x2', width);
      gridLine.setAttribute('y2', gy);
      gridLine.setAttribute('stroke', 'rgba(255, 255, 255, 0.05)');
      gridLine.setAttribute('stroke-width', '0.5');
      this.svg.appendChild(gridLine);
    }

    // Contour labels
    const labels = ['65', '60', '55', '50'];
    labels.forEach((label, i) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '10');
      text.setAttribute('y', (i / 3) * height + 20);
      text.setAttribute('font-family', 'Space Mono, monospace');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', 'rgba(255, 255, 255, 0.3)');
      text.textContent = label;
      this.svg.appendChild(text);
    });
  }

  updateScroll() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

    this.paths.forEach((path, i) => {
      const drawEnd = Math.min(progress * 1.5 - i * 0.2, 1);
      const offset = path.totalLength * (1 - drawEnd);
      path.element.setAttribute('stroke-dashoffset', Math.max(0, offset));
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
  }

  destroy() {}
}

// ==========================================================================
// Populate Services Grid
// ==========================================================================

function populateServicesGrid() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  SERVICE_DATA.forEach(service => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.service = service.key;

    card.innerHTML = `
      <dt class="service-name">${service.name}</dt>
      <dd class="service-desc">${service.desc}</dd>
      <div class="service-tools"><strong>Strumentazione:</strong> ${service.tools}</div>
      <div class="service-deliverables"><strong>Restituzioni:</strong> ${service.deliverables}</div>
    `;

    grid.appendChild(card);
  });
}

// ==========================================================================
// Populate Profile List
// ==========================================================================

function populateProfileList() {
  const container = document.getElementById('profile-list');
  if (!container) return;

  PROFILE_DATA.forEach(profile => {
    const item = document.createElement('div');
    item.className = 'profile-item';

    item.innerHTML = `
      <span class="profile-category">${profile.category}</span>
      <h3 class="profile-name">${profile.name}</h3>
      <dl class="profile-meta">
        <div><dt>Committente</dt><dd>${profile.client}</dd></div>
        <div><dt>Servizi</dt><dd>${profile.services}</dd></div>
        <div><dt>Dislivello</dt><dd>${profile.elevation}</dd></div>
        <div><dt>Pendenza</dt><dd>${profile.gradient}</dd></div>
      </dl>
    `;

    container.appendChild(item);
  });
}

// ==========================================================================
// Populate Projects Grid
// ==========================================================================

function populateProjectsGrid() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  PROJECT_DATA.forEach(project => {
    const li = document.createElement('li');
    li.className = 'project-card';

    li.innerHTML = `
      <header class="project-header">
        <h3 class="project-name">${project.title}</h3>
        <span class="project-category">${project.category}</span>
      </header>
      <dl class="project-meta">
        <div><dt>Committente</dt><dd>${project.client}</dd></div>
        <div><dt>Servizi</dt><dd>${project.services}</dd></div>
        <div><dt>Strumentazione</dt><dd>${project.tools}</dd></div>
      </dl>
    `;

    grid.appendChild(li);
  });
}

// ==========================================================================
// Populate Team Grid
// ==========================================================================

function populateTeamGrid() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  CREW_DATA.forEach(member => {
    const div = document.createElement('div');
    div.className = 'team-member';

    div.innerHTML = `
      <div class="member-photo" aria-label="${member.name}">
        <div class="photo-placeholder" aria-hidden="true">${member.initials}</div>
      </div>
      <h3 class="member-name">${member.name}</h3>
      <p class="member-role">${member.role}</p>
      <p class="member-focus">${member.focus}</p>
    `;

    grid.appendChild(div);
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

let contourCanvas = null;
let elevationSVG = null;

function init() {
  try {
    const canvas = document.getElementById('contour-canvas');
    if (canvas) {
      contourCanvas = new ContourCanvas(canvas);
    }
  } catch (err) {
    console.error('Contour canvas init failed:', err);
  }

  try {
    const svg = document.getElementById('elevation-svg');
    if (svg) {
      elevationSVG = new ElevationSVG(svg);
    }
  } catch (err) {
    console.error('Elevation SVG init failed:', err);
  }

  try { populateServicesGrid(); } catch (err) { console.error('Populate services failed:', err); }
  try { populateProfileList(); } catch (err) { console.error('Populate profile list failed:', err); }
  try { populateProjectsGrid(); } catch (err) { console.error('Populate projects grid failed:', err); }
  try { populateTeamGrid(); } catch (err) { console.error('Populate team grid failed:', err); }

  try { initScrollReveal(); } catch (err) { console.error('Scroll reveal init failed:', err); }
  try { initHeaderScroll(); } catch (err) { console.error('Header scroll init failed:', err); }
  try { initSmoothScroll(); } catch (err) { console.error('Smooth scroll init failed:', err); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('beforeunload', () => {
  if (contourCanvas) contourCanvas.destroy();
  if (elevationSVG) elevationSVG.destroy();
});