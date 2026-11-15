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
  GLASS_FILL: 0xe0f2fe,
  GLASS_TINT: 0xbae6fd,
  WHITE: 0xffffff,
  ORANGE_DARK: 0xc2410c,
  ORANGE_MID: 0xf97316,
  ORANGE_HI: 0xfb923c,
  ORANGE_FOAM: 0xfed7aa,
  BLUE_DARK: 0x0369a1,
  BLUE_MID: 0x0ea5e9,
  BLUE_HI: 0x38bdf8,
  BLUE_FOAM: 0xbae6fd,
  WOOD_HI: 0xe89c52,
  WOOD_MID: 0xb86d2c,
  WOOD_DARK: 0x783f15,
  TUBE_RED: 0xef4444,
  TUBE_RED_HI: 0xfca5a5,
  TUBE_PURP: 0x8b5cf6,
  TUBE_PURP_HI: 0xc4b5fd,
  TUBE_GREEN: 0x22c55e,
  TUBE_GREEN_HI: 0x86efac,
  ATOM_OUTLINE: 0x181c26,
  ATOM_DARK: 0x334155,
  ATOM_MID: 0x64748b,
  ATOM_HI: 0xcbd5e1,
  BOND: 0x475569,
  NOTE_BG: 0xfef08a,
  NOTE_EDGE: 0xeab308,
  SPARK_GOLD: 0xfacc15,
  SPARK_ORANGE: 0xf97316,
  SPARK_CYAN: 0x38bdf8,
  REACTION_PINK: 0xe879f9,
  REACTION_GREEN: 0x4ade80,
  GRASS_DARK: 0x15803d,
  GRASS_LIGHT: 0x4ade80,
};

const MOL_NODES = [
  { x: 64, y: 27 }, // 0
  { x: 72, y: 18 }, // 1
  { x: 83, y: 20 }, // 2
  { x: 87, y: 31 }, // 3
  { x: 78, y: 39 }, // 4
  { x: 67, y: 37 }, // 5
  { x: 96, y: 15 }, // 6
  { x: 107, y: 22 }, // 7
  { x: 105, y: 34 }, // 8
  { x: 114, y: 14 }, // 9
];

const MOL_BONDS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [2, 6],
  [6, 7],
  [7, 8],
  [8, 3],
  [7, 9],
];

const HITBOXES = [
  {
    id: 'flask',
    x: 10,
    y: 16,
    w: 42,
    h: 72,
    label: 'Conical Flask · Boiling Solution',
  },
  {
    id: 'beaker',
    x: 52,
    y: 48,
    w: 28,
    h: 40,
    label: 'Beaker · Click for Chemical Reaction',
  },
  {
    id: 'tubes',
    x: 80,
    y: 48,
    w: 46,
    h: 40,
    label: 'Test Tubes · Reagent Solutions',
  },
  {
    id: 'molecule',
    x: 56,
    y: 6,
    w: 98,
    h: 42,
    label: 'Molecular Bonds & H₂O',
  },
];

