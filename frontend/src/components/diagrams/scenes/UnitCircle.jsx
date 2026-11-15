import React, { useState, useRef } from 'react';

const CX = 300, CY = 240, R = 180;
const rad = (d) => (d * Math.PI) / 180;

export default function UnitCircle({ part, labels }) {
  const [deg, setDeg] = useState(40);
  const moved = useRef(false);

  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
  const px = CX + R * c, py = CY - R * s;
  const t = Math.abs(c) < 1e-3 ? null : s / c;
  const tanOk = t !== null && Math.abs(t) <= 2.3;

  const setFromPointer = (e) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    let a = (Math.atan2(CY - p.y, p.x - CX) * 180) / Math.PI;
    if (a < 0) a += 360;
    setDeg(Math.round(a));
  };

  const dragProps = {
    onPointerDown: (e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      moved.current = false;
    },
    onPointerMove: (e) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        moved.current = true;
        setFromPointer(e);
      }
    },
    onClick: (e) => {
      if (moved.current) {
        e.stopPropagation();
        moved.current = false;
      }
    },
  };

  const arcEnd = [CX + 42 * c, CY - 42 * s];
  const fmt = (v) => (Math.abs(v) < 0.0005 ? '0.000' : v.toFixed(3));

  return (
    <g>
      {/* Coordinate axes */}
      <g stroke="#475569" strokeWidth="1.5" pointerEvents="none">
        <line x1={CX - R - 25} y1={CY} x2={CX + R + 25} y2={CY} />
        <line x1={CX} y1={CY - R - 25} x2={CX + R + 25} y2={CY} />
      </g>
      <g className="dg-tick" pointerEvents="none">
        <text x={CX + R + 4} y={CY + 16}>(1, 0)</text>
        <text x={CX - R - 4} y={CY + 16} textAnchor="end">(−1, 0)</text>
        <text x={CX + 8} y={CY - R - 8}>(0, 1)</text>
        <text x={CX + 8} y={CY + R + 18}>(0, −1)</text>
        <text x={CX + 90} y={CY - 90} textAnchor="middle">I</text>
        <text x={CX - 90} y={CY - 90} textAnchor="middle">II</text>
        <text x={CX - 90} y={CY + 100} textAnchor="middle">III</text>
        <text x={CX + 90} y={CY + 100} textAnchor="middle">IV</text>
      </g>

      <g {...part('unit-circle')}>
        <circle cx={CX} cy={CY} r={R} fill="rgba(37, 99, 235, 0.06)" stroke="var(--color-primary, #2563eb)" strokeWidth="4" />
      </g>

      {/* Tangent line at (1, 0) */}
      {tanOk && (
        <>
          <line x1={CX} y1={CY} x2={CX + R} y2={CY - R * t} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 5" pointerEvents="none" />
          <g {...part('tangent')}>
            <line x1={CX + R} y1={CY} x2={CX + R} y2={CY - R * t} stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
            <line x1={CX + R} y1={CY} x2={CX + R} y2={CY - R * t} stroke="transparent" strokeWidth="22" />
          </g>
        </>
      )}

      {/* Cosine line (horizontal) */}
      <g {...part('cosine')}>
        <line x1={CX} y1={CY} x2={px} y2={CY} stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
        <line x1={CX} y1={CY} x2={px} y2={CY} stroke="transparent" strokeWidth="22" />
      </g>

      {/* Sine line (vertical) */}
      <g {...part('sine')}>
        <line x1={px} y1={CY} x2={px} y2={py} stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
        <line x1={px} y1={CY} x2={px} y2={py} stroke="transparent" strokeWidth="22" />
      </g>

      {/* Radius line */}
      <g {...part('radius')}>
        <line x1={CX} y1={CY} x2={px} y2={py} stroke="var(--ink, #101a3a)" strokeWidth="4" strokeLinecap="round" />
        <line x1={CX} y1={CY} x2={px} y2={py} stroke="transparent" strokeWidth="22" />
      </g>

      {/* Angle arc */}
      <g {...part('angle')}>
        <path d={`M${CX + 42} ${CY} A42 42 0 ${deg > 180 ? 1 : 0} 0 ${arcEnd[0]} ${arcEnd[1]}`} fill="none" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
        <path d={`M${CX + 42} ${CY} A42 42 0 ${deg > 180 ? 1 : 0} 0 ${arcEnd[0]} ${arcEnd[1]}`} fill="none" stroke="transparent" strokeWidth="22" />
      </g>

      {/* Draggable point P */}
      <g {...part('point')}>
        <circle cx={px} cy={py} r="26" fill="transparent" className="dg-handle" {...dragProps} />
        <circle cx={px} cy={py} r="10" fill="#f59e0b" stroke="var(--ink, #101a3a)" strokeWidth="3" pointerEvents="none" />
      </g>

      {/* Mathematical labels */}
      {labels && (
        <g pointerEvents="none" className="dg-trig-labels">
          <text x={CX + (px - CX) / 2} y={CY + (py < CY ? 22 : -10)} textAnchor="middle" fill="#2563eb">cos θ</text>
          <text x={px + (c >= 0 ? 12 : -12)} y={CY + (py - CY) / 2} textAnchor={c >= 0 ? 'start' : 'end'} fill="#dc2626">sin θ</text>
          <text x={CX + 56 * Math.cos(rad(deg / 2)) + 6} y={CY - 56 * Math.sin(rad(deg / 2)) + 4} fill="#a855f7">θ</text>
          {tanOk && <text x={CX + R + 12} y={CY - (R * t) / 2} fill="#16a34a">tan θ</text>}
        </g>
      )}

      {/* Real-time Math Value Board */}
      <g pointerEvents="none">
        <rect x="560" y="120" width="220" height="190" rx="12" className="dg-panel" />
        <text x="580" y="152" className="dg-val">θ = {deg}°</text>
        <text x="580" y="184" className="dg-val" fill="#dc2626">sin θ = {fmt(s)}</text>
        <text x="580" y="214" className="dg-val" fill="#2563eb">cos θ = {fmt(c)}</text>
        <text x="580" y="244" className="dg-val" fill="#16a34a">tan θ = {t === null ? 'undefined' : fmt(t)}</text>
        <text x="580" y="284" className="dg-legend">sin²θ + cos²θ = {(s * s + c * c).toFixed(3)}</text>
        <text x="560" y="340" className="dg-legend">Drag orange point to change θ</text>
      </g>
    </g>
  );
}
