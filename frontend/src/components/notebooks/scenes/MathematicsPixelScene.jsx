import React, { useRef, useMemo } from 'react';
import {
  SCENE_W,
  SCENE_H,
  createParticlePool,
  clamp,
} from '../pixelEngine';
import { usePixelScene } from '../usePixelScene';

const PAL = {
  OUTLINE: 0x181c26,
  SHADOW: 0xb8aa8a,
  WHITE: 0xffffff,
  SHEET_BG: 0xf8fafc,
  GRID_LINE: 0xdbeafe,
  AXIS: 0x1e293b,
  PARABOLA_DARK: 0x6d28d9,
  PARABOLA_MID: 0x8b5cf6,
  PARABOLA_HI: 0xc4b5fd,
  POINT_CORE: 0xfacc15,
  POINT_RING: 0xec4899,
  RULER_HI: 0xfef08a,
  RULER_MID: 0xfacc15,
  RULER_DARK: 0xeab308,
  COMPASS_HI: 0x60a5fa,
  COMPASS_MID: 0x2563eb,
  COMPASS_DARK: 0x1e40af,
  BRASS: 0xf59e0b,
  METAL_LIGHT: 0xe2e8f0,
  METAL_DARK: 0x475569,
  BOOK_BLUE: 0x3b82f6,
  BOOK_BLUE_HI: 0x93c5fd,
  BOOK_TAN: 0xd97706,
  BOOK_TAN_HI: 0xfbbf24,
  PAGES: 0xfef9c3,
  SPARK_PURPLE: 0xa78bfa,
  SPARK_GOLD: 0xfacc15,
  SPARK_BLUE: 0x38bdf8,
};

const HITBOXES = [
  {
    id: 'tools',
    x: 6,
    y: 44,
    w: 34,
    h: 44,
    label: 'Set-Square Ruler · 90° Geometry',
  },
  {
    id: 'notebook',
    x: 92,
    y: 70,
    w: 58,
    h: 22,
    label: 'Formula Notebook · Identities & Notes',
  },
  {
    id: 'compass',
    x: 108,
    y: 10,
    w: 46,
    h: 62,
    label: 'Drafting Compass · Circle Construction',
  },
  {
    id: 'graph',
    x: 36,
    y: 10,
    w: 74,
    h: 68,
    label: 'Parabola Graph · Click to Redraw Curve',
  },
];

function drawRuler(px, { t, isHovered }) {
  px.drawDitherShadow(24, 86, 15, 2, PAL.SHADOW, 0.4);

  const floatY = Math.round(Math.sin(t * 1.7) * (isHovered ? 1.5 : 0.9));
  const x0 = 11;
  const yTop = 50 + floatY;
  const yBot = 82 + floatY;
  const xRight = 39;

  // Outer yellow right-triangle
  px.fillTriangle(x0, yTop, x0, yBot, xRight, yBot, PAL.RULER_MID);
  // Highlight edge along hypotenuse & vertical edge
  px.drawLine(x0 + 1, yTop + 2, x0 + 1, yBot - 1, PAL.RULER_HI, 1);
  px.drawLine(x0 + 1, yBot - 1, xRight - 2, yBot - 1, PAL.RULER_DARK, 1);

  // Inner triangular cutout (transparent paper color shows through)
  px.eraseTriangle(x0 + 5, yTop + 14, x0 + 5, yBot - 5, xRight - 14, yBot - 5);
  px.drawLine(x0 + 5, yTop + 14, x0 + 5, yBot - 5, PAL.OUTLINE, 1);
  px.drawLine(x0 + 5, yBot - 5, xRight - 14, yBot - 5, PAL.OUTLINE, 1);
  px.drawLine(x0 + 5, yTop + 14, xRight - 14, yBot - 5, PAL.OUTLINE, 1);

  // Outer crisp outline
  px.drawLine(x0, yTop, x0, yBot, PAL.OUTLINE, 1);
  px.drawLine(x0, yBot, xRight, yBot, PAL.OUTLINE, 1);
  px.drawLine(x0, yTop, xRight, yBot, PAL.OUTLINE, 1);

  // Measurement tick marks along vertical & bottom edges
  for (let ty = yTop + 6; ty < yBot - 2; ty += 4) {
    px.fillRect(x0 + 1, ty, 2, 1, PAL.OUTLINE);
  }
  for (let tx = x0 + 5; tx < xRight - 4; tx += 4) {
    px.fillRect(tx, yBot - 3, 1, 2, PAL.OUTLINE);
  }
}

