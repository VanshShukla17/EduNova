const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT_DIR = path.join(__dirname, '..', 'frontend', 'public', 'hero');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Strictly <= 32 colors (Index 0 is transparent via 1-bit tRNS)
const PALETTE_HEX = [
  '#000000', // 0: Transparent (1-bit alpha = 0)
  // Sky (4)
  '#1c97e8', // 1: sky top
  '#26a6f8', // 2: sky upper-mid
  '#4ab7fa', // 3: sky lower-mid
  '#5bc7f9', // 4: sky horizon
  // Clouds & White pages/shirt (5)
  '#eef7fd', // 5: cloud highlight / cream-white page & shirt highlight
  '#d1ecf2', // 6: cloud light
  '#a5dcec', // 7: cloud mid-light
  '#92d3e5', // 8: cloud mid
  '#69cdfb', // 9: cloud shadow
  // Skyline (2)
  '#80c4ff', // 10: skyline hazy blue
  '#657e7f', // 11: tower grey-teal
  // Grass (3)
  '#8ebc78', // 12: grass sunlit pale
  '#83c858', // 13: grass bright
  '#558a42', // 14: grass mid
  // Foliage (5)
  '#48785a', // 15: foliage light
  '#3a6858', // 16: foliage mid-light
  '#286658', // 17: foliage mid
  '#234f41', // 18: foliage dark
  '#19312d', // 19: foliage deepest shadow
  // Trunk & Bark (2)
  '#504738', // 20: trunk warm brown
  '#363b34', // 21: trunk dark shadow
  // Path & Book cover (2)
  '#c0a984', // 22: dirt path / sunlit bark / warm cream page shade
  '#c0aa6d', // 23: book cover gold-tan
  // Desk transition (1)
  '#052e27', // 24: --desk-800 bottom seamless dither target
  // Child, Backpack, Flowers & Sparkles (7) -> Total = 32 colors (0..31)
  '#a6663e', // 25: child warm brown skin
  '#784426', // 26: child skin shadow
  '#181c26', // 27: child black hair & book text/shoes
  '#23365c', // 28: child navy bottoms
  '#d93829', // 29: red backpack & red wildflowers
  '#facc15', // 30: yellow dandelion flower, pencil & magic sparkles
  '#f48fb1', // 31: pink wildflowers
];

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const PALETTE_RGB = PALETTE_HEX.map(hexToRgb);

const C = {
  TRANSPARENT: 0,
  SKY_1: 1,
  SKY_2: 2,
  SKY_3: 3,
  SKY_4: 4,
  CLOUD_HI: 5,
  CLOUD_1: 6,
  CLOUD_2: 7,
  CLOUD_3: 8,
  CLOUD_4: 9,
  SKYLINE: 10,
  TOWER: 11,
  GRASS_1: 12,
  GRASS_2: 13,
  GRASS_3: 14,
  FOLIAGE_1: 15,
  FOLIAGE_2: 16,
  FOLIAGE_3: 17,
  FOLIAGE_4: 18,
  FOLIAGE_5: 19,
  TRUNK_1: 20,
  TRUNK_2: 21,
  PATH: 22,
  BOOK_GOLD: 23,
  DESK: 24,
  SKIN_1: 25,
  SKIN_2: 26,
  HAIR: 27,
  NAVY: 28,
  RED: 29,
  YELLOW: 30,
  PINK: 31,
};

const BAYER8 = [
  [ 0, 32,  8, 40,  2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44,  4, 36, 14, 46,  6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [ 3, 35, 11, 43,  1, 33,  9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47,  7, 39, 13, 45,  5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

function bayer(x, y) {
  return BAYER8[((y % 8) + 8) % 8][((x % 8) + 8) % 8] / 64;
}

function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263) ^ 0x5bf03635;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

function dither2(x, y, c1, c2, t) {
  if (t <= 0) return c1;
  if (t >= 1) return c2;
  return bayer(x, y) < t ? c2 : c1;
}

function ditherRamp(x, y, colors, t) {
  const clamped = Math.max(0, Math.min(0.9999, t));
  const scaled = clamped * (colors.length - 1);
  const idx = Math.floor(scaled);
  const frac = scaled - idx;
  return dither2(x, y, colors[idx], colors[Math.min(colors.length - 1, idx + 1)], frac);
}

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePNG8(width, height, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 3; // Indexed-color PNG-8
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const plte = Buffer.alloc(PALETTE_RGB.length * 3);
  for (let i = 0; i < PALETTE_RGB.length; i++) {
    plte[i * 3] = PALETTE_RGB[i][0];
    plte[i * 3 + 1] = PALETTE_RGB[i][1];
    plte[i * 3 + 2] = PALETTE_RGB[i][2];
  }

  const trns = Buffer.from([0]);

  const raw = Buffer.alloc(height * (width + 1));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < width; x++) {
      raw[rowStart + 1 + x] = pixels[y * width + x] & 0xff;
    }
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('PLTE', plte),
    makeChunk('tRNS', trns),
    makeChunk('IDAT', idat),
    makeChunk('IEND', iend),
  ]);
}

