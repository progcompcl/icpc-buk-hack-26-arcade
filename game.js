// Rhythm Gorillas

const ARCADE_CONTROLS = {
  'P1U': ['w'], 'P1D': ['s'], 'P1L': ['a'], 'P1R': ['d'],
  'P2U': ['ArrowUp'], 'P2D': ['ArrowDown'], 'P2L': ['ArrowLeft'], 'P2R': ['ArrowRight'],
  'P1A': ['u'], 'P2A': ['r'],
  'START1': ['1', 'Enter'], 'START2': ['2']
};
const KEYBOARD_TO_ARCADE = {};
for (const [code, ks] of Object.entries(ARCADE_CONTROLS)) {
  ks.forEach(k => KEYBOARD_TO_ARCADE[k] = code);
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0d0d1a',
  scene: { create, update }
};
const game = new Phaser.Game(config);

let gfx, scene;
let keys = {};

// Rhythm — 2 steps per second
const RSTEP = 500;
let rStep = 0, rAccum = 0;

// Layout
// Male gorilla at cx=672: leftmost point at rest = 672-57 = 615
// Separator at 612 → 3px margin, gorillas always to the RIGHT
const SEPARATOR = 612;
const ZH = 186;              // 558 / 3
const ZY = [0, 186, 372];   // top-y of each zone
const SH = Math.floor(ZH / 4);          // slot height = 46px (4 slots per zone)
let lastObstSlot = [-1, -1, -1];        // last obstacle slot used per zone index

function zCY(z) { return ZY[z] + ZH / 2; }

// Characters (right of separator)
let m = { zone: 0, cy: zCY(0), targetCY: zCY(0), punch: 0, bounce: 0 };
let f = { zone: 2, cy: zCY(2), targetCY: zCY(2), punch: 0, bounce: 0 };

function happy() { return m.zone === f.zone; }

// Projectiles: obstacles (angry) and goodies (happy)
// Each: { x, y, w, h, speed, isObstacle, subtype }
// Start with right edge at SEPARATOR, travel left for 7 s.
// Distance = SEPARATOR px, speed = SEPARATOR/7000 px/ms (constant).
let projectiles = [];

// ── Player (Moose + Sled) ────────────────────────────────────────────────────
const MOVE_CD = 160, DMG_RATE = 0.4;
let mooseX = 132, sledX = 50;
let mooseLane = 5, mooseCY = 0, mooseMCool = 0, mooseHCool = 0;
let sledLane  = 5, sledCY  = 0;
let life = 3, score = 0;
let celebTimer = 0, damageTimer = 0, dmgShake = 0;
let gameOver = false;
let lifeText, scoreText;
let heartParticles = [], heartCooldown = 0;

function laneCY(lane) {
  return ZY[Math.floor(lane / 4)] + (lane % 4) * SH + SH / 2;
}

function create() {
  scene = this;
  gfx = this.add.graphics();
  this.input.keyboard.on('keydown', e => { keys[KEYBOARD_TO_ARCADE[e.key] || e.key] = true; });
  this.input.keyboard.on('keyup',   e => { keys[KEYBOARD_TO_ARCADE[e.key] || e.key] = false; });
  mooseCY = laneCY(mooseLane);
  sledCY  = laneCY(sledLane);
  lifeText  = this.add.text(8,   4, 'LIFE: 3',  { fontSize: '15px', color: '#ff4444', fontFamily: 'monospace' });
  scoreText = this.add.text(280, 4, 'SCORE: 0', { fontSize: '15px', color: '#ffff44', fontFamily: 'monospace' });
}