function drawFlask(px, { t, dt, isHovered, isCardHovered, particles }) {
  px.drawDitherShadow(31, 84, 18, 3, PAL.SHADOW, 0.45);

  const neckLeft = 26;
  const neckRight = 35;
  const topY = 23;
  const shoulderY = 44;
  const bottomY = 82;

  // Conical glass silhouette + liquid fill
  const liquidTopY = 58;
  const waveSpeed = isHovered ? 6.2 : 3.4;
  const waveAmp = isHovered ? 1.8 : 0.9;

  for (let y = topY; y <= bottomY; y++) {
    let lx;
    let rx;
    if (y <= shoulderY) {
      lx = neckLeft;
      rx = neckRight;
    } else {
      const ratio = (y - shoulderY) / (bottomY - shoulderY);
      lx = Math.round(neckLeft - ratio * 13);
      rx = Math.round(neckRight + ratio * 13);
    }

    // Rounded bottom corners
    if (y >= bottomY - 2) {
      const trim = y === bottomY ? 3 : 1;
      lx += trim;
      rx -= trim;
    }

    for (let x = lx; x <= rx; x++) {
      if (x === lx || x === rx || y === bottomY) {
        px.setPx(x, y, PAL.OUTLINE);
        continue;
      }

      const waveY = liquidTopY + Math.round(Math.sin(x * 0.32 + t * waveSpeed) * waveAmp);
      if (y >= waveY && y < bottomY) {
        if (y === waveY) {
          px.setPx(x, y, PAL.ORANGE_FOAM);
        } else if (y < waveY + 3) {
          px.setPx(x, y, PAL.ORANGE_HI);
        } else if (y > bottomY - 5 || x > rx - 4) {
          px.setPx(x, y, PAL.ORANGE_DARK);
        } else {
          px.setPx(x, y, PAL.ORANGE_MID);
        }
      } else {
        px.setPx(x, y, x < lx + 4 ? PAL.GLASS_FILL : PAL.GLASS_TINT, 0.72);
      }
    }
  }

  // Flask rim lip
  px.fillRect(24, topY - 2, 14, 3, PAL.GLASS_FILL);
  px.strokeRect(24, topY - 2, 14, 3, PAL.OUTLINE);

  // Specular highlights & volume graduation ticks
  px.drawLine(25, 47, 17, 74, PAL.WHITE, 1, 0.85);
  px.fillRect(28, 26, 1, 14, PAL.WHITE);
  px.fillRect(31, 51, 3, 1, PAL.OUTLINE, 0.45);
  px.fillRect(31, 61, 4, 1, PAL.OUTLINE, 0.45);
  px.fillRect(31, 71, 3, 1, PAL.OUTLINE, 0.45);

  // Continuous rising bubbles inside the orange liquid
  const bubbleCount = isHovered ? 7 : isCardHovered ? 5 : 4;
  for (let i = 0; i < bubbleCount; i++) {
    const cycle = (t * (isHovered ? 1.15 : 0.65) + i * 0.23) % 1;
    const bx = 24 + ((i * 5) % 15) + Math.sin(t * 4 + i) * 1.5;
    const by = 78 - cycle * 19;
    px.setPx(bx, by, PAL.ORANGE_FOAM);
    if (i % 2 === 0) {
      px.setPx(bx + 1, by, PAL.WHITE);
    }
  }

  // Rising vapor particles from flask opening
  if (dt > 0) {
    const vaporRate = isHovered ? 0.38 : isCardHovered ? 0.22 : 0.12;
    if (Math.random() < vaporRate) {
      particles.spawn({
        x: 29 + (Math.random() - 0.5) * 5,
        y: topY - 4,
        vx: (Math.random() - 0.5) * 6,
        vy: -12 - Math.random() * 10,
        life: 0.75 + Math.random() * 0.45,
        color: isHovered ? PAL.ORANGE_FOAM : PAL.WHITE,
        outline: PAL.BLUE_HI,
        size: Math.random() > 0.5 ? 2 : 1,
        kind: 'bubble',
      });
    }
  }
}

