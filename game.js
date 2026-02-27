// Rhythm Gorillas

const ARCADE_CONTROLS = {
  'P1U': ['w'], 'P1D': ['s'],
  'P2U': ['ArrowUp'], 'P2D': ['ArrowDown'],
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

// 3 horizontal zones above the rhythm bar (y=558)
const ZH = 186;              // 558 / 3
const ZY = [0, 186, 372];   // top-y of each zone

function zCY(z) { return ZY[z] + ZH / 2; }

// Characters: male (m) at x=672, female (f) at x=742
let m = { zone: 0, cy: zCY(0), targetCY: zCY(0), punch: 0, bounce: 0 };
let f = { zone: 2, cy: zCY(2), targetCY: zCY(2), punch: 0, bounce: 0 };

function happy() { return m.zone === f.zone; }

function create() {
  scene = this;
  gfx = this.add.graphics();
  this.input.keyboard.on('keydown', e => { keys[KEYBOARD_TO_ARCADE[e.key] || e.key] = true; });
  this.input.keyboard.on('keyup',  e => { keys[KEYBOARD_TO_ARCADE[e.key] || e.key] = false; });
}

function update(time, delta) {
  rAccum += delta;
  if (rAccum >= RSTEP) {
    rAccum -= RSTEP;
    rStep = (rStep + 1) % 4;
    onStep();
  }

  // Lerp characters toward target zone centers
  m.cy += (m.targetCY - m.cy) * 0.1;
  f.cy += (f.targetCY - f.cy) * 0.1;

  // Decay animations
  m.punch *= 0.72; f.punch *= 0.72;
  m.bounce *= 0.72; f.bounce *= 0.72;

  gfx.clear();
  drawZones();
  drawChar(m, 672, false);
  drawChar(f, 742, true);
  drawRhythmBar();
}

function onStep() {
  if (rStep === 0) {
    // New cycle: pick random zones and jump
    m.zone = Math.floor(Math.random() * 3);
    f.zone = Math.floor(Math.random() * 3);
    m.targetCY = zCY(m.zone);
    f.targetCY = zCY(f.zone);
    m.bounce = -32; f.bounce = -32;
    playTone(180, 0.09, 'sine');
    return; // zone-jump beat — skip reaction animation
  }

  if (happy()) {
    // Happy: bounce
    m.bounce = -12; f.bounce = -12;
    playTone(520, 0.07, 'sine');
  } else {
    // Angry: punch into zone
    m.punch = 22; f.punch = 22;
    playTone(90, 0.11, 'sawtooth');
  }
}

// ─── Drawing ───────────────────────────────────────────────────────────────

function drawZones() {
  const zoneCols = [0x1a1a2e, 0x16213e, 0x0f3460];
  for (let i = 0; i < 3; i++) {
    gfx.fillStyle(zoneCols[i]);
    gfx.fillRect(0, ZY[i], 800, ZH);
    if (i < 2) {
      gfx.fillStyle(0x2a3a55);
      gfx.fillRect(0, ZY[i] + ZH - 1, 800, 2);
    }
  }
  // Tint for mood
  if (happy()) {
    gfx.fillStyle(0x00ff88, 0.06);
    gfx.fillRect(0, ZY[m.zone], 800, ZH);
  } else {
    gfx.fillStyle(0xff2200, 0.05);
    gfx.fillRect(0, ZY[m.zone], 800, ZH);
    gfx.fillStyle(0xff2200, 0.05);
    gfx.fillRect(0, ZY[f.zone], 800, ZH);
  }
}

// Draw a front-facing DK-style gorilla.
// cx = horizontal center, ch.cy = vertical center (visual y + bounce).
// Punching arm extends to the LEFT (into the zone area).
function drawChar(ch, cx, isFemale) {
  const y = ch.cy + ch.bounce;
  const h = happy();
  const B = 0x7b3f00;  // body brown
  const S = 0xf4a460;  // skin/muzzle
  const D = 0x3d1f00;  // dark brown

  // Drop shadow
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
  // Belly
  gfx.fillStyle(S);
  gfx.fillEllipse(cx, y + 5, 36, 42);

  // Tie (red when happy, dark red when angry)
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
    // Left arm punches toward the zone (to the left)
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
  // Pupils
  gfx.fillStyle(0x111111);
  gfx.fillCircle(cx - 11, h ? y - 43 : y - 46, 4);
  gfx.fillCircle(cx + 11, h ? y - 43 : y - 46, 4);

  // Eyebrows
  gfx.fillStyle(D);
  if (h) {
    // Raised (happy)
    gfx.fillRect(cx - 17, y - 53, 12, 2);
    gfx.fillRect(cx +  5, y - 53, 12, 2);
  } else {
    // Furrowed inward (angry)
    gfx.fillRect(cx - 17, y - 55, 12, 3);
    gfx.fillRect(cx +  5, y - 53, 12, 3);
  }

  // Mouth (5 pixel-squares forming arc)
  gfx.fillStyle(D);
  for (let i = 0; i < 5; i++) {
    const arc = i < 2.5 ? i : 4 - i;  // 0,1,2,1,0
    // Happy: arc bows down (smile); Angry: arc bows up (frown)
    const my = h ? y - 16 + arc : y - 14 - arc;
    gfx.fillRect(cx - 8 + i * 4, my, 3, 3);
  }

  // Female: bow / moño on top of head
  if (isFemale) {
    gfx.fillStyle(0xff69b4);
    gfx.fillEllipse(cx - 13, y - 67, 20, 14);
    gfx.fillEllipse(cx + 13, y - 67, 20, 14);
    gfx.fillStyle(0xff1493);
    gfx.fillCircle(cx, y - 67, 6);
  }
}

function drawRhythmBar() {
  const BY = 558, BH = 40, CW = 200;
  for (let i = 0; i < 4; i++) {
    const active = i === rStep;
    gfx.fillStyle(active ? 0x222200 : 0x0a0a0a, 0.92);
    gfx.fillRect(i * CW, BY, CW, BH);
    gfx.lineStyle(1, active ? 0xffff00 : 0x333333, 1);
    gfx.strokeRect(i * CW, BY, CW, BH);
    // Note symbol
    const nc = active ? 0xffff00 : 0x555555;
    const nx = i * CW + CW / 2, ny = BY + 16;
    gfx.fillStyle(nc);
    gfx.fillEllipse(nx, ny + 6, 12, 9);   // head
    gfx.fillRect(nx + 5, ny - 10, 2, 17); // stem
    gfx.fillRect(nx + 5, ny - 10, 7, 2);  // flag
  }
}

// ─── Audio ─────────────────────────────────────────────────────────────────

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