function update(time, delta) {
  if (gameOver) {
    gfx.clear();
    drawZones();
    drawSeparator();
    drawRhythmBar();
    return;
  }

  rAccum += delta;
  if (rAccum >= RSTEP) {
    rAccum -= RSTEP;
    rStep = (rStep + 1) % 4;
    onStep();
  }

  // Move projectiles left; remove when fully off left edge
  projectiles = projectiles.filter(p => { p.x -= p.speed * delta; return p.x + p.w > 0; });

  m.cy += (m.targetCY - m.cy) * 0.1;
  f.cy += (f.targetCY - f.cy) * 0.1;
  m.punch *= 0.72; f.punch *= 0.72;
  m.bounce *= 0.72; f.bounce *= 0.72;

  // Moose vertical input (ArrowUp/Down or W/S)
  mooseMCool -= delta;
  if (mooseMCool <= 0) {
    if ((keys['P2U'] || keys['P1U']) && mooseLane > 0) {
      mooseLane--; mooseMCool = MOVE_CD;
    } else if ((keys['P2D'] || keys['P1D']) && mooseLane < 11) {
      mooseLane++; mooseMCool = MOVE_CD;
    }
  }

  // Moose horizontal input (ArrowLeft/Right or A/D)
  mooseHCool -= delta;
  if (mooseHCool <= 0) {
    if ((keys['P2R'] || keys['P1R']) && mooseX < 275) {
      mooseX += 25; mooseHCool = MOVE_CD;
    } else if ((keys['P2L'] || keys['P1L']) && mooseX > 120) {
      mooseX -= 25; mooseHCool = MOVE_CD;
    }
  }
  sledX = mooseX - 82;

  // Tether: sled can't be more than 2 lanes from moose
  if (mooseLane - sledLane > 2) sledLane = mooseLane - 2;
  else if (sledLane - mooseLane > 2) sledLane = mooseLane + 2;

  // Smooth visual lerp
  mooseCY += (laneCY(mooseLane) - mooseCY) * 0.15;
  sledCY  += (laneCY(sledLane)  - sledCY)  * 0.12;

  // Timers
  damageTimer -= delta; if (damageTimer < 0) damageTimer = 0;
  celebTimer  -= delta; if (celebTimer  < 0) celebTimer  = 0;
  heartCooldown -= delta; if (heartCooldown < 0) heartCooldown = 0;
  dmgShake = damageTimer > 0 ? (Math.random() - 0.5) * 8 : 0;

  // Update heart particles
  for (let i = heartParticles.length - 1; i >= 0; i--) {
    const hp = heartParticles[i];
    hp.x += hp.vx; hp.y += hp.vy; hp.vy += 0.08; hp.alpha -= 0.025;
    if (hp.alpha <= 0) { heartParticles.splice(i, 1); }
  }

  // Collisions
  checkCollisions(delta);

  // HUD
  lifeText.setText('LIFE: ' + Math.max(0, Math.ceil(life)));
  scoreText.setText('SCORE: ' + score);

  gfx.clear();
  drawZones();
  drawProjectiles();
  drawRope();
  drawSled(sledX, sledCY, celebTimer > 0, dmgShake);
  // Draw breaking hearts on top of sled
  for (const hp of heartParticles) { drawBrokenHeart(hp.x, hp.y, hp.r, hp.alpha); }
  drawMoose(mooseX, mooseCY);
  drawSeparator();
  drawChar(m, 672, false);
  drawChar(f, 742, true);
  drawRhythmBar();
}

function onStep() {
  if (rStep === 0) {
    // New cycle: change zones, jump
    m.zone = Math.floor(Math.random() * 3);
    f.zone = Math.floor(Math.random() * 3);
    m.targetCY = zCY(m.zone);
    f.targetCY = zCY(f.zone);
    m.bounce = -32; f.bounce = -32;
    playTone(180, 0.09, 'sine');
    return; // no projectile on jump beat
  }

  if (happy()) {
    m.bounce = -12; f.bounce = -12;
    playTone(520, 0.07, 'sine');
    // Pick two different slots so the two goodies never overlap
    const s1 = Math.floor(Math.random() * 4);
    let s2; do { s2 = Math.floor(Math.random() * 4); } while (s2 === s1);
    spawnGoodie(m.zone, s1);
    spawnGoodie(f.zone, s2);
  } else {
    m.punch = 22; f.punch = 22;
    playTone(90, 0.11, 'sawtooth');
    spawnObstacle(m.zone);
    spawnObstacle(f.zone);
  }
}

// Obstacle: height = SH (ZH/4), width = 1x–3x height.
// 4 slots per zone; consecutive spawns never reuse the same slot.
// Starts with right edge flush at SEPARATOR, travels left in 7 s.
function spawnObstacle(zone) {
  const h = SH;
  const w = Math.floor(h * (1 + Math.random() * 2));
  let slot;
  do { slot = Math.floor(Math.random() * 4); }
  while (slot === lastObstSlot[zone]);
  lastObstSlot[zone] = slot;
  projectiles.push({
    x: SEPARATOR - w,
    y: ZY[zone] + slot * SH,
    w, h,
    speed: SEPARATOR / 7000,
    isObstacle: true,
    subtype: Math.floor(Math.random() * 3)
  });
}

