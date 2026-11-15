/**
 * Procedural 16-bit Pixel-Art Canvas Rendering Engine.
 *
 * Strictly zero external images, spritesheets, or SVGs:
 * Renders crisp integer pixels into a deterministic Uint32Array backed by ImageData,
 * supporting alpha blending, Bayer-dithered shadows, integer lines/circles/ellipses/triangles,
 * pixel-grid sprite matrices, a crisp 3x5 bitmap pixel font, and a zero-allocation particle pool.
 */

export const SCENE_W = 160;
export const SCENE_H = 96;

// 8x8 Bayer matrix for deterministic retro dithering
const BAYER4 = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

export function bayerThreshold(x, y) {
  return BAYER4[((y & 3) << 2) | (x & 3)] / 16;
}

export function hash2D(x, y) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) ^ 0x5bf03635;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function clamp(val, min, max) {
  return val < min ? min : val > max ? max : val;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

// 3x5 / 4x5 crisp pixel bitmap font (0..15 bitmask per 5 rows, 3px or 4px wide)
const PIXEL_FONT = {
  ' ': { w: 2, rows: [0, 0, 0, 0, 0] },
  'F': { w: 3, rows: [0b111, 0b100, 0b110, 0b100, 0b100] },
  'H': { w: 3, rows: [0b101, 0b101, 0b111, 0b101, 0b101] },
  'O': { w: 3, rows: [0b111, 0b101, 0b101, 0b101, 0b111] },
  'E': { w: 3, rows: [0b111, 0b100, 0b110, 0b100, 0b111] },
  'N': { w: 4, rows: [0b1001, 0b1101, 0b1011, 0b1001, 0b1001] },
  'C': { w: 3, rows: [0b111, 0b100, 0b100, 0b100, 0b111] },
  'A': { w: 3, rows: [0b010, 0b101, 0b111, 0b101, 0b101] },
  'T': { w: 3, rows: [0b111, 0b010, 0b010, 0b010, 0b010] },
  'G': { w: 3, rows: [0b111, 0b100, 0b101, 0b101, 0b111] },
  'm': { w: 5, rows: [0b00000, 0b11010, 0b10101, 0b10101, 0b10001] },
  'a': { w: 3, rows: [0b000, 0b110, 0b011, 0b101, 0b111] },
  'x': { w: 3, rows: [0b000, 0b101, 0b010, 0b010, 0b101] },
  'y': { w: 3, rows: [0b000, 0b101, 0b010, 0b010, 0b100] },
  'r': { w: 3, rows: [0b000, 0b110, 0b101, 0b100, 0b100] },
  'c': { w: 3, rows: [0b000, 0b111, 0b100, 0b100, 0b111] },
  'p': { w: 3, rows: [0b000, 0b111, 0b101, 0b111, 0b100] },
  '=': { w: 3, rows: [0b000, 0b111, 0b000, 0b111, 0b000] },
  '+': { w: 3, rows: [0b000, 0b010, 0b111, 0b010, 0b000] },
  '-': { w: 3, rows: [0b000, 0b000, 0b111, 0b000, 0b000] },
  '0': { w: 3, rows: [0b111, 0b101, 0b101, 0b101, 0b111] },
  '1': { w: 2, rows: [0b11, 0b01, 0b01, 0b01, 0b11] },
  '2': { w: 3, rows: [0b111, 0b001, 0b111, 0b100, 0b111] },
  '3': { w: 3, rows: [0b111, 0b001, 0b111, 0b001, 0b111] },
  '4': { w: 3, rows: [0b101, 0b101, 0b111, 0b001, 0b001] },
  '(': { w: 2, rows: [0b01, 0b10, 0b10, 0b10, 0b01] },
  ')': { w: 2, rows: [0b10, 0b01, 0b01, 0b01, 0b10] },
  ',': { w: 2, rows: [0b00, 0b00, 0b00, 0b01, 0b10] },
  '.': { w: 1, rows: [0b0, 0b0, 0b0, 0b0, 0b1] },
  '^': { w: 3, rows: [0b010, 0b101, 0b000, 0b000, 0b000] },
  // Superscript 2 (tiny 2x3 raised)
  '²': { w: 2, rows: [0b11, 0b01, 0b10, 0b11, 0b00] },
  // Subscript 2 (tiny 3x4 lowered)
  '₂': { w: 3, rows: [0b000, 0b111, 0b001, 0b110, 0b111] },
  // Pi symbol
  'π': { w: 4, rows: [0b0000, 0b1111, 0b0101, 0b0101, 0b0101] },
};

/**
 * Create a deterministic integer pixel buffer with drawing primitives.
 */
export function createPixelBuffer(w = SCENE_W, h = SCENE_H) {
  const imageData = new ImageData(w, h);
  const data32 = new Uint32Array(imageData.data.buffer);

  function setPx(x, y, hexColor, alpha = 1) {
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || px >= w || py < 0 || py >= h || alpha <= 0) return;

    const sr = (hexColor >> 16) & 0xff;
    const sg = (hexColor >> 8) & 0xff;
    const sb = hexColor & 0xff;
    const idx = py * w + px;

    if (alpha >= 0.996) {
      data32[idx] = (0xff << 24) | (sb << 16) | (sg << 8) | sr;
      return;
    }

    const dst = data32[idx];
    const da = ((dst >>> 24) & 0xff) / 255;
    if (da === 0) {
      const aByte = Math.round(clamp(alpha, 0, 1) * 255) & 0xff;
      data32[idx] = (aByte << 24) | (sb << 16) | (sg << 8) | sr;
      return;
    }

    const dr = dst & 0xff;
    const dg = (dst >>> 8) & 0xff;
    const db = (dst >>> 16) & 0xff;
    const sa = clamp(alpha, 0, 1);
    const outA = sa + da * (1 - sa);
    if (outA <= 0) return;

    const outR = Math.round((sr * sa + dr * da * (1 - sa)) / outA);
    const outG = Math.round((sg * sa + dg * da * (1 - sa)) / outA);
    const outB = Math.round((sb * sa + db * da * (1 - sa)) / outA);
    const aByte = Math.round(outA * 255) & 0xff;
    data32[idx] = (aByte << 24) | (outB << 16) | (outG << 8) | outR;
  }

  function clear() {
    data32.fill(0);
  }

  function clearPx(x, y) {
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || px >= w || py < 0 || py >= h) return;
    data32[py * w + px] = 0;
  }

  function eraseTriangle(x0, y0, x1, y1, x2, y2) {
    const pts = [
      { x: Math.round(x0), y: Math.round(y0) },
      { x: Math.round(x1), y: Math.round(y1) },
      { x: Math.round(x2), y: Math.round(y2) },
    ].sort((a, b) => a.y - b.y);

    const [p0, p1, p2] = pts;
    const totalH = p2.y - p0.y;
    if (totalH === 0) return;

    for (let i = 0; i <= totalH; i++) {
      const secondHalf = i > p1.y - p0.y || p1.y === p0.y;
      const segH = secondHalf ? p2.y - p1.y : p1.y - p0.y;
      const a = i / totalH;
      const b = segH === 0 ? 1 : (i - (secondHalf ? p1.y - p0.y : 0)) / segH;
      let ax = Math.round(p0.x + (p2.x - p0.x) * a);
      let bx = Math.round(
        secondHalf
          ? p1.x + (p2.x - p1.x) * b
          : p0.x + (p1.x - p0.x) * b
      );
      if (ax > bx) [ax, bx] = [bx, ax];
      for (let px = ax; px <= bx; px++) {
        clearPx(px, p0.y + i);
      }
    }
  }

  function fillRect(x, y, rw, rh, hexColor, alpha = 1) {
    const x0 = Math.max(0, Math.round(x));
    const y0 = Math.max(0, Math.round(y));
    const x1 = Math.min(w, Math.round(x + rw));
    const y1 = Math.min(h, Math.round(y + rh));
    for (let py = y0; py < y1; py++) {
      for (let px = x0; px < x1; px++) {
        setPx(px, py, hexColor, alpha);
      }
    }
  }

  function strokeRect(x, y, rw, rh, hexColor, alpha = 1) {
    const x0 = Math.round(x);
    const y0 = Math.round(y);
    const w0 = Math.round(rw);
    const h0 = Math.round(rh);
    if (w0 <= 0 || h0 <= 0) return;
    fillRect(x0, y0, w0, 1, hexColor, alpha);
    fillRect(x0, y0 + h0 - 1, w0, 1, hexColor, alpha);
    fillRect(x0, y0, 1, h0, hexColor, alpha);
    fillRect(x0 + w0 - 1, y0, 1, h0, hexColor, alpha);
  }

  function drawLine(x0, y0, x1, y1, hexColor, thickness = 1, alpha = 1) {
    let ix0 = Math.round(x0);
    let iy0 = Math.round(y0);
    const ix1 = Math.round(x1);
    const iy1 = Math.round(y1);
    const dx = Math.abs(ix1 - ix0);
    const dy = -Math.abs(iy1 - iy0);
    const sx = ix0 < ix1 ? 1 : -1;
    const sy = iy0 < iy1 ? 1 : -1;
    let err = dx + dy;
    const half = Math.floor((thickness - 1) / 2);

    while (true) {
      if (thickness <= 1) {
        setPx(ix0, iy0, hexColor, alpha);
      } else {
        fillRect(ix0 - half, iy0 - half, thickness, thickness, hexColor, alpha);
      }
      if (ix0 === ix1 && iy0 === iy1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        ix0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        iy0 += sy;
      }
    }
  }

  function fillCircle(cx, cy, r, hexColor, alpha = 1) {
    const icx = Math.round(cx);
    const icy = Math.round(cy);
    const ir = Math.round(r);
    const r2 = ir * ir + ir * 0.5;
    for (let dy = -ir; dy <= ir; dy++) {
      for (let dx = -ir; dx <= ir; dx++) {
        if (dx * dx + dy * dy <= r2) {
          setPx(icx + dx, icy + dy, hexColor, alpha);
        }
      }
    }
  }

  function strokeCircle(cx, cy, r, hexColor, alpha = 1) {
    const icx = Math.round(cx);
    const icy = Math.round(cy);
    const ir = Math.round(r);
    let x = ir;
    let y = 0;
    let err = 1 - x;
    while (x >= y) {
      setPx(icx + x, icy + y, hexColor, alpha);
      setPx(icx + y, icy + x, hexColor, alpha);
      setPx(icx - y, icy + x, hexColor, alpha);
      setPx(icx - x, icy + y, hexColor, alpha);
      setPx(icx - x, icy - y, hexColor, alpha);
      setPx(icx - y, icy - x, hexColor, alpha);
      setPx(icx + y, icy - x, hexColor, alpha);
      setPx(icx + x, icy - y, hexColor, alpha);
      y++;
      if (err < 0) {
        err += 2 * y + 1;
      } else {
        x--;
        err += 2 * (y - x) + 1;
      }
    }
  }

  function fillEllipse(cx, cy, rx, ry, hexColor, alpha = 1) {
    const icx = Math.round(cx);
    const icy = Math.round(cy);
    const irx = Math.max(1, Math.round(rx));
    const iry = Math.max(1, Math.round(ry));
    for (let dy = -iry; dy <= iry; dy++) {
      for (let dx = -irx; dx <= irx; dx++) {
        const norm = (dx * dx) / (irx * irx) + (dy * dy) / (iry * iry);
        if (norm <= 1.05) {
          setPx(icx + dx, icy + dy, hexColor, alpha);
        }
      }
    }
  }

  function strokeEllipse(cx, cy, rx, ry, hexColor, alpha = 1) {
    const icx = Math.round(cx);
    const icy = Math.round(cy);
    const irx = Math.max(1, Math.round(rx));
    const iry = Math.max(1, Math.round(ry));
    for (let dy = -iry; dy <= iry; dy++) {
      for (let dx = -irx; dx <= irx; dx++) {
        const norm = (dx * dx) / (irx * irx) + (dy * dy) / (iry * iry);
        if (norm <= 1.08 && norm >= 0.72) {
          setPx(icx + dx, icy + dy, hexColor, alpha);
        }
      }
    }
  }

  function fillTriangle(x0, y0, x1, y1, x2, y2, hexColor, alpha = 1) {
    const pts = [
      { x: Math.round(x0), y: Math.round(y0) },
      { x: Math.round(x1), y: Math.round(y1) },
      { x: Math.round(x2), y: Math.round(y2) },
    ].sort((a, b) => a.y - b.y);

    const [p0, p1, p2] = pts;
    const totalH = p2.y - p0.y;
    if (totalH === 0) return;

    for (let i = 0; i <= totalH; i++) {
      const secondHalf = i > p1.y - p0.y || p1.y === p0.y;
      const segH = secondHalf ? p2.y - p1.y : p1.y - p0.y;
      const a = i / totalH;
      const b = segH === 0 ? 1 : (i - (secondHalf ? p1.y - p0.y : 0)) / segH;
      let ax = Math.round(p0.x + (p2.x - p0.x) * a);
      let bx = Math.round(
        secondHalf
          ? p1.x + (p2.x - p1.x) * b
          : p0.x + (p1.x - p0.x) * b
      );
      if (ax > bx) [ax, bx] = [bx, ax];
      for (let px = ax; px <= bx; px++) {
        setPx(px, p0.y + i, hexColor, alpha);
      }
    }
  }

  function drawDitherShadow(cx, cy, rx, ry, hexColor = 0xb8aa8a, alpha = 0.42) {
    const icx = Math.round(cx);
    const icy = Math.round(cy);
    const irx = Math.max(1, Math.round(rx));
    const iry = Math.max(1, Math.round(ry));
    for (let dy = -iry; dy <= iry; dy++) {
      for (let dx = -irx; dx <= irx; dx++) {
        const norm = (dx * dx) / (irx * irx) + (dy * dy) / (iry * iry);
        if (norm <= 1) {
          const density = norm < 0.5 ? 0.85 : 0.45;
          if (bayerThreshold(icx + dx, icy + dy) < density) {
            setPx(icx + dx, icy + dy, hexColor, alpha);
          }
        }
      }
    }
  }

  function drawSparkle(cx, cy, phase, coreColor = 0xffffff, outerColor = 0xfacc15) {
    const icx = Math.round(cx);
    const icy = Math.round(cy);
    const pulse = Math.sin(phase);
    if (pulse < -0.55) return;
    setPx(icx, icy, coreColor);
    if (pulse > -0.15) {
      setPx(icx - 1, icy, outerColor);
      setPx(icx + 1, icy, outerColor);
      setPx(icx, icy - 1, outerColor);
      setPx(icx, icy + 1, outerColor);
    }
    if (pulse > 0.45) {
      setPx(icx - 2, icy, outerColor, 0.7);
      setPx(icx + 2, icy, outerColor, 0.7);
      setPx(icx, icy - 2, outerColor, 0.7);
      setPx(icx, icy + 2, outerColor, 0.7);
    }
  }

  function drawSprite(x, y, rows, paletteMap, flipX = false) {
    const ox = Math.round(x);
    const oy = Math.round(y);
    for (let ry = 0; ry < rows.length; ry++) {
      const row = rows[ry];
      for (let rx = 0; rx < row.length; rx++) {
        const ch = row[rx];
        if (ch === '.' || ch === ' ') continue;
        const col = paletteMap[ch];
        if (col === undefined) continue;
        const px = flipX ? ox + (row.length - 1 - rx) : ox + rx;
        setPx(px, oy + ry, col);
      }
    }
  }

  function drawPixelText(text, x, y, hexColor, scale = 1) {
    let cursorX = Math.round(x);
    const startY = Math.round(y);
    for (let i = 0; i < text.length; i++) {
      const glyph = PIXEL_FONT[text[i]];
      if (!glyph) {
        cursorX += 3 * scale;
        continue;
      }
      for (let row = 0; row < glyph.rows.length; row++) {
        const bits = glyph.rows[row];
        for (let col = 0; col < glyph.w; col++) {
          if ((bits >> (glyph.w - 1 - col)) & 1) {
            if (scale === 1) {
              setPx(cursorX + col, startY + row, hexColor);
            } else {
              fillRect(cursorX + col * scale, startY + row * scale, scale, scale, hexColor);
            }
          }
        }
      }
      cursorX += (glyph.w + 1) * scale;
    }
  }

  return {
    w,
    h,
    imageData,
    data32,
    clear,
    clearPx,
    setPx,
    fillRect,
    strokeRect,
    drawLine,
    fillCircle,
    strokeCircle,
    fillEllipse,
    strokeEllipse,
    fillTriangle,
    eraseTriangle,
    drawDitherShadow,
    drawSparkle,
    drawSprite,
    drawPixelText,
  };
}