class PixelSurface {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.data = new Uint8Array(w * h);
  }
  set(x, y, c) {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix >= 0 && ix < this.w && iy >= 0 && iy < this.h) {
      this.data[iy * this.w + ix] = c;
    }
  }
  get(x, y) {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix >= 0 && ix < this.w && iy >= 0 && iy < this.h) {
      return this.data[iy * this.w + ix];
    }
    return 0;
  }
  fillRect(x, y, w, h, c) {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(this.w, Math.floor(x + w));
    const y1 = Math.min(this.h, Math.floor(y + h));
    for (let py = y0; py < y1; py++) {
      for (let px = x0; px < x1; px++) {
        this.data[py * this.w + px] = typeof c === 'function' ? c(px, py) : c;
      }
    }
  }
  fillCircle(cx, cy, r, c) {
    const x0 = Math.max(0, Math.floor(cx - r));
    const y0 = Math.max(0, Math.floor(cy - r));
    const x1 = Math.min(this.w - 1, Math.ceil(cx + r));
    const y1 = Math.min(this.h - 1, Math.ceil(cy + r));
    const r2 = r * r;
    for (let py = y0; py <= y1; py++) {
      for (let px = x0; px <= x1; px++) {
        const dx = px - cx;
        const dy = py - cy;
        if (dx * dx + dy * dy <= r2) {
          this.data[py * this.w + px] = typeof c === 'function' ? c(px, py, dx, dy) : c;
        }
      }
    }
  }
  fillEllipse(cx, cy, rx, ry, c) {
    const x0 = Math.max(0, Math.floor(cx - rx));
    const y0 = Math.max(0, Math.floor(cy - ry));
    const x1 = Math.min(this.w - 1, Math.ceil(cx + rx));
    const y1 = Math.min(this.h - 1, Math.ceil(cy + ry));
    for (let py = y0; py <= y1; py++) {
      for (let px = x0; px <= x1; px++) {
        const nx = (px - cx) / rx;
        const ny = (py - cy) / ry;
        if (nx * nx + ny * ny <= 1) {
          this.data[py * this.w + px] = typeof c === 'function' ? c(px, py, nx, ny) : c;
        }
      }
    }
  }
  drawLine(x0, y0, x1, y1, c, thickness = 1) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) {
      const px = Math.round(x0 + ((x1 - x0) * i) / steps);
      const py = Math.round(y0 + ((y1 - y0) * i) / steps);
      if (thickness <= 1) {
        this.set(px, py, typeof c === 'function' ? c(px, py) : c);
      } else {
        this.fillCircle(px, py, thickness / 2, c);
      }
    }
  }
}

// Painter's-algorithm layered pixel cumulus clouds (back-to-front puffs with soft metaball union per layer,
// eliminating Voronoi crease lines and creating crisp 16-bit stepped cumulus bands like the reference!)
function drawCloudBank(surf, puffs, baseCutY = 9999) {
  const yMax = Math.min(surf.h - 1, baseCutY);
  // Group puffs by layer (0 = back/shadowed, 1 = mid body, 2 = front sunlit billows)
  for (let py = 0; py <= yMax; py++) {
    for (let px = 0; px < surf.w; px++) {
      // Smooth metaball field so overlapping puffs merge into billowy cumulus shapes
      let field = 0;
      let weightedLight = 0;
      let weightSum = 0;
      let rimCheck = 0;

      for (let i = 0; i < puffs.length; i++) {
        const p = puffs[i];
        const dx = (px - p.x) / p.rx;
        const dy = (py - p.y) / p.ry;
        const d2 = dx * dx + dy * dy;
        if (d2 < 1.35) {
          const w = Math.pow(Math.max(0, 1.15 - d2), 2.2);
          field += w;
          // Sunlit on top-left of each puff + global vertical height brightness
          const localLight = (-dx * 0.38 - dy * 0.68 + 0.52) + (p.bright || 0);
          weightedLight += w * localLight;
          weightSum += w;
          if (d2 < 1.0 && dy < -0.25 && dx < 0.45) {
            rimCheck = Math.max(rimCheck, 1.0 - d2);
          }
        }
      }

      if (field >= 0.16 && weightSum > 0) {
        const light = weightedLight / weightSum;
        // Stepped 16-bit cloud bands with subtle Bayer dithering at transitions
        let idx;
        if (field < 0.25 && light > 0.52) {
          idx = C.CLOUD_HI; // Crisp bright sunlit upper-left rim
        } else if (light > 0.76) {
          idx = dither2(px, py, C.CLOUD_1, C.CLOUD_HI, (light - 0.76) * 3.5);
        } else if (light > 0.54) {
          idx = dither2(px, py, C.CLOUD_2, C.CLOUD_1, (light - 0.54) * 4.0);
        } else if (light > 0.34) {
          idx = dither2(px, py, C.CLOUD_3, C.CLOUD_2, (light - 0.34) * 4.5);
        } else {
          idx = dither2(px, py, C.CLOUD_4, C.CLOUD_3, Math.max(0, (light - 0.12) * 4.0));
        }
        surf.set(px, py, idx);
      }
    }
  }
}

