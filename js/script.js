'use strict';
const S = {
    layout:'strip', spLayout:'grid', color:'#ffffff', isGrad:false, gradCSS:'',
    filter:'none', ratio:'4:3', photos:[], mirrored:true, timerSec:3, shooting:false,
    advR:255, advG:255, advB:255,
    gStops:[{hex:'ff477e'},{hex:'ff1f61'}], gAngle:135,
    spTitle:'Cruel Summer', spArtist:'Taylor Swift', spDur:207, spProg:38
};
const $=id=>document.getElementById(id);
const video=$('video'), shutter=$('shutter'), cdownEl=$('cdown'), flashEl=$('flash');

const SW_C=[
    {hex:'#ffffff',n:'WHITE'},{hex:'#f5f5f5',n:'SNOW'},{hex:'#e0e0e0',n:'SILVER'},{hex:'#9e9e9e',n:'GRAY'},
    {hex:'#121212',n:'BLACK'},{hex:'#2d2d2d',n:'CHARCOAL'},{hex:'#ff477e',n:'PINK'},{hex:'#ff1f61',n:'ROSE'},
    {hex:'#e91e8c',n:'FUCHSIA'},{hex:'#c4224f',n:'RUBY'},{hex:'#ff9800',n:'AMBER'},{hex:'#ffc107',n:'YELLOW'}
];
const SW_P=[
    {hex:'#ffd1dc',n:'BLUSH'},{hex:'#ffb3cb',n:'SAKURA'},{hex:'#ffc8dd',n:'COTTON'},{hex:'#fff0f3',n:'PETAL'},
    {hex:'#d4f1f4',n:'MINT'},{hex:'#b5ead7',n:'SAGE'},{hex:'#c7f2a4',n:'LIME'},{hex:'#fff8dc',n:'CREAM'},
    {hex:'#fce4ec',n:'LACE'},{hex:'#e1bee7',n:'LAVND'},{hex:'#d1c4e9',n:'LILAC'},{hex:'#bbdefb',n:'SKY'}
];
const SW_D=[
    {hex:'#1a1a2e',n:'NAVY'},{hex:'#16213e',n:'OCEAN'},{hex:'#0f3460',n:'COBALT'},{hex:'#2c2c54',n:'DUSK'},
    {hex:'#2d1b69',n:'VIOLET'},{hex:'#3d0a20',n:'MERLOT'},{hex:'#1b1b2f',n:'SPACE'},{hex:'#0d1117',n:'VOID'},
    {hex:'#1a0a00',n:'EMBER'},{hex:'#0a1628',n:'ABYSS'},{hex:'#1c1c3a',n:'INK'},{hex:'#2a0a2e',n:'PLUM'}
];
const GRADS=[
    {css:'linear-gradient(135deg,#ffd1dc,#ffb3cb)'},{css:'linear-gradient(135deg,#667eea,#764ba2)'},
    {css:'linear-gradient(135deg,#f093fb,#f5576c)'},{css:'linear-gradient(135deg,#4facfe,#00f2fe)'},
    {css:'linear-gradient(135deg,#43e97b,#38f9d7)'},{css:'linear-gradient(135deg,#fa709a,#fee140)'},
    {css:'linear-gradient(135deg,#a18cd1,#fbc2eb)'},{css:'linear-gradient(135deg,#ffecd2,#fcb69f)'},
    {css:'linear-gradient(135deg,#2c3e50,#3498db)'},{css:'linear-gradient(135deg,#1a1a2e,#e94560)'},
    {css:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'},{css:'linear-gradient(135deg,#373b44,#4286f4)'}
];
const QC=['FFFFFF','121212','FFD1DC','D4F1F4','FFF8DC','1A1A2E','FF477E','2C2C54'];
const FCSS={none:'none',vintage:'sepia(.6) contrast(1.2) saturate(.8)',bnw:'grayscale(1)',sharpen:'contrast(1.3) saturate(1.4) brightness(1.1)'};
const FNAMES={none:'NATURAL',vintage:'VINTAGE',bnw:'B & W',sharpen:'VIVID GLOW'};

function secToMMSS(s){ const m=Math.floor(s/60); return m+':'+(s%60<10?'0':'')+(s%60); }

/* SPOTIFY CONFIG */
function setSpLayout(type, btn) {
    S.spLayout = type;
    document.querySelectorAll('.sp-lo-btn').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    
    const pg = $('sp-prev-grid');
    if(type === 'strip') {
        pg.style.gridTemplateColumns = '1fr';
        $('lp-spotify').style.maxWidth = '100px';
    } else {
        pg.style.gridTemplateColumns = '1fr 1fr';
        $('lp-spotify').style.maxWidth = '140px';
    }
}

function updSpotifyPreview(){
    S.spTitle=$('sp-title').value||'Song Title';
    S.spArtist=$('sp-artist').value||'Artist Name';
    S.spDur=+$('sp-dur').value;
    S.spProg=+$('sp-prog').value;

    $('sp-dur-val').textContent=secToMMSS(S.spDur);
    $('sp-prog-val').textContent=S.spProg+'%';

    const curSec=Math.round(S.spDur*S.spProg/100);
    $('sp-prev-song').textContent=S.spTitle;
    $('sp-prev-artist').textContent=S.spArtist;
    $('sp-prev-bar').style.width=S.spProg+'%';
    $('sp-prev-cur').textContent=secToMMSS(curSec);
    $('sp-prev-tot').textContent=secToMMSS(S.spDur);
}

/* BUILD UI */
function buildUI(){
    buildSW('sg-c',SW_C); buildSW('sg-p',SW_P); buildSW('sg-d',SW_D);
    buildGrads(); buildQC(); buildGStops(); onGradChange();
    updPreview(); updSpotifyPreview();
}
function buildSW(id,list){
    const g=$(id);
    list.forEach(sw=>{
        const w=document.createElement('div'); w.className='swi';
        w.innerHTML=`<div class="swc${sw.hex==='#ffffff'?' sel':''}" style="background:${sw.hex};${isDark(sw.hex)?'border-color:#555;':''}" data-hex="${sw.hex}"><span class="swck"><i class="fas fa-check"></i></span></div><span class="swn">${sw.n}</span>`;
        w.querySelector('.swc').addEventListener('click',()=>applyColor(sw.hex,false,''));
        g.appendChild(w);
    });
}
function buildGrads(){
    const g=$('ggrid');
    GRADS.forEach(gr=>{
        const d=document.createElement('div'); d.className='gi';
        d.style.background=gr.css; d.dataset.css=gr.css;
        d.innerHTML=`<div class="gick"><i class="fas fa-check"></i></div>`;
        d.addEventListener('click',()=>applyColor(gr.css,true,gr.css));
        g.appendChild(d);
    });
}
function buildQC(){
    const c=$('qcodes');
    QC.forEach(code=>{
        const b=document.createElement('button'); b.className='qcbtn'; b.textContent=code;
        b.addEventListener('click',()=>quickHex(code)); c.appendChild(b);
    });
}

/* CUSTOM GRADIENT */
function buildGStops(){
    const c=$('gstops'); c.innerHTML='';
    S.gStops.forEach((stop,i)=>{
        const row=document.createElement('div'); row.className='gstop-row';
        row.innerHTML=`
            <div class="gstop-preview" style="background:#${stop.hex};" onclick="pickStopColor(${i})" title="Click to pick color"></div>
            <div class="gstop-wrap">
                <span class="gstop-hash">#</span>
                <input class="gstop-hex" type="text" maxlength="6" value="${stop.hex.toUpperCase()}"
                    oninput="onStopHex(${i},this.value)" onkeydown="if(event.key==='Enter')onStopHex(${i},this.value)">
            </div>
            ${S.gStops.length>2?`<button class="gstop-rm" onclick="removeStop(${i})"><i class="fas fa-xmark"></i></button>`:''}`;
        c.appendChild(row);
    });
}
function onStopHex(i,val){
    const clean=val.replace(/[^0-9a-fA-F]/g,'').slice(0,6);
    const inputs=$('gstops').querySelectorAll('.gstop-hex');
    if(inputs[i]) inputs[i].value=clean.toUpperCase();
    if(clean.length===6){
        S.gStops[i].hex=clean;
        const prevs=$('gstops').querySelectorAll('.gstop-preview');
        if(prevs[i]) prevs[i].style.background='#'+clean;
        onGradChange();
    }
}
function pickStopColor(i){
    const inp=document.createElement('input'); inp.type='color';
    inp.value='#'+S.gStops[i].hex;
    inp.style.display='none'; document.body.appendChild(inp);
    inp.addEventListener('input',()=>{ const hex=inp.value.replace('#',''); S.gStops[i].hex=hex; buildGStops(); onGradChange(); });
    inp.addEventListener('change',()=>{ document.body.removeChild(inp); });
    inp.click();
}
function addStop(){ if(S.gStops.length>=6) return; S.gStops.push({hex:'ffffff'}); buildGStops(); onGradChange(); }
function removeStop(i){ if(S.gStops.length<=2) return; S.gStops.splice(i,1); buildGStops(); onGradChange(); }
function onGradChange(){
    const angle=+$('g-angle').value; S.gAngle=angle;
    $('g-angle-val').textContent=angle+'°';
    const stops=S.gStops.map(s=>'#'+s.hex).join(',');
    const css=`linear-gradient(${angle}deg,${stops})`;
    $('g-prev-bar').style.background=css;
    S._customGradCSS=css;
}
function applyCustomGrad(){
    const css=S._customGradCSS||`linear-gradient(135deg,#${S.gStops.map(s=>s.hex).join(',#')})`;
    applyColor(css,true,css);
    document.querySelectorAll('.gi').forEach(el=>el.classList.remove('sel'));
}

/* APPLY COLOR */
function applyColor(val,isGrad,gradCSS){
    S.color=val; S.isGrad=isGrad; S.gradCSS=gradCSS;
    document.querySelectorAll('.swc').forEach(e=>e.classList.remove('sel'));
    document.querySelectorAll('.gi').forEach(e=>e.classList.remove('sel'));
    if(isGrad){
        document.querySelectorAll('.gi').forEach(e=>{ if(e.dataset.css===gradCSS) e.classList.add('sel'); });
    } else {
        document.querySelectorAll('.swc').forEach(e=>{ if(e.dataset.hex===val) e.classList.add('sel'); });
        const clean=val.replace('#','');
        $('hxinput').value=clean.toUpperCase();
        $('hxsw').style.background=val;
        syncSliders(val);
    }
    const bg=isGrad?gradCSS:val;
    $('spsw').style.background=bg;
    $('sphex').textContent=isGrad?'GRADIENT':val.toUpperCase();
    updPreview();
}

function swTab(name,btn){
    document.querySelectorAll('.cptab').forEach(t=>t.classList.remove('a'));
    document.querySelectorAll('.cppanel').forEach(p=>p.classList.remove('a'));
    btn.classList.add('a'); $('panel-'+name).classList.add('a');
}

function onHexIn(v){
    const c=v.replace(/[^0-9a-fA-F]/g,'').slice(0,6);
    $('hxinput').value=c.toUpperCase();
    if(c.length===6) $('hxsw').style.background='#'+c;
}
function applyHex(){
    const v=$('hxinput').value.replace(/[^0-9a-fA-F]/g,'');
    if(v.length!==6){ $('hxinput').style.borderColor='rgba(255,71,126,.8)'; setTimeout(()=>$('hxinput').style.borderColor='',800); return; }
    applyColor('#'+v,false,'');
}
function quickHex(code){ $('hxinput').value=code; $('hxsw').style.background='#'+code; applyColor('#'+code,false,''); }

function onRGB(){
    const r=+$('sl-r').value,g=+$('sl-g').value,b=+$('sl-b').value;
    $('vr').textContent=r; $('vg').textContent=g; $('vb').textContent=b;
    S.advR=r; S.advG=g; S.advB=b;
    const hex=r2h(r,g,b);
    $('advsw').style.background=hex; $('advhex').textContent=hex.toUpperCase();
    const hsl=r2hsl(r,g,b);
    $('sl-h').value=Math.round(hsl[0]); $('vh').textContent=Math.round(hsl[0])+'°';
    $('sl-s').value=Math.round(hsl[1]); $('vs').textContent=Math.round(hsl[1])+'%';
    $('sl-l').value=Math.round(hsl[2]); $('vl').textContent=Math.round(hsl[2])+'%';
}
function onHSL(){
    const h=+$('sl-h').value,s=+$('sl-s').value,l=+$('sl-l').value;
    $('vh').textContent=h+'°'; $('vs').textContent=s+'%'; $('vl').textContent=l+'%';
    const rgb=hsl2r(h,s,l);
    S.advR=rgb[0]; S.advG=rgb[1]; S.advB=rgb[2];
    $('sl-r').value=rgb[0]; $('vr').textContent=rgb[0];
    $('sl-g').value=rgb[1]; $('vg').textContent=rgb[1];
    $('sl-b').value=rgb[2]; $('vb').textContent=rgb[2];
    const hex=r2h(rgb[0],rgb[1],rgb[2]);
    $('advsw').style.background=hex; $('advhex').textContent=hex.toUpperCase();
}
function applyAdv(){ applyColor(r2h(S.advR,S.advG,S.advB),false,''); }
function syncSliders(hex){
    const rgb=h2r(hex); if(!rgb) return;
    S.advR=rgb[0]; S.advG=rgb[1]; S.advB=rgb[2];
    $('sl-r').value=rgb[0]; $('vr').textContent=rgb[0];
    $('sl-g').value=rgb[1]; $('vg').textContent=rgb[1];
    $('sl-b').value=rgb[2]; $('vb').textContent=rgb[2];
    const hsl=r2hsl(rgb[0],rgb[1],rgb[2]);
    $('sl-h').value=Math.round(hsl[0]); $('vh').textContent=Math.round(hsl[0])+'°';
    $('sl-s').value=Math.round(hsl[1]); $('vs').textContent=Math.round(hsl[1])+'%';
    $('sl-l').value=Math.round(hsl[2]); $('vl').textContent=Math.round(hsl[2])+'%';
    $('advsw').style.background=hex; $('advhex').textContent=hex.toUpperCase();
}

function h2r(hex){ const h=hex.replace('#',''); if(h.length!==6) return null; return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
function r2h(r,g,b){ return'#'+[r,g,b].map(x=>Math.round(x).toString(16).padStart(2,'0')).join(''); }
function isDark(hex){ const r=h2r(hex); if(!r) return false; return(0.299*r[0]+0.587*r[1]+0.114*r[2])/255<0.45; }
function contrast(hex,isGrad){ if(isGrad) return'rgba(255,255,255,.88)'; return isDark(hex)?'rgba(255,255,255,.88)':'rgba(0,0,0,.72)'; }
function r2hsl(r,g,b){
    r/=255;g/=255;b/=255;
    const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
    let h,s,l=(mx+mn)/2;
    if(mx===mn){h=s=0;}
    else{const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx-mn);
        switch(mx){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;default:h=((r-g)/d+4)/6;}}
    return[h*360,s*100,l*100];
}
function hsl2r(h,s,l){
    h/=360;s/=100;l/=100;
    if(s===0){const v=Math.round(l*255);return[v,v,v];}
    const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;
    const hue=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<.5)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
    return[Math.round(hue(p,q,h+1/3)*255),Math.round(hue(p,q,h)*255),Math.round(hue(p,q,h-1/3)*255)];
}

/* PREVIEW */
function updPreview(){
    const bg=S.isGrad?S.gradCSS:S.color;
    const tc=contrast(S.color,S.isGrad);
    $('lps').style.display=S.layout==='strip'?'flex':'none';
    $('lpg').style.display=S.layout==='grid'?'grid':'none';
    $('lp-spotify').style.display=S.layout==='spotify'?'block':'none';
    $('lps').style.background=bg; $('lpg').style.background=bg;
    $('lpbs').style.color=tc; $('lpbg').style.color=tc;
    $('cpbox').style.display=S.layout==='spotify'?'none':'block';
    $('selpill').style.display=S.layout==='spotify'?'none':'inline-flex';
    $('sp-config').style.display=S.layout==='spotify'?'block':'none';
}

/* NAVIGATION */
function goTo(s){
    document.querySelectorAll('.step').forEach(e=>e.classList.remove('active'));
    $('step-'+s).classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
    if(s===4){
        const[rw,rh]=S.ratio.split(':');
        $('camwrap').style.aspectRatio=rw+' / '+rh;
        $('cam-r').textContent=S.ratio;
        $('cam-f').textContent=FNAMES[S.filter]||'NATURAL';
        initCam();
    }
}
function backCam(){ stopCam(); S.shooting=false; shutter.disabled=false; goTo(3); }
function reshoot(){ S.photos=[]; S.shooting=false; shutter.disabled=false; resetPips(); $('caminfo').textContent='PRESS THE BUTTON TO START'; goTo(4); }
function stopCam(){ if(video.srcObject){video.srcObject.getTracks().forEach(t=>t.stop());video.srcObject=null;} }

function selLayout(v,el){
    S.layout=v;
    el.parentElement.querySelectorAll('.card').forEach(c=>c.classList.remove('sel'));
    el.classList.add('sel');
    updPreview();
}
function selCard(type,v,el){ S[type]=v; el.parentElement.querySelectorAll('.card').forEach(c=>c.classList.remove('sel')); el.classList.add('sel'); if(type==='filter') applyFilter(); }

function selRatio(v,el){ 
    S.ratio=v; 
    document.querySelectorAll('#rgrp .pill').forEach(b=>b.classList.remove('sel')); 
    el.classList.add('sel'); 
    
    const[rw,rh]=v.split(':');
    const ar = rw+'/'+rh;
    document.querySelectorAll('.spp, .gpp, .sp-photo-cell').forEach(cell => {
        cell.style.aspectRatio = ar;
    });
}

/* CAMERA */
function applyFilter(){ video.style.filter=FCSS[S.filter]||'none'; }
async function initCam(){
    stopCam();
    try{
        const stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720},facingMode:'user'}});
        video.srcObject=stream; video.style.transform=S.mirrored?'scaleX(-1)':'scaleX(1)';
        applyFilter(); resetPips(); shutter.disabled=false; S.shooting=false;
        $('caminfo').textContent='PRESS THE BUTTON TO START';
    }catch(e){alert('Camera access required. Please allow it and try again.');}
}
function togMirror(){ S.mirrored=!S.mirrored; video.style.transform=S.mirrored?'scaleX(-1)':'scaleX(1)'; }
function togTimer(){
    const opts=[3,5,10]; S.timerSec=opts[(opts.indexOf(S.timerSec)+1)%opts.length];
    $('timerbtn').innerHTML=`<i class="fas fa-stopwatch"></i><span style="font-size:.55rem;margin-left:2px;">${S.timerSec}s</span>`;
}
function resetPips(){ for(let i=0;i<4;i++) $('pip-'+i).classList.remove('d'); }

