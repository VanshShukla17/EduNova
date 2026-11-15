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
  WOOD_HI: 0xe89c52,
  WOOD_MID: 0xb86d2c,
  WOOD_DARK: 0x783f15,
  METAL_HI: 0xffffff,
  METAL_LIGHT: 0xdbeafe,
  METAL_MID: 0x94a3b8,
  METAL_DARK: 0x475569,
  STRING: 0x334155,
  BOOK_BLUE_HI: 0x60a5fa,
  BOOK_BLUE: 0x2563eb,
  BOOK_TEAL_HI: 0x38bdf8,
  BOOK_TEAL: 0x0284c7,
  PAGES: 0xfef9c3,
  PRISM_HI: 0xf0f9ff,
  PRISM_LIGHT: 0xbae6fd,
  PRISM_MID: 0x7dd3fc,
  PRISM_DARK: 0x38bdf8,
  PRISM_DEEP: 0x0284c7,
  NOTE_BG: 0xfef08a,
  NOTE_SHADE: 0xfacc15,
  SPARK_YELLOW: 0xfacc15,
  SPARK_BLUE: 0x60a5fa,
  WHITE: 0xffffff,
  RAINBOW: [0xef4444, 0xf97316, 0xfacc15, 0x22c55e, 0x3b82f6, 0x8b5cf6],
};

const HITBOXES = [
  {
    id: 'formula',
    x: 56,
    y: 62,
    w: 40,
    h: 28,
    label: 'F = ma · Newton’s Second Law',
  },
  {
    id: 'prism',
    x: 92,
    y: 18,
    w: 66,
    h: 56,
    label: 'Glass Prism · Light Dispersion',
  },
  {
    id: 'cradle',
    x: 6,
    y: 12,
    w: 76,
    h: 72,
    label: "Newton's Cradle · Momentum Conservation",
  },
];