// Draw distant pixel-art city skyline + central slim tiered spire tower
// Extends 10px below horizonY so the rolling meadow hill overlaps it with zero gap!
function drawSkyline(surf, xStart, xEnd, horizonY, scale = 1) {
  const buildings = [
    { x: 0.00, w: 12, h: 14, style: 'flat' },
    { x: 0.05, w: 10, h: 20, style: 'step' },
    { x: 0.09, w: 14, h: 16, style: 'flat' },
    { x: 0.15, w: 9,  h: 24, style: 'flat' },
    { x: 0.19, w: 16, h: 18, style: 'flat' },
    { x: 0.25, w: 12, h: 30, style: 'antenna' },
    { x: 0.30, w: 15, h: 21, style: 'flat' },
    { x: 0.36, w: 11, h: 27, style: 'step' },
    { x: 0.41, w: 18, h: 22, style: 'flat' },
    { x: 0.48, w: 12, h: 17, style: 'flat' },
    { x: 0.55, w: 13, h: 54, style: 'spire' },
    { x: 0.61, w: 14, h: 20, style: 'flat' },
    { x: 0.67, w: 12, h: 26, style: 'step' },
    { x: 0.73, w: 16, h: 18, style: 'flat' },
    { x: 0.80, w: 14, h: 23, style: 'flat' },
    { x: 0.86, w: 18, h: 17, style: 'flat' },
    { x: 0.93, w: 14, h: 14, style: 'flat' },
  ];

  const span = xEnd - xStart;
  const bottomOverlap = 10;
  for (const b of buildings) {
    const bx = Math.round(xStart + b.x * span);
    const bw = Math.max(5, Math.round(b.w * scale));
    const bh = Math.max(6, Math.round(b.h * scale));
    const by = horizonY - bh;

    if (b.style === 'spire') {
      const baseW = bw;
      const baseH = Math.round(bh * 0.52);
      const midW = Math.max(5, baseW - 4);
      const midH = Math.round(bh * 0.26);
      const topW = Math.max(3, midW - 4);
      const topH = Math.round(bh * 0.14);
      const spireH = bh - baseH - midH - topH;

      surf.fillRect(bx, horizonY - baseH, baseW, baseH + bottomOverlap, (px, py) => {
        const relX = px - bx;
        if (relX < 3) return C.CLOUD_1;
        if (relX === 3) return C.PATH;
        if ((py - horizonY) % 3 === 0 && relX % 2 === 1) return C.SKY_3;
        return C.TOWER;
      });
      const mx = bx + Math.floor((baseW - midW) / 2);
      surf.fillRect(mx, horizonY - baseH - midH, midW, midH, (px, py) => {
        const relX = px - mx;
        if (relX < 2) return C.CLOUD_1;
        if (py % 2 === 0 && relX % 2 === 1) return C.CLOUD_2;
        return C.TOWER;
      });
      const tx = bx + Math.floor((baseW - topW) / 2);
      surf.fillRect(tx, horizonY - baseH - midH - topH, topW, topH, (px) =>
        px === tx ? C.CLOUD_HI : C.TOWER
      );
      const sx = bx + Math.floor(baseW / 2);
      surf.fillRect(sx, by - 4, 1, spireH + 4, C.CLOUD_1);
      surf.set(sx, by - 5, C.CLOUD_HI);
    } else {
      surf.fillRect(bx, by, bw, bh + bottomOverlap, (px, py) => {
        const relX = px - bx;
        const relY = py - by;
        if (relX <= 1) return C.CLOUD_2;
        if (relY === 0) return C.CLOUD_1;
        if (relY > 3 && relY % 4 === 0 && relX > 2 && relX < bw - 2 && relX % 3 === 0) {
          return bayer(px, py) < 0.5 ? C.CLOUD_2 : C.SKY_3;
        }
        return dither2(px, py, C.SKYLINE, C.SKY_3, (relX / bw) * 0.45);
      });
      if (b.style === 'step') {
        surf.fillRect(bx + 2, by - 4, Math.max(3, bw - 4), 4, C.SKYLINE);
      } else if (b.style === 'antenna') {
        surf.fillRect(bx + Math.floor(bw / 2), by - 6, 1, 6, C.SKYLINE);
      }
    }
  }
}

// Helper to render organic pixel-art leaf clusters (eliminates smooth geometric sphere look!)
function drawFoliageClusters(surf, clusters, xMin, xMax, yMin, yMax) {
  const ramp = [C.FOLIAGE_5, C.FOLIAGE_4, C.FOLIAGE_3, C.FOLIAGE_2, C.FOLIAGE_1, C.GRASS_2];
  for (let py = Math.max(0, yMin); py <= Math.min(surf.h - 1, yMax); py++) {
    for (let px = Math.max(0, xMin); px <= Math.min(surf.w - 1, xMax); px++) {
      let field = 0;
      let weightedL = 0;
      let weightSum = 0;
      // Pixel leaf-tuft texture at 2px scale
      const leafNoise =
        (hash2(px >> 1, py >> 1) - 0.5) * 0.24 +
        Math.sin(px * 0.45) * Math.cos(py * 0.45) * 0.10;

      for (let i = 0; i < clusters.length; i++) {
        const c = clusters[i];
        const dx = (px - c.x) / c.rx;
        const dy = (py - c.y) / c.ry;
        const d2 = dx * dx + dy * dy + leafNoise * 0.55;
        if (d2 < 1.15) {
          const w = Math.pow(Math.max(0, 1.1 - d2), 2.0);
          field += w;
          const localL = c.light - dx * 0.24 - dy * 0.36 + leafNoise * 0.22;
          weightedL += w * localL;
          weightSum += w;
        }
      }

      if (field >= 0.14 && weightSum > 0) {
        const l = Math.max(0.02, Math.min(0.98, weightedL / weightSum));
        const idx = ditherRamp(px, py, ramp, l);
        surf.set(px, py, idx);
      }
    }
  }
}

