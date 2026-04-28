'use strict';

/* ═══════════════════════════════════
   V-PHOTOBOOTH — COMMON.JS
   State, utilities, color math,
   render helpers, confetti
   ═══════════════════════════════════ */

/* ── STATE ── */
const DEFAULT_STATE = {
    layout: 'strip',
    spLayout: 'grid',
    color: '#ffffff',
    isGrad: false,
    gradCSS: '',
    filter: 'none',
    ratio: '4:3',
    photos: [],
    mirrored: true,
    timerSec: 3,
    shooting: false,
    advR: 255, advG: 255, advB: 255,
    gStops: [{ hex: 'ff477e' }, { hex: 'ff1f61' }],
    gAngle: 135,
    spTitle: 'Cruel Summer',
    spArtist: 'Taylor Swift',
    spDur: 207,
    spProg: 38
};

let S = { ...DEFAULT_STATE };

const STORAGE_KEY = 'vphotobooth_state';

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            S = { ...DEFAULT_STATE, ...parsed };
        }
    } catch (e) {
        S = { ...DEFAULT_STATE };
    }
}

function clearPhotos() {
    S.photos = [];
    S.shooting = false;
    saveState();
}

function resetState() {
    S = { ...DEFAULT_STATE };
    saveState();
}

/* ── DOM UTIL ── */
const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ── TIME ── */
function secToMMSS(s) {
    const m = Math.floor(s / 60);
    return m + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
}

/* ── COLOR MATH ── */
function h2r(hex) {
    const h = hex.replace('#', '');
    if (h.length !== 6) return null;
    return [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16)
    ];
}

function r2h(r, g, b) {
    return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

function isDark(hex) {
    const r = h2r(hex);
    if (!r) return false;
    return (0.299 * r[0] + 0.587 * r[1] + 0.114 * r[2]) / 255 < 0.45;
}

function contrast(hex, isGrad) {
    if (isGrad) return 'rgba(255,255,255,.88)';
    return isDark(hex) ? 'rgba(255,255,255,.88)' : 'rgba(0,0,0,.72)';
}

function r2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h, s, l = (mx + mn) / 2;
    if (mx === mn) { h = s = 0; }
    else {
        const d = mx - mn;
        s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
        switch (mx) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            default: h = ((r - g) / d + 4) / 6;
        }
    }
    return [h * 360, s * 100, l * 100];
}

function hsl2r(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
    const q = l < .5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < .5) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    return [
        Math.round(hue(p, q, h + 1 / 3) * 255),
        Math.round(hue(p, q, h) * 255),
        Math.round(hue(p, q, h - 1 / 3) * 255)
    ];
}

/* ── RENDER HELPERS ── */
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function mkGrad(ctx, css, w, h) {
    try {
        const m = css.match(/linear-gradient\(([^,]+),(.+)\)$/s);
        if (!m) return null;
        let angle = 135;
        const ad = m[1].trim();
        if (ad.includes('deg')) angle = parseFloat(ad);
        const stops = m[2].split(',').map(s => s.trim()).filter(Boolean);
        const a = angle * Math.PI / 180;
        const x1 = w / 2 - Math.cos(a) * w * .75;
        const y1 = h / 2 - Math.sin(a) * h * .75;
        const x2 = w / 2 + Math.cos(a) * w * .75;
        const y2 = h / 2 + Math.sin(a) * h * .75;
        const g = ctx.createLinearGradient(x1, y1, x2, y2);
        stops.forEach((s, i) => { try { g.addColorStop(i / Math.max(stops.length - 1, 1), s); } catch (e) { } });
        return g;
    } catch (e) { return null; }
}

function clipText(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    let t = text;
    while (ctx.measureText(t + '…').width > maxW && t.length > 0) t = t.slice(0, -1);
    return t + '…';
}

