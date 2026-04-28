'use strict';

/* ═══════════════════════════════════
   STEP 5 — RENDER & RESULT
   ═══════════════════════════════════ */

function initStep5() {
    loadState();
    if (!S.photos || S.photos.length < 4) {
        // Not enough photos, redirect back to camera
        location.href = 'camera.html';
        return;
    }
    const [rW, rH] = S.ratio.split(':').map(Number);
    const pw = 800;
    const ph = Math.round(pw * rH / rW);
    renderFinal(pw, ph);
}

/* ── RENDER DISPATCH ── */
function renderFinal(pw, ph) {
    if (S.layout === 'spotify') {
        renderSpotify(pw, ph);
    } else {
        renderClassic(pw, ph);
    }
}

/* ── CLASSIC RENDER ── */
function renderClassic(pw, ph) {
    const canvas = $('cf');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pad = 50, bot = 240;
    if (S.layout === 'strip') {
        canvas.width = pw + pad * 2;
        canvas.height = ph * 4 + pad * 5 + bot;
    } else {
        canvas.width = pw * 2 + pad * 3;
        canvas.height = ph * 2 + pad * 3 + bot;
    }

    if (S.isGrad) {
        ctx.fillStyle = mkGrad(ctx, S.gradCSS, canvas.width, canvas.height) || '#fff';
    } else {
        ctx.fillStyle = S.color;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let done = 0;
    S.photos.forEach((src, i) => {
        const img = new Image();
        img.src = src;
        let x, y;
        if (S.layout === 'strip') { x = pad; y = pad + i * (ph + pad); }
        else { x = pad + (i % 2) * (pw + pad); y = pad + Math.floor(i / 2) * (ph + pad); }
        img.onload = () => {
            rrect(ctx, x, y, pw, ph, 15);
            ctx.save();
            ctx.clip();
            ctx.drawImage(img, x, y, pw, ph);
            ctx.restore();
            done++;
            if (done === 4) watermarkClassic(canvas, ctx);
        };
        img.onerror = () => { done++; if (done === 4) watermarkClassic(canvas, ctx); };
    });
}

function watermarkClassic(canvas, ctx) {
    const now = new Date();
    const cw = canvas.width, ch = canvas.height;
    const tc = contrast(S.color, S.isGrad);
    const ac = (isDark(S.color) || S.isGrad) ? '#ff7aaa' : '#c4224f';

    ctx.textAlign = 'center';
    const lw = cw * .22;

    ctx.save();
    ctx.strokeStyle = ac;
    ctx.globalAlpha = .26;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cw / 2 - lw, ch - 188);
    ctx.lineTo(cw / 2 + lw, ch - 188);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.font = `italic bold ${Math.round(cw * .073)}px 'Playfair Display',serif`;
    ctx.fillStyle = ac;
    ctx.fillText('V-Photobooth', cw / 2, ch - 124);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = ac;
    ctx.globalAlpha = .16;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cw / 2 - lw, ch - 99);
    ctx.lineTo(cw / 2 + lw, ch - 99);
    ctx.stroke();
    ctx.restore();

    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(':', '.');

    ctx.save();
    ctx.font = `600 ${Math.round(cw * .023)}px 'Space Mono',monospace`;
    ctx.fillStyle = tc;
    ctx.globalAlpha = .6;
    ctx.fillText(`${day} ${month} ${year}  •  ${time}  •  BY DENJI`, cw / 2, ch - 59);
    ctx.restore();

    showResult(canvas);
}

