/* ═══════════════════════════════════════════════════════════
   💖 VALENTINE WEB v2 — Premium Interactive Experience
   Hearts · Stars · Sparkles · Music · Haptics · Confetti
   ═══════════════════════════════════════════════════════════ */

// ─── CONFIG (замени под себя) ──────────────────────────────────────
const CONFIG = {
  answer1: 'WhatsApp',
  answer2: 'Во дворе',
  options1: ['Instagram', 'Telegram', 'WhatsApp', 'TikTok'],
  options2: ['В школе', 'Во дворе', 'В интернете', 'На вечеринке'],

  // 🎵 YouTube Video ID для K-pop песни
  // IU — «밤편지 (Through the Night)» — нежная, романтичная
  // Другие варианты: BTS Spring Day: xEeFrLSkMm8, IU Love Poem: mUMOYxqbOoE
  youtubeVideoId: 'HEYOGRefHfk',

  emotionalMessages: [
    { text: 'Знаешь, я иногда вспоминаю тот момент…',       delay: 2500 },
    { text: 'И каждый раз думаю — как мне повезло 🍀',       delay: 3000 },
    { text: 'С тех пор столько всего было…',                 delay: 2500 },
    { text: 'Но одно не изменилось —',                       delay: 2000 },
    { text: 'ты до сих пор заставляешь меня улыбаться 😊',   delay: 3000, emphasis: true },
    { text: 'И сегодня я хочу сделать кое-что…',             delay: 3500 },
    { text: 'Я немного волнуюсь прямо сейчас 💓',            delay: 2500 },
  ],

  finaleMessages: [
    { text: 'Помнишь то место, где всё началось?..', delay: 2500 },
    { text: 'Кажется, там сейчас кое-что происходит…', delay: 3500 },
    { text: 'Проверь сама 👀', delay: 3000, big: true },
    { text: 'Посмотри туда, где всё началось 💖', delay: 2000, big: true },
  ],
};

// ─── STATE ─────────────────────────────────────────────────────────
let currentStep = 0; // 0=welcome,1=q1,2=q2,3=transition,4=emotional,5=finale
let musicPlaying = false;
let ytPlayer = null;
let ytReady = false;
let particleIntensity = 1.0;

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// ─── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  buildOptions();
  $('#btn-start').addEventListener('click', startGame);
  $('#music-btn').addEventListener('click', toggleMusic);
  $('#btn-continue').addEventListener('click', showFinale);
  initCursorSparkle();
  initGlowBorder();
});

// ─── SCREEN TRANSITIONS ───────────────────────────────────────────
function switchScreen(from, to, delay = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      const f = $(`#${from}`), t = $(`#${to}`);
      f.classList.add('exit');
      f.classList.remove('active');
      setTimeout(() => {
        f.classList.remove('exit');
        t.classList.add('active');
        resolve();
      }, 600);
    }, delay);
  });
}

function updateProgress(step) {
  const dots = $$('.progress-dots .dot');
  dots.forEach((d, i) => {
    d.classList.remove('active', 'done');
    if (i < step) d.classList.add('done');
    if (i === step) d.classList.add('active');
  });
}

// ─── BUILD OPTIONS ────────────────────────────────────────────────
function buildOptions() {
  CONFIG.options1.forEach(o => $('#q1-options').appendChild(makeOptBtn(o, 1)));
  CONFIG.options2.forEach(o => $('#q2-options').appendChild(makeOptBtn(o, 2)));
}

function makeOptBtn(text, q) {
  const btn = document.createElement('button');
  btn.className = 'option-btn';
  btn.textContent = text;
  btn.addEventListener('click', () => handleAnswer(text, q, btn));
  return btn;
}

// ─── GAME FLOW ────────────────────────────────────────────────────
async function startGame() {
  tryPlayMusic();
  updateProgress(1);
  await switchScreen('screen-welcome', 'screen-q1');
}

async function handleAnswer(answer, q, btnEl) {
  const correct = q === 1 ? CONFIG.answer1 : CONFIG.answer2;
  const hintSel = q === 1 ? '#q1-hint' : '#q2-hint';
  const optsSel = q === 1 ? '#q1-options' : '#q2-options';

  if (answer === correct) {
    btnEl.classList.add('correct');
    haptic(30);
    disableOpts(optsSel);
    await sleep(800);

    if (q === 1) {
      updateProgress(2);
      await switchScreen('screen-q1', 'screen-q2');
    } else {
      updateProgress(3);
      await switchScreen('screen-q2', 'screen-transition');
      await sleep(2500);
      updateProgress(4);
      await switchScreen('screen-transition', 'screen-emotional');
      particleIntensity = 2.0;
      rampVolume(60);
      playEmotionalSequence();
    }
  } else {
    btnEl.classList.add('wrong');
    haptic(100);
    showHint(hintSel);
    setTimeout(() => btnEl.classList.remove('wrong'), 600);
  }
}

