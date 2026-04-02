// ===== むずかしいモード デモ用 ===== (magic power filling tutorial)
// 左半分: ゲームフィールド / 右半分: マジックボタン（index.htmlのまま）
(function() {
  const demoCanvas = document.getElementById('hard-demo-canvas');
  if (!demoCanvas) return;

  // レイアウト: 左にゲームフィールド、右にマジックボタン
  const FIELD_COLS = 4;
  const FIELD_ROWS = 5;
  const CELL = 40 * 1.4;
  const FIELD_W = FIELD_COLS * CELL;  // 224
  const FIELD_H = FIELD_ROWS * CELL;  // 280
  const MAGIC_BTN_SIZE = 80 * 1.4;
  const PADDING = 10;

  const TOTAL_W = FIELD_W + PADDING + MAGIC_BTN_SIZE;  // 346
  const TOTAL_H = Math.max(FIELD_H, MAGIC_BTN_SIZE);   // 280
  demoCanvas.width = TOTAL_W;
  demoCanvas.height = TOTAL_H;

  const ctx = demoCanvas.getContext('2d');

  // マジックボタン描画用座標
  const MAGIC_X = FIELD_W + PADDING;
  const MAGIC_CX = MAGIC_X + MAGIC_BTN_SIZE / 2;  // ボタン中心
  const MAGIC_CY = 40;

  const CANDY_RED = '#ff3377';
  const CANDY_YELLOW = '#ffee00';
  const CANDY_GREEN = '#00cc44';
  const CANDY_PINK = '#ff1493';

  const MAGIC_THRESHOLD = 30;
  let magicCharge = 0;
  let magicBlinkPhase = 0;

  // ===== index.htmlからそのままコピー =====

  // Draw star (index.html drawStar関数そのまま)
  function drawStar(ctx, cx, cy, size) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + Math.cos(angle) * size;
      const y = cy + Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Draw witch hat (index.html drawWitchHat関数そのまま)
  function drawWitchHat(ctx, cx, cy, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const hatColor = color || '#222222';
    const bandColor = '#ff69b4';
    const buckleColor = '#ffd700';

    // Hat body (cone shape) - slightly bent
    ctx.fillStyle = hatColor;
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.5, cy + size * 0.3);
    ctx.quadraticCurveTo(cx - size * 0.2, cy - size * 0.3, cx + size * 0.3, cy - size * 0.8);
    ctx.quadraticCurveTo(cx + size * 0.1, cy - size * 0.2, cx + size * 0.5, cy + size * 0.3);
    ctx.closePath();
    ctx.fill();

    // Hat brim (ellipse at bottom)
    ctx.fillStyle = hatColor;
    ctx.beginPath();
    ctx.ellipse(cx, cy + size * 0.35, size * 0.7, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hat band (pink stripe)
    ctx.fillStyle = bandColor;
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.45, cy + size * 0.1);
    ctx.quadraticCurveTo(cx - size * 0.15, cy + size * 0.05, cx + size * 0.35, cy - size * 0.15);
    ctx.lineTo(cx + size * 0.38, cy - size * 0.05);
    ctx.quadraticCurveTo(cx - size * 0.1, cy + size * 0.15, cx - size * 0.48, cy + size * 0.18);
    ctx.closePath();
    ctx.fill();

    // Buckle (gold rectangle)
    ctx.fillStyle = buckleColor;
    ctx.fillRect(cx - size * 0.08, cy - size * 0.02, size * 0.16, size * 0.12);
    ctx.fillStyle = hatColor;
    ctx.fillRect(cx - size * 0.05, cy + size * 0.02, size * 0.1, size * 0.06);

    // Stars decoration on hat
    ctx.fillStyle = '#ffd700';
    drawStar(ctx, cx - size * 0.15, cy - size * 0.35, size * 0.08);
    ctx.fillStyle = '#ff69b4';
    drawStar(ctx, cx + size * 0.1, cy - size * 0.5, size * 0.06);

    ctx.restore();
  }

  // マジックボタン描画（index.html updateMagicButtonのinactive stateのまま）
  function drawMagicButton() {
    // Layer 1: background circle
    const grad = ctx.createRadialGradient(MAGIC_CX, MAGIC_CY, 0, MAGIC_CX, MAGIC_CY, 38);
    grad.addColorStop(0, 'rgba(180, 180, 200, 0.2)');
    grad.addColorStop(1, 'rgba(100, 100, 120, 0.12)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(MAGIC_CX, MAGIC_CY, 36, 0, Math.PI * 2);
    ctx.fill();

    // Layer 2: witch hat (transparent in inactive state)
    drawWitchHat(ctx, MAGIC_CX, MAGIC_CY, 52, '#333344', 0.5);

    // Layer 3: meter bars (solid fill, clipped to circle)
    const divisions = 30;
    const barHeight = 2.6;
    const barGap = 0;
    const divWidth = 78;
    const startX = MAGIC_X + 1;
    const startY = 2;
    const blinkIntensity = (Math.sin(magicBlinkPhase) + 1) / 2;

    // 円形にクリッピング
    ctx.save();
    ctx.beginPath();
    ctx.arc(MAGIC_CX, MAGIC_CY, 34, 0, Math.PI * 2);
    ctx.clip();

    for (let i = 0; i < divisions; i++) {
      const y = startY + (divisions - 1 - i) * (barHeight + barGap);
      const isFilled = i < magicCharge;
      if (isFilled) {
        ctx.fillStyle = `rgb(255, 85, 0)`;
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 3 + blinkIntensity * 6;
        ctx.fillRect(startX, y, divWidth, barHeight);
      } else {
        ctx.fillStyle = 'rgb(60, 60, 75)';
        ctx.shadowBlur = 0;
        ctx.fillRect(startX, y, divWidth, barHeight);
      }
    }
    ctx.shadowBlur = 0;
    ctx.restore();

    // Layer 4: circular frame (front)
    ctx.strokeStyle = 'rgba(140, 140, 160, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(MAGIC_CX, MAGIC_CY, 36, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ===== キャンディ描画（index.htmlのwrapedCandyを参考）=====
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

  function drawWrappedCandy(ctx, x, y, color, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const padding = 3;
    const candyWidth = size - padding * 2;
    const candyHeight = size - padding * 2;
    const cx = x + size / 2;
    const cy = y + size / 2;
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;
    const bodyWidth = candyWidth * 0.55;
    const bodyHeight = candyHeight * 0.7;
    const bodyX = cx - bodyWidth / 2;
    const bodyY = cy - bodyHeight / 2;
    const bodyGrad = ctx.createRadialGradient(cx - bodyWidth * 0.2, cy - bodyHeight * 0.2, 0, cx, cy, bodyWidth * 0.8);
    bodyGrad.addColorStop(0, lightenColor(color, 60));
    bodyGrad.addColorStop(0.4, color);
    bodyGrad.addColorStop(0.7, shadeColor(color, 15));
    bodyGrad.addColorStop(1, shadeColor(color, 35));
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
    ctx.shadowBlur = 0;
    const twistLength = candyWidth * 0.3;
    const twistWidth = candyHeight * 0.28;
    const leftTwistX = bodyX - twistLength;
    const leftGrad = ctx.createLinearGradient(leftTwistX, cy - twistWidth, leftTwistX + twistLength, cy);
    leftGrad.addColorStop(0, shadeColor(color, 45));
    leftGrad.addColorStop(0.3, shadeColor(color, 20));
    leftGrad.addColorStop(0.6, lightenColor(color, 25));
    leftGrad.addColorStop(1, color);
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
    rightGrad.addColorStop(0, color);
    rightGrad.addColorStop(0.4, lightenColor(color, 25));
    rightGrad.addColorStop(0.7, shadeColor(color, 20));
    rightGrad.addColorStop(1, shadeColor(color, 45));
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
    hlGrad.addColorStop(0, 'rgba(255,255,255,0.55)');
    hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hlGrad;
    ctx.beginPath();
    ctx.ellipse(cx - bodyWidth * 0.08, cy - bodyHeight * 0.15, bodyWidth * 0.28, bodyHeight * 0.2, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(cx + bodyWidth * 0.18, cy - bodyHeight * 0.18, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBurstParticle(ctx, x, y, color, progress) {
    const cx = x + CELL / 2, cy = y + CELL / 2, alpha = 1 - progress, radius = CELL * (0.5 + progress * 2);
    const num = parseInt(color.slice(1), 16);
    const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.8})`);
    grad.addColorStop(0.3, `rgba(${r},${g},${b},${alpha * 0.5})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // ===== ゲームロジック =====
  let board = [];
  let fallingPair = null;
  let burstingCells = [];
  let burstTimer = 0;
  const BURST_DURATION = 400;
  let demoPlaying = false;
  let demoLastTime = 0;
  let demoPhase = 'idle';
  let demoPhaseTimer = 0;
  let burstTextTimer = 0;
  let burstTextChain = 0;
  let instantFlash = 0;
  let flashIntensity = 0;
  let shockwaves = [];
  let chainLevel = 0;
  const rainbowColors = ['#ff0088', '#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff'];

  // デモ: 2パターン連続
  const CANDY_BLUE = '#3388ff';
  // ===== パターン1: 🔴4連結落下・消失 =====
  // Step1: 空🔴空空 / 空🔴空空 / 空空空空 / 空🔴空空 / 空🔴空空
  // Step2: 空空空空 / 空🔴空空 / 空🔴空空 / 空🔴空空 / 空🔴空空 (RED落下→4連結)
  // Step3: 全空 (+2法力)
  const DUR_P1 = { idle: 1000, drop: 2000, burst: 600, final: 4000 };
  const DUR_P2 = { idle: 1000, drop: 2000, burst: 600, settle: 800, final: 4000 };
  let currentPattern = 1;

  function initDemoBoard() {
    magicCharge = 0;
    currentPattern = 1;
    initPattern1();
  }

  function initPattern1() {
    board = Array(FIELD_ROWS).fill(null).map(() => Array(FIELD_COLS).fill(null));
    // Step1: X(行0,1)、Y(行3,4)、行2は空
    board[0][1] = CANDY_RED; // X
    board[1][1] = CANDY_RED; // X
    board[3][1] = CANDY_RED; // Y
    board[4][1] = CANDY_RED; // Y
    // Xが落下 (x=1) - 行0から
    fallingPair = { x: 1, y: 0, color: CANDY_RED };
    chainLevel = 0;
    magicCharge = 0;
    burstingCells = [];
    burstTimer = 0;
    burstTextTimer = 0;
    burstTextChain = 0;
    instantFlash = 0;
    flashIntensity = 0;
    shockwaves = [];
    demoPhase = 'idle';
    demoPhaseTimer = 0;
  }

  function updatePattern1(delta) {
    demoPhaseTimer += delta;
    switch (demoPhase) {
      case 'idle':
        if (demoPhaseTimer >= DUR_P1.idle) { demoPhase = 'drop'; demoPhaseTimer = 0; }
        break;
      case 'drop':
        fallingPair.y += delta * 0.0015;
        if (fallingPair.y >= 1) {
          fallingPair.y = 1;
          board[fallingPair.y][fallingPair.x] = fallingPair.color;
          fallingPair = null;
          applyGravityFull();
          let count = 0;
          for (let r = 0; r < FIELD_ROWS; r++) {
            if (board[r][1] === CANDY_RED) count++;
          }
          if (count >= 4) {
            demoPhase = 'burst';
          } else {
            demoPhase = 'final';
          }
          demoPhaseTimer = 0;
        }
        break;
      case 'burst':
        if (demoPhaseTimer >= DUR_P1.burst) {
          // 4連結成立: col1 の RED 4つ消去
          burstingCells = [];
          for (let r = 0; r < FIELD_ROWS; r++) {
            if (board[r][1] === CANDY_RED) {
              burstingCells.push([1, r, CANDY_RED]);
              board[r][1] = null;
            }
          }
          burstTimer = 0;
          chainLevel = 1;
          magicCharge += 2;
          triggerEffects(burstingCells, 1);
          demoPhase = 'settle';
          demoPhaseTimer = 0;
        }
        break;
      case 'settle':
        if (demoPhaseTimer >= 500) {
          applyGravityFull();
          demoPhase = 'final';
          demoPhaseTimer = 0;
        }
        break;
      case 'final':
        if (demoPhaseTimer >= DUR_P1.final) {
          currentPattern = 2;
          initPattern2();
        }
        break;
    }
  }

  function applyGravityFull() {
    for (let x = 0; x < FIELD_COLS; x++) {
      for (let y = FIELD_ROWS - 2; y >= 0; y--) {
        if (board[y][x] !== null && board[y + 1][x] === null) {
          board[y + 1][x] = board[y][x];
          board[y][x] = null;
        }
      }
    }
  }

  // ===== パターン2: 連鎖で溜まりやすい =====
  // Step1 初期:
  // 空🔵🟢空  (行0: x1=BLUE, x2=GREEN)
  // 空空空空  (行1)
  // 空🔵空空  (行2: x1=BLUE)
  // 空🔵🔵空  (行3: x1=BLUE, x2=BLUE)
  // 🟢🟢🟢空  (行4: x0,x1,x2=GREEN)
  //
  // Step2 GREEN落下後 (x=0に着地):
  // 空🔵🟢空  (行0)
  // 空🔵空空  (行1: BLUEが落下)
  // 空🔵空空  (行2: BLUEが落下)
  // 空🔵🔵空  (行3)
  // 🟢🟢🟢🟢  (行4: GREEN x0,x1,x2,x3= GREEN 4連結完成!)
  //
  // Step3 GREEN消去後 BLUE落下:
  // 空空空空  (行0)
  // 空空空空  (行1)
  // 空空空空  (行2)
  // 空🔵🔵空  (行3: BLUE残)
  // 🟢🟢🟢空  (行4: x0,x1,x2 GREEN)
  //
  // Step4 BLUE一部落下:
  // 空空空空  (行0)
  // 空空空空  (行1)
  // 空空空空  (行2)
  // 空🔵🔵空  (行3)
  // 🟢🟢🟢空  (行4: x0,x1,x2 GREEN)
  //
  // Step5 BLUE更落下:
  // 空空空空  (行0)
  // 空空空空  (行1)
  // 空空空空  (行2)
  // 空🔵🔵空  (行3)
  // 🟢🟢🟢空  (行4: GREEN) <- BLUE col1,2が落下中
  //
  // Step6 BLUE 4連結完成:
  // 空空空空  (行0)
  // 空🔵🔵空  (行1: BLUE x1,2)
  // 空🔵🔵空  (行2: BLUE x1,2)
  // 空🔵🔵空  (行3: BLUE x1,2)
  // 🟢🟢🟢🔵  (行4: GREEN x0,1,2 + BLUE x3 ではない)
  // -> BLUE col1: 行1,2,3,4 = 4連結完成!
  //
  // Step7 全消去後:
  // 空空空空 x5
  function initPattern2() {
    board = Array(FIELD_ROWS).fill(null).map(() => Array(FIELD_COLS).fill(null));
    // ユーザーが指定したStep1の配置:
    // 行0: 0[bg]0  col1=BLUE, col2=GREEN
    // 行1: 00000
    // 行2: 0b000  col1=BLUE
    // 行3: 0bb00  col1=BLUE, col2=BLUE
    // 行4: ggg00  col0=GREEN, col1=GREEN, col2=GREEN
    board[0][1] = CANDY_BLUE;
    board[0][2] = CANDY_GREEN;
    board[2][1] = CANDY_BLUE;
    board[3][1] = CANDY_BLUE;
    board[3][2] = CANDY_BLUE;
    board[4][0] = CANDY_GREEN;
    board[4][1] = CANDY_GREEN;
    board[4][2] = CANDY_GREEN;
    fallingPair = null;
    chainLevel = 0;
    burstingCells = [];
    burstTimer = 0;
    burstTextTimer = 0;
    burstTextChain = 0;
    instantFlash = 0;
    flashIntensity = 0;
    shockwaves = [];
    demoPhase = 'idle';
    demoPhaseTimer = 0;
  }

  function updatePattern2(delta) {
    demoPhaseTimer += delta;
    switch (demoPhase) {
      case 'idle':
        if (demoPhaseTimer >= DUR_P2.idle) {
          demoPhase = 'drop'; demoPhaseTimer = 0;
        }
        break;
      case 'drop':
        // Step2: B+Gが1段落下 -> ユーザーが指定したStep2の配置
        // 0000 / 0[bg]0 / 0b00 / 0bb0 / ggg0
        board[0][1] = null;
        board[0][2] = null;
        board[1][1] = CANDY_BLUE;
        board[1][2] = CANDY_GREEN;
        demoPhase = 'burst';
        demoPhaseTimer = 0;
        break;
      case 'burst':
        if (demoPhaseTimer >= DUR_P2.burst) {
          // Step3: 青4連結消失 -> ユーザーが指定したStep3の配置
          // 0000 / 00g0 / 0000 / 0000 / ggg0
          burstingCells = [
            [1, 1, CANDY_BLUE],
            [1, 2, CANDY_BLUE],
            [1, 3, CANDY_BLUE],
            [2, 3, CANDY_BLUE],
          ];
          board[1][1] = null;
          board[2][1] = null;
          board[3][1] = null;
          board[3][2] = null;
          burstTimer = 0;
          chainLevel = 1;
          magicCharge += 2;
          triggerEffects(burstingCells, 1);
          demoPhase = 'settle';
          demoPhaseTimer = 0;
        }
        break;
      case 'settle':
        if (demoPhaseTimer >= DUR_P2.settle) {
          // Step4: Gが1段落下 -> ユーザーが指定したStep4の配置
          // 0000 / 0000 / 00g0 / 0000 / ggg0
          board[1][2] = null;
          board[2][2] = CANDY_GREEN;
          demoPhase = 'settle2';
          demoPhaseTimer = 0;
        }
        break;
      case 'settle2':
        if (demoPhaseTimer >= DUR_P2.settle) {
          // Step5: Gが1段落下 -> ユーザーが指定したStep5の配置
          // 0000 / 0000 / 0000 / 00g0 / ggg0
          board[2][2] = null;
          board[3][2] = CANDY_GREEN;
          demoPhase = 'final';
          demoPhaseTimer = 0;
        }
        break;
      case 'final':
        // Step6: 緑4連結消失 -> 全消去
        burstingCells = [
          [0, 4, CANDY_GREEN],
          [1, 4, CANDY_GREEN],
          [2, 4, CANDY_GREEN],
          [3, 2, CANDY_GREEN],
        ];
        board[4][0] = null;
        board[4][1] = null;
        board[4][2] = null;
        board[3][2] = null;
        burstTimer = 0;
        chainLevel = 2;
        triggerEffects(burstingCells, 2);
        demoPhase = 'end';
        demoPhaseTimer = 0;
        break;
      case 'end':
        if (demoPhaseTimer >= DUR_P2.final) {
          burstingCells = [];
          currentPattern = 1;
          initPattern1();
          demoPhase = 'idle';
          demoPhaseTimer = 0;
        }
        break;
    }
  }

  function triggerEffects(cleared, chains) {
    instantFlash = 0.4;
    flashIntensity = 0.5 + chains * 0.1;
    cleared.forEach(([cx, cy]) => {
      shockwaves.push({ x: cx * CELL + CELL / 2, y: cy * CELL + CELL / 2, radius: 0, maxRadius: CELL * 3, alpha: 0.7 });
    });
    // チェーン数×2法力
    magicCharge += chains * 2;
    if (magicCharge > MAGIC_THRESHOLD) magicCharge = MAGIC_THRESHOLD;
    // テキスト表示用タイマー
    burstTextTimer = 1000;
    burstTextChain = chains;
  }

  function updateDemo(delta) {
    if (!demoPlaying) return;

    if (magicCharge > 0) {
      const speedMultiplier = 1 + (magicCharge / MAGIC_THRESHOLD) * 3;
      magicBlinkPhase += delta * 0.01 * speedMultiplier;
    }

    if (currentPattern === 1) {
      updatePattern1(delta);
    } else {
      updatePattern2(delta);
    }

    if (burstingCells.length > 0) burstTimer += delta;
    if (burstTextTimer > 0) burstTextTimer -= delta;
    if (instantFlash > 0) { instantFlash *= 0.75; if (instantFlash < 0.03) instantFlash = 0; }
    if (flashIntensity > 0) { flashIntensity *= 0.82; if (flashIntensity < 0.02) flashIntensity = 0; }
    shockwaves.forEach(sw => { sw.radius += 8 + sw.maxRadius * 0.05; sw.alpha *= 0.92; });
    shockwaves = shockwaves.filter(sw => sw.alpha > 0.02 && sw.radius < sw.maxRadius);
  }

  function drawDemo() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, demoCanvas.width, demoCanvas.height);

    // ===== 左側: ゲームフィールド =====
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, FIELD_W, FIELD_H);
    ctx.clip();

    ctx.strokeStyle = 'rgba(255, 182, 193, 0.4)';
    ctx.lineWidth = 1;
    for (let y = 0; y <= FIELD_ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(FIELD_W, y * CELL);
      ctx.stroke();
    }
    for (let x = 0; x <= FIELD_COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, FIELD_H);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 105, 180, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, FIELD_W, FIELD_H);

    // フラッシュ
    if (instantFlash > 0 && burstingCells.length > 0) {
      burstingCells.forEach(([x, y]) => {
        const cx = x * CELL + CELL / 2, cy = y * CELL + CELL / 2;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(FIELD_W, FIELD_H) * instantFlash);
        grad.addColorStop(0, `rgba(255,255,255,${instantFlash * 0.3})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, FIELD_W, FIELD_H);
      });
    }

    // 衝撃波
    shockwaves.forEach(sw => {
      ctx.save();
      ctx.globalAlpha = sw.alpha;
      ctx.strokeStyle = rainbowColors[chainLevel - 1] || '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // バースト
    if (burstingCells.length > 0) {
      const progress = Math.min(burstTimer / BURST_DURATION, 1);
      burstingCells.forEach(([x, y, color]) => { drawBurstParticle(ctx, x * CELL, y * CELL, color, progress); });
    }

    // ボード
    for (let y = 0; y < FIELD_ROWS; y++) {
      for (let x = 0; x < FIELD_COLS; x++) {
        if (board[y][x]) {
          drawWrappedCandy(ctx, x * CELL, y * CELL, board[y][x], CELL, 1);
        }
      }
    }

    // 落下中
    if (fallingPair) {
      const displayY = Math.floor(fallingPair.y);
      if (displayY >= 0 && displayY < FIELD_ROWS) {
        drawWrappedCandy(ctx, fallingPair.x * CELL, displayY * CELL, fallingPair.color, CELL, 0.8);
      }
    }

    // 法力テキスト表示
    if (burstTextTimer > 0) {
      ctx.font = 'bold 24px Nunito, sans-serif';
      ctx.fillStyle = '#ff6600';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      const chargeText = burstTextChain >= 2
        ? `連続で消すと\nボーナスチャージ!`
        : `+${burstTextChain * 2}チャージ!`;
      const lines = chargeText.split('\n');
      const lineH = 26;
      const fontSize = burstTextChain >= 2 ? 18 : 22;
      ctx.font = `bold ${fontSize}px Nunito, sans-serif`;
      const startY = FIELD_H / 2 - ((lines.length - 1) * lineH) / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, FIELD_W / 2, startY + i * lineH);
      });
      ctx.shadowBlur = 0;
    }

    ctx.restore();

    // ===== 右側: マジックボタン =====
    drawMagicButton();

    // 区切り線
    ctx.strokeStyle = 'rgba(255, 105, 180, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(FIELD_W + PADDING / 2, 0);
    ctx.lineTo(FIELD_W + PADDING / 2, TOTAL_H);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function demoGameLoop(time) {
    const delta = demoLastTime ? time - demoLastTime : 16;
    demoLastTime = time;
    updateDemo(delta);
    drawDemo();
    if (demoPlaying) requestAnimationFrame(demoGameLoop);
  }

  window.restartHardDemo = function() {
    initDemoBoard();
    demoLastTime = 0;
  };

  initDemoBoard();
  demoPlaying = true;
  requestAnimationFrame(demoGameLoop);
})();
