// ===== っちゃムズデモ用Canvas ===== (externalized)
(function() {
  const demoCanvas = document.getElementById('extreme-demo-canvas');
  if (!demoCanvas) return;

  const CELL = 40;
  const COLS = 4;
  const ROWS = 5;
  const CANDY_COLOR = '#ff3377';
  const CANDY_COLOR2 = '#ffee00';
  const GREEN_COLOR = '#00cc44';
  demoCanvas.width = COLS * CELL;
  demoCanvas.height = ROWS * CELL;
  const ctx = demoCanvas.getContext('2d');

  function lightenColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
  }
  function shadeColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) - percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) - percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) - percent));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
  }
  function hexToRgba(hex, alpha) {
    const num = parseInt(hex.slice(1), 16);
    return `rgba(${(num >> 16) & 255},${(num >> 8) & 255},${num & 255},${alpha})`;
  }
  function hexToRgb(hex) {
    const num = parseInt(hex.slice(1), 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function drawWrappedCandy(ctx, x, y, color, size, alpha, rotation, isObstacle) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const padding = 3;
    const candyWidth = size - padding * 2;
    const candyHeight = size - padding * 2;
    const cx = x + size / 2;
    const cy = y + size / 2;
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.translate(-cx, -cy);
    ctx.shadowColor = isObstacle ? 'rgba(200,200,200,0.3)' : 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = isObstacle ? 8 : 5;
    ctx.shadowOffsetY = isObstacle ? 3 : 2;
    const bodyWidth = candyWidth * 0.55;
    const bodyHeight = candyHeight * 0.7;
    const bodyX = cx - bodyWidth / 2;
    const bodyY = cy - bodyHeight / 2;
    const bodyGrad = ctx.createRadialGradient(cx - bodyWidth * 0.2, cy - bodyHeight * 0.2, 0, cx, cy, bodyWidth * 0.8);
    if (isObstacle) {
      bodyGrad.addColorStop(0, '#ffffff'); bodyGrad.addColorStop(0.4, '#dddddd'); bodyGrad.addColorStop(0.7, '#bbbbbb'); bodyGrad.addColorStop(1, '#999999');
    } else {
      bodyGrad.addColorStop(0, lightenColor(color, 60)); bodyGrad.addColorStop(0.4, color); bodyGrad.addColorStop(0.7, shadeColor(color, 15)); bodyGrad.addColorStop(1, shadeColor(color, 35));
    }
    ctx.fillStyle = bodyGrad;
    const radius = bodyHeight * 0.35;
    ctx.beginPath();
    ctx.moveTo(bodyX + radius, bodyY);
    ctx.lineTo(bodyX + bodyWidth - radius, bodyY);
    ctx.quadraticCurveTo(bodyX + bodyWidth, bodyY, bodyX + bodyWidth, bodyY + radius);
    ctx.lineTo(bodyX + bodyWidth, bodyY + bodyHeight - radius);
    ctx.quadraticCurveTo(bodyX + bodyWidth, bodyY + bodyHeight, bodyX + bodyWidth - radius, bodyY + bodyHeight);
    ctx.lineTo(bodyX + radius, bodyY + bodyHeight);
    ctx.quadraticCurveTo(bodyX, bodyY + bodyHeight, bodyX, bodyY + bodyHeight - radius);
    ctx.lineTo(bodyX, bodyY + radius);
    ctx.quadraticCurveTo(bodyX, bodyY, bodyX + radius, bodyY);
    ctx.closePath();
    ctx.fill();
    if (isObstacle) { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.stroke(); }
    ctx.shadowBlur = 0;
    const twistLength = candyWidth * 0.3;
    const twistWidth = candyHeight * 0.28;
    const leftTwistX = bodyX - twistLength;
    const leftGrad = ctx.createLinearGradient(leftTwistX, cy - twistWidth, leftTwistX + twistLength, cy);
    if (isObstacle) { leftGrad.addColorStop(0, '#cccccc'); leftGrad.addColorStop(1, '#aaaaaa'); }
    else { leftGrad.addColorStop(0, shadeColor(color, 45)); leftGrad.addColorStop(0.3, shadeColor(color, 20)); leftGrad.addColorStop(0.6, lightenColor(color, 25)); leftGrad.addColorStop(1, color); }
    ctx.fillStyle = leftGrad;
    ctx.beginPath();
    ctx.moveTo(bodyX, cy - bodyHeight * 0.28);
    ctx.lineTo(leftTwistX + twistLength * 0.15, cy - twistWidth * 0.9);
    ctx.lineTo(leftTwistX, cy - twistWidth * 0.5);
    ctx.lineTo(leftTwistX, cy + twistWidth * 0.5);
    ctx.lineTo(leftTwistX + twistLength * 0.15, cy + twistWidth * 0.9);
    ctx.lineTo(bodyX, cy + bodyHeight * 0.28);
    ctx.closePath();
    ctx.fill();
    const rightTwistX = bodyX + bodyWidth;
    const rightGrad = ctx.createLinearGradient(rightTwistX, cy, rightTwistX + twistLength, cy);
    if (isObstacle) { rightGrad.addColorStop(0, '#aaaaaa'); rightGrad.addColorStop(1, '#cccccc'); }
    else { rightGrad.addColorStop(0, color); rightGrad.addColorStop(0.4, lightenColor(color, 25)); rightGrad.addColorStop(0.7, shadeColor(color, 20)); rightGrad.addColorStop(1, shadeColor(color, 45)); }
    ctx.fillStyle = rightGrad;
    ctx.beginPath();
    ctx.moveTo(bodyX + bodyWidth, cy - bodyHeight * 0.28);
    ctx.lineTo(rightTwistX + twistLength * 0.85, cy - twistWidth * 0.9);
    ctx.lineTo(rightTwistX + twistLength, cy - twistWidth * 0.5);
    ctx.lineTo(rightTwistX + twistLength, cy + twistWidth * 0.5);
    ctx.lineTo(rightTwistX + twistLength * 0.85, cy + twistWidth * 0.9);
    ctx.lineTo(bodyX + bodyWidth, cy + bodyHeight * 0.28);
    ctx.closePath();
    ctx.fill();
    const hlGrad = ctx.createRadialGradient(cx - bodyWidth * 0.15, cy - bodyHeight * 0.2, 0, cx, cy, bodyWidth * 0.5);
    if (isObstacle) { hlGrad.addColorStop(0, 'rgba(255,255,255,0.15)'); hlGrad.addColorStop(1, 'rgba(255,255,255,0)'); }
    else { hlGrad.addColorStop(0, 'rgba(255,255,255,0.55)'); hlGrad.addColorStop(1, 'rgba(255,255,255,0)'); }
    ctx.fillStyle = hlGrad;
    ctx.beginPath();
    ctx.ellipse(cx - bodyWidth * 0.08, cy - bodyHeight * 0.15, bodyWidth * 0.28, bodyHeight * 0.2, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isObstacle ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(cx + bodyWidth * 0.18, cy - bodyHeight * 0.18, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBurstParticle(ctx, x, y, color, progress) {
    const cx = x + CELL / 2, cy = y + CELL / 2, alpha = 1 - progress, radius = CELL * (0.5 + progress * 2);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.8})`);
    grad.addColorStop(0.3, hexToRgba(color, alpha * 0.5));
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  let board = [];
  let fallingCombo = null;
  let fallingYellow = null;
  let burstingCells = [];
  let burstTimer = 0;
  const BURST_DURATION = 300;
  let demoPlaying = false;
  let demoLastTime = 0;
  let demoPhase = 'idle';
  let demoPhaseTimer = 0;
  let instantFlash = 0, instantFlashColor = '#ff3377';
  let flashIntensity = 0;
  let shockwaves = [], centerGlow = 0;
  const rainbowColors = ['#ff0088', '#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff'];
  let chainLevel = 1;

  const DUR = { idle: 2000, falling: 2667, burst: 533, settling: 800, yellowFall: 2000, final: 2000 };

  function floodFill(x, y, color, visited) {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return [];
    const key = `${x},${y}`;
    if (visited.has(key)) return [];
    if (board[y][x] !== color) return [];
    visited.add(key);
    let cells = [[x, y]];
    cells = cells.concat(floodFill(x + 1, y, color, visited));
    cells = cells.concat(floodFill(x - 1, y, color, visited));
    cells = cells.concat(floodFill(x, y + 1, color, visited));
    cells = cells.concat(floodFill(x, y - 1, color, visited));
    return cells;
  }

  function checkMatches() {
    const visited = new Set();
    let totalCleared = 0;
    let clearedCells = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x] !== null && !visited.has(`${x},${y}`)) {
          const cells = floodFill(x, y, board[y][x], visited);
          if (cells.length >= 4) {
            const color = board[y][x];
            cells.forEach(([cx, cy]) => { clearedCells.push([cx, cy, color]); board[cy][cx] = null; });
            totalCleared += cells.length;
          }
        }
      }
    }
    if (totalCleared > 0) {
      const toRemove = new Set();
      clearedCells.forEach(([cx, cy]) => {
        [[cx-1, cy], [cx+1, cy], [cx, cy-1], [cx, cy+1]].forEach(([ax, ay]) => {
          if (ax >= 0 && ax < COLS && ay >= 0 && ay < ROWS && board[ay][ax] === 'obstacle') { toRemove.add(`${ax},${ay}`); }
        });
      });
      toRemove.forEach(key => { const [ox, oy] = key.split(',').map(Number); clearedCells.push([ox, oy, '#aaaaaa']); board[oy][ox] = null; });
    }
    return totalCleared > 0 ? clearedCells : null;
  }

  function applyGravity() {
    for (let x = 0; x < COLS; x++) {
      for (let y = ROWS - 2; y >= 0; y--) {
        if (board[y][x] !== null && board[y + 1][x] === null) { board[y + 1][x] = board[y][x]; board[y][x] = null; }
      }
    }
  }

  function triggerEffects(cleared) {
    instantFlash = 0.3; instantFlashColor = rainbowColors[0];
    flashIntensity = 0.4 + chainLevel * 0.15;
    centerGlow = 0.2 + chainLevel * 0.2;
    cleared.forEach(([cx, cy]) => { shockwaves.push({ x: cx * CELL + CELL / 2, y: cy * CELL + CELL / 2, radius: 0, maxRadius: CELL * (2 + chainLevel * 1.0), alpha: 0.7 + chainLevel * 0.06 }); });
  }

  function initDemoBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    board[4][1] = CANDY_COLOR; board[3][1] = CANDY_COLOR; board[2][1] = CANDY_COLOR;
    board[3][2] = 'obstacle'; board[4][2] = GREEN_COLOR;
    fallingCombo = { x: 1, y: 0, colors: [CANDY_COLOR, CANDY_COLOR2] };
    fallingYellow = null;
    burstingCells = []; burstTimer = 0;
    instantFlash = 0; flashIntensity = 0; shockwaves = []; centerGlow = 0;
    chainLevel = 1;
    demoPhase = 'idle'; demoPhaseTimer = 0;
  }

  function updateDemo(delta) {
    if (!demoPlaying) return;
    demoPhaseTimer += delta;
    switch (demoPhase) {
      case 'idle':
        if (demoPhaseTimer >= DUR.idle) { demoPhase = 'falling'; demoPhaseTimer = 0; }
        break;
      case 'falling':
        fallingCombo.y += delta * 0.0015;
        if (fallingCombo.y >= 1) { board[1][1] = fallingCombo.colors[0]; fallingYellow = { x: 2, y: 1 }; fallingCombo = null; demoPhase = 'burst'; demoPhaseTimer = 0; }
        break;
      case 'burst':
        if (demoPhaseTimer >= DUR.burst) {
          const cleared = checkMatches();
          if (cleared) { burstingCells = cleared; burstTimer = 0; triggerEffects(cleared); }
          demoPhase = 'settling'; demoPhaseTimer = 0;
        }
        break;
      case 'settling':
        if (demoPhaseTimer >= DUR.settling) { applyGravity(); demoPhase = 'yellowFall'; demoPhaseTimer = 0; }
        break;
      case 'yellowFall':
        if (fallingYellow) {
          fallingYellow.y += delta * 0.002;
          if (fallingYellow.y >= 3) { board[3][2] = CANDY_COLOR2; fallingYellow = null; demoPhase = 'final'; demoPhaseTimer = 0; }
        }
        if (demoPhaseTimer >= DUR.yellowFall && fallingYellow) { board[3][2] = CANDY_COLOR2; fallingYellow = null; demoPhase = 'final'; demoPhaseTimer = 0; }
        break;
      case 'final':
        burstingCells = [];
        if (demoPhaseTimer >= DUR.final) { initDemoBoard(); }
        break;
    }
    if (burstingCells.length > 0) burstTimer += delta;
    if (instantFlash > 0) { instantFlash *= 0.75; if (instantFlash < 0.03) instantFlash = 0; }
    if (flashIntensity > 0) { flashIntensity *= 0.82; if (flashIntensity < 0.02) flashIntensity = 0; }
    if (centerGlow > 0) { centerGlow *= 0.94; if (centerGlow < 0.02) centerGlow = 0; }
    shockwaves.forEach(sw => { sw.radius += 8 + sw.maxRadius * 0.05; sw.alpha *= 0.92; });
    shockwaves = shockwaves.filter(sw => sw.alpha > 0.02 && sw.radius < sw.maxRadius);
  }

  function drawDemo() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, demoCanvas.width, demoCanvas.height);
    if (instantFlash > 0 && burstingCells.length > 0) {
      const ifc = hexToRgb(instantFlashColor);
      burstingCells.forEach(([x, y]) => {
        const cx = x * CELL + CELL / 2, cy = y * CELL + CELL / 2;
        const maxRadius = Math.max(demoCanvas.width, demoCanvas.height) * 2;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * instantFlash);
        grad.addColorStop(0, `rgba(${ifc.r},${ifc.g},${ifc.b},${instantFlash * 0.3})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, demoCanvas.width, demoCanvas.height);
      });
    }
    if (centerGlow > 0) {
      const cx = (COLS * CELL) / 2, cy = (ROWS * CELL) / 2;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, CELL * 6);
      grad.addColorStop(0, rainbowColors[chainLevel - 1] || '#ffffff');
      grad.addColorStop(1, 'transparent');
      ctx.save(); ctx.globalAlpha = centerGlow; ctx.fillStyle = grad; ctx.fillRect(0, 0, demoCanvas.width, demoCanvas.height); ctx.restore();
    }
    shockwaves.forEach(sw => {
      ctx.save(); ctx.globalAlpha = sw.alpha; ctx.strokeStyle = rainbowColors[chainLevel - 1] || '#ffffff'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    });
    ctx.strokeStyle = 'rgba(255, 182, 193, 0.4)'; ctx.lineWidth = 1;
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke(); }
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255, 105, 180, 0.8)'; ctx.lineWidth = 2; ctx.strokeRect(0, 0, COLS * CELL, ROWS * CELL);
    if (burstingCells.length > 0) {
      const progress = Math.min(burstTimer / BURST_DURATION, 1);
      burstingCells.forEach(([x, y, color]) => { drawBurstParticle(ctx, x * CELL, y * CELL, color, progress); });
    }
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x]) {
          if (board[y][x] === 'obstacle') drawWrappedCandy(ctx, x * CELL, y * CELL, '#888888', CELL, 0.7, 0, true);
          else if (board[y][x] === GREEN_COLOR) drawWrappedCandy(ctx, x * CELL, y * CELL, GREEN_COLOR, CELL, 1, 0, false);
          else drawWrappedCandy(ctx, x * CELL, y * CELL, board[y][x], CELL, 1, 0, false);
        }
      }
    }
    if (fallingCombo) {
      const displayY = Math.floor(fallingCombo.y);
      if (displayY >= 0 && displayY < ROWS) {
        drawWrappedCandy(ctx, fallingCombo.x * CELL, displayY * CELL, fallingCombo.colors[0], CELL, 0.8, 0, false);
        drawWrappedCandy(ctx, (fallingCombo.x + 1) * CELL, displayY * CELL, fallingCombo.colors[1], CELL, 0.8, 0, false);
      }
    }
    if (fallingYellow) {
      const displayY = Math.floor(fallingYellow.y);
      if (displayY >= 0 && displayY < ROWS) {
        drawWrappedCandy(ctx, fallingYellow.x * CELL, displayY * CELL, CANDY_COLOR2, CELL, 0.8, 0, false);
      }
    }
  }

  function demoGameLoop(time) {
    const delta = demoLastTime ? time - demoLastTime : 16;
    demoLastTime = time;
    updateDemo(delta);
    drawDemo();
    if (demoPlaying) requestAnimationFrame(demoGameLoop);
  }

  initDemoBoard();
  demoPlaying = true;
  requestAnimationFrame(demoGameLoop);
})();