function drawNewtonsCradle(px, { t, isHovered, isCardHovered, impactFlash, particles }) {
  // Ground dithered shadow
  px.drawDitherShadow(41, 83, 30, 4, PAL.SHADOW, 0.45);

  // Wooden base platform & feet
  px.fillRect(10, 72, 62, 6, PAL.WOOD_MID);
  px.fillRect(11, 73, 60, 2, PAL.WOOD_HI);
  px.fillRect(11, 76, 60, 1, PAL.WOOD_DARK);
  px.strokeRect(10, 72, 62, 6, PAL.OUTLINE);
  // Base end feet
  px.fillRect(12, 78, 6, 3, PAL.WOOD_DARK);
  px.strokeRect(12, 78, 6, 3, PAL.OUTLINE);
  px.fillRect(64, 78, 6, 3, PAL.WOOD_DARK);
  px.strokeRect(64, 78, 6, 3, PAL.OUTLINE);

  // Angled side posts (left and right)
  px.drawLine(14, 72, 18, 22, PAL.OUTLINE, 5);
  px.drawLine(14, 72, 18, 22, PAL.WOOD_MID, 3);
  px.drawLine(14, 71, 17, 22, PAL.WOOD_HI, 1);

  px.drawLine(67, 72, 63, 22, PAL.OUTLINE, 5);
  px.drawLine(67, 72, 63, 22, PAL.WOOD_MID, 3);
  px.drawLine(66, 71, 62, 22, PAL.WOOD_HI, 1);

  // Top horizontal wooden bar
  px.fillRect(14, 17, 54, 6, PAL.WOOD_MID);
  px.fillRect(15, 18, 52, 2, PAL.WOOD_HI);
  px.fillRect(15, 21, 52, 1, PAL.WOOD_DARK);
  px.strokeRect(14, 17, 54, 6, PAL.OUTLINE);
  // Decorative corner caps on bar
  px.fillRect(13, 16, 4, 8, PAL.WOOD_DARK);
  px.strokeRect(13, 16, 4, 8, PAL.OUTLINE);
  px.fillRect(65, 16, 4, 8, PAL.WOOD_DARK);
  px.strokeRect(65, 16, 4, 8, PAL.OUTLINE);

  // Pendulum kinematics
  const speed = isHovered ? 4.3 : isCardHovered ? 3.4 : 2.75;
  const maxAngle = isHovered ? 0.68 : isCardHovered ? 0.5 : 0.38;
  const swing = Math.sin(t * speed);
  const angleLeft = swing < 0 ? swing * maxAngle : 0;
  const angleRight = swing > 0 ? swing * maxAngle : 0;

  const pivotY = 23;
  const stringLen = 33;
  const restXs = [25, 33, 41, 49, 57];

  for (let i = 0; i < 5; i++) {
    const pxPivot = restXs[i];
    let ang = 0;
    if (i === 0) ang = angleLeft;
    else if (i === 4) ang = angleRight;
    else if (impactFlash > 0) {
      // Subtle micro-vibration through middle spheres on impact
      ang = (i % 2 === 0 ? 1 : -1) * 0.025 * impactFlash;
    }

    const bx = Math.round(pxPivot + Math.sin(ang) * stringLen);
    const by = Math.round(pivotY + Math.cos(ang) * stringLen);

    // String
    px.drawLine(pxPivot, pivotY, bx, by - 4, PAL.STRING, 1);
    px.setPx(pxPivot, pivotY, PAL.OUTLINE);

    // Metallic sphere (radius 4)
    px.fillCircle(bx, by, 4, PAL.OUTLINE);
    px.fillCircle(bx, by, 3, PAL.METAL_DARK);
    px.fillCircle(bx - 1, by - 1, 2, PAL.METAL_MID);
    px.fillRect(bx - 2, by - 2, 2, 2, PAL.METAL_LIGHT);
    px.setPx(bx - 2, by - 2, PAL.METAL_HI);

    // Kinetic motion arc / spark on fast outer swings
    if ((i === 0 && angleLeft < -0.25) || (i === 4 && angleRight > 0.25)) {
      const dir = i === 0 ? -1 : 1;
      px.setPx(bx + dir * 6, by - 2, isHovered ? PAL.SPARK_YELLOW : PAL.SPARK_BLUE);
      px.setPx(bx + dir * 7, by, PAL.SPARK_YELLOW);
      if (isHovered && Math.sin(t * 20 + i) > 0.7) {
        particles.spawn({
          x: bx + dir * 4,
          y: by,
          vx: dir * 14,
          vy: -10,
          life: 0.45,
          color: PAL.SPARK_YELLOW,
          kind: 'px',
        });
      }
    }
  }

  // Impact spark between spheres when swing crosses zero
  if (impactFlash > 0.2) {
    const flashX = swing >= 0 ? 29 : 53;
    px.setPx(flashX, 55, PAL.METAL_HI);
    px.setPx(flashX, 53, PAL.SPARK_YELLOW);
    px.setPx(flashX, 57, PAL.SPARK_YELLOW);
  }

  // Two small stacked textbooks resting on the base
  // Bottom blue book
  px.fillRect(23, 76, 26, 6, PAL.BOOK_BLUE);
  px.fillRect(24, 77, 24, 2, PAL.BOOK_BLUE_HI);
  px.fillRect(25, 79, 22, 2, PAL.PAGES);
  px.strokeRect(23, 76, 26, 6, PAL.OUTLINE);
  // Top teal book
  px.fillRect(26, 70, 22, 6, PAL.BOOK_TEAL);
  px.fillRect(27, 71, 20, 2, PAL.BOOK_TEAL_HI);
  px.fillRect(28, 73, 18, 2, PAL.PAGES);
  px.strokeRect(26, 70, 22, 6, PAL.OUTLINE);
}

