const ARCADE_CONTROLS = {
  P1U: ["w", "W", "ArrowUp", "P1U"],
  P1D: ["s", "S", "ArrowDown", "P1D"],
  P1L: ["a", "A", "ArrowLeft", "P1L"],
  P1R: ["d", "D", "ArrowRight", "P1R"],
  P1DL: ["z", "Z", "P1DL"],
  P1DR: ["c", "C", "P1DR"],
  P1X: ["j", "J", "P1X"],
  P1Y: ["k", "K", "P1Y"],
  P1Z: ["l", "L", "P1Z"],
  P1RUN: ["o", "O", "P1C", "P1RUN"],
  P1A: ["u", "U", "P1A"],
  P1B: ["i", "I", "P1B"],
  START1: ["1", "Enter", "START1"],
  P2U: ["ArrowUp", "P2U"],
  P2D: ["ArrowDown", "P2D"],
  P2L: ["ArrowLeft", "P2L"],
  P2R: ["ArrowRight", "P2R"],
  P2X: ["f", "F", "P2X"],
  P2Y: ["g", "G", "P2Y"],
  P2Z: ["h", "H", "P2Z"],
  P2RUN: ["y", "Y", "P2C", "P2RUN"],
  P2A: ["r", "R", "P2A"],
  P2B: ["t", "T", "P2B"],
  START2: ["2", "START2"],
};

const KEYBOARD_TO_ARCADE = {};
for (const [arcade, keys] of Object.entries(ARCADE_CONTROLS)) {
  for (const key of keys) KEYBOARD_TO_ARCADE[key] = arcade;
}

const FIELD_W = 800;
const FIELD_H = 600;
const GOAL_TOP = 200;
const GOAL_BOTTOM = 400;

const BLUE_TEAM_COLOR = 0x2f66ff;
const RED_TEAM_COLOR = 0xff3f4d;

// Countries represented in Universities.txt (mapped via ICPC LATAM university-country list).
const COUNTRY_OPTIONS = [
  { name: "Argentina", primary: 0x75aadb, secondary: 0xffffff, tertiary: 0x75aadb, pattern: "argentina_5_bands" },
  { name: "Antigua and Barbuda", primary: 0xce1126, secondary: 0x000000, tertiary: 0x0072c6, pattern: "antigua_flag" },
  { name: "Bolivia", primary: 0xd52b1e, secondary: 0xf9e300, tertiary: 0x007934, pattern: "h_stripes" },
  { name: "Brazil", primary: 0x009b3a, secondary: 0xffdf00, tertiary: 0x002776, pattern: "brazil_flag" },
  { name: "Chile", primary: 0xffffff, secondary: 0x0039a6, tertiary: 0xd52b1e, pattern: "chile_flag" },
  { name: "Colombia", primary: 0xf4e201, secondary: 0x005da4, tertiary: 0xce1126, pattern: "colombia_bands" },
  { name: "Costa Rica", primary: 0x002b7f, secondary: 0xffffff, tertiary: 0xef0000, pattern: "costa_rica_bands" },
  { name: "Cuba", primary: 0x002a8f, secondary: 0xffffff, tertiary: 0xcf142b, pattern: "puerto_rico_flag" },
  { name: "Dominican Republic", primary: 0xce1126, secondary: 0x002859, tertiary: 0xffffff, pattern: "dominican_cross" },
  { name: "El Salvador", primary: 0x0044ff, secondary: 0xffffff, tertiary: 0x0044ff, pattern: "h_stripes" },
  { name: "Guatemala", primary: 0x4997d0, secondary: 0xffffff, tertiary: 0x4997d0 },
  { name: "Mexico", primary: 0x006847, secondary: 0xffffff, tertiary: 0x006847, pattern: "mexico_narrow_white" },
  { name: "Peru", primary: 0xea0b1c, secondary: 0xffffff },
  { name: "Puerto Rico", primary: 0xff0000, secondary: 0xffffff, tertiary: 0x0050b5, pattern: "puerto_rico_flag" },
  { name: "Trinidad and Tobago", primary: 0xff0013, secondary: 0x000000, tertiary: 0xffffff, pattern: "trinidad_diag" },
  { name: "Uruguay", primary: 0xffffff, secondary: 0x0038a8, tertiary: 0xf4c300, pattern: "uruguay_flag" },
  { name: "Venezuela", primary: 0x722f37, secondary: 0xf4c300, tertiary: 0x0033a0, pattern: "venezuela_center_flag" },
];
const TEAM_SIZE = 5;
const TARGET_SCORE = 5;
const HALF_DURATION_OPTIONS = [60, 120, 180];
const TOTAL_HALVES = 2;

const PLAYER_RADIUS = 10;
const BALL_RADIUS = 8;
const GK_HOME_X = 44;
const GK_X_MIN = 24;
const GK_X_MAX = 72;
const GK_Y_MIN = GOAL_TOP - 24;
const GK_Y_MAX = GOAL_BOTTOM + 24;

const PLAYER_SPEED = 152;
const GK_SPEED = 96;
const HUMAN_ACCEL = 760;
const AI_ACCEL = 620;
const AI_CHASER_LOCK = 0.55;
const AI_ARRIVAL = 28;
const WALK_SPEED_MULT = 0.66;
const RUN_SPEED_MULT = 1.08;

const STAMINA_MAX = 100;
const STAMINA_DRAIN_PER_SECOND = STAMINA_MAX / 3;
const STAMINA_RECOVER_PER_SECOND = STAMINA_MAX / 3;

const SELECTION_COOLDOWN = 0.16;

const KICK_POWER = 340;
const PASS_POWER = 170;
const SHOOT_PLAYER_VEL_SHARE = 0.62;
const PASS_PLAYER_VEL_SHARE = 0.3;
const TOUCH_RESTITUTION = 0.18;
const TOUCH_PLAYER_VEL_INFLUENCE = 0.004;
const TOUCH_MIN_SPEED = 16;
const TOUCH_MAX_SPEED_FROM_SLOW = PASS_POWER * 0.5;
const TOUCH_MAX_SPEED_BOOST = PASS_POWER * 0.35;
const DRIBBLE_CONTROL_MAX_ACTIVE_SPEED = PASS_POWER * 1.55;
const DRIBBLE_REPOSITION_LERP_PER_SEC = 13.2;
const DRIBBLE_PULL = 38;
const DRIBBLE_FORWARD_PUSH = 360;
const DRIBBLE_FORWARD_PUSH_CONTESTED = 76;
const DRIBBLE_CARRIER_VEL_SHARE = 0.95;
const DRIBBLE_MAX_SPEED = PASS_POWER * 1.2;
const DRIBBLE_CONTESTED_ESCAPE = 280;
const DRIBBLE_CONTESTED_CENTER_PUSH = 150;
const DRIBBLE_ESCAPE_WALL_MARGIN = 44;
const DUEL_BREAKOUT_PLAYER_GAP = PLAYER_RADIUS * 2.45;
const DUEL_BREAKOUT_MID_RADIUS = BALL_RADIUS + 7;
const DUEL_BREAKOUT_NUDGE = 4.8;
const DUEL_BREAKOUT_MIN_OUT_SPEED = 250;
const DUEL_BREAKOUT_PERP_BIAS = 120;
const GK_DANGER_X = 176;
const GK_CLEAR_ZONE_X = 168;
const GK_CLEAR_LANE_PAD = 64;
const GK_CLEAR_POWER = 268;
const GK_CLEAR_COOLDOWN = 0.34;
const BALL_CONTROLLER_MEMORY = 0.2;
const TEAM_SUPPORT_MIN_BALL_DIST = 84;
const SHOT_RELEASE_TIME = 0.24;
const SHOT_RELEASE_FORWARD = 250;
const SHOT_RELEASE_CONTESTED_PUSH = 320;
const SHOT_RELEASE_WALL_ESCAPE = 340;
const SHOT_RELEASE_WALL_MARGIN = 78;
const AI_RUN_DISTANCE = 64;
const AI_RUN_BALL_RANGE = 210;
const WALL_BOUNCE = 0.9;
const BALL_DRAG_PER_60FPS = 0.994;
const BALL_MAX_SPEED = 440;
const BALL_MIN_BOUNCE_SPEED = 88;
const BALL_WAKE_SPEED = 70;

const CORNER_ZONE = 34;
const CORNER_STUCK_RADIUS = 16;
const CORNER_STUCK_TIME = 0.65;

let sceneRef;
let fieldGfx;
let scoreboardGfx;
let gfx;
let titleText;
let menuTaglineText;
let infoText;
let hudText;
let scoreBoardText;
let scoreRightText;
let scoreTimeText;
let scoreModeText;
let scoreLeftNameText;
let scoreRightNameText;
let bannerText;
let helpText;

const input = {};
let manualStep = false;

let mode = "menu"; // menu, standings, country_select, tutorial, duration_select, playing, goal, halftime, gameover
let playMode = "1P"; // 1P, 2P

let scores = [0, 0];
let halfDurationIndex = 1; // 0=1min, 1=2min, 2=3min
let halfDurationSeconds = HALF_DURATION_OPTIONS[halfDurationIndex];
let timeLeft = halfDurationSeconds;
let currentHalf = 1;
let goalPause = 0;
let lastScorer = -1;
let matchPointsApplied = false;

const MAX_NAME_LENGTH = 24;
let teamCountryIndex = [5, 3]; // Colombia vs Brazil by default
let countrySelectionStep = 0;
const standings = {};

let tutorialStep = 0;
let tutorialDone = false;
let tutorialExitLock = 0;
let durationStartLock = 0;
const tutorialFlags = {
  moved: false,
  switched: false,
  kicked: false,
};

let selectedBlueIndex = 4;
let selectedRedIndex = 4;
let selectionCooldownBlue = 0;
let selectionCooldownRed = 0;

const aiChaserIndex = [1, 1];
const aiChaserLock = [0, 0];

let cornerStuckId = "";
let cornerStuckTimer = 0;
let cornerAnchorX = FIELD_W / 2;
let cornerAnchorY = FIELD_H / 2;
let ballControllerTeam = -1;
let ballControllerIndex = -1;
let ballControllerHold = 0;
let shotReleaseTimer = 0;
let shotReleaseDirX = 0;
let shotReleaseDirY = 0;

let teams = [[], []];
let ball = {
  x: FIELD_W / 2,
  y: FIELD_H / 2,
  vx: 0,
  vy: 0,
  r: BALL_RADIUS,
  lastX: FIELD_W / 2,
  lastY: FIELD_H / 2,
};

const config = {
  type: Phaser.CANVAS,
  width: FIELD_W,
  height: FIELD_H,
  backgroundColor: "#0a4f28",
  scene: { preload, create, update },
};

new Phaser.Game(config);

function preload() {
  // No external assets: keep rendering purely with canvas primitives and text.
}

