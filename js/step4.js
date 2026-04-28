'use strict';

/* ═══════════════════════════════════
   STEP 4 — CAMERA & CAPTURE
   ═══════════════════════════════════ */

const video = () => $('video');
const shutter = () => $('shutter');
const cdownEl = () => $('cdown');
const flashEl = () => $('flash');

function initStep4() {
    loadState();
    const [rw, rh] = S.ratio.split(':');
    if ($('camwrap')) $('camwrap').style.aspectRatio = rw + ' / ' + rh;
    if ($('cam-r')) $('cam-r').textContent = S.ratio;
    if ($('cam-f')) $('cam-f').textContent = FNAMES[S.filter] || 'NATURAL';
    initCam();
}

function applyFilter() {
    const v = video();
    if (v) v.style.filter = FCSS[S.filter] || 'none';
}

async function initCam() {
    stopCam();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
        });
        const v = video();
        v.srcObject = stream;
        v.style.transform = S.mirrored ? 'scaleX(-1)' : 'scaleX(1)';
        applyFilter();
        resetPips();
        if (shutter()) shutter().disabled = false;
        S.shooting = false;
        if ($('caminfo')) $('caminfo').textContent = 'PRESS THE BUTTON TO START';
    } catch (e) {
        alert('Camera access required. Please allow it and try again.');
    }
}

function stopCam() {
    const v = video();
    if (v && v.srcObject) {
        v.srcObject.getTracks().forEach(t => t.stop());
        v.srcObject = null;
    }
}

function togMirror() {
    S.mirrored = !S.mirrored;
    const v = video();
    if (v) v.style.transform = S.mirrored ? 'scaleX(-1)' : 'scaleX(1)';
    saveState();
}

function togTimer() {
    const opts = [3, 5, 10];
    S.timerSec = opts[(opts.indexOf(S.timerSec) + 1) % opts.length];
    const btn = $('timerbtn');
    if (btn) btn.innerHTML = `<i class="fas fa-stopwatch"></i><span style="font-size:.55rem;margin-left:2px;">${S.timerSec}s</span>`;
    saveState();
}

function resetPips() {
    for (let i = 0; i < 4; i++) {
        const pip = $('pip-' + i);
        if (pip) pip.classList.remove('d');
    }
}

async function startShoot() {
    if (S.shooting) return;
    S.shooting = true;
    if (shutter()) shutter().disabled = true;
    S.photos = [];
    resetPips();

    const [rW, rH] = S.ratio.split(':').map(Number);
    const pw = 800;
    const ph = Math.round(pw * rH / rW);
    const tc = $('ct');
    const ctx = tc.getContext('2d');
    tc.width = pw;
    tc.height = ph;

    for (let i = 0; i < 4; i++) {
        if ($('caminfo')) $('caminfo').textContent = `PHOTO ${i + 1} OF 4 — GET READY!`;
        const cdown = cdownEl();
        cdown.style.display = 'block';
        for (let c = S.timerSec; c > 0; c--) {
            cdown.textContent = c;
            cdown.style.animation = 'none'; void cdown.offsetWidth;
            cdown.style.animation = 'cpop .3s cubic-bezier(.34,1.56,.64,1)';
            await sleep(800);
        }
        cdown.style.display = 'none';

        const flash = flashEl();
        flash.classList.add('flash-a');
        setTimeout(() => flash.classList.remove('flash-a'), 450);

        const v = video();
        const vW = v.videoWidth || pw;
        const vH = v.videoHeight || ph;
        const vR = vW / vH;
        const tR = pw / ph;
        let sW, sH, sX, sY;
        if (vR > tR) { sH = vH; sW = vH * tR; sX = (vW - sW) / 2; sY = 0; }
        else { sW = vW; sH = vW / tR; sY = (vH - sH) / 2; sX = 0; }

        ctx.save();
        ctx.filter = FCSS[S.filter] || 'none';
        if (S.mirrored) { ctx.translate(pw, 0); ctx.scale(-1, 1); }
        ctx.drawImage(v, sX, sY, sW, sH, 0, 0, pw, ph);
        ctx.restore();
        ctx.filter = 'none';

        S.photos.push(tc.toDataURL('image/jpeg', .95));
        const pip = $('pip-' + i);
        if (pip) pip.classList.add('d');
        await sleep(500);
    }

    if ($('caminfo')) $('caminfo').textContent = 'COMPOSING YOUR STRIP...';
    saveState();
    // Redirect to result page after short delay
    setTimeout(() => {
        stopCam();
        location.href = 'result.html';
    }, 600);
}

function backCam() {
    stopCam();
    S.shooting = false;
    if (shutter()) shutter().disabled = false;
    saveState();
    location.href = 'filter.html';
}

document.addEventListener('DOMContentLoaded', initStep4);
