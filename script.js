// ===============================
// LEVEL DEFINITIONS
// ===============================
const LEVEL_TYPES = {
  CLEAR_ALL: "clear_all",
  TIME_ATTACK: "time_attack"
};

const levels = [
  {
    id: 1,
    type: LEVEL_TYPES.CLEAR_ALL,
    totalBlocks: 10,
    colors: { red: 1 },
    timeLimit: null,
    
    lanes: {
      count: 1
    },

    modifiers: {
      fallSpeed: {
        type: "static",
        value: 0.4
      },
      spawnRate: {
        type: "static",
        interval: 1400
      }
    }
  },
  {
    id: 2,
    type: LEVEL_TYPES.CLEAR_ALL,
    totalBlocks: 15,
    colors: { red: 0.5, blue: 0.5 },
    timeLimit: null,

    modifiers: {
      fallSpeed: {
        type: "byProgress",
        from: 0.4,
        to: 0.8
      },
      spawnRate: {
        type: "byProgress",
        from: 1600,
        to: 900
      }
    }
  },
{
  id: 3,
  type: LEVEL_TYPES.CLEAR_ALL,
  totalBlocks: 22,
  colors: { red: 0.5, blue: 0.5 },
  timeLimit: null,

  modifiers: {
    fallSpeed: {
      type: "byProgress",
      from: 0.6,
      to: 1.0
    },
    spawnRate: {
      type: "static",
      interval: 1100
    }
  }
},
{
  id: 4,
  type: LEVEL_TYPES.CLEAR_ALL,
  totalBlocks: 26,
  colors: { green: 0.5, yellow: 0.5 },
  timeLimit: null,

  modifiers: {
    fallSpeed: { type: "static", value: 0.85 },
    spawnRate: {
      type: "byProgress",
      from: 1000,
      to: 700
    }
  }
},
{
  id: 5,
  type: LEVEL_TYPES.CLEAR_ALL,
  totalBlocks: 28,
  colors: { red: 0.34, blue: 0.33, green: 0.33 },
  timeLimit: null,

  modifiers: {
    fallSpeed: {
      type: "byProgress",
      from: 0.75,
      to: 1.1
    },
    spawnRate: { type: "static", interval: 900 }
  }
},
  {
    id: 6,
    type: LEVEL_TYPES.TIME_ATTACK,
    totalBlocks: 20,
    colors: { red: 0.4, green: 0.3, blue: 0.3 },
    timeLimit: 45,

    modifiers: {
      fallSpeed: {
        type: "byTime",
        from: 0.6,
        to: 1.2
      },
      spawnRate: {
        type: "byTime",
        from: 1200,
        to: 600
      }
    }
  },
{
  id: 7,
  type: LEVEL_TYPES.TIME_ATTACK,
  totalBlocks: 32,
  colors: { red: 0.4, blue: 0.3, yellow: 0.3 },
  timeLimit: 48,

  modifiers: {
    fallSpeed: {
      type: "byTime",
      from: 0.8,
      to: 1.5
    },
    spawnRate: {
      type: "byTime",
      from: 1000,
      to: 550
    }
  }
},
{
  id: 8,
  type: LEVEL_TYPES.CLEAR_ALL,
  totalBlocks: 30,
  colors: {
    red: 0.25,
    blue: 0.25,
    green: 0.25,
    yellow: 0.25
  },
  timeLimit: null,

  modifiers: {
    fallSpeed: { type: "static", value: 0.95 },
    spawnRate: {
      type: "byProgress",
      from: 800,
      to: 500
    }
  }
},
{
  id: 9,
  type: LEVEL_TYPES.CLEAR_ALL,
  totalBlocks: 34,
  colors: {
    red: 0.2,
    blue: 0.2,
    green: 0.2,
    yellow: 0.2,
    purple: 0.2
  },
  timeLimit: null,

  modifiers: {
    fallSpeed: {
      type: "byProgress",
      from: 0.9,
      to: 1.3
    },
    spawnRate: {
      type: "static",
      interval: 650
    }
  }
},
{
  id: 10,
  type: LEVEL_TYPES.TIME_ATTACK,
  totalBlocks: 30,
  colors: {
    cyan: 0.25,
    magenta: 0.25,
    orange: 0.25,
    purple: 0.25
  },
  timeLimit: 36,

  modifiers: {
    fallSpeed: {
      type: "byTime",
      from: 1.0,
      to: 1.7
    },
    spawnRate: {
      type: "static",
      interval: 650
    }
  }
},
{
  id: 11,
  type: LEVEL_TYPES.CLEAR_ALL,
  totalBlocks: 42,
  colors: {
    red: 0.2,
    blue: 0.2,
    green: 0.2,
    yellow: 0.2,
    orange: 0.2
  },
  timeLimit: null,

  modifiers: {
    fallSpeed: { type: "static", value: 0.9 },
    spawnRate: { type: "static", interval: 750 }
  }
},
{
  id: 12,
  type: LEVEL_TYPES.TIME_ATTACK,
  totalBlocks: 50,
  colors: {
    red: 0.15,
    blue: 0.15,
    green: 0.15,
    yellow: 0.15,
    purple: 0.2,
    orange: 0.2
  },
  timeLimit: 60,

  modifiers: {
    fallSpeed: {
      type: "byTime",
      from: 0.9,
      to: 1.9
    },
    spawnRate: {
      type: "byTime",
      from: 900,
      to: 350
    }
  }
},
{
  id: 13,
  type: LEVEL_TYPES.CLEAR_ALL,
  totalBlocks: 10,
  colors: { red: 1 },
  timeLimit: null,

  lanes: {
    count: 2
  },

  modifiers: {
    fallSpeed: { type: "static", value: 0.4 },
    spawnRate: { type: "static", interval: 1400 }
  }
}
];