function create() {
  sceneRef = this;
  fieldGfx = this.add.graphics();
  fieldGfx.setDepth(-2);
  scoreboardGfx = this.add.graphics();
  scoreboardGfx.setDepth(-0.6);
  gfx = this.add.graphics();
  gfx.setDepth(0);

  titleText = this.add
    .text(FIELD_W / 2, 88, "FUTBOLITO", {
      fontFamily: "Arial",
      fontSize: "50px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#041609",
      strokeThickness: 9,
      align: "center",
    })
    .setOrigin(0.5);

  menuTaglineText = this.add
    .text(FIELD_W / 2, 236, "", {
      fontFamily: "Arial",
      fontSize: "30px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#041609",
      strokeThickness: 7,
      align: "center",
      lineSpacing: 6,
    })
    .setOrigin(0.5)
    .setVisible(false);

  infoText = this.add
    .text(FIELD_W / 2, 300, "", {
      fontFamily: "Arial",
      fontSize: "22px",
      color: "#f4fff6",
      stroke: "#041609",
      strokeThickness: 6,
      align: "center",
      lineSpacing: 8,
    })
    .setOrigin(0.5);

  hudText = this.add
    .text(FIELD_W / 2, 16, "", {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 5,
    })
    .setOrigin(0.5, 0);
  hudText.setDepth(0.7);

  scoreBoardText = this.add
    .text(FIELD_W / 2, 30, "", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#ffffff",
      stroke: "#00120a",
      strokeThickness: 4,
      align: "center",
    })
    .setOrigin(0.5)
    .setDepth(-0.45)
    .setVisible(false);

  scoreRightText = this.add
    .text(FIELD_W / 2, 30, "", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#ffffff",
      stroke: "#00120a",
      strokeThickness: 4,
      align: "center",
    })
    .setOrigin(0.5)
    .setDepth(-0.45)
    .setVisible(false);

  scoreTimeText = this.add
    .text(FIELD_W / 2, 30, "", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#ffffff",
      stroke: "#00120a",
      strokeThickness: 4,
      align: "center",
    })
    .setOrigin(0.5)
    .setDepth(-0.45)
    .setVisible(false);

  scoreModeText = this.add
    .text(FIELD_W / 2, 30, "", {
      fontFamily: "Arial",
      fontSize: "17px",
      color: "#eaffef",
      stroke: "#00120a",
      strokeThickness: 3,
      align: "center",
    })
    .setOrigin(0.5)
    .setDepth(-0.45)
    .setVisible(false);

  scoreLeftNameText = this.add
    .text(FIELD_W / 2, 30, "", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#ecfff3",
      stroke: "#00120a",
      strokeThickness: 4,
      align: "center",
    })
    .setOrigin(0.5)
    .setDepth(-0.45)
    .setVisible(false);

  scoreRightNameText = this.add
    .text(FIELD_W / 2, 30, "", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#ecfff3",
      stroke: "#00120a",
      strokeThickness: 4,
      align: "center",
    })
    .setOrigin(0.5)
    .setDepth(-0.45)
    .setVisible(false);

  bannerText = this.add
    .text(FIELD_W / 2, FIELD_H / 2 - 18, "", {
      fontFamily: "Arial",
      fontSize: "44px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 7,
      align: "center",
    })
    .setOrigin(0.5);

  helpText = this.add
    .text(FIELD_W / 2, FIELD_H - 72, "", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#f6fff8",
      stroke: "#041609",
      strokeThickness: 4,
      align: "left",
      lineSpacing: 4,
    })
    .setOrigin(0.5);

  buildTeams();
  resetSelections();
  resetKickoff();

  this.input.keyboard.on("keydown", (event) => {
    const arcade = getArcadeCode(event);
    const wasDown = arcade ? !!input[arcade] : false;
    if (arcade) input[arcade] = true;
    handleKeyDown(arcade, event, wasDown);
  });

  this.input.keyboard.on("keyup", (event) => {
    const arcade = getArcadeCode(event);
    if (arcade) input[arcade] = false;
  });

  window.addEventListener("resize", resizeCanvasDisplay);
  resizeCanvasDisplay();

  installTestingHooks();
}

function update(_time, delta) {
  if (manualStep) return;
  const dt = Math.min(0.05, delta / 1000);
  stepGame(dt);
  renderScene();
}

function stepGame(dt) {
  if (tutorialExitLock > 0) tutorialExitLock = Math.max(0, tutorialExitLock - dt);
  if (durationStartLock > 0) durationStartLock = Math.max(0, durationStartLock - dt);
  if (selectionCooldownBlue > 0) selectionCooldownBlue = Math.max(0, selectionCooldownBlue - dt);
  if (selectionCooldownRed > 0) selectionCooldownRed = Math.max(0, selectionCooldownRed - dt);

  if (
    mode === "menu" ||
    mode === "standings" ||
    mode === "country_select" ||
    mode === "duration_select" ||
    mode === "gameover"
  ) {
    return;
  }

  if (mode === "tutorial") {
    updateLiveMatch(dt, false);
    updateTutorialProgress(dt);
    return;
  }

  if (mode === "playing") {
    timeLeft = Math.max(0, timeLeft - dt);

    updateLiveMatch(dt, true);

    if (timeLeft <= 0) {
      if (currentHalf < TOTAL_HALVES) {
        enterHalftime();
      } else {
        enterGameOver();
      }
      return;
    }

    if (scores[0] >= TARGET_SCORE || scores[1] >= TARGET_SCORE) {
      enterGameOver();
    }
    return;
  }

  if (mode === "goal") {
    goalPause -= dt;
    if (goalPause <= 0) {
      if (scores[0] >= TARGET_SCORE || scores[1] >= TARGET_SCORE) {
        enterGameOver();
      } else if (timeLeft <= 0) {
        if (currentHalf < TOTAL_HALVES) enterHalftime();
        else enterGameOver();
      } else {
        resetKickoff();
        mode = "playing";
      }
    }
  }

  if (mode === "halftime") {
    goalPause -= dt;
    if (goalPause <= 0) {
      currentHalf = Math.min(TOTAL_HALVES, currentHalf + 1);
      timeLeft = halfDurationSeconds;
      resetKickoff();
      mode = "playing";
    }
  }
}

function updateLiveMatch(dt, allowGoals) {
  applyHumanMovement(0, dt);
  if (playMode === "2P") applyHumanMovement(1, dt);

  updateAiTeam(0, dt);
  updateAiTeam(1, dt);

  movePlayers(dt);
  resolvePlayerOverlaps();

  updateBall(dt, allowGoals);
}

function renderScene() {
  fieldGfx.clear();
  scoreboardGfx.clear();
  gfx.clear();
  drawPitch();
  menuTaglineText.setVisible(false);

  if (mode === "menu") {
    setScoreboardVisible(false);
    drawTeamsIdle();
    drawDimOverlay(0.45);
    drawPanel(88, 68, 624, 452);

    titleText.setVisible(false);

    menuTaglineText.setVisible(true);
    menuTaglineText.setText(
      "REPRESENT YOUR COUNTRY IN THE\nICPC LATAM FUTBOLITO CHALLENGE"
    );
    menuTaglineText.setPosition(FIELD_W / 2, 128);

    infoText.setVisible(true);
    infoText.setFontFamily("Arial");
    infoText.setText(
      `MODE: ${playMode === "2P" ? "2 Players" : "1 Player"}   (JOYSTICK UP/DOWN)\n\n` +
      `JOYSTICK: MOVE\n` +
      `C (HOLD): RUN   B: CHANGE PLAYER\n` +
      `Y: SHOOT   X: PASS`
    );
    infoText.setPosition(FIELD_W / 2, 294);

    hudText.setVisible(false);
    bannerText.setVisible(false);

    helpText.setVisible(true);
    helpText.setOrigin(0.5);
    helpText.setPosition(FIELD_W / 2, FIELD_H - 30);
    helpText.setAlign("center");
    helpText.setText(
      "START: NEW MATCH (AND EXIT TUTORIAL)   |   Z: OPEN SCOREBOARD"
    );
    return;
  }

  if (mode === "standings") {
    setScoreboardVisible(false);
    drawTeamsIdle();
    drawDimOverlay(0.55);
    drawPanel(120, 82, 560, 436);

    titleText.setVisible(true);
    titleText.setPosition(FIELD_W / 2, 120);
    titleText.setText("SCOREBOARD");

    const rows = getStandingsRows();
    let lines = `${formatStandingsHeader()}\n`;
    if (rows.length === 0) {
      lines += "\nNO MATCHES REGISTERED YET.\nPLAY A MATCH TO START THE TABLE.";
    } else {
      const maxRows = Math.min(8, rows.length);
      for (let i = 0; i < maxRows; i++) {
        const row = rows[i];
        lines += `${formatStandingsLine(i + 1, row)}\n`;
      }
    }

    infoText.setVisible(true);
    infoText.setFontFamily("Courier New");
    infoText.setPosition(FIELD_W / 2, 294);
    infoText.setText(lines);

    hudText.setVisible(false);
    bannerText.setVisible(false);

    helpText.setVisible(true);
    helpText.setOrigin(0.5);
    helpText.setPosition(FIELD_W / 2, FIELD_H - 36);
    helpText.setAlign("center");
    helpText.setText("PRESS START TO RETURN");
    return;
  }

  if (mode === "country_select") {
    setScoreboardVisible(false);
    drawTeamsIdle();
    drawDimOverlay(0.5);
    drawPanel(92, 78, 616, 444);

    const activeTeam = countrySelectionStep <= 0 ? 0 : 1;
    const p2Label = playMode === "2P" ? "PLAYER 2" : "CPU";

    titleText.setVisible(true);
    titleText.setPosition(FIELD_W / 2, 120);
    titleText.setText("COUNTRY SELECT");

    infoText.setVisible(true);
    infoText.setFontFamily("Arial");
    infoText.setPosition(FIELD_W / 2, 276);
    infoText.setText(
      `${countrySelectionStep === 0 ? ">" : " "} PLAYER 1: ${truncateName(getPlayerName(0), 24)}\n` +
      `${countrySelectionStep === 1 ? ">" : " "} ${p2Label}: ${truncateName(getPlayerName(1), 24)}\n\n` +
      `NOW CHOOSING: ${activeTeam === 0 ? "PLAYER 1" : p2Label}\n` +
      "JOYSTICK LEFT/RIGHT: CHANGE COUNTRY\nSTART: CONFIRM"
    );

    hudText.setVisible(false);
    bannerText.setVisible(false);
    helpText.setVisible(true);
    helpText.setOrigin(0.5);
    helpText.setPosition(FIELD_W / 2, FIELD_H - 32);
    helpText.setAlign("center");
    helpText.setText("USE JOYSTICK + START TO CHOOSE COUNTRY");
    return;
  }

  if (mode === "duration_select") {
    setScoreboardVisible(false);
    drawTeamsIdle();
    drawDimOverlay(0.5);
    drawPanel(124, 96, 552, 404);

    const minuteOptions = [1, 2, 3];
    const selectedMinutes = minuteOptions[halfDurationIndex];
    const lines = minuteOptions
      .map((min, idx) => `${idx === halfDurationIndex ? ">" : " "} ${min} MINUTE${min > 1 ? "S" : ""}`)
      .join("\n");

    titleText.setVisible(true);
    titleText.setPosition(FIELD_W / 2, 122);
    titleText.setText("HALF DURATION");

    infoText.setVisible(true);
    infoText.setFontFamily("Arial");
    infoText.setPosition(FIELD_W / 2, 302);
    infoText.setText(
      `${lines}\n\nJOYSTICK LEFT/RIGHT: CHANGE\nSTART: BEGIN MATCH`
    );

    hudText.setVisible(false);
    bannerText.setVisible(false);
    helpText.setVisible(true);
    helpText.setOrigin(0.5);
    helpText.setPosition(FIELD_W / 2, FIELD_H - 34);
    helpText.setAlign("center");
    helpText.setText("PRESS START TO BEGIN MATCH");
    return;
  }

  drawTeamsAndBall();

  titleText.setVisible(false);
  infoText.setVisible(false);

  if (mode === "tutorial") {
    setScoreboardVisible(false);
    hudText.setVisible(true);
    const tutorialLabel = tutorialDone ? "COMPLETE" : `${tutorialStep + 1}/3`;
    hudText.setText(`TUTORIAL  ${tutorialLabel}   MODE ${playMode}`);

    bannerText.setVisible(false);

    drawPanel(16, 52, 420, 92);
    helpText.setVisible(true);
    helpText.setOrigin(0, 0);
    helpText.setPosition(32, 70);
    helpText.setAlign("left");
    helpText.setText(getTutorialHintText());
    return;
  }

  helpText.setVisible(false);
  hudText.setVisible(false);
  drawMatchScoreboard();

  if (mode === "goal") {
    bannerText.setVisible(true);
    bannerText.setText(lastScorer === 0 ? `GOAL ${getPlayerName(0)}!` : `GOAL ${getPlayerName(1)}!`);
  } else if (mode === "halftime") {
    bannerText.setVisible(true);
    bannerText.setText("HALFTIME\nSECOND HALF STARTING");
  } else if (mode === "gameover") {
    bannerText.setVisible(true);
    const winner =
      scores[0] === scores[1]
        ? "DRAW"
        : scores[0] > scores[1]
          ? `${truncateName(getPlayerName(0), 13)} WINS`
          : `${truncateName(getPlayerName(1), 13)} WINS`;

    bannerText.setText(`${winner}\nPRESS START`);
    drawPanel(236, 512, 328, 70);
    helpText.setVisible(true);
    helpText.setOrigin(0.5);
    helpText.setPosition(FIELD_W / 2, FIELD_H - 44);
    helpText.setAlign("center");
    helpText.setText("PRESS START TO RETURN TO MENU");
  } else {
    bannerText.setVisible(false);
  }
}

function setScoreboardVisible(visible) {
  scoreboardGfx.setVisible(visible);
  scoreBoardText.setVisible(visible);
  scoreRightText.setVisible(visible);
  scoreTimeText.setVisible(visible);
  scoreModeText.setVisible(visible);
  scoreLeftNameText.setVisible(visible);
  scoreRightNameText.setVisible(visible);
}

