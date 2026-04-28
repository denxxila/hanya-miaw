'use strict';

/* ═══════════════════════════════════
   STEP 3 — FILTERS & RATIO
   ═══════════════════════════════════ */

function initStep3() {
    loadState();

    // Restore ratio selection
    document.querySelectorAll('#rgrp .pill').forEach(b => b.classList.remove('sel'));
    const ratioBtn = document.querySelector(`#rgrp .pill[onclick*="'${S.ratio}'"]`);
    if (ratioBtn) ratioBtn.classList.add('sel');

    // Restore filter selection
    const filterContainer = document.getElementById('filter-grid');
    if (filterContainer) {
        filterContainer.querySelectorAll('.card').forEach(c => c.classList.remove('sel'));
        const filterBtn = filterContainer.querySelector(`.card[onclick*="'${S.filter}'"]`);
        if (filterBtn) filterBtn.classList.add('sel');
    }
}

function selRatio(v, el) {
    S.ratio = v;
    document.querySelectorAll('#rgrp .pill').forEach(b => b.classList.remove('sel'));
    el.classList.add('sel');
    saveState();

    // Update live preview aspect ratios
    const [rw, rh] = v.split(':');
    const ar = rw + '/' + rh;
    document.querySelectorAll('.spp, .gpp, .sp-photo-cell').forEach(cell => {
        cell.style.aspectRatio = ar;
    });
}

function selCard(type, v, el) {
    S[type] = v;
    el.parentElement.querySelectorAll('.card').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
    saveState();
}

function goToCamera() {
    saveState();
    location.href = 'camera.html';
}

document.addEventListener('DOMContentLoaded', initStep3);
