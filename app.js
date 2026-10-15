/* Animalitos a bañar — juego para bebés (iPad iOS 12+, funciona sin internet)
   Código escrito en JavaScript clásico para ser compatible con Safari de iOS 12. */
(function () {
'use strict';

/* ------------------------------------------------------------------ utilidades */
function R(a, b) { return a + Math.random() * (b - a); }
function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
function $(id) { return document.getElementById(id); }
function dist(ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }
var KW = 1024, KH = 1536;           // espacio de coordenadas de los dibujos

/* ------------------------------------------------------------------ datos de los animalitos */
var ANIMALS = [
  { id: 'unicornio', eyes: [[285, 740], [690, 800]], mouth: [465, 930, 100], head: [430, 250, 190],
    tuft: ['#f7a8cf', '#c9a8f0', '#9fd0f5', '#fbe27a', '#8fe0c4'] },
  { id: 'gatito', eyes: [[372, 722], [727, 692]], mouth: [553, 852, 100], head: [550, 310, 230],
    tuft: ['#dfa862', '#c98f4c', '#edc088'] },
  { id: 'perrito', eyes: [[352, 632], [702, 662]], mouth: [497, 826, 110], head: [560, 240, 240],
    tuft: ['#e5ad68', '#d49a52', '#f0c488'] },
  { id: 'pollito', eyes: [[292, 722], [737, 762]], mouth: [506, 892, 90], head: [560, 150, 230],
    tuft: ['#f8d24e', '#f2c438', '#fce483'] },
  { id: 'leon', eyes: [[352, 692], [677, 717]], mouth: [506, 852, 100], head: [520, 205, 330],
    tuft: ['#a96b3c', '#8f5630', '#c28652'] },
  { id: 'elefante', eyes: [[362, 662], [657, 677]], mouth: [506, 905, 90], head: [545, 262, 150],
    tuft: ['#9aa7b8', '#8795a8', '#b2bccb'] }
];

/* ------------------------------------------------------------------ íconos de las herramientas (SVG) */
var ICONS = {
  soap: '<svg viewBox="0 0 64 64"><rect x="8" y="26" width="46" height="26" rx="11" fill="#ff9ec7" stroke="#e0709f" stroke-width="3"/><ellipse cx="22" cy="32" rx="9" ry="3.5" fill="#ffd0e4"/><circle cx="25" cy="41" r="2.4" fill="#7a3a55"/><circle cx="39" cy="41" r="2.4" fill="#7a3a55"/><path d="M29 44.5 Q32 47.5 35 44.5" fill="none" stroke="#7a3a55" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="40" r="3" fill="#ff7fb0" opacity=".6"/><circle cx="44" cy="40" r="3" fill="#ff7fb0" opacity=".6"/><circle cx="16" cy="14" r="7" fill="#fff" fill-opacity=".55" stroke="#8fd0ff" stroke-width="2.5"/><circle cx="36" cy="9" r="5" fill="#fff" fill-opacity=".55" stroke="#8fd0ff" stroke-width="2.5"/><circle cx="50" cy="16" r="6" fill="#fff" fill-opacity=".55" stroke="#c9a8ff" stroke-width="2.5"/></svg>',
  hose: '<svg viewBox="0 0 64 64"><path d="M56 6 C56 30 36 20 32 36" fill="none" stroke="#3fa65a" stroke-width="9" stroke-linecap="round"/><path d="M56 6 C56 30 36 20 32 36" fill="none" stroke="#7fdc92" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 8"/><path d="M24 31 L38 37 L29 53 L15 45 Z" fill="#ffc93c" stroke="#d99300" stroke-width="3" stroke-linejoin="round"/><ellipse cx="22" cy="49" rx="9" ry="4.5" transform="rotate(-30 22 49)" fill="#ff9b2e" stroke="#d96f00" stroke-width="2.5"/><path d="M8 54 q-3 5 0 7 q3 -2 0 -7z M17 58 q-3 5 0 7 q3 -2 0 -7z M4 47 q-3 5 0 7 q3 -2 0 -7z" fill="#6cc6ff" stroke="#3b9be0" stroke-width="1.2"/></svg>',
  comb: '<svg viewBox="0 0 64 64"><rect x="6" y="10" width="52" height="16" rx="8" fill="#b79cff" stroke="#8d6fe0" stroke-width="3"/><rect x="11" y="13" width="26" height="4" rx="2" fill="#dccdff"/><g fill="#b79cff" stroke="#8d6fe0" stroke-width="2.5" stroke-linejoin="round"><rect x="10" y="24" width="5" height="30" rx="2.5"/><rect x="18" y="24" width="5" height="30" rx="2.5"/><rect x="26" y="24" width="5" height="30" rx="2.5"/><rect x="34" y="24" width="5" height="30" rx="2.5"/><rect x="42" y="24" width="5" height="30" rx="2.5"/><rect x="49" y="24" width="5" height="30" rx="2.5"/></g><circle cx="46" cy="18" r="2.2" fill="#fff"/></svg>',
  towel: '<svg viewBox="0 0 64 64"><rect x="7" y="14" width="50" height="36" rx="7" fill="#76d1f5" stroke="#3fa6d6" stroke-width="3"/><rect x="7" y="22" width="50" height="6" fill="#fff" opacity=".85"/><rect x="7" y="36" width="50" height="6" fill="#fff" opacity=".85"/><g stroke="#3fa6d6" stroke-width="2.5" stroke-linecap="round"><line x1="7" y1="52" x2="7" y2="58"/><line x1="15" y1="51" x2="15" y2="58"/><line x1="23" y1="51" x2="23" y2="58"/><line x1="31" y1="51" x2="31" y2="58"/><line x1="39" y1="51" x2="39" y2="58"/><line x1="47" y1="51" x2="47" y2="58"/><line x1="57" y1="52" x2="57" y2="58"/></g><circle cx="22" cy="45" r="1.8" fill="#2b7ca5"/><circle cx="34" cy="45" r="1.8" fill="#2b7ca5"/><path d="M26 47 Q28 49.5 30 47" fill="none" stroke="#2b7ca5" stroke-width="1.6" stroke-linecap="round"/></svg>',
  brush: '<svg viewBox="0 0 64 64"><g transform="rotate(-38 32 32)"><rect x="3" y="26" width="42" height="12" rx="6" fill="#ff8fb1" stroke="#e0628a" stroke-width="3"/><rect x="8" y="29" width="20" height="3" rx="1.5" fill="#ffc6d8"/><rect x="42" y="23" width="18" height="18" rx="5" fill="#6fd0ff" stroke="#3b9be0" stroke-width="3"/><g fill="#fff" stroke="#9fb7c9" stroke-width="1"><rect x="45" y="14" width="4" height="10" rx="2"/><rect x="51" y="14" width="4" height="10" rx="2"/><rect x="57" y="14" width="3" height="10" rx="1.5"/></g><path d="M44 21 q4 -6 9 -3 q4 -4 8 1 q-3 3 -8 2 q-5 3 -9 0z" fill="#9be8c2" stroke="#4dbb8d" stroke-width="1.5"/></g></svg>',
  shampoo: '<svg viewBox="0 0 64 64"><rect x="26" y="4" width="12" height="9" rx="3" fill="#ff9ec7" stroke="#e0709f" stroke-width="2.5"/><rect x="22" y="12" width="20" height="8" rx="3" fill="#ffd45c" stroke="#d9a400" stroke-width="2.5"/><rect x="14" y="19" width="36" height="40" rx="12" fill="#c79bff" stroke="#9566e0" stroke-width="3"/><rect x="19" y="24" width="6" height="26" rx="3" fill="#e3ceff"/><ellipse cx="34" cy="40" rx="11" ry="11" fill="#fff"/><path d="M34 46 C26 40 28 33 34 36 C40 33 42 40 34 46z" fill="#ff7fb0"/><circle cx="50" cy="10" r="5" fill="#fff" fill-opacity=".55" stroke="#8fd0ff" stroke-width="2"/><circle cx="57" cy="22" r="3.5" fill="#fff" fill-opacity=".55" stroke="#c9a8ff" stroke-width="2"/></svg>'
};
var TOOLS = [
  { id: 'soap', pitch: 523 }, { id: 'hose', pitch: 587 }, { id: 'shampoo', pitch: 659 },
  { id: 'comb', pitch: 784 }, { id: 'towel', pitch: 880 }, { id: 'brush', pitch: 1047 }
];
var STAR_SVG = '<svg viewBox="0 0 40 40"><path d="M20 3 L25 15 L38 16 L28 25 L31 38 L20 31 L9 38 L12 25 L2 16 L15 15 Z" fill="#ffd84a" stroke="#e0a800" stroke-width="2.5" stroke-linejoin="round"/></svg>';

/* ------------------------------------------------------------------ estado global */
var W = 800, H = 600, DPR = 1;
var stageRect = { left: 0, top: 0, w: 300, h: 450 };
var bgCv = $('bg'), bgX = bgCv.getContext('2d');
var fxCv = $('fx'), fxX = fxCv.getContext('2d');
var stagesEl = $('stages'), toolsEl = $('tools'), thumbsEl = $('thumbs'), cursorEl = $('cursorTool');
var haloEl = $('halo');
var cur = null, curIndex = 0, tool = null;
var T = 0, last = 0;
var particles = [];
var fireflies = [];
var glow = null;
var hinting = true;

/* ------------------------------------------------------------------ AUDIO (todo sintetizado, sin archivos) */
var AC = null, master = null, noiseBuf = null, muted = false, waterNode = null;

function initAudio() {
  if (AC) return;
  var C = window.AudioContext || window.webkitAudioContext;
  if (!C) return;
  try {
    AC = new C();
    master = AC.createGain(); master.gain.value = muted ? 0 : 0.7;
    var comp = AC.createDynamicsCompressor();
    master.connect(comp); comp.connect(AC.destination);
    var len = AC.sampleRate * 2, b = AC.createBuffer(1, len, AC.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    noiseBuf = b;
  } catch (e) { AC = null; }
}
function unlockAudio() {
  initAudio();
  if (!AC) return;
  if (AC.state !== 'running' && AC.resume) { try { AC.resume(); } catch (e) {} }
  try { var s = AC.createBufferSource(); s.buffer = AC.createBuffer(1, 1, 22050); s.connect(AC.destination); s.start(0); } catch (e) {}
}
/* nota con glide: pts = [[segundos, Hz], ...] */
function note(o) {
  if (!AC || muted) return;
  var t0 = AC.currentTime + (o.delay || 0), dur = o.dur || 0.3, vol = o.vol || 0.2;
  var osc = AC.createOscillator(), g = AC.createGain(), out = g;
  osc.type = o.type || 'sine';
  var pts = o.f;
  osc.frequency.setValueAtTime(pts[0][1], t0);
  for (var i = 1; i < pts.length; i++) osc.frequency.exponentialRampToValueAtTime(Math.max(20, pts[i][1]), t0 + pts[i][0]);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.03, dur * 0.25));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  if (o.lp) { var f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; g.connect(f); out = f; }
  out.connect(master);
  if (o.vib) {
    var l = AC.createOscillator(), lg = AC.createGain();
    l.frequency.value = o.vib[0]; lg.gain.value = o.vib[1];
    l.connect(lg); lg.connect(osc.frequency); l.start(t0); l.stop(t0 + dur + 0.05);
  }
  osc.start(t0); osc.stop(t0 + dur + 0.05);
}
function noiseBurst(o) {
  if (!AC || muted || !noiseBuf) return;
  var t0 = AC.currentTime + (o.delay || 0), dur = o.dur || 0.1;
  var s = AC.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  var f = AC.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1500, t0); f.Q.value = o.q || 1;
  if (o.fEnd) f.frequency.exponentialRampToValueAtTime(o.fEnd, t0 + dur);
  var g = AC.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(o.vol || 0.1, t0 + Math.min(0.02, dur * 0.3));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(f); f.connect(g); g.connect(master);
  s.start(t0, Math.random() * 1.5); s.stop(t0 + dur + 0.05);
}
function sfxPop(small) {
  var f = small ? R(1300, 2400) : R(600, 1300);
  note({ f: [[0, f], [0.07, f * 1.7]], dur: small ? 0.07 : 0.1, vol: small ? 0.07 : 0.1, type: 'sine' });
}
function sfxSelect(p) {
  note({ f: [[0, p], [0.12, p * 1.5]], dur: 0.22, vol: 0.16, type: 'sine' });
  note({ f: [[0, p * 2], [0.12, p * 3]], dur: 0.18, vol: 0.05, type: 'triangle', delay: 0.04 });
}
function sfxChime(i, vol) {
  var sc = [784, 880, 988, 1175, 1319, 1568, 1760];
  var f = sc[i % sc.length];
  note({ f: [[0, f], [0.9, f]], dur: 0.9, vol: vol || 0.12, type: 'sine' });
  note({ f: [[0, f * 2], [0.5, f * 2]], dur: 0.5, vol: (vol || 0.12) * 0.35, type: 'sine' });
}
function startWater() {
  if (!AC || muted || waterNode) return;
  var s = AC.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
  var f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3200; f.Q.value = 0.6;
  var f2 = AC.createBiquadFilter(); f2.type = 'highpass'; f2.frequency.value = 900;
  var g = AC.createGain(); g.gain.setValueAtTime(0.0001, AC.currentTime); g.gain.exponentialRampToValueAtTime(0.13, AC.currentTime + 0.12);
  s.connect(f); f.connect(f2); f2.connect(g); g.connect(master); s.start(0, Math.random());
  waterNode = { s: s, g: g };
}
function stopWater() {
  if (!waterNode) return;
  var n = waterNode; waterNode = null;
  try {
    n.g.gain.cancelScheduledValues(AC.currentTime);
    n.g.gain.setValueAtTime(Math.max(0.0001, n.g.gain.value), AC.currentTime);
    n.g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + 0.15);
    n.s.stop(AC.currentTime + 0.2);
  } catch (e) {}
}
/* voces kawaii de cada animalito. happy=false => carita triste */
function voice(id, happy, v) {
  v = v || 1;
  if (id === 'unicornio') {
    if (happy) { [0, 1, 2, 4].forEach(function (k, i) { var f = [784, 988, 1175, 1568][i]; note({ f: [[0, f * 0.95], [0.12, f]], dur: 0.35, vol: 0.13 * v, type: 'sine', delay: i * 0.11, vib: [7, 6] }); note({ f: [[0, f * 2], [0.2, f * 2]], dur: 0.25, vol: 0.04 * v, type: 'triangle', delay: i * 0.11 }); }); }
    else { note({ f: [[0, 700], [0.5, 480]], dur: 0.55, vol: 0.13 * v, type: 'sine', vib: [6, 8] }); note({ f: [[0, 600], [0.5, 420]], dur: 0.5, vol: 0.08 * v, type: 'sine', delay: 0.25, vib: [6, 8] }); }
  } else if (id === 'pollito') {
    if (happy) { for (var i = 0; i < 3; i++) note({ f: [[0, 1900 + i * 150], [0.06, 2500 + i * 150]], dur: 0.09, vol: 0.12 * v, type: 'sine', delay: i * 0.12 }); }
    else { note({ f: [[0, 1700], [0.35, 1150]], dur: 0.4, vol: 0.12 * v, type: 'sine', vib: [9, 25] }); note({ f: [[0, 1600], [0.3, 1100]], dur: 0.35, vol: 0.09 * v, type: 'sine', delay: 0.4, vib: [9, 25] }); }
  } else if (id === 'perrito') {
    if (happy) { note({ f: [[0, 460], [0.05, 520], [0.15, 300]], dur: 0.17, vol: 0.2 * v, type: 'triangle', lp: 1000 }); note({ f: [[0, 700], [0.1, 950]], dur: 0.12, vol: 0.1 * v, type: 'sine', delay: 0.2 }); note({ f: [[0, 470], [0.15, 310]], dur: 0.17, vol: 0.16 * v, type: 'triangle', lp: 1000, delay: 0.38 }); }
    else { note({ f: [[0, 560], [0.5, 380]], dur: 0.55, vol: 0.14 * v, type: 'sine', vib: [6, 10] }); note({ f: [[0, 540], [0.4, 360]], dur: 0.45, vol: 0.1 * v, type: 'sine', delay: 0.5, vib: [6, 10] }); }
  } else if (id === 'gatito') {
    if (happy) { note({ f: [[0, 620], [0.18, 980], [0.45, 700]], dur: 0.5, vol: 0.16 * v, type: 'triangle', lp: 2200, vib: [6, 14] }); note({ f: [[0, 1240], [0.18, 1960], [0.45, 1400]], dur: 0.4, vol: 0.03 * v, type: 'sine', delay: 0.02 }); }
    else { note({ f: [[0, 900], [0.6, 520]], dur: 0.65, vol: 0.15 * v, type: 'triangle', lp: 2000, vib: [7, 16] }); }
  } else if (id === 'leon') {
    if (happy) { note({ f: [[0, 300], [0.12, 250], [0.3, 190]], dur: 0.35, vol: 0.22 * v, type: 'sawtooth', lp: 650, vib: [20, 18] }); note({ f: [[0, 520], [0.14, 700]], dur: 0.14, vol: 0.09 * v, type: 'sine', delay: 0.38 }); }
    else { note({ f: [[0, 260], [0.55, 170]], dur: 0.6, vol: 0.2 * v, type: 'triangle', lp: 700, vib: [6, 10] }); }
  } else if (id === 'elefante') {
    if (happy) { note({ f: [[0, 380], [0.1, 560]], dur: 0.14, vol: 0.17 * v, type: 'triangle', lp: 1700 }); note({ f: [[0, 520], [0.15, 720], [0.45, 560]], dur: 0.5, vol: 0.2 * v, type: 'triangle', lp: 1900, vib: [11, 10], delay: 0.16 }); }
    else { note({ f: [[0, 520], [0.55, 330]], dur: 0.6, vol: 0.18 * v, type: 'triangle', lp: 1500, vib: [8, 12] }); }
  }
}
function sfxGiggle(id) { voice(id, true, 0.55); }
function sfxCelebrate() {
  [523, 659, 784, 1047, 1319].forEach(function (f, i) { note({ f: [[0, f], [0.5, f]], dur: 0.5, vol: 0.14, type: 'sine', delay: i * 0.12 }); note({ f: [[0, f * 2], [0.4, f * 2]], dur: 0.4, vol: 0.04, type: 'triangle', delay: i * 0.12 }); });
}