function drawMatchScoreboard() {
  setScoreboardVisible(true);

  const panelX = 82;
  const panelY = 8;
  const panelW = 636;
  const panelH = 46;

  scoreboardGfx.fillStyle(0x00140a, 0.58);
  if (typeof scoreboardGfx.fillRoundedRect === "function") {
    scoreboardGfx.fillRoundedRect(panelX, panelY, panelW, panelH, 14);
  } else {
    scoreboardGfx.fillRect(panelX, panelY, panelW, panelH);
  }

  scoreboardGfx.lineStyle(2, 0x6adf8b, 0.55);
  if (typeof scoreboardGfx.strokeRoundedRect === "function") {
    scoreboardGfx.strokeRoundedRect(panelX, panelY, panelW, panelH, 14);
  } else {
    scoreboardGfx.strokeRect(panelX, panelY, panelW, panelH);
  }

  drawScoreboardTeamDot(panelX + 18, 29, 0);
  drawScoreboardTeamDot(panelX + panelW - 18, 29, 1);

  scoreBoardText.setText(`${scores[0]}`);
  scoreBoardText.setPosition(FIELD_W / 2 - 70, 28);

  scoreTimeText.setText(`${Math.ceil(timeLeft)}s`);
  scoreTimeText.setPosition(FIELD_W / 2, 28);

  scoreRightText.setText(`${scores[1]}`);
  scoreRightText.setPosition(FIELD_W / 2 + 70, 28);

  scoreLeftNameText.setText(truncateName(getPlayerName(0), 19));
  scoreLeftNameText.setPosition(FIELD_W / 2 - 232, 29);

  scoreRightNameText.setText(truncateName(getPlayerName(1), 19));
  scoreRightNameText.setPosition(FIELD_W / 2 + 232, 29);

  const modeLabel = playMode === "2P" ? "2 Players" : "1 Player";
  const halfLabel = currentHalf === 1 ? "1st Half" : "2nd Half";
  scoreModeText.setText(`${modeLabel} | ${halfLabel}`);
  scoreModeText.setPosition(FIELD_W / 2, 68);
}

function drawScoreboardTeamDot(x, y, teamId) {
  const r = 8;
  const pattern = getTeamPattern(teamId);
  const c1 = getTeamColor(teamId);
  const c2 = getTeamAccentColor(teamId);
  const c3 = getTeamThirdColor(teamId);
  const centerMark = getTeamCenterMark(teamId);
  const centerMarkColor = getTeamCenterMarkColor(teamId);
  drawTeamDotPattern(scoreboardGfx, x, y, r, pattern, c1, c2, c3);
  drawCenterMark(scoreboardGfx, x, y, r, centerMark, centerMarkColor);

  scoreboardGfx.lineStyle(1.5, 0xffffff, 0.95);
  scoreboardGfx.strokeCircle(x, y, r);
}

function drawScoreboardCircleStripeSegment(cx, cy, r, x1, x2, color) {
  drawCircleStripeSegmentOn(scoreboardGfx, cx, cy, r, x1, x2, color);
}

function drawPitch() {
  for (let i = 0; i < 10; i++) {
    fieldGfx.fillStyle(i % 2 === 0 ? 0x0f6f35 : 0x0c6330, 1);
    fieldGfx.fillRect(0, i * (FIELD_H / 10), FIELD_W, FIELD_H / 10);
  }

  fieldGfx.lineStyle(4, 0xffffff, 1);
  fieldGfx.strokeRect(4, 4, FIELD_W - 8, FIELD_H - 8);
  fieldGfx.lineBetween(FIELD_W / 2, 6, FIELD_W / 2, FIELD_H - 6);
  fieldGfx.strokeCircle(FIELD_W / 2, FIELD_H / 2, 70);

  fieldGfx.lineStyle(3, 0xffffff, 0.8);
  fieldGfx.strokeRect(0, GOAL_TOP, 55, GOAL_BOTTOM - GOAL_TOP);
  fieldGfx.strokeRect(FIELD_W - 55, GOAL_TOP, 55, GOAL_BOTTOM - GOAL_TOP);

  fieldGfx.fillStyle(0xffffff, 0.17);
  fieldGfx.fillRect(0, GOAL_TOP + 8, 16, GOAL_BOTTOM - GOAL_TOP - 16);
  fieldGfx.fillRect(FIELD_W - 16, GOAL_TOP + 8, 16, GOAL_BOTTOM - GOAL_TOP - 16);
}

function drawTeamsIdle() {
  drawPlayers(
    teams[0],
    getTeamPattern(0),
    getTeamColor(0),
    getTeamAccentColor(0),
    getTeamThirdColor(0),
    getTeamCenterMark(0),
    getTeamCenterMarkColor(0),
    selectedBlueIndex,
    0xffe066,
    true
  );
  drawPlayers(
    teams[1],
    getTeamPattern(1),
    getTeamColor(1),
    getTeamAccentColor(1),
    getTeamThirdColor(1),
    getTeamCenterMark(1),
    getTeamCenterMarkColor(1),
    playMode === "2P" ? selectedRedIndex : -1,
    0x8be8ff,
    playMode === "2P"
  );

  drawSoccerBall(FIELD_W / 2, FIELD_H / 2, BALL_RADIUS, false);
}

function drawTeamsAndBall() {
  drawPlayers(
    teams[0],
    getTeamPattern(0),
    getTeamColor(0),
    getTeamAccentColor(0),
    getTeamThirdColor(0),
    getTeamCenterMark(0),
    getTeamCenterMarkColor(0),
    selectedBlueIndex,
    0xffe066,
    true
  );
  drawPlayers(
    teams[1],
    getTeamPattern(1),
    getTeamColor(1),
    getTeamAccentColor(1),
    getTeamThirdColor(1),
    getTeamCenterMark(1),
    getTeamCenterMarkColor(1),
    playMode === "2P" ? selectedRedIndex : -1,
    0x8be8ff,
    playMode === "2P"
  );

  drawSoccerBall(ball.x, ball.y, BALL_RADIUS, true);
}

function drawSoccerBall(x, y, r, withShadow) {
  if (withShadow) {
    gfx.fillStyle(0x111111, 0.25);
    gfx.fillCircle(x + 2, y + 2, r + 1);
  }

  gfx.fillStyle(0xffffff, 1);
  gfx.fillCircle(x, y, r);
  drawBallPentagon(x, y, r * 0.32, -Math.PI / 2, 0x050505);

  const orbit = r * 0.62;
  const pr = r * 0.3;
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    drawBallPentagon(
      x + Math.cos(a) * orbit,
      y + Math.sin(a) * orbit,
      pr,
      a + Math.PI / 5,
      0x050505
    );
  }

  gfx.lineStyle(1, 0x000000, 0.4);
  gfx.strokeCircle(x, y, r);
}

function drawBallPentagon(cx, cy, r, rotation, color) {
  gfx.fillStyle(color, 1);
  gfx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = rotation + (i * Math.PI * 2) / 5;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) gfx.moveTo(x, y);
    else gfx.lineTo(x, y);
  }
  gfx.closePath();
  gfx.fillPath();
}

function drawPlayers(
  players,
  pattern,
  primaryColor,
  secondaryColor,
  thirdColor,
  centerMark,
  centerMarkColor,
  selectedIndex,
  selectedColor,
  showSelected
) {
  for (let i = 0; i < players.length; i++) {
    const p = players[i];

    gfx.fillStyle(0x111111, 0.22);
    gfx.fillCircle(p.x + 1.4, p.y + 1.4, p.r + 1);

    // Render 3 vertical stripes, each one-third of the dot width.
    drawTeamDotPattern(gfx, p.x, p.y, p.r, pattern, primaryColor, secondaryColor, thirdColor);
    drawCenterMark(gfx, p.x, p.y, p.r, centerMark, centerMarkColor);

    gfx.lineStyle(1.5, 0xffffff, 0.95);
    gfx.strokeCircle(p.x, p.y, p.r);

    if (p.stamina !== undefined) {
      const staminaPct = clamp((p.stamina || 0) / STAMINA_MAX, 0, 1);
      if (staminaPct > 0.001) {
        const start = -Math.PI / 2;
        const end = start + Math.PI * 2 * staminaPct;
        gfx.lineStyle(2, 0xffffff, 0.95);
        gfx.beginPath();
        gfx.arc(p.x, p.y, p.r + 2, start, end, false);
        gfx.strokePath();
      }
    }

    if (p.role === "GK") {
      gfx.lineStyle(2, 0xffffff, 0.9);
      gfx.strokeCircle(p.x, p.y, p.r + 3);
    }

    if (showSelected && i === selectedIndex) {
      gfx.lineStyle(3, selectedColor, 1);
      gfx.strokeCircle(p.x, p.y, p.r + 5);
    }
  }
}

function drawCircleStripeSegment(cx, cy, r, x1, x2, color) {
  drawCircleStripeSegmentOn(gfx, cx, cy, r, x1, x2, color);
}

function drawCircleStripeSegmentOn(targetGfx, cx, cy, r, x1, x2, color) {
  const segments = 10;
  targetGfx.fillStyle(color, 1);
  targetGfx.beginPath();

  for (let i = 0; i <= segments; i++) {
    const x = x1 + ((x2 - x1) * i) / segments;
    const dx = x - cx;
    const yTop = cy - Math.sqrt(Math.max(0, r * r - dx * dx));
    if (i === 0) targetGfx.moveTo(x, yTop);
    else targetGfx.lineTo(x, yTop);
  }

  for (let i = segments; i >= 0; i--) {
    const x = x1 + ((x2 - x1) * i) / segments;
    const dx = x - cx;
    const yBottom = cy + Math.sqrt(Math.max(0, r * r - dx * dx));
    targetGfx.lineTo(x, yBottom);
  }

  targetGfx.closePath();
  targetGfx.fillPath();
}

function drawCircleHorizontalBandOn(targetGfx, cx, cy, r, y1, y2, color) {
  const segments = 10;
  targetGfx.fillStyle(color, 1);
  targetGfx.beginPath();

  for (let i = 0; i <= segments; i++) {
    const y = y1 + ((y2 - y1) * i) / segments;
    const dy = y - cy;
    const xLeft = cx - Math.sqrt(Math.max(0, r * r - dy * dy));
    if (i === 0) targetGfx.moveTo(xLeft, y);
    else targetGfx.lineTo(xLeft, y);
  }

  for (let i = segments; i >= 0; i--) {
    const y = y1 + ((y2 - y1) * i) / segments;
    const dy = y - cy;
    const xRight = cx + Math.sqrt(Math.max(0, r * r - dy * dy));
    targetGfx.lineTo(xRight, y);
  }

  targetGfx.closePath();
  targetGfx.fillPath();
}

function drawDiagonalBandOn(targetGfx, cx, cy, r, uMin, uMax, color) {
  const segments = 26;
  const top = [];
  const bottom = [];
  const c = cy - cx;

  for (let i = 0; i <= segments; i++) {
    const x = cx - r + (i * r * 2) / segments;
    const dx = x - cx;
    const yTop = cy - Math.sqrt(Math.max(0, r * r - dx * dx));
    const yBottom = cy + Math.sqrt(Math.max(0, r * r - dx * dx));
    const lineMin = x + c + uMin;
    const lineMax = x + c + uMax;
    const y1 = Math.max(yTop, lineMin);
    const y2 = Math.min(yBottom, lineMax);
    if (y1 < y2) {
      top.push({ x, y: y1 });
      bottom.push({ x, y: y2 });
    }
  }

  if (top.length < 2) return;

  targetGfx.fillStyle(color, 1);
  targetGfx.beginPath();
  targetGfx.moveTo(top[0].x, top[0].y);
  for (let i = 1; i < top.length; i++) targetGfx.lineTo(top[i].x, top[i].y);
  for (let i = bottom.length - 1; i >= 0; i--) targetGfx.lineTo(bottom[i].x, bottom[i].y);
  targetGfx.closePath();
  targetGfx.fillPath();
}

function drawCircleRectBandOn(targetGfx, cx, cy, r, x1, x2, y1, y2, color) {
  const segments = 12;
  const top = [];
  const bottom = [];

  for (let i = 0; i <= segments; i++) {
    const x = x1 + ((x2 - x1) * i) / segments;
    const dx = x - cx;
    const yTop = cy - Math.sqrt(Math.max(0, r * r - dx * dx));
    const yBottom = cy + Math.sqrt(Math.max(0, r * r - dx * dx));
    const clippedTop = Math.max(yTop, y1);
    const clippedBottom = Math.min(yBottom, y2);
    if (clippedTop < clippedBottom) {
      top.push({ x, y: clippedTop });
      bottom.push({ x, y: clippedBottom });
    }
  }

  if (top.length < 2) return;

  targetGfx.fillStyle(color, 1);
  targetGfx.beginPath();
  targetGfx.moveTo(top[0].x, top[0].y);
  for (let i = 1; i < top.length; i++) targetGfx.lineTo(top[i].x, top[i].y);
  for (let i = bottom.length - 1; i >= 0; i--) targetGfx.lineTo(bottom[i].x, bottom[i].y);
  targetGfx.closePath();
  targetGfx.fillPath();
}

