'use strict';

/* ═══════════════════════════════════
   STEP 2 — LAYOUT & COLOR
   ═══════════════════════════════════ */

/* ── DATA ── */
const SW_C = [
    { hex: '#ffffff', n: 'WHITE' }, { hex: '#f5f5f5', n: 'SNOW' }, { hex: '#e0e0e0', n: 'SILVER' }, { hex: '#9e9e9e', n: 'GRAY' },
    { hex: '#121212', n: 'BLACK' }, { hex: '#2d2d2d', n: 'CHARCOAL' }, { hex: '#ff477e', n: 'PINK' }, { hex: '#ff1f61', n: 'ROSE' },
    { hex: '#e91e8c', n: 'FUCHSIA' }, { hex: '#c4224f', n: 'RUBY' }, { hex: '#ff9800', n: 'AMBER' }, { hex: '#ffc107', n: 'YELLOW' }
];
const SW_P = [
    { hex: '#ffd1dc', n: 'BLUSH' }, { hex: '#ffb3cb', n: 'SAKURA' }, { hex: '#ffc8dd', n: 'COTTON' }, { hex: '#fff0f3', n: 'PETAL' },
    { hex: '#d4f1f4', n: 'MINT' }, { hex: '#b5ead7', n: 'SAGE' }, { hex: '#c7f2a4', n: 'LIME' }, { hex: '#fff8dc', n: 'CREAM' },
    { hex: '#fce4ec', n: 'LACE' }, { hex: '#e1bee7', n: 'LAVND' }, { hex: '#d1c4e9', n: 'LILAC' }, { hex: '#bbdefb', n: 'SKY' }
];
const SW_D = [
    { hex: '#1a1a2e', n: 'NAVY' }, { hex: '#16213e', n: 'OCEAN' }, { hex: '#0f3460', n: 'COBALT' }, { hex: '#2c2c54', n: 'DUSK' },
    { hex: '#2d1b69', n: 'VIOLET' }, { hex: '#3d0a20', n: 'MERLOT' }, { hex: '#1b1b2f', n: 'SPACE' }, { hex: '#0d1117', n: 'VOID' },
    { hex: '#1a0a00', n: 'EMBER' }, { hex: '#0a1628', n: 'ABYSS' }, { hex: '#1c1c3a', n: 'INK' }, { hex: '#2a0a2e', n: 'PLUM' }
];
const GRADS = [
    { css: 'linear-gradient(135deg,#ffd1dc,#ffb3cb)' }, { css: 'linear-gradient(135deg,#667eea,#764ba2)' },
    { css: 'linear-gradient(135deg,#f093fb,#f5576c)' }, { css: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
    { css: 'linear-gradient(135deg,#43e97b,#38f9d7)' }, { css: 'linear-gradient(135deg,#fa709a,#fee140)' },
    { css: 'linear-gradient(135deg,#a18cd1,#fbc2eb)' }, { css: 'linear-gradient(135deg,#ffecd2,#fcb69f)' },
    { css: 'linear-gradient(135deg,#2c3e50,#3498db)' }, { css: 'linear-gradient(135deg,#1a1a2e,#e94560)' },
    { css: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }, { css: 'linear-gradient(135deg,#373b44,#4286f4)' }
];
const QC = ['FFFFFF', '121212', 'FFD1DC', 'D4F1F4', 'FFF8DC', '1A1A2E', 'FF477E', '2C2C54'];

/* ── BUILDERS ── */
function buildUI() {
    buildSW('sg-c', SW_C); buildSW('sg-p', SW_P); buildSW('sg-d', SW_D);
    buildGrads(); buildQC(); buildGStops(); onGradChange();
    updPreview(); updSpotifyPreview();

    // Restore layout selection UI
    document.querySelectorAll('#layout-grid .card').forEach(c => c.classList.remove('sel'));
    const layoutCard = document.querySelector(`#layout-grid .card[onclick*="'${S.layout}'"]`);
    if (layoutCard) layoutCard.classList.add('sel');

    // Restore spotify sub-layout
    if (S.layout === 'spotify') {
        document.querySelectorAll('.sp-lo-btn').forEach(b => b.classList.remove('sel'));
        const spBtn = document.querySelector(`.sp-lo-btn[onclick*="'${S.spLayout}'"]`);
        if (spBtn) spBtn.classList.add('sel');
        const pg = $('sp-prev-grid');
        if (S.spLayout === 'strip') {
            pg.style.gridTemplateColumns = '1fr';
            $('lp-spotify').style.maxWidth = '100px';
        } else {
            pg.style.gridTemplateColumns = '1fr 1fr';
            $('lp-spotify').style.maxWidth = '140px';
        }
    }

    // Restore inputs
    $('sp-title').value = S.spTitle;
    $('sp-artist').value = S.spArtist;
    $('sp-dur').value = S.spDur;
    $('sp-prog').value = S.spProg;
}

function buildSW(id, list) {
    const g = $(id);
    if (!g) return;
    g.innerHTML = '';
    list.forEach(sw => {
        const w = document.createElement('div'); w.className = 'swi';
        w.innerHTML = `<div class="swc${sw.hex === S.color ? ' sel' : ''}" style="background:${sw.hex};${isDark(sw.hex) ? 'border-color:#555;' : ''}" data-hex="${sw.hex}"><span class="swck"><i class="fas fa-check"></i></span></div><span class="swn">${sw.n}</span>`;
        w.querySelector('.swc').addEventListener('click', () => applyColor(sw.hex, false, ''));
        g.appendChild(w);
    });
}

function buildGrads() {
    const g = $('ggrid');
    if (!g) return;
    g.innerHTML = '';
    GRADS.forEach(gr => {
        const d = document.createElement('div'); d.className = 'gi';
        d.style.background = gr.css; d.dataset.css = gr.css;
        d.innerHTML = `<div class="gick"><i class="fas fa-check"></i></div>`;
        d.addEventListener('click', () => applyColor(gr.css, true, gr.css));
        g.appendChild(d);
    });
}

function buildQC() {
    const c = $('qcodes');
    if (!c) return;
    c.innerHTML = '';
    QC.forEach(code => {
        const b = document.createElement('button'); b.className = 'qcbtn'; b.textContent = code;
        b.addEventListener('click', () => quickHex(code)); c.appendChild(b);
    });
}

/* ── CUSTOM GRADIENT ── */
function buildGStops() {
    const c = $('gstops');
    if (!c) return;
    c.innerHTML = '';
    S.gStops.forEach((stop, i) => {
        const row = document.createElement('div'); row.className = 'gstop-row';
        row.innerHTML = `
            <div class="gstop-preview" style="background:#${stop.hex};" onclick="pickStopColor(${i})" title="Click to pick color"></div>
            <div class="gstop-wrap">
                <span class="gstop-hash">#</span>
                <input class="gstop-hex" type="text" maxlength="6" value="${stop.hex.toUpperCase()}"
                    oninput="onStopHex(${i},this.value)" onkeydown="if(event.key==='Enter')onStopHex(${i},this.value)">
            </div>
            ${S.gStops.length > 2 ? `<button class="gstop-rm" onclick="removeStop(${i})"><i class="fas fa-xmark"></i></button>` : ''}`;
        c.appendChild(row);
    });
}

function onStopHex(i, val) {
    const clean = val.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    const inputs = $('gstops').querySelectorAll('.gstop-hex');
    if (inputs[i]) inputs[i].value = clean.toUpperCase();
    if (clean.length === 6) {
        S.gStops[i].hex = clean;
        const prevs = $('gstops').querySelectorAll('.gstop-preview');
        if (prevs[i]) prevs[i].style.background = '#' + clean;
        onGradChange();
    }
}

function pickStopColor(i) {
    const inp = document.createElement('input'); inp.type = 'color';
    inp.value = '#' + S.gStops[i].hex;
    inp.style.display = 'none'; document.body.appendChild(inp);
    inp.addEventListener('input', () => { const hex = inp.value.replace('#', ''); S.gStops[i].hex = hex; buildGStops(); onGradChange(); });
    inp.addEventListener('change', () => { document.body.removeChild(inp); });
    inp.click();
}

function addStop() {
    if (S.gStops.length >= 6) return;
    S.gStops.push({ hex: 'ffffff' }); buildGStops(); onGradChange();
}

function removeStop(i) {
    if (S.gStops.length <= 2) return;
    S.gStops.splice(i, 1); buildGStops(); onGradChange();
}

function onGradChange() {
    const angle = +$('g-angle').value; S.gAngle = angle;
    $('g-angle-val').textContent = angle + '°';
    const stops = S.gStops.map(s => '#' + s.hex).join(',');
    const css = `linear-gradient(${angle}deg,${stops})`;
    $('g-prev-bar').style.background = css;
    S._customGradCSS = css;
}

function applyCustomGrad() {
    const css = S._customGradCSS || `linear-gradient(135deg,#${S.gStops.map(s => s.hex).join(',#')})`;
    applyColor(css, true, css);
    document.querySelectorAll('.gi').forEach(el => el.classList.remove('sel'));
}

/* ── APPLY COLOR ── */
function applyColor(val, isGrad, gradCSS) {
    S.color = val; S.isGrad = isGrad; S.gradCSS = gradCSS;
    document.querySelectorAll('.swc').forEach(e => e.classList.remove('sel'));
    document.querySelectorAll('.gi').forEach(e => e.classList.remove('sel'));
    if (isGrad) {
        document.querySelectorAll('.gi').forEach(e => { if (e.dataset.css === gradCSS) e.classList.add('sel'); });
    } else {
        document.querySelectorAll('.swc').forEach(e => { if (e.dataset.hex === val) e.classList.add('sel'); });
        const clean = val.replace('#', '');
        if ($('hxinput')) $('hxinput').value = clean.toUpperCase();
        if ($('hxsw')) $('hxsw').style.background = val;
        syncSliders(val);
    }
    const bg = isGrad ? gradCSS : val;
    if ($('spsw')) $('spsw').style.background = bg;
    if ($('sphex')) $('sphex').textContent = isGrad ? 'GRADIENT' : val.toUpperCase();
    saveState();
    updPreview();
}

function swTab(name, btn) {
    document.querySelectorAll('.cptab').forEach(t => t.classList.remove('a'));
    document.querySelectorAll('.cppanel').forEach(p => p.classList.remove('a'));
    btn.classList.add('a'); $('panel-' + name).classList.add('a');
}

function onHexIn(v) {
    const c = v.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    $('hxinput').value = c.toUpperCase();
    if (c.length === 6) $('hxsw').style.background = '#' + c;
}

function applyHex() {
    const v = $('hxinput').value.replace(/[^0-9a-fA-F]/g, '');
    if (v.length !== 6) { $('hxinput').style.borderColor = 'rgba(255,71,126,.8)'; setTimeout(() => $('hxinput').style.borderColor = '', 800); return; }
    applyColor('#' + v, false, '');
}

function quickHex(code) {
    if ($('hxinput')) $('hxinput').value = code;
    if ($('hxsw')) $('hxsw').style.background = '#' + code;
    applyColor('#' + code, false, '');
}

/* ── ADVANCED SLIDERS ── */
function onRGB() {
    const r = +$('sl-r').value, g = +$('sl-g').value, b = +$('sl-b').value;
    $('vr').textContent = r; $('vg').textContent = g; $('vb').textContent = b;
    S.advR = r; S.advG = g; S.advB = b;
    const hex = r2h(r, g, b);
    $('advsw').style.background = hex; $('advhex').textContent = hex.toUpperCase();
    const hsl = r2hsl(r, g, b);
    $('sl-h').value = Math.round(hsl[0]); $('vh').textContent = Math.round(hsl[0]) + '°';
    $('sl-s').value = Math.round(hsl[1]); $('vs').textContent = Math.round(hsl[1]) + '%';
    $('sl-l').value = Math.round(hsl[2]); $('vl').textContent = Math.round(hsl[2]) + '%';
}

function onHSL() {
    const h = +$('sl-h').value, s = +$('sl-s').value, l = +$('sl-l').value;
    $('vh').textContent = h + '°'; $('vs').textContent = s + '%'; $('vl').textContent = l + '%';
    const rgb = hsl2r(h, s, l);
    S.advR = rgb[0]; S.advG = rgb[1]; S.advB = rgb[2];
    $('sl-r').value = rgb[0]; $('vr').textContent = rgb[0];
    $('sl-g').value = rgb[1]; $('vg').textContent = rgb[1];
    $('sl-b').value = rgb[2]; $('vb').textContent = rgb[2];
    const hex = r2h(rgb[0], rgb[1], rgb[2]);
    $('advsw').style.background = hex; $('advhex').textContent = hex.toUpperCase();
}

function applyAdv() {
    applyColor(r2h(S.advR, S.advG, S.advB), false, '');
}

function syncSliders(hex) {
    const rgb = h2r(hex); if (!rgb) return;
    S.advR = rgb[0]; S.advG = rgb[1]; S.advB = rgb[2];
    if ($('sl-r')) { $('sl-r').value = rgb[0]; $('vr').textContent = rgb[0]; }
    if ($('sl-g')) { $('sl-g').value = rgb[1]; $('vg').textContent = rgb[1]; }
    if ($('sl-b')) { $('sl-b').value = rgb[2]; $('vb').textContent = rgb[2]; }
    const hsl = r2hsl(rgb[0], rgb[1], rgb[2]);
    if ($('sl-h')) { $('sl-h').value = Math.round(hsl[0]); $('vh').textContent = Math.round(hsl[0]) + '°'; }
    if ($('sl-s')) { $('sl-s').value = Math.round(hsl[1]); $('vs').textContent = Math.round(hsl[1]) + '%'; }
    if ($('sl-l')) { $('sl-l').value = Math.round(hsl[2]); $('vl').textContent = Math.round(hsl[2]) + '%'; }
    if ($('advsw')) $('advsw').style.background = hex;
    if ($('advhex')) $('advhex').textContent = hex.toUpperCase();
}

/* ── PREVIEW ── */
function updPreview() {
    const bg = S.isGrad ? S.gradCSS : S.color;
    const tc = contrast(S.color, S.isGrad);
    if ($('lps')) $('lps').style.display = S.layout === 'strip' ? 'flex' : 'none';
    if ($('lpg')) $('lpg').style.display = S.layout === 'grid' ? 'grid' : 'none';
    if ($('lp-spotify')) $('lp-spotify').style.display = S.layout === 'spotify' ? 'block' : 'none';
    if ($('lps')) $('lps').style.background = bg;
    if ($('lpg')) $('lpg').style.background = bg;
    if ($('lpbs')) $('lpbs').style.color = tc;
    if ($('lpbg')) $('lpbg').style.color = tc;
    if ($('cpbox')) $('cpbox').style.display = S.layout === 'spotify' ? 'none' : 'block';
    if ($('selpill')) $('selpill').style.display = S.layout === 'spotify' ? 'none' : 'inline-flex';
    if ($('sp-config')) $('sp-config').style.display = S.layout === 'spotify' ? 'block' : 'none';
}

/* ── LAYOUT SELECT ── */
function selLayout(v, el) {
    S.layout = v;
    el.parentElement.querySelectorAll('.card').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
    saveState();
    updPreview();
}

/* ── SPOTIFY ── */
function setSpLayout(type, btn) {
    S.spLayout = type;
    document.querySelectorAll('.sp-lo-btn').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    const pg = $('sp-prev-grid');
    if (type === 'strip') {
        pg.style.gridTemplateColumns = '1fr';
        $('lp-spotify').style.maxWidth = '100px';
    } else {
        pg.style.gridTemplateColumns = '1fr 1fr';
        $('lp-spotify').style.maxWidth = '140px';
    }
    saveState();
}

function updSpotifyPreview() {
    S.spTitle = $('sp-title').value || 'Song Title';
    S.spArtist = $('sp-artist').value || 'Artist Name';
    S.spDur = +$('sp-dur').value;
    S.spProg = +$('sp-prog').value;

    $('sp-dur-val').textContent = secToMMSS(S.spDur);
    $('sp-prog-val').textContent = S.spProg + '%';

    const curSec = Math.round(S.spDur * S.spProg / 100);
    if ($('sp-prev-song')) $('sp-prev-song').textContent = S.spTitle;
    if ($('sp-prev-artist')) $('sp-prev-artist').textContent = S.spArtist;
    if ($('sp-prev-bar')) $('sp-prev-bar').style.width = S.spProg + '%';
    if ($('sp-prev-cur')) $('sp-prev-cur').textContent = secToMMSS(curSec);
    if ($('sp-prev-tot')) $('sp-prev-tot').textContent = secToMMSS(S.spDur);
    saveState();
}

/* ── NAVIGATION ── */
function goToFilter() {
    saveState();
    location.href = 'filter.html';
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    buildUI();
});
