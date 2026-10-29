/* ==========================================================================
   Topografica — Prototype 4: Blueprint Tecnico
   Interactions: Scroll reveal, smooth scroll, service panel, metrics counter,
   SVG draw-on-scroll, services/projects/teams population
   ========================================================================== */

// ==========================================================================
// Data
// ==========================================================================

const SERVICE_DATA = [
  {
    key: 'catasto',
    name: 'Topografia e Catasto',
    desc: 'Rilievi planimetrici, planoaltimetrici, catastali; livellazioni alta precisione (stadie normali e Invar); rilevazioni subalveo; controllo confini; elaborazione tempo reale.',
    tools: 'Stazioni totali Leica (TSA15, TCA2003), GNSS multi-costellazione, livelli di precisione.',
    deliverables: 'DWG/DXF, XML Catasto, Excel, relazioni tecniche.',
    projects: ['careggi', 'nuove-acque', 'riconfinamenti']
  },
  {
    key: 'monitoraggio',
    name: 'Monitoraggio Discariche, Cave e Dighe',
    desc: 'Stazioni totali motorizzate (Leica TSA15, TCA2003) con telemetria GSM; cicli periodici, giornalieri o continui; marker su capisaldi fissi; restituzione grafici spostamenti planimetrici/altimetrici e velocità.',
    tools: 'Stazioni totali motorizzate Leica, sistema comunicazione GSM, pilastrini CLS, marker di precisione.',
    deliverables: 'File AutoCAD, Excel, grafici spostamento, report velocità.',
    projects: ['careggi', 'frascari']
  },
  {
    key: 'sottoservizi',
    name: 'Rilievo Sottoservizi – Ispezione Ipogea',
    desc: 'Reti fognarie e acquedotto: rilievo topografico superficiale + prospezioni ipogee/subacquee; georeferenziazione IGM; precisione sub-centimetrica; esperienza 35 km area fiorentina, 27 km 3ª cerchia Pistoia.',
    tools: 'Attrezzatura radiocomandata per ispezione, TPS/GPS/Livello integrati, georeferenziazione IGM.',
    deliverables: 'Banche dati reti (dimensione, profondità, stato manutenzione), DWG, GIS.',
    projects: ['ex-breda', 'agip']
  },
  {
    key: 'architettonico',
    name: 'Rilievi Architettonici di Fabbricati',
    desc: 'Stazione totale 3D + fotogrammetria referenziata; laser scanner via partner per nuvole di punti dense; modelli 3D realistici interrogabili (x,y,z per punto); piante, prospetti, sezioni, rendering.',
    tools: 'Stazione totale 3D, fotogrammetria, laser scanner (partner), software nuvole punti.',
    deliverables: 'Nuvole punti (.las/.e57), modelli 3D, DWG piante/prospetti/sezioni, rendering.',
    projects: ['legnorosso', 'frascari']
  },
  {
    key: 'cantieri',
    name: 'Assistenza e Sicurezza Cantieri',
    desc: 'Tracciamenti viabilità, aggiornamento plano-altimetrici, quote "rosse" da rilievo "nero"; redazione POS e piani sicurezza D.Lgs 81/08; supporto L. 818/84 prevenzione incendi; formazione collaboratori.',
    tools: 'Soci abilitati D.Lgs 81/08, redazione POS, piani intervento sicurezza, prevenzione incendi.',
    deliverables: 'POS, piani sicurezza, elaborati antincendio, tracciamenti esecutivi.',
    projects: ['ss66', 'sr66']
  }
];