function disableOpts(sel) {
  $$(sel + ' .option-btn').forEach(b => {
    b.style.pointerEvents = 'none';
    if (!b.classList.contains('correct')) b.style.opacity = '0.3';
  });
}

function showHint(sel) {
  const h = $(sel);
  h.classList.add('visible');
  setTimeout(() => h.classList.remove('visible'), 2500);
}

// ─── EMOTIONAL SEQUENCE ──────────────────────────────────────────
async function playEmotionalSequence() {
  const container = $('#emotional-messages');
  for (const msg of CONFIG.emotionalMessages) {
    const dots = makeDots();
    container.appendChild(dots);
    await sleep(msg.delay * 0.4);
    dots.remove();
    container.appendChild(makeBubble(msg.text, msg.emphasis ? 'emphasis' : ''));
    await sleep(msg.delay * 0.6);
  }
  const btn = $('#btn-continue');
  btn.classList.remove('is-hidden');
  void btn.offsetHeight;
  btn.classList.add('is-visible');
}

async function showFinale() {
  updateProgress(5);
  rampVolume(80);
  await switchScreen('screen-emotional', 'screen-finale');
  particleIntensity = 3.0;

  const container = $('#finale-messages');
  for (const msg of CONFIG.finaleMessages) {
    const dots = makeDots();
    container.appendChild(dots);
    await sleep(msg.delay * 0.4);
    dots.remove();
    container.appendChild(makeBubble(msg.text, msg.big ? 'finale-big' : ''));
    if (msg.big) { createHeartBurst(); createConfetti(); haptic(50); }
    await sleep(msg.delay * 0.6);
  }
}

// ─── MESSAGE HELPERS ─────────────────────────────────────────────
function makeBubble(text, cls = '') {
  const d = document.createElement('div');
  d.className = `msg-bubble ${cls}`.trim();
  d.textContent = text;
  return d;
}

function makeDots() {
  const d = document.createElement('div');
  d.className = 'typing-dots';
  d.style.alignSelf = 'center';
  d.innerHTML = '<span></span><span></span><span></span>';
  return d;
}

// ─── HEART BURST ─────────────────────────────────────────────────
function createHeartBurst() {
  const hearts = ['💖','💕','💗','💓','❤️','🩷','✨','💫'];
  for (let i = 0; i < 24; i++) {
    const s = document.createElement('span');
    s.className = 'heart-burst';
    s.textContent = hearts[i % hearts.length];
    const a = (Math.PI * 2 * i) / 24 + (Math.random() - .5) * .5;
    const dist = 120 + Math.random() * 220;
    s.style.cssText = `left:50%;top:50%;font-size:${1+Math.random()*1.5}rem;
      --tx:${Math.cos(a)*dist}px;--ty:${Math.sin(a)*dist-100}px;
      --rot:${(Math.random()-.5)*360}deg;animation-delay:${Math.random()*.3}s`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 2500);
  }
}

// ─── CONFETTI ────────────────────────────────────────────────────
function createConfetti() {
  const colors = ['#ff6b9d','#c77dff','#ffd700','#e0aaff','#ff2d78','#fff'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.background = colors[i % colors.length];
    const a = Math.random() * Math.PI * 2;
    const dist = 150 + Math.random() * 300;
    c.style.cssText += `left:50%;top:50%;
      --cx:${Math.cos(a)*dist}px;--cy:${Math.sin(a)*dist-150}px;
      --cr:${Math.random()*720}deg;
      width:${4+Math.random()*8}px;height:${6+Math.random()*10}px;
      animation-delay:${Math.random()*.4}s;
      background:${colors[i%colors.length]};border-radius:${Math.random()>.5?'50%':'2px'}`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3500);
  }
}

// ─── YOUTUBE MUSIC ───────────────────────────────────────────────
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-player', {
    height: '1', width: '1',
    videoId: CONFIG.youtubeVideoId,
    playerVars: { autoplay:0, loop:1, playlist:CONFIG.youtubeVideoId, controls:0, playsinline:1 },
    events: { onReady: () => { ytReady = true; ytPlayer.setVolume(35); } },
  });
};

function tryPlayMusic() {
  if (ytReady && !musicPlaying) {
    ytPlayer.playVideo();
    musicPlaying = true;
    $('#music-btn').classList.add('playing');
    $('#music-icon').textContent = '🎶';
  }
}

function toggleMusic() {
  if (!ytReady) return;
  if (musicPlaying) {
    ytPlayer.pauseVideo(); musicPlaying = false;
    $('#music-btn').classList.remove('playing');
    $('#music-icon').textContent = '🎵';
  } else {
    ytPlayer.playVideo(); musicPlaying = true;
    $('#music-btn').classList.add('playing');
    $('#music-icon').textContent = '🎶';
  }
}