/* ── SPOTIFY RENDER ── */
function renderSpotify(pw, ph) {
    const canvas = $('cf');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cw = 1200;
    let cellW, cellH, gridH;

    if (S.spLayout === 'strip') {
        cellW = cw;
        cellH = Math.round(cw * (ph / pw));
        gridH = cellH * 4;
    } else {
        cellW = cw / 2;
        cellH = Math.round(cellW * (ph / pw));
        gridH = cellH * 2;
    }

    const playerH = 500;
    const ch = gridH + playerH;
    canvas.width = cw;
    canvas.height = ch;

    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, cw, ch);

    let done = 0;
    S.photos.forEach((src, i) => {
        const img = new Image();
        img.src = src;
        let gx, gy;
        if (S.spLayout === 'strip') {
            gx = 0;
            gy = i * cellH;
        } else {
            gx = (i % 2) * cellW;
            gy = Math.floor(i / 2) * cellH;
        }
        img.onload = () => {
            ctx.drawImage(img, gx, gy, cellW, cellH);
            done++;
            if (done === 4) drawSpotifyPlayer(canvas, ctx, cw, gridH, playerH);
        };
        img.onerror = () => { done++; if (done === 4) drawSpotifyPlayer(canvas, ctx, cw, gridH, playerH); };
    });
}

function drawSpotifyPlayer(canvas, ctx, cw, gridH, playerH) {
    // Gradient transition overlay
    const grad = ctx.createLinearGradient(0, gridH - 180, 0, gridH);
    grad.addColorStop(0, 'rgba(18,18,18,0)');
    grad.addColorStop(1, 'rgba(18,18,18,0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, gridH - 180, cw, 180);

    const padX = 80;
    const startY = gridH;

    // Song title
    ctx.font = `bold 54px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(clipText(ctx, S.spTitle, cw - padX * 2 - 80), padX, startY + 50);

    // Heart icon
    drawSpIcon(ctx, 'heart', cw - padX - 15, startY + 75, 48, '#1DB954');

    // Artist
    ctx.font = `500 36px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'left';
    ctx.fillText(clipText(ctx, S.spArtist, cw - padX * 2), padX, startY + 115);

    // Progress bar
    const barY = startY + 210;
    const barW = cw - padX * 2;
    const barH = 10;
    const prog = S.spProg / 100;

    roundRect(ctx, padX, barY, barW, barH, barH / 2);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fill();

    roundRect(ctx, padX, barY, barW * prog, barH, barH / 2);
    ctx.fillStyle = '#1DB954';
    ctx.fill();

    // Progress dot
    ctx.beginPath();
    ctx.arc(padX + barW * prog, barY + barH / 2, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Time labels
    const timeY = barY + 35;
    ctx.font = `28px 'Space Mono', monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(secToMMSS(Math.round(S.spDur * prog)), padX, timeY);
    ctx.textAlign = 'right';
    ctx.fillText(secToMMSS(S.spDur), cw - padX, timeY);

    // Controls
    const ctrlY = startY + 340;
    const cx = cw / 2;

    drawSpIcon(ctx, 'shuffle', cx - 220, ctrlY, 40, 'rgba(255,255,255,0.5)');
    drawSpIcon(ctx, 'prev', cx - 110, ctrlY, 40, '#ffffff');

    ctx.beginPath();
    ctx.arc(cx, ctrlY, 52, 0, Math.PI * 2);
    ctx.fillStyle = '#1DB954';
    ctx.fill();
    drawSpIcon(ctx, 'pause', cx, ctrlY, 36, '#121212');

    drawSpIcon(ctx, 'next', cx + 110, ctrlY, 40, '#ffffff');
    drawSpIcon(ctx, 'repeat', cx + 220, ctrlY, 40, 'rgba(255,255,255,0.5)');

    // Footer
    const footY = canvas.height - 45;
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} ${now.getFullYear()}`;
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(':', '.');

    ctx.font = `bold 22px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(29,185,84,0.7)';
    ctx.textBaseline = 'middle';

    const footText = `SPOTIFY  •  ${dateStr}  ${timeStr}`;
    const tw = ctx.measureText(footText).width;

    drawSpotifyLogo(ctx, cx - tw / 2 - 20, footY, 32);
    ctx.textAlign = 'left';
    ctx.fillText(footText, cx - tw / 2 + 6, footY + 2);

    showResult(canvas);
}

function showResult(canvas) {
    const img = $('fimg');
    if (img) img.src = canvas.toDataURL('image/jpeg', .95);
    confettiTime();
}

function reshoot() {
    clearPhotos();
    location.href = 'camera.html';
}

function startOver() {
    resetState();
    location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', initStep5);