/* ------------------------------------------------------------------ partículas en pantalla */
function addP(p) { if (particles.length < 260) particles.push(p); }
function spawnBubble(x, y, r, vx, vy) {
  addP({ t: 'b', x: x, y: y, vx: vx || R(-12, 12), vy: vy || R(-70, -25), r: r, life: 0, max: R(1.4, 2.6), hue: (Math.random() * 3) | 0, ph: R(0, 6) });
}
function spawnDrop(x, y, vx, vy, r) { addP({ t: 'd', x: x, y: y, vx: vx, vy: vy, r: r, life: 0, max: R(0.7, 1.2) }); }
function spawnSpark(x, y, r, color, vx, vy) {
  addP({ t: 's', x: x, y: y, vx: vx || R(-25, 25), vy: vy || R(-40, 5), r: r, life: 0, max: R(0.5, 1.0), c: color || '#fff6b0', rot: R(-0.5, 0.5) });
}
function spawnHeart(x, y, r, color) {
  addP({ t: 'h', x: x, y: y, vx: R(-30, 30), vy: R(-120, -60), r: r, life: 0, max: R(1.2, 2), c: color || '#ff8fb8', ph: R(0, 6) });
}
function toScreenX(lx) { return stageRect.left + lx / KW * stageRect.w; }
function toScreenY(ly) { return stageRect.top + ly / KH * stageRect.h; }