function drawCircleSector(targetGfx, cx, cy, r, startAngle, endAngle, color) {
  targetGfx.fillStyle(color, 1);
  targetGfx.beginPath();
  targetGfx.moveTo(cx, cy);
  targetGfx.arc(cx, cy, r, startAngle, endAngle, false);
  targetGfx.closePath();
  targetGfx.fillPath();
}

function drawPolygonOn(targetGfx, points, color) {
  if (!points || points.length < 3) return;
  targetGfx.fillStyle(color, 1);
  targetGfx.beginPath();
  targetGfx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) targetGfx.lineTo(points[i].x, points[i].y);
  targetGfx.closePath();
  targetGfx.fillPath();
}

function drawTeamDotPattern(targetGfx, x, y, r, pattern, primaryColor, secondaryColor, thirdColor) {
  if (pattern === "brazil_flag") {
    const green = primaryColor;
    const yellow = secondaryColor;
    const blue = thirdColor || 0x002776;

    targetGfx.fillStyle(green, 1);
    targetGfx.fillCircle(x, y, r);
    drawPolygonOn(targetGfx, [
      { x, y: y - r * 0.85 },
      { x: x + r * 0.85, y },
      { x, y: y + r * 0.85 },
      { x: x - r * 0.85, y },
    ], yellow);
    targetGfx.fillStyle(blue, 1);
    targetGfx.fillCircle(x, y, r * 0.34);
    return;
  }

  if (pattern === "mexico_narrow_white") {
    const green = primaryColor;
    const white = secondaryColor;
    const left = x - r;
    const sideW = r * 0.84;
    const centerW = r * 0.32;
    drawCircleStripeSegmentOn(targetGfx, x, y, r, left, left + sideW, green);
    drawCircleStripeSegmentOn(targetGfx, x, y, r, left + sideW, left + sideW + centerW, white);
    drawCircleStripeSegmentOn(targetGfx, x, y, r, left + sideW + centerW, x + r, thirdColor || green);
    return;
  }

  if (pattern === "argentina_5_bands") {
    const blue = primaryColor;
    const white = secondaryColor;
    const left = x - r;
    const band = (r * 2) / 5;
    drawCircleStripeSegmentOn(targetGfx, x, y, r, left, left + band, blue);
    drawCircleStripeSegmentOn(targetGfx, x, y, r, left + band, left + band * 2, white);
    drawCircleStripeSegmentOn(targetGfx, x, y, r, left + band * 2, left + band * 3, blue);
    drawCircleStripeSegmentOn(targetGfx, x, y, r, left + band * 3, left + band * 4, white);
    drawCircleStripeSegmentOn(targetGfx, x, y, r, left + band * 4, x + r, blue);
    return;
  }

  if (pattern === "uruguay_flag") {
    const white = primaryColor;
    const blue = secondaryColor;
    const sun = thirdColor || 0xf4c300;
    const stripeH = (r * 2) / 9;
    const top = y - r;

    targetGfx.fillStyle(white, 1);
    targetGfx.fillCircle(x, y, r);
    for (let i = 1; i < 9; i += 2) {
      drawCircleHorizontalBandOn(targetGfx, x, y, r, top + stripeH * i, top + stripeH * (i + 1), blue);
    }

    const cantonRight = x - r * 0.15;
    const cantonBottom = y - r * 0.08;
    drawCircleRectBandOn(targetGfx, x, y, r, x - r, cantonRight, y - r, cantonBottom, white);
    drawStarSymbol(targetGfx, x - r * 0.52, y - r * 0.54, r * 0.25, r * 0.11, sun, 10);
    targetGfx.fillStyle(sun, 1);
    targetGfx.fillCircle(x - r * 0.52, y - r * 0.54, r * 0.08);
    return;
  }

  if (pattern === "venezuela_center_flag") {
    const vinotinto = primaryColor;
    const yellow = secondaryColor;
    const blue = thirdColor || 0x0033a0;
    const red = 0xcf142b;
    const left = x - r;
    const oneThird = (r * 2) / 3;
    const midLeft = left + oneThird;
    const midRight = left + oneThird * 2;
    const top = y - r;
    const band = (r * 2) / 3;

    drawCircleStripeSegmentOn(targetGfx, x, y, r, left, midLeft, vinotinto);
    drawCircleStripeSegmentOn(targetGfx, x, y, r, midRight, x + r, vinotinto);
    drawCircleRectBandOn(targetGfx, x, y, r, midLeft, midRight, top, top + band, yellow);
    drawCircleRectBandOn(targetGfx, x, y, r, midLeft, midRight, top + band, top + band * 2, blue);
    drawCircleRectBandOn(targetGfx, x, y, r, midLeft, midRight, top + band * 2, y + r, red);
    return;
  }

  if (pattern === "puerto_rico_flag") {
    const red = primaryColor;
    const white = secondaryColor;
    const blue = thirdColor;
    const top = y - r;
    const band = (r * 2) / 5;

    drawCircleHorizontalBandOn(targetGfx, x, y, r, top, top + band, red);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + band, top + band * 2, white);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + band * 2, top + band * 3, red);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + band * 3, top + band * 4, white);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + band * 4, y + r, red);

    drawPolygonOn(targetGfx, [
      { x: x - r * 0.96, y: y - r * 0.96 },
      { x: x - r * 0.96, y: y + r * 0.96 },
      { x: x + r * 0.34, y },
    ], blue);
    drawStarSymbol(targetGfx, x - r * 0.46, y, r * 0.3, r * 0.13, 0xffffff);
    return;
  }

  if (pattern === "antigua_flag") {
    const red = primaryColor;
    const black = secondaryColor;
    const blue = thirdColor;
    const white = 0xffffff;
    const yellow = 0xfcd116;

    targetGfx.fillStyle(red, 1);
    targetGfx.fillCircle(x, y, r);

    drawPolygonOn(targetGfx, [
      { x: x - r * 0.78, y: y - r * 0.96 },
      { x: x + r * 0.78, y: y - r * 0.96 },
      { x, y: y - r * 0.04 },
    ], black);

    drawStarSymbol(targetGfx, x, y - r * 0.04, r * 0.58, r * 0.2, yellow);

    drawPolygonOn(targetGfx, [
      { x: x - r * 0.62, y: y - r * 0.04 },
      { x: x + r * 0.62, y: y - r * 0.04 },
      { x: x + r * 0.36, y: y + r * 0.26 },
      { x: x - r * 0.36, y: y + r * 0.26 },
    ], blue);

    drawPolygonOn(targetGfx, [
      { x: x - r * 0.36, y: y + r * 0.26 },
      { x: x + r * 0.36, y: y + r * 0.26 },
      { x, y: y + r * 0.95 },
    ], white);
    return;
  }

  if (pattern === "trinidad_diag") {
    const red = primaryColor;
    const black = secondaryColor;
    const white = thirdColor;
    const blackHalf = r * 0.18;
    const whiteHalf = blackHalf + r * 0.1;

    targetGfx.fillStyle(red, 1);
    targetGfx.fillCircle(x, y, r);
    drawDiagonalBandOn(targetGfx, x, y, r, -whiteHalf, whiteHalf, white);
    drawDiagonalBandOn(targetGfx, x, y, r, -blackHalf, blackHalf, black);
    return;
  }

  if (pattern === "chile_flag") {
    // Chile: top white, bottom red, blue canton at top-left with white star.
    drawCircleHorizontalBandOn(targetGfx, x, y, r, y - r, y, primaryColor);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, y, y + r, thirdColor);
    drawCircleStripeSegmentOn(targetGfx, x, y, r, x - r, x, secondaryColor);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, y, y + r, thirdColor);
    drawStarSymbol(targetGfx, x - r * 0.45, y - r * 0.45, r * 0.28, r * 0.12, 0xffffff);
    return;
  }

  if (pattern === "colombia_bands") {
    const top = y - r;
    const half = r;
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top, top + half, primaryColor);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + half, top + half + r * 0.5, secondaryColor);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + half + r * 0.5, y + r, thirdColor);
    return;
  }

  if (pattern === "costa_rica_bands") {
    const top = y - r;
    const unit = (r * 2) / 7;
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top, top + unit, primaryColor);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + unit, top + unit * 2, secondaryColor);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + unit * 2, top + unit * 5, thirdColor);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + unit * 5, top + unit * 6, secondaryColor);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + unit * 6, y + r, primaryColor);
    return;
  }

  if (pattern === "h_stripes") {
    const top = y - r;
    const oneThird = (r * 2) / 3;
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top, top + oneThird, primaryColor);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + oneThird, top + oneThird * 2, secondaryColor);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, top + oneThird * 2, y + r, thirdColor);
    return;
  }

  if (pattern === "dominican_cross") {
    const red = primaryColor;
    const blue = secondaryColor;

    targetGfx.fillStyle(blue, 1);
    targetGfx.fillCircle(x, y, r);
    drawCircleSector(targetGfx, x, y, r, -Math.PI / 2, 0, red);
    drawCircleSector(targetGfx, x, y, r, Math.PI / 2, Math.PI, red);

    const crossHalf = r * 0.2;
    drawCircleStripeSegmentOn(targetGfx, x, y, r, x - crossHalf, x + crossHalf, 0xffffff);
    drawCircleHorizontalBandOn(targetGfx, x, y, r, y - crossHalf, y + crossHalf, 0xffffff);
    return;
  }

  const leftEdge = x - r;
  const oneThird = (r * 2) / 3;
  drawCircleStripeSegmentOn(targetGfx, x, y, r, leftEdge, leftEdge + oneThird, primaryColor);
  drawCircleStripeSegmentOn(targetGfx, x, y, r, leftEdge + oneThird, leftEdge + oneThird * 2, secondaryColor);
  drawCircleStripeSegmentOn(targetGfx, x, y, r, leftEdge + oneThird * 2, x + r, thirdColor);
}

function drawCenterMark(targetGfx, x, y, r, mark, color) {
  if (mark !== "star") return;
  drawStarSymbol(targetGfx, x, y, r * 0.46, r * 0.2, color || 0xffffff);
}

function drawStarSymbol(targetGfx, x, y, outerR, innerR, color, points) {
  const spikes = points || 5;
  targetGfx.fillStyle(color, 1);
  targetGfx.beginPath();

  for (let i = 0; i < spikes * 2; i++) {
    const a = -Math.PI / 2 + i * (Math.PI / spikes);
    const radius = i % 2 === 0 ? outerR : innerR;
    const px = x + Math.cos(a) * radius;
    const py = y + Math.sin(a) * radius;
    if (i === 0) targetGfx.moveTo(px, py);
    else targetGfx.lineTo(px, py);
  }

  targetGfx.closePath();
  targetGfx.fillPath();
}

function drawDimOverlay(alpha) {
  gfx.fillStyle(0x001409, alpha);
  gfx.fillRect(0, 0, FIELD_W, FIELD_H);
}

function drawPanel(x, y, w, h) {
  gfx.fillStyle(0x00140a, 0.82);
  if (typeof gfx.fillRoundedRect === "function") gfx.fillRoundedRect(x, y, w, h, 18);
  else gfx.fillRect(x, y, w, h);

  gfx.lineStyle(3, 0x6adf8b, 0.65);
  if (typeof gfx.strokeRoundedRect === "function") gfx.strokeRoundedRect(x, y, w, h, 18);
  else gfx.strokeRect(x, y, w, h);
}