function drawCoordinateGraph(px, { t, isHovered, isCardHovered, drawProgress, particles, dt }) {
  const gx = 39;
  const gy = 14;
  const gw = 66;
  const gh = 60;

  // Paper drop shadow & pinned grid sheet
  px.fillRect(gx + 2, gy + 2, gw, gh, PAL.OUTLINE, 0.2);
  px.fillRect(gx, gy, gw, gh, PAL.SHEET_BG);

  // Grid lines every 6 pixels
  for (let x = gx + 6; x < gx + gw; x += 6) {
    px.drawLine(x, gy + 1, x, gy + gh - 2, PAL.GRID_LINE, 1);
  }
  for (let y = gy + 6; y < gy + gh; y += 6) {
    px.drawLine(gx + 1, y, gx + gw - 2, y, PAL.GRID_LINE, 1);
  }

  px.strokeRect(gx, gy, gw, gh, PAL.OUTLINE);

  // Coordinate Axes centered at vertex (72, 47)
  const originX = 72;
  const originY = 47;

  // X-axis & arrows
  px.drawLine(gx + 5, originY, gx + gw - 5, originY, PAL.AXIS, 1);
  px.setPx(gx + 6, originY - 1, PAL.AXIS);
  px.setPx(gx + 6, originY + 1, PAL.AXIS);
  px.setPx(gx + gw - 6, originY - 1, PAL.AXIS);
  px.setPx(gx + gw - 6, originY + 1, PAL.AXIS);

  // Y-axis & arrows
  px.drawLine(originX, gy + 4, originX, gy + gh - 15, PAL.AXIS, 1);
  px.setPx(originX - 1, gy + 5, PAL.AXIS);
  px.setPx(originX + 1, gy + 5, PAL.AXIS);

  // Parabola y = originY - 0.052 * dx^2 over dx in [-22..22]
  const minDx = -22;
  const maxDx = 22;
  const totalSpan = maxDx - minDx;
  const visibleLimit = minDx + totalSpan * clamp(drawProgress, 0, 1);

  let prevX = null;
  let prevY = null;
  const glowOffset = ((t * 1.1) % 1) * totalSpan + minDx;

  for (let dx = minDx; dx <= visibleLimit; dx += 1) {
    const pxX = originX + dx;
    const pxY = Math.round(originY - 0.052 * dx * dx);
    if (prevX !== null) {
      const distGlow = Math.abs(dx - glowOffset);
      const col = distGlow < 3.5 ? PAL.PARABOLA_HI : PAL.PARABOLA_MID;
      px.drawLine(prevX, prevY, pxX, pxY, PAL.PARABOLA_DARK, 2);
      px.drawLine(prevX, prevY, pxX, pxY, col, 1);
    }
    prevX = pxX;
    prevY = pxY;
  }

  // Emit glowing tip when redrawing parabola
  if (drawProgress < 0.99 && prevX !== null && dt > 0) {
    px.fillCircle(prevX, prevY, 2, PAL.POINT_CORE);
    if (Math.random() < 0.65) {
      particles.spawn({
        x: prevX,
        y: prevY,
        vx: (Math.random() - 0.5) * 14,
        vy: -10 - Math.random() * 10,
        life: 0.55,
        color: PAL.SPARK_PURPLE,
        kind: 'star',
      });
    }
  }

  // Moving tracer point gliding along the parabola
  if (drawProgress >= 0.98) {
    const tracerDx = Math.sin(t * (isHovered || isCardHovered ? 1.8 : 1.15)) * 19;
    const tracerX = Math.round(originX + tracerDx);
    const tracerY = Math.round(originY - 0.052 * tracerDx * tracerDx);
    px.fillCircle(tracerX, tracerY, 2, PAL.OUTLINE);
    px.fillRect(tracerX - 1, tracerY - 1, 2, 2, PAL.POINT_CORE);
    px.setPx(tracerX, tracerY, PAL.WHITE);
  }

  // Hovering over the graph reveals key coordinate sample points (-16, y), (0,0), (+16, y)
  if (isHovered) {
    const pts = [-16, 0, 16];
    for (let i = 0; i < pts.length; i++) {
      const dx = pts[i];
      const cx = originX + dx;
      const cy = Math.round(originY - 0.052 * dx * dx);
      // Dashed drop lines to axes
      for (let y = cy; y <= originY; y += 2) {
        px.setPx(cx, y, PAL.POINT_RING, 0.7);
      }
      px.fillCircle(cx, cy, 2, PAL.POINT_RING);
      px.setPx(cx, cy, PAL.WHITE);
    }
  }

  // Equation text at bottom of graph card matching reference ("x²+y²=r²")
  px.drawPixelText('x²+y²=r²', gx + 19, gy + gh - 9, PAL.AXIS, 1);
}

