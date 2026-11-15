import React, { useRef, useMemo } from 'react';
import {
  SCENE_W,
  SCENE_H,
  createParticlePool,
} from '../pixelEngine';
import { usePixelScene } from '../usePixelScene';

const PAL = {
  OUTLINE: 0x181c26,
  SHADOW: 0xb8aa8a,
  WHITE: 0xffffff,
  DNA_DARK: 0x1e40af,
  DNA_MID: 0x3b82f6,
  DNA_HI: 0x93c5fd,
  BASE_RED: 0xef4444,
  BASE_YELLOW: 0xfacc15,
  BASE_GREEN: 0x22c55e,
  BASE_CYAN: 0x38bdf8,
  STEM_DARK: 0x15803d,
  LEAF_DARK: 0x16a34a,
  LEAF_MID: 0x22c55e,
  LEAF_HI: 0x84cc16,
  LEAF_VEIN: 0xbef264,
  CELL_WALL: 0x15803d,
  CELL_MEMBRANE: 0x4ade80,
  CELL_CYTO: 0xd1fae5,
  CELL_CYTO_SHADE: 0xa7f3d0,
  NUC_DARK: 0x701a75,
  NUC_MID: 0xc026d3,
  NUC_HI: 0xf0abfc,
  MITO_ORANGE: 0xf97316,
  MITO_RED: 0xdc2626,
  VAC_BLUE: 0x38bdf8,
  VAC_DARK: 0x0284c7,
  SCOPE_DARK: 0x334155,
  SCOPE_MID: 0x64748b,
  SCOPE_LIGHT: 0xcbd5e1,
  SCOPE_HI: 0xf8fafc,
  SPARK_GOLD: 0xfacc15,
  SPARK_GREEN: 0x4ade80,
};

const HITBOXES = [
  {
    id: 'dna',
    x: 8,
    y: 10,
    w: 36,
    h: 78,
    label: 'DNA Double Helix · Genetic Code',
  },
  {
    id: 'plant',
    x: 46,
    y: 8,
    w: 54,
    h: 44,
    label: 'Photosynthesis · Chlorophyll Leaves',
  },
  {
    id: 'cell',
    x: 46,
    y: 48,
    w: 56,
    h: 40,
    label: 'Eukaryotic Cell · Click to Activate',
  },
  {
    id: 'microscope',
    x: 102,
    y: 18,
    w: 50,
    h: 70,
    label: 'Compound Microscope · 400x Optics',
  },
];

function drawGrassTufts(px, t) {
  const tufts = [
    { x: 10, y: 84, h: 6, phase: 0.2 },
    { x: 42, y: 85, h: 5, phase: 1.4 },
    { x: 102, y: 85, h: 6, phase: 2.3 },
    { x: 145, y: 84, h: 5, phase: 3.1 },
  ];
  for (let i = 0; i < tufts.length; i++) {
    const tf = tufts[i];
    const sway = Math.round(Math.sin(t * 2 + tf.phase));
    px.drawLine(tf.x, tf.y, tf.x - 2 + sway, tf.y - tf.h, PAL.LEAF_DARK, 1);
    px.drawLine(tf.x + 2, tf.y, tf.x + 2 + sway, tf.y - tf.h - 2, PAL.LEAF_MID, 1);
    px.drawLine(tf.x + 4, tf.y, tf.x + 6 + sway, tf.y - tf.h + 1, PAL.LEAF_HI, 1);
  }
}