function drawBeaker(px, { t, isHovered, reactionTimer }) {
  px.drawDitherShadow(65, 84, 12, 2, PAL.SHADOW, 0.4);

  const bx = 54;
  const by = 52;
  const bw = 22;
  const bh = 31;
  const reacting = reactionTimer > 0;
  const liqSurface = reacting ? 58 : 62;

  for (let y = by; y <= by + bh; y++) {
    for (let x = bx; x <= bx + bw; x++) {
      if (x === bx || x === bx + bw || y === by + bh) {
        px.setPx(x, y, PAL.OUTLINE);
        continue;
      }
      const wave = Math.round(Math.sin(x * 0.45 + t * (reacting ? 9 : 3.2)) * (reacting ? 1.5 : 0.7));
      if (y >= liqSurface + wave && y < by + bh) {
        if (y === liqSurface + wave) {
          px.setPx(x, y, reacting ? PAL.REACTION_GREEN : PAL.BLUE_FOAM);
        } else if (reacting && Math.sin(t * 14 + x * 0.3 + y * 0.2) > 0.3) {
          px.setPx(x, y, PAL.REACTION_PINK);
        } else if (y > by + bh - 5 || x > bx + bw - 4) {
          px.setPx(x, y, PAL.BLUE_DARK);
        } else if (y < liqSurface + wave + 3) {
          px.setPx(x, y, PAL.BLUE_HI);
        } else {
          px.setPx(x, y, PAL.BLUE_MID);
        }
      } else {
        px.setPx(x, y, x < bx + 5 ? PAL.GLASS_FILL : PAL.GLASS_TINT, 0.65);
      }
    }
  }

  // Beaker rim & pouring spout
  px.fillRect(bx - 1, by - 1, bw + 3, 2, PAL.GLASS_FILL);
  px.strokeRect(bx - 1, by - 1, bw + 3, 2, PAL.OUTLINE);
  // Glass specular highlight & measurement ticks
  px.fillRect(bx + 3, by + 3, 2, bh - 6, PAL.WHITE, 0.8);
  for (let ty = by + 8; ty < by + bh - 4; ty += 5) {
    px.fillRect(bx + 6, ty, 3, 1, PAL.OUTLINE, 0.55);
  }

  // Hover highlight
  if (isHovered) {
    px.drawSparkle(bx + bw / 2, by - 4, t * 8, PAL.WHITE, PAL.SPARK_CYAN);
  }

  // Internal beaker bubbles
  const count = reacting ? 6 : 2;
  for (let i = 0; i < count; i++) {
    const cyc = (t * (reacting ? 1.8 : 0.55) + i * 0.37) % 1;
    const pxB = bx + 6 + ((i * 4) % 12);
    const pyB = by + bh - 3 - cyc * 16;
    px.setPx(pxB, pyB, PAL.WHITE);
  }
}

function drawTestTubes(px, { t, isHovered }) {
  px.drawDitherShadow(103, 84, 21, 3, PAL.SHADOW, 0.42);

  // Back wooden rack rails
  px.fillRect(83, 64, 40, 4, PAL.WOOD_DARK);
  px.strokeRect(83, 64, 40, 4, PAL.OUTLINE);

  const tubes = [
    { cx: 90, col: PAL.TUBE_RED, hi: PAL.TUBE_RED_HI, level: 63, phase: 0.2 },
    { cx: 102, col: PAL.TUBE_PURP, hi: PAL.TUBE_PURP_HI, level: 60, phase: 1.7 },
    { cx: 114, col: PAL.TUBE_GREEN, hi: PAL.TUBE_GREEN_HI, level: 65, phase: 3.1 },
  ];

  for (let i = 0; i < tubes.length; i++) {
    const tb = tubes[i];
    const tx = tb.cx - 3;
    const topY = 51;
    const botY = 79;
    const tw = 6;
    const osc = Math.round(Math.sin(t * (isHovered ? 4.2 : 2.1) + tb.phase) * 1.1);
    const liqTop = tb.level + osc;

    for (let y = topY; y <= botY; y++) {
      const trim = y === botY ? 2 : y === botY - 1 ? 1 : 0;
      for (let x = tx + trim; x <= tx + tw - trim; x++) {
        if (x === tx + trim || x === tx + tw - trim || y === botY) {
          px.setPx(x, y, PAL.OUTLINE);
        } else if (y >= liqTop) {
          px.setPx(x, y, y === liqTop || x === tx + 1 ? tb.hi : tb.col);
        } else {
          px.setPx(x, y, PAL.GLASS_FILL, 0.72);
        }
      }
    }

    // Lip rim
    px.fillRect(tx - 1, topY, tw + 3, 2, PAL.GLASS_FILL);
    px.strokeRect(tx - 1, topY, tw + 3, 2, PAL.OUTLINE);

    // Rising bubble at staggered interval
    const bCycle = (t * 0.75 + tb.phase) % 1;
    const by = botY - 2 - bCycle * (botY - liqTop - 2);
    if (by > liqTop) {
      px.setPx(tb.cx, by, PAL.WHITE);
    }
  }

  // Front wooden rack posts & bottom base
  px.fillRect(83, 66, 3, 14, PAL.WOOD_MID);
  px.strokeRect(83, 66, 3, 14, PAL.OUTLINE);
  px.fillRect(120, 66, 3, 14, PAL.WOOD_MID);
  px.strokeRect(120, 66, 3, 14, PAL.OUTLINE);

  px.fillRect(81, 79, 44, 5, PAL.WOOD_MID);
  px.fillRect(82, 80, 42, 2, PAL.WOOD_HI);
  px.strokeRect(81, 79, 44, 5, PAL.OUTLINE);

  // Small grass tuft accents near base (matching reference)
  px.drawLine(125, 83, 127, 79, PAL.GRASS_DARK, 1);
  px.drawLine(127, 83, 129, 77, PAL.GRASS_LIGHT, 1);
  px.drawLine(129, 83, 131, 80, PAL.GRASS_DARK, 1);
}