function drawCompass(px, { t, isHovered, isCardHovered }) {
  const pivotX = 128;
  const pivotY = 20;
  const needleX = 117;
  const needleY = 63;

  // When hovered, rotate drawing arm wider and draw a glowing circle around the needle point
  const active = isHovered;
  const armPhase = t * (active ? 3.4 : isCardHovered ? 2.0 : 1.3);
  const spread = active ? 13 + Math.sin(armPhase) * 6 : 11 + Math.sin(armPhase) * 2.5;
  const drawTipX = Math.round(pivotX + spread);
  const drawTipY = 61 + Math.round(Math.cos(armPhase) * (active ? 3 : 1));

  // If hovered, render simulated circle arc drawn by the compass
  if (active) {
    const r = Math.round(Math.hypot(drawTipX - needleX, drawTipY - needleY) * 0.65);
    const circleProgress = ((t * 0.85) % 1) * Math.PI * 2;
    for (let a = 0; a <= circleProgress; a += 0.14) {
      const cx = Math.round(needleX + Math.cos(a) * r);
      const cy = Math.round(needleY - 6 + Math.sin(a) * (r * 0.45));
      px.setPx(cx, cy, PAL.PARABOLA_MID);
    }
    const leadX = Math.round(needleX + Math.cos(circleProgress) * r);
    const leadY = Math.round(needleY - 6 + Math.sin(circleProgress) * (r * 0.45));
    px.fillRect(leadX, leadY, 2, 2, PAL.POINT_CORE);
  }

  // Top handle post
  px.fillRect(pivotX - 1, pivotY - 7, 3, 5, PAL.METAL_DARK);
  px.strokeRect(pivotX - 2, pivotY - 8, 5, 6, PAL.OUTLINE);

  // Left leg (needle side)
  px.drawLine(pivotX - 2, pivotY + 2, needleX + 1, needleY - 6, PAL.OUTLINE, 4);
  px.drawLine(pivotX - 2, pivotY + 2, needleX + 1, needleY - 6, PAL.COMPASS_MID, 2);
  px.drawLine(pivotX - 2, pivotY + 2, needleX + 1, needleY - 6, PAL.COMPASS_HI, 1);
  // Steel needle point
  px.drawLine(needleX + 1, needleY - 6, needleX, needleY, PAL.METAL_DARK, 1);

  // Right leg (pencil drawing arm)
  px.drawLine(pivotX + 2, pivotY + 2, drawTipX, drawTipY - 5, PAL.OUTLINE, 4);
  px.drawLine(pivotX + 2, pivotY + 2, drawTipX, drawTipY - 5, PAL.COMPASS_MID, 2);
  px.drawLine(pivotX + 2, pivotY + 2, drawTipX - 1, drawTipY - 5, PAL.COMPASS_HI, 1);
  // Pencil tip
  px.fillRect(drawTipX - 1, drawTipY - 6, 3, 5, PAL.RULER_MID);
  px.setPx(drawTipX, drawTipY - 1, PAL.OUTLINE);

  // Horizontal measurement crossbar
  px.drawLine(pivotX - 7, 41, Math.round((pivotX + drawTipX) * 0.5), 41, PAL.OUTLINE, 2);
  px.drawLine(pivotX - 7, 41, Math.round((pivotX + drawTipX) * 0.5), 41, PAL.METAL_LIGHT, 1);

  // Circular pivot hinge at top
  px.fillCircle(pivotX, pivotY, 4, PAL.OUTLINE);
  px.fillCircle(pivotX, pivotY, 3, PAL.COMPASS_MID);
  px.fillCircle(pivotX, pivotY, 1, PAL.BRASS);
}