/* ── SPOTIFY VECTOR ICONS ── */
function drawSpIcon(ctx, icon, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    if (icon === 'pause') {
        const w = size * 0.14;
        const h = size * 0.45;
        const gap = size * 0.1;
        ctx.rect(-gap - w, -h, w, h * 2);
        ctx.rect(gap, -h, w, h * 2);
        ctx.fill();
    } else if (icon === 'prev') {
        const tw = size * 0.35;
        const th = size * 0.4;
        const bw = size * 0.12;
        ctx.rect(-tw - bw, -th, bw, th * 2);
        ctx.moveTo(-tw, 0); ctx.lineTo(tw, -th); ctx.lineTo(tw, th);
        ctx.fill();
    } else if (icon === 'next') {
        const tw = size * 0.35;
        const th = size * 0.4;
        const bw = size * 0.12;
        ctx.rect(tw, -th, bw, th * 2);
        ctx.moveTo(tw, 0); ctx.lineTo(-tw, -th); ctx.lineTo(-tw, th);
        ctx.fill();
    } else if (icon === 'shuffle') {
        const w = size * 0.4;
        const h = size * 0.2;
        const aw = size * 0.15;
        ctx.moveTo(-w, -h); ctx.bezierCurveTo(-w * 0.5, -h, w * 0.5, h, w, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w - aw, h - aw); ctx.lineTo(w, h); ctx.lineTo(w - aw, h + aw); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-w, h); ctx.bezierCurveTo(-w * 0.5, h, w * 0.5, -h, w, -h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w - aw, -h - aw); ctx.lineTo(w, -h); ctx.lineTo(w - aw, -h + aw); ctx.stroke();
    } else if (icon === 'repeat') {
        const w = size * 0.35;
        const h = size * 0.2;
        const aw = size * 0.12;
        ctx.moveTo(-w, -h); ctx.lineTo(w, -h); ctx.lineTo(w, h * 0.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w - aw, -h - aw); ctx.lineTo(w + aw, -h); ctx.lineTo(w - aw, -h + aw); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w, h); ctx.lineTo(-w, h); ctx.lineTo(-w, -h * 0.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-w + aw, h - aw); ctx.lineTo(-w - aw, h); ctx.lineTo(-w + aw, h + aw); ctx.stroke();
    } else if (icon === 'heart') {
        const w = size * 0.35;
        ctx.translate(0, -size * 0.05);
        ctx.moveTo(0, w);
        ctx.bezierCurveTo(-w * 1.5, w * 0.1, -w * 1.5, -w, 0, -w * 0.5);
        ctx.bezierCurveTo(w * 1.5, -w, w * 1.5, w * 0.1, 0, w);
        ctx.fill();
    }
    ctx.restore();
}

function drawSpotifyLogo(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#1DB954';
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = size * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, size * 0.15, size * 0.35, -Math.PI * 0.8, -Math.PI * 0.2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, size * 0.05, size * 0.25, -Math.PI * 0.8, -Math.PI * 0.2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size * 0.05, size * 0.15, -Math.PI * 0.75, -Math.PI * 0.25); ctx.stroke();
    ctx.restore();
}

/* ── CONFETTI & DOWNLOAD ── */
function confettiTime() {
    const colors = ['#ff477e', '#ff9abc', '#ffffff', '#ffd1dc', '#ff1f61', '#ffb3cb'];
    const cfg = { colors, shapes: ['circle', 'square'] };
    setTimeout(() => confetti({ ...cfg, particleCount: 88, spread: 74, origin: { y: .55 }, scalar: 1.1 }), 250);
    setTimeout(() => {
        confetti({ ...cfg, particleCount: 44, angle: 60, spread: 54, origin: { x: 0, y: .6 } });
        confetti({ ...cfg, particleCount: 44, angle: 120, spread: 54, origin: { x: 1, y: .6 } });
    }, 500);
    setTimeout(() => confetti({ ...cfg, particleCount: 38, spread: 98, origin: { y: .34 }, gravity: .5, scalar: .8 }), 900);
}

function dlImg() {
    const canvas = $('cf');
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'v-photobooth-' + Date.now() + '.jpg';
    a.href = canvas.toDataURL('image/jpeg', .95);
    a.click();
}

/* ── FILTERS ── */
const FCSS = {
    none: 'none',
    vintage: 'sepia(.6) contrast(1.2) saturate(.8)',
    bnw: 'grayscale(1)',
    sharpen: 'contrast(1.3) saturate(1.4) brightness(1.1)'
};
const FNAMES = {
    none: 'NATURAL',
    vintage: 'VINTAGE',
    bnw: 'B & W',
    sharpen: 'VIVID GLOW'
};

/* ── INIT ── */
loadState();
