/* ==========================================================================
   Topografica — Main Application (Point Cloud Hero + Interactions)
   ========================================================================== */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==========================================================================
// Configuration & Data
// ==========================================================================

const CLUSTER_CONFIG = {
  catasto: {
    color: 0x00d4aa,
    label: 'Topografia e Catasto',
    count: 3,
    description: 'Rilievi planimetrici, planoaltimetrici, catastali; livellazioni alta precisione; rilevazioni subalveo; controllo confini; elaborazione tempo reale.',
    tools: 'Stazioni totali Leica (TSA15, TCA2003), GNSS multi-costellazione, livelli di precisione.',
    deliverables: 'DWG/DXF, XML Catasto, Excel, relazioni tecniche.',
    projects: ['careggi', 'nuove-acque', 'riconfinamenti']
  },
  monitoraggio: {
    color: 0x0099ff,
    label: 'Monitoraggio Discariche, Cave e Dighe',
    count: 2,
    description: 'Stazioni totali motorizzate con telemetria GSM; cicli periodici/giornalieri/continui; marker su capisaldi fissi; grafici spostamenti e velocità.',
    tools: 'Stazioni totali motorizzate Leica, sistema comunicazione GSM, pilastrini CLS, marker di precisione.',
    deliverables: 'File AutoCAD, Excel, grafici spostamento, report velocità.',
    projects: ['careggi', 'frascari']
  },
  sottoservizi: {
    color: 0xff6b35,
    label: 'Rilievo Sottoservizi – Ispezione Ipogea',
    count: 2,
    description: 'Reti fognarie/acquedotto: rilievo superficiale + prospezioni ipogee/subacquee; georeferenziazione IGM; precisione sub-centimetrica; 35 km area fiorentina, 27 km 3ª cerchia Pistoia.',
    tools: 'Attrezzatura radiocomandata per ispezione, TPS/GPS/Livello integrati, georeferenziazione IGM.',
    deliverables: 'Banche dati reti (dimensione, profondità, stato manutenzione), DWG, GIS.',
    projects: ['ex-breda', 'agip']
  },
  architettonico: {
    color: 0xb87aff,
    label: 'Rilievi Architettonici di Fabbricati',
    count: 2,
    description: 'Stazione totale 3D + fotogrammetria referenziata; laser scanner via partner per nuvole dense; modelli 3D interrogabili (x,y,z per punto); piante, prospetti, sezioni, rendering.',
    tools: 'Stazione totale 3D, fotogrammetria, laser scanner (partner), software nuvole punti.',
    deliverables: 'Nuvole punti (.las/.e57), modelli 3D, DWG piante/prospetti/sezioni, rendering.',
    projects: ['legnorosso', 'frascari']
  }
};