function handleKeyDown(arcade, event, wasDown) {
  if (wasDown) return;

  if (mode === "country_select") {
    if (arcade === "P1L" || arcade === "P2L") {
      cycleCountrySelection(-1);
      return;
    }

    if (arcade === "P1R" || arcade === "P2R") {
      cycleCountrySelection(1);
      return;
    }

    if (!event.repeat && isStartInput(arcade)) {
      confirmCountrySelection();
    }
    return;
  }

  if (mode === "standings") {
    if (event.repeat) return;
    if (isStartInput(arcade)) {
      mode = "menu";
    }
    return;
  }

  if (mode === "duration_select") {
    if (event.repeat) return;

    if (arcade === "P1L" || arcade === "P2L") {
      cycleHalfDurationSelection(-1);
      durationStartLock = 0.22;
      return;
    }

    if (arcade === "P1R" || arcade === "P2R") {
      cycleHalfDurationSelection(1);
      durationStartLock = 0.22;
      return;
    }

    if (durationStartLock <= 0 && isStartInput(arcade)) {
      startMatch();
    }
    return;
  }

  if (mode === "menu") {
    if (event.repeat) return;

    if (arcade === "P1U" || arcade === "P1D" || arcade === "P2U" || arcade === "P2D") {
      playMode = playMode === "1P" ? "2P" : "1P";
      return;
    }

    if (arcade === "P1Z" || arcade === "P2Z") {
      mode = "standings";
      return;
    }

    if (isStartInput(arcade)) {
      startCountrySelection();
    }
    return;
  }

  if (!arcade) return;

  if (mode === "gameover") {
    if (!event.repeat && isStartInput(arcade)) {
      mode = "menu";
    }
    return;
  }

  if (mode === "goal") {
    return;
  }

  if (!event.repeat) {
    if (arcade === "P1B") {
      if (cycleSelectedPlayer(0) && mode === "tutorial") tutorialFlags.switched = true;
    }

    if (playMode === "2P" && arcade === "P2B") {
      cycleSelectedPlayer(1);
    }

    if (arcade === "P1Y") {
      if (kickFromSelected(0) && mode === "tutorial") tutorialFlags.kicked = true;
    }

    if (arcade === "P1X") {
      if (kickFromSelected(0, PASS_POWER) && mode === "tutorial") tutorialFlags.kicked = true;
    }

    if (playMode === "2P" && arcade === "P2Y") {
      kickFromSelected(1);
    }

    if (playMode === "2P" && arcade === "P2X") {
      kickFromSelected(1, PASS_POWER);
    }

    if (mode === "tutorial" && tutorialExitLock <= 0 && isTutorialExitInput(arcade)) {
      tutorialDone = true;
      startDurationSelection();
      return;
    }
  }
}

function isStartInput(arcade) {
  return arcade === "START1" || arcade === "START2";
}

function isTutorialExitInput(arcade) {
  return isStartInput(arcade);
}

function startTutorial() {
  tutorialStep = 0;
  tutorialDone = false;
  tutorialExitLock = 0.2;
  tutorialFlags.moved = false;
  tutorialFlags.switched = false;
  tutorialFlags.kicked = false;

  scores[0] = 0;
  scores[1] = 0;
  timeLeft = halfDurationSeconds;
  currentHalf = 1;
  lastScorer = -1;
  goalPause = 0;
  matchPointsApplied = false;

  resetSelections();
  resetKickoff();
  mode = "tutorial";
}

function startDurationSelection() {
  durationStartLock = 0.35;
  mode = "duration_select";
}

function startMatch() {
  scores[0] = 0;
  scores[1] = 0;
  timeLeft = halfDurationSeconds;
  currentHalf = 1;
  lastScorer = -1;
  goalPause = 0;
  matchPointsApplied = false;

  resetSelections();
  resetKickoff();
  mode = "playing";
}

function startCountrySelection() {
  countrySelectionStep = 0;
  if (teamCountryIndex[0] === teamCountryIndex[1]) {
    teamCountryIndex[1] = (teamCountryIndex[1] + 1) % COUNTRY_OPTIONS.length;
  }
  mode = "country_select";
}

function cycleCountrySelection(direction) {
  const activeTeam = countrySelectionStep <= 0 ? 0 : 1;
  const count = COUNTRY_OPTIONS.length;
  let attempts = 0;

  do {
    teamCountryIndex[activeTeam] =
      (teamCountryIndex[activeTeam] + direction + count) % count;
    attempts += 1;
  } while (
    teamCountryIndex[activeTeam] === teamCountryIndex[1 - activeTeam] &&
    attempts < count
  );
}

function confirmCountrySelection() {
  const activeTeam = countrySelectionStep <= 0 ? 0 : 1;
  if (teamCountryIndex[activeTeam] === teamCountryIndex[1 - activeTeam]) {
    cycleCountrySelection(1);
  }

  countrySelectionStep += 1;
  if (playMode !== "2P" && countrySelectionStep >= 1) {
    startTutorial();
    return;
  }

  if (countrySelectionStep >= 2) {
    startTutorial();
  }
}

function cycleHalfDurationSelection(direction) {
  const count = HALF_DURATION_OPTIONS.length;
  halfDurationIndex = (halfDurationIndex + direction + count) % count;
  halfDurationSeconds = HALF_DURATION_OPTIONS[halfDurationIndex];
}

function updateTutorialProgress(_dt) {
  if (!tutorialFlags.moved) {
    tutorialStep = 0;
    return;
  }

  if (!tutorialFlags.switched) {
    tutorialStep = 1;
    return;
  }

  if (!tutorialFlags.kicked) {
    tutorialStep = 2;
    return;
  }

  tutorialStep = 3;
  tutorialDone = true;
}

function getTutorialHintText() {
  if (tutorialDone) {
    return "TUTORIAL COMPLETE\nPRESS START TO CHOOSE HALF DURATION";
  }

  if (!tutorialFlags.moved) {
    return "STEP 1: MOVE WITH JOYSTICK\nPRESS START TO CHOOSE HALF DURATION";
  }

  if (!tutorialFlags.switched) {
    return "STEP 2: PRESS B TO SWITCH TO THE CLOSEST PLAYER\nPRESS START TO CHOOSE HALF DURATION";
  }

  if (!tutorialFlags.kicked) {
    return "STEP 3: PRESS Y TO SHOOT OR X TO PASS\nPRESS START TO CHOOSE HALF DURATION";
  }

  return "PRESS START TO CHOOSE HALF DURATION";
}

function buildTeams() {
  const leftSpots = [
    [GK_HOME_X, 300, "GK"],
    [196, 196, "DF"],
    [196, 404, "DF"],
    [340, 248, "MF"],
    [340, 352, "ST"],
  ];

  teams = [[], []];

  for (let i = 0; i < TEAM_SIZE; i++) {
    const [x, y, role] = leftSpots[i];
    teams[0].push(makePlayer(0, role, x, y));
    teams[1].push(makePlayer(1, role, FIELD_W - x, y));
  }
}

function makePlayer(team, role, x, y) {
  return {
    team,
    role,
    x,
    y,
    vx: 0,
    vy: 0,
    r: PLAYER_RADIUS,
    homeX: x,
    homeY: y,
    speed: role === "GK" ? GK_SPEED : PLAYER_SPEED,
    stamina: STAMINA_MAX,
    clearCooldown: 0,
  };
}

function resetSelections() {
  selectedBlueIndex = TEAM_SIZE - 1;
  selectedRedIndex = TEAM_SIZE - 1;
  selectionCooldownBlue = 0;
  selectionCooldownRed = 0;
}

function resetKickoff() {
  for (let teamId = 0; teamId < teams.length; teamId++) {
    const team = teams[teamId];
    for (const p of team) {
      p.x = p.homeX;
      p.y = p.homeY;
      p.vx = 0;
      p.vy = 0;
      p.stamina = STAMINA_MAX;
      p.clearCooldown = 0;
    }

    aiChaserIndex[teamId] = 1;
    aiChaserLock[teamId] = 0;
  }

  ball.x = FIELD_W / 2;
  ball.y = FIELD_H / 2;
  ball.vx = (Math.random() * 2 - 1) * 30;
  ball.vy = (Math.random() * 2 - 1) * 30;
  ball.lastX = ball.x;
  ball.lastY = ball.y;

  cornerStuckId = "";
  cornerStuckTimer = 0;
  cornerAnchorX = ball.x;
  cornerAnchorY = ball.y;
  ballControllerTeam = -1;
  ballControllerIndex = -1;
  ballControllerHold = 0;
  shotReleaseTimer = 0;
  shotReleaseDirX = 0;
  shotReleaseDirY = 0;
}

function enterGameOver() {
  mode = "gameover";
  applyMatchPoints();
}

function enterHalftime() {
  if (mode !== "playing") return;
  mode = "halftime";
  goalPause = 1.3;
  timeLeft = 0;
  ball.vx = 0;
  ball.vy = 0;
}

function applyMatchPoints() {
  if (matchPointsApplied) return;
  matchPointsApplied = true;

  const p1 = ensureStanding(getPlayerName(0));
  const p2 = ensureStanding(getPlayerName(1));
  p1.played += 1;
  p2.played += 1;

  if (scores[0] > scores[1]) {
    p1.points += 3;
    p1.wins += 1;
    p2.losses += 1;
    return;
  }

  if (scores[1] > scores[0]) {
    p2.points += 3;
    p2.wins += 1;
    p1.losses += 1;
    return;
  }

  p1.points += 1;
  p2.points += 1;
  p1.draws += 1;
  p2.draws += 1;
}

function ensureStanding(name) {
  const key = normalizeName(name, "PLAYER");
  if (!standings[key]) {
    standings[key] = { name: key, points: 0, played: 0, wins: 0, draws: 0, losses: 0 };
  }
  return standings[key];
}

function getStandingsRows() {
  return Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (a.losses !== b.losses) return a.losses - b.losses;
    return a.name.localeCompare(b.name);
  });
}

function cycleSelectedPlayer(teamId) {
  if (teamId === 0 && selectionCooldownBlue > 0) return false;
  if (teamId === 1 && selectionCooldownRed > 0) return false;

  const current = getSelectedIndex(teamId);
  const ranked = getNearestFieldPlayerRanking(teamId);
  if (ranked.length === 0) return false;

  let nextIndex = ranked[0];
  if (nextIndex === current && ranked.length > 1) {
    nextIndex = ranked[1];
  }

  if (nextIndex === current) return false;

  setSelectedIndex(teamId, nextIndex);

  if (teamId === 0) {
    selectionCooldownBlue = SELECTION_COOLDOWN;
  } else {
    selectionCooldownRed = SELECTION_COOLDOWN;
  }

  return true;
}

function getFieldPlayerIndices() {
  const list = [];
  for (let i = 1; i < TEAM_SIZE; i++) list.push(i);
  return list;
}

function getPlayerName(teamId) {
  return getTeamCountry(teamId).name;
}

function getTeamColor(teamId) {
  return getTeamCountry(teamId).primary;
}

function getTeamPattern(teamId) {
  return getTeamCountry(teamId).pattern || "stripes";
}

function getTeamAccentColor(teamId) {
  return getTeamCountry(teamId).secondary;
}

function getTeamThirdColor(teamId) {
  const country = getTeamCountry(teamId);
  return country.tertiary !== undefined ? country.tertiary : country.primary;
}

function getTeamCenterMark(teamId) {
  return getTeamCountry(teamId).centerMark || null;
}

function getTeamCenterMarkColor(teamId) {
  const country = getTeamCountry(teamId);
  return country.centerMarkColor !== undefined ? country.centerMarkColor : 0xffffff;
}

function getTeamCountry(teamId) {
  const idx = teamCountryIndex[teamId];
  if (idx >= 0 && idx < COUNTRY_OPTIONS.length) return COUNTRY_OPTIONS[idx];
  return teamId === 0
    ? { name: "Player 1", primary: BLUE_TEAM_COLOR, secondary: 0xffffff, tertiary: BLUE_TEAM_COLOR }
    : { name: "Player 2", primary: RED_TEAM_COLOR, secondary: 0xffffff, tertiary: RED_TEAM_COLOR };
}

function normalizeName(value, fallback) {
  const source = typeof value === "string" ? value : "";
  const trimmed = source.replace(/\s+/g, " ").trim();
  if (!trimmed) return fallback || "";
  return trimmed.slice(0, MAX_NAME_LENGTH);
}

function truncateName(name, maxLen) {
  if (!name) return "";
  if (name.length <= maxLen) return name;
  if (maxLen <= 1) return name.slice(0, maxLen);
  return `${name.slice(0, maxLen - 1)}…`;
}

function padText(value, size) {
  const text = String(value || "");
  if (text.length >= size) return text.slice(0, size);
  return text + " ".repeat(size - text.length);
}

function formatStandingsHeader() {
  return `${padText("RANK", 5)}${padText("COUNTRY", 14)} ${"PTS".padStart(3)} ${"W".padStart(2)} ${"D".padStart(2)} ${"L".padStart(2)}`;
}

function formatStandingsLine(rank, row) {
  const rankLabel = `${rank}.`;
  return `${padText(rankLabel, 5)}${padText(row.name, 14)} ${String(row.points).padStart(3, " ")} ${String(row.wins).padStart(2, " ")} ${String(row.draws).padStart(2, " ")} ${String(row.losses).padStart(2, " ")}`;
}

function getNearestFieldPlayerRanking(teamId) {
  const ranking = [];

  for (let i = 1; i < TEAM_SIZE; i++) {
    const p = teams[teamId][i];
    ranking.push({
      index: i,
      d: distance(p.x, p.y, ball.x, ball.y),
    });
  }

  ranking.sort((a, b) => a.d - b.d);
  return ranking.map((row) => row.index);
}