// Draw a lush pixel-art deciduous tree with organic leaf clusters + optional park bench
function drawParkTree(surf, cx, baseY, trunkW, trunkH, canopyR, isBenchTree = false) {
  const tx0 = Math.round(cx - trunkW / 2);
  for (let py = baseY - trunkH; py <= baseY; py++) {
    const flare = py > baseY - 6 ? (py - (baseY - 6)) * 0.7 : 0;
    const left = Math.round(tx0 - flare);
    const right = Math.round(tx0 + trunkW + flare);
    for (let px = left; px <= right; px++) {
      const rel = (px - left) / Math.max(1, right - left);
      const c = rel < 0.35 ? C.TRUNK_1 : dither2(px, py, C.TRUNK_1, C.TRUNK_2, (rel - 0.3) * 1.4);
      surf.set(px, py, c);
    }
  }

  surf.drawLine(cx, baseY - trunkH + 6, cx - canopyR * 0.45, baseY - trunkH - 4, C.TRUNK_2, 2);
  surf.drawLine(cx, baseY - trunkH + 4, cx + canopyR * 0.45, baseY - trunkH - 5, C.TRUNK_2, 2);

  const cy = baseY - trunkH - canopyR * 0.55;
  const clusters = [
    { x: cx - canopyR * 0.55, y: cy + canopyR * 0.16, rx: canopyR * 0.56, ry: canopyR * 0.48, light: 0.68 },
    { x: cx + canopyR * 0.55, y: cy + canopyR * 0.18, rx: canopyR * 0.54, ry: canopyR * 0.48, light: 0.24 },
    { x: cx - canopyR * 0.38, y: cy - canopyR * 0.32, rx: canopyR * 0.58, ry: canopyR * 0.52, light: 0.88 },
    { x: cx + canopyR * 0.32, y: cy - canopyR * 0.30, rx: canopyR * 0.56, ry: canopyR * 0.50, light: 0.46 },
    { x: cx - canopyR * 0.04, y: cy - canopyR * 0.55, rx: canopyR * 0.62, ry: canopyR * 0.52, light: 0.84 },
    { x: cx + canopyR * 0.02, y: cy + canopyR * 0.06, rx: canopyR * 0.68, ry: canopyR * 0.56, light: 0.48 },
  ];

  drawFoliageClusters(
    surf,
    clusters,
    Math.floor(cx - canopyR * 1.3),
    Math.ceil(cx + canopyR * 1.3),
    Math.floor(cy - canopyR * 1.25),
    Math.ceil(cy + canopyR * 0.95)
  );

  if (isBenchTree) {
    const bx = Math.round(cx - 11);
    const by = baseY - 6;
    const bw = 22;
    surf.fillRect(bx - 2, baseY - 1, bw + 4, 2, C.FOLIAGE_4);
    surf.fillRect(bx, by, bw, 2, C.TRUNK_1);
    surf.fillRect(bx, by + 3, bw, 2, C.TRUNK_1);
    surf.fillRect(bx - 1, by + 5, bw + 2, 2, C.PATH);
    surf.fillRect(bx + 1, by, 2, 9, C.TRUNK_2);
    surf.fillRect(bx + bw - 3, by, 2, 9, C.TRUNK_2);
    surf.fillRect(bx + Math.floor(bw / 2), by + 1, 1, 7, C.TRUNK_2);
  }
}

// Draw the huge right-side oak tree + deep forest backdrop behind the floating cards
function drawRightForestAndOak(surf, isPortrait = false) {
  const w = surf.w;
  const h = surf.h;

  const forestClusters = isPortrait
    ? [
        { x: w * 0.60, y: h * 0.62, rx: 48, ry: 34, light: 0.26 },
        { x: w * 0.68, y: h * 0.56, rx: 48, ry: 34, light: 0.30 },
        { x: w * 0.74, y: h * 0.48, rx: 48, ry: 38, light: 0.38 },
        { x: w * 0.86, y: h * 0.40, rx: 52, ry: 42, light: 0.48 },
        { x: w * 0.95, y: h * 0.30, rx: 56, ry: 46, light: 0.58 },
        { x: w * 0.88, y: h * 0.20, rx: 54, ry: 42, light: 0.66 },
        { x: w * 0.96, y: h * 0.12, rx: 58, ry: 44, light: 0.54 },
        { x: w * 0.82, y: h * 0.58, rx: 56, ry: 38, light: 0.20 },
      ]
    : [
        { x: w * 0.60, y: h * 0.58, rx: 38, ry: 28, light: 0.32 },
        { x: w * 0.68, y: h * 0.48, rx: 48, ry: 36, light: 0.42 },
        { x: w * 0.75, y: h * 0.36, rx: 52, ry: 38, light: 0.54 },
        { x: w * 0.83, y: h * 0.25, rx: 58, ry: 42, light: 0.64 },
        { x: w * 0.91, y: h * 0.16, rx: 64, ry: 46, light: 0.70 },
        { x: w * 0.74, y: h * 0.56, rx: 56, ry: 36, light: 0.20 },
        { x: w * 0.86, y: h * 0.48, rx: 58, ry: 42, light: 0.25 },
        // Top-right overhanging oak canopy
        { x: w * 0.66, y: h * 0.02, rx: 48, ry: 22, light: 0.48 },
        { x: w * 0.78, y: h * 0.03, rx: 58, ry: 26, light: 0.58 },
        { x: w * 0.92, y: h * 0.04, rx: 62, ry: 30, light: 0.44 },
      ];

  drawFoliageClusters(surf, forestClusters, Math.floor(w * 0.46), w - 1, 0, Math.floor(h * 0.70));

  // Huge oak tree trunk on the far right edge
  const trunkTopY = isPortrait ? Math.floor(h * 0.22) : 0;
  const trunkBaseY = isPortrait ? Math.floor(h * 0.64) : Math.floor(h * 0.63);
  const trunkCenterX = Math.floor(w * 0.94);
  const trunkHalfW = isPortrait ? 13 : 20;

  for (let py = trunkTopY; py <= trunkBaseY; py++) {
    const t = (py - trunkTopY) / Math.max(1, trunkBaseY - trunkTopY);
    const rootFlare = t > 0.72 ? Math.pow((t - 0.72) / 0.28, 1.7) * (isPortrait ? 18 : 28) : 0;
    const leftEdge = Math.round(trunkCenterX - trunkHalfW - rootFlare + Math.sin(py * 0.12) * 2);
    const rightEdge = w - 1;

    for (let px = leftEdge; px <= rightEdge; px++) {
      const relX = (px - leftEdge) / Math.max(1, rightEdge - leftEdge);
      const ridge = Math.sin(px * 0.65 + Math.sin(py * 0.15) * 1.5);
      let c = C.TRUNK_1;
      if (relX < 0.18) {
        c = dither2(px, py, C.PATH, C.TRUNK_1, relX * 4);
      } else if (ridge > 0.45 && relX < 0.65) {
        c = C.TRUNK_1;
      } else {
        c = dither2(px, py, C.TRUNK_1, C.TRUNK_2, 0.55 + relX * 0.35);
      }
      surf.set(px, py, c);
    }
  }

  // Overhanging canopy cluster in front of upper trunk in portrait & landscape so trunk top never looks flat-cut
  const frontCanopy = isPortrait
    ? [
        { x: w * 0.92, y: h * 0.19, rx: 32, ry: 22, light: 0.62 },
        { x: w * 0.98, y: h * 0.24, rx: 28, ry: 20, light: 0.42 },
      ]
    : [
        { x: w * 0.90, y: h * 0.04, rx: 38, ry: 18, light: 0.54 },
        { x: w * 0.97, y: h * 0.06, rx: 32, ry: 16, light: 0.38 },
      ];
  drawFoliageClusters(surf, frontCanopy, Math.floor(w * 0.75), w - 1, 0, Math.floor(h * 0.32));
}