/* SHOOT */
async function startShoot(){
    if(S.shooting) return;
    S.shooting=true; shutter.disabled=true;
    S.photos=[]; resetPips();
    const[rW,rH]=S.ratio.split(':').map(Number);
    const pw=800,ph=Math.round(pw*rH/rW);
    const tc=$('ct'),ctx=tc.getContext('2d');
    tc.width=pw; tc.height=ph;

    for(let i=0;i<4;i++){
        $('caminfo').textContent=`PHOTO ${i+1} OF 4 — GET READY!`;
        cdownEl.style.display='block';
        for(let c=S.timerSec;c>0;c--){
            cdownEl.textContent=c;
            cdownEl.style.animation='none'; void cdownEl.offsetWidth;
            cdownEl.style.animation='cpop .3s cubic-bezier(.34,1.56,.64,1)';
            await sleep(800);
        }
        cdownEl.style.display='none';
        flashEl.classList.add('flash-a');
        setTimeout(()=>flashEl.classList.remove('flash-a'),450);

        const vW=video.videoWidth||pw,vH=video.videoHeight||ph;
        const vR=vW/vH,tR=pw/ph;
        let sW,sH,sX,sY;
        if(vR>tR){sH=vH;sW=vH*tR;sX=(vW-sW)/2;sY=0;}
        else{sW=vW;sH=vW/tR;sY=(vH-sH)/2;sX=0;}

        ctx.save();
        ctx.filter=FCSS[S.filter]||'none';
        if(S.mirrored){ctx.translate(pw,0);ctx.scale(-1,1);}
        ctx.drawImage(video,sX,sY,sW,sH,0,0,pw,ph);
        ctx.restore(); ctx.filter='none';

        S.photos.push(tc.toDataURL('image/jpeg',.95));
        $('pip-'+i).classList.add('d');
        await sleep(500);
    }
    $('caminfo').textContent='COMPOSING YOUR STRIP...';
    renderFinal(pw,ph);
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* RENDER */
function renderFinal(pw,ph){
    if(S.layout==='spotify'){
        renderSpotify(pw,ph);
    } else {
        renderClassic(pw,ph);
    }
}

function renderClassic(pw,ph){
    const canvas=$('cf'),ctx=canvas.getContext('2d');
    const pad=50,bot=240;
    if(S.layout==='strip'){canvas.width=pw+pad*2;canvas.height=ph*4+pad*5+bot;}
    else{canvas.width=pw*2+pad*3;canvas.height=ph*2+pad*3+bot;}

    if(S.isGrad){
        ctx.fillStyle=mkGrad(ctx,S.gradCSS,canvas.width,canvas.height)||'#fff';
    }else{ ctx.fillStyle=S.color; }
    ctx.fillRect(0,0,canvas.width,canvas.height);

    let done=0;
    S.photos.forEach((src,i)=>{
        const img=new Image(); img.src=src;
        let x,y;
        if(S.layout==='strip'){x=pad;y=pad+i*(ph+pad);}
        else{x=pad+(i%2)*(pw+pad);y=pad+Math.floor(i/2)*(ph+pad);}
        img.onload=()=>{ rrect(ctx,x,y,pw,ph,15); ctx.save(); ctx.clip(); ctx.drawImage(img,x,y,pw,ph); ctx.restore(); done++; if(done===4) watermark(canvas,ctx); };
        img.onerror=()=>{ done++; if(done===4) watermark(canvas,ctx); };
    });
}

/* SPOTIFY RENDER */
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
        ctx.rect(-gap - w, -h, w, h*2);
        ctx.rect(gap, -h, w, h*2);
        ctx.fill();
    } else if (icon === 'prev') {
        const tw = size * 0.35;
        const th = size * 0.4;
        const bw = size * 0.12;
        ctx.rect(-tw - bw, -th, bw, th*2);
        ctx.moveTo(-tw, 0); ctx.lineTo(tw, -th); ctx.lineTo(tw, th);
        ctx.fill();
    } else if (icon === 'next') {
        const tw = size * 0.35;
        const th = size * 0.4;
        const bw = size * 0.12;
        ctx.rect(tw, -th, bw, th*2);
        ctx.moveTo(tw, 0); ctx.lineTo(-tw, -th); ctx.lineTo(-tw, th);
        ctx.fill();
    } else if (icon === 'shuffle') {
        const w = size * 0.4;
        const h = size * 0.2;
        const aw = size * 0.15;
        ctx.moveTo(-w, -h); ctx.bezierCurveTo(-w*0.5, -h, w*0.5, h, w, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w-aw, h-aw); ctx.lineTo(w, h); ctx.lineTo(w-aw, h+aw); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-w, h); ctx.bezierCurveTo(-w*0.5, h, w*0.5, -h, w, -h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w-aw, -h-aw); ctx.lineTo(w, -h); ctx.lineTo(w-aw, -h+aw); ctx.stroke();
    } else if (icon === 'repeat') {
        const w = size * 0.35;
        const h = size * 0.2;
        const aw = size * 0.12;
        ctx.moveTo(-w, -h); ctx.lineTo(w, -h); ctx.lineTo(w, h*0.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w-aw, -h-aw); ctx.lineTo(w+aw, -h); ctx.lineTo(w-aw, -h+aw); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w, h); ctx.lineTo(-w, h); ctx.lineTo(-w, -h*0.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-w+aw, h-aw); ctx.lineTo(-w-aw, h); ctx.lineTo(-w+aw, h+aw); ctx.stroke();
    } else if (icon === 'heart') {
        const w = size * 0.35;
        ctx.translate(0, -size*0.05);
        ctx.moveTo(0, w);
        ctx.bezierCurveTo(-w*1.5, w*0.1, -w*1.5, -w, 0, -w*0.5);
        ctx.bezierCurveTo(w*1.5, -w, w*1.5, w*0.1, 0, w);
        ctx.fill();
    }
    ctx.restore();
}