function getSelectedIndex(teamId) {
  return teamId === 0 ? selectedBlueIndex : selectedRedIndex;
}

function setSelectedIndex(teamId, index) {
  if (teamId === 0) selectedBlueIndex = index;
  else selectedRedIndex = index;
}

function isHumanTeam(teamId) {
  return teamId === 0 || (playMode === "2P" && teamId === 1);
}

function applyHumanMovement(teamId, dt) {
  if (!isHumanTeam(teamId)) return 0;

  const selected = getSelectedIndex(teamId);
  const p = teams[teamId][selected];
  if (!p) return 0;

  let mx = 0;
  let my = 0;

  if (teamId === 0) {
    if (input.P1L || input.P1DL) mx -= 1;
    if (input.P1R || input.P1DR) mx += 1;
    if (input.P1U) my -= 1;
    if (input.P1D || input.P1DL || input.P1DR) my += 1;
  } else {
    if (input.P2L) mx -= 1;
    if (input.P2R) mx += 1;
    if (input.P2U) my -= 1;
    if (input.P2D) my += 1;
  }

  const mag = Math.hypot(mx, my);
  const runHeld = isRunHeld(teamId);

  if (teamId === 0 && mode === "tutorial" && mag > 0.2) tutorialFlags.moved = true;

  const targetSpeed = resolveSpeedWithStamina(p, runHeld, dt);

  if (mag > 0.001) {
    const nx = mx / mag;
    const ny = my / mag;
    approachVelocity(p, nx * targetSpeed, ny * targetSpeed, HUMAN_ACCEL, dt);
  } else {
    approachVelocity(p, 0, 0, HUMAN_ACCEL, dt);
  }

  return mag;
}

function isRunHeld(teamId) {
  if (teamId === 0) return !!input.P1RUN;
  return !!input.P2RUN;
}

function resolveSpeedWithStamina(player, wantsRun, dt) {
  if (!player) return 0;

  if (wantsRun) {
    player.stamina = Math.max(0, (player.stamina || 0) - STAMINA_DRAIN_PER_SECOND * dt);
  } else {
    player.stamina = Math.min(STAMINA_MAX, (player.stamina || 0) + STAMINA_RECOVER_PER_SECOND * dt);
  }

  const staminaRatio = clamp((player.stamina || 0) / STAMINA_MAX, 0, 1);
  const sprintMix = wantsRun ? staminaRatio : 0;
  const speedScale = WALK_SPEED_MULT + (RUN_SPEED_MULT - WALK_SPEED_MULT) * sprintMix;
  return player.speed * speedScale;
}

function updateAiTeam(teamId, dt) {
  const team = teams[teamId];
  const selected = isHumanTeam(teamId) ? getSelectedIndex(teamId) : -1;
  const hasTeamControl =
    ballControllerHold > 0 &&
    ballControllerTeam === teamId &&
    ballControllerIndex > 0 &&
    ballControllerIndex < TEAM_SIZE;

  if (hasTeamControl) {
    aiChaserIndex[teamId] = -1;
    aiChaserLock[teamId] = 0;
  } else {
    aiChaserLock[teamId] -= dt;
    if (aiChaserLock[teamId] <= 0 || !isAiPlayerEligible(teamId, aiChaserIndex[teamId], selected)) {
      aiChaserIndex[teamId] = chooseAiChaser(teamId, selected);
      aiChaserLock[teamId] = AI_CHASER_LOCK;
    }
  }

  for (let i = 0; i < team.length; i++) {
    if (i === selected) continue;

    const p = team[i];

    if (p.role === "GK") {
      updateGoalkeeperAi(p, teamId, dt);
      continue;
    }

    if (hasTeamControl) {
      if (i === ballControllerIndex) {
        const dir = getTeamAttackDirection(teamId);
        const tx = ball.x + dir * 16;
        const ty = ball.y;
        const dToBall = distance(p.x, p.y, ball.x, ball.y);
        const wantsRun = dToBall > 10 && dToBall < AI_RUN_BALL_RANGE * 0.72;
        const aiSpeed = resolveSpeedWithStamina(p, wantsRun, dt);
        steerToward(p, tx, ty, aiSpeed, dt, AI_ARRIVAL + 4);
      } else {
        steerSupportRunner(p, teamId, team[ballControllerIndex], dt);
      }
      continue;
    }

    if (i === aiChaserIndex[teamId]) {
      const lead = 0.12;
      const tx = ball.x + ball.vx * lead + (teamId === 0 ? -9 : 9);
      const ty = ball.y + ball.vy * lead;
      const dToBall = distance(p.x, p.y, ball.x, ball.y);
      const wantsRun = dToBall > 14 && dToBall < AI_RUN_BALL_RANGE;
      const aiSpeed = resolveSpeedWithStamina(p, wantsRun, dt);
      steerToward(p, tx, ty, aiSpeed, dt, AI_ARRIVAL);
      continue;
    }

    const xBias = (ball.x - FIELD_W / 2) * (p.role === "DF" ? 0.12 : 0.2);
    const yBias = (ball.y - FIELD_H / 2) * 0.18;

    const tx = clamp(p.homeX + xBias, p.r + 8, FIELD_W - p.r - 8);
    const ty = clamp(p.homeY + yBias, p.r + 8, FIELD_H - p.r - 8);
    const dToTarget = distance(p.x, p.y, tx, ty);
    const wantsRun = dToTarget > AI_RUN_DISTANCE;
    const aiSpeed = resolveSpeedWithStamina(p, wantsRun, dt);
    steerToward(p, tx, ty, aiSpeed * 0.92, dt, AI_ARRIVAL + 8);
  }
}

function isAiPlayerEligible(teamId, index, selected) {
  if (index <= 0 || index >= TEAM_SIZE) return false;
  if (index === selected) return false;
  return teams[teamId][index].role !== "GK";
}

function chooseAiChaser(teamId, selected) {
  let best = -1;
  let bestDist = Infinity;

  for (let i = 1; i < TEAM_SIZE; i++) {
    if (i === selected) continue;

    const p = teams[teamId][i];
    const d = distance(p.x, p.y, ball.x, ball.y);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }

  return best > 0 ? best : 1;
}

function getTeamAttackDirection(teamId) {
  return teamId === 0 ? 1 : -1;
}

function steerSupportRunner(player, teamId, controller, dt) {
  if (!controller) return;

  const dir = getTeamAttackDirection(teamId);
  let laneShiftX = 0;
  if (player.role === "DF") laneShiftX = -132 * dir;
  else if (player.role === "MF") laneShiftX = 36 * dir;
  else laneShiftX = 122 * dir;

  let tx = controller.x + laneShiftX;
  let ty = player.homeY + (controller.y - player.homeY) * 0.34;

  const dBall = distance(player.x, player.y, ball.x, ball.y);
  if (dBall < TEAM_SUPPORT_MIN_BALL_DIST) {
    const dx = player.x - ball.x;
    const dy = player.y - ball.y;
    const d = Math.hypot(dx, dy) || 1;
    const push = (TEAM_SUPPORT_MIN_BALL_DIST - dBall) * 1.7;
    tx += (dx / d) * push;
    ty += (dy / d) * push;
  }

  tx = clamp(tx, player.r + 8, FIELD_W - player.r - 8);
  ty = clamp(ty, player.r + 8, FIELD_H - player.r - 8);

  const dToTarget = distance(player.x, player.y, tx, ty);
  const wantsRun = dToTarget > AI_RUN_DISTANCE + 8;
  const aiSpeed = resolveSpeedWithStamina(player, wantsRun, dt);
  steerToward(player, tx, ty, aiSpeed * 0.94, dt, AI_ARRIVAL + 11);
}

function updateGoalkeeperAi(p, teamId, dt) {
  let tx = p.homeX + (teamId === 0 ? 2 : -2);
  let ty = clamp(ball.y + ball.vy * 0.06, GOAL_TOP + 24, GOAL_BOTTOM - 24);

  const threatX = teamId === 0 ? ball.x < GK_DANGER_X : ball.x > FIELD_W - GK_DANGER_X;
  const threatLane = ball.y > GOAL_TOP - GK_CLEAR_LANE_PAD && ball.y < GOAL_BOTTOM + GK_CLEAR_LANE_PAD;

  if (threatX) {
    if (teamId === 0) tx += 9;
    else tx -= 9;
  }

  if (threatX && threatLane) {
    tx = teamId === 0 ? GK_X_MAX - 2 : FIELD_W - GK_X_MAX + 2;
    ty = clamp(ball.y + ball.vy * 0.08, GOAL_TOP + 8, GOAL_BOTTOM - 8);
  }

  const dToTarget = distance(p.x, p.y, tx, ty);
  const ballThreat =
    (teamId === 0 && ball.x < 250) || (teamId === 1 && ball.x > FIELD_W - 250) || (threatX && threatLane);
  const wantsRun = ballThreat && dToTarget > 7;
  const aiSpeed = resolveSpeedWithStamina(p, wantsRun, dt);
  steerToward(p, tx, ty, aiSpeed, dt, AI_ARRIVAL + 5);
}

function movePlayers(dt) {
  for (const team of teams) {
    for (const p of team) {
      if (p.clearCooldown > 0) p.clearCooldown = Math.max(0, p.clearCooldown - dt);

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.role === "GK") {
        if (p.team === 0) {
          p.x = clamp(p.x, GK_X_MIN, GK_X_MAX);
          if (p.x === GK_X_MIN && p.vx < 0) p.vx = 0;
          if (p.x === GK_X_MAX && p.vx > 0) p.vx = 0;
        } else {
          p.x = clamp(p.x, FIELD_W - GK_X_MAX, FIELD_W - GK_X_MIN);
          if (p.x === FIELD_W - GK_X_MAX && p.vx < 0) p.vx = 0;
          if (p.x === FIELD_W - GK_X_MIN && p.vx > 0) p.vx = 0;
        }

        p.y = clamp(p.y, GK_Y_MIN, GK_Y_MAX);
        if (p.y === GK_Y_MIN && p.vy < 0) p.vy = 0;
        if (p.y === GK_Y_MAX && p.vy > 0) p.vy = 0;
      } else {
        p.x = clamp(p.x, p.r + 6, FIELD_W - p.r - 6);
        p.y = clamp(p.y, p.r + 6, FIELD_H - p.r - 6);

        if (p.x === p.r + 6 && p.vx < 0) p.vx = 0;
        if (p.x === FIELD_W - p.r - 6 && p.vx > 0) p.vx = 0;
        if (p.y === p.r + 6 && p.vy < 0) p.vy = 0;
        if (p.y === FIELD_H - p.r - 6 && p.vy > 0) p.vy = 0;
      }
    }
  }
}

function resolvePlayerOverlaps() {
  const all = [];
  for (const team of teams) {
    for (const p of team) all.push(p);
  }

  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i];
      const b = all[j];

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      const minD = a.r + b.r - 1;

      if (d <= 0.0001 || d >= minD) continue;

      const nx = dx / d;
      const ny = dy / d;
      const push = (minD - d) * 0.5;

      a.x -= nx * push;
      a.y -= ny * push;
      b.x += nx * push;
      b.y += ny * push;

      clampPlayerInsideBounds(a);
      clampPlayerInsideBounds(b);
    }
  }
}

function clampPlayerInsideBounds(p) {
  if (p.role === "GK") {
    if (p.team === 0) p.x = clamp(p.x, GK_X_MIN, GK_X_MAX);
    else p.x = clamp(p.x, FIELD_W - GK_X_MAX, FIELD_W - GK_X_MIN);

    p.y = clamp(p.y, GK_Y_MIN, GK_Y_MAX);
  } else {
    p.x = clamp(p.x, p.r + 6, FIELD_W - p.r - 6);
    p.y = clamp(p.y, p.r + 6, FIELD_H - p.r - 6);
  }
}

function kickFromSelected(teamId, power = KICK_POWER) {
  const idx = getSelectedIndex(teamId);
  const p = teams[teamId][idx];
  if (!p) return false;

  const dx = ball.x - p.x;
  const dy = ball.y - p.y;
  const d = Math.hypot(dx, dy);

  if (d > p.r + ball.r + 30) return false;

  let nx;
  let ny;

  if (d > 0.001) {
    nx = dx / d;
    ny = dy / d;
  } else {
    nx = teamId === 0 ? 1 : -1;
    ny = 0;
  }

  const velShare = power >= KICK_POWER * 0.95 ? SHOOT_PLAYER_VEL_SHARE : PASS_PLAYER_VEL_SHARE;
  ball.vx += nx * power + p.vx * velShare;
  ball.vy += ny * power + p.vy * velShare;
  if (power >= KICK_POWER * 0.95) {
    shotReleaseTimer = SHOT_RELEASE_TIME;
    shotReleaseDirX = nx;
    shotReleaseDirY = ny;
    ballControllerHold = 0;
    ballControllerTeam = -1;
    ballControllerIndex = -1;
  }
  clampBallSpeed();
  return true;
}