function updateParticles(dt) {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.life += dt;
    if (p.life >= p.max) { if (p.t === 'b' && !p.popped) { sfxPopMaybe(); } particles.splice(i, 1); continue; }
    if (p.t === 'd') { p.vy += 1100 * dt; }
    if (p.t === 'b') { p.x += Math.sin(T * 2 + p.ph) * 14 * dt; }
    if (p.t === 'h') { p.x += Math.sin(T * 3 + p.ph) * 30 * dt; }
    if (p.t === 's') { p.vy += 30 * dt; }
    p.x += p.vx * dt; p.y += p.vy * dt;
  }
}
var lastPopSound = 0;
function sfxPopMaybe() { if (T - lastPopSound > 0.12 && Math.random() < 0.35) { lastPopSound = T; sfxPop(true); } }

function drawBubbleShape(c, x, y, r, a, hue) {
  c.globalAlpha = a;
  c.beginPath(); c.arc(x, y, r, 0, 6.2832);
  c.fillStyle = 'rgba(255,255,255,0.5)'; c.fill();
  c.lineWidth = Math.max(1.5, r * 0.09);
  c.strokeStyle = hue === 0 ? 'rgba(130,200,255,0.95)' : (hue === 1 ? 'rgba(255,170,215,0.95)' : 'rgba(190,160,255,0.95)');
  c.stroke();
  c.beginPath(); c.arc(x - r * 0.35, y - r * 0.38, r * 0.24, 0, 6.2832);
  c.fillStyle = 'rgba(255,255,255,0.95)'; c.fill();
  c.globalAlpha = 1;
}
function drawStarShape(c, x, y, r) {
  c.beginPath();
  c.moveTo(x, y - r);
  c.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y);
  c.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r);
  c.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y);
  c.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r);
  c.fill();
}
function drawHeartShape(c, x, y, r) {
  c.beginPath();
  c.moveTo(x, y + r * 0.9);
  c.bezierCurveTo(x - r * 1.5, y - r * 0.1, x - r * 0.7, y - r * 1.1, x, y - r * 0.4);
  c.bezierCurveTo(x + r * 0.7, y - r * 1.1, x + r * 1.5, y - r * 0.1, x, y + r * 0.9);
  c.fill();
}
function drawDropShape(c, x, y, r) {
  c.beginPath();
  c.moveTo(x, y - r * 1.5);
  c.quadraticCurveTo(x + r * 1.2, y, x, y + r * 0.9);
  c.quadraticCurveTo(x - r * 1.2, y, x, y - r * 1.5);
  c.fill();
}
function drawFx() {
  var c = fxX;
  c.setTransform(DPR, 0, 0, DPR, 0, 0);
  c.clearRect(0, 0, W, H);
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i], k = p.life / p.max;
    if (p.t === 'b') {
      var a = k > 0.85 ? (1 - k) / 0.15 : Math.min(1, k * 6);
      var rr = p.r * (k > 0.85 ? 1 + (k - 0.85) * 3 : 1);
      drawBubbleShape(c, p.x, p.y, rr, a * 0.95, p.hue);
    } else if (p.t === 'd') {
      c.globalAlpha = Math.min(0.9, (1 - k) * 1.4);
      c.fillStyle = '#7cc9ff'; drawDropShape(c, p.x, p.y, p.r);
      c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(p.x - p.r * 0.3, p.y - p.r * 0.1, p.r * 0.28, 0, 6.2832); c.fill();
      c.globalAlpha = 1;
    } else if (p.t === 's') {
      c.globalAlpha = Math.sin(k * 3.1416);
      c.fillStyle = p.c; drawStarShape(c, p.x, p.y, p.r * (0.6 + 0.6 * Math.sin(k * 3.1416)));
      c.globalAlpha = 1;
    } else if (p.t === 'h') {
      c.globalAlpha = k > 0.7 ? (1 - k) / 0.3 : 1;
      c.fillStyle = p.c; drawHeartShape(c, p.x, p.y, p.r * (0.7 + 0.3 * Math.min(1, k * 5)));
      c.globalAlpha = 1;
    }
  }
}