function drawMeadowAndForeground(surf, horizonY, isPortrait = false) {
  const w = surf.w;
  const h = surf.h;

  for (let py = horizonY - 12; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const nx = px / w;
      const hillOffset =
        Math.sin(nx * Math.PI * 1.6 + 0.4) * 4 +
        (nx > 0.55 ? -(nx - 0.55) * 20 : 0);
      const localHorizon = Math.round(horizonY + hillOffset);
      if (py < localHorizon) continue;

      const ny = (py - localHorizon) / Math.max(1, h - localHorizon);
      const grassWave =
        Math.sin(px * 0.06 + py * 0.12) * 0.12 +
        (hash2(px >> 1, py >> 1) - 0.5) * 0.14;
      const treeShade = nx > 0.62 && ny < 0.45 ? (nx - 0.62) * 0.65 : 0;
      const shadeVal = Math.max(0, Math.min(1, ny * 0.85 - grassWave + treeShade));

      const meadowRamp = [C.GRASS_1, C.GRASS_2, C.GRASS_3, C.FOLIAGE_1, C.FOLIAGE_3, C.FOLIAGE_4, C.FOLIAGE_5];
      let c = ditherRamp(px, py, meadowRamp, shadeVal);

      const pathProgress = Math.max(0, Math.min(1, (py - (horizonY + 2)) / (h * 0.24)));
      if (py >= horizonY + 2 && py <= horizonY + Math.floor(h * 0.26)) {
        const pathCenterX = isPortrait
          ? w * (0.42 - pathProgress * 0.45)
          : w * (0.39 - Math.pow(pathProgress, 0.85) * 0.41);
        const pathHalfW = 1.5 + pathProgress * (isPortrait ? 11 : 16);
        const dist = Math.abs(px - pathCenterX);
        if (dist < pathHalfW) {
          const edgeT = dist / pathHalfW;
          if (edgeT < 0.65) {
            c = dither2(px, py, C.PATH, C.GRASS_1, edgeT * 0.35);
          } else {
            c = dither2(px, py, C.PATH, C.GRASS_3, (edgeT - 0.6) * 2.2);
          }
        }
      }

      surf.set(px, py, c);
    }
  }

  // Pixel grass blade tufts across the meadow
  const tuftCount = isPortrait ? 90 : 160;
  for (let i = 0; i < tuftCount; i++) {
    const tx = Math.floor(hash2(i, 10) * (w - 8)) + 4;
    const ty = Math.floor(horizonY + 8 + hash2(i, 20) * (h - horizonY - 34));
    const current = surf.get(tx, ty);
    if (current === C.PATH) continue;
    const bladeColor = ty < horizonY + 35 ? C.GRASS_1 : C.GRASS_2;
    surf.set(tx, ty, bladeColor);
    surf.set(tx, ty - 1, bladeColor);
    if (i % 2 === 0) {
      surf.set(tx - 1, ty, bladeColor);
      surf.set(tx + 1, ty - 1, bladeColor);
    }
  }

  // Foreground clover bushes (bottom-left)
  const cloverMaxX = isPortrait ? Math.floor(w * 0.36) : Math.floor(w * 0.40);
  const cloverStartY = Math.floor(h * 0.77);
  for (let i = 0; i < (isPortrait ? 28 : 55); i++) {
    const cx = Math.floor(hash2(i, 31) * cloverMaxX);
    const cy = Math.floor(cloverStartY + hash2(i, 32) * (h - 24 - cloverStartY));
    const leafCol = i % 3 === 0 ? C.GRASS_3 : i % 2 === 0 ? C.FOLIAGE_1 : C.FOLIAGE_3;
    surf.fillRect(cx - 2, cy, 2, 2, leafCol);
    surf.fillRect(cx + 1, cy, 2, 2, leafCol);
    surf.fillRect(cx - 1, cy - 2, 2, 2, C.GRASS_2);
    surf.set(cx, cy + 2, C.FOLIAGE_5);
  }

  // Iconic yellow flower / dandelion left of center
  const fx = isPortrait ? Math.floor(w * 0.24) : Math.floor(w * 0.42);
  const fy = isPortrait ? Math.floor(h * 0.78) : Math.floor(h * 0.76);
  surf.drawLine(fx, fy, fx + 3, fy + 18, C.FOLIAGE_4, 1);
  surf.drawLine(fx + 1, fy, fx + 4, fy + 18, C.GRASS_3, 1);
  surf.drawLine(fx + 3, fy + 13, fx - 5, fy + 9, C.GRASS_3, 2);
  surf.drawLine(fx + 4, fy + 14, fx + 11, fy + 10, C.FOLIAGE_1, 2);
  surf.fillEllipse(fx, fy - 2, 6, 5, (px, py, nx, ny) => {
    if (nx + ny < -0.2) return C.YELLOW;
    return dither2(px, py, C.YELLOW, C.BOOK_GOLD, 0.55);
  });
  surf.fillRect(fx - 3, fy + 2, 6, 2, C.FOLIAGE_3);

  // Wildflowers on the right below the oak trunk (red, pink, white)
  const wfStartX = isPortrait ? Math.floor(w * 0.76) : Math.floor(w * 0.80);
  const wfStartY = isPortrait ? Math.floor(h * 0.66) : Math.floor(h * 0.62);
  const flowerColors = [C.RED, C.PINK, C.CLOUD_HI, C.RED, C.CLOUD_HI, C.PINK];
  for (let i = 0; i < (isPortrait ? 14 : 24); i++) {
    const wx = Math.floor(wfStartX + hash2(i, 71) * (w - wfStartX - 6));
    const wy = Math.floor(wfStartY + hash2(i, 72) * 32);
    const col = flowerColors[i % flowerColors.length];
    surf.set(wx, wy + 2, C.FOLIAGE_4);
    surf.set(wx, wy + 3, C.FOLIAGE_4);
    surf.set(wx - 1, wy, col);
    surf.set(wx + 1, wy, col);
    surf.set(wx, wy - 1, col);
    surf.set(wx, wy + 1, col);
    surf.set(wx, wy, col === C.CLOUD_HI ? C.YELLOW : C.CLOUD_HI);
  }
}