function drawPrism(px, { t, isHovered, isCardHovered, burstTimer }) {
  px.drawDitherShadow(113, 74, 17, 3, PAL.SHADOW, 0.35);

  const apexX = 113;
  const apexY = 23;
  const leftX = 97;
  const leftY = 67;
  const rightX = 129;
  const rightY = 67;

  // Incoming white light beam from upper-left
  const inStartX = 76;
  const inStartY = 41;
  const inEndX = 104;
  const inEndY = 49;
  px.drawLine(inStartX, inStartY, inEndX, inEndY, PAL.METAL_HI, 2);
  px.drawLine(inStartX, inStartY - 1, inEndX, inEndY - 1, PAL.PRISM_LIGHT, 1, 0.75);

  // Traveling light pulse dot on incoming beam
  const inProgress = (t * 1.4) % 1;
  const pulseX = inStartX + (inEndX - inStartX) * inProgress;
  const pulseY = inStartY + (inEndY - inStartY) * inProgress;
  px.fillRect(pulseX, pulseY, 2, 2, PAL.SPARK_YELLOW);

  // Rainbow dispersion rays exiting right facet
  const rainbowIntensity = burstTimer > 0 ? 1 : isHovered ? 0.96 : 0.88;
  const bandCount = PAL.RAINBOW.length;
  for (let b = 0; b < bandCount; b++) {
    const startY = 45 + b * 1.6;
    const endY = 39 + b * 4.5;
    const col = PAL.RAINBOW[b];
    for (let thick = 0; thick < 4; thick++) {
      px.drawLine(
        120 + (b * 0.4),
        startY + thick * 0.5,
        156,
        endY + thick,
        col,
        1,
        rainbowIntensity
      );
    }

    // Shimmering photon pixel moving along each rainbow band
    const shimmerT = ((t * (1.2 + b * 0.12) + b * 0.17) % 1);
    const sx = 122 + shimmerT * 34;
    const sy = startY + (endY - startY) * shimmerT + 1;
    if (Math.sin(t * 7 + b * 1.3) > -0.2 || burstTimer > 0) {
      px.setPx(sx, sy, PAL.WHITE, 0.95);
    }
  }

  // Crystal prism body with faceted shading
  px.fillTriangle(apexX, apexY, leftX, leftY, rightX, rightY, PAL.PRISM_LIGHT);
  // Shaded right-half facet
  px.fillTriangle(apexX, apexY, apexX + 2, leftY - 2, rightX, rightY, PAL.PRISM_MID);
  // Bottom refraction facet
  px.fillTriangle(leftX + 3, leftY - 1, apexX + 2, leftY - 8, rightX - 2, rightY - 1, PAL.PRISM_DARK);
  // Internal refracted white beam
  px.drawLine(inEndX, inEndY, 120, 48, PAL.WHITE, 2, 0.85);
  // Crisp highlight along left crystal edge
  px.drawLine(apexX, apexY + 2, leftX + 2, leftY - 2, PAL.PRISM_HI, 1);
  // Prism outline
  px.drawLine(apexX, apexY, leftX, leftY, PAL.OUTLINE, 1);
  px.drawLine(apexX, apexY, rightX, rightY, PAL.OUTLINE, 1);
  px.drawLine(leftX, leftY, rightX, rightY, PAL.OUTLINE, 1);

  // Subtle hover/click prism glow
  if (isHovered || burstTimer > 0) {
    px.drawSparkle(apexX, apexY - 3, t * 8, PAL.WHITE, PAL.SPARK_YELLOW);
    px.drawSparkle(146, 36, t * 7 + 1.1, PAL.WHITE, PAL.SPARK_BLUE);
    px.drawSparkle(150, 58, t * 7 + 2.4, PAL.WHITE, PAL.RAINBOW[0]);
  } else if (isCardHovered) {
    px.drawSparkle(144, 38, t * 5, PAL.WHITE, PAL.SPARK_YELLOW);
  }
}

function drawFormulaBoard(px, { t, isHovered, isCardHovered }) {
  const floatY = Math.round(Math.sin(t * 2.1) * (isHovered || isCardHovered ? 1.5 : 1));
  const bx = 58;
  const by = 66 + floatY;
  const bw = 36;
  const bh = 18;

  // Ground shadow stays fixed on paper
  px.drawDitherShadow(76, 87, 16, 2, PAL.SHADOW, 0.35);

  // Slight pixel tilt effect via offset bottom/right shadow & notched corners
  px.fillRect(bx + 1, by + 1, bw, bh, PAL.OUTLINE, 0.25);
  px.fillRect(bx, by, bw, bh, PAL.NOTE_BG);
  px.fillRect(bx + 1, by + bh - 3, bw - 2, 2, PAL.NOTE_SHADE);
  px.strokeRect(bx, by, bw, bh, PAL.OUTLINE);

  // Highlight edge on hover
  if (isHovered) {
    px.strokeRect(bx + 1, by + 1, bw - 2, bh - 2, PAL.WHITE);
  }

  // Crisp "F = ma" pixel typography
  px.drawPixelText('F = ma', bx + 6, by + 6, PAL.OUTLINE, 1);

  // Subtle floating chalk particles around formula board
  const chalkT = t * 1.3;
  for (let i = 0; i < 3; i++) {
    const cx = bx + 5 + i * 14 + Math.sin(chalkT + i * 2) * 3;
    const cy = by - 3 - ((chalkT * 6 + i * 3) % 7);
    if (Math.sin(t * 3 + i) > -0.2) {
      px.setPx(cx, cy, PAL.WHITE, 0.85);
    }
  }
}