function drawDNAHelix(px, { t, isHovered, isCardHovered, particles, dt }) {
  px.drawDitherShadow(26, 85, 13, 3, PAL.SHADOW, 0.42);

  const cx = 25;
  const yTop = 14;
  const yBot = 81;
  const amp = 9.5;
  const speed = isHovered ? 4.8 : isCardHovered ? 2.5 : 1.65;

  // Draw base-pair rungs first (every 7 pixels vertically)
  const rungPairs = [
    [PAL.BASE_RED, PAL.BASE_YELLOW],
    [PAL.BASE_CYAN, PAL.BASE_GREEN],
    [PAL.BASE_YELLOW, PAL.BASE_RED],
    [PAL.BASE_GREEN, PAL.BASE_CYAN],
  ];

  for (let y = yTop + 4; y <= yBot - 4; y += 7) {
    const phase = (y - yTop) * 0.14 + t * speed;
    const x1 = Math.round(cx + Math.sin(phase) * amp);
    const x2 = Math.round(cx + Math.sin(phase + Math.PI) * amp);
    const mid = Math.round((x1 + x2) / 2);
    const pair = rungPairs[Math.floor((y - yTop) / 7) % rungPairs.length];

    if (Math.abs(x1 - x2) >= 3) {
      px.drawLine(x1, y, mid, y, pair[0], 2);
      px.drawLine(mid, y, x2, y, pair[1], 2);
      // Center hydrogen-bond highlight pixel
      if (Math.sin(t * 4 + y * 0.2) > 0.3 || isHovered) {
        px.setPx(mid, y, PAL.WHITE);
      }
    }
  }

  // Draw the two twisted sugar-phosphate strands with depth sorting
  for (let y = yTop; y <= yBot; y++) {
    const phase = (y - yTop) * 0.14 + t * speed;
    const xA = Math.round(cx + Math.sin(phase) * amp);
    const xB = Math.round(cx + Math.sin(phase + Math.PI) * amp);
    const zA = Math.cos(phase);
    const zB = Math.cos(phase + Math.PI);

    const drawStrandPoint = (sx, sz) => {
      const col = sz > 0.25 ? PAL.DNA_HI : sz > -0.25 ? PAL.DNA_MID : PAL.DNA_DARK;
      px.fillRect(sx - 1, y, 3, 1, PAL.OUTLINE);
      px.setPx(sx, y, col);
      if (sz > 0.45) px.setPx(sx - 1, y, PAL.DNA_MID);
    };

    if (zA < zB) {
      drawStrandPoint(xA, zA);
      drawStrandPoint(xB, zB);
    } else {
      drawStrandPoint(xB, zB);
      drawStrandPoint(xA, zA);
    }
  }

  if (isHovered && dt > 0 && Math.random() < 0.22) {
    particles.spawn({
      x: cx + (Math.random() - 0.5) * 16,
      y: 22 + Math.random() * 50,
      vx: (Math.random() - 0.5) * 8,
      vy: -10,
      life: 0.65,
      color: PAL.BASE_CYAN,
      kind: 'star',
    });
  }
}

function drawLeaf(px, ox, oy, len, wid, angle, growth, flip = false) {
  const steps = Math.round(len * growth);
  for (let i = 0; i <= steps; i++) {
    const u = i / Math.max(1, steps);
    const halfW = Math.round(Math.sin(u * Math.PI) * wid * growth);
    const dir = flip ? -1 : 1;
    const cx = ox + Math.cos(angle) * i * dir;
    const cy = oy + Math.sin(angle) * i;

    for (let w = -halfW; w <= halfW; w++) {
      const lx = Math.round(cx - Math.sin(angle) * w * 0.5);
      const ly = Math.round(cy + Math.cos(angle) * w);
      const isEdge = Math.abs(w) === halfW || i === steps;
      if (isEdge) {
        px.setPx(lx, ly, PAL.OUTLINE);
      } else if (w === 0) {
        px.setPx(lx, ly, PAL.LEAF_VEIN);
      } else if (w < 0) {
        px.setPx(lx, ly, PAL.LEAF_HI);
      } else {
        px.setPx(lx, ly, PAL.LEAF_MID);
      }
    }
  }
}