// ===============================
// DOM REFERENCES
// ===============================
const game = document.getElementById("game");
const controls = document.getElementById("controls");

// ===============================
// CONSTANTS
// ===============================
const SIZE = 28;
const projectileSpeed = 5;

// ===============================
// GAME STATE
// ===============================
let lanes = [];
let activeLaneIndex = 0;

let projectiles = [];
let gameOver = false;

let currentLevelIndex = 0;
let currentLevel = null;

let blocksToClear = 0;
let timeLeft = 0;

let levelTimer = null;
let spawnTimer = null;

// ===============================
// HUD
// ===============================
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateHUD() {
  document.getElementById("hud-level").innerText =
    `Nível ${currentLevel.id}`;

  document.getElementById("hud-blocks").innerText =
    `Blocos: ${blocksToClear}`;

  const timeDiv = document.getElementById("hud-time");

  if (currentLevel.type === LEVEL_TYPES.TIME_ATTACK) {
    timeDiv.innerText = `Tempo: ${formatTime(timeLeft)}`;
    timeDiv.style.display = "block";
  } else {
    timeDiv.style.display = "none";
  }
}

// ===============================
// UTILITIES
// ===============================
function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function getProgressRatio() {
  return 1 - (blocksToClear / currentLevel.totalBlocks);
}

function getTimeRatio() {
  if (!currentLevel.timeLimit) return 0;
  return 1 - (timeLeft / currentLevel.timeLimit);
}

function getTotalFallingBlocks() {
  return lanes.reduce((sum, lane) => sum + lane.stack.length, 0);
}

// ===============================
// MODIFIER SYSTEM
// ===============================
function resolveModifier(mod) {
  if (!mod) return null;

  if (mod.type === "static") {
    return mod.value ?? mod.interval;
  }

  let t = 0;

  if (mod.type === "byProgress") {
    t = getProgressRatio();
  }

  if (mod.type === "byTime") {
    t = getTimeRatio();
  }

  return lerp(mod.from, mod.to, t);
}

function getFallSpeed() {
  const mod = currentLevel.modifiers?.fallSpeed;
  return resolveModifier(mod) ?? 0.5;
}

function getSpawnInterval() {
  const mod = currentLevel.modifiers?.spawnRate;
  return resolveModifier(mod) ?? 1400;
}

// ===============================
// GAME FLOW
// ===============================
function renderWires() {
  const container = document.getElementById("wires");
  container.innerHTML = "";

  lanes.forEach((lane, index) => {
    const el = document.createElement("div");
    el.className = "wire" + (index === activeLaneIndex ? " active" : "");
    el.style.left = lane.x + "px";

    // 👇 ESSENCIAL: tocar muda a lane ativa
    el.addEventListener("pointerdown", () => {
      activeLaneIndex = index;
      renderWires();
    });

    container.appendChild(el);
  });
}

function createLanes() {
  const count = currentLevel.lanes?.count ?? 1;

  lanes = [];
  activeLaneIndex = 0;

  const gameWidth = game.clientWidth;
  const spacing = gameWidth / (count + 1);

  for (let i = 0; i < count; i++) {
    lanes.push({
      id: i,
      x: spacing * (i + 1),
      stack: []
    });
  }

  renderWires();
}