// Draw the hero subject: ~10-year-old child (~56px tall) sitting cross-legged on the grass reading an open book
function drawChildReadingBook(surf, centerX, baseY) {
  const cx = Math.round(centerX);
  const by = Math.round(baseY);

  // 1. Two-tone ordered-dithered ground shadow under child, backpack, and stacked books
  surf.fillEllipse(cx + 4, by + 2, 48, 9, (px, py, nx, ny) => {
    const r = Math.sqrt(nx * nx + ny * ny);
    if (r < 0.58) return C.FOLIAGE_5;
    return dither2(px, py, C.FOLIAGE_5, C.FOLIAGE_4, (r - 0.58) * 2.1);
  });

  // 2. Small red school backpack leaning beside the child (left-back of child)
  const bpx = cx - 35;
  const bpy = by - 22;
  surf.fillRect(bpx + 2, bpy, 13, 19, (px, py) =>
    px < bpx + 9 ? C.RED : dither2(px, py, C.RED, C.TRUNK_2, 0.45)
  );
  surf.fillRect(bpx + 4, bpy - 2, 9, 2, C.RED);
  surf.fillRect(bpx + 6, bpy - 4, 5, 2, C.TRUNK_2);
  surf.fillRect(bpx + 3, bpy + 9, 10, 8, (px, py) =>
    py === bpy + 9 ? C.BOOK_GOLD : C.RED
  );
  surf.fillRect(bpx + 7, bpy + 8, 2, 3, C.BOOK_GOLD);
  surf.drawLine(bpx + 14, bpy + 3, bpx + 18, bpy + 15, C.TRUNK_2, 2);

  // 3. Cross-legged navy bottoms & sneakers on the grass
  surf.fillEllipse(cx - 12, by - 6, 15, 6, (px, py, nx, ny) =>
    ny < -0.2 ? C.NAVY : dither2(px, py, C.NAVY, C.HAIR, 0.5)
  );
  surf.fillEllipse(cx + 12, by - 5, 15, 6, (px, py, nx, ny) =>
    ny < -0.2 ? C.NAVY : dither2(px, py, C.NAVY, C.HAIR, 0.5)
  );
  surf.fillRect(cx - 22, by - 3, 8, 4, C.HAIR);
  surf.fillRect(cx - 22, by, 8, 1, C.CLOUD_HI);
  surf.fillRect(cx + 14, by - 2, 8, 4, C.HAIR);
  surf.fillRect(cx + 14, by + 1, 8, 1, C.CLOUD_HI);

  // 4. Torso in white shirt
  const torsoTopY = by - 38;
  const torsoBotY = by - 12;
  for (let py = torsoTopY; py <= torsoBotY; py++) {
    const t = (py - torsoTopY) / (torsoBotY - torsoTopY);
    const halfW = Math.round(9 + t * 5);
    const rowCx = cx + Math.round((1 - t) * 1);
    for (let px = rowCx - halfW; px <= rowCx + halfW; px++) {
      const relX = (px - (rowCx - halfW)) / (2 * halfW);
      let c = C.CLOUD_HI;
      if (relX > 0.68) c = C.CLOUD_2;
      else if (relX > 0.48) c = dither2(px, py, C.CLOUD_HI, C.CLOUD_1, 0.6);
      surf.set(px, py, c);
    }
  }
  // Collar & neck
  surf.fillRect(cx - 3, torsoTopY - 2, 6, 4, C.SKIN_2);
  surf.fillRect(cx - 2, torsoTopY - 2, 4, 3, C.SKIN_1);

  // 5. Head tilted down toward the open book + short black hair
  const headCx = cx - 1;
  const headCy = torsoTopY - 10;
  surf.fillEllipse(headCx + 1, headCy - 2, 10, 10, C.HAIR);
  surf.fillEllipse(headCx - 1, headCy + 1, 8, 8, (px, py, nx, ny) =>
    nx < 0.35 && ny < 0.45 ? C.SKIN_1 : C.SKIN_2
  );
  surf.fillRect(headCx + 6, headCy, 2, 4, C.SKIN_1);
  surf.fillEllipse(headCx, headCy - 5, 9, 5, (px, py, nx, ny) =>
    nx < -0.2 && ny < 0 ? dither2(px, py, C.HAIR, C.NAVY, 0.5) : C.HAIR
  );
  surf.fillRect(headCx + 4, headCy - 4, 4, 5, C.HAIR);
  surf.fillRect(headCx - 8, headCy - 5, 4, 3, C.HAIR);
  // Focused downcast eyes & gentle smile
  surf.fillRect(headCx - 6, headCy + 2, 2, 1, C.HAIR);
  surf.fillRect(headCx - 1, headCy + 2, 2, 1, C.HAIR);
  surf.fillRect(headCx - 4, headCy + 5, 3, 1, C.SKIN_2);

  // 6. Arms & hands holding the open book
  surf.drawLine(cx - 9, torsoTopY + 5, cx - 16, by - 19, C.CLOUD_HI, 5);
  surf.drawLine(cx - 16, by - 19, cx - 14, by - 14, C.SKIN_1, 3);
  surf.drawLine(cx + 9, torsoTopY + 6, cx + 16, by - 18, C.CLOUD_1, 5);
  surf.drawLine(cx + 16, by - 18, cx + 13, by - 14, C.SKIN_2, 3);

  // 7. Open cream-paged book held in both hands
  const bookCx = cx - 1;
  const bookCy = by - 15;
  surf.fillRect(bookCx - 17, bookCy - 4, 34, 12, C.BOOK_GOLD);
  surf.fillRect(bookCx - 18, bookCy - 3, 36, 11, C.TRUNK_1);
  for (let py = bookCy - 5; py <= bookCy + 5; py++) {
    for (let px = bookCx - 16; px <= bookCx - 1; px++) {
      const pageCurve = px < bookCx - 5 ? -1 : 0;
      surf.set(px, py + pageCurve, C.CLOUD_HI);
    }
  }
  for (let py = bookCy - 5; py <= bookCy + 5; py++) {
    for (let px = bookCx + 1; px <= bookCx + 16; px++) {
      const pageCurve = px > bookCx + 5 ? -1 : 0;
      surf.set(px, py + pageCurve, px < bookCx + 14 ? C.CLOUD_1 : C.PATH);
    }
  }
  surf.fillRect(bookCx, bookCy - 4, 1, 10, C.PATH);
  for (let row = -3; row <= 3; row += 2) {
    surf.fillRect(bookCx - 14, bookCy + row, 10, 1, C.HAIR);
  }
  surf.fillRect(bookCx + 3, bookCy - 3, 10, 1, C.HAIR);
  surf.fillRect(bookCx + 3, bookCy - 1, 9, 1, C.HAIR);
  surf.fillRect(bookCx + 4, bookCy + 1, 6, 3, C.SKY_1);

  // Warm brown hands gripping left & right outer edges of the book
  surf.fillRect(bookCx - 18, bookCy - 1, 3, 4, C.SKIN_1);
  surf.fillRect(bookCx + 16, bookCy - 1, 3, 4, C.SKIN_2);

  // 8. Stack of two hardcover books + pencil on the grass to the bottom-right of the child
  const sbx = cx + 22;
  const sby = by - 2;
  surf.fillRect(sbx - 2, sby + 8, 30, 3, C.FOLIAGE_5);
  surf.fillRect(sbx, sby + 3, 26, 5, C.FOLIAGE_2);
  surf.fillRect(sbx + 1, sby + 5, 24, 2, C.CLOUD_HI);
  surf.fillRect(sbx, sby + 3, 26, 2, C.FOLIAGE_1);
  surf.fillRect(sbx + 2, sby - 2, 24, 5, C.BOOK_GOLD);
  surf.fillRect(sbx + 3, sby, 22, 2, C.PATH);
  for (let nx = sbx + 6; nx < sbx + 22; nx += 4) {
    surf.set(nx, sby, C.TRUNK_2);
  }
  surf.fillRect(sbx + 2, sby - 2, 24, 2, C.BOOK_GOLD);
  surf.drawLine(sbx + 5, sby - 3, sbx + 19, sby - 1, C.YELLOW, 1);
  surf.set(sbx + 4, sby - 3, C.PINK);
  surf.set(sbx + 20, sby - 1, C.HAIR);

  // 9. Tiny yellow & white sparkle pixels rising from the open pages (placed around the book & shoulders, never over face!)
  const sparkles = [
    { dx: -19, dy: -8,  type: 'star', col: C.YELLOW },
    { dx: -14, dy: -14, type: 'dot',  col: C.CLOUD_HI },
    { dx: -22, dy: -20, type: 'dot',  col: C.YELLOW },
    { dx: -16, dy: -28, type: 'star', col: C.CLOUD_HI },
    { dx: 18,  dy: -9,  type: 'dot',  col: C.YELLOW },
    { dx: 22,  dy: -16, type: 'star', col: C.YELLOW },
    { dx: 16,  dy: -24, type: 'dot',  col: C.CLOUD_HI },
    { dx: 24,  dy: -31, type: 'dot',  col: C.YELLOW },
  ];
  for (const s of sparkles) {
    const sx = bookCx + s.dx;
    const sy = bookCy + s.dy;
    surf.set(sx, sy, s.col);
    if (s.type === 'star') {
      surf.set(sx - 1, sy, C.CLOUD_HI);
      surf.set(sx + 1, sy, C.CLOUD_HI);
      surf.set(sx, sy - 1, C.CLOUD_HI);
      surf.set(sx, sy + 1, C.CLOUD_HI);
    }
  }
}