/* ------------------------------------------------------------------ luciérnagas (fondo) */
function makeGlow() {
  var c = document.createElement('canvas'); c.width = c.height = 64;
  var x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,220,1)'); g.addColorStop(0.18, 'rgba(235,255,150,0.85)');
  g.addColorStop(0.5, 'rgba(190,240,100,0.25)'); g.addColorStop(1, 'rgba(180,230,90,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return c;
}
function initFireflies() {
  fireflies = [];
  var n = Math.round(clamp(W * H / 26000, 18, 34));
  for (var i = 0; i < n; i++) {
    fireflies.push({ x: R(0, W), y: R(0, H), ax: R(20, 90), ay: R(14, 60), sx: R(0.12, 0.4), sy: R(0.1, 0.35),
      px: R(0, 6.28), py: R(0, 6.28), pp: R(0, 6.28), ps: R(0.7, 1.8), s: R(10, 24), boost: 0 });
  }
}
function fireflyPos(f) { return { x: f.x + Math.sin(T * f.sx + f.px) * f.ax, y: f.y + Math.sin(T * f.sy + f.py) * f.ay }; }
function drawBg(dt) {
  bgX.clearRect(0, 0, W, H);
  for (var i = 0; i < fireflies.length; i++) {
    var f = fireflies[i], p = fireflyPos(f);
    if (f.boost > 0) f.boost = Math.max(0, f.boost - dt * 1.4);
    var a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(T * f.ps + f.pp));
    var s = f.s * (1 + f.boost * 2.2);
    bgX.globalAlpha = Math.min(1, a + f.boost);
    bgX.drawImage(glow, p.x - s, p.y - s, s * 2, s * 2);
  }
  bgX.globalAlpha = 1;
}
function tryFirefly(x, y) {
  for (var i = 0; i < fireflies.length; i++) {
    var f = fireflies[i], p = fireflyPos(f);
    if (dist(x, y, p.x, p.y) < 48) {
      f.boost = 1; sfxChime(i);
      for (var k = 0; k < 7; k++) spawnSpark(p.x, p.y, R(6, 12), '#f4ffb0', R(-80, 80), R(-80, 80));
      return true;
    }
  }
  return false;
}

