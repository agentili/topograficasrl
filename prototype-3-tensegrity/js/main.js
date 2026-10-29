/* ==========================================================================
   Topografica — Prototype 3: Tensegrità topografica
   Three.js Tensegrity 3D + 2D Force Diagram + Interactions
   ========================================================================== */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==========================================================================
// Data
// ==========================================================================

const NODE_CONFIG = {
  catasto: {
    label: 'Topografia e Catasto',
    color: 0x00d4aa,
    position: new THREE.Vector3(-12, 8, 0),
    description: 'Rilievi planimetrici, planoaltimetrici, catastali; livellazioni alta precisione; rilevazioni subalveo; controllo confini; elaborazione tempo reale.',
    tools: 'Stazioni totali Leica TSA15, TCA2003; GNSS multi-costellazione; livelli precisione',
    deliverables: 'DWG/DXF, XML Catasto, Excel, relazioni tecniche',
    clients: ['careggi', 'nuove-acque', 'riconfinamenti'],
    force: 'Compressione: asta verticale primaria'
  },
  monitoraggio: {
    label: 'Monitoraggio Discariche, Cave e Dighe',
    color: 0x0099ff,
    position: new THREE.Vector3(0, 12, 8),
    description: 'Stazioni totali motorizzate con telemetria GSM; cicli periodici/giornalieri/continui; marker su capisaldi fissi; grafici spostamenti e velocità.',
    tools: 'Stazioni totali motorizzate Leica, sistema GSM, pilastrini CLS, marker precisione',
    deliverables: 'File AutoCAD, Excel, grafici spostamento, report velocità',
    clients: ['careggi', 'frascari'],
    force: 'Compressione: asta inclinata superiore'
  },
  sottoservizi: {
    label: 'Rilievo Sottoservizi – Ispezione Ipogea',
    color: 0xff6b35,
    position: new THREE.Vector3(10, -4, -6),
    description: 'Reti fognarie/acquedotto: rilievo superficiale + prospezioni ipogee; georeferenziazione IGM; precisione sub-centimetrica; 35 km Firenze, 27 km Pistoia.',
    tools: 'Attrezzatura radiocomandata, TPS/GPS/Livello integrati, georeferenziazione IGM',
    deliverables: 'Banche dati reti, DWG, GIS',
    clients: ['ex-breda', 'agip'],
    force: 'Compressione: asta inferiore obliqua'
  },
  architettonico: {
    label: 'Rilievi Architettonici di Fabbricati',
    color: 0xb87aff,
    position: new THREE.Vector3(-8, -6, 10),
    description: 'Stazione totale 3D + fotogrammetria referenziata; laser scanner via partner; modelli 3D interrogabili (x,y,z per punto); piante, prospetti, sezioni.',
    tools: 'Stazione totale 3D, fotogrammetria, laser scanner (partner), software nuvole punti',
    deliverables: 'Nuvole punti (.las/.e57), modelli 3D, DWG piante/prospetti/sezioni, rendering',
    clients: ['legnorosso', 'frascari'],
    force: 'Compressione: asta posteriore'
  },
  cantieri: {
    label: 'Assistenza e Sicurezza Cantieri',
    color: 0xe85d1a,
    position: new THREE.Vector3(14, 2, -2),
    description: 'Tracciamenti viabilità, quote rosse/nerie; redazione POS e piani sicurezza D.Lgs 81/08; supporto L. 818/84 prevenzione incendi; formazione collaboratori.',
    tools: 'Soci abilitati D.Lgs 81/08, redazione POS, piani intervento sicurezza',
    deliverables: 'POS, piani sicurezza, elaborati antincendio, tracciamenti esecutivi',
    clients: ['ss66', 'sr66'],
    force: 'Compressione: asta laterale destra'
  }
};