function drawPlant(px, { t, dt, isHovered, isCardHovered, particles }) {
  const swayBase = Math.sin(t * 2.0) * (isHovered ? 0.08 : 0.04);
  const growth = isHovered ? 1.16 : 1 + Math.sin(t * 1.4) * 0.04;

  // Main stem rising behind the cell
  const stemBaseX = 68;
  const stemBaseY = 54;
  const stemTopX = 72 + Math.round(Math.sin(t * 1.8) * 1.5);
  const stemTopY = 25;
  px.drawLine(stemBaseX, stemBaseY, stemTopX, stemTopY, PAL.OUTLINE, 3);
  px.drawLine(stemBaseX, stemBaseY, stemTopX, stemTopY, PAL.STEM_DARK, 1);

  // Left leaf
  drawLeaf(
    px,
    69,
    40,
    17,
    5,
    -0.55 + Math.sin(t * 2.3 + 0.5) * 0.07 + swayBase,
    growth,
    true
  );

  // Upper main leaf (leaning right)
  drawLeaf(
    px,
    stemTopX,
    stemTopY + 2,
    22,
    6,
    -0.42 + Math.sin(t * 2.0 + 1.4) * 0.06 + swayBase,
    growth,
    false
  );

  // Lower right sprout leaf
  drawLeaf(
    px,
    70,
    45,
    13,
    4,
    -0.2 + Math.sin(t * 2.5 + 2.2) * 0.08 + swayBase,
    growth * 0.95,
    false
  );

  // Extra unfolding bud when plant is hovered
  if (isHovered || isCardHovered) {
    drawLeaf(px, stemTopX, stemTopY, 10, 3, -1.25 + swayBase, isHovered ? 1.1 : 0.85, false);
  }

  // Occasional falling leaf particles
  if (dt > 0) {
    const rate = isHovered ? 0.08 : 0.025;
    if (Math.random() < rate) {
      particles.spawn({
        x: 78 + (Math.random() - 0.5) * 18,
        y: 26 + Math.random() * 8,
        vx: -4 + Math.random() * 6,
        vy: 9 + Math.random() * 5,
        life: 1.5,
        color: PAL.LEAF_HI,
        outline: PAL.LEAF_DARK,
        kind: 'leaf',
        phase: Math.random() * 6,
      });
    }
  }
}

function drawCell(px, { t, isHovered, activeTimer }) {
  px.drawDitherShadow(73, 85, 22, 3, PAL.SHADOW, 0.45);

  const cx = 73;
  const cy = 67;
  const rx = 23;
  const ry = 15;
  const isActive = activeTimer > 0 || isHovered;

  // Cell outer outline, cell wall, membrane highlight, and cytoplasm
  px.fillEllipse(cx, cy, rx + 1, ry + 1, PAL.OUTLINE);
  px.fillEllipse(cx, cy, rx, ry, PAL.CELL_WALL);
  px.fillEllipse(cx, cy, rx - 2, ry - 2, PAL.CELL_MEMBRANE);
  px.fillEllipse(cx, cy, rx - 3, ry - 3, PAL.CELL_CYTO);
  // Subtle lower cytoplasm shading
  px.fillEllipse(cx + 1, cy + 2, rx - 5, ry - 5, PAL.CELL_CYTO_SHADE, 0.65);

  // Vacuole (upper-left blue organelle)
  const vx = cx - 10 + Math.round(Math.sin(t * 1.4) * 1);
  const vy = cy - 4 + Math.round(Math.cos(t * 1.2) * 0.8);
  px.fillEllipse(vx, vy, 5, 3, PAL.VAC_DARK);
  px.fillEllipse(vx, vy, 4, 2, PAL.VAC_BLUE);
  px.setPx(vx - 2, vy - 1, PAL.WHITE);

  // Mitochondria (lower-left & right-center orange-red bean organelles)
  const mitoSpeed = isActive ? 3.5 : 1.5;
  const m1x = cx - 9 + Math.round(Math.sin(t * mitoSpeed + 1.0) * 1.3);
  const m1y = cy + 6 + Math.round(Math.cos(t * mitoSpeed + 0.5) * 0.8);
  px.fillEllipse(m1x, m1y, 4, 2, PAL.MITO_RED);
  px.fillRect(m1x - 2, m1y, 5, 1, PAL.MITO_ORANGE);

  const m2x = cx + 11 + Math.round(Math.cos(t * mitoSpeed + 2.1) * 1.2);
  const m2y = cy + 5 + Math.round(Math.sin(t * mitoSpeed + 1.8) * 0.8);
  px.fillEllipse(m2x, m2y, 4, 2, PAL.MITO_RED);
  px.fillRect(m2x - 2, m2y, 5, 1, PAL.MITO_ORANGE);

  // Tiny floating cytoplasmic granules
  for (let i = 0; i < 6; i++) {
    const gx = cx - 14 + ((i * 7) % 28) + Math.sin(t * 1.8 + i) * 1.5;
    const gy = cy - 7 + ((i * 5) % 14) + Math.cos(t * 1.6 + i) * 1.2;
    px.setPx(gx, gy, i % 2 === 0 ? PAL.LEAF_DARK : PAL.VAC_DARK, 0.85);
  }

  // Central pulsing purple-magenta nucleus
  const nucPulse = Math.sin(t * (isActive ? 7 : 2.6)) > 0.45 ? 1 : 0;
  const nr = 5 + (isActive ? nucPulse : 0);
  px.fillCircle(cx + 1, cy - 1, nr + 1, PAL.OUTLINE);
  px.fillCircle(cx + 1, cy - 1, nr, PAL.NUC_MID);
  px.fillCircle(cx + 1, cy - 1, Math.max(2, nr - 2), PAL.NUC_DARK);
  px.setPx(cx - 1, cy - 3, PAL.NUC_HI);
  px.setPx(cx, cy - 3, PAL.WHITE);

  if (isActive) {
    px.drawSparkle(cx + 1, cy - 1, t * 9, PAL.WHITE, PAL.SPARK_GOLD);
  }
}

