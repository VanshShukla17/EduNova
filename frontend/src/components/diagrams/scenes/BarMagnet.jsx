import React from 'react';
import Callout from './Callout';

const NX = 300, SX = 500, CY = 230;
const LOOPS = [
  { o: 28, h: 45, w: 35 },
  { o: 18, h: 95, w: 75 },
  { o: 9, h: 145, w: 120 },
  { o: 3, h: 185, w: 165 },
];

function loop(side, { o, h, w }) {
  const y0 = CY + side * o;
  const c = y0 + side * h * 1.33;
  const P0 = [NX, y0], P1 = [NX - w, c], P2 = [SX + w, c], P3 = [SX, y0];
  const d = `M${P0} C${P1} ${P2} ${P3}`;
  const mid = [(P0[0] + 3 * P1[0] + 3 * P2[0] + P3[0]) / 8, (P0[1] + 3 * P1[1] + 3 * P2[1] + P3[1]) / 8];
  return { d, mid, y0 };
}

export default function BarMagnet({ part, labels }) {
  const loops = [...LOOPS.map((l) => loop(-1, l)), ...LOOPS.map((l) => loop(1, l))];
  const outer = loops[3];

  return (
    <g>
      <g {...part('field-lines')}>
        {loops.map((l, i) => (
          <path key={i} d={l.d} fill="none" stroke="#475569" strokeWidth="2.5" />
        ))}
      </g>

      <g {...part('field-direction')}>
        {loops.map((l, i) => (
          <g key={i} transform={`translate(${l.mid[0]} ${l.mid[1]})`}>
            <circle r="14" fill="transparent" />
            <path d="M-7 -6 L8 0 L-7 6 Z" fill="#475569" />
          </g>
        ))}
      </g>

      {/* Magnet: North half red, South half blue */}
      <g {...part('north-pole')}>
        <rect x={NX} y={CY - 30} width="100" height="60" fill="#dc2626" stroke="#7f1d1d" strokeWidth="3" />
        <text x={NX + 50} y={CY + 11} textAnchor="middle" className="dg-sym" style={{ fontSize: 30, fill: '#fff' }}>N</text>
      </g>
      <g {...part('south-pole')}>
        <rect x={SX - 100} y={CY - 30} width="100" height="60" fill="#2563eb" stroke="#1e3a8a" strokeWidth="3" />
        <text x={SX - 50} y={CY + 11} textAnchor="middle" className="dg-sym" style={{ fontSize: 30, fill: '#fff' }}>S</text>
      </g>

      {/* Compass needle */}
      <g {...part('compass')} transform="translate(400 323)">
        <circle r="17" fill="#fff" stroke="#334155" strokeWidth="3" />
        <polygon points="0,-4.5 14,0 0,4.5" fill="#dc2626" />
        <polygon points="0,-4.5 -14,0 0,4.5" fill="#475569" />
        <circle r="2" fill="var(--ink, #101a3a)" />
      </g>

      <Callout show={labels} x1={NX} y1={CY} x2={120} y2={CY} anchor="end">North pole</Callout>
      <Callout show={labels} x1={SX} y1={CY} x2={680} y2={CY}>South pole</Callout>
      <Callout show={labels} x1={outer.mid[0]} y1={outer.mid[1]} x2={560} y2={34}>Field lines</Callout>
      <Callout show={labels} x1={loops[1].mid[0] + 10} y1={loops[1].mid[1]} x2={560} y2={84}>Field direction</Callout>
      <Callout show={labels} x1={417} y1={323} x2={560} y2={400}>Compass</Callout>
    </g>
  );
}
