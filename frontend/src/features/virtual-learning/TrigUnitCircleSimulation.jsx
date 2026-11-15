import React, { useState, useRef, useEffect } from 'react';
import { Button, PaperCard, Tag } from '../../components/ui';
import { resolveCssVar } from '../../components/ui/subjectUtils';

/**
 * Trigonometric Unit Circle Simulation (P2-8.8)
 * CBSE Class 10 & 11 Mathematics: Unit Circle (r = 1), sin/cos/tan geometric projections,
 * ASTC Quadrant Rule, and Pythagorean Identity proof.
 */
export default function TrigUnitCircleSimulation() {
  const [angleDeg, setAngleDeg] = useState(45); // 0 to 360
  const [isRadians, setIsRadians] = useState(false);
  const [showTangent, setShowTangent] = useState(true);

  const canvasRef = useRef(null);

  const rad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.abs(cosVal) > 0.0001 ? Math.tan(rad) : (sinVal > 0 ? Infinity : -Infinity);

  // Quadrant classification
  const getQuadrant = (deg) => {
    const d = deg % 360;
    if (d >= 0 && d < 90) return { q: 'I', label: 'Quadrant I (All +)' };
    if (d >= 90 && d < 180) return { q: 'II', label: 'Quadrant II (Sin +)' };
    if (d >= 180 && d < 270) return { q: 'III', label: 'Quadrant III (Tan +)' };
    return { q: 'IV', label: 'Quadrant IV (Cos +)' };
  };

  const quadrantInfo = getQuadrant(angleDeg);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const R = 110; // Radius in pixels

    const cGrid = resolveCssVar('--paper-edge');
    const cAxis = resolveCssVar('--ink-soft');
    const cCircle = resolveCssVar('--physics');
    const cMaths = resolveCssVar('--maths');
    const cInk = resolveCssVar('--ink');
    const cRed = resolveCssVar('--red-600');
    const cEmerald = resolveCssVar('--emerald-600');
    const cWhite = resolveCssVar('--paper');

    // Background grid
    ctx.strokeStyle = cGrid;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = cAxis;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, cy);
    ctx.lineTo(width - 20, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 20);
    ctx.lineTo(cx, height - 20);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = cAxis;
    ctx.font = '10px sans-serif';
    ctx.fillText('+X (cos)', width - 45, cy - 8);
    ctx.fillText('+Y (sin)', cx + 8, 30);
    ctx.fillText('-X', 25, cy - 8);
    ctx.fillText('-Y', cx + 8, height - 25);

    // Unit circle
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = cCircle;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Terminal point coords
    const px = cx + R * Math.cos(rad);
    const py = cy - R * Math.sin(rad); // canvas Y inverted

    // Angle sector / arc
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 32, 0, -rad, true);
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = cMaths;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = cMaths;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Radius line to point P
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = cInk;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Cos projection (horizontal line on X-axis)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, cy);
    ctx.strokeStyle = cCircle; // Blue for Cos
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Sin projection (vertical line from X-axis to P)
    ctx.beginPath();
    ctx.moveTo(px, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = cRed; // Red for Sin
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Tangent Line
    if (showTangent && Math.abs(cosVal) > 0.05) {
      // Tangent line at (cx + R, cy)
      const tanY = cy - R * tanVal;
      ctx.beginPath();
      ctx.moveTo(cx + R, cy);
      ctx.lineTo(cx + R, Math.max(10, Math.min(height - 10, tanY)));
      ctx.strokeStyle = cEmerald; // Green for Tan
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Terminal point P (cos θ, sin θ)
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = cMaths;
    ctx.fill();
    ctx.strokeStyle = cWhite;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Coordinates tooltip
    ctx.fillStyle = cInk;
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(
      `P(${cosVal.toFixed(2)}, ${sinVal.toFixed(2)})`,
      px + (cosVal >= 0 ? 10 : -95),
      py + (sinVal >= 0 ? -10 : 20)
    );
  }, [angleDeg, rad, sinVal, cosVal, tanVal, showTangent]);

  return (
    <PaperCard flat style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      {/* Top Header and Presets */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)' }}>Standard CBSE Angles:</span>
          {[0, 30, 45, 60, 90, 180, 270, 360].map((deg) => (
            <Button
              key={deg}
              type="button"
              size="sm"
              variant={angleDeg === deg ? 'primary' : 'secondary'}
              onClick={() => setAngleDeg(deg)}
            >
              {deg}°
            </Button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setIsRadians(!isRadians)}
          >
            Mode: {isRadians ? 'Radians (π)' : 'Degrees (°)'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={showTangent ? 'primary' : 'secondary'}
            onClick={() => setShowTangent(!showTangent)}
          >
            Tangent Line: {showTangent ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-3)' }}>
        <div style={{ backgroundColor: 'var(--paper-warm)', borderRadius: 'var(--r-md)', border: '1px solid var(--paper-edge)', height: '320px', position: 'relative', overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>

        {/* Live Mathematical Calculations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          <PaperCard flat style={{ padding: 'var(--sp-3)', backgroundColor: 'var(--physics-soft)', borderColor: 'var(--physics)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--physics-ink)', fontWeight: 700 }}>cos θ (Adjacent / Base)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{cosVal.toFixed(4)}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--physics-ink)' }}>Horizontal projection on X-axis</div>
          </PaperCard>

          <PaperCard flat style={{ padding: 'var(--sp-3)', backgroundColor: 'var(--red-soft)', borderColor: 'var(--red-border)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--red-ink)', fontWeight: 700 }}>sin θ (Opposite / Perpendicular)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--red-ink)', fontFamily: 'var(--font-mono)' }}>{sinVal.toFixed(4)}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--red-ink)' }}>Vertical projection on Y-axis</div>
          </PaperCard>

          <PaperCard flat style={{ padding: 'var(--sp-3)', backgroundColor: 'var(--emerald-soft)', borderColor: 'var(--emerald-600)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--emerald-800)', fontWeight: 700 }}>tan θ = sin θ / cos θ</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-800)', fontFamily: 'var(--font-mono)' }}>
              {Math.abs(tanVal) > 1000 ? 'Undefined (±∞)' : tanVal.toFixed(4)}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--emerald-700)' }}>Slope of terminal radius</div>
          </PaperCard>

          {/* Quadrant & Identity Proof */}
          <PaperCard flat style={{ padding: 'var(--sp-3)', backgroundColor: 'var(--maths-soft)', borderColor: 'var(--maths)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--maths-ink)', fontWeight: 700 }}>ASTC Rule &amp; Identity:</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--ink)', marginTop: '2px' }}>
              {quadrantInfo.label}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--maths-ink)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              sin²θ + cos²θ = {(sinVal * sinVal + cosVal * cosVal).toFixed(2)} = 1
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Slider Controls */}
      <PaperCard flat style={{ padding: 'var(--sp-3)', backgroundColor: 'var(--paper-warm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
          <span>Adjust Angle θ:</span>
          <Tag tone="maths">
            {angleDeg}° {isRadians && `≈ ${(rad / Math.PI).toFixed(2)}π rad`}
          </Tag>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          value={angleDeg}
          onChange={(e) => setAngleDeg(parseInt(e.target.value, 10))}
          aria-label="Adjust Angle theta in degrees"
          style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--maths)' }}
        />
      </PaperCard>
    </PaperCard>
  );
}