function drawMicroscope(px, { t, isHovered, isCardHovered }) {
  px.drawDitherShadow(127, 85, 19, 3, PAL.SHADOW, 0.44);

  // Heavy base platform
  px.fillRect(108, 77, 36, 7, PAL.SCOPE_DARK);
  px.fillRect(109, 78, 34, 2, PAL.SCOPE_MID);
  px.fillRect(110, 78, 22, 1, PAL.SCOPE_LIGHT);
  px.strokeRect(108, 77, 36, 7, PAL.OUTLINE);

  // Curved C-arm
  px.drawLine(134, 77, 138, 56, PAL.OUTLINE, 7);
  px.drawLine(138, 56, 130, 38, PAL.OUTLINE, 7);
  px.drawLine(134, 77, 138, 56, PAL.SCOPE_MID, 5);
  px.drawLine(138, 56, 130, 38, PAL.SCOPE_MID, 5);
  px.drawLine(133, 76, 136, 56, PAL.SCOPE_LIGHT, 2);
  px.drawLine(136, 56, 129, 39, PAL.SCOPE_LIGHT, 2);

  // Fine focus dial knob
  px.fillCircle(135, 62, 4, PAL.OUTLINE);
  px.fillCircle(135, 62, 3, PAL.SCOPE_LIGHT);
  px.setPx(134, 61, PAL.SCOPE_HI);

  // Specimen stage + glass slide
  px.fillRect(104, 61, 25, 4, PAL.SCOPE_DARK);
  px.strokeRect(104, 61, 25, 4, PAL.OUTLINE);
  // Slide & illuminated sample
  px.fillRect(108, 59, 14, 2, PAL.SCOPE_HI);
  px.fillRect(113, 59, 3, 2, PAL.SPARK_GREEN);

  // Subtle mechanical vertical travel of the optical tube & objective lens
  const focusShift = Math.round(
    Math.sin(t * (isHovered ? 3.8 : 1.4)) * (isHovered || isCardHovered ? 1.4 : 0.8)
  );

  // Upper optical barrel + eyepiece
  px.drawLine(127, 25 + focusShift, 118, 46 + focusShift, PAL.OUTLINE, 8);
  px.drawLine(127, 25 + focusShift, 118, 46 + focusShift, PAL.SCOPE_MID, 6);
  px.drawLine(126, 25 + focusShift, 117, 45 + focusShift, PAL.SCOPE_LIGHT, 2);
  px.drawLine(125, 25 + focusShift, 117, 43 + focusShift, PAL.SCOPE_HI, 1);

  // Eyepiece rim
  px.fillRect(124, 21 + focusShift, 8, 5, PAL.SCOPE_DARK);
  px.strokeRect(124, 21 + focusShift, 8, 5, PAL.OUTLINE);
  px.setPx(126, 22 + focusShift, PAL.SCOPE_HI);

  // Objective nosepiece & lens pointing at slide
  px.fillRect(113, 46 + focusShift, 8, 6, PAL.SCOPE_DARK);
  px.strokeRect(113, 46 + focusShift, 8, 6, PAL.OUTLINE);
  px.fillRect(115, 52 + focusShift, 4, 4, PAL.SCOPE_LIGHT);
  px.strokeRect(115, 52 + focusShift, 4, 4, PAL.OUTLINE);

  if (isHovered || isCardHovered) {
    px.drawSparkle(116, 58, t * 5, PAL.WHITE, PAL.SPARK_GREEN);
  }
}

