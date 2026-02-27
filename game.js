// Minimalist Pong - 1P vs AI or 2P mode
// Controls: P1 uses W/S, P2 uses Arrow Up/Down

const ARCADE_CONTROLS = {
  'P1U': ['w'], 'P1D': ['s'],
  'P2U': ['ArrowUp'], 'P2D': ['ArrowDown'],
  'P1A': ['u'], 'P2A': ['r'],
  'START1': ['1', 'Enter'], 'START2': ['2']
};

const KEYBOARD_TO_ARCADE = {};
for (const [code, keys] of Object.entries(ARCADE_CONTROLS)) {
  keys.forEach(k => KEYBOARD_TO_ARCADE[k] = code);
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  scene: { create, update }
};

const game = new Phaser.Game(config);

// Game state
let state = 'menu'; // menu, playing, gameover
let players = 1;
let gfx, p1, p2, ball;
let score1 = 0, score2 = 0;
let keys = {};
let winScore = 5;
let beatInterval, scene;
let particles = [];

// Rhythm
const RHYTHM_INTERVAL = 500; // ms — 2 steps per second
let rhythmStep = 0, rhythmAccum = 0;

// Paddle & ball settings
const PW = 12, PH = 80, PS = 6;
const BR = 8, BS = 3;

function create() {
  scene = this;
  gfx = this.add.graphics();
  resetGame();
  
  this.input.keyboard.on('keydown', e => {
    const k = KEYBOARD_TO_ARCADE[e.key] || e.key;
    keys[k] = true;
    
    if (state === 'menu') {
      if (k === 'P1U' || k === 'P2U') { players = 1; }
      if (k === 'P1D' || k === 'P2D') { players = 2; }
      if (k === 'START1' || k === 'P1A') { startGame(); }
    } else if (state === 'gameover') {
      if (k === 'START1' || k === 'P1A') { state = 'menu'; resetGame(); }
    }
  });
  
  this.input.keyboard.on('keyup', e => {
    const k = KEYBOARD_TO_ARCADE[e.key] || e.key;
    keys[k] = false;
  });
}

function resetGame() {
  p1 = { x: 30, y: 300 - PH/2 };
  p2 = { x: 770 - PW, y: 300 - PH/2 };
  score1 = 0; score2 = 0;
  resetBall(1);
}

function resetBall(dir) {
  ball = { 
    x: 400, y: 300, 
    vx: BS * dir, 
    vy: (Math.random() - 0.5) * BS * 1.5 
  };
}

function startGame() {
  state = 'playing';
  resetGame();
  rhythmStep = 0;
  rhythmAccum = 0;
  startBeat();
}

function stopBeat() {
  if (beatInterval) {
    clearInterval(beatInterval);
    beatInterval = null;
  }
}

function startBeat() {
  stopBeat();
  let beat = 0;
  beatInterval = setInterval(() => {
    if (state !== 'playing') { stopBeat(); return; }
    const b = beat % 16;
    // Kick on 0, 4, 8, 12
    if (b % 4 === 0) playTone(scene, 150, 0.08);
    // Hi-hat on offbeats
    if (b % 2 === 1) playTone(scene, 1200, 0.02);
    // Snare on 4, 12
    if (b === 4 || b === 12) playTone(scene, 250, 0.06);
    // Bass line melody
    const bass = [300, 0, 300, 0, 400, 0, 350, 0, 300, 0, 300, 0, 450, 0, 400, 0];
    if (bass[b]) playTone(scene, bass[b], 0.1);
    beat++;
  }, 150);
}

function update(time, delta) {
  gfx.clear();
  
  if (state === 'menu') {
    drawMenu();
  } else if (state === 'playing') {
    updateGame(delta);
    drawGame();
  } else if (state === 'gameover') {
    drawGameOver();
  }
}

function drawMenu() {
  // Title with glow effect
  gfx.fillStyle(0xffffff);
  drawText(gfx, 'PONG', 400, 120, 5);
  
  // Subtitle
  gfx.fillStyle(0x00ffff);
  drawText(gfx, 'ARCADE EDITION', 400, 200, 1.5);
  
  // Mode selection with better spacing
  const c1 = players === 1 ? 0x00ff00 : 0x555555;
  const c2 = players === 2 ? 0x00ff00 : 0x555555;
  
  gfx.fillStyle(c1);
  drawText(gfx, '1 PLAYER', 400, 300, 2.5);
  gfx.fillStyle(c2);
  drawText(gfx, '2 PLAYERS', 400, 370, 2.5);
  
  // Arrow indicator
  const arrowY = players === 1 ? 300 : 370;
  gfx.fillStyle(0x00ff00);
  gfx.fillTriangle(150, arrowY + 15, 150, arrowY + 35, 170, arrowY + 25);
  gfx.fillTriangle(650, arrowY + 15, 650, arrowY + 35, 630, arrowY + 25);
  
  // Instructions with better spacing
  gfx.fillStyle(0x999999);
  drawText(gfx, 'USE UP DOWN TO SELECT', 400, 480, 1.2);
  gfx.fillStyle(0xffff00);
  drawText(gfx, 'PRESS START', 400, 530, 1.5);
}