function updateBall(dt, allowGoals) {
  ball.lastX = ball.x;
  ball.lastY = ball.y;

  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  const drag = Math.pow(BALL_DRAG_PER_60FPS, dt * 60);
  ball.vx *= drag;
  ball.vy *= drag;

  if (shotReleaseTimer > 0) {
    applyShotReleasePhysics(dt);
    shotReleaseTimer = Math.max(0, shotReleaseTimer - dt);
  }

  clampBallSpeed();
  collideBallWithPlayers(dt);

  handleWallCollisions(allowGoals);
  applyBoundaryWakeup();
  applyCornerRescue(dt);

  if (Math.abs(ball.vx) < 1.2) ball.vx = 0;
  if (Math.abs(ball.vy) < 1.2) ball.vy = 0;
}

function clampBallSpeed() {
  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed <= BALL_MAX_SPEED || speed <= 0.001) return;

  const s = BALL_MAX_SPEED / speed;
  ball.vx *= s;
  ball.vy *= s;
}

function collideBallWithPlayers(dt) {
  let controlPlayer = null;
  let controlScore = -Infinity;
  let touchMask = 0;
  const touchCount = [0, 0];
  const touchByTeam = [null, null];

  for (const team of teams) {
    for (const p of team) {
      const dx = ball.x - p.x;
      const dy = ball.y - p.y;
      const d = Math.hypot(dx, dy);
      const minD = ball.r + p.r;

      if (d >= minD || d <= 0.0001) continue;

      const nx = dx / d;
      const ny = dy / d;
      const overlap = minD - d + 0.2;
      const preSpeed = Math.hypot(ball.vx, ball.vy);

      ball.x += nx * overlap;
      ball.y += ny * overlap;

      const rvx = ball.vx - p.vx;
      const rvy = ball.vy - p.vy;
      const relNormal = rvx * nx + rvy * ny;

      if (relNormal < 0) {
        const impulse = -(1 + TOUCH_RESTITUTION) * relNormal;
        ball.vx += nx * impulse;
        ball.vy += ny * impulse;
      }

      ball.vx += p.vx * TOUCH_PLAYER_VEL_INFLUENCE;
      ball.vy += p.vy * TOUCH_PLAYER_VEL_INFLUENCE;

      const speed = Math.hypot(ball.vx, ball.vy);
      if (speed < TOUCH_MIN_SPEED) {
        ball.vx += nx * (TOUCH_MIN_SPEED - speed);
        ball.vy += ny * (TOUCH_MIN_SPEED - speed);
      }

      const boostedSpeed = Math.hypot(ball.vx, ball.vy);
      let maxAllowedSpeed = preSpeed + TOUCH_MAX_SPEED_BOOST;
      if (preSpeed < TOUCH_MAX_SPEED_FROM_SLOW) {
        maxAllowedSpeed = Math.min(maxAllowedSpeed, TOUCH_MAX_SPEED_FROM_SLOW);
      }

      if (boostedSpeed > maxAllowedSpeed && boostedSpeed > 0.001) {
        const s = maxAllowedSpeed / boostedSpeed;
        ball.vx *= s;
        ball.vy *= s;
      }

      if (p.role === "GK") applyGoalkeeperClear(p);

      touchMask |= p.team === 0 ? 1 : 2;
      touchCount[p.team] += 1;
      if (!touchByTeam[p.team] || d < touchByTeam[p.team].d) {
        touchByTeam[p.team] = { p, d };
      }

      const goalDir = getAttackGoalDirection(p);
      const onBallForward =
        (ball.x - p.x) * goalDir.x + (ball.y - p.y) * goalDir.y;
      const score = (minD - d) * 3 + onBallForward * 0.11;
      if (score > controlScore) {
        controlScore = score;
        controlPlayer = p;
      }
    }
  }

  if (shotReleaseTimer > 0) {
    ballControllerTeam = -1;
    ballControllerIndex = -1;
    ballControllerHold = 0;
  } else if (controlPlayer) {
    const idx = getPlayerIndexInTeam(controlPlayer);
    if (idx >= 0) {
      ballControllerTeam = controlPlayer.team;
      ballControllerIndex = idx;
      ballControllerHold = BALL_CONTROLLER_MEMORY;
    }
  } else if (ballControllerHold > 0) {
    ballControllerHold = Math.max(0, ballControllerHold - dt);
    if (ballControllerHold <= 0) {
      ballControllerTeam = -1;
      ballControllerIndex = -1;
    }
  }

  if (shotReleaseTimer > 0) {
    if (touchMask === 3 && touchCount[0] > 0 && touchCount[1] > 0) {
      applyDuelBreakout(touchByTeam[0] && touchByTeam[0].p, touchByTeam[1] && touchByTeam[1].p);
      applyShotReleaseContestBoost();
    }
  } else {
    applyDribbleControl(controlPlayer, touchMask, dt);
    if (touchMask === 3 && touchCount[0] > 0 && touchCount[1] > 0) {
      applyDuelBreakout(touchByTeam[0] && touchByTeam[0].p, touchByTeam[1] && touchByTeam[1].p);
    }
  }
  clampBallSpeed();
}

function getPlayerIndexInTeam(player) {
  if (!player || player.team < 0 || player.team >= teams.length) return -1;
  const team = teams[player.team];
  for (let i = 0; i < team.length; i++) {
    if (team[i] === player) return i;
  }
  return -1;
}

function applyShotReleasePhysics(dt) {
  let dx = shotReleaseDirX;
  let dy = shotReleaseDirY;
  const d = Math.hypot(dx, dy);
  if (d > 0.0001) {
    dx /= d;
    dy /= d;
  } else {
    const s = Math.hypot(ball.vx, ball.vy);
    if (s > 0.0001) {
      dx = ball.vx / s;
      dy = ball.vy / s;
    } else {
      dx = ball.x < FIELD_W / 2 ? 1 : -1;
      dy = 0;
    }
  }

  ball.vx += dx * SHOT_RELEASE_FORWARD * dt;
  ball.vy += dy * SHOT_RELEASE_FORWARD * dt;

  if (ball.y < SHOT_RELEASE_WALL_MARGIN) {
    ball.vy += SHOT_RELEASE_WALL_ESCAPE * dt;
  } else if (ball.y > FIELD_H - SHOT_RELEASE_WALL_MARGIN) {
    ball.vy -= SHOT_RELEASE_WALL_ESCAPE * dt;
  }

  if (ball.x < SHOT_RELEASE_WALL_MARGIN) {
    ball.vx += SHOT_RELEASE_WALL_ESCAPE * dt;
  } else if (ball.x > FIELD_W - SHOT_RELEASE_WALL_MARGIN) {
    ball.vx -= SHOT_RELEASE_WALL_ESCAPE * dt;
  }
}

function applyShotReleaseContestBoost() {
  let dx = shotReleaseDirX;
  let dy = shotReleaseDirY;
  const d = Math.hypot(dx, dy);
  if (d > 0.0001) {
    dx /= d;
    dy /= d;
  } else {
    const cx = FIELD_W / 2 - ball.x;
    const cy = FIELD_H / 2 - ball.y;
    const cd = Math.hypot(cx, cy) || 1;
    dx = cx / cd;
    dy = cy / cd;
  }

  ball.vx += dx * SHOT_RELEASE_CONTESTED_PUSH;
  ball.vy += dy * SHOT_RELEASE_CONTESTED_PUSH;
}

function applyDribbleControl(player, touchMask, dt) {
  if (!player || dt <= 0) return;

  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed > DRIBBLE_CONTROL_MAX_ACTIVE_SPEED) return;

  const goalDir = getAttackGoalDirection(player);
  const frontDist = Math.max(2, player.r + ball.r - 1.4);
  const tx = player.x + goalDir.x * frontDist;
  const ty = player.y + goalDir.y * frontDist;

  const lerp = clamp(DRIBBLE_REPOSITION_LERP_PER_SEC * dt, 0, 1);
  ball.x += (tx - ball.x) * lerp;
  ball.y += (ty - ball.y) * lerp;

  ball.vx += (tx - ball.x) * DRIBBLE_PULL * dt;
  ball.vy += (ty - ball.y) * DRIBBLE_PULL * dt;
  const contested = touchMask === 3;
  const forwardPush = contested ? DRIBBLE_FORWARD_PUSH_CONTESTED : DRIBBLE_FORWARD_PUSH;
  ball.vx += goalDir.x * forwardPush * dt + player.vx * DRIBBLE_CARRIER_VEL_SHARE * dt;
  ball.vy += goalDir.y * forwardPush * dt + player.vy * DRIBBLE_CARRIER_VEL_SHARE * dt;

  if (contested) {
    const cdx = FIELD_W / 2 - ball.x;
    const cdy = FIELD_H / 2 - ball.y;
    const cd = Math.hypot(cdx, cdy) || 1;
    ball.vx += (cdx / cd) * DRIBBLE_CONTESTED_CENTER_PUSH * dt;
    ball.vy += (cdy / cd) * DRIBBLE_CONTESTED_CENTER_PUSH * dt;

    if (ball.y < DRIBBLE_ESCAPE_WALL_MARGIN) {
      ball.vy += DRIBBLE_CONTESTED_ESCAPE * dt;
    } else if (ball.y > FIELD_H - DRIBBLE_ESCAPE_WALL_MARGIN) {
      ball.vy -= DRIBBLE_CONTESTED_ESCAPE * dt;
    }

    if (ball.x < DRIBBLE_ESCAPE_WALL_MARGIN) {
      ball.vx += DRIBBLE_CONTESTED_ESCAPE * dt;
    } else if (ball.x > FIELD_W - DRIBBLE_ESCAPE_WALL_MARGIN) {
      ball.vx -= DRIBBLE_CONTESTED_ESCAPE * dt;
    }
  }

  const s = Math.hypot(ball.vx, ball.vy);
  if (s > DRIBBLE_MAX_SPEED && s > 0.001) {
    const scale = DRIBBLE_MAX_SPEED / s;
    ball.vx *= scale;
    ball.vy *= scale;
  }
}

function applyDuelBreakout(a, b) {
  if (!a || !b) return;

  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const abd = Math.hypot(abx, aby);
  if (abd <= 0.0001 || abd > DUEL_BREAKOUT_PLAYER_GAP) return;

  const mx = (a.x + b.x) * 0.5;
  const my = (a.y + b.y) * 0.5;
  const mdx = ball.x - mx;
  const mdy = ball.y - my;
  const mdd = Math.hypot(mdx, mdy);
  if (mdd > DUEL_BREAKOUT_MID_RADIUS) return;

  let ex;
  let ey;
  if (mdd > 0.0001) {
    ex = mdx / mdd;
    ey = mdy / mdd;
  } else {
    ex = -aby / abd;
    ey = abx / abd;
    const centerDot = ex * (FIELD_W / 2 - ball.x) + ey * (FIELD_H / 2 - ball.y);
    if (centerDot < 0) {
      ex = -ex;
      ey = -ey;
    }
  }

  ball.x += ex * DUEL_BREAKOUT_NUDGE;
  ball.y += ey * DUEL_BREAKOUT_NUDGE;

  let px = -aby / abd;
  let py = abx / abd;
  const perpCenterDot = px * (FIELD_W / 2 - ball.x) + py * (FIELD_H / 2 - ball.y);
  if (perpCenterDot < 0) {
    px = -px;
    py = -py;
  }

  const outSpeed = ball.vx * ex + ball.vy * ey;
  if (outSpeed < DUEL_BREAKOUT_MIN_OUT_SPEED) {
    const boost = DUEL_BREAKOUT_MIN_OUT_SPEED - outSpeed;
    ball.vx += ex * boost;
    ball.vy += ey * boost;
  }

  ball.vx += px * DUEL_BREAKOUT_PERP_BIAS;
  ball.vy += py * DUEL_BREAKOUT_PERP_BIAS;
}