/* ------------------------------------------------------------------ construcción de animalitos */
function buildAnimal(cfg, idx) {
  var a = { cfg: cfg, id: cfg.id, idx: idx, dirt: 1, messy: 1, soaped: false, foam: [], drops: [], mfoam: [],
    brushed: 0, mouthOpen: 0, done: false, tufts: [], mask: null, thumb: null, checkT: 0, giggleT: 0, loaded: 0,
    milestoneClean: false, milestoneHair: false, lastDirtOp: -1 };
  var el = document.createElement('div'); el.className = 'stage';
  var jw = document.createElement('div'); jw.className = 'jumpw';
  var bob = document.createElement('div'); bob.className = 'bob';
  a.imgC = new Image(); a.imgC.className = 'layer'; a.imgC.draggable = false;
  a.imgD = new Image(); a.imgD.className = 'layer'; a.imgD.draggable = false;
  var cv = document.createElement('canvas'); cv.className = 'layer'; cv.width = 640; cv.height = 960;
  a.cv = cv; a.ctx = cv.getContext('2d');
  function onl() { a.loaded++; if (a.loaded >= 2) { buildMask(a); imageLoaded(); } }
  a.imgC.onload = onl; a.imgD.onload = onl;
  a.imgC.onerror = onl; a.imgD.onerror = onl;
  a.imgC.src = 'images/' + cfg.id + '.png';
  a.imgD.src = 'images/' + cfg.id + '_sucio.png';
  bob.appendChild(a.imgC); bob.appendChild(a.imgD); bob.appendChild(cv);
  jw.appendChild(bob); el.appendChild(jw); stagesEl.appendChild(el);
  a.el = el; a.jw = jw;
  resetAnimal(a);
  return a;
}
function resetAnimal(a) {
  a.dirt = 1; a.messy = 1; a.soaped = false; a.foam = []; a.drops = []; a.mfoam = [];
  a.brushed = 0; a.done = false; a.milestoneClean = false; a.milestoneHair = false; a.lastDirtOp = -1;
  var cfg = a.cfg, h = cfg.head, n = 9;
  a.tufts = [];
  for (var i = 0; i < n; i++) {
    var u = i / (n - 1) - 0.5;                       // -0.5 .. 0.5
    a.tufts.push({ ox: u * h[2] + R(-12, 12), oy: R(-10, 14) + Math.abs(u) * 40,
      ang: u * 120 + R(-18, 18), len: R(70, 130), w: R(34, 52), bend: R(-0.35, 0.35), ph: R(0, 6.28),
      col: cfg.tuft[i % cfg.tuft.length] });
  }
  if (a.thumb) a.thumb.className = a.thumb.className.replace(' done', '');
  a.imgD.style.opacity = 1;
}
function buildMask(a) {
  try {
    var c = document.createElement('canvas'); c.width = 128; c.height = 192;
    var x = c.getContext('2d'); x.drawImage(a.imgC, 0, 0, 128, 192);
    var d = x.getImageData(0, 0, 128, 192).data, m = new Uint8Array(128 * 192);
    for (var i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 80 ? 1 : 0;
    a.mask = m;
  } catch (e) { a.mask = null; }
}
function onAnimal(a, lx, ly) {
  if (lx < 0 || ly < 0 || lx >= KW || ly >= KH) return false;
  if (!a.mask) return true;
  return a.mask[((ly / 8) | 0) * 128 + ((lx / 8) | 0)] === 1;
}

/* ------------------------------------------------------------------ dibujo dentro del animalito */
function rrect(c, x, y, w, h, r) {
  c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
}
function drawTufts(a, c) {
  var m = a.messy; if (m < 0.03) return;
  var e = m * m * (3 - 2 * m), h = a.cfg.head;
  for (var i = 0; i < a.tufts.length; i++) {
    var s = a.tufts[i];
    var len = s.len * e; if (len < 8) continue;
    var ang = (-90 + s.ang + Math.sin(T * 3 + s.ph) * 5 * m) * Math.PI / 180;
    var bx = h[0] + s.ox, by = h[1] + s.oy;
    var dx = Math.cos(ang), dy = Math.sin(ang), px = -dy, py = dx;
    var w = s.w * (0.5 + 0.5 * e);
    var tx = bx + dx * len + px * s.bend * len, ty = by + dy * len + py * s.bend * len;
    c.beginPath();
    c.moveTo(bx + px * w / 2, by + py * w / 2);
    c.quadraticCurveTo(bx + dx * len * 0.55 + px * (w * 0.55 + s.bend * len * 0.6), by + dy * len * 0.55 + py * (w * 0.55 + s.bend * len * 0.6), tx, ty);
    c.quadraticCurveTo(bx + dx * len * 0.5 - px * (w * 0.5 - s.bend * len * 0.6), by + dy * len * 0.5 - py * (w * 0.5 - s.bend * len * 0.6), bx - px * w / 2, by - py * w / 2);
    c.closePath();
    c.fillStyle = s.col; c.fill();
    c.lineWidth = 4; c.strokeStyle = 'rgba(70,40,20,0.28)'; c.stroke();
  }
}
function drawTears(a, c) {
  var tearA = clamp((a.dirt - 0.18) / 0.5, 0, 1) * (a.done ? 0 : 1);
  if (tearA <= 0.02) return;
  for (var i = 0; i < 2; i++) {
    var e = a.cfg.eyes[i], ph = ((T * 0.55 + i * 0.47) % 1);
    var x = e[0] + (i ? 6 : -6), y0 = e[1] + 70, y = y0 + ph * 120;
    c.globalAlpha = tearA * 0.55;
    c.strokeStyle = '#a9dcff'; c.lineWidth = 7; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, y0 - 6); c.lineTo(x, y); c.stroke();
    c.globalAlpha = tearA * (1 - ph * 0.7);
    c.fillStyle = '#8fd0ff'; drawDropShape(c, x, y + 6, 14 + (1 - ph) * 4);
    c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(x - 4, y + 6, 4, 0, 6.2832); c.fill();
  }
  c.globalAlpha = 1;
}
function drawMouth(a, c) {
  var o = a.mouthOpen; if (o < 0.02) return;
  var s = o * o * (3 - 2 * o), m = a.cfg.mouth;
  var x = m[0], y = m[1], w = m[2] * 1.25 * s, h = w * 0.66;
  c.save();
  c.beginPath();
  c.moveTo(x - w / 2, y - h * 0.2);
  c.quadraticCurveTo(x, y - h * 0.06, x + w / 2, y - h * 0.2);
  c.bezierCurveTo(x + w * 0.5, y + h * 0.95, x - w * 0.5, y + h * 0.95, x - w / 2, y - h * 0.2);
  c.closePath();
  c.fillStyle = '#8c2f45'; c.fill();
  c.save(); c.clip();
  c.fillStyle = '#ff8aa5'; c.beginPath(); c.ellipse(x, y + h * 0.72, w * 0.3, h * 0.24, 0, 0, 6.2832); c.fill();
  c.restore();
  // dientitos
  var b = clamp(a.brushed, 0, 1), r = Math.round(236 + 19 * b), g = Math.round(222 + 33 * b), bl = Math.round(160 + 95 * b);
  c.fillStyle = 'rgb(' + r + ',' + g + ',' + bl + ')';
  var n = 6, tw = w * 0.135, th = h * 0.36, sx = x - n * tw / 2;
  for (var i = 0; i < n; i++) {
    var ty = y - h * 0.2 + (i === 0 || i === n - 1 ? 3 : 0) + Math.abs(i - (n - 1) / 2) * 1.2;
    rrect(c, sx + i * tw + 1, ty, tw - 2, th, tw * 0.3); c.fill();
    c.lineWidth = 1.5; c.strokeStyle = 'rgba(120,60,70,0.35)'; c.stroke();
  }
  c.restore();
  c.beginPath();
  c.moveTo(x - w / 2, y - h * 0.2);
  c.quadraticCurveTo(x, y - h * 0.06, x + w / 2, y - h * 0.2);
  c.bezierCurveTo(x + w * 0.5, y + h * 0.95, x - w * 0.5, y + h * 0.95, x - w / 2, y - h * 0.2);
  c.lineWidth = 5; c.strokeStyle = '#6b2236'; c.lineJoin = 'round'; c.stroke();
  if (b > 0.7 && s > 0.8) {
    var tw2 = 0.5 + 0.5 * Math.sin(T * 6);
    c.fillStyle = 'rgba(255,255,255,' + (0.5 + 0.5 * tw2) + ')';
    drawStarShape(c, x + w * 0.26, y + h * 0.02, 12 + tw2 * 12);
    drawStarShape(c, x - w * 0.3, y + h * 0.12, 8 + (1 - tw2) * 9);
  }
}
function drawFoam(a, c) {
  var i, f;
  for (i = 0; i < a.foam.length; i++) {
    f = a.foam[i];
    var wob = 1 + Math.sin(T * 2.2 + f.ph) * 0.03;
    drawBubbleShape(c, f.x, f.y, f.r * wob * Math.min(1, f.grow), clamp(f.a, 0, 1) * 0.92, f.hue);
  }
  for (i = 0; i < a.mfoam.length; i++) {
    f = a.mfoam[i];
    drawBubbleShape(c, f.x, f.y, f.r, clamp(f.a, 0, 1) * 0.95, f.hue);
  }
}
function drawDrops(a, c) {
  for (var i = 0; i < a.drops.length; i++) {
    var d = a.drops[i];
    c.globalAlpha = clamp(d.a, 0, 1) * 0.85;
    c.fillStyle = 'rgba(130,205,255,0.8)'; c.beginPath(); c.ellipse(d.x, d.y, d.r * 0.85, d.r, 0, 0, 6.2832); c.fill();
    c.lineWidth = 2; c.strokeStyle = 'rgba(70,150,220,0.7)'; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.arc(d.x - d.r * 0.3, d.y - d.r * 0.35, d.r * 0.28, 0, 6.2832); c.fill();
  }
  c.globalAlpha = 1;
}
function drawStage(a) {
  var c = a.ctx;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 640, 960);
  c.setTransform(0.625, 0, 0, 0.625, 0, 0);
  drawTufts(a, c); drawTears(a, c); drawMouth(a, c); drawDrops(a, c); drawFoam(a, c);
}