// Goodie: half the current size (ZH/6 ≈ 31 px), centered in its slot.
// slot is chosen externally so two same-step goodies are always in different slots.
function spawnGoodie(zone, slot) {
  const h = Math.floor(ZH / 6);   // ≈ 31 px (half of old ZH/3 = 62)
  const w = h;
  const padding = Math.floor((SH - h) / 2); // center vertically within slot
  projectiles.push({
    x: SEPARATOR - w,
    y: ZY[zone] + slot * SH + padding,
    w, h,
    speed: SEPARATOR / 7000,
    isObstacle: false,
    subtype: Math.floor(Math.random() * 3)
  });
}

// ─── Player mechanics ────────────────────────────────────────────────────────

function checkCollisions(delta) {
  // Hitbox: just the wooden sled planks — no children, not too strict
  const sx = sledX - 24, sw = 48;
  const sy = sledCY - 5,  sh = 22;
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    if (p.x + p.w < sx || p.x > sx + sw || p.y + p.h < sy || p.y > sy + sh) continue;
    if (p.isObstacle) {
      life -= DMG_RATE * delta / 1000;
      if (life <= 0) {
        life = 0;
        if (!gameOver) {
          gameOver = true;
          scene.add.text(400, 252, 'GAME OVER', {
            fontSize: '52px', color: '#ff2200', fontFamily: 'monospace',
            stroke: '#000000', strokeThickness: 5
          }).setOrigin(0.5);
          scene.add.text(400, 316, 'SCORE: ' + score, {
            fontSize: '30px', color: '#ffff44', fontFamily: 'monospace',
            stroke: '#000000', strokeThickness: 3
          }).setOrigin(0.5);
        }
      }
      damageTimer = 200;
      // Spawn breaking hearts periodically while taking damage
      if (heartCooldown <= 0) {
        heartCooldown = 550;
        spawnHeartBreak(sledX, sledCY);
      }
    } else {
      if (p.subtype === 2) { life = Math.min(5, life + 1); }
      else { score += 10; }
      celebTimer = 300;
      playTone(880, 0.1, 'sine');
      projectiles.splice(i, 1);
    }
  }
}

function drawRope() {
  const x1 = sledX + 33, y1 = sledCY;
  const x2 = mooseX - 28, y2 = mooseCY;
  const tense = Math.abs(mooseLane - sledLane) >= 2;
  gfx.lineStyle(2, tense ? 0xff8800 : 0x885522, 1);
  gfx.beginPath();
  gfx.moveTo(x1, y1);
  if (tense) {
    gfx.lineTo(x2, y2);
  } else {
    for (let t = 1; t <= 8; t++) {
      const f = t / 8;
      gfx.lineTo(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f + 9 * Math.sin(f * Math.PI));
    }
  }
  gfx.strokePath();
}

function spawnHeartBreak(sx, sy) {
  const cxs = [sx - 19, sx, sx + 19];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      heartParticles.push({
        x: cxs[i] + (Math.random() - 0.5) * 10,
        y: sy - 22 + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 3,
        vy: -1.5 - Math.random() * 2,
        alpha: 0.9,
        r: 3 + Math.random() * 3
      });
    }
  }
}

function drawBrokenHeart(x, y, r, alpha) {
  // Left half: one bump + left half of triangle
  gfx.fillStyle(0xff2255, alpha);
  gfx.fillCircle(x - r * 0.7 - 2, y - r * 0.3, r * 0.6);
  gfx.fillTriangle(
    x - r * 1.3 - 2, y - r * 0.2,
    x - 2,           y - r * 0.2,
    x - 2,           y + r * 1.1
  );
  // Right half: one bump + right half of triangle
  gfx.fillCircle(x + r * 0.7 + 2, y - r * 0.3, r * 0.6);
  gfx.fillTriangle(
    x + 2,           y - r * 0.2,
    x + r * 1.3 + 2, y - r * 0.2,
    x + 2,           y + r * 1.1
  );
  // White shine on left bump
  gfx.fillStyle(0xffffff, alpha * 0.5);
  gfx.fillCircle(x - r * 0.9 - 2, y - r * 0.55, r * 0.22);
}