const PROJECT_DATA = {
  careggi: {
    title: 'Manutenzione straordinaria Pad. Maternità — Osp. Careggi',
    category: 'Edilizia',
    client: 'Azienda Ospedaliero-Universitaria Careggi, Firenze',
    services: 'Topografia cantiere, tracciamenti, quote rosse/nerie, aggiornamento plano-altimetrici',
    tools: 'Stazione totale, GPS, livellazione precisione',
    detail: 'Rilievi topografici per posizionamento fabbricati e viabilità interna; calcolo e rappresentazione quote "rosse" derivate da rilievo "nero"; aggiornamento continuo piante, profili, sezioni durante avanzamento lavori.'
  },
  'ex-breda': {
    title: 'Rilievo Area "Ex-Breda"',
    category: 'Infrastrutture',
    client: 'Giusti per l\'Edilizia S.p.A., Pistoia',
    services: 'Rilievo topografico area industriale dismessa, riconfinamenti, catasto',
    tools: 'Stazione totale, GPS, laser scanner (partner)',
    detail: 'Rilievo integrato stazione totale + laser scanner per modellazione 3D area ex industriale; supporto a pianificazione riconversione urbanistica; georeferenziazione IGM.'
  },
  ss66: {
    title: 'Tracciamento Variante SS.66',
    category: 'Infrastrutture',
    client: 'Provincia di Pistoia',
    services: 'Tracciamento variante stradale, aggiornamento planimetrie/profili/sezioni',
    tools: 'Stazione totale motorizzata, GPS, livellazione',
    detail: 'Tracciamento esecutivo nuova viabilità; fornitura quote rosse per controllo getti; aggiornamento continuo elaborati per direzione lavori; coordinamento con impresa esecutrice.'
  },
  legnorosso: {
    title: 'Ristrutturazione Impianto "Legnorosso"',
    category: 'Edilizia',
    client: 'CONI Comitato Provinciale Pistoia',
    services: 'Rilievo architettonico esistente, tracciamento nuovo impianto, assistenza cantiere',
    tools: 'Stazione totale 3D, fotogrammetria, GPS',
    detail: 'Rilievo architettonico impianto sportivo esistente (piante, prospetti, sezioni); tracciamento nuova struttura; assistenza topografica continua durante lavori; redazione POS sicurezza.'
  },
  frascari: {
    title: 'Ristrutturazione Impianto "Frascari"',
    category: 'Edilizia',
    client: 'Provincia di Pistoia',
    services: 'Rilievo architettonico, tracciamento, monitoraggio strutturale',
    tools: 'Stazione totale, livellazione precisione, GPS',
    detail: 'Rilievo completo impianto sportivo; monitoraggio deformazioni strutturali durante ristrutturazione; livellazioni alta precisione per controllo cedimenti; georeferenziazione catastale.'
  },
  agip: {
    title: 'Aggiornamenti Catastali Oleodotto Gaeta-Pomezia',
    category: 'Catasto',
    client: 'Agip Petroli S.p.A.',
    services: 'Aggiornamenti catastali tracciato oleodotto, servitù, espropri',
    tools: 'GPS, stazione totale, software catasto',
    detail: 'Aggiornamento mappali catastali per tracciato oleodotto Gaeta-Pomezia; rilevazione servitù ed espropri; redazione tipi di frazionamento e mappe di aggiornamento per Agenzia delle Entrate.'
  },
  'nuove-acque': {
    title: 'Piani Particellari, Servitù ed Espropri',
    category: 'Catasto',
    client: 'Nuove Acque S.p.A., Arezzo',
    services: 'Piani particellari, servitù, espropri per infrastrutture idriche',
    tools: 'GPS RTK, stazione totale, software catasto',
    detail: 'Redazione piani particellari per acquisizioni aree; calcolo servitù passaggio condotte; tipi di frazionamento per espropri; coordinamento con uffici catastali Arezzo.'
  },
  riconfinamenti: {
    title: 'Riconfinamenti Terreni',
    category: 'Catasto',
    client: 'Privati e Pubbliche Amministrazioni',
    services: 'Esecuzione e assistenza riconfinamenti, verifica confini proprietà',
    tools: 'GPS RTK, stazione totale, livellazione',
    detail: 'Riconfinamenti terreni per privati e pubbliche amministrazioni; verifica confronto dati catastali vs stato di fatto; redazione verbali di riconfinamento; assistenza in contenziosi confinari.'
  },
  sr66: {
    title: 'Tracciamento Variante SR.66 — Pistoia',
    category: 'Infrastrutture',
    client: 'Provincia di Pistoia',
    services: 'Tracciamento variante, assistenza cantiere, aggiornamento elaborati',
    tools: 'Stazione totale motorizzata, GPS, livellazione',
    detail: 'Secondo intervento su SR.66 per Provincia di Pistoia; tracciamento esecutivo nuova viabilità; controllo quote rosse; aggiornamento continuo piante e profili per direzione lavori.'
  }
};

// ==========================================================================
// Point Cloud Scene
// ==========================================================================

class PointCloudScene {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.points = null;
    this.clusters = {};
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredCluster = null;
    this.animationId = null;
    this.isLoaded = false;
    this.targetRotationY = 0;
    this.currentRotationY = 0;

