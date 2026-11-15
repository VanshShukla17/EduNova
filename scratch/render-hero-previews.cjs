const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Load our generator logic or composite sky + clouds + scene + desk transition at 360x800, 768x900, 1280x800, 1920x960
// Wait: let's read the raw PNG-8 files we generated and composite them over the exact CSS stepped sky bands + scrim + desk-800 below!
const ARTIFACT_DIR = 'C:/Users/harsh_aaghwa2/.gemini/antigravity/brain/b896a5cd-8329-4d38-a34e-5f585248a6d4';
const HERO_DIR = path.join(__dirname, '..', 'frontend', 'public', 'hero');

function decodePNG8(buf) {
  let offset = 8;
  let width = 0;
  let height = 0;
  let plte = [];
  let trns = [];
  const idatParts = [];

  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    } else if (type === 'PLTE') {
      for (let i = 0; i < data.length; i += 3) {
        plte.push([data[i], data[i + 1], data[i + 2]]);
      }
    } else if (type === 'tRNS') {
      for (let i = 0; i < data.length; i++) {
        trns.push(data[i]);
      }
    } else if (type === 'IDAT') {
      idatParts.push(data);
    }
    offset += 12 + len;
  }

  const raw = zlib.inflateSync(Buffer.concat(idatParts));
  const indices = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width + 1) + 1;
    for (let x = 0; x < width; x++) {
      indices[y * width + x] = raw[rowStart + x];
    }
  }
  return { width, height, plte, trns, indices };
}

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  CRC_TABLE[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function makeChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}
function encodeRGB(width, height, rgb) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2; // RGB
  const raw = Buffer.alloc(height * (width * 3 + 1));
  for (let y = 0; y < height; y++) {
    const r0 = y * (width * 3 + 1);
    raw[r0] = 0;
    rgb.copy(raw, r0 + 1, y * width * 3, (y + 1) * width * 3);
  }
  const idat = zlib.deflateSync(raw, { level: 6 });
  return Buffer.concat([sig, makeChunk('IHDR', ihdr), makeChunk('IDAT', idat), makeChunk('IEND', Buffer.alloc(0))]);
}

const clouds = decodePNG8(fs.readFileSync(path.join(HERO_DIR, 'hero-clouds.png')));
const landscape = decodePNG8(fs.readFileSync(path.join(HERO_DIR, 'hero-scene-landscape.png')));
const portrait = decodePNG8(fs.readFileSync(path.join(HERO_DIR, 'hero-scene-portrait.png')));

function renderViewportComposite(vw, vh, outName) {
  const isMobile = vw < 768;
  const scene = isMobile ? portrait : landscape;
  const heroH = Math.min(960, Math.max(isMobile ? 760 : 600, vh - 80)); // Leave 80px at bottom to show seamless --desk-800 transition!
  const rgb = Buffer.alloc(vw * vh * 3);

  function setPx(x, y, r, g, b) {
    if (x < 0 || x >= vw || y < 0 || y >= vh) return;
    const idx = (y * vw + x) * 3;
    rgb[idx] = r;
    rgb[idx + 1] = g;
    rgb[idx + 2] = b;
  }
  function blendPx(x, y, r, g, b, a) {
    if (x < 0 || x >= vw || y < 0 || y >= vh) return;
    const idx = (y * vw + x) * 3;
    rgb[idx] = Math.round(rgb[idx] * (1 - a) + r * a);
    rgb[idx + 1] = Math.round(rgb[idx + 1] * (1 - a) + g * a);
    rgb[idx + 2] = Math.round(rgb[idx + 2] * (1 - a) + b * a);
  }

  for (let y = 0; y < vh; y++) {
    for (let x = 0; x < vw; x++) {
      if (y < heroH) {
        const ny = y / heroH;
        if (ny < 0.34) setPx(x, y, 0x1c, 0x97, 0xe8);
        else if (ny < 0.54) setPx(x, y, 0x26, 0xa6, 0xf8);
        else if (ny < 0.68) setPx(x, y, 0x4a, 0xb7, 0xfa);
        else setPx(x, y, 0x5b, 0xc7, 0xf9);
      } else {
        // Desk --desk-800 (#052e27) + subtle 48px grid below hero to prove zero seam!
        const isGrid = x % 48 === 0 || y % 48 === 0;
        setPx(x, y, isGrid ? 16 : 5, isGrid ? 56 : 46, isGrid ? 49 : 39);
      }
    }
  }

  // Draw clouds layer (top: 4%, height: 36%)
  const cloudTop = Math.floor(heroH * 0.04);
  const cloudH = Math.floor(heroH * 0.36);
  const cloudScale = cloudH / clouds.height;
  for (let y = cloudTop; y < cloudTop + cloudH && y < heroH; y++) {
    const sy = Math.min(clouds.height - 1, Math.floor((y - cloudTop) / cloudScale));
    for (let x = 0; x < vw; x++) {
      const sx = Math.floor(x / cloudScale) % clouds.width;
      const cIdx = clouds.indices[sy * clouds.width + sx];
      if (cIdx !== 0) {
        const [r, g, b] = clouds.plte[cIdx];
        setPx(x, y, r, g, b);
      }
    }
  }

  // Apply scrim overlay (rgba(8,60,140,.45)) over the sky behind the text before drawing the foreground scene
  for (let y = 0; y < heroH; y++) {
    const ny = y / heroH;
    for (let x = 0; x < vw; x++) {
      const nx = x / vw;
      let alpha = 0;
      if (isMobile) {
        if (ny <= 0.54) alpha = 0.45;
        else if (ny < 0.74) alpha = 0.45 * (1 - (ny - 0.54) / 0.20);
      } else {
        if (nx <= 0.36) alpha = 0.45;
        else if (nx < 0.60) alpha = 0.45 * (1 - (nx - 0.36) / 0.24);
      }
      if (alpha > 0) blendPx(x, y, 8, 60, 140, alpha);
    }
  }

  // Draw scene layer (object-fit: cover; object-position: right bottom on desktop/tablet, center bottom on mobile)
  const scale = Math.max(vw / scene.width, heroH / scene.height);
  const dispW = scene.width * scale;
  const dispH = scene.height * scale;
  const offsetX = isMobile ? (vw - dispW) * 0.5 : (vw - dispW); // right bottom on >=768px, center bottom on <768px
  const offsetY = heroH - dispH; // aligned to bottom of hero

  for (let y = 0; y < heroH; y++) {
    const sy = Math.min(scene.height - 1, Math.max(0, Math.floor((y - offsetY) / scale)));
    for (let x = 0; x < vw; x++) {
      const sx = Math.min(scene.width - 1, Math.max(0, Math.floor((x - offsetX) / scale)));
      const cIdx = scene.indices[sy * scene.width + sx];
      if (cIdx !== 0) {
        const [r, g, b] = scene.plte[cIdx];
        setPx(x, y, r, g, b);
      }
    }
  }

  const outPath = path.join(ARTIFACT_DIR, outName);
  fs.writeFileSync(outPath, encodeRGB(vw, vh, rgb));
}

renderViewportComposite(360, 840, 'hero-preview-360.png');
renderViewportComposite(768, 840, 'hero-preview-768.png');
renderViewportComposite(1280, 800, 'hero-preview-1280.png');
renderViewportComposite(1920, 960, 'hero-preview-1920.png');
console.log('Rendered 4 viewport composite previews.');