function drawMoose(mx, my) {
  // Shadow
  gfx.fillStyle(0x000000, 0.22);
  gfx.fillEllipse(mx, my + 24, 55, 10);
  // Legs (4 legs)
  gfx.fillStyle(0x3c1e00);
  gfx.fillRect(mx - 20, my + 10, 6, 18);
  gfx.fillRect(mx - 10, my + 10, 6, 18);
  gfx.fillRect(mx + 5,  my + 10, 6, 18);
  gfx.fillRect(mx + 15, my + 10, 6, 18);
  // Tail (cream, left side)
  gfx.fillStyle(0xddc888);
  gfx.fillEllipse(mx - 25, my + 2, 10, 8);
  // Body
  gfx.fillStyle(0x7b4419);
  gfx.fillEllipse(mx, my, 58, 32);
  // Darker back stripe
  gfx.fillStyle(0x5a3010);
  gfx.fillEllipse(mx - 4, my - 6, 36, 12);
  // Neck
  gfx.fillStyle(0x7b4419);
  gfx.fillRect(mx + 17, my - 18, 12, 20);
  // Head
  gfx.fillCircle(mx + 27, my - 22, 13);
  // Snout (long characteristic moose snout)
  gfx.fillStyle(0x5a3010);
  gfx.fillEllipse(mx + 39, my - 20, 18, 11);
  // Nostril
  gfx.fillStyle(0x2a0e00);
  gfx.fillCircle(mx + 45, my - 19, 2);
  // Eye
  gfx.fillStyle(0xffffff);
  gfx.fillCircle(mx + 22, my - 27, 4);
  gfx.fillStyle(0x111111);
  gfx.fillCircle(mx + 23, my - 27, 2);
  // Antlers (branching upward)
  gfx.fillStyle(0x5d3210);
  gfx.fillRect(mx + 19, my - 34, 3, 12);
  gfx.fillRect(mx + 25, my - 32, 3, 10);
  gfx.fillRect(mx + 13, my - 38, 14, 3);
  gfx.fillRect(mx + 22, my - 36, 12, 3);
  gfx.fillRect(mx + 13, my - 50, 3, 14);
  gfx.fillRect(mx + 22, my - 48, 3, 14);
  gfx.fillRect(mx + 30, my - 46, 3, 12);
}

function drawSled(sx, sy, celebrating, shake) {
  const dy = celebrating ? -10 : 0;
  const dx = shake;
  // Shadow
  gfx.fillStyle(0x000000, 0.2);
  gfx.fillEllipse(sx + dx, sy + 22 + dy, 70, 10);
  // Runners
  gfx.fillStyle(0x3c2005);
  gfx.fillRect(sx - 34 + dx, sy + 16 + dy, 68, 4);
  gfx.fillRect(sx - 30 + dx, sy + 12 + dy, 4, 8);
  gfx.fillRect(sx + 26 + dx, sy + 12 + dy, 4, 8);
  // Sled body (wooden planks)
  gfx.fillStyle(0x9c6530);
  gfx.fillRect(sx - 32 + dx, sy - 8 + dy, 64, 24);
  // Plank grooves
  gfx.fillStyle(0x7a4d20);
  gfx.fillRect(sx - 32 + dx, sy     + dy, 64, 2);
  gfx.fillRect(sx - 32 + dx, sy + 8 + dy, 64, 2);
  // Front board (upright)
  gfx.fillStyle(0x8a5520);
  gfx.fillRect(sx + 22 + dx, sy - 20 + dy, 8, 36);
  // 3 children
  const bc = celebrating
    ? [0xff8855, 0x55ff88, 0x5588ff]
    : [0xcc3311, 0x118833, 0x1133aa];
  const hc = [0xdd2200, 0x009922, 0x0022bb];
  const cxs = [sx - 19 + dx, sx + dx, sx + 19 + dx];
  for (let i = 0; i < 3; i++) {
    const cx2 = cxs[i];
    const cb = celebrating ? Math.sin(Date.now() * 0.012 + i * 2.1) * 5 : 0;
    // Jacket/body
    gfx.fillStyle(bc[i]);
    gfx.fillRect(cx2 - 6, sy - 17 + dy + cb, 12, 11);
    // Head (skin)
    gfx.fillStyle(0xffddb8);
    gfx.fillCircle(cx2, sy - 22 + dy + cb, 5);
    // Hat brim
    gfx.fillStyle(0xffffff);
    gfx.fillRect(cx2 - 7, sy - 28 + dy + cb, 14, 3);
    // Hat top
    gfx.fillStyle(hc[i]);
    gfx.fillRect(cx2 - 5, sy - 39 + dy + cb, 10, 13);
    // Arms out when celebrating
    if (celebrating) {
      gfx.fillStyle(bc[i]);
      gfx.fillRect(cx2 - 14, sy - 15 + dy + cb, 8, 4);
      gfx.fillRect(cx2 + 6,  sy - 15 + dy + cb, 8, 4);
    }
  }
}

