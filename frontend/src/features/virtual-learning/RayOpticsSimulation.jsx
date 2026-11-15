import React, { useState, useEffect, useRef } from 'react';
import { Button, PaperCard, Tag } from '../../components/ui';
import { resolveCssVar } from '../../components/ui/subjectUtils';

export default function RayOpticsSimulation() {
  const canvasRef = useRef(null);

  const [deviceType, setDeviceType] = useState('concave_mirror'); // concave_mirror | convex_mirror | convex_lens | concave_lens
  const [focalLength, setFocalLength] = useState(60); // f > 0 in slider
  const [objectDistance, setObjectDistance] = useState(120); // u > 0 in slider
  const [objectHeight, setObjectHeight] = useState(40);

  // Optical calculations based on standard Cartesian sign convention
  const isMirror = deviceType.includes('mirror');
  const isConcave = deviceType.includes('concave');

  // Signs:
  // Object is always at left: u_signed = -objectDistance
  const u = -objectDistance;
  const f = isConcave ? (isMirror ? -focalLength : -focalLength) : (isMirror ? focalLength : focalLength);

  let v = 0;
  let m = 0;
  let isInfinity = false;

  if (isMirror) {
    // 1/v = 1/f - 1/u
    const invV = (1 / f) - (1 / u);
    if (Math.abs(invV) < 0.0001) {
      isInfinity = true;
    } else {
      v = 1 / invV;
      m = -v / u;
    }
  } else {
    // Lens: 1/v = 1/f + 1/u
    const invV = (1 / f) + (1 / u);
    if (Math.abs(invV) < 0.0001) {
      isInfinity = true;
    } else {
      v = 1 / invV;
      m = v / u;
    }
  }

  const imageDistance = isInfinity ? Infinity : v;
  const imageHeight = isInfinity ? Infinity : objectHeight * m;

  // Nature
  let nature = '';
  if (isInfinity) {
    nature = 'At Infinity (Highly Enlarged)';
  } else if (isMirror) {
    nature = v < 0 ? 'Real & Inverted' : 'Virtual & Erect';
  } else {
    nature = v > 0 ? 'Real & Inverted' : 'Virtual & Erect';
  }

  // Draw Ray Diagram on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const cAxis = resolveCssVar('--ink-soft');
    const cFocus = resolveCssVar('--physics');
    const cDevice = resolveCssVar('--ink');
    const cObj = resolveCssVar('--red-600');
    const cImg = resolveCssVar('--biology');
    const cRay1 = resolveCssVar('--chemistry');
    const cRay2 = resolveCssVar('--maths');

    const originX = width / 2;
    const originY = height / 2;

    // 1. Draw Principal Axis
    ctx.strokeStyle = cAxis;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(20, originY);
    ctx.lineTo(width - 20, originY);
    ctx.stroke();

    // 2. Optical Center / Pole
    ctx.fillStyle = cAxis;
    ctx.beginPath();
    ctx.arc(originX, originY, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.font = '11px sans-serif';
    ctx.fillText(isMirror ? 'P (Pole)' : 'O (Center)', originX - 15, originY + 18);

    // 3. Mark Focus (F) and 2F / C
    const fPixel = focalLength * 2.2;
    // Left points
    drawPoint(ctx, originX - fPixel, originY, 'F₁', cFocus);
    drawPoint(ctx, originX - (2 * fPixel), originY, isMirror ? 'C' : '2F₁', cFocus);
    // Right points
    drawPoint(ctx, originX + fPixel, originY, 'F₂', cFocus);
    drawPoint(ctx, originX + (2 * fPixel), originY, isMirror ? 'C₂' : '2F₂', cFocus);

    // 4. Draw Optical Device (Mirror / Lens)
    ctx.strokeStyle = cDevice;
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (deviceType === 'concave_mirror') {
      ctx.arc(originX + 160, originY, 170, Math.PI * 0.82, Math.PI * 1.18);
    } else if (deviceType === 'convex_mirror') {
      ctx.arc(originX - 160, originY, 170, -Math.PI * 0.18, Math.PI * 0.18);
    } else if (deviceType === 'convex_lens') {
      // Double convex
      ctx.ellipse(originX, originY, 12, 100, 0, 0, 2 * Math.PI);
    } else {
      // Concave lens
      ctx.ellipse(originX, originY, 6, 100, 0, 0, 2 * Math.PI);
    }
    ctx.stroke();

    // 5. Draw Object Arrow
    const objPixelDist = objectDistance * 2.2;
    const objX = originX - objPixelDist;
    const objY = originY - (objectHeight * 1.5);

    drawArrow(ctx, objX, originY, objX, objY, cObj, 'Object (AB)');

    // 6. Draw Image Arrow (if not at infinity)
    if (!isInfinity && Math.abs(imageDistance) < 500) {
      const imgX = originX + (imageDistance * 2.2);
      const imgY = originY - (imageHeight * 1.5);
      const isVirtual = isMirror ? imageDistance > 0 : imageDistance < 0;

      if (isVirtual) {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }
      drawArrow(ctx, imgX, originY, imgX, imgY, cImg, `Image (A'B')`);
      ctx.setLineDash([]);
    }

    // 7. Ray Tracing Lines
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = cRay1;

    // Ray 1: Parallel to principal axis -> to device
    ctx.beginPath();
    ctx.moveTo(objX, objY);
    ctx.lineTo(originX, objY);
    ctx.stroke();

    // After device:
    if (deviceType === 'concave_mirror') {
      // Passes through Focus F (left)
      const focusX = originX - fPixel;
      ctx.beginPath();
      ctx.moveTo(originX, objY);
      // Line through (focusX, originY)
      const slope = (originY - objY) / (focusX - originX);
      ctx.lineTo(originX - 250, objY - 250 * slope);
      ctx.stroke();

      // Ray 2: Ray through Focus -> reflects parallel
      ctx.strokeStyle = cRay2;
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(focusX, originY);
      ctx.lineTo(originX, originY + (originY - objY));
      ctx.lineTo(originX - 250, originY + (originY - objY));
      ctx.stroke();
    } else if (deviceType === 'convex_lens') {
      // Passes through right focus F₂
      const focusX = originX + fPixel;
      ctx.beginPath();
      ctx.moveTo(originX, objY);
      const slope = (originY - objY) / (focusX - originX);
      ctx.lineTo(originX + 250, objY + 250 * slope);
      ctx.stroke();

      // Ray 2: Ray through optical center (continues straight)
      ctx.strokeStyle = cRay2;
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      const centerSlope = (originY - objY) / (originX - objX);
      ctx.lineTo(originX + 250, originY + 250 * centerSlope);
      ctx.stroke();
    }

  }, [deviceType, focalLength, objectDistance, objectHeight, isMirror, isConcave, isInfinity, imageDistance, imageHeight]);

  function drawPoint(ctx, x, y, label, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.font = '10px sans-serif';
    ctx.fillText(label, x - 6, y + 15);
  }

  function drawArrow(ctx, fromX, fromY, toX, toY, color, label) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Arrowhead
    const headLen = 8;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.fill();

    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(label, toX - 25, toY - 6);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      {/* Device Mode Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
        {[
          { id: 'concave_mirror', label: 'Concave Mirror (अवतल दर्पण)' },
          { id: 'convex_mirror', label: 'Convex Mirror (उत्तल दर्पण)' },
          { id: 'convex_lens', label: 'Convex Lens (उत्तल लेंस)' },
          { id: 'concave_lens', label: 'Concave Lens (अवतल लेंस)' }
        ].map((d) => (
          <Button
            key={d.id}
            type="button"
            size="sm"
            variant={deviceType === d.id ? 'primary' : 'secondary'}
            onClick={() => setDeviceType(d.id)}
          >
            {d.label}
          </Button>
        ))}
      </div>

      {/* Interactive Ray Diagram Canvas */}
      <PaperCard flat style={{ backgroundColor: 'var(--paper-warm)', overflow: 'hidden', display: 'flex', justifyContent: 'center', padding: 'var(--sp-2)' }}>
        <canvas ref={canvasRef} width={680} height={280} style={{ width: '100%', maxWidth: '680px', height: 'auto' }} />
      </PaperCard>

      {/* Parameter Sliders */}
      <PaperCard flat style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-3)', padding: 'var(--sp-4)' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
            <span>Object Distance (u)</span>
            <Tag tone="red">{objectDistance} cm</Tag>
          </div>
          <input
            type="range"
            min={20}
            max={180}
            value={objectDistance}
            onChange={(e) => setObjectDistance(Number(e.target.value))}
            aria-label="Object Distance u in cm"
            style={{ width: '100%', accentColor: 'var(--red-600)' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
            <span>Focal Length (f)</span>
            <Tag tone="physics">{focalLength} cm</Tag>
          </div>
          <input
            type="range"
            min={25}
            max={90}
            value={focalLength}
            onChange={(e) => setFocalLength(Number(e.target.value))}
            aria-label="Focal Length f in cm"
            style={{ width: '100%', accentColor: 'var(--physics)' }}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
            <span>Object Height (h)</span>
            <Tag tone="neutral">{objectHeight} mm</Tag>
          </div>
          <input
            type="range"
            min={10}
            max={60}
            value={objectHeight}
            onChange={(e) => setObjectHeight(Number(e.target.value))}
            aria-label="Object Height h in mm"
            style={{ width: '100%', accentColor: 'var(--ink-muted)' }}
          />
        </div>
      </PaperCard>

      {/* Real-time CBSE Optics Diagnostic Readouts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--sp-2)' }}>
        <PaperCard flat style={{ backgroundColor: 'var(--paper-warm)', padding: 'var(--sp-3)', borderLeft: '4px solid var(--physics)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', fontWeight: 700 }}>Image Distance (v)</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
            {isInfinity ? 'Infinity (∞)' : `${Math.abs(Math.round(imageDistance * 10) / 10)} cm`}
          </div>
        </PaperCard>

        <PaperCard flat style={{ backgroundColor: 'var(--paper-warm)', padding: 'var(--sp-3)', borderLeft: '4px solid var(--biology)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', fontWeight: 700 }}>Magnification (m)</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
            {isInfinity ? 'Undefined' : `${Math.round(m * 100) / 100}x`}
          </div>
        </PaperCard>

        <PaperCard flat style={{ backgroundColor: 'var(--paper-warm)', padding: 'var(--sp-3)', borderLeft: '4px solid var(--chemistry)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', fontWeight: 700 }}>Image Nature</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--ink)' }}>
            {nature}
          </div>
        </PaperCard>
      </div>
    </div>
  );
}