function drawMoleculeAndNote(px, { t, isHovered, isCardHovered }) {
  // Draw bonds first so atom spheres cleanly overlap bond endpoints
  for (let i = 0; i < MOL_BONDS.length; i++) {
    const [aIdx, bIdx] = MOL_BONDS[i];
    const a = MOL_NODES[aIdx];
    const b = MOL_NODES[bIdx];
    px.drawLine(a.x, a.y, b.x, b.y, PAL.BOND, 1);
    // Double bond accent on selected edges
    if (i === 0 || i === 3 || i === 7) {
      px.drawLine(a.x + 1, a.y + 1, b.x + 1, b.y + 1, PAL.ATOM_MID, 1, 0.7);
    }
  }

  // Traveling valence electron particle along the ring perimeter
  const ringOrder = [0, 1, 2, 6, 7, 8, 3, 4, 5];
  const segFloat = (t * (isHovered ? 3.2 : 1.5)) % ringOrder.length;
  const segIdx = Math.floor(segFloat);
  const segFrac = segFloat - segIdx;
  const nA = MOL_NODES[ringOrder[segIdx]];
  const nB = MOL_NODES[ringOrder[(segIdx + 1) % ringOrder.length]];
  const ex = nA.x + (nB.x - nA.x) * segFrac;
  const ey = nA.y + (nB.y - nA.y) * segFrac;
  px.fillRect(ex - 1, ey - 1, 2, 2, PAL.SPARK_GOLD);
  px.setPx(ex, ey, PAL.WHITE);

  // Sequential atom highlight index on hover
  const activeAtom = isHovered
    ? Math.floor(t * 5.5) % MOL_NODES.length
    : -1;

  for (let i = 0; i < MOL_NODES.length; i++) {
    const node = MOL_NODES[i];
    const isSelected = i === activeAtom;
    const pulse = Math.sin(t * 3 + i * 0.7) > 0.72;
    const r = isSelected ? 3 : 2;

    if (isSelected) {
      px.fillCircle(node.x, node.y, 4, PAL.SPARK_ORANGE, 0.75);
    }

    px.fillCircle(node.x, node.y, r, PAL.ATOM_OUTLINE);
    px.fillCircle(
      node.x,
      node.y,
      r - 1,
      isSelected ? PAL.SPARK_GOLD : pulse || isCardHovered ? PAL.ATOM_MID : PAL.ATOM_DARK
    );
    px.setPx(node.x - 1, node.y - 1, isSelected ? PAL.WHITE : PAL.ATOM_HI);
  }

  // Tilted periodic-style H₂O note on the right
  const nx = 126;
  const ny = 29 + Math.round(Math.sin(t * 1.8 + 0.8) * 0.8);
  const nw = 28;
  const nh = 20;
  px.fillRect(nx + 1, ny + 1, nw, nh, PAL.OUTLINE, 0.25);
  px.fillRect(nx, ny, nw, nh, PAL.NOTE_BG);
  px.fillRect(nx + 1, ny + nh - 3, nw - 2, 2, PAL.NOTE_EDGE);
  px.strokeRect(nx, ny, nw, nh, PAL.OUTLINE);
  // Tiny periodic atomic number chip at top-left
  px.fillRect(nx + 2, ny + 2, 3, 2, PAL.ORANGE_MID);
  // Crisp H₂O pixel text
  px.drawPixelText('H₂O', nx + 8, ny + 8, PAL.OUTLINE, 1);
}