// ─── Zone & separator ───────────────────────────────────────────────────────

function drawZones() {
  const cols = [0x1a1a2e, 0x16213e, 0x0f3460];
  for (let i = 0; i < 3; i++) {
    gfx.fillStyle(cols[i]);
    gfx.fillRect(0, ZY[i], 800, ZH);
    if (i < 2) {
      gfx.fillStyle(0x2a3a55);
      gfx.fillRect(0, ZY[i] + ZH - 1, 800, 2);
    }
  }
  // Mood tint — only in play zone
  if (happy()) {
    gfx.fillStyle(0x00ff88, 0.06);
    gfx.fillRect(0, ZY[m.zone], SEPARATOR, ZH);
  } else {
    gfx.fillStyle(0xff2200, 0.05);
    gfx.fillRect(0, ZY[m.zone], SEPARATOR, ZH);
    gfx.fillStyle(0xff2200, 0.05);
    gfx.fillRect(0, ZY[f.zone], SEPARATOR, ZH);
  }
}

function drawSeparator() {
  // Shadow on play-zone side
  gfx.fillStyle(0x000000, 0.35);
  gfx.fillRect(SEPARATOR - 4, 0, 4, 558);
  // Main line
  gfx.fillStyle(0x5577aa);
  gfx.fillRect(SEPARATOR, 0, 3, 558);
  // Highlight
  gfx.fillStyle(0x99bbdd);
  gfx.fillRect(SEPARATOR + 3, 0, 1, 558);
}

// ─── Projectiles ────────────────────────────────────────────────────────────

function drawProjectiles() {
  for (const p of projectiles) {
    if (p.isObstacle) {
      if (p.subtype === 0) drawBush(p.x, p.y, p.w, p.h);
      else if (p.subtype === 1) drawSnake(p.x, p.y, p.w, p.h);
      else drawOpossum(p.x, p.y, p.w, p.h);
    } else {
      if (p.subtype === 0) drawCoin(p.x, p.y, p.w, p.h);
      else if (p.subtype === 1) drawCandy(p.x, p.y, p.w, p.h);
      else drawHeart(p.x, p.y, p.w, p.h);
    }
  }
}

// ── Obstacle: spiny angry bush ──────────────────────────────────────────────
function drawBush(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  // Dark undergrowth shadow
  gfx.fillStyle(0x0d2208);
  gfx.fillEllipse(cx, cy + 4, w * 0.78, h * 0.55);
  // Main body
  gfx.fillStyle(0x2d6b1e);
  gfx.fillEllipse(cx, cy, w * 0.84, h * 0.72);
  // Darker leaf clusters
  gfx.fillStyle(0x1a4010);
  gfx.fillEllipse(cx - w * 0.15, cy + h * 0.06, w * 0.34, h * 0.3);
  gfx.fillEllipse(cx + w * 0.18, cy - h * 0.07, w * 0.28, h * 0.26);
  // Yellow-brown spines around perimeter
  gfx.fillStyle(0xc8a222);
  const n = Math.max(7, Math.round(w / 11));
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const bx = cx + Math.cos(a) * w * 0.37;
    const by = cy + Math.sin(a) * h * 0.31;
    gfx.fillTriangle(
      bx + Math.cos(a + 1.4) * 4, by + Math.sin(a + 1.4) * 4,
      bx - Math.cos(a + 1.4) * 4, by - Math.sin(a + 1.4) * 4,
      bx + Math.cos(a) * 12, by + Math.sin(a) * 10
    );
  }
  // Angry red eyes
  gfx.fillStyle(0xff2200);
  gfx.fillCircle(cx - w * 0.1, cy - h * 0.09, 4);
  gfx.fillCircle(cx + w * 0.1, cy - h * 0.09, 4);
  gfx.fillStyle(0x000000);
  gfx.fillCircle(cx - w * 0.1, cy - h * 0.09, 2);
  gfx.fillCircle(cx + w * 0.1, cy - h * 0.09, 2);
}