function applySunbeams(surf, startX, endX, maxY) {
  for (let py = 0; py < maxY; py++) {
    for (let px = startX; px < endX; px++) {
      const u = px + py * 0.65;
      const beam =
        Math.exp(-Math.pow((u - (startX + 95)) / 14, 2)) +
        0.75 * Math.exp(-Math.pow((u - (startX + 135)) / 11, 2));
      if (beam > 0.35 && bayer(px, py) < (beam - 0.3) * 0.55) {
        const cur = surf.get(px, py);
        if (cur === C.FOLIAGE_5) surf.set(px, py, C.FOLIAGE_4);
        else if (cur === C.FOLIAGE_4) surf.set(px, py, C.FOLIAGE_3);
        else if (cur === C.FOLIAGE_3) surf.set(px, py, C.FOLIAGE_2);
        else if (cur === C.FOLIAGE_2) surf.set(px, py, C.FOLIAGE_1);
      }
    }
  }
}

function applyBottomDeskDither(surf) {
  const w = surf.w;
  const h = surf.h;
  const ditherHeight = 24;
  const yStart = h - ditherHeight;

  for (let py = yStart; py < h; py++) {
    const t = (py - yStart) / (ditherHeight - 1);
    for (let px = 0; px < w; px++) {
      if (t < 0.45) {
        const cur = surf.get(px, py);
        if (cur === C.GRASS_1 || cur === C.GRASS_2 || cur === C.GRASS_3) {
          if (bayer(px, py) < t * 1.8) {
            surf.set(px, py, C.FOLIAGE_4);
          }
        }
      }
      const ditherThreshold = Math.pow(t, 1.15);
      if (py >= h - 2 || bayer(px, py) < ditherThreshold) {
        surf.set(px, py, C.DESK);
      } else if (t > 0.55) {
        surf.set(px, py, C.FOLIAGE_5);
      }
    }
  }
}