const PROJECT_DATA = [
  {
    key: 'careggi',
    title: 'Manutenzione straordinaria Pad. Maternità — Osp. Careggi',
    category: 'Edilizia',
    client: 'Azienda Ospedaliero-Universitaria Careggi, Firenze',
    services: 'Topografia cantiere, tracciamenti, quote rosse/nerie, aggiornamento plano-altimetrici',
    tools: 'Stazione totale, GPS, livellazione precisione',
    detail: 'Rilievi topografici per posizionamento fabbricati e viabilità interna; calcolo e rappresentazione quote "rosse" derivate da rilievo "nero"; aggiornamento continuo piante, profili, sezioni durante avanzamento lavori.'
  },
  {
    key: 'ex-breda',
    title: 'Rilievo Area "Ex-Breda"',
    category: 'Infrastrutture',
    client: 'Giusti per l\'Edilizia S.p.A., Pistoia',
    services: 'Rilievo topografico area industriale dismessa, riconfinamenti, catasto',
    tools: 'Stazione totale, GPS, laser scanner (partner)',
    detail: 'Rilievo integrato stazione totale + laser scanner per modellazione 3D area ex industriale; supporto a pianificazione riconversione urbanistica; georeferenziazione IGM.'
  },
  {
    key: 'ss66',
    title: 'Tracciamento Variante SS.66',
    category: 'Infrastrutture',
    client: 'Provincia di Pistoia',
    services: 'Tracciamento variante stradale, aggiornamento planimetrie/profili/sezioni',
    tools: 'Stazione totale motorizzata, GPS, livellazione',
    detail: 'Tracciamento esecutivo nuova viabilità; fornitura quote rosse per controllo getti; aggiornamento continuo elaborati per direzione lavori; coordinamento con impresa esecutrice.'
  },
  {
    key: 'legnorosso',
    title: 'Ristrutturazione Impianto "Legnorosso"',
    category: 'Edilizia',
    client: 'CONI Comitato Provinciale Pistoia',
    services: 'Rilievo architettonico esistente, tracciamento nuovo impianto, assistenza cantiere',
    tools: 'Stazione totale 3D, fotogrammetria, GPS',
    detail: 'Rilievo architettonico impianto sportivo esistente (piante, prospetti, sezioni); tracciamento nuova struttura; assistenza topografica continua durante lavori; redazione POS sicurezza.'
  },
  {
    key: 'frascari',
    title: 'Ristrutturazione Impianto "Frascari"',
    category: 'Edilizia',
    client: 'Provincia di Pistoia',
    services: 'Rilievo architettonico, tracciamento, monitoraggio strutturale',
    tools: 'Stazione totale, livellazione precisione, GPS',
    detail: 'Rilievo completo impianto sportivo; monitoraggio deformazioni strutturali durante ristrutturazione; livellazioni alta precisione per controllo cedimenti; georeferenziazione catastale.'
  },
  {
    key: 'agip',
    title: 'Aggiornamenti Catastali Oleodotto Gaeta-Pomezia',
    category: 'Catasto',
    client: 'Agip Petroli S.p.A.',
    services: 'Aggiornamenti catastali tracciato oleodotto, servitù, espropri',
    tools: 'GPS, stazione totale, software catasto',
    detail: 'Aggiornamento mappali catastali per tracciato oleodotto Gaeta-Pomezia; rilevazione servitù ed espropri; redazione tipi di frazionamento e mappe di aggiornamento per Agenzia delle Entrate.'
  },
  {
    key: 'nuove-acque',
    title: 'Piani Particellari, Servitù ed Espropri',
    category: 'Catasto',
    client: 'Nuove Acque S.p.A., Arezzo',
    services: 'Piani particellari, servitù, espropri per infrastrutture idriche',
    tools: 'GPS RTK, stazione totale, software catasto',
    detail: 'Redazione piani particellari per acquisizioni aree; calcolo servitù passaggio condotte; tipi di frazionamento per espropri; coordinamento con uffici catastali Arezzo.'
  },
  {
    key: 'riconfinamenti',
    title: 'Riconfinamenti Terreni',
    category: 'Catasto',
    client: 'Privati e Pubbliche Amministrazioni',
    services: 'Esecuzione e assistenza riconfinamenti, verifica confini proprietà',
    tools: 'GPS RTK, stazione totale, livellazione',
    detail: 'Riconfinamenti terreni per privati e pubbliche amministrazioni; verifica confronto dati catastali vs stato di fatto; redazione verbali di riconfinamento; assistenza in contenziosi confinari.'
  },
  {
    key: 'sr66',
    title: 'Tracciamento Variante SR.66 — Pistoia',
    category: 'Infrastrutture',
    client: 'Provincia di Pistoia',
    services: 'Tracciamento variante, assistenza cantiere, aggiornamento elaborati',
    tools: 'Stazione totale motorizzata, GPS, livellazione',
    detail: 'Secondo intervento su SR.66 per Provincia di Pistoia; tracciamento esecutivo nuova viabilità; controllo quote rosse; aggiornamento continuo piante e profili per direzione lavori.'
  }
];

const CREW_DATA = [
  {
    initials: 'GG',
    name: 'Giampiero Gori',
    role: 'Socio / Topografo senior',
    focus: 'Rilievi catasto, infrastrutture, direzione tecnica'
  },
  {
    initials: 'AL',
    name: 'Alberto Lucarelli',
    role: 'Socio / Topografo senior',
    focus: 'Monitoraggi, sottoservizi, laser scanner, sicurezza cantieri'
  },
  {
    initials: 'MB',
    name: 'Marco Biagini',
    role: 'Socio / Topografo senior',
    focus: 'Rilievi architettonici, fotogrammetria, 3D modeling'
  }
];

// ==========================================================================
// Populate Services Grid
// ==========================================================================

function populateServicesGrid() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  SERVICE_DATA.forEach(service => {
    const div = document.createElement('div');
    div.className = 'service-item';
    div.dataset.service = service.key;

    div.innerHTML = `
      <dt class="service-name">${service.name}</dt>
      <dd class="service-desc">${service.desc}</dd>
      <dd class="service-tools"><strong>Strumentazione:</strong> ${service.tools}</dd>
      <dd class="service-deliverables"><strong>Restituzioni:</strong> ${service.deliverables}</dd>
    `;

    div.addEventListener('click', () => {
      showServicePanel(service);
    });

    grid.appendChild(div);
  });
}

// ==========================================================================
// Populate Projects Container
// ==========================================================================

function populateProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  PROJECT_DATA.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.project = project.key;

    card.innerHTML = `
      <header class="project-header">
        <h3 class="project-name">${project.title}</h3>
        <span class="project-category">${project.category}</span>
      </header>
      <dl class="project-meta">
        <div><dt>Committente</dt><dd>${project.client}</dd></div>
        <div><dt>Servizi</dt><dd>${project.services}</dd></div>
        <div><dt>Strumentazione</dt><dd>${project.tools}</dd></div>
      </dl>
      <button type="button" class="project-expand" aria-expanded="false" aria-controls="details-${project.key}">Dettagli</button>
      <div id="details-${project.key}" class="project-details" hidden>
        <p>${project.detail}</p>
      </div>
    `;

    const btn = card.querySelector('.project-expand');
    const details = card.querySelector('.project-details');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isOpen);
      details.hidden = isOpen;
      btn.textContent = isOpen ? 'Dettagli' : 'Chiudi';
    });

    container.appendChild(card);
  });
}

// ==========================================================================
// Populate Team Grid
// ==========================================================================

function populateTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  CREW_DATA.forEach(member => {
    const div = document.createElement('div');
    div.className = 'team-member';

    div.innerHTML = `
      <figure class="member-photo" aria-label="${member.name}">
        <div class="photo-placeholder" aria-hidden="true">${member.initials}</div>
      </figure>
      <div class="member-info">
        <h3 class="member-name">${member.name}</h3>
        <p class="member-role">${member.role}</p>
        <p class="member-focus">${member.focus}</p>
      </div>
    `;

    grid.appendChild(div);
  });
}

// ==========================================================================
// Service Panel
// ==========================================================================

function showServicePanel(service) {
  const panel = document.getElementById('service-panel');
  const content = panel.querySelector('.panel-content');
  const closeBtn = panel.querySelector('.panel-close');

  content.innerHTML = `
    <h3 style="font-family: var(--font-display); font-size: var(--text-h3); font-weight: 600; color: var(--color-white-cold); margin: 0 0 var(--space-md);">${service.name}</h3>
    <p style="font-size: var(--text-body); color: var(--color-text-muted); line-height: var(--line-height-relaxed); margin: 0 0 var(--space-lg);">${service.desc}</p>
    <div style="margin-bottom: var(--space-lg);">
      <strong style="color: var(--color-text-muted);">Strumentazione:</strong>
      <p style="font-size: var(--text-sm); color: var(--color-text-dim); margin: var(--space-xs) 0 0;">${service.tools}</p>
    </div>
    <div style="margin-bottom: var(--space-lg);">
      <strong style="color: var(--color-text-muted);">Restituzioni:</strong>
      <p style="font-size: var(--text-sm); color: var(--color-text-dim); margin: var(--space-xs) 0 0;">${service.deliverables}</p>
    </div>
  `;

  panel.hidden = false;

  closeBtn.onclick = () => {
    panel.hidden = true;
  };

  // Close on Escape
  const onEsc = (e) => {
    if (e.key === 'Escape') {
      panel.hidden = true;
      document.removeEventListener('keydown', onEsc);
    }
  };
  document.addEventListener('keydown', onEsc);
}

// ==========================================================================
// Metrics Counter Animation
// ==========================================================================

function animateMetrics() {
  const metrics = document.querySelectorAll('.metric-value[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        let current = 0;
        const duration = 1000;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(current + (target - current) * eased);
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  metrics.forEach(m => observer.observe(m));
}

// ==========================================================================
// SVG Draw-on-Scroll
// ==========================================================================

function initSvgDraw() {
  const paths = document.querySelectorAll('.draw-path');
  if (paths.length === 0) return;

  paths.forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.strokeDashoffset = '0';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  paths.forEach(p => observer.observe(p));
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
// Scroll Progress
// ==========================================================================

function initScrollProgress() {
  const progress = document.getElementById('scroll-progress');
  if (!progress) return;
  const bar = progress.querySelector('span');

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.min(Math.max(scrollTop / docHeight, 0), 1) * 100;
    bar.style.width = `${pct}%`;
  });
}

// ==========================================================================
// Main Initialization
// ==========================================================================

function init() {
  try { populateServicesGrid(); } catch (err) { console.error('Populate services failed:', err); }
  try { populateProjects(); } catch (err) { console.error('Populate projects failed:', err); }
  try { populateTeam(); } catch (err) { console.error('Populate team failed:', err); }
  try { initScrollReveal(); } catch (err) { console.error('Scroll reveal init failed:', err); }
  try { initHeaderScroll(); } catch (err) { console.error('Header scroll init failed:', err); }
  try { initSmoothScroll(); } catch (err) { console.error('Smooth scroll init failed:', err); }
  try { initScrollProgress(); } catch (err) { console.error('Scroll progress init failed:', err); }
  try { animateMetrics(); } catch (err) { console.error('Animate metrics failed:', err); }
  try { initSvgDraw(); } catch (err) { console.error('SVG draw init failed:', err); }

  // Service panel close on outside click
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('service-panel');
    if (panel && !panel.hidden && !panel.contains(e.target)) {
      panel.hidden = true;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}