    this.init();
  }

  async init() {
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
    this.setupControls();
    this.setupLights();
    // Attach event listeners BEFORE point cloud generation so they work even if WebGL fails
    this.setupEventListeners();
    await this.generatePointCloud();
    this.container.classList.add('loaded');
    this.animate();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.canvas = this.renderer.domElement;
    this.container.appendChild(this.canvas);
  }

  setupScene() {
    this.scene = new THREE.Scene();
  }

  setupCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 50);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.2;
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.maxPolarAngle = Math.PI * 2 / 3;
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);
  }

  async generatePointCloud() {
    const totalPoints = 50000;
    const positions = new Float32Array(totalPoints * 3);
    const colors = new Float32Array(totalPoints * 3);
    const sizes = new Float32Array(totalPoints);
    const clusterIds = new Uint16Array(totalPoints);

    // Define cluster centers in 3D space (simulating a construction site)
    const clusterCenters = {
      catasto: new THREE.Vector3(-15, 2, -5),
      monitoraggio: new THREE.Vector3(10, 5, -10),
      sottoservizi: new THREE.Vector3(-5, -3, 15),
      architettonico: new THREE.Vector3(15, 0, 5)
    };

    const clusterKeys = Object.keys(clusterCenters);
    const pointsPerCluster = Math.floor(totalPoints * 0.6 / clusterKeys.length);
    const noisePoints = totalPoints - pointsPerCluster * clusterKeys.length;

    let idx = 0;

    // Generate clustered points
    clusterKeys.forEach((key, clusterIndex) => {
      const center = clusterCenters[key];
      const color = new THREE.Color(CLUSTER_CONFIG[key].color);
      const spread = 8 + Math.random() * 4;

      for (let i = 0; i < pointsPerCluster; i++) {
        // Gaussian-ish distribution around center
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = spread * Math.sqrt(Math.random());

        positions[idx * 3] = center.x + r * Math.sin(phi) * Math.cos(theta);
        positions[idx * 3 + 1] = center.y + r * Math.sin(phi) * Math.sin(theta);
        positions[idx * 3 + 2] = center.z + r * Math.cos(phi);

        // Slight color variation
        colors[idx * 3] = color.r + (Math.random() - 0.5) * 0.1;
        colors[idx * 3 + 1] = color.g + (Math.random() - 0.5) * 0.1;
        colors[idx * 3 + 2] = color.b + (Math.random() - 0.5) * 0.1;

        sizes[idx] = 0.5 + Math.random() * 0.5;
        clusterIds[idx] = clusterIndex + 1; // 1-4 for clusters, 0 for noise

        idx++;
      }
    });

    // Generate noise points (background site context)
    const noiseColor = new THREE.Color(0x4a5a6a);
    for (let i = 0; i < noisePoints; i++) {
      const r = 35 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[idx * 3 + 1] = -5 + r * 0.3 * Math.sin(phi) * Math.sin(theta);
      positions[idx * 3 + 2] = r * Math.cos(phi);

      colors[idx * 3] = noiseColor.r;
      colors[idx * 3 + 1] = noiseColor.g;
      colors[idx * 3 + 2] = noiseColor.b;

      sizes[idx] = 0.2 + Math.random() * 0.3;
      clusterIds[idx] = 0;

      idx++;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('clusterId', new THREE.BufferAttribute(clusterIds, 1));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);

    // Store cluster centers for raycasting
    this.clusterCenters = clusterCenters;
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onResize());
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.onClick(e));
    this.canvas.addEventListener('mouseleave', () => this.onMouseLeave());

    // Keyboard navigation for clusters
    document.querySelectorAll('.cluster-btn').forEach(btn => {
      btn.addEventListener('click', () => this.selectCluster(btn.dataset.cluster));
      btn.addEventListener('mouseenter', () => this.highlightCluster(btn.dataset.cluster, true));
      btn.addEventListener('mouseleave', () => this.highlightCluster(btn.dataset.cluster, false));
    });
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycastClusters();
  }

  onMouseLeave() {
    this.highlightCluster(null, false);
  }

  onClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycastClusters();
    if (this.hoveredCluster) {
      this.selectCluster(this.hoveredCluster);
    }
  }

  raycastClusters() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Raycast against cluster center spheres (invisible)
    const clusterKeys = Object.keys(this.clusterCenters);
    let closestCluster = null;
    let closestDistance = Infinity;

    clusterKeys.forEach((key, index) => {
      const center = this.clusterCenters[key];
      const sphere = new THREE.Sphere(center, 12);
      const intersectPoint = new THREE.Vector3();
      if (this.raycaster.ray.intersectSphere(sphere, intersectPoint)) {
        const distance = this.camera.position.distanceTo(intersectPoint);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestCluster = key;
        }
      }
    });

    if (closestCluster !== this.hoveredCluster) {
      this.highlightCluster(closestCluster, true);
      this.hoveredCluster = closestCluster;
    }
  }

  highlightCluster(clusterKey, highlight) {
    if (!this.points) return;

    const clusterKeys = Object.keys(CLUSTER_CONFIG);
    const clusterIndex = clusterKeys.indexOf(clusterKey) + 1;
    const clusterIds = this.points.geometry.attributes.clusterId.array;

    if (highlight && clusterKey) {
      // Update button UI
      document.querySelectorAll('.cluster-btn').forEach(btn => {
        const isActive = btn.dataset.cluster === clusterKey;
        btn.setAttribute('aria-pressed', isActive);
        if (isActive) btn.classList.add('hovered');
        else btn.classList.remove('hovered');
      });
    } else {
      document.querySelectorAll('.cluster-btn').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('hovered');
      });
    }
  }

  selectCluster(clusterKey) {
    if (!clusterKey) return;

    // Update UI
    document.querySelectorAll('.cluster-btn').forEach(btn => {
      const isSelected = btn.dataset.cluster === clusterKey;
      btn.setAttribute('aria-pressed', isSelected);
      btn.classList.toggle('selected', isSelected);
    });

    // Show event panel
    this.showEventPanel(clusterKey);

    // Update ortho section
    const orthoBtn = document.querySelector(`.ortho-btn[data-service="${clusterKey}"]`);
    if (orthoBtn) {
      document.querySelectorAll('.ortho-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
      orthoBtn.setAttribute('aria-pressed', 'true');
      window.orthoSection?.setService(clusterKey);
    }
  }

  showEventPanel(clusterKey) {
    const config = CLUSTER_CONFIG[clusterKey];
    const panel = document.getElementById('event-panel');
    const content = panel.querySelector('.event-panel-content');

    content.innerHTML = `
      <h3 style="font-family: var(--font-display); font-size: var(--text-h3); font-weight: 600; color: var(--color-white-cold); margin: 0 0 var(--space-md);">${config.label}</h3>
      <p style="font-size: var(--text-body); color: var(--color-text-muted); line-height: var(--line-height-relaxed); margin: 0 0 var(--space-lg);">${config.description}</p>
      <div style="margin-bottom: var(--space-lg);">
        <strong style="color: var(--color-text-muted);">Strumentazione:</strong>
        <p style="font-size: var(--text-sm); color: var(--color-text-dim); margin: var(--space-xs) 0 0;">${config.tools}</p>
      </div>
      <div style="margin-bottom: var(--space-lg);">
        <strong style="color: var(--color-text-muted);">Restituzioni:</strong>
        <p style="font-size: var(--text-sm); color: var(--color-text-dim); margin: var(--space-xs) 0 0;">${config.deliverables}</p>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
        ${config.projects.map(p => {
          const proj = PROJECT_DATA[p];
          return `<button type="button" class="btn btn--secondary" style="font-size: var(--text-xs); padding: var(--space-xs) var(--space-sm);" onclick="window.selectProject('${p}')">${proj.title}</button>`;
        }).join('')}
      </div>
    `;

    panel.hidden = false;
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Auto-rotation
    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.02;
    if (this.points) {
      this.points.rotation.y = this.currentRotationY;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.controls) this.controls.dispose();
    if (this.renderer) this.renderer.dispose();
    if (this.canvas?.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  }
}

// ==========================================================================
// Ortho Section (Profile View)
// ==========================================================================

class OrthoSection {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currentService = 'catasto';
    this.width = 0;
    this.height = 0;
    this.data = this.generateProfileData();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  generateProfileData() {
    const services = ['catasto', 'monitoraggio', 'sottoservizi', 'architettonico'];
    const data = {};

    services.forEach(service => {
      const config = CLUSTER_CONFIG[service];
      const points = [];
      const numPoints = 80 + Math.random() * 40;

      for (let i = 0; i < numPoints; i++) {
        const x = (i / numPoints) * 0.9 + 0.05;
        // Simulate terrain/profile with service-specific patterns
        let baseY = 0.5 + Math.sin(x * Math.PI * 4) * 0.15 + Math.random() * 0.1;
        if (service === 'monitoraggio') baseY += Math.sin(x * Math.PI * 12) * 0.05; // vibration
        if (service === 'sottoservizi') baseY = 0.3 + Math.random() * 0.4; // scattered underground
        if (service === 'architettonico') baseY = 0.4 + Math.sin(x * Math.PI * 8) * 0.2; // structured

        points.push({ x, y: baseY, intensity: 0.5 + Math.random() * 0.5 });
      }
      data[service] = { points, color: config.color };
    });

    return data;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.draw();
  }

  setService(service) {
    this.currentService = service;
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const service = this.currentService;
    const { points, color } = this.data[service];
    const hexColor = '#' + color.toString(16).padStart(6, '0');

    // Clear
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0a0f1a';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#1a2a3a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      const x = (i / 8) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#2a3a4a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, h - 30);
    ctx.lineTo(w - 20, h - 30);
    ctx.moveTo(40, h - 30);
    ctx.lineTo(40, 20);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#6b7c8a';
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Distanza →', w / 2, h - 8);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('↑ Quota', 0, 0);
    ctx.restore();

    // Draw points
    points.forEach(p => {
      const px = 40 + p.x * (w - 60);
      const py = h - 30 - p.y * (h - 50);

      const alpha = 0.3 + p.intensity * 0.5;
      ctx.fillStyle = this.hexToRgba(hexColor, alpha);
      ctx.beginPath();
      ctx.arc(px, py, 1.5 + p.intensity * 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Trend line
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    points.forEach((p, i) => {
      const px = 40 + p.x * (w - 60);
      const py = h - 30 - p.y * (h - 50);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Service label
    ctx.fillStyle = hexColor;
    ctx.font = '600 13px "IBM Plex Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(CLUSTER_CONFIG[service].label.toUpperCase(), 40, h - 35);
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
// Global Project Selector (for event panel buttons)
// ==========================================================================

window.selectProject = function(projectKey) {
  const project = PROJECT_DATA[projectKey];
  if (!project) return;

  const panel = document.getElementById('event-panel');
  const content = panel.querySelector('.event-panel-content');

  content.innerHTML = `
    <h3 style="font-family: var(--font-display); font-size: var(--text-h3); font-weight: 600; color: var(--color-white-cold); margin: 0 0 var(--space-sm);">${project.title}</h3>
    <span style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 500; color: var(--color-instrument-orange); text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; margin-bottom: var(--space-lg);">${project.category}</span>
    <dl style="margin: 0 0 var(--space-lg); display: grid; gap: var(--space-md);">
      <div style="display: grid; grid-template-columns: auto 1fr; gap: var(--space-sm) var(--space-md); align-items: start;">
        <dt style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.05em;">Committente</dt>
        <dd style="font-size: var(--text-sm); color: var(--color-text-muted); margin: 0; line-height: var(--line-height-relaxed);">${project.client}</dd>
      </div>
      <div style="display: grid; grid-template-columns: auto 1fr; gap: var(--space-sm) var(--space-md); align-items: start;">
        <dt style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.05em;">Servizi</dt>
        <dd style="font-size: var(--text-sm); color: var(--color-text-muted); margin: 0; line-height: var(--line-height-relaxed);">${project.services}</dd>
      </div>
      <div style="display: grid; grid-template-columns: auto 1fr; gap: var(--space-sm) var(--space-md); align-items: start;">
        <dt style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; color: var(--color-text-dim); text-transform: uppercase; letter-spacing: 0.05em;">Strumentazione</dt>
        <dd style="font-size: var(--text-sm); color: var(--color-text-dim); margin: 0; line-height: var(--line-height-relaxed);">${project.tools}</dd>
      </div>
    </dl>
    <p style="font-size: var(--text-sm); color: var(--color-text-muted); line-height: var(--line-height-relaxed); margin: 0;">${project.detail}</p>
  `;

  panel.hidden = false;
};

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
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
    });
  });
}

// ==========================================================================
// Intersection Observer for Section Reveal
// ==========================================================================

function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
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

  // Add visible class styles dynamically
  const style = document.createElement('style');
  style.textContent = 'section.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
}

// ==========================================================================
// Main Initialization
// ==========================================================================

let pointCloudScene = null;
let orthoSection = null;

async function init() {
  // Initialize point cloud hero
  const container = document.getElementById('point-cloud-canvas');
  if (container) {
    try {
      pointCloudScene = new PointCloudScene(container);
      window.pointCloudScene = pointCloudScene;
    } catch (err) {
      console.error('Point cloud initialization failed:', err);
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--color-text-dim);font-family:var(--font-mono);">WebGL non disponibile — visualizzazione nuvola punti non supportata</div>';
    }
  }

  // Initialize ortho section
  try {
    const orthoCanvas = document.getElementById('ortho-canvas');
    if (orthoCanvas) {
      orthoSection = new OrthoSection(orthoCanvas);
      window.orthoSection = orthoSection;
    }
  } catch (err) {
    console.error('Ortho section init failed:', err);
  }

  // Initialize other interactions
  try { initProjectExpansion(); } catch (err) { console.error('Project expansion init failed:', err); }
  try { initSmoothScroll(); } catch (err) { console.error('Smooth scroll init failed:', err); }
  try { initScrollReveal(); } catch (err) { console.error('Scroll reveal init failed:', err); }

  // Close event panel on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const panel = document.getElementById('event-panel');
      if (!panel.hidden) {
        panel.hidden = true;
        document.querySelectorAll('.cluster-btn').forEach(btn => {
          btn.setAttribute('aria-pressed', 'false');
          btn.classList.remove('selected', 'hovered');
        });
      }
    }
  });

  // Event panel close button
  document.querySelector('.event-panel-close')?.addEventListener('click', () => {
    const panel = document.getElementById('event-panel');
    panel.hidden = true;
    document.querySelectorAll('.cluster-btn').forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('selected', 'hovered');
    });
  });
}

// Start when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ==========================================================================
// Cleanup on unload
// ==========================================================================

window.addEventListener('beforeunload', () => {
  if (pointCloudScene) pointCloudScene.destroy();
});