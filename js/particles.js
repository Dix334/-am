// ============================================
// SISTEMA DE PARTÍCULAS — corazones y estrellas
// ============================================

class ParticleSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particle-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.55;
    `;
    document.body.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.spawnInterval = setInterval(() => this.spawn(), 1200);
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn() {
    const types = ['heart', 'star', 'dot'];
    const type = types[Math.floor(Math.random() * types.length)];
    this.particles.push({
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + 20,
      size: Math.random() * 10 + 5,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      type,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: Math.random() * 0.01 + 0.005,
    });
    // Keep max 40 particles
    if (this.particles.length > 40) this.particles.shift();
  }

  drawHeart(ctx, x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    const s = size * 0.5;
    ctx.moveTo(0, s * 0.5);
    ctx.bezierCurveTo(-s, -s * 0.3, -s * 1.5, s * 0.8, 0, s * 1.6);
    ctx.bezierCurveTo(s * 1.5, s * 0.8, s, -s * 0.3, 0, s * 0.5);
    ctx.fill();
    ctx.restore();
  }

  drawStar(ctx, x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const outerX = Math.cos(angle) * size;
      const outerY = Math.sin(angle) * size;
      const innerAngle = angle + Math.PI / 5;
      const innerX = Math.cos(innerAngle) * size * 0.4;
      const innerY = Math.sin(innerAngle) * size * 0.4;
      if (i === 0) ctx.moveTo(outerX, outerY);
      else ctx.lineTo(outerX, outerY);
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => p.y > -50 && p.opacity > 0.01);

    for (const p of this.particles) {
      p.drift += p.driftSpeed;
      p.x += p.speedX + Math.sin(p.drift) * 0.3;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.0008;

      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.type === 'heart' ? '#c4704a' : p.type === 'star' ? '#b8956a' : '#8c7b6b';

      if (p.type === 'heart') this.drawHeart(this.ctx, p.x, p.y, p.size, p.rotation);
      else if (p.type === 'star') this.drawStar(this.ctx, p.x, p.y, p.size * 0.6, p.rotation);
      else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    clearInterval(this.spawnInterval);
    this.canvas.remove();
  }
}

// Burst de partículas al click
function burstParticles(x, y, count = 8) {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const bursts = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    bursts.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      opacity: 1,
      size: Math.random() * 6 + 3,
    });
  }

  function drawBurst() {
    if (bursts.every(b => b.opacity <= 0)) return;
    bursts.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.1;
      b.opacity -= 0.04;
      if (b.opacity <= 0) return;
      ctx.globalAlpha = b.opacity;
      ctx.fillStyle = '#c4704a';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawBurst);
  }
  drawBurst();
}

// Iniciar al cargar
window.addEventListener('DOMContentLoaded', () => {
  window._particles = new ParticleSystem();

  // Burst en clicks
  document.addEventListener('click', (e) => {
    burstParticles(e.clientX, e.clientY, 6);
  });
});
