// ===============================
// LEVEL TYPES
// ===============================
const LEVEL_TYPES = {
  CLEAR_ALL: "clear_all",
  TIME_ATTACK: "time_attack"
};

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

let currentLevelNumber = 1;
let currentLevel = null;

let blocksToClear = 0;
let timeLeft = 0;

let levelTimer = null;
let spawnTimer = null;

// ===============================
// LEVEL LOADER
// ===============================
async function loadLevelFile(levelNumber) {
  const fileName = String(levelNumber).padStart(4, "0");
  const path = 'https://desenvolvedorwebv.github.io/GuardiaoDasCores/levels/0001.gcnvl';

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error("Level não encontrado");
    return await response.json();
  } catch (err) {
    alert("Você restaurou todas as cores 🌈");
    throw err;
  }
}

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
// MODIFIERS
// ===============================
function resolveModifier(mod) {
  if (!mod) return null;

  if (mod.type === "static") {
    return mod.value ?? mod.interval;
  }

  let t = 0;

  if (mod.type === "byProgress") t = getProgressRatio();
  if (mod.type === "byTime") t = getTimeRatio();

  return lerp(mod.from, mod.to, t);
}

function getFallSpeed() {
  return resolveModifier(currentLevel.modifiers?.fallSpeed) ?? 0.5;
}

function getSpawnInterval() {
  return resolveModifier(currentLevel.modifiers?.spawnRate) ?? 1400;
}

// ===============================
// LANES
// ===============================
function renderWires() {
  const container = document.getElementById("wires");
  container.innerHTML = "";

  lanes.forEach((lane, index) => {
    const el = document.createElement("div");
    el.className = "wire" + (index === activeLaneIndex ? " active" : "");
    el.style.left = lane.x + "px";

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

  const spacing = game.clientWidth / (count + 1);

  for (let i = 0; i < count; i++) {
    lanes.push({
      id: i,
      x: spacing * (i + 1),
      stack: []
    });
  }

  renderWires();
}

// ===============================
// LEVEL FLOW
// ===============================
async function loadLevel(levelNumber) {
  clearInterval(levelTimer);
  clearTimeout(spawnTimer);

  lanes.forEach(l => l.stack.forEach(s => s.el.remove()));
  projectiles.forEach(p => p.el.remove());

  lanes = [];
  projectiles = [];
  gameOver = false;

  currentLevel = await loadLevelFile(levelNumber);
  blocksToClear = currentLevel.totalBlocks;
  timeLeft = currentLevel.timeLimit;

  generateButtons(currentLevel);
  createLanes();
  updateHUD();

  if (currentLevel.type === LEVEL_TYPES.TIME_ATTACK) {
    startTimer();
  }

  scheduleNextSpawn();
}

// ===============================
// TIMER & SPAWN
// ===============================
function startTimer() {
  levelTimer = setInterval(() => {
    timeLeft--;
    updateHUD();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

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
  const pool = [];

  Object.entries(currentLevel.colors).forEach(([c, r]) => {
    for (let i = 0; i < Math.round(r * 100); i++) pool.push(c);
  });

  const color = pool[Math.floor(Math.random() * pool.length)];
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
    btn.onclick = () => shoot(color);
    controls.appendChild(btn);
  });
}

function shoot(color) {
  if (gameOver) return;

  const lane = lanes[activeLaneIndex];
  const y = controls.offsetTop - SIZE;

  const el = document.createElement("div");
  el.className = `square ${color}`;
  el.style.left = lane.x + "px";
  el.style.top = y + "px";

  game.appendChild(el);

  projectiles.push({ el, color, y, laneId: lane.id });
}

// ===============================
// COLLISION & LOOP
// ===============================
function rectsOverlap(a, b) {
  return a.y + SIZE >= b.y && a.y <= b.y + SIZE;
}

function touchesDangerLine(el) {
  const r = el.getBoundingClientRect();
  const d = document.getElementById("danger-line").getBoundingClientRect();
  return r.bottom >= d.top;
}

function update() {
  if (gameOver) return;

  const fallSpeed = getFallSpeed();

  for (const lane of lanes) {
    for (const s of lane.stack) {
      s.y += fallSpeed;
      s.el.style.top = s.y + "px";
      if (touchesDangerLine(s.el)) return endGame();
    }
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.y -= projectileSpeed;
    p.el.style.top = p.y + "px";

    const lane = lanes[p.laneId];
    const head = lane?.stack[0];
    if (!head) continue;

    if (rectsOverlap(p, head)) {
      if (p.color === head.color) {
        explode(p.el);
        explode(head.el);
        lane.stack.shift();
        blocksToClear--;
      } else {
        lane.stack.unshift({ el: p.el, color: p.color, y: p.y });
        blocksToClear++;
      }
      updateHUD();
      projectiles.splice(i, 1);
      if (blocksToClear <= 0) nextLevel();
    }

    if (p.y < -SIZE) {
      p.el.remove();
      projectiles.splice(i, 1);
    }
  }

  requestAnimationFrame(update);
}

// ===============================
// FLOW
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
  currentLevelNumber++;
  loadLevel(currentLevelNumber);
}

// ===============================
// START
// ===============================
async function startGame() {
  await loadLevel(currentLevelNumber);
  update();
}

startGame();