function drawBooksAndSymbols(px, { t, isHovered }) {
  px.drawDitherShadow(123, 86, 22, 2, PAL.SHADOW, 0.42);

  // Bottom warm tan book
  px.fillRect(102, 77, 40, 7, PAL.BOOK_TAN);
  px.fillRect(103, 78, 38, 2, PAL.BOOK_TAN_HI);
  px.fillRect(104, 80, 36, 3, PAL.PAGES);
  px.strokeRect(102, 77, 40, 7, PAL.OUTLINE);

  // Top blue formula notebook
  px.fillRect(105, 71, 36, 7, PAL.BOOK_BLUE);
  px.fillRect(106, 72, 34, 2, PAL.BOOK_BLUE_HI);
  px.fillRect(107, 74, 32, 3, PAL.PAGES);
  px.strokeRect(105, 71, 36, 7, PAL.OUTLINE);

  // Subtle flipping page arc on top of the formula notebook
  const flipCycle = (t * 0.45) % 2.4;
  if (flipCycle < 0.9 || isHovered) {
    const p = isHovered ? (t * 1.4) % 1 : flipCycle / 0.9;
    const fx = Math.round(122 - Math.cos(p * Math.PI) * 11);
    const fy = Math.round(71 - Math.sin(p * Math.PI) * 6);
    px.drawLine(122, 71, fx, fy, PAL.OUTLINE, 2);
    px.drawLine(122, 71, fx, fy, PAL.WHITE, 1);
  }

  // Subtly appearing & disappearing floating mathematical symbols (π, +, =)
  const syms = [
    { ch: 'π', x: 147, baseY: 56, phase: 0.2, col: PAL.PARABOLA_MID },
    { ch: '+', x: 148, baseY: 38, phase: 2.1, col: PAL.BOOK_BLUE },
    { ch: '=', x: 30, baseY: 22, phase: 4.0, col: PAL.PARABOLA_DARK },
  ];
  for (let i = 0; i < syms.length; i++) {
    const s = syms[i];
    const vis = Math.sin(t * 1.4 + s.phase);
    if (vis > -0.1) {
      const dy = Math.round(Math.sin(t * 2 + s.phase) * 2);
      px.drawPixelText(s.ch, s.x, s.baseY + dy, s.col, 1);
    }
  }
}