/**
 * Fixed-capacity particle pool to avoid allocations on animation frames.
 */
export function createParticlePool(capacity = 44) {
  const pool = Array.from({ length: capacity }, () => ({
    active: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    gravity: 0,
    life: 0,
    maxLife: 1,
    color: 0xffffff,
    outline: 0,
    size: 1,
    kind: 'px',
    phase: 0,
  }));

  function spawn({
    x,
    y,
    vx = 0,
    vy = -12,
    gravity = 0,
    life = 1.0,
    color = 0xffffff,
    outline = 0,
    size = 1,
    kind = 'px',
    phase = 0,
  }) {
    for (let i = 0; i < pool.length; i++) {
      if (!pool[i].active) {
        const p = pool[i];
        p.active = true;
        p.x = x;
        p.y = y;
        p.vx = vx;
        p.vy = vy;
        p.gravity = gravity;
        p.life = 0;
        p.maxLife = Math.max(0.1, life);
        p.color = color;
        p.outline = outline;
        p.size = size;
        p.kind = kind;
        p.phase = phase;
        return;
      }
    }
  }

  function updateAndDraw(dt, pxBuf, t = 0) {
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      if (!p.active) continue;
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        continue;
      }

      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.kind === 'float' || p.kind === 'leaf') {
        p.x += Math.sin(t * 4.5 + p.phase) * 7 * dt;
      }

      const progress = p.life / p.maxLife;
      const alpha = progress > 0.72 ? (1 - progress) / 0.28 : 1;
      const ix = Math.round(p.x);
      const iy = Math.round(p.y);

      if (p.kind === 'star') {
        pxBuf.setPx(ix, iy, 0xffffff, alpha);
        if (progress < 0.75) {
          pxBuf.setPx(ix - 1, iy, p.color, alpha);
          pxBuf.setPx(ix + 1, iy, p.color, alpha);
          pxBuf.setPx(ix, iy - 1, p.color, alpha);
          pxBuf.setPx(ix, iy + 1, p.color, alpha);
        }
      } else if (p.kind === 'bubble') {
        if (p.size >= 2) {
          pxBuf.setPx(ix, iy, p.outline || p.color, alpha);
          pxBuf.setPx(ix + 1, iy, p.color, alpha);
          pxBuf.setPx(ix, iy + 1, p.color, alpha);
          pxBuf.setPx(ix + 1, iy + 1, 0xffffff, alpha);
        } else {
          pxBuf.setPx(ix, iy, p.color, alpha);
        }
      } else if (p.kind === 'leaf') {
        pxBuf.setPx(ix, iy, p.color, alpha);
        pxBuf.setPx(ix + 1, iy, p.outline || p.color, alpha);
        pxBuf.setPx(ix, iy + 1, p.outline || p.color, alpha);
      } else if (p.size >= 2) {
        pxBuf.fillRect(ix, iy, p.size, p.size, p.color, alpha);
      } else {
        pxBuf.setPx(ix, iy, p.color, alpha);
      }
    }
  }

  return { spawn, updateAndDraw };
}