const CLIENT_CONFIG = {
  careggi: { label: 'Careggi', position: new THREE.Vector3(-20, 15, -10), color: 0x00d4aa },
  'ex-breda': { label: 'Giusti / Ex-Breda', position: new THREE.Vector3(20, -10, -15), color: 0xb87aff },
  ss66: { label: 'Provincia Pistoia (SS.66)', position: new THREE.Vector3(25, 5, -5), color: 0xe85d1a },
  legnorosso: { label: 'CONI Pistoia', position: new THREE.Vector3(-15, -12, 18), color: 0xb87aff },
  frascari: { label: 'Provincia Pistoia (Frascari)', position: new THREE.Vector3(-5, -10, 15), color: 0x0099ff },
  agip: { label: 'Agip Petroli', position: new THREE.Vector3(15, -8, -12), color: 0xff6b35 },
  'nuove-acque': { label: 'Nuove Acque Arezzo', position: new THREE.Vector3(-18, 10, -15), color: 0x00d4aa },
  riconfinamenti: { label: 'Privati / PA', position: new THREE.Vector3(-10, 18, 5), color: 0x00d4aa },
  sr66: { label: 'Provincia Pistoia (SR.66)', position: new THREE.Vector3(22, 0, -8), color: 0xe85d1a }
};

const PROJECT_DATA = {
  careggi: { title: 'Manutenzione straordinaria Pad. Maternità — Osp. Careggi', category: 'Edilizia · Firenze', client: 'Azienda Ospedaliero-Universitaria Careggi', services: 'Topografia cantiere, tracciamenti, quote rosse/nerie, aggiornamento plano-altimetrici', tools: 'Stazione totale, GPS, livellazione precisione', detail: 'Rilievi topografici per posizionamento fabbricati e viabilità interna; calcolo e rappresentazione quote "rosse" derivate da rilievo "nero"; aggiornamento continuo piante, profili, sezioni durante avanzamento lavori.' },
  'ex-breda': { title: 'Rilievo Area "Ex-Breda"', category: 'Infrastrutture · Pistoia', client: 'Giusti per l\'Edilizia S.p.A.', services: 'Rilievo topografico area industriale dismessa, riconfinamenti, catasto', tools: 'Stazione totale, GPS, laser scanner (partner)', detail: 'Rilievo integrato stazione totale + laser scanner per modellazione 3D area ex industriale; supporto a pianificazione riconversione urbanistica; georeferenziazione IGM.' },
  ss66: { title: 'Tracciamento Variante SS.66', category: 'Infrastrutture · Pistoia', client: 'Provincia di Pistoia', services: 'Tracciamento variante stradale, aggiornamento planimetrie/profili/sezioni', tools: 'Stazione totale motorizzata, GPS, livellazione', detail: 'Tracciamento esecutivo nuova viabilità; fornitura quote rosse per controllo getti; aggiornamento continuo elaborati per direzione lavori; coordinamento con impresa esecutrice.' },
  legnorosso: { title: 'Ristrutturazione Impianto "Legnorosso"', category: 'Edilizia · Pistoia', client: 'CONI Comitato Provinciale Pistoia', services: 'Rilievo architettonico esistente, tracciamento nuovo impianto, assistenza cantiere', tools: 'Stazione totale 3D, fotogrammetria, GPS', detail: 'Rilievo architettonico impianto sportivo esistente (piante, prospetti, sezioni); tracciamento nuova struttura; assistenza topografica continua durante lavori; redazione POS sicurezza.' },
  frascari: { title: 'Ristrutturazione Impianto "Frascari"', category: 'Edilizia · Pistoia', client: 'Provincia di Pistoia', services: 'Rilievo architettonico, tracciamento, monitoraggio strutturale', tools: 'Stazione totale, livellazione precisione, GPS', detail: 'Rilievo completo impianto sportivo; monitoraggio deformazioni strutturali durante ristrutturazione; livellazioni alta precisione per controllo cedimenti; georeferenziazione catastale.' },
  agip: { title: 'Aggiornamenti Catastali Oleodotto Gaeta-Pomezia', category: 'Catasto · Lazio', client: 'Agip Petroli S.p.A.', services: 'Aggiornamenti catastali tracciato oleodotto, servitù, espropri', tools: 'GPS, stazione totale, software catasto', detail: 'Aggiornamento mappali catastali per tracciato oleodotto Gaeta-Pomezia; rilevazione servitù ed espropri; redazione tipi di frazionamento e mappe di aggiornamento per Agenzia delle Entrate.' },
  'nuove-acque': { title: 'Piani Particellari, Servitù ed Espropri', category: 'Catasto · Arezzo', client: 'Nuove Acque S.p.A.', services: 'Piani particellari, servitù, espropri per infrastrutture idriche', tools: 'GPS RTK, stazione totale, software catasto', detail: 'Redazione piani particellari per acquisizioni aree; calcolo servitù passaggio condotte; tipi di frazionamento per espropri; coordinamento con uffici catastali Arezzo.' },
  riconfinamenti: { title: 'Riconfinamenti Terreni', category: 'Catasto · Nazionale', client: 'Privati e Pubbliche Amministrazioni', services: 'Esecuzione e assistenza riconfinamenti, verifica confini proprietà', tools: 'GPS RTK, stazione totale, livellazione', detail: 'Riconfinamenti terreni per privati e pubbliche amministrazioni; verifica confronto dati catastali vs stato di fatto; redazione verbali di riconfinamento; assistenza in contenziosi confinari.' },
  sr66: { title: 'Tracciamento Variante SR.66 — Pistoia', category: 'Infrastrutture · Pistoia', client: 'Provincia di Pistoia', services: 'Tracciamento variante, assistenza cantiere, aggiornamento elaborati', tools: 'Stazione totale motorizzata, GPS, livellazione', detail: 'Secondo intervento su SR.66 per Provincia di Pistoia; tracciamento esecutivo nuova viabilità; controllo quote rosse; aggiornamento continuo piante e profili per direzione lavori.' }
};