export default function ChemistryPixelScene({
  isCardHovered = false,
  onTooltipChange,
  onSceneTouchInteract,
}) {
  const particlesRef = useRef(null);
  if (!particlesRef.current) {
    particlesRef.current = createParticlePool(48);
  }

  const animRef = useRef({
    reactionTimer: 0,
    touchBoostId: null,
    touchBoostTimer: 0,
  });

  const hitboxes = useMemo(() => HITBOXES, []);

  const handleObjectClick = (hit) => {
    const anim = animRef.current;
    const particles = particlesRef.current;
    anim.touchBoostId = hit.id;
    anim.touchBoostTimer = 2.4;

    if (hit.id === 'beaker') {
      anim.reactionTimer = 2.0;
      const colors = [
        PAL.SPARK_ORANGE,
        PAL.SPARK_CYAN,
        PAL.SPARK_GOLD,
        PAL.REACTION_GREEN,
        PAL.REACTION_PINK,
      ];
      for (let i = 0; i < 20; i++) {
        const spread = ((i % 7) - 3) * 7;
        particles.spawn({
          x: 65 + (Math.random() - 0.5) * 8,
          y: 54,
          vx: spread,
          vy: -26 - (i % 5) * 7,
          gravity: 24,
          life: 0.85 + (i % 3) * 0.25,
          color: colors[i % colors.length],
          kind: i % 3 === 0 ? 'star' : 'px',
          size: i % 4 === 0 ? 2 : 1,
        });
      }
      onTooltipChange?.('Reaction: CuSO₄ + Heat -> Sparks!');
    } else if (hit.id === 'flask') {
      for (let i = 0; i < 12; i++) {
        particles.spawn({
          x: 30 + (Math.random() - 0.5) * 6,
          y: 22,
          vx: (Math.random() - 0.5) * 14,
          vy: -18 - i * 2,
          life: 0.9,
          color: PAL.ORANGE_FOAM,
          outline: PAL.ORANGE_MID,
          size: 2,
          kind: 'bubble',
        });
      }
      onTooltipChange?.('Vaporization · Active boiling bubbles');
    } else if (hit.id === 'molecule') {
      onTooltipChange?.('Covalent Ring & Polar H₂O');
    } else if (hit.id === 'tubes') {
      onTooltipChange?.('pH Reagents · Acid, Neutral & Base');
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

      if (anim.reactionTimer > 0) anim.reactionTimer = Math.max(0, anim.reactionTimer - dt);
      if (anim.touchBoostTimer > 0) {
        anim.touchBoostTimer = Math.max(0, anim.touchBoostTimer - dt);
        if (anim.touchBoostTimer === 0) anim.touchBoostId = null;
      }

      const activeHoverId = hoveredId || anim.touchBoostId;

      drawFlask(px, {
        t,
        dt,
        isHovered: activeHoverId === 'flask',
        isCardHovered: cardHover,
        particles,
      });

      drawBeaker(px, {
        t,
        isHovered: activeHoverId === 'beaker',
        reactionTimer: anim.reactionTimer,
      });

      drawTestTubes(px, {
        t,
        isHovered: activeHoverId === 'tubes',
      });

      drawMoleculeAndNote(px, {
        t,
        isHovered: activeHoverId === 'molecule',
        isCardHovered: cardHover,
      });

      // Ambient retro sparkles matching reference image
      px.drawSparkle(48, 16, t * 2.2, PAL.WHITE, PAL.SPARK_GOLD);
      px.drawSparkle(12, 42, t * 2.5 + 1.4, PAL.WHITE, PAL.SPARK_ORANGE);
      px.drawSparkle(138, 72, t * 2.3 + 2.2, PAL.WHITE, PAL.REACTION_GREEN);
      if (cardHover) {
        px.drawSparkle(80, 45, t * 4.5, PAL.WHITE, PAL.SPARK_CYAN);
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
      aria-label="Interactive pixel-art Chemistry lab with bubbling orange flask, reacting blue beaker, test tubes, covalent molecule, and H2O tile"
      {...canvasProps}
    />
  );
}