function loadLevel(index) {
  lanes.forEach(l => l.stack.forEach(s => s.el.remove()));
  projectiles.forEach(p => p.el.remove());

  lanes = [];
  projectiles = [];

  clearInterval(levelTimer);
  clearTimeout(spawnTimer);

  gameOver = false;

  currentLevel = levels[index];
  blocksToClear = currentLevel.totalBlocks;
  timeLeft = currentLevel.timeLimit;

  generateButtons(currentLevel);
  updateHUD();

  createLanes(); // 👈 NOVO

  if (currentLevel.type === LEVEL_TYPES.TIME_ATTACK) {
    startTimer();
  }

  scheduleNextSpawn();
}

function startTimer() {
  levelTimer = setInterval(() => {
    timeLeft--;
    updateHUD();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// ===============================
// SPAWN SYSTEM (DINÂMICO)
// ===============================
function scheduleNextSpawn() {
  if (gameOver) return;

  spawnTimer = setTimeout(() => {
    spawnSquare();
    scheduleNextSpawn();
  }, getSpawnInterval());
}

function spawnSquare() {
  if (gameOver) return;

  if (getTotalFallingBlocks() >= blocksToClear) return;

  const lane = lanes[Math.floor(Math.random() * lanes.length)];

  const colorPool = [];

  Object.entries(currentLevel.colors).forEach(([color, ratio]) => {
    const amount = Math.round(ratio * 100);
    for (let i = 0; i < amount; i++) {
      colorPool.push(color);
    }
  });

  const color = colorPool[Math.floor(Math.random() * colorPool.length)];

  const el = document.createElement("div");
  el.className = `square ${color}`;
  el.style.left = lane.x + "px";
  el.style.top = "-30px";
  game.appendChild(el);

  lane.stack.push({ el, color, y: -30 });
}

// ===============================
// CONTROLS
// ===============================
function generateButtons(level) {
  controls.innerHTML = "";

  Object.keys(level.colors).forEach(color => {
    const btn = document.createElement("button");
    btn.className = `color-btn ${color}`;
    btn.addEventListener("click", () => shoot(color));
    controls.appendChild(btn);
  });
}

function shoot(color) {
  if (gameOver) return;

  const lane = lanes[activeLaneIndex];
  const controlZoneTop = controls.offsetTop;

  const el = document.createElement("div");
  el.className = `square ${color}`;
  el.style.left = lane.x + "px";
  el.style.top = (controlZoneTop - SIZE) + "px";
  game.appendChild(el);

  projectiles.push({
    el,
    color,
    y: controlZoneTop - SIZE,
    laneId: lane.id
  });
}

// ===============================
// COLLISION & UPDATE
// ===============================
function rectsOverlap(a, b) {
  return a.y + SIZE >= b.y && a.y <= b.y + SIZE;
}

function touchesDangerLine(squareEl) {
  const squareRect = squareEl.getBoundingClientRect();
  const dangerRect = document
    .getElementById("danger-line")
    .getBoundingClientRect();

  return squareRect.bottom >= dangerRect.top;
}

function update() {
  if (gameOver) return;

  const fallSpeed = getFallSpeed();

for (const lane of lanes) {
  for (const s of lane.stack) {
    s.y += fallSpeed;
    s.el.style.top = s.y + "px";

    if (touchesDangerLine(s.el)) {
      endGame();
      return;
    }
  }
}

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.y -= projectileSpeed;
    p.el.style.top = p.y + "px";

const lane = lanes[p.laneId];
if (!lane || lane.stack.length === 0) continue;

const head = lane.stack[0];

if (rectsOverlap(p, head)) {
  if (p.color === head.color) {
    explode(p.el);
    explode(head.el);
    lane.stack.shift();

    blocksToClear--;
    updateHUD();

    if (blocksToClear <= 0) {
      nextLevel();
    }
  } else {
    lane.stack.unshift({
      el: p.el,
      color: p.color,
      y: p.y
    });

    blocksToClear++;
    updateHUD();
  }

  projectiles.splice(i, 1);
  continue;
}

    if (p.y < -SIZE) {
      p.el.remove();
      projectiles.splice(i, 1);
    }
  }

  requestAnimationFrame(update);
}

// ===============================
// EFFECTS & FLOW
// ===============================
function explode(el) {
  el.style.transition = "transform 0.2s, opacity 0.2s";
  el.style.transform = "scale(1.5)";
  el.style.opacity = "0";
  setTimeout(() => el.remove(), 200);
}

function endGame() {
  gameOver = true;
  clearInterval(levelTimer);
  clearTimeout(spawnTimer);
  alert("Game Over!");
}

function nextLevel() {
  clearInterval(levelTimer);
  clearTimeout(spawnTimer);

  currentLevelIndex++;

  if (currentLevelIndex >= levels.length) {
    alert("Você restaurou todas as cores 🌈");
    return;
  }

  loadLevel(currentLevelIndex);
}

// ===============================
// START
// ===============================
loadLevel(0);
update();