// ==========================================================================
// Tensegrity 3D Scene
// ==========================================================================

class TensegrityScene {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.rods = [];
    this.cords = [];
    this.nodes = [];
    this.clients = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredNode = null;
    this.hoveredClient = null;
    this.animationId = null;
    this.breathPhase = 0;
    this.isLoaded = false;

    this.init();
  }

  async init() {
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
    this.setupControls();
    this.setupLights();
    this.buildTensegrity();
    this.setupEventListeners();
    this.container.classList.add('loaded');
    this.animate();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
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
    this.camera.position.set(0, 0, 60);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = true;
    this.controls.enableZoom = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.3;
    this.controls.minDistance = 40;
    this.controls.maxDistance = 120;
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight1.position.set(20, 40, 20);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe85d1a, 0.2);
    dirLight2.position.set(-20, -20, -20);
    this.scene.add(dirLight2);
  }

  buildTensegrity() {
    // Center node (virtual)
    const center = new THREE.Vector3(0, 0, 0);

    // Create rods (compression members) - 5 services
    const nodeKeys = Object.keys(NODE_CONFIG);
    nodeKeys.forEach((key, index) => {
      const config = NODE_CONFIG[key];
      const rod = this.createRod(center, config.position, config.color);
      this.rods.push({ mesh: rod, key, config });
      this.nodes.push({ position: config.position.clone(), key, config, type: 'service' });
    });

    // Create cords (tension members) - connect rods to center and to clients
    nodeKeys.forEach((key, index) => {
      const config = NODE_CONFIG[key];
      // Cord from center to rod top
      const cord = this.createCord(center, config.position, 0xe85d1a, 0.08);
      this.cords.push({ mesh: cord, type: 'center', key });

      // Cords to clients
      config.clients.forEach(clientKey => {
        const client = CLIENT_CONFIG[clientKey];
        if (client) {
          const clientCord = this.createCord(config.position, client.position, client.color, 0.04);
          this.cords.push({ mesh: clientCord, type: 'client', serviceKey: key, clientKey });
        }
      });
    });

    // Create client nodes
    Object.entries(CLIENT_CONFIG).forEach(([key, config]) => {
      const node = this.createNode(config.position, config.color, 0.6);
      this.clients.push({ mesh: node, key, config, type: 'client' });
      this.nodes.push({ position: config.position.clone(), key, config, type: 'client' });
    });

    // Add center marker
    const centerGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const centerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const centerMesh = new THREE.Mesh(centerGeo, centerMat);
    centerMesh.position.copy(center);
    this.scene.add(centerMesh);
  }

  createRod(start, end, color) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const geometry = new THREE.CylinderGeometry(0.35, 0.35, length, 12);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0f1419,
      metalness: 0.3,
      roughness: 0.7,
      flatShading: true
    });
    const mesh = new THREE.Mesh(geometry, material);

    // Position and orient
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

    // Add color ring at top
    const ringGeo = new THREE.TorusGeometry(0.45, 0.08, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(end);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    mesh.add(ring);

    this.scene.add(mesh);
    return mesh;
  }

  createCord(start, end, color, thickness) {
    const points = [start.clone(), end.clone()];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.6,
      linewidth: 1
    });
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
    return { line, material, start: start.clone(), end: end.clone(), originalOpacity: 0.6 };
  }

  createNode(position, color, size) {
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.1,
      roughness: 0.8,
      emissive: color,
      emissiveIntensity: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    this.scene.add(mesh);
    return mesh;
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onResize());
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.onClick(e));
    this.canvas.addEventListener('mouseleave', () => this.onMouseLeave());

    // Keyboard navigation for legend
    document.querySelectorAll('.legend-list li').forEach(li => {
      li.addEventListener('click', () => this.selectNode(li.dataset.node || li.dataset.client));
      li.addEventListener('mouseenter', () => this.highlightFromLegend(li.dataset.node || li.dataset.client, true));
      li.addEventListener('mouseleave', () => this.highlightFromLegend(li.dataset.node || li.dataset.client, false));
      li.setAttribute('tabindex', '0');
      li.setAttribute('role', 'button');
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectNode(li.dataset.node || li.dataset.client);
        }
      });
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
    this.raycastNodes();
  }

  onMouseLeave() {
    this.highlightNode(null);
  }

  onClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycastNodes();
    if (this.hoveredNode) this.selectNode(this.hoveredNode.key);
    else if (this.hoveredClient) this.selectNode(this.hoveredClient.key);
  }

  raycastNodes() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check service nodes (rod tops)
    const serviceObjects = this.nodes.filter(n => n.type === 'service').map(n => {
      const sphere = new THREE.Sphere(n.position, 3);
      return { sphere, node: n };
    });

    // Check client nodes
    const clientObjects = this.nodes.filter(n => n.type === 'client').map(n => {
      const sphere = new THREE.Sphere(n.position, 2);
      return { sphere, node: n };
    });

    let closest = null;
    let closestDist = Infinity;

    [...serviceObjects, ...clientObjects].forEach(({ sphere, node }) => {
      const intersectPoint = new THREE.Vector3();
      if (this.raycaster.ray.intersectSphere(sphere, intersectPoint)) {
        const dist = this.camera.position.distanceTo(intersectPoint);
        if (dist < closestDist) {
          closestDist = dist;
          closest = node;
        }
      }
    });

    if (closest) {
      if (closest.type === 'service') this.highlightNode(closest);
      else this.highlightClient(closest);
    } else {
      this.highlightNode(null);
    }
  }

  highlightNode(node) {
    this.hoveredNode = node;
    this.hoveredClient = null;

    // Update cords opacity
    this.cords.forEach(cord => {
      const isRelated = node && cord.serviceKey === node.key;
      cord.material.opacity = isRelated ? 1.0 : 0.3;
      cord.material.needsUpdate = true;
    });

    // Update client nodes
    this.clients.forEach(client => {
      const isRelated = node && node.config.clients.includes(client.key);
      client.mesh.material.emissiveIntensity = isRelated ? 0.8 : 0.2;
      client.mesh.material.needsUpdate = true;
    });

    // Update legend
    document.querySelectorAll('.legend-list li').forEach(li => {
      const isActive = node && (li.dataset.node === node.key || (node.config.clients && node.config.clients.includes(li.dataset.client)));
      li.style.color = isActive ? 'var(--color-white-cold)' : 'var(--color-text-muted)';
      li.style.background = isActive ? 'rgba(255,255,255,0.1)' : 'transparent';
    });
  }

  highlightClient(client) {
    this.hoveredClient = client;
    this.hoveredNode = null;

    // Update cords
    this.cords.forEach(cord => {
      const isRelated = cord.clientKey === client.key;
      cord.material.opacity = isRelated ? 1.0 : 0.3;
      cord.material.needsUpdate = true;
    });

    // Update rods
    this.rods.forEach(rod => {
      const isRelated = rod.config.clients.includes(client.key);
      rod.mesh.material.emissive = isRelated ? new THREE.Color(0xe85d1a) : new THREE.Color(0x000000);
      rod.mesh.material.emissiveIntensity = isRelated ? 0.3 : 0;
      rod.mesh.material.needsUpdate = true;
    });

    // Update legend
    document.querySelectorAll('.legend-list li').forEach(li => {
      const isActive = li.dataset.client === client.key;
      li.style.color = isActive ? 'var(--color-white-cold)' : 'var(--color-text-muted)';
      li.style.background = isActive ? 'rgba(255,255,255,0.1)' : 'transparent';
    });
  }

  highlightFromLegend(key, highlight) {
    const node = this.nodes.find(n => n.key === key);
    if (node) {
      if (node.type === 'service') highlight ? this.highlightNode(node) : this.highlightNode(this.hoveredNode);
      else highlight ? this.highlightClient(node) : this.highlightClient(this.hoveredClient);
    }
  }

  selectNode(key) {
    const node = this.nodes.find(n => n.key === key);
    if (!node) return;

    if (node.type === 'service') {
      this.showForcePanel(node);
      this.highlightNode(node);
    } else {
      this.showClientPanel(node);
      this.highlightClient(node);
    }

    // Update legend active state
    document.querySelectorAll('.legend-list li').forEach(li => {
      li.classList.toggle('active', li.dataset.node === key || li.dataset.client === key);
    });
  }

  showForcePanel(node) {
    const config = node.config;
    const panel = document.getElementById('force-panel');
    const content = panel.querySelector('.force-panel-content');

    content.innerHTML = `
      <h3 style="font-family: var(--font-display); font-size: var(--text-h3); font-weight: 600; color: var(--color-white-cold); margin: 0 0 var(--space-xs);">${config.label}</h3>
      <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-cord); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: var(--space-md);">${config.force}</span>
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
        ${config.clients.map(c => {
          const client = CLIENT_CONFIG[c];
          return `<button type="button" class="btn btn--secondary" style="font-size: var(--text-xs); padding: var(--space-xs) var(--space-sm);" onclick="window.showProject('${c}')">${client.label}</button>`;
        }).join('')}
      </div>
    `;

    panel.hidden = false;
  }

  showClientPanel(client) {
    const config = client.config;
    const panel = document.getElementById('force-panel');
    const content = panel.querySelector('.force-panel-content');

    // Find connected services
    const services = Object.entries(NODE_CONFIG).filter(([k, v]) => v.clients.includes(client.key));

    content.innerHTML = `
      <h3 style="font-family: var(--font-display); font-size: var(--text-h3); font-weight: 600; color: var(--color-white-cold); margin: 0 0 var(--space-xs);">${config.label}</h3>
      <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-cord); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: var(--space-md);">Committenza — Nodo di tensione</span>
      <p style="font-size: var(--text-body); color: var(--color-text-muted); line-height: var(--line-height-relaxed); margin: 0 0 var(--space-lg);">Vincola i servizi connessi attraverso linee di vista e capisaldi condivisi.</p>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm); margin-bottom: var(--space-lg);">
        ${services.map(([k, v]) => `<span style="font-family: var(--font-mono); font-size: var(--text-xs); padding: var(--space-xs) var(--space-sm); background: rgba(232,93,26,0.1); border: 1px solid var(--color-cord); border-radius: 4px; color: var(--color-cord);">${v.label}</span>`).join('')}
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
        ${services.map(([k, v]) => `<button type="button" class="btn btn--secondary" style="font-size: var(--text-xs); padding: var(--space-xs) var(--space-sm);" onclick="window.selectNode('${k}')">${v.label}</button>`).join('')}
      </div>
    `;

    panel.hidden = false;
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Breathing animation for tensegrity
    this.breathPhase += 0.003;
    const breath = Math.sin(this.breathPhase) * 0.02;

    this.rods.forEach(({ mesh, config }) => {
      const scale = 1 + breath * (config.position.y > 0 ? 1 : -1) * 0.5;
      mesh.scale.y = scale;
    });

    // Cord tension visualization
    this.cords.forEach(cord => {
      const tension = 0.6 + Math.sin(this.breathPhase * 2 + cord.start.x) * 0.15;
      cord.material.opacity = Math.max(0.2, Math.min(1, tension));
      cord.material.needsUpdate = true;
    });

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
// 2D Force Diagram (Canvas)
// ==========================================================================

class ForceDiagram2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.nodes = {};
    this.selectedNode = null;
    this.hoveredNode = null;
    this.animationId = null;
    this.time = 0;

    this.initNodes();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  initNodes() {
    // Central virtual node
    this.nodes.center = { x: 0, y: 0, type: 'center', label: 'CENTRO', color: '#ffffff' };

    // Service nodes (compression)
    const servicePositions = {
      catasto: { x: -180, y: -120 },
      monitoraggio: { x: 0, y: -180 },
      sottoservizi: { x: 150, y: 60 },
      architettonico: { x: -120, y: 100 },
      cantieri: { x: 200, y: -30 }
    };

    Object.entries(NODE_CONFIG).forEach(([key, config]) => {
      const pos = servicePositions[key] || { x: 0, y: 0 };
      this.nodes[key] = {
        x: pos.x, y: pos.y, type: 'service', key,
        label: config.label, color: '#' + config.color.toString(16).padStart(6, '0'),
        clients: config.clients
      };
    });

    // Client nodes (tension)
    const clientPositions = {
      careggi: { x: -280, y: -200 },
      'ex-breda': { x: 300, y: 150 },
      ss66: { x: 350, y: -50 },
      legnorosso: { x: -200, y: 220 },
      frascari: { x: -80, y: 200 },
      agip: { x: 220, y: 120 },
      'nuove-acque': { x: -260, y: -80 },
      riconfinamenti: { x: -150, y: -250 },
      sr66: { x: 320, y: 20 }
    };

    Object.entries(CLIENT_CONFIG).forEach(([key, config]) => {
      const pos = clientPositions[key] || { x: 0, y: 0 };
      this.nodes[key] = {
        x: pos.x, y: pos.y, type: 'client', key,
        label: config.label, color: '#' + config.color.toString(16).padStart(6, '0')
      };
    });
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

  setSelectedNode(key) {
    this.selectedNode = key;
    this.draw();
  }

  setHoveredNode(key) {
    this.hoveredNode = key;
    this.draw();
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.02;
    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const cx = w / 2;
    const cy = h / 2;

    // Clear
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f1419';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#1a2a33';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x <= w; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Center axes
    ctx.strokeStyle = '#2a3a4a';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();

    // Draw cords (tension) - client connections
    Object.values(this.nodes).forEach(node => {
      if (node.type === 'service' && node.clients) {
        const sx = cx + node.x;
        const sy = cy + node.y;
        node.clients.forEach(clientKey => {
          const client = this.nodes[clientKey];
          if (client) {
            const ex = cx + client.x;
            const ey = cy + client.y;

            // Animated tension line
            const pulse = Math.sin(this.time * 3 + node.x * 0.01) * 0.3 + 0.7;
            ctx.strokeStyle = this.hexToRgba(client.color, 0.4 * pulse);
            ctx.lineWidth = 1.5;
            ctx.setLineDash([8, 4]);
            ctx.lineDashOffset = -this.time * 10;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      }
    });

    // Draw center cords
    Object.values(this.nodes).forEach(node => {
      if (node.type === 'service') {
        const sx = cx + node.x;
        const sy = cy + node.y;
        const pulse = Math.sin(this.time * 2 + node.x * 0.01) * 0.2 + 0.6;
        ctx.strokeStyle = this.hexToRgba('#e85d1a', 0.5 * pulse);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
    });

    // Draw center node
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e85d1a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw service nodes (rods)
    Object.values(this.nodes).forEach(node => {
      if (node.type !== 'service') return;
      const x = cx + node.x;
      const y = cy + node.y;
      const isActive = this.selectedNode === node.key || this.hoveredNode === node.key;
      const isHovered = this.hoveredNode === node.key;
      const radius = isActive ? 14 : (isHovered ? 12 : 10);

      // Node circle
      const gradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, radius);
      gradient.addColorStop(0, this.lightenColor(node.color, 40));
      gradient.addColorStop(1, node.color);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = isActive ? '#e85d1a' : (isHovered ? '#ffffff' : '#2a3a4a');
      ctx.lineWidth = isActive ? 3 : (isHovered ? 2 : 1);
      ctx.stroke();

      // Label
      ctx.fillStyle = isActive ? '#ffffff' : '#c8d4dc';
      ctx.font = `500 ${isActive ? '12' : '11'}px "IBM Plex Sans", sans-serif`;
      ctx.textAlign = 'center';
      const label = node.label.length > 22 ? node.label.substring(0, 22) + '…' : node.label;
      ctx.fillText(label, x, y - radius - 6);

      // Force vector indicator
      if (isActive) {
        ctx.strokeStyle = '#e85d1a';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, cy); // Vector toward center
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // Draw client nodes (tension anchors)
    Object.values(this.nodes).forEach(node => {
      if (node.type !== 'client') return;
      const x = cx + node.x;
      const y = cy + node.y;
      const isActive = this.selectedNode === node.key || this.hoveredNode === node.key;
      const isHovered = this.hoveredNode === node.key;
      const size = isActive ? 10 : (isHovered ? 9 : 7);

      // Diamond shape for tension nodes
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();

      // Glow
      if (isActive || isHovered) {
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isActive ? 12 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Border
      ctx.strokeStyle = isActive ? '#e85d1a' : (isHovered ? '#ffffff' : 'rgba(255,255,255,0.3)');
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.stroke();

      // Label
      ctx.fillStyle = isActive ? '#ffffff' : '#6b7c8a';
      ctx.font = `400 ${isActive ? '10' : '9'}px "IBM Plex Mono", monospace`;
      ctx.textAlign = 'center';
      const label = node.label.length > 18 ? node.label.substring(0, 18) + '…' : node.label;
      ctx.fillText(label, x, y + size + 12);
    });

    // Legend
    ctx.fillStyle = '#6b7c8a';
    ctx.font = '400 10px "IBM Plex Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('● Nodi servizio (compressione)    ◆ Committenze (tensione)    ▲ Centro virtuale', 16, h - 16);
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  lightenColor(hex, percent) {
    const num = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}

// ==========================================================================
// Services Grid Population
// ==========================================================================

function populateServicesGrid() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  Object.entries(NODE_CONFIG).forEach(([key, config]) => {
    const item = document.createElement('div');
    item.className = 'service-item';
    item.style.setProperty('--service-color', '#' + config.color.toString(16).padStart(6, '0'));
    item.dataset.node = key;

    item.innerHTML = `
      <dt class="service-name">${config.label}</dt>
      <dd class="service-desc">${config.description}</dd>
      <div class="service-specs">
        <div class="spec-row"><dt>Strumentazione</dt><dd>${config.tools}</dd></div>
        <div class="spec-row"><dt>Restituzioni</dt><dd>${config.deliverables}</dd></div>
        <div class="spec-row"><dt>Forza strutturale</dt><dd>${config.force}</dd></div>
      </div>
      <div class="service-projects">
        ${config.clients.map(c => {
          const client = CLIENT_CONFIG[c];
          return `<span class="project-tag" data-client="${c}">${client.label}</span>`;
        }).join('')}
      </div>
    `;

    item.addEventListener('click', () => {
      document.querySelectorAll('.service-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      window.tensegrityScene?.selectNode(key);
      window.forceDiagram?.setSelectedNode(key);
    });

    item.addEventListener('mouseenter', () => {
      window.tensegrityScene?.highlightFromLegend(key, true);
      window.forceDiagram?.setHoveredNode(key);
    });
    item.addEventListener('mouseleave', () => {
      window.tensegrityScene?.highlightFromLegend(key, false);
      window.forceDiagram?.setHoveredNode(null);
    });

    grid.appendChild(item);
  });
}

// ==========================================================================
// Projects Grid Population
// ==========================================================================

function populateProjectsGrid() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  Object.entries(PROJECT_DATA).forEach(([key, project]) => {
    const li = document.createElement('li');
    li.className = 'project-card';
    li.dataset.project = key;

    // Determine service colors for force tags
    const services = Object.entries(NODE_CONFIG).filter(([k, v]) => v.clients.includes(key)).map(([k, v]) => k);

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
      <div class="project-forces">
        ${services.map(s => `<span class="force-tag" data-service="${s}">${NODE_CONFIG[s].label}</span>`).join('')}
      </div>
    `;

    li.addEventListener('click', (e) => {
      if (e.target.closest('.force-tag')) return;
      window.showProject(key);
    });

    li.querySelectorAll('.force-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        window.selectNode(tag.dataset.service);
      });
    });

    grid.appendChild(li);
  });
}

// ==========================================================================
// Project Detail Modal (reuses force panel)
// ==========================================================================

window.showProject = function(projectKey) {
  const project = PROJECT_DATA[projectKey];
  if (!project) return;

  const panel = document.getElementById('force-panel');
  const content = panel.querySelector('.force-panel-content');

  content.innerHTML = `
    <h3 style="font-family: var(--font-display); font-size: var(--text-h3); font-weight: 600; color: var(--color-white-cold); margin: 0 0 var(--space-sm);">${project.title}</h3>
    <span style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 500; color: var(--color-cord); text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; margin-bottom: var(--space-lg);">${project.category}</span>
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

window.selectNode = function(key) {
  window.tensegrityScene?.selectNode(key);
  window.forceDiagram?.setSelectedNode(key);

  // Update services grid
  document.querySelectorAll('.service-item').forEach(item => {
    item.classList.toggle('selected', item.dataset.node === key);
  });
};

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
// Scroll Reveal
// ==========================================================================

function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

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
// Main Initialization
// ==========================================================================

let tensegrityScene = null;
let forceDiagram = null;

async function init() {
  // 3D Tensegrity
  const container3d = document.getElementById('tensegrity-canvas');
  if (container3d) {
    try {
      tensegrityScene = new TensegrityScene(container3d);
      window.tensegrityScene = tensegrityScene;
    } catch (err) {
      console.error('Tensegrity 3D initialization failed:', err);
      container3d.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--color-text-dim);font-family:var(--font-mono);">WebGL non disponibile — tensegrità 3D non supportata</div>';
    }
  }

  // 2D Force Diagram
  try {
    const canvas2d = document.getElementById('force-diagram-canvas');
    if (canvas2d) {
      forceDiagram = new ForceDiagram2D(canvas2d);
      window.forceDiagram = forceDiagram;
    }
  } catch (err) {
    console.error('Force diagram init failed:', err);
  }

  // Populate dynamic grids
  try { populateServicesGrid(); } catch (err) { console.error('Populate services failed:', err); }
  try { populateProjectsGrid(); } catch (err) { console.error('Populate projects failed:', err); }

  // Initialize interactions
  try { initSmoothScroll(); } catch (err) { console.error('Smooth scroll init failed:', err); }
  try { initScrollReveal(); } catch (err) { console.error('Scroll reveal init failed:', err); }

  // Force panel close
  document.querySelector('.force-panel-close')?.addEventListener('click', () => {
    const panel = document.getElementById('force-panel');
    panel.hidden = true;
    document.querySelectorAll('.legend-list li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.service-item').forEach(i => i.classList.remove('selected'));
    // Reset highlights
    if (tensegrityScene) {
      tensegrityScene.highlightNode(null);
      tensegrityScene.hoveredNode = null;
      tensegrityScene.hoveredClient = null;
    }
    if (forceDiagram) {
      forceDiagram.setSelectedNode(null);
      forceDiagram.setHoveredNode(null);
    }
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const panel = document.getElementById('force-panel');
      if (!panel.hidden) {
        panel.hidden = true;
        document.querySelectorAll('.legend-list li').forEach(li => li.classList.remove('active'));
        document.querySelectorAll('.service-item').forEach(i => i.classList.remove('selected'));
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('beforeunload', () => {
  if (tensegrityScene) tensegrityScene.destroy();
  if (forceDiagram) forceDiagram.destroy();
});