function updateGame(delta) {
  // Rhythm step advance
  rhythmAccum += delta;
  if (rhythmAccum >= RHYTHM_INTERVAL) {
    rhythmAccum -= RHYTHM_INTERVAL;
    rhythmStep = (rhythmStep + 1) % 4;
  }

  // P1 movement
  if (keys['P1U'] && p1.y > 0) p1.y -= PS;
  if (keys['P1D'] && p1.y < 600 - PH) p1.y += PS;
  
  // P2 movement (AI or player)
  if (players === 2) {
    if (keys['P2U'] && p2.y > 0) p2.y -= PS;
    if (keys['P2D'] && p2.y < 600 - PH) p2.y += PS;
  } else {
    // Simple AI: follow ball with some delay
    const center = p2.y + PH/2;
    const diff = ball.y - center;
    if (Math.abs(diff) > 10) {
      p2.y += Math.sign(diff) * (PS * 0.7);
    }
    p2.y = Math.max(0, Math.min(600 - PH, p2.y));
  }
  
  // Ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;
  
  // Top/bottom bounce
  if (ball.y <= BR || ball.y >= 600 - BR) {
    ball.vy *= -1;
    ball.y = ball.y <= BR ? BR : 600 - BR;
    playWallHit(this);
    createParticles(ball.x, ball.y, 0x00ffff);
  }
  
  // Paddle collision P1
  if (ball.x - BR <= p1.x + PW && ball.x + BR >= p1.x &&
      ball.y >= p1.y && ball.y <= p1.y + PH && ball.vx < 0) {
    ball.vx *= -1.08;
    ball.vy += ((ball.y - (p1.y + PH/2)) / PH) * 3;
    ball.x = p1.x + PW + BR;
    playPaddleHit(this);
    createParticles(ball.x, ball.y, 0x00ff00);
  }
  
  // Paddle collision P2
  if (ball.x + BR >= p2.x && ball.x - BR <= p2.x + PW &&
      ball.y >= p2.y && ball.y <= p2.y + PH && ball.vx > 0) {
    ball.vx *= -1.08;
    ball.vy += ((ball.y - (p2.y + PH/2)) / PH) * 3;
    ball.x = p2.x - BR;
    playPaddleHit(this);
    createParticles(ball.x, ball.y, 0xff00ff);
  }
  
  // Speed limit
  ball.vx = Math.sign(ball.vx) * Math.min(Math.abs(ball.vx), 12);
  ball.vy = Math.sign(ball.vy) * Math.min(Math.abs(ball.vy), 8);
  
  // Score
  if (ball.x < 0) {
    score2++;
    playScoreSound(this);
    if (score2 >= winScore) { state = 'gameover'; stopBeat(); }
    else { resetBall(-1); }
  }
  if (ball.x > 800) {
    score1++;
    playScoreSound(this);
    if (score1 >= winScore) { state = 'gameover'; stopBeat(); }
    else { resetBall(1); }
  }
}

function drawGame() {
  // Update and draw particles
  particles = particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life > 0) {
      const alpha = p.life / 20;
      gfx.fillStyle(p.color, alpha);
      gfx.fillCircle(p.x, p.y, p.size);
      return true;
    }
    return false;
  });
  
  // Center line
  gfx.fillStyle(0x333333);
  for (let y = 0; y < 600; y += 30) {
    gfx.fillRect(398, y, 4, 15);
  }
  
  // Paddles with glow
  gfx.fillStyle(0x00ff00, 0.3);
  gfx.fillRect(p1.x - 2, p1.y - 2, PW + 4, PH + 4);
  gfx.fillStyle(0xff00ff, 0.3);
  gfx.fillRect(p2.x - 2, p2.y - 2, PW + 4, PH + 4);
  
  gfx.fillStyle(0xffffff);
  gfx.fillRect(p1.x, p1.y, PW, PH);
  gfx.fillRect(p2.x, p2.y, PW, PH);
  
  // Ball with glow
  gfx.fillStyle(0xffffff, 0.3);
  gfx.fillCircle(ball.x, ball.y, BR + 3);
  gfx.fillStyle(0xffffff);
  gfx.fillCircle(ball.x, ball.y, BR);
  
  // Score with glow
  gfx.fillStyle(0x00ff00);
  drawText(gfx, score1.toString(), 300, 40, 4);
  gfx.fillStyle(0xff00ff);
  drawText(gfx, score2.toString(), 500, 40, 4);
  
  // Player labels
  gfx.fillStyle(0x00ff00);
  drawText(gfx, 'P1', 60, 30, 1.2);
  gfx.fillStyle(0xff00ff);
  drawText(gfx, players === 1 ? 'AI' : 'P2', 720, 30, 1.2);

  drawRhythmBar();
}

function drawRhythmNote(cx, cy, color) {
  gfx.fillStyle(color);
  gfx.fillEllipse(cx, cy + 6, 12, 9);  // note head
  gfx.fillRect(cx + 5, cy - 10, 2, 17); // stem
  gfx.fillRect(cx + 5, cy - 10, 7, 2);  // flag
}

