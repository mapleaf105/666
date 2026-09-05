// game.js - Flappy Bird style mobile-friendly game (no external assets)
// Author: generated
'use strict';

(() => {
  const canvas = document.getElementById('game');
  const overlay = document.getElementById('overlay');
  const startBtn = document.getElementById('startBtn');

  let ctx, DPR = Math.max(1, window.devicePixelRatio || 1);
  let W, H;
  function resize() {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    W = Math.max(320, window.innerWidth);
    H = Math.max(480, window.innerHeight);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx = canvas.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  // Game state
  const state = {
    running: false,
    over: false,
    score: 0,
    highScore: 0
  };

  // Bird
  const bird = {
    x: 80,
    y: H/2,
    r: 14,
    vy: 0,
    gravity: 0.6,
    flapStrength: -9,
    rotation: 0
  };

  // Pipes
  const pipes = [];
  const pipeCfg = { width: 56, gap: 140, speed: 2.2, spawnInterval: 1500 };
  let lastSpawn = 0;

  let lastTime = 0;

  function reset() {
    state.running = false;
    state.over = false;
    state.score = 0;
    bird.y = H/2;
    bird.vy = 0;
    pipes.length = 0;
    lastSpawn = 0;
  }

  function startGame() {
    reset();
    state.running = true;
    overlay.style.display = 'none';
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  function gameOver() {
    state.running = false;
    state.over = true;
    overlay.style.display = '';
    overlay.querySelector('.panel').innerHTML = `
      <h1>失败了</h1>
      <p>得分：${state.score} &nbsp; 最高：${state.highScore}</p>
      <button id="startBtn2" class="btn">再来一次</button>
      <p class="hint">点击或空格重试</p>
    `;
    document.getElementById('startBtn2').addEventListener('click', startGame);
    if (state.score > state.highScore) state.highScore = state.score;
  }

  function flap() {
    bird.vy = bird.flapStrength;
  }

  // Input handlers
  function onTap(e) {
    e.preventDefault();
    if (!state.running) {
      if (state.over) startGame();
      else startGame();
      return;
    }
    flap();
  }
  function onKey(e) {
    if (e.code === 'Space' || e.key === ' ') {
      if (!state.running) {
        if (state.over) startGame();
        else startGame();
      } else flap();
    }
  }
  canvas.addEventListener('pointerdown', onTap, {passive:false});
  document.addEventListener('keydown', onKey);

  // Pipe generator
  function spawnPipe() {
    const minTop = 40;
    const maxTop = H - pipeCfg.gap - 80;
    const top = Math.floor(minTop + Math.random() * Math.max(0, maxTop - minTop));
    pipes.push({ x: W + 20, top, passed: false });
  }

  // Collision helpers
  function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
    // nearest point
    const nx = Math.max(rx, Math.min(cx, rx+rw));
    const ny = Math.max(ry, Math.min(cy, ry+rh));
    const dx = nx - cx, dy = ny - cy;
    return (dx*dx + dy*dy) <= r*r;
  }

  // Main loop
  function loop(ts) {
    if (!state.running) return;
    const dt = Math.min(40, ts - lastTime);
    lastTime = ts;

    // Update bird
    bird.vy += bird.gravity * (dt / 16.67);
    bird.y += bird.vy * (dt / 16.67);
    bird.rotation = Math.max(-0.6, Math.min(1.2, bird.vy / 15));

    // Spawn pipes
    if (ts - lastSpawn > pipeCfg.spawnInterval) {
      spawnPipe();
      lastSpawn = ts;
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.x -= pipeCfg.speed * (dt / 16.67);
      // scoring
      if (!p.passed && p.x + pipeCfg.width < bird.x) {
        p.passed = true;
        state.score++;
      }
      // remove offscreen
      if (p.x + pipeCfg.width < -20) pipes.splice(i,1);
    }

    // Collisions with pipes or ground/ceiling
    if (bird.y - bird.r < 0 || bird.y + bird.r > H - 0) {
      gameOver();
      return;
    }
    for (const p of pipes) {
      // top rect
      if (circleRectCollision(bird.x, bird.y, bird.r, p.x, 0, pipeCfg.width, p.top)) { gameOver(); return; }
      // bottom rect
      if (circleRectCollision(bird.x, bird.y, bird.r, p.x, p.top + pipeCfg.gap, pipeCfg.width, H - (p.top + pipeCfg.gap))) { gameOver(); return; }
    }

    draw();
    // next frame
    requestAnimationFrame(loop);
  }

  // Draw everything
  function draw() {
    // clear
    ctx.clearRect(0,0,W,H);
    // background sky gradient (simple)
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0, '#70c5ce');
    g.addColorStop(1, '#a0e0e8');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    // ground
    ctx.fillStyle = '#ded895';
    ctx.fillRect(0, H - 40, W, 40);

    // pipes
    ctx.fillStyle = '#2ea44f';
    for (const p of pipes) {
      // top
      roundRect(ctx, p.x, 0, pipeCfg.width, p.top, 6, true, true);
      // bottom
      roundRect(ctx, p.x, p.top + pipeCfg.gap, pipeCfg.width, H - (p.top + pipeCfg.gap) - 40, 6, true, true);
    }

    // bird (circle with wing)
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation);
    // body
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(0,0,bird.r,0,Math.PI*2);
    ctx.fill();
    // beak
    ctx.fillStyle = '#ff8c00';
    ctx.beginPath();
    ctx.moveTo(bird.r-2, 0);
    ctx.lineTo(bird.r+10, -6);
    ctx.lineTo(bird.r+10, 6);
    ctx.closePath();
    ctx.fill();
    // eye
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-4, -4, 2.2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // score
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 3;
    ctx.font = '700 36px '+getComputedStyle(document.documentElement).fontFamily;
    ctx.textAlign = 'center';
    ctx.strokeText(state.score, W/2, 60);
    ctx.fillText(state.score, W/2, 60);
  }

  // rounded rect helper
  function roundRect(ctx,x,y,w,h,r,fill,stroke){
    if (typeof r === 'undefined') r=6;
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
    if(fill){ ctx.fill(); }
    if(stroke){ ctx.stroke(); }
  }

  // Hook up start button
  startBtn.addEventListener('click', startGame);

  // Show overlay initially
  overlay.style.display = '';

  // Expose small API for debugging
  window.__flappy = { start: startGame, reset, state };
})();