export default function PhysicsPixelScene({
  isCardHovered = false,
  onTooltipChange,
  onSceneTouchInteract,
}) {
  const particlesRef = useRef(null);
  if (!particlesRef.current) {
    particlesRef.current = createParticlePool(40);
  }

  const animRef = useRef({
    lastSwingSign: -1,
    impactFlash: 0,
    prismBurstTimer: 0,
    touchBoostId: null,
    touchBoostTimer: 0,
  });

  const hitboxes = useMemo(() => HITBOXES, []);

  const handleObjectClick = (hit) => {
    const anim = animRef.current;
    const particles = particlesRef.current;
    anim.touchBoostId = hit.id;
    anim.touchBoostTimer = 2.4;

    if (hit.id === 'prism') {
      anim.prismBurstTimer = 1.8;
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * Math.PI * 1.4 - 0.7;
        const spd = 16 + (i % 4) * 8;
        particles.spawn({
          x: 118,
          y: 48,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 0.9 + (i % 3) * 0.25,
          color: PAL.RAINBOW[i % PAL.RAINBOW.length],
          kind: i % 2 === 0 ? 'star' : 'px',
        });
      }
      onTooltipChange?.('Prism: White light -> Rainbow spectrum');
    } else if (hit.id === 'formula') {
      for (let i = 0; i < 10; i++) {
        particles.spawn({
          x: 68 + (i * 3.5),
          y: 66,
          vx: (i - 5) * 3,
          vy: -14 - (i % 3) * 6,
          life: 0.8,
          color: i % 2 === 0 ? PAL.WHITE : PAL.SPARK_BLUE,
          kind: 'px',
        });
      }
      onTooltipChange?.('F = ma · Force = Mass x Acceleration');
    } else if (hit.id === 'cradle') {
      for (let i = 0; i < 8; i++) {
        particles.spawn({
          x: 41 + (i % 2 === 0 ? -18 : 18),
          y: 50,
          vx: (i % 2 === 0 ? -1 : 1) * (10 + i * 2),
          vy: -14 - i * 2,
          life: 0.6,
          color: PAL.SPARK_YELLOW,
          kind: 'star',
        });
      }
      onTooltipChange?.("Newton's Cradle · Momentum conserved!");
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

      if (anim.impactFlash > 0) anim.impactFlash = Math.max(0, anim.impactFlash - dt * 5);
      if (anim.prismBurstTimer > 0) anim.prismBurstTimer = Math.max(0, anim.prismBurstTimer - dt);
      if (anim.touchBoostTimer > 0) {
        anim.touchBoostTimer = Math.max(0, anim.touchBoostTimer - dt);
        if (anim.touchBoostTimer === 0) anim.touchBoostId = null;
      }

      const activeHoverId = hoveredId || anim.touchBoostId;

      const cradleSpeed = activeHoverId === 'cradle' ? 4.3 : cardHover ? 3.4 : 2.75;
      const swingNow = Math.sin(t * cradleSpeed);
      const signNow = swingNow >= 0 ? 1 : -1;
      if (signNow !== anim.lastSwingSign && dt > 0) {
        anim.lastSwingSign = signNow;
        anim.impactFlash = 1;
      }

      drawNewtonsCradle(px, {
        t,
        isHovered: activeHoverId === 'cradle',
        isCardHovered: cardHover,
        impactFlash: anim.impactFlash,
        particles,
      });

      drawPrism(px, {
        t,
        isHovered: activeHoverId === 'prism',
        isCardHovered: cardHover,
        burstTimer: anim.prismBurstTimer,
      });

      drawFormulaBoard(px, {
        t,
        isHovered: activeHoverId === 'formula',
        isCardHovered: cardHover,
      });

      // Ambient sparkles matching reference image
      px.drawSparkle(10, 24, t * 2.4, PAL.WHITE, PAL.SPARK_YELLOW);
      px.drawSparkle(80, 14, t * 2.1 + 1.5, PAL.WHITE, PAL.SPARK_YELLOW);
      px.drawSparkle(146, 76, t * 2.6 + 2.8, PAL.WHITE, PAL.SPARK_BLUE);
      if (cardHover) {
        px.drawSparkle(93, 18, t * 4.2, PAL.WHITE, PAL.SPARK_BLUE);
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
      aria-label="Interactive pixel-art Physics lab with swinging Newton's cradle, light-splitting prism, and F equals m a formula board"
      {...canvasProps}
    />
  );
}