// ── Obstacle: angry snake (head faces left = direction of travel) ───────────
function drawSnake(x, y, w, h) {
  const cy = y + h / 2, r = h * 0.27;
  const segs = Math.max(4, Math.round(w / (r * 1.6)));
  // Body segments right-to-left (draw back-to-front)
  for (let i = segs; i >= 0; i--) {
    const sx = x + w * (1 - i / segs);
    const sy = cy + Math.sin(i * 1.0) * h * 0.22;
    gfx.fillStyle(i % 2 === 0 ? 0x4ea82a : 0x2d6b1e);
    gfx.fillCircle(sx, sy, r);
  }
  // Head (left side, facing direction of travel)
  const hx = x + r * 1.4, hy = cy;
  gfx.fillStyle(0x66cc33);
  gfx.fillEllipse(hx, hy, r * 2.8, h * 0.56);
  // Angry eyes
  gfx.fillStyle(0xff3300);
  gfx.fillCircle(hx - r * 0.35, hy - r * 0.3, 4);
  gfx.fillCircle(hx + r * 0.35, hy - r * 0.3, 4);
  gfx.fillStyle(0x000000);
  gfx.fillCircle(hx - r * 0.35, hy - r * 0.3, 2);
  gfx.fillCircle(hx + r * 0.35, hy - r * 0.3, 2);
  // Forked tongue extending left
  gfx.fillStyle(0xff1144);
  gfx.fillRect(x, hy - 2, r * 1.2, 3);
  gfx.fillRect(x, hy - 6, r * 0.65, 3);
  gfx.fillRect(x, hy + 3, r * 0.65, 3);
}

// ── Obstacle: angry opossum (head faces left) ────────────────────────────────
function drawOpossum(x, y, w, h) {
  const cy = y + h / 2;
  // Coiled tail (right side)
  gfx.fillStyle(0xf0c8a0);
  gfx.fillEllipse(x + w * 0.83, cy + h * 0.14, w * 0.24, h * 0.26);
  gfx.fillEllipse(x + w * 0.75, cy + h * 0.32, w * 0.18, h * 0.2);
  // Body
  gfx.fillStyle(0x909090);
  gfx.fillEllipse(x + w * 0.55, cy, w * 0.58, h * 0.62);
  // Belly
  gfx.fillStyle(0xd8d8d8);
  gfx.fillEllipse(x + w * 0.5, cy + h * 0.06, w * 0.36, h * 0.38);
  // Head
  const hx = x + w * 0.22, hy = cy - h * 0.04;
  gfx.fillStyle(0xa8a8a8);
  gfx.fillCircle(hx, hy, h * 0.24);
  // Ear
  gfx.fillStyle(0x888888);
  gfx.fillTriangle(hx - h * 0.04, hy - h * 0.22, hx + h * 0.1, hy - h * 0.22, hx + h * 0.03, hy - h * 0.42);
  gfx.fillStyle(0xf0aaaa);
  gfx.fillTriangle(hx - h * 0.02, hy - h * 0.22, hx + h * 0.08, hy - h * 0.22, hx + h * 0.03, hy - h * 0.38);
  // Pointed snout
  gfx.fillStyle(0xbbbbbb);
  gfx.fillTriangle(hx - h * 0.27, hy, hx - h * 0.06, hy - h * 0.09, hx - h * 0.06, hy + h * 0.09);
  // Angry eye
  gfx.fillStyle(0xff3300);
  gfx.fillCircle(hx + h * 0.04, hy - h * 0.06, 4);
  gfx.fillStyle(0x000000);
  gfx.fillCircle(hx + h * 0.04, hy - h * 0.06, 2);
  // Legs
  gfx.fillStyle(0x888888);
  gfx.fillRect(x + w * 0.38, cy + h * 0.28, 7, 11);
  gfx.fillRect(x + w * 0.54, cy + h * 0.28, 7, 11);
}