function applyGoalkeeperClear(gk) {
  if (!gk || gk.role !== "GK") return;
  if ((gk.clearCooldown || 0) > 0) return;

  const inOwnZone = gk.team === 0 ? ball.x < GK_CLEAR_ZONE_X : ball.x > FIELD_W - GK_CLEAR_ZONE_X;
  const inLane = ball.y > GOAL_TOP - GK_CLEAR_LANE_PAD && ball.y < GOAL_BOTTOM + GK_CLEAR_LANE_PAD;
  if (!inOwnZone || !inLane) return;

  const targetX = gk.team === 0 ? FIELD_W * 0.72 : FIELD_W * 0.28;
  const targetY = clamp(FIELD_H * 0.5 + (ball.y - FIELD_H * 0.5) * 0.32, GOAL_TOP + 16, GOAL_BOTTOM - 16);

  let nx = targetX - ball.x;
  let ny = targetY - ball.y;
  let nd = Math.hypot(nx, ny);
  if (nd <= 0.0001) {
    nx = gk.team === 0 ? 1 : -1;
    ny = 0;
    nd = 1;
  }
  nx /= nd;
  ny /= nd;

  ball.x += nx * 3.4;
  ball.y += ny * 3.4;

  ball.vx += nx * GK_CLEAR_POWER + gk.vx * 0.45;
  ball.vy += ny * GK_CLEAR_POWER * 0.72 + gk.vy * 0.45;

  if (ball.y < DRIBBLE_ESCAPE_WALL_MARGIN) ball.vy += GK_CLEAR_POWER * 0.28;
  if (ball.y > FIELD_H - DRIBBLE_ESCAPE_WALL_MARGIN) ball.vy -= GK_CLEAR_POWER * 0.28;

  gk.clearCooldown = GK_CLEAR_COOLDOWN;
}

function getAttackGoalDirection(player) {
  const gx = player.team === 0 ? FIELD_W : 0;
  const gy = (GOAL_TOP + GOAL_BOTTOM) * 0.5;
  const dx = gx - player.x;
  const dy = gy - player.y;
  const d = Math.hypot(dx, dy) || 1;
  return { x: dx / d, y: dy / d };
}

function handleWallCollisions(allowGoals) {
  if (ball.y < ball.r) {
    ball.y = ball.r;
    bounceBallY(1);
  } else if (ball.y > FIELD_H - ball.r) {
    ball.y = FIELD_H - ball.r;
    bounceBallY(-1);
  }

  const inGoalMouth = ball.y > GOAL_TOP && ball.y < GOAL_BOTTOM;

  if (ball.x < ball.r) {
    if (allowGoals && inGoalMouth) {
      scoreGoal(1);
      return;
    }

    ball.x = ball.r;
    bounceBallX(1);
  } else if (ball.x > FIELD_W - ball.r) {
    if (allowGoals && inGoalMouth) {
      scoreGoal(0);
      return;
    }

    ball.x = FIELD_W - ball.r;
    bounceBallX(-1);
  }
}

function bounceBallX(direction) {
  ball.vx = direction * Math.max(Math.abs(ball.vx) * WALL_BOUNCE, BALL_MIN_BOUNCE_SPEED);

  if (Math.abs(ball.vy) < BALL_MIN_BOUNCE_SPEED * 0.45) {
    const curveDir = ball.y < FIELD_H / 2 ? 1 : -1;
    ball.vy += curveDir * BALL_MIN_BOUNCE_SPEED * 0.45;
  }
}

function bounceBallY(direction) {
  ball.vy = direction * Math.max(Math.abs(ball.vy) * WALL_BOUNCE, BALL_MIN_BOUNCE_SPEED);

  if (Math.abs(ball.vx) < BALL_MIN_BOUNCE_SPEED * 0.45) {
    const curveDir = ball.x < FIELD_W / 2 ? 1 : -1;
    ball.vx += curveDir * BALL_MIN_BOUNCE_SPEED * 0.45;
  }
}

function applyBoundaryWakeup() {
  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed > 8) return;

  const nearWall =
    ball.x <= ball.r + 1 ||
    ball.x >= FIELD_W - ball.r - 1 ||
    ball.y <= ball.r + 1 ||
    ball.y >= FIELD_H - ball.r - 1;

  if (!nearWall) return;

  const dx = FIELD_W / 2 - ball.x;
  const dy = FIELD_H / 2 - ball.y;
  const d = Math.hypot(dx, dy) || 1;

  ball.vx = (dx / d) * BALL_WAKE_SPEED;
  ball.vy = (dy / d) * BALL_WAKE_SPEED;
}

function applyCornerRescue(dt) {
  const cornerId = detectCorner(ball.x, ball.y);

  if (!cornerId) {
    cornerStuckId = "";
    cornerStuckTimer = 0;
    cornerAnchorX = ball.x;
    cornerAnchorY = ball.y;
    return;
  }

  if (cornerStuckId !== cornerId) {
    cornerStuckId = cornerId;
    cornerStuckTimer = 0;
    cornerAnchorX = ball.x;
    cornerAnchorY = ball.y;
    return;
  }

  const anchorDist = distance(ball.x, ball.y, cornerAnchorX, cornerAnchorY);
  if (anchorDist > CORNER_STUCK_RADIUS) {
    cornerStuckTimer = 0;
    cornerAnchorX = ball.x;
    cornerAnchorY = ball.y;
    return;
  }

  cornerStuckTimer += dt;
  if (cornerStuckTimer < CORNER_STUCK_TIME) return;

  const centerDx = FIELD_W / 2 - ball.x;
  const centerDy = FIELD_H / 2 - ball.y;
  const centerD = Math.hypot(centerDx, centerDy) || 1;
  const cx = centerDx / centerD;
  const cy = centerDy / centerD;

  const wx = ball.x < FIELD_W / 2 ? 1 : -1;
  const wy = ball.y < FIELD_H / 2 ? 1 : -1;

  let vx = cx * 180 + wx * 150;
  let vy = cy * 180 + wy * 150;
  const vd = Math.hypot(vx, vy) || 1;
  vx = (vx / vd) * 235;
  vy = (vy / vd) * 235;

  ball.x += wx * 8;
  ball.y += wy * 8;
  ball.vx = vx;
  ball.vy = vy;

  cornerStuckId = "";
  cornerStuckTimer = 0;
  cornerAnchorX = ball.x;
  cornerAnchorY = ball.y;
}

function detectCorner(x, y) {
  const left = x < CORNER_ZONE;
  const right = x > FIELD_W - CORNER_ZONE;
  const top = y < CORNER_ZONE;
  const bottom = y > FIELD_H - CORNER_ZONE;

  if (left && top) return "tl";
  if (right && top) return "tr";
  if (left && bottom) return "bl";
  if (right && bottom) return "br";
  return "";
}

function scoreGoal(teamId) {
  if (mode !== "playing") return;

  scores[teamId] += 1;
  lastScorer = teamId;
  mode = "goal";
  goalPause = 1.05;

  ball.vx = 0;
  ball.vy = 0;
}

function approachVelocity(player, targetVx, targetVy, accel, dt) {
  const maxDelta = accel * dt;

  player.vx += clamp(targetVx - player.vx, -maxDelta, maxDelta);
  player.vy += clamp(targetVy - player.vy, -maxDelta, maxDelta);

  if (Math.abs(targetVx) < 0.5 && Math.abs(player.vx) < 0.8) player.vx = 0;
  if (Math.abs(targetVy) < 0.5 && Math.abs(player.vy) < 0.8) player.vy = 0;
}

function steerToward(player, tx, ty, maxSpeed, dt, arrivalRadius) {
  const dx = tx - player.x;
  const dy = ty - player.y;
  const d = Math.hypot(dx, dy);

  if (d < 0.001) {
    approachVelocity(player, 0, 0, AI_ACCEL, dt);
    return;
  }

  let speed = maxSpeed;
  if (d < arrivalRadius) speed *= d / arrivalRadius;

  const targetVx = (dx / d) * speed;
  const targetVy = (dy / d) * speed;
  approachVelocity(player, targetVx, targetVy, AI_ACCEL, dt);
}

function renderGameToText() {
  const payload = {
    coordinate_system: "origin: top-left, +x right, +y down, pixels",
    mode,
    play_mode: playMode,
    menu_action: "NEW MATCH",
    player_names: {
      player_1: getPlayerName(0),
      player_2: getPlayerName(1),
    },
    team_colors: {
      blue: {
        primary: colorToHex(getTeamColor(0)),
        secondary: colorToHex(getTeamAccentColor(0)),
        tertiary: colorToHex(getTeamThirdColor(0)),
      },
      red: {
        primary: colorToHex(getTeamColor(1)),
        secondary: colorToHex(getTeamAccentColor(1)),
        tertiary: colorToHex(getTeamThirdColor(1)),
      },
    },
    standings: getStandingsRows().map((row) => ({
      name: row.name,
      points: row.points,
      played: row.played,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
    })),
    country_selection: {
      active: mode === "country_select",
      step: countrySelectionStep + 1,
      player_1: getPlayerName(0),
      player_2: getPlayerName(1),
    },
    tutorial_step: mode === "tutorial" ? tutorialStep + 1 : 0,
    tutorial_completed: tutorialDone,
    half_duration_seconds: halfDurationSeconds,
    current_half: currentHalf,
    total_halves: TOTAL_HALVES,
    time_left: Number(timeLeft.toFixed(2)),
    score: {
      blue: scores[0],
      red: scores[1],
    },
    selected_blue_player: selectedBlueIndex,
    selected_red_player: selectedRedIndex,
    selected_blue_stamina: Number(((teams[0][selectedBlueIndex] && teams[0][selectedBlueIndex].stamina) || 0).toFixed(1)),
    selected_red_stamina: Number(((teams[1][selectedRedIndex] && teams[1][selectedRedIndex].stamina) || 0).toFixed(1)),
    ball: {
      x: Number(ball.x.toFixed(1)),
      y: Number(ball.y.toFixed(1)),
      vx: Number(ball.vx.toFixed(1)),
      vy: Number(ball.vy.toFixed(1)),
      r: ball.r,
    },
    ball_controller: {
      active: ballControllerHold > 0 && ballControllerTeam >= 0 && ballControllerIndex >= 0,
      team: ballControllerTeam,
      index: ballControllerIndex,
      hold: Number(ballControllerHold.toFixed(2)),
    },
    teams: {
      blue: teams[0].map(playerToText),
      red: teams[1].map(playerToText),
    },
  };

  return JSON.stringify(payload);
}

function playerToText(p) {
  return {
    role: p.role,
    x: Number(p.x.toFixed(1)),
    y: Number(p.y.toFixed(1)),
    vx: Number(p.vx.toFixed(1)),
    vy: Number(p.vy.toFixed(1)),
    stamina: Number((p.stamina || 0).toFixed(1)),
  };
}

function installTestingHooks() {
  const advance = (ms) => {
    manualStep = true;
    const frame = 1000 / 60;
    const frames = Math.max(1, Math.round(ms / frame));
    for (let i = 0; i < frames; i++) stepGame(frame / 1000);
    renderScene();
  };

  window.render_game_to_text = renderGameToText;
  window.advanceTime = advance;

  if (window.parent && window.parent !== window) {
    try {
      window.parent.render_game_to_text = renderGameToText;
      window.parent.advanceTime = advance;
    } catch (_err) { }
  }
}

function getArcadeCode(event) {
  // In 1P, route arrows to player 1 so arcade sticks mapped to arrows remain playable.
  if (playMode === "1P") {
    if (event.key === "ArrowUp" || event.code === "ArrowUp") return "P1U";
    if (event.key === "ArrowDown" || event.code === "ArrowDown") return "P1D";
    if (event.key === "ArrowLeft" || event.code === "ArrowLeft") return "P1L";
    if (event.key === "ArrowRight" || event.code === "ArrowRight") return "P1R";
  }

  if (KEYBOARD_TO_ARCADE[event.key]) return KEYBOARD_TO_ARCADE[event.key];
  if (KEYBOARD_TO_ARCADE[event.code]) return KEYBOARD_TO_ARCADE[event.code];

  const lower = event.key && event.key.length === 1 ? event.key.toLowerCase() : event.key;
  return KEYBOARD_TO_ARCADE[lower] || null;
}

function resizeCanvasDisplay() {
  if (!sceneRef || !sceneRef.game || !sceneRef.game.canvas) return;
  const canvas = sceneRef.game.canvas;
  const targetW = Math.max(1, window.innerWidth || FIELD_W);
  const targetH = Math.max(1, window.innerHeight || FIELD_H);

  canvas.style.display = "block";
  canvas.style.width = `${targetW}px`;
  canvas.style.height = `${targetH}px`;
  canvas.style.maxWidth = "none";
  canvas.style.maxHeight = "none";

  if (document.body) {
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
  }
}

function colorToHex(color) {
  return `#${(color >>> 0).toString(16).padStart(6, "0").slice(-6)}`;
}

function distance(ax, ay, bx, by) {
  return Math.hypot(bx - ax, by - ay);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