function rampVolume(target) {
  if (!ytReady) return;
  const cur = ytPlayer.getVolume();
  const step = (target - cur) / 20;
  let i = 0;
  const iv = setInterval(() => {
    i++;
    ytPlayer.setVolume(Math.round(cur + step * i));
    if (i >= 20) clearInterval(iv);
  }, 100);
}

// ─── CURSOR SPARKLE ──────────────────────────────────────────────
function initCursorSparkle() {
  let lastT = 0;
  const handler = (e) => {
    const now = Date.now();
    if (now - lastT < 80) return;
    lastT = now;
    const x = e.clientX || (e.touches && e.touches[0]?.clientX);
    const y = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (!x) return;
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = (x - 3 + (Math.random()-0.5)*10) + 'px';
    s.style.top = (y - 3 + (Math.random()-0.5)*10) + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  };
  document.addEventListener('mousemove', handler);
  document.addEventListener('touchmove', handler, { passive: true });
}

// ─── ANIMATED GLOW BORDER ────────────────────────────────────────
function initGlowBorder() {
  let angle = 0;
  function tick() {
    angle = (angle + 0.5) % 360;
    document.querySelectorAll('.glow-border').forEach(el => {
      el.style.setProperty('--glow-angle', angle + 'deg');
    });
    requestAnimationFrame(tick);
  }
  tick();
}

// ─── HAPTIC FEEDBACK ─────────────────────────────────────────────
function haptic(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

// ─── HEART + STAR PARTICLES (Canvas) ─────────────────────────────
function initParticles() {
  const canvas = $('#particles');
  const ctx = canvas.getContext('2d');
  const particles = [];
  const stars = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  // Heart shape
  function drawHeart(ctx, x, y, s) {
    ctx.beginPath();
    const t = s * 0.3;
    ctx.moveTo(x, y + t);
    ctx.bezierCurveTo(x, y, x - s/2, y, x - s/2, y + t);
    ctx.bezierCurveTo(x - s/2, y + (s+t)/2, x, y + (s+t)/1.2, x, y + s);
    ctx.bezierCurveTo(x, y + (s+t)/1.2, x + s/2, y + (s+t)/2, x + s/2, y + t);
    ctx.bezierCurveTo(x + s/2, y, x, y, x, y + t);
    ctx.closePath();
  }

  const hColors = [
    [255,107,157],[199,125,255],[232,69,122],[224,170,255],[255,45,120]
  ];

  class Heart {
    constructor(spread) {
      this.x = Math.random() * canvas.width;
      this.y = spread ? Math.random() * canvas.height : canvas.height + 20 + Math.random() * 60;
      this.size = 6 + Math.random() * 14;
      this.vy = 0.3 + Math.random() * 0.8;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.opacity = 0.1 + Math.random() * 0.3;
      this.color = hColors[Math.floor(Math.random() * hColors.length)];
      this.swayAmp = 20 + Math.random() * 40;
      this.swaySpd = 0.005 + Math.random() * 0.01;
      this.swayOff = Math.random() * Math.PI * 2;
      this.rot = (Math.random() - 0.5) * 0.5;
      this.rotSpd = (Math.random() - 0.5) * 0.01;
    }
    update(t) {
      this.y -= this.vy * particleIntensity;
      this.x += this.vx + Math.sin(t * this.swaySpd + this.swayOff) * 0.5;
      this.rot += this.rotSpd;
      if (this.y < -30) { this.y = canvas.height + 20; this.x = Math.random() * canvas.width; }
    }
    draw(ctx) {
      const [r,g,b] = this.color;
      const a = this.opacity * Math.min(1, (canvas.height - this.y) / 200);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      drawHeart(ctx, 0, -this.size / 2, this.size);
      ctx.fill();
      ctx.restore();
    }
  }

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = 0.5 + Math.random() * 1.5;
      this.twinkleSpd = 0.002 + Math.random() * 0.005;
      this.twinkleOff = Math.random() * Math.PI * 2;
      this.baseOpacity = 0.2 + Math.random() * 0.4;
    }
    draw(ctx, t) {
      const o = this.baseOpacity * (0.5 + 0.5 * Math.sin(t * this.twinkleSpd + this.twinkleOff));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${o})`;
      ctx.fill();
    }
  }

  // Init
  const hCount = Math.min(35, Math.floor(canvas.width / 30));
  for (let i = 0; i < hCount; i++) particles.push(new Heart(true));
  const sCount = Math.min(80, Math.floor(canvas.width / 15));
  for (let i = 0; i < sCount; i++) stars.push(new Star());

  function animate(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    for (const s of stars) s.draw(ctx, t);

    // Hearts — add more when intensity increases
    const target = Math.floor(hCount * particleIntensity);
    while (particles.length < target) particles.push(new Heart(false));

    for (const p of particles) { p.update(t); p.draw(ctx); }
    requestAnimationFrame(animate);
  }
  animate(0);
}

// ─── UTILS ───────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
