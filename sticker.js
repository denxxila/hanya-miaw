/* ================================================================
   STICKER DATA - Edit this file to add/remove sticker packs
   ================================================================

   Format:
   {
     name: "Pack Name",          // Nama kategori
     icon: "fa-icon-name",       // FontAwesome icon class
     stickers: [
       { id: "unique-id", url: "https://image-url.png" },
       ...
     ]
   }

   Tips:
   - Tambah pack baru: copy salah satu pack, ganti name/icon/stickers
   - Tambah sticker: tambah object {id, url} di array stickers
   - Hapus sticker: hapus object dari array stickers
   - Hapus pack: hapus seluruh object pack
   - Icon tersedia: fa-face-smile-hearts, fa-heart, fa-leaf,
     fa-wand-magic-sparkles, fa-party-horn, fa-star, fa-cat,
     fa-dog, fa-cloud, fa-fire, fa-gem, fa-crown, fa-music,
     fa-shapes, fa-paw, fa-bolt, fa-sparkles, fa-cookie
   ================================================================ */

const STICKER_PACKS = [

  // ──────────── KATEGORI: FACES ────────────
  {
    name: "Faces",
    icon: "fa-face-smile-hearts",
    stickers: [
      { id: "heart-eyes",      url: "https://files.catbox.moe/ruhjs3.png" },
      { id: "star-struck",     url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f929.png" },
      { id: "wink",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f609.png" },
      { id: "cool",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60e.png" },
      { id: "angel",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f607.png" },
      { id: "devil",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f47f.png" },
      { id: "kiss",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f618.png" },
      { id: "laugh-cry",       url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f923.png" },
      { id: "blush",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60a.png" },
      { id: "sunglasses",      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f60e.png" },
      { id: "thinking",        url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f914.png" },
      { id: "pleading",        url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f97a.png" },
    ]
  },

  // ──────────── KATEGORI: HEARTS & LOVE ────────────
  {
    name: "Hearts",
    icon: "fa-heart",
    stickers: [
      { id: "heart-red",       url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2764.png" },
      { id: "heart-sparkle",   url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f496.png" },
      { id: "heart-grow",      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f497.png" },
      { id: "heart-beat",      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f493.png" },
      { id: "heart-broken",    url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f494.png" },
      { id: "heart-arrow",     url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f498.png" },
      { id: "heart-ribbon",    url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f49d.png" },
      { id: "kiss-mark",       url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f48b.png" },
      { id: "couple-heart",    url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f491.png" },
      { id: "heart-box",       url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f49e.png" },
      { id: "love-letter",     url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f48c.png" },
      { id: "two-hearts",      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f495.png" },
    ]
  },

  // ──────────── KATEGORI: NATURE ────────────
  {
    name: "Nature",
    icon: "fa-leaf",
    stickers: [
      { id: "flower-red",      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f339.png" },
      { id: "sunflower",       url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f33b.png" },
      { id: "cherry-blossom",  url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f338.png" },
      { id: "rose",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f33a.png" },
      { id: "hibiscus",        url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f337.png" },
      { id: "butterfly",       url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f98b.png" },
      { id: "sparkles",        url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2728.png" },
      { id: "star",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2b50.png" },
      { id: "rainbow",         url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f308.png" },
      { id: "cloud",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2601.png" },
      { id: "moon",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f319.png" },
      { id: "crescent",        url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f312.png" },
    ]
  },

  // ──────────── KATEGORI: FUN & PARTY ────────────
  {
    name: "Fun",
    icon: "fa-party-horn",
    stickers: [
      { id: "party",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png" },
      { id: "tada",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f38a.png" },
      { id: "balloon",         url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f388.png" },
      { id: "gift",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f381.png" },
      { id: "confetti",        url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f38a.png" },
      { id: "fireworks",       url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f386.png" },
      { id: "disco",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1fa69.png" },
      { id: "clown",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f921.png" },
      { id: "alien",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f47d.png" },
      { id: "ghost",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f47b.png" },
      { id: "unicorn",         url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f984.png" },
      { id: "rocket",          url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f680.png" },
    ]
  },

  // ──────────── KATEGORI: FOOD & DRINK ────────────
  {
    name: "Food",
    icon: "fa-cookie",
    stickers: [
      { id: "cookie",          url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f36a.png" },
      { id: "cake",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f370.png" },
      { id: "ice-cream",       url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f368.png" },
      { id: "lollipop",        url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f36d.png" },
      { id: "candy",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f36c.png" },
      { id: "donut",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f369.png" },
      { id: "coffee",          url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2615.png" },
      { id: "bubble-tea",      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f9cb.png" },
      { id: "strawberry",      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f353.png" },
      { id: "cherry",          url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f352.png" },
      { id: "peach",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f351.png" },
      { id: "watermelon",      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f349.png" },
    ]
  },

  // ──────────── KATEGORI: CROWN & SPARKLE ────────────
  {
    name: "Glamour",
    icon: "fa-crown",
    stickers: [
      { id: "crown",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f451.png" },
      { id: "gem",             url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f48e.png" },
      { id: "ring",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f48d.png" },
      { id: "lipstick",        url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f484.png" },
      { id: "nail-polish",     url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f485.png" },
      { id: "sunglasses-glam", url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f576.png" },
      { id: "diamond",         url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4a0.png" },
      { id: "fire",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f525.png" },
      { id: "lightning",       url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/26a1.png" },
      { id: "glowing-star",    url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f31f.png" },
      { id: "hundred",         url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4af.png" },
      { id: "trophy",          url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3c6.png" },
    ]
  },

  // ──────────── KATEGORI: ANIMALS ────────────
  {
    name: "Animals",
    icon: "fa-paw",
    stickers: [
      { id: "cat-face",        url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f431.png" },
      { id: "dog-face",        url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f436.png" },
      { id: "bear",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f43b.png" },
      { id: "panda",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f43c.png" },
      { id: "bunny",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f430.png" },
      { id: "fox",             url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f98a.png" },
      { id: "penguin",         url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f427.png" },
      { id: "chick",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f425.png" },
      { id: "koala",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f992.png" },
      { id: "hamster",         url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f439.png" },
      { id: "owl",             url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f989.png" },
      { id: "dolphin",         url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f42c.png" },
    ]
  },

  // ──────────── KATEGORI: MUSIC ────────────
  {
    name: "Music",
    icon: "fa-music",
    stickers: [
      { id: "music-note",      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3b5.png" },
      { id: "music-notes",     url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3b6.png" },
      { id: "headphones",      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3a7.png" },
      { id: "microphone",      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3a4.png" },
      { id: "guitar",          url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3b8.png" },
      { id: "piano",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3b9.png" },
      { id: "sax",             url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3b7.png" },
      { id: "drum",            url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f941.png" },
      { id: "radio",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4fb.png" },
      { id: "cd",              url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4bf.png" },
      { id: "vinyl",           url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3b6.png" },
      { id: "dancer",          url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f483.png" },
    ]
  },

];