export default function MathematicsPixelScene({
  isCardHovered = false,
  onTooltipChange,
  onSceneTouchInteract,
}) {
  const particlesRef = useRef(null);
  if (!particlesRef.current) {
    particlesRef.current = createParticlePool(40);
  }

  const animRef = useRef({
    drawProgress: 1,
    isDrawing: false,
    autoCycleTimer: 0,
    touchBoostId: null,
    touchBoostTimer: 0,
  });

  const hitboxes = useMemo(() => HITBOXES, []);

  const handleObjectClick = (hit) => {
    const anim = animRef.current;
    const particles = particlesRef.current;
    anim.touchBoostId = hit.id;
    anim.touchBoostTimer = 2.6;

    if (hit.id === 'graph') {
      anim.drawProgress = 0;
      anim.isDrawing = true;
      onTooltipChange?.('Parabola: y = ax² + c (Redrawing)');
    } else if (hit.id === 'compass') {
      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * Math.PI * 2;
        particles.spawn({
          x: 117 + Math.cos(ang) * 10,
          y: 57 + Math.sin(ang) * 5,
          vx: Math.cos(ang) * 8,
          vy: Math.sin(ang) * 6 - 4,
          life: 0.7,
          color: PAL.SPARK_PURPLE,
          kind: 'star',
        });
      }
      onTooltipChange?.('Compass · Locus x² + y² = r²');
    } else if (hit.id === 'tools') {
      onTooltipChange?.('Set-Square · 90° & 45° Angles');
    } else if (hit.id === 'notebook') {
      onTooltipChange?.('Formula Notebook · Quadratic Identities');
    }

    onSceneTouchInteract?.(hit.id);
  };

  const { canvasRef, canvasProps } = usePixelScene({
    isCardHovered,
    hitboxes,
    onObjectClick: handleObjectClick,
    onDrawFrame: (px, { t, dt, isCardHovered: cardHover, hoveredId }) => {
      const anim = animRef.current;
      const particles = particlesRef.current;

      if (anim.touchBoostTimer > 0) {
        anim.touchBoostTimer = Math.max(0, anim.touchBoostTimer - dt);
        if (anim.touchBoostTimer === 0) anim.touchBoostId = null;
      }

      // Trigger subtle periodic parabola draw or explicit click redraw
      if (anim.isDrawing) {
        anim.drawProgress += dt * 0.95;
        if (anim.drawProgress >= 1) {
          anim.drawProgress = 1;
          anim.isDrawing = false;
        }
      } else if (dt > 0) {
        anim.autoCycleTimer += dt;
        if (anim.autoCycleTimer > 7.5) {
          anim.autoCycleTimer = 0;
          anim.drawProgress = 0;
          anim.isDrawing = true;
        }
      }

      const activeHoverId = hoveredId || anim.touchBoostId;

      drawRuler(px, {
        t,
        isHovered: activeHoverId === 'tools',
      });

      drawCoordinateGraph(px, {
        t,
        dt,
        isHovered: activeHoverId === 'graph',
        isCardHovered: cardHover,
        drawProgress: anim.drawProgress,
        particles,
      });

      drawBooksAndSymbols(px, {
        t,
        isHovered: activeHoverId === 'notebook',
      });

      drawCompass(px, {
        t,
        isHovered: activeHoverId === 'compass',
        isCardHovered: cardHover,
      });

      // Ambient sparkles matching reference image
      px.drawSparkle(24, 34, t * 2.1, PAL.WHITE, PAL.SPARK_GOLD);
      px.drawSparkle(108, 18, t * 2.5 + 1.2, PAL.WHITE, PAL.SPARK_PURPLE);
      px.drawSparkle(149, 46, t * 2.3 + 2.6, PAL.WHITE, PAL.SPARK_BLUE);
      if (cardHover) {
        px.drawSparkle(72, 10, t * 4.2, PAL.WHITE, PAL.SPARK_PURPLE);
      }

      particles.updateAndDraw(dt, px, t);
    },
  });

  return (
    <canvas
      ref={canvasRef}
      width={SCENE_W}
      height={SCENE_H}
      className="notebook-card__canvas"
      aria-label="Interactive pixel-art Mathematics workspace with self-drawing parabola graph, rotating compass, yellow set-square ruler, and formula notebook"
      {...canvasProps}
    />
  );
}