/* ------------------------------------------------------------------ lógica de cada animalito */
function addFoam(a, lx, ly, rmin, rmax, kind) {
  var x = lx + R(-34, 34), y = ly + R(-34, 34);
  if (!onAnimal(a, x, y)) return false;
  if (a.foam.length >= 150) a.foam.shift();
  a.foam.push({ x: x, y: y, r: R(rmin, rmax), a: 1, hue: kind === 'sham' ? (Math.random() < 0.5 ? 1 : 2) : (Math.random() < 0.7 ? 0 : 2), ph: R(0, 6.28), grow: 0.2 });
  return true;
}
function updateAnimal(a, dt) {
  var i, f;
  for (i = 0; i < a.foam.length; i++) { f = a.foam[i]; if (f.grow < 1) f.grow = Math.min(1, f.grow + dt * 6); }
  for (i = a.drops.length - 1; i >= 0; i--) {
    var d = a.drops[i];
    if (d.slide) { d.y += d.slide * dt; d.slide *= 1.0 + dt * 0.4; }
    if (!onAnimal(a, d.x, d.y) || d.y > KH) { d.a -= dt * 3; if (d.a <= 0) a.drops.splice(i, 1); }
  }
  for (i = a.mfoam.length - 1; i >= 0; i--) {
    f = a.mfoam[i]; f.a -= dt * 0.7; f.y -= dt * 20; if (f.a <= 0) a.mfoam.splice(i, 1);
  }
  var target = (tool === 'brush' && a === cur) ? 1 : 0;
  a.mouthOpen += (target - a.mouthOpen) * Math.min(1, dt * 9);
  if (Math.abs(target - a.mouthOpen) < 0.01) a.mouthOpen = target;
  if (Math.abs(a.dirt - a.lastDirtOp) > 0.004) { a.lastDirtOp = a.dirt; a.imgD.style.opacity = a.dirt.toFixed(3); }
  if (!a.milestoneClean && a.dirt < 0.05) { a.milestoneClean = true; voice(a.id, true, 0.7); bounce(a, 'jump'); sparkleStage(a, 12); }
  if (!a.milestoneHair && a.messy < 0.04) { a.milestoneHair = true; sfxChime(3, 0.12); sparkleAt(a, a.cfg.head[0], a.cfg.head[1], 10); }
  a.checkT += dt;
  if (a.checkT > 0.3) {
    a.checkT = 0;
    if (!a.done && a.dirt < 0.04 && a.messy < 0.05 && a.foam.length === 0 && a.drops.length === 0 && a.brushed >= 0.75) celebrate(a);
  }
}
function bounce(a, cls) {
  var j = a.jw;
  j.className = 'jumpw'; void j.offsetWidth; j.className = 'jumpw ' + cls;
  clearTimeout(a.jt); a.jt = setTimeout(function () { j.className = 'jumpw'; }, cls === 'dance' ? 2100 : 600);
}
function sparkleAt(a, lx, ly, n) {
  for (var i = 0; i < n; i++) spawnSpark(toScreenX(lx + R(-90, 90)), toScreenY(ly + R(-90, 90)), R(8, 16), Math.random() < 0.5 ? '#fff6b0' : '#ffd1ec');
}
function sparkleStage(a, n) {
  for (var i = 0; i < n; i++) {
    var lx = R(180, 840), ly = R(250, 1300);
    if (onAnimal(a, lx, ly)) spawnSpark(toScreenX(lx), toScreenY(ly), R(9, 18), Math.random() < 0.5 ? '#fff6b0' : '#c9f0ff');
  }
}
function celebrate(a) {
  a.done = true;
  if (a.thumb) a.thumb.className += ' done';
  sfxCelebrate(); bounce(a, 'dance');
  setTimeout(function () { voice(a.id, true, 1); }, 700);
  for (var i = 0; i < 26; i++) {
    (function (i) { setTimeout(function () {
      var x = stageRect.left + R(0.1, 0.9) * stageRect.w, y = stageRect.top + R(0.55, 0.95) * stageRect.h;
      spawnHeart(x, y, R(10, 20), ['#ff8fb8', '#ffb3d1', '#ff6f9f', '#ffd1e6'][i % 4]);
      spawnSpark(x + R(-30, 30), y + R(-60, 0), R(10, 18), ['#fff6b0', '#c9f0ff', '#ffd1ec'][i % 3]);
    }, i * 70); })(i);
  }
}

/* ------------------------------------------------------------------ interacción con las herramientas */
var ptr = { down: false, x: 0, y: 0, lx: 0, ly: 0, inStage: false, acc: 0, lastSnd: 0, giggle: 0 };
function updatePtr(x, y) {
  ptr.x = x; ptr.y = y;
  ptr.lx = (x - stageRect.left) / stageRect.w * KW;
  ptr.ly = (y - stageRect.top) / stageRect.h * KH;
  ptr.inStage = cur && onAnimal(cur, ptr.lx, ptr.ly);
}
function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