export default function BiologyPixelScene({
  isCardHovered = false,
  onTooltipChange,
  onSceneTouchInteract,
}) {
  const particlesRef = useRef(null);
  if (!particlesRef.current) {
    particlesRef.current = createParticlePool(44);
  }

  const animRef = useRef({
    cellActiveTimer: 0,
    touchBoostId: null,
    touchBoostTimer: 0,
  });

  const hitboxes = useMemo(() => HITBOXES, []);

  const handleObjectClick = (hit) => {
    const anim = animRef.current;
    const particles = particlesRef.current;
    anim.touchBoostId = hit.id;
    anim.touchBoostTimer = 2.4;

    if (hit.id === 'cell') {
      anim.cellActiveTimer = 2.0;
      const colors = [PAL.SPARK_GOLD, PAL.SPARK_GREEN, PAL.NUC_HI, PAL.VAC_BLUE];
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * Math.PI * 2;
        particles.spawn({
          x: 73,
          y: 66,
          vx: Math.cos(ang) * 18,
          vy: Math.sin(ang) * 14 - 8,
          life: 0.85,
          color: colors[i % colors.length],
          kind: i % 2 === 0 ? 'star' : 'px',
        });
      }
      onTooltipChange?.('Cell Active: ATP & Nucleus Pulse');
    } else if (hit.id === 'dna') {
      for (let i = 0; i < 10; i++) {
        particles.spawn({
          x: 25 + (Math.random() - 0.5) * 14,
          y: 20 + i * 6,
          vx: (Math.random() - 0.5) * 10,
          vy: -12,
          life: 0.75,
          color: i % 2 === 0 ? PAL.BASE_CYAN : PAL.BASE_YELLOW,
          kind: 'star',
        });
      }
      onTooltipChange?.('DNA Helix · Base Pairs A-T, C-G');
    } else if (hit.id === 'plant') {
      for (let i = 0; i < 8; i++) {
        particles.spawn({
          x: 68 + (Math.random() - 0.5) * 20,
          y: 28,
          vx: (Math.random() - 0.5) * 12,
          vy: 10 + Math.random() * 8,
          life: 1.4,
          color: PAL.LEAF_HI,
          outline: PAL.LEAF_DARK,
          kind: 'leaf',
          phase: i,
        });
      }
      onTooltipChange?.('Photosynthesis · 6CO₂ + 6H₂O -> Glucose');
    } else if (hit.id === 'microscope') {
      onTooltipChange?.('Microscope · Inspecting Cell Membrane');
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

      if (anim.cellActiveTimer > 0) anim.cellActiveTimer = Math.max(0, anim.cellActiveTimer - dt);
      if (anim.touchBoostTimer > 0) {
        anim.touchBoostTimer = Math.max(0, anim.touchBoostTimer - dt);
        if (anim.touchBoostTimer === 0) anim.touchBoostId = null;
      }

      const activeHoverId = hoveredId || anim.touchBoostId;

      drawGrassTufts(px, t);

      drawDNAHelix(px, {
        t,
        dt,
        isHovered: activeHoverId === 'dna',
        isCardHovered: cardHover,
        particles,
      });

      drawPlant(px, {
        t,
        dt,
        isHovered: activeHoverId === 'plant',
        isCardHovered: cardHover,
        particles,
      });

      drawCell(px, {
        t,
        isHovered: activeHoverId === 'cell',
        activeTimer: anim.cellActiveTimer,
      });

      drawMicroscope(px, {
        t,
        isHovered: activeHoverId === 'microscope',
        isCardHovered: cardHover,
      });

      // Ambient sparkles matching reference image
      px.drawSparkle(44, 18, t * 2.1, PAL.WHITE, PAL.SPARK_GREEN);
      px.drawSparkle(98, 22, t * 2.4 + 1.3, PAL.WHITE, PAL.SPARK_GOLD);
      px.drawSparkle(146, 44, t * 2.6 + 2.5, PAL.WHITE, PAL.SPARK_GOLD);
      if (cardHover) {
        px.drawSparkle(73, 14, t * 4.2, PAL.WHITE, PAL.SPARK_GREEN);
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
      aria-label="Interactive pixel-art Biology lab with rotating DNA double helix, swaying green plant, pulsing eukaryotic cell, and microscope"
      {...canvasProps}
    />
  );
}
