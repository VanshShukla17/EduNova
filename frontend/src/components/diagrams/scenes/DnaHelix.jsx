import React from 'react';
import Callout from './Callout';

const CX = 300, AMP = 85, PERIOD = 160, Y0 = 20, Y1 = 460;
const COLORS = { A: '#ef4444', T: '#3b82f6', G: '#22c55e', C: '#eab308' };
const PAIRS = [['A', 'T'], ['T', 'A'], ['G', 'C'], ['C', 'G']];
const NAME = { A: 'adenine', T: 'thymine', G: 'guanine', C: 'cytosine' };

const offset = (y) => AMP * Math.sin((2 * Math.PI * (y - Y0)) / PERIOD);

function strandPath(sign) {
  let d = '';
  for (let y = Y0; y <= Y1; y += 4) {
    d += `${y === Y0 ? 'M' : 'L'}${(CX + sign * offset(y)).toFixed(1)} ${y} `;
  }
  return d;
}

export default function DnaHelix({ part, labels }) {
  const rungs = [];
  for (let k = 1; Y0 + k * 20 < Y1; k++) {
    const y = Y0 + k * 20;
    const a = offset(y);
    if (Math.abs(a) < 40) continue;
    const [left, right] = PAIRS[k % 4];
    const onRight = a > 0 ? left : right;
    rungs.push({ k, y, a, left, right, onRight });
  }

  const baseSegs = { A: [], T: [], G: [], C: [] };
  rungs.forEach(({ y, a, left, right }) => {
    baseSegs[left].push({ x1: CX + a, x2: CX, y });
    baseSegs[right].push({ x1: CX - a, x2: CX, y });
  });

  const picks = [];
  let lastY = -99;
  const baseLeft = new Set(['A', 'T', 'G', 'C']);
  const generic = ['backbone', 'sugar', 'phosphate', 'hydrogen-bond'];

  rungs.forEach((r) => {
    if (r.y - lastY < 36) return;
    if (baseLeft.has(r.onRight)) {
      baseLeft.delete(r.onRight);
      picks.push({
        id: r.onRight,
        x1: CX + Math.abs(r.a) / 2,
        y: r.y,
        text: `${NAME[r.onRight][0].toUpperCase()}${NAME[r.onRight].slice(1)} (${r.onRight})`,
      });
      lastY = r.y;
    } else if (baseLeft.size === 0 && generic.length) {
      const id = generic.shift();
      const point = {
        backbone: { x: CX + Math.abs(offset(r.y + 5)), y: r.y + 5, text: 'Sugar–phosphate backbone' },
        sugar: { x: CX + Math.abs(r.a), y: r.y, text: 'Deoxyribose sugar' },
        phosphate: { x: CX + Math.abs(offset(r.y + 10)), y: r.y + 10, text: 'Phosphate group' },
        'hydrogen-bond': { x: CX, y: r.y, text: 'Hydrogen bonds' },
      }[id];
      picks.push({ id, x1: point.x, y: point.y, text: point.text });
      lastY = r.y;
    }
  });

  return (
    <g>
      {/* Bases */}
      {Object.keys(baseSegs).map((b) => (
        <g key={b} {...part(NAME[b])}>
          {baseSegs[b].map((s, i) => {
            const dir = Math.sign(s.x2 - s.x1);
            return (
              <line
                key={i}
                x1={s.x1}
                y1={s.y}
                x2={s.x2 - dir * 6}
                y2={s.y}
                stroke={COLORS[b]}
                strokeWidth="9"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      ))}

      {/* Hydrogen bonds: 2 dots for A–T, 3 for G–C */}
      <g {...part('hydrogen-bond')}>
        {rungs.map(({ k, y, left }) => {
          const n = left === 'A' || left === 'T' ? 2 : 3;
          return Array.from({ length: n }, (_, i) => (
            <circle
              key={`${k}-${i}`}
              cx={CX + (i - (n - 1) / 2) * 5.5}
              cy={y}
              r="2"
              fill="var(--ink, #101a3a)"
            />
          ));
        })}
        {rungs.map(({ k, y }) => (
          <rect key={`h${k}`} x={CX - 10} y={y - 8} width="20" height="16" fill="transparent" />
        ))}
      </g>

      {/* Sugar-phosphate backbone */}
      <g {...part('backbone')}>
        <path d={strandPath(1)} fill="none" stroke="#64748b" strokeWidth="6" strokeLinejoin="round" />
        <path d={strandPath(-1)} fill="none" stroke="#64748b" strokeWidth="6" strokeLinejoin="round" />
      </g>

      {/* Sugar units */}
      <g {...part('sugar')}>
        {rungs.map(({ k, y, a }) => (
          <g key={k}>
            <circle cx={CX + a} cy={y} r="8" fill="#a78bfa" stroke="#5b21b6" strokeWidth="1.5" />
            <circle cx={CX - a} cy={y} r="8" fill="#a78bfa" stroke="#5b21b6" strokeWidth="1.5" />
          </g>
        ))}
      </g>

      {/* Phosphate groups */}
      <g {...part('phosphate')}>
        {rungs.map(({ k, y }) => {
          const o = offset(y + 10);
          return (
            <g key={k}>
              <circle cx={CX + o} cy={y + 10} r="6" fill="#f97316" stroke="#9a3412" strokeWidth="1.5" />
              <circle cx={CX - o} cy={y + 10} r="6" fill="#f97316" stroke="#9a3412" strokeWidth="1.5" />
            </g>
          );
        })}
      </g>

      {picks.map((p) => (
        <Callout key={p.id} show={labels} x1={p.x1} y1={p.y} x2={540} y2={p.y}>
          {p.text}
        </Callout>
      ))}
    </g>
  );
}