function useStart(x, y) {
  var a = cur; ptr.acc = 0; ptr.giggle = 0;
  if (!tool) {
    if (!ptr.inStage && tryFirefly(x, y)) return;
    var inRect = x > stageRect.left && x < stageRect.left + stageRect.w && y > stageRect.top && y < stageRect.top + stageRect.h;
    if (ptr.inStage || inRect) { voice(a.id, a.dirt < 0.35 && a.messy < 0.6); bounce(a, 'jump'); sparkleAt(a, ptr.lx, ptr.ly, 3); }
    return;
  }
  if (tool === 'soap' || tool === 'shampoo') {
    var small = tool === 'shampoo', k;
    for (k = 0; k < 5; k++) { if (ptr.inStage) addFoam(a, ptr.lx, ptr.ly, small ? 10 : 22, small ? 22 : 46, small ? 'sham' : 'soap'); }
    for (k = 0; k < 3; k++) spawnBubble(x + R(-20, 20), y + R(-20, 10), small ? R(6, 12) : R(11, 22));
    if (ptr.inStage) soapEffect(a);
    sfxPop(small); sfxPop(small);
    noiseBurst({ f: 2500, dur: 0.12, vol: 0.05, type: 'highpass' });
  } else if (tool === 'hose') {
    startWater();
  } else if (tool === 'comb') {
    noiseBurst({ f: 4000, dur: 0.03, vol: 0.12, type: 'highpass' });
  } else if (tool === 'towel') {
    noiseBurst({ f: 700, q: 0.8, dur: 0.18, vol: 0.14, fEnd: 400 });
  } else if (tool === 'brush') {
    noiseBurst({ f: 3200, q: 1.5, dur: 0.07, vol: 0.08 });
  }
}
function soapEffect(a) {
  a.soaped = true;
  if (a.dirt > 0.5) a.dirt = Math.max(0.5, a.dirt - 0.03);
}
function useMove(x, y, d) {
  var a = cur, t = now(), k;
  if (!tool) return;
  ptr.acc += d;
  if (tool === 'soap' || tool === 'shampoo') {
    var small = tool === 'shampoo', step = small ? 12 : 17, guard = 0;
    while (ptr.acc >= step && guard++ < 4) {
      ptr.acc -= step;
      if (ptr.inStage) { addFoam(a, ptr.lx, ptr.ly, small ? 10 : 22, small ? 22 : 46, small ? 'sham' : 'soap'); soapEffect(a); }
      if (Math.random() < 0.45) spawnBubble(x + R(-18, 18), y + R(-18, 8), small ? R(5, 11) : R(10, 22));
      if (small && Math.random() < 0.4) spawnSpark(x + R(-30, 30), y + R(-30, 30), R(5, 9), '#ffd1ec');
    }
    if (t - ptr.lastSnd > (small ? 70 : 100)) { ptr.lastSnd = t; sfxPop(small); if (!small && Math.random() < 0.4) noiseBurst({ f: 2200, q: 2, dur: 0.1, vol: 0.04, fEnd: 3200 }); }
  } else if (tool === 'comb') {
    var cs = 26, g2 = 0;
    while (ptr.acc >= cs && g2++ < 3) {
      ptr.acc -= cs;
      noiseBurst({ f: R(3500, 5200), dur: 0.025, vol: 0.1, type: 'highpass' });
      if (ptr.inStage) { a.messy = Math.max(0, a.messy - 0.055); if (Math.random() < 0.5) spawnSpark(x + R(-15, 15), y + R(-15, 15), R(6, 11), '#ffe9a8'); }
    }
  } else if (tool === 'towel') {
    if (ptr.acc >= 16) {
      ptr.acc = 0;
      if (t - ptr.lastSnd > 110) { ptr.lastSnd = t; noiseBurst({ f: R(600, 900), q: 0.7, dur: 0.16, vol: 0.12, fEnd: 450 }); }
      var removed = 0, i;
      for (i = a.drops.length - 1; i >= 0; i--) if (dist(a.drops[i].x, a.drops[i].y, ptr.lx, ptr.ly) < 120) { a.drops.splice(i, 1); removed++; }
      for (i = a.foam.length - 1; i >= 0; i--) if (dist(a.foam[i].x, a.foam[i].y, ptr.lx, ptr.ly) < 120) { a.foam[i].a -= 0.6; if (a.foam[i].a <= 0) { a.foam.splice(i, 1); removed++; } }
      if (removed > 0 || Math.random() < 0.3) spawnSpark(x + R(-30, 30), y + R(-30, 30), R(7, 13), '#d9f3ff');
    }
  } else if (tool === 'brush') {
    var m = a.cfg.mouth;
    if (dist(ptr.lx, ptr.ly, m[0], m[1]) < m[2] * 0.9 + 40) {
      if (ptr.acc >= 9) {
        ptr.acc = 0;
        a.brushed = Math.min(1, a.brushed + 0.022);
        if (a.mfoam.length < 22) a.mfoam.push({ x: m[0] + R(-m[2] * 0.5, m[2] * 0.5), y: m[1] + R(-10, 40), r: R(7, 14), a: 1, hue: (Math.random() * 3) | 0 });
        if (t - ptr.lastSnd > 90) { ptr.lastSnd = t; noiseBurst({ f: R(2800, 4200), q: 2, dur: 0.08, vol: 0.09 }); }
        if (a.brushed > 0.5 && Math.random() < 0.25) { spawnSpark(toScreenX(m[0] + R(-45, 45)), toScreenY(m[1] + R(-5, 40)), R(7, 13), '#ffffff'); note({ f: [[0, R(1800, 2600)], [0.1, R(2600, 3200)]], dur: 0.12, vol: 0.05 }); }
      }
    }
  }
  // risitas de vez en cuando mientras juegan
  ptr.giggle += d;
  if (ptr.giggle > 900 && ptr.inStage) { ptr.giggle = 0; sfxGiggle(a.id); bounce(a, 'jump'); }
}
function hoseUpdate(dt) {
  if (tool !== 'hose' || !ptr.down) return;
  var a = cur, i, n = 4;
  for (i = 0; i < n; i++) spawnDrop(ptr.x + R(-8, 8), ptr.y + R(-4, 4), R(-90, 90), R(160, 380), R(3, 6.5));
  if (Math.random() < 0.5 && T - lastPopSound > 0.08) { lastPopSound = T; note({ f: [[0, R(1400, 2400)], [0.05, R(2200, 3200)]], dur: 0.05, vol: 0.04 }); }
  if (ptr.inStage) {
    if (Math.random() < 0.6 && a.drops.length < 70) {
      var x = ptr.lx + R(-60, 60), y = ptr.ly + R(-30, 70);
      if (onAnimal(a, x, y)) a.drops.push({ x: x, y: y, r: R(7, 14), a: 1, slide: Math.random() < 0.5 ? R(4, 14) : 0 });
    }
    for (i = a.foam.length - 1; i >= 0; i--) {
      var f = a.foam[i];
      if (dist(f.x, f.y, ptr.lx, ptr.ly) < 150) { f.a -= dt * 2.2; if (f.a <= 0) a.foam.splice(i, 1); }
    }
    if (a.soaped) a.dirt = Math.max(0, a.dirt - dt * 0.32);
    else a.dirt = Math.max(0.7, a.dirt - dt * 0.12);
    a.messy = Math.max(a.messy > 0.5 ? 0.5 : a.messy, a.messy - dt * 0.05);
  }
}

/* ------------------------------------------------------------------ cursor-herramienta (sigue al dedo) */
function showCursor() { if (tool) { cursorEl.style.display = 'block'; moveCursor(); } }
function moveCursor() { cursorEl.style.webkitTransform = cursorEl.style.transform = 'translate3d(' + (ptr.x - 14) + 'px,' + (ptr.y - 84) + 'px,0)'; }
function hideCursor() { cursorEl.style.display = 'none'; }

/* ------------------------------------------------------------------ eventos táctiles */
var activeId = null;
function touchOf(e, id) {
  var l = e.changedTouches;
  for (var i = 0; i < l.length; i++) if (id === null || l[i].identifier === id) return l[i];
  return null;
}
function pDown(x, y) { ptr.down = true; updatePtr(x, y); showCursor(); useStart(x, y); }
function pMove(x, y) {
  var d = dist(x, y, ptr.x, ptr.y); updatePtr(x, y); if (ptr.down) { moveCursor(); if (d > 0) useMove(x, y, d); }
}
function pUp() { ptr.down = false; hideCursor(); stopWater(); }
var playEl = $('play');
playEl.addEventListener('touchstart', function (e) {
  e.preventDefault(); stopHint();
  if (activeId !== null) return;
  var t = e.changedTouches[0]; activeId = t.identifier; pDown(t.clientX, t.clientY);
}, false);
playEl.addEventListener('touchmove', function (e) {
  e.preventDefault(); if (activeId === null) return;
  var t = touchOf(e, activeId); if (t) pMove(t.clientX, t.clientY);
}, false);
function tEnd(e) {
  e.preventDefault(); unlockAudio(); if (activeId === null) return;
  var t = touchOf(e, activeId); if (t) { activeId = null; pUp(); }
}
playEl.addEventListener('touchend', tEnd, false);
playEl.addEventListener('touchcancel', tEnd, false);
var mouseDown = false;
playEl.addEventListener('mousedown', function (e) { unlockAudio(); stopHint(); mouseDown = true; pDown(e.clientX, e.clientY); });
window.addEventListener('mousemove', function (e) { if (mouseDown) pMove(e.clientX, e.clientY); });
window.addEventListener('mouseup', function () { if (mouseDown) { mouseDown = false; pUp(); } });
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

function bindTap(el, fn) {
  var moved = false;
  el.addEventListener('touchstart', function (e) { e.preventDefault(); stopHint(); el.className += ' press'; }, false);
  el.addEventListener('touchend', function (e) { e.preventDefault(); el.className = el.className.replace(' press', ''); unlockAudio(); fn(); }, false);
  el.addEventListener('touchcancel', function () { el.className = el.className.replace(' press', ''); }, false);
  el.addEventListener('click', function () { unlockAudio(); fn(); });
}
function stopHint() { if (hinting) { hinting = false; document.body.className = document.body.className.replace('hint', ''); } }

/* botones que hay que mantener presionados (papá/mamá) */
function bindHold(el, ms, fn) {
  var timer = null;
  function start(e) { if (e.cancelable) e.preventDefault(); unlockAudio(); el.className += ' holding'; clearTimeout(timer); timer = setTimeout(function () { el.className = el.className.replace(' holding', ''); fn(); }, ms); }
  function stop() { el.className = el.className.replace(' holding', ''); clearTimeout(timer); }
  el.addEventListener('touchstart', start, false); el.addEventListener('touchend', stop, false); el.addEventListener('touchcancel', stop, false);
  el.addEventListener('mousedown', start); el.addEventListener('mouseup', stop); el.addEventListener('mouseleave', stop);
}