// ── Goodie: gold coin ────────────────────────────────────────────────────────
function drawCoin(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  const r = Math.min(w, h) * 0.42;
  gfx.fillStyle(0xc8900a);
  gfx.fillCircle(cx, cy, r);
  gfx.fillStyle(0xffd700);
  gfx.fillCircle(cx, cy, r * 0.84);
  gfx.fillStyle(0xffed8a);
  gfx.fillCircle(cx, cy, r * 0.6);
  // Cross symbol
  gfx.fillStyle(0xc8900a);
  gfx.fillRect(cx - 2, cy - r * 0.48, 4, r * 0.96);
  gfx.fillRect(cx - r * 0.48, cy - 2, r * 0.96, 4);
  // Sparkle
  gfx.fillStyle(0xffffff);
  gfx.fillCircle(cx - r * 0.48, cy - r * 0.52, 2);
}

// ── Goodie: lollipop candy ───────────────────────────────────────────────────
function drawCandy(x, y, w, h) {
  const cx = x + w / 2;
  const r = Math.min(w, h) * 0.36;
  const ccy = y + r + 6;
  // Stick
  gfx.fillStyle(0xddddb8);
  gfx.fillRect(cx - 2, ccy + r, 4, h - r - (ccy - y) - 4);
  // Candy circle
  gfx.fillStyle(0xff3366);
  gfx.fillCircle(cx, ccy, r);
  // White swirl
  gfx.fillStyle(0xffffff);
  for (let i = 0; i < 3; i++) {
    const a = i * Math.PI * 2 / 3;
    gfx.fillTriangle(
      cx, ccy,
      cx + Math.cos(a) * r, ccy + Math.sin(a) * r,
      cx + Math.cos(a + 0.75) * r, ccy + Math.sin(a + 0.75) * r
    );
  }
  gfx.fillStyle(0xff3366);
  gfx.fillCircle(cx, ccy, r * 0.3);
  // Shine
  gfx.fillStyle(0xffffff);
  gfx.fillCircle(cx - r * 0.32, ccy - r * 0.34, r * 0.16);
}

// ── Goodie: heart ────────────────────────────────────────────────────────────
function drawHeart(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  const r = Math.min(w, h) * 0.27;
  gfx.fillStyle(0xff2255);
  gfx.fillCircle(cx - r, cy - r * 0.2, r);
  gfx.fillCircle(cx + r, cy - r * 0.2, r);
  gfx.fillTriangle(cx - r * 1.92, cy - r * 0.18, cx + r * 1.92, cy - r * 0.18, cx, cy + r * 1.8);
  // Shine
  gfx.fillStyle(0xff88aa);
  gfx.fillCircle(cx - r * 0.85, cy - r * 0.55, r * 0.34);
}

// ─── Characters ─────────────────────────────────────────────────────────────