function drawSpotifyLogo(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#1DB954';
    ctx.beginPath();
    ctx.arc(0, 0, size/2, 0, Math.PI*2);
    ctx.fill();

    ctx.strokeStyle = '#121212';
    ctx.lineWidth = size * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, size*0.15, size*0.35, -Math.PI*0.8, -Math.PI*0.2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, size*0.05, size*0.25, -Math.PI*0.8, -Math.PI*0.2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -size*0.05, size*0.15, -Math.PI*0.75, -Math.PI*0.25); ctx.stroke();
    ctx.restore();
}

function renderSpotify(pw,ph){
    const canvas=$('cf'),ctx=canvas.getContext('2d');
    const cw=1200;
    let cellW, cellH, gridH;

    if(S.spLayout === 'strip'){
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

    let done=0;
    S.photos.forEach((src,i)=>{
        const img=new Image(); img.src=src;
        let gx, gy;
        
        if (S.spLayout === 'strip') {
            gx = 0;
            gy = i * cellH;
        } else {
            gx = (i % 2) * cellW;
            gy = Math.floor(i / 2) * cellH;
        }

        img.onload=()=>{
            ctx.drawImage(img, gx, gy, cellW, cellH);
            done++;
            if(done===4) drawSpotifyPlayer(canvas, ctx, cw, gridH, playerH);
        };
        img.onerror=()=>{ done++; if(done===4) drawSpotifyPlayer(canvas, ctx, cw, gridH, playerH); };
    });
}

function drawSpotifyPlayer(canvas, ctx, cw, gridH, playerH){
    const grad=ctx.createLinearGradient(0, gridH - 180, 0, gridH);
    grad.addColorStop(0,'rgba(18,18,18,0)');
    grad.addColorStop(1,'rgba(18,18,18,0.95)');
    ctx.fillStyle=grad;
    ctx.fillRect(0, gridH - 180, cw, 180);

    const padX = 80;
    const startY = gridH;

    ctx.font = `bold 54px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(clipText(ctx, S.spTitle, cw - padX*2 - 80), padX, startY + 50);

    drawSpIcon(ctx, 'heart', cw - padX - 15, startY + 75, 48, '#1DB954');

    ctx.font = `500 36px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'left';
    ctx.fillText(clipText(ctx, S.spArtist, cw - padX*2), padX, startY + 115);

    const barY = startY + 210;
    const barW = cw - padX*2;
    const barH = 10;
    const prog = S.spProg / 100;

    roundRect(ctx, padX, barY, barW, barH, barH/2);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fill();

    roundRect(ctx, padX, barY, barW * prog, barH, barH/2);
    ctx.fillStyle = '#1DB954';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(padX + barW * prog, barY + barH/2, 16, 0, Math.PI*2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    const timeY = barY + 35;
    ctx.font = `28px 'Space Mono', monospace`;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(secToMMSS(Math.round(S.spDur * prog)), padX, timeY);
    ctx.textAlign = 'right';
    ctx.fillText(secToMMSS(S.spDur), cw - padX, timeY);

    const ctrlY = startY + 340;
    const cx = cw / 2;

    drawSpIcon(ctx, 'shuffle', cx - 220, ctrlY, 40, 'rgba(255,255,255,0.5)');
    drawSpIcon(ctx, 'prev', cx - 110, ctrlY, 40, '#ffffff');

    ctx.beginPath();
    ctx.arc(cx, ctrlY, 52, 0, Math.PI*2);
    ctx.fillStyle = '#1DB954';
    ctx.fill();
    
    drawSpIcon(ctx, 'pause', cx, ctrlY, 36, '#121212'); 

    drawSpIcon(ctx, 'next', cx + 110, ctrlY, 40, '#ffffff');
    drawSpIcon(ctx, 'repeat', cx + 220, ctrlY, 40, 'rgba(255,255,255,0.5)');

    const footY = canvas.height - 45;
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleDateString('en-US',{month:'short'}).toUpperCase()} ${now.getFullYear()}`;
    const timeStr = now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}).replace(':','.');
    
    ctx.font = `bold 22px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(29,185,84,0.7)';
    ctx.textBaseline = 'middle';
    
    const footText = `SPOTIFY  •  ${dateStr}  ${timeStr}`;
    const tw = ctx.measureText(footText).width;
    
    drawSpotifyLogo(ctx, cx - tw/2 - 20, footY, 32);
    ctx.textAlign = 'left';
    ctx.fillText(footText, cx - tw/2 + 6, footY + 2);

    $('fimg').src=canvas.toDataURL('image/jpeg',.95);
    goTo(5); confettiTime();
}

function clipText(ctx,text,maxW){
    if(ctx.measureText(text).width<=maxW) return text;
    let t=text;
    while(ctx.measureText(t+'…').width>maxW && t.length>0) t=t.slice(0,-1);
    return t+'…';
}
function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
}