function generateCloudsLayer() {
  const surf = new PixelSurface(960, 120);
  const basePuffs = [
    { x: 520, y: 78, rx: 46, ry: 34, bright: 0.25 },
    { x: 560, y: 54, rx: 52, ry: 38, bright: 0.35 },
    { x: 610, y: 42, rx: 58, ry: 36, bright: 0.40 },
    { x: 660, y: 58, rx: 48, ry: 32, bright: 0.20 },
    { x: 700, y: 76, rx: 42, ry: 28, bright: 0.10 },

    { x: 830, y: 86, rx: 38, ry: 24, bright: 0.22 },
    { x: 865, y: 68, rx: 44, ry: 30, bright: 0.34 },
    { x: 905, y: 74, rx: 40, ry: 26, bright: 0.18 },
    { x: 905 - 960, y: 74, rx: 40, ry: 26, bright: 0.18 },
  ];
  drawCloudBank(surf, basePuffs, 112);

  const png = encodePNG8(surf.w, surf.h, surf.data);
  const outPath = path.join(OUT_DIR, 'hero-clouds.png');
  fs.writeFileSync(outPath, png);
  return { outPath, bytes: png.length };
}

function generateLandscapeScene() {
  const surf = new PixelSurface(480, 270);
  const horizonY = 172;

  const cloudPuffs = [
    { x: 118, y: 158, rx: 24, ry: 16, bright: 0.20 },
    { x: 142, y: 150, rx: 28, ry: 18, bright: 0.28 },
    { x: 170, y: 144, rx: 32, ry: 22, bright: 0.30 },
    { x: 202, y: 136, rx: 36, ry: 26, bright: 0.25 },
    { x: 232, y: 120, rx: 42, ry: 32, bright: 0.32 },
    { x: 265, y: 92,  rx: 46, ry: 38, bright: 0.38 },
    { x: 288, y: 58,  rx: 48, ry: 38, bright: 0.44 },
    { x: 325, y: 34,  rx: 56, ry: 36, bright: 0.48 },
    { x: 368, y: 44,  rx: 52, ry: 38, bright: 0.30 },
    { x: 312, y: 95,  rx: 52, ry: 40, bright: 0.15 },
    { x: 358, y: 88,  rx: 54, ry: 40, bright: 0.08 },
  ];
  drawCloudBank(surf, cloudPuffs, horizonY + 8);

  drawSkyline(surf, 76, 268, horizonY, 1.0);
  drawMeadowAndForeground(surf, horizonY, false);
  drawParkTree(surf, 14, 178, 5, 16, 18, false);
  drawParkTree(surf, 68, 184, 9, 26, 32, true);
  drawParkTree(surf, 212, 173, 4, 10, 13, false);
  drawRightForestAndOak(surf, false);
  applySunbeams(surf, 290, 445, 220);
  drawChildReadingBook(surf, 340, 218);
  applyBottomDeskDither(surf);

  const png = encodePNG8(surf.w, surf.h, surf.data);
  const outPath = path.join(OUT_DIR, 'hero-scene-landscape.png');
  fs.writeFileSync(outPath, png);
  return { outPath, bytes: png.length };
}

function generatePortraitScene() {
  const surf = new PixelSurface(270, 480);
  const horizonY = 312;

  const cloudPuffs = [
    { x: 45,  y: 295, rx: 28, ry: 18, bright: 0.25 },
    { x: 85,  y: 282, rx: 34, ry: 22, bright: 0.32 },
    { x: 135, y: 264, rx: 42, ry: 28, bright: 0.38 },
    { x: 185, y: 242, rx: 46, ry: 34, bright: 0.44 },
    { x: 230, y: 225, rx: 48, ry: 34, bright: 0.36 },
    { x: 170, y: 282, rx: 44, ry: 28, bright: 0.16 },
  ];
  drawCloudBank(surf, cloudPuffs, horizonY + 8);

  drawSkyline(surf, 18, 175, horizonY, 0.85);
  drawMeadowAndForeground(surf, horizonY, true);
  drawParkTree(surf, 34, 326, 7, 20, 24, true);
  drawRightForestAndOak(surf, true);
  applySunbeams(surf, 110, 255, 420);
  drawChildReadingBook(surf, 142, 428);
  applyBottomDeskDither(surf);

  const png = encodePNG8(surf.w, surf.h, surf.data);
  const outPath = path.join(OUT_DIR, 'hero-scene-portrait.png');
  fs.writeFileSync(outPath, png);
  return { outPath, bytes: png.length };
}

const cRes = generateCloudsLayer();
const lRes = generateLandscapeScene();
const pRes = generatePortraitScene();

console.log('Generated Route A PNG-8 assets (32-color PLTE + 1-bit tRNS):');
console.log(`- hero-clouds.png (960x120): ${(cRes.bytes / 1024).toFixed(2)} KB`);
console.log(`- hero-scene-landscape.png (480x270): ${(lRes.bytes / 1024).toFixed(2)} KB`);
console.log(`- hero-scene-portrait.png (270x480): ${(pRes.bytes / 1024).toFixed(2)} KB`);