// Front-facing DK-style gorilla.
// When angry, left arm punches toward the LEFT (into the play zone).
function drawChar(ch, cx, isFemale) {
  const y = ch.cy + ch.bounce;
  const h = happy();
  const B = 0x7b3f00, S = 0xf4a460, D = 0x3d1f00;

  // Shadow
  gfx.fillStyle(0x000000, 0.28);
  gfx.fillEllipse(cx, y + 56, 62, 12);

  // Legs
  gfx.fillStyle(D);
  gfx.fillRect(cx - 18, y + 28, 14, 28);
  gfx.fillRect(cx + 4,  y + 28, 14, 28);
  gfx.fillEllipse(cx - 12, y + 58, 24, 10);
  gfx.fillEllipse(cx + 12, y + 58, 24, 10);

  // Body
  gfx.fillStyle(B);
  gfx.fillRect(cx - 28, y - 22, 56, 52);
  gfx.fillStyle(S);
  gfx.fillEllipse(cx, y + 5, 36, 42);

  // Tie
  gfx.fillStyle(h ? 0xff3333 : 0x770000);
  gfx.fillTriangle(cx - 5, y - 7, cx + 5, y - 7, cx, y + 17);

  // Arms
  gfx.fillStyle(B);
  if (h) {
    // Arms up: celebrate!
    gfx.fillRect(cx - 46, y - 40, 18, 28);
    gfx.fillRect(cx + 28, y - 40, 18, 28);
    gfx.fillStyle(S);
    gfx.fillCircle(cx - 38, y - 44, 10);
    gfx.fillCircle(cx + 38, y - 44, 10);
  } else {
    // Left arm punches LEFT into play zone
    const ext = 22 + ch.punch;
    gfx.fillRect(cx - 28 - ext, y - 7, ext + 10, 15);
    gfx.fillStyle(S);
    gfx.fillCircle(cx - 24 - ext, y + 1, 11); // fist
    gfx.fillStyle(B);
    // Right arm raised in anger
    gfx.fillRect(cx + 26, y - 28, 14, 28);
    gfx.fillStyle(S);
    gfx.fillCircle(cx + 33, y - 30, 9);
  }

  // Head
  gfx.fillStyle(B);
  gfx.fillCircle(cx, y - 36, 28);
  // Muzzle
  gfx.fillStyle(S);
  gfx.fillEllipse(cx, y - 25, 32, 22);
  // Nostrils
  gfx.fillStyle(D);
  gfx.fillCircle(cx - 6, y - 23, 2);
  gfx.fillCircle(cx + 6, y - 23, 2);

  // Eyes
  gfx.fillStyle(0xffffff);
  gfx.fillCircle(cx - 11, y - 44, 7);
  gfx.fillCircle(cx + 11, y - 44, 7);
  gfx.fillStyle(0x111111);
  gfx.fillCircle(cx - 11, h ? y - 43 : y - 46, 4);
  gfx.fillCircle(cx + 11, h ? y - 43 : y - 46, 4);

  // Eyebrows
  gfx.fillStyle(D);
  if (h) {
    gfx.fillRect(cx - 17, y - 53, 12, 2);
    gfx.fillRect(cx +  5, y - 53, 12, 2);
  } else {
    gfx.fillRect(cx - 17, y - 55, 12, 3); // furrowed inward
    gfx.fillRect(cx +  5, y - 53, 12, 3);
  }

  // Mouth (5-pixel arc: smile or frown)
  gfx.fillStyle(D);
  for (let i = 0; i < 5; i++) {
    const arc = i < 2.5 ? i : 4 - i; // 0,1,2,1,0
    const my = h ? y - 16 + arc : y - 14 - arc;
    gfx.fillRect(cx - 8 + i * 4, my, 3, 3);
  }

  // Female: bow / moño
  if (isFemale) {
    gfx.fillStyle(0xff69b4);
    gfx.fillEllipse(cx - 13, y - 67, 20, 14);
    gfx.fillEllipse(cx + 13, y - 67, 20, 14);
    gfx.fillStyle(0xff1493);
    gfx.fillCircle(cx, y - 67, 6);
  }
}

// ─── Rhythm bar ─────────────────────────────────────────────────────────────

function drawRhythmBar() {
  const BY = 558, BH = 40, CW = 200;
  for (let i = 0; i < 4; i++) {
    const active = i === rStep;
    gfx.fillStyle(active ? 0x222200 : 0x0a0a0a, 0.92);
    gfx.fillRect(i * CW, BY, CW, BH);
    gfx.lineStyle(1, active ? 0xffff00 : 0x333333, 1);
    gfx.strokeRect(i * CW, BY, CW, BH);
    const nc = active ? 0xffff00 : 0x555555;
    const nx = i * CW + CW / 2, ny = BY + 16;
    gfx.fillStyle(nc);
    gfx.fillEllipse(nx, ny + 6, 12, 9);
    gfx.fillRect(nx + 5, ny - 10, 2, 17);
    gfx.fillRect(nx + 5, ny - 10, 7, 2);
  }
}

// ─── Audio ──────────────────────────────────────────────────────────────────

function playTone(freq, vol, type) {
  try {
    const ctx = scene.sound.context;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type || 'square';
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.22);
  } catch(e) {}
}