/* ------------------------------------------------------------------ interfaz: herramientas, miniaturas, flechas */
var ANIMALS_STATE = [];
var toolEls = {};
function buildUI() {
  TOOLS.forEach(function (td) {
    var b = document.createElement('div'); b.className = 'tool'; b.innerHTML = ICONS[td.id];
    toolsEl.appendChild(b); toolEls[td.id] = b;
    bindTap(b, function () { selectTool(td); });
  });
  ANIMALS_STATE.forEach(function (a, i) {
    var th = document.createElement('div'); th.className = 'thumb';
    th.style.backgroundImage = 'url(images/' + a.id + '.png)';
    th.innerHTML = '<div class="star">' + STAR_SVG + '</div>';
    thumbsEl.appendChild(th); a.thumb = th;
    bindTap(th, function () { showAnimal(i, true); });
  });
  bindTap($('prev'), function () { showAnimal((curIndex + ANIMALS_STATE.length - 1) % ANIMALS_STATE.length, true); });
  bindTap($('next'), function () { showAnimal((curIndex + 1) % ANIMALS_STATE.length, true); });
}
function selectTool(td) {
  var id = td.id;
  if (tool === id) { tool = null; } else { tool = id; }
  for (var k in toolEls) { toolEls[k].className = 'tool' + (k === tool ? ' sel' : ''); }
  if (tool) { cursorEl.innerHTML = ICONS[tool]; sfxSelect(td.pitch); }
  else { sfxSelect(440); }
  hideCursor();
}
function showAnimal(i, sound) {
  for (var k = 0; k < ANIMALS_STATE.length; k++) {
    var a = ANIMALS_STATE[k];
    a.el.className = 'stage' + (k === i ? ' show' : '');
    a.thumb.className = 'thumb' + (k === i ? ' sel' : '') + (a.done ? ' done' : '');
  }
  curIndex = i; cur = ANIMALS_STATE[i];
  stopWater();
  var el = cur.el; el.className = 'stage show'; void el.offsetWidth; el.className = 'stage show enter';
  cur.thumb.className = 'thumb sel' + (cur.done ? ' done' : '');
  if (sound) { noiseBurst({ f: 500, fEnd: 1500, q: 0.8, dur: 0.18, vol: 0.06 }); setTimeout(function () { voice(cur.id, cur.dirt < 0.35 && cur.messy < 0.6, 0.9); }, 120); }
  layoutStage();
}
function resetAll() {
  ANIMALS_STATE.forEach(resetAnimal);
  sfxChime(0, 0.1); sfxChime(2, 0.1);
  var th = ANIMALS_STATE.map(function (a) { return a.thumb; }); th.forEach(function (t) { t.className = t.className.replace(' done', ''); });
}
bindHold($('muteBtn'), 900, function () {
  muted = !muted;
  if (master) master.gain.value = muted ? 0 : 0.7;
  $('waves').style.display = muted ? 'none' : ''; $('mutex').style.display = muted ? '' : 'none';
  if (muted) stopWater(); else sfxChime(1, 0.1);
});
bindHold($('resetBtn'), 900, resetAll);

/* ------------------------------------------------------------------ tamaño y posición */
function layout() {
  W = window.innerWidth; H = window.innerHeight;
  DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  bgCv.width = W; bgCv.height = H; bgCv.style.width = W + 'px'; bgCv.style.height = H + 'px';
  fxCv.width = Math.round(W * DPR); fxCv.height = Math.round(H * DPR); fxCv.style.width = W + 'px'; fxCv.style.height = H + 'px';
  if (!glow) glow = makeGlow();
  initFireflies();
  var ts = Math.round(clamp(Math.min(104, (H - 70) / 6 - 12), 52, 104));
  toolsEl.style.left = Math.max(8, Math.round(W * 0.012)) + 'px';
  for (var k in toolEls) { toolEls[k].style.width = toolEls[k].style.height = ts + 'px'; }
  var thumb = Math.round(clamp(H * 0.075, 44, 70));
  var thumbs = thumbsEl.children;
  for (var i = 0; i < thumbs.length; i++) thumbs[i].style.width = thumbs[i].style.height = thumb + 'px';
  var toolW = ts + Math.max(8, Math.round(W * 0.012)) + 14;
  var arrow = Math.round(clamp(Math.min(W, H) * 0.09, 50, 84));
  var thumbsTop = H - thumb - 16;
  thumbsEl.style.top = thumbsTop + 'px'; thumbsEl.style.left = toolW + 'px'; thumbsEl.style.width = (W - toolW) + 'px';
  var availH = thumbsTop - 20 - 10;
  var availW = W - toolW - 2 * (arrow + 16) - 8;
  var sh = Math.min(availH, availW * 1.5), sw = sh / 1.5;
  stageRect.w = sw; stageRect.h = sh;
  stageRect.left = toolW + (W - toolW - sw) / 2;
  stageRect.top = 10 + (availH - sh) / 2 + 10;
  var ay = stageRect.top + sh * 0.5 - arrow / 2;
  var pv = $('prev'), nx = $('next');
  pv.style.width = pv.style.height = nx.style.width = nx.style.height = arrow + 'px';
  pv.style.top = nx.style.top = ay + 'px';
  pv.style.left = Math.max(toolW + 4, stageRect.left - arrow - 14) + 'px';
  nx.style.left = Math.min(W - arrow - 6, stageRect.left + sw + 14) + 'px';
  layoutStage();
}
function layoutStage() {
  for (var i = 0; i < ANIMALS_STATE.length; i++) {
    var s = ANIMALS_STATE[i].el.style;
    s.left = stageRect.left + 'px'; s.top = stageRect.top + 'px'; s.width = stageRect.w + 'px'; s.height = stageRect.h + 'px';
  }
  var hs = Math.max(stageRect.w, stageRect.h) * 1.15;
  haloEl.style.width = haloEl.style.height = hs + 'px';
  haloEl.style.left = (stageRect.left + stageRect.w / 2 - hs / 2) + 'px';
  haloEl.style.top = (stageRect.top + stageRect.h * 0.52 - hs / 2) + 'px';
}

/* ------------------------------------------------------------------ bucle principal */
function frame(ts) {
  var dt = Math.min(0.05, ((ts || 0) - last) / 1000); last = ts || 0; if (dt < 0) dt = 0.016;
  T += dt;
  drawBg(dt);
  hoseUpdate(dt);
  updateParticles(dt);
  drawFx();
  if (cur) { updateAnimal(cur, dt); drawStage(cur); }
  window.requestAnimationFrame(frame);
}

/* ------------------------------------------------------------------ arranque */
var loadedCount = 0, started = false;
function imageLoaded() {
  loadedCount++;
  if (loadedCount >= ANIMALS.length) hideLoading();
}
function hideLoading() {
  if (started) return; started = true;
  var l = $('loading'); l.className = 'gone';
  setTimeout(function () { l.style.display = 'none'; }, 700);
}
ANIMALS.forEach(function (cfg, i) { ANIMALS_STATE.push(buildAnimal(cfg, i)); });
document.body.className = 'hint';
buildUI();
layout();
showAnimal(0, false);
window.addEventListener('resize', layout);
window.addEventListener('orientationchange', function () { setTimeout(layout, 250); });
setTimeout(hideLoading, 6000);     // por si alguna imagen tarda demasiado
window.requestAnimationFrame(frame);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
}
})();