function rrect(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
}
function mkGrad(ctx,css,w,h){
    try{
        const m=css.match(/linear-gradient\(([^,]+),(.+)\)$/s);
        if(!m) return null;
        let angle=135;
        const ad=m[1].trim();
        if(ad.includes('deg')) angle=parseFloat(ad);
        const stops=m[2].split(',').map(s=>s.trim()).filter(Boolean);
        const a=angle*Math.PI/180;
        const x1=w/2-Math.cos(a)*w*.75,y1=h/2-Math.sin(a)*h*.75;
        const x2=w/2+Math.cos(a)*w*.75,y2=h/2+Math.sin(a)*h*.75;
        const g=ctx.createLinearGradient(x1,y1,x2,y2);
        stops.forEach((s,i)=>{ try{g.addColorStop(i/Math.max(stops.length-1,1),s);}catch(e){} });
        return g;
    }catch(e){return null;}
}
function watermark(canvas,ctx){
    const now=new Date(),cw=canvas.width,ch=canvas.height;
    const tc=contrast(S.color,S.isGrad);
    const ac=(isDark(S.color)||S.isGrad)?'#ff7aaa':'#c4224f';
    ctx.textAlign='center';
    const lw=cw*.22;
    ctx.save(); ctx.strokeStyle=ac; ctx.globalAlpha=.26; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(cw/2-lw,ch-188); ctx.lineTo(cw/2+lw,ch-188); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.font=`italic bold ${Math.round(cw*.073)}px 'Playfair Display',serif`; ctx.fillStyle=ac;
    ctx.fillText('V-Photobooth',cw/2,ch-124); ctx.restore();
    ctx.save(); ctx.strokeStyle=ac; ctx.globalAlpha=.16; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(cw/2-lw,ch-99); ctx.lineTo(cw/2+lw,ch-99); ctx.stroke(); ctx.restore();
    const day=now.getDate(),month=now.toLocaleDateString('en-US',{month:'long'}).toUpperCase(),year=now.getFullYear();
    const time=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}).replace(':','.');
    ctx.save(); ctx.font=`600 ${Math.round(cw*.023)}px 'Space Mono',monospace`; ctx.fillStyle=tc; ctx.globalAlpha=.6;
    ctx.fillText(`${day} ${month} ${year}  \u2022  ${time}  \u2022  BY DENJI`,cw/2,ch-59); ctx.restore();
    $('fimg').src=canvas.toDataURL('image/jpeg',.95);
    goTo(5); confettiTime();
}
function confettiTime(){
    const colors=['#ff477e','#ff9abc','#ffffff','#ffd1dc','#ff1f61','#ffb3cb'],cfg={colors,shapes:['circle','square']};
    setTimeout(()=>confetti({...cfg,particleCount:88,spread:74,origin:{y:.55},scalar:1.1}),250);
    setTimeout(()=>{ confetti({...cfg,particleCount:44,angle:60,spread:54,origin:{x:0,y:.6}}); confetti({...cfg,particleCount:44,angle:120,spread:54,origin:{x:1,y:.6}}); },500);
    setTimeout(()=>confetti({...cfg,particleCount:38,spread:98,origin:{y:.34},gravity:.5,scalar:.8}),900);
}
function dlImg(){ const a=document.createElement('a'); a.download='v-photobooth-'+Date.now()+'.jpg'; a.href=$('cf').toDataURL('image/jpeg',.95); a.click(); }

buildUI();
