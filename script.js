// ===============================
// CONFIGURAÇÃO DE NÍVEIS
// ===============================
const LEVEL_TYPES = {
  CLEAR_ALL: "clear_all",
  TIME_ATTACK: "time_attack"
};

const levels = [
  {
    id: 1,
    type: LEVEL_TYPES.CLEAR_ALL,
    totalBlocks: 10, // 👈 objetivo do nível
    colors: { red: 1 },
    timeLimit: null
  },
  {
    id: 2,
    type: LEVEL_TYPES.CLEAR_ALL,
    totalBlocks: 15,
    colors: { red: 0.5, blue: 0.5 },
    timeLimit: null
  },
  {
    id: 3,
    type: LEVEL_TYPES.TIME_ATTACK,
    totalBlocks: 20,
    colors: { red: 0.4, green: 0.3, blue: 0.3 },
    timeLimit: 45
  }
];

// ===============================
// ELEMENTOS DOM
// ===============================
const game = document.getElementById("game");
const controls = document.getElementById("controls");

// ===============================
// CONSTANTES
// ===============================
const SIZE = 28;
const speed = 0.5;
const projectileSpeed = 5;

// ===============================
// ESTADO DO JOGO
// ===============================
let stack = [];
let projectiles = [];
let gameOver = false;

let currentLevelIndex = 0;
let currentLevel = null;

let blocksToClear = 0;   // 🎯 O QUE O HUD MOSTRA
let timeLeft = 0;
let levelTimer = null;

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
// COLISÃO COM DANGER LINE
// ===============================
function touchesDangerLine(squareEl) {
  const squareRect = squareEl.getBoundingClientRect();
  const dangerRect = document
    .getElementById("danger-line")
    .getBoundingClientRect();

  return squareRect.bottom >= dangerRect.top;
}

// ===============================
// BOTÕES DINÂMICOS
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

// ===============================
// CARREGAR NÍVEL
// ===============================
function loadLevel(index) {
  stack.forEach(s => s.el.remove());
  projectiles.forEach(p => p.el.remove());
  stack = [];
  projectiles = [];

  clearInterval(levelTimer);
  gameOver = false;

  currentLevel = levels[index];

  // 🎯 começa com o objetivo cheio
  blocksToClear = currentLevel.totalBlocks;

  timeLeft = currentLevel.timeLimit;

  generateButtons(currentLevel);
  updateHUD();

  if (currentLevel.type === LEVEL_TYPES.TIME_ATTACK) {
    startTimer();
  }
}

// ===============================
// TIMER
// ===============================
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
// SPAWN DE BLOCOS
// ===============================
function spawnSquare() {
  if (gameOver) return;
  
  if (stack.length >= blocksToClear) return;
  
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
  el.style.top = "-30px";
  game.appendChild(el);

  stack.push({ el, color, y: -30 });

  // ❗ spawn NÃO mexe no contador
}

// ===============================
// DISPARO
// ===============================
function shoot(color) {
  if (gameOver) return;

  const controlZoneTop = controls.offsetTop;

  const el = document.createElement("div");
  el.className = `square ${color}`;
  el.style.top = (controlZoneTop - SIZE) + "px";
  game.appendChild(el);

  projectiles.push({
    el,
    color,
    y: controlZoneTop - SIZE
  });
}

// ===============================
// COLISÃO ENTRE BLOCOS
// ===============================
function rectsOverlap(a, b) {
  return a.y + SIZE >= b.y && a.y <= b.y + SIZE;
}

// ===============================
// LOOP PRINCIPAL
// ===============================
function update() {
  if (gameOver) return;

  // blocos descendo
  for (const s of stack) {
    s.y += speed;
    s.el.style.top = s.y + "px";

    if (touchesDangerLine(s.el)) {
      endGame();
      return;
    }
  }

  // projéteis
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.y -= projectileSpeed;
    p.el.style.top = p.y + "px";

    if (stack.length > 0) {
      const head = stack[0];

      if (rectsOverlap(p, head)) {

        if (p.color === head.color) {
          // ✅ ACERTO
          explode(p.el);
          explode(head.el);
          stack.shift();

          blocksToClear--;      // 🎯 progresso real
          updateHUD();

          if (blocksToClear <= 0) {
            nextLevel();
          }

        } else {
          // ❌ ERRO
          stack.unshift({
            el: p.el,
            color: p.color,
            y: p.y
          });

          blocksToClear++;      // 🎯 punição real
          updateHUD();
        }

        projectiles.splice(i, 1);
        continue;
      }
    }

    if (p.y < -SIZE) {
      p.el.remove();
      projectiles.splice(i, 1);
    }
  }

  requestAnimationFrame(update);
}

// ===============================
// EFEITOS
// ===============================
function explode(el) {
  el.style.transition = "transform 0.2s, opacity 0.2s";
  el.style.transform = "scale(1.5)";
  el.style.opacity = "0";
  setTimeout(() => el.remove(), 200);
}

// ===============================
// FIM / PRÓXIMO NÍVEL
// ===============================
function endGame() {
  gameOver = true;
  clearInterval(levelTimer);
  alert("Game Over!");
}

function nextLevel() {
  clearInterval(levelTimer);
  currentLevelIndex++;

  if (currentLevelIndex >= levels.length) {
    alert("Você restaurou todas as cores 🌈");
    return;
  }

  loadLevel(currentLevelIndex);
}

// ===============================
// INICIALIZAÇÃO
// ===============================
loadLevel(0);
setInterval(spawnSquare, 1400);
update();