function drawRhythmBar() {
  const BY = 558, BH = 40, CW = 200;
  for (let i = 0; i < 4; i++) {
    const active = i === rhythmStep;
    gfx.fillStyle(active ? 0x222200 : 0x0a0a0a, 0.92);
    gfx.fillRect(i * CW, BY, CW, BH);
    gfx.lineStyle(1, active ? 0xffff00 : 0x333333, 1);
    gfx.strokeRect(i * CW, BY, CW, BH);
    drawRhythmNote(i * CW + CW / 2, BY + BH / 2 - 4, active ? 0xffff00 : 0x555555);
  }
}

function drawGameOver() {
  const winner = score1 >= winScore ? 'P1' : (players === 1 ? 'AI' : 'P2');
  
  gfx.fillStyle(0xff0000);
  drawText(gfx, 'GAME OVER', 400, 200, 3);
  
  gfx.fillStyle(0x00ff00);
  drawText(gfx, winner + ' WINS', 400, 300, 2);
  
  gfx.fillStyle(0xffffff);
  drawText(gfx, score1 + ' - ' + score2, 400, 380, 2);
  
  gfx.fillStyle(0x888888);
  drawText(gfx, 'PRESS START', 400, 480, 1);
}

// Simple pixel text renderer
function drawText(g, text, x, y, size) {
  const chars = {
    'A': [0x7C,0x92,0x92,0x7C,0x92], 'B': [0xFE,0x92,0x92,0x6C,0x00],
    'C': [0x7C,0x82,0x82,0x44,0x00], 'D': [0xFE,0x82,0x82,0x7C,0x00],
    'E': [0xFE,0x92,0x92,0x82,0x00], 'G': [0x7C,0x82,0x92,0x74,0x00],
    'I': [0x00,0x82,0xFE,0x82,0x00], 'L': [0xFE,0x80,0x80,0x80,0x00],
    'M': [0xFE,0x04,0x18,0x04,0xFE], 'N': [0xFE,0x08,0x10,0x20,0xFE],
    'O': [0x7C,0x82,0x82,0x7C,0x00], 'P': [0xFE,0x12,0x12,0x0C,0x00],
    'R': [0xFE,0x12,0x32,0xCC,0x00], 'S': [0x64,0x92,0x92,0x4C,0x00],
    'T': [0x02,0x02,0xFE,0x02,0x02], 'U': [0x7E,0x80,0x80,0x7E,0x00],
    'V': [0x3E,0x40,0x80,0x40,0x3E], 'W': [0x7E,0x80,0x70,0x80,0x7E],
    'Y': [0x06,0x08,0xF0,0x08,0x06],
    '0': [0x7C,0xA2,0x92,0x8A,0x7C], '1': [0x00,0x84,0xFE,0x80,0x00],
    '2': [0xC4,0xA2,0x92,0x8C,0x00], '3': [0x44,0x92,0x92,0x6C,0x00],
    '4': [0x1E,0x10,0xFE,0x10,0x00], '5': [0x4E,0x8A,0x8A,0x72,0x00],
    '6': [0x7C,0x92,0x92,0x64,0x00], '7': [0x02,0xE2,0x12,0x0E,0x00],
    '8': [0x6C,0x92,0x92,0x6C,0x00], '9': [0x4C,0x92,0x92,0x7C,0x00],
    ' ': [0x00,0x00,0x00,0x00,0x00], '-': [0x10,0x10,0x10,0x10,0x00]
  };
  
  const spacing = 7 * size;
  let startX = x - (text.length * spacing) / 2;
  
  for (let c of text) {
    const data = chars[c];
    if (data) {
      for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 8; row++) {
          if (data[col] & (1 << row)) {
            g.fillRect(startX + col * size, y + row * size, size - 1, size - 1);
          }
        }
      }
    }
    startX += spacing;
  }
}

function playTone(scene, freq, dur) {
  try {
    const ctx = scene.sound.context;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'square';
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch(e) {}
}

function playPaddleHit(scene) {
  try {
    const ctx = scene.sound.context;
    // Main hit
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.value = 800;
    osc1.type = 'square';
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.1);
    
    // Harmonic
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 1200;
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0.1, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.08);
  } catch(e) {}
}

function playWallHit(scene) {
  try {
    const ctx = scene.sound.context;
    // Bounce sound
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.value = 400;
    osc1.type = 'triangle';
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.07);
    
    // Lower thump
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 150;
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0.15, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.05);
  } catch(e) {}
}

function playScoreSound(scene) {
  try {
    const ctx = scene.sound.context;
    // Epic descending tone for score
    [600, 450, 300, 200].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sawtooth';
      const t = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  } catch(e) {}
}

function createParticles(x, y, color) {
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    particles.push({
      x, y,
      vx: Math.cos(angle) * 3,
      vy: Math.sin(angle) * 3,
      color,
      size: 2 + Math.random() * 2,
      life: 15 + Math.random() * 10
    });
  }
}
