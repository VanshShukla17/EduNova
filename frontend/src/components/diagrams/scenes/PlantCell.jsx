import React from 'react';
import Callout from './Callout';

const Chloroplast = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <ellipse rx="36" ry="21" fill="#4ea34a" stroke="#2d6a2a" strokeWidth="2.5" />
    {[-18, -6, 6, 18].map((gx) => (
      <ellipse key={gx} cx={gx} cy="0" rx="4" ry="11" fill="#2d6a2a" opacity=".75" />
    ))}
  </g>
);

const Mitochondrion = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <ellipse rx="32" ry="16" fill="#f59e42" stroke="#c2410c" strokeWidth="2.5" />
    <path d="M-20 0 q5 -9 10 0 t10 0 t10 0 t10 0" fill="none" stroke="#c2410c" strokeWidth="2" />
  </g>
);

export default function PlantCell({ part, labels }) {
  return (
    <g>
      {/* cytoplasm (filled area) */}
      <g {...part('cytoplasm')}>
        <rect x="130" y="50" width="500" height="380" rx="36" fill="#e9f5d0" />
      </g>

      {/* cell wall: thick outer stroke only */}
      <g {...part('cell-wall')}>
        <rect x="120" y="40" width="520" height="400" rx="44" fill="none" stroke="#4d8b31" strokeWidth="18" pointerEvents="stroke" />
      </g>

      {/* cell membrane: thin inner stroke */}
      <g {...part('membrane')}>
        <rect x="132" y="52" width="496" height="376" rx="34" fill="none" stroke="#e08e2b" strokeWidth="5" pointerEvents="stroke" />
      </g>

      <g {...part('vacuole')}>
        <ellipse cx="275" cy="245" rx="115" ry="130" fill="#bfe3f5" stroke="#5aa7cf" strokeWidth="3" />
        <ellipse cx="240" cy="190" rx="34" ry="46" fill="#fff" opacity=".35" />
      </g>

      <g {...part('nucleus')}>
        <circle cx="500" cy="160" r="62" fill="#c7b8f0" stroke="#6d4fc2" strokeWidth="4" />
        <circle cx="500" cy="160" r="54" fill="none" stroke="#6d4fc2" strokeWidth="1.5" strokeDasharray="3 5" />
      </g>
      <g {...part('nucleolus')}>
        <circle cx="490" cy="166" r="19" fill="#5b3fa8" />
      </g>

      <g {...part('chloroplast')}>
        <Chloroplast x={215} y={88} r={-12} />
        <Chloroplast x={345} y={86} r={10} />
        <Chloroplast x={585} y={275} r={-20} />
        <Chloroplast x={560} y={395} r={8} />
      </g>

      <g {...part('mitochondrion')}>
        <Mitochondrion x={470} y={305} r={-25} />
        <Mitochondrion x={330} y={405} r={5} />
        <Mitochondrion x={205} y={140} r={60} />
      </g>

      <Callout show={labels} x1={116} y1={330} x2={96} y2={330} anchor="end">Cell wall</Callout>
      <Callout show={labels} x1={166} y1={230} x2={96} y2={230} anchor="end">Vacuole</Callout>
      <Callout show={labels} x1={628} y1={120} x2={672} y2={120}>Cell membrane</Callout>
      <Callout show={labels} x1={562} y1={160} x2={672} y2={160}>Nucleus</Callout>
      <Callout show={labels} x1={500} y1={172} x2={672} y2={200}>Nucleolus</Callout>
      <Callout show={labels} x1={605} y1={225} x2={672} y2={240}>Cytoplasm</Callout>
      <Callout show={labels} x1={612} y1={265} x2={672} y2={280}>Chloroplast</Callout>
      <Callout show={labels} x1={495} y1={310} x2={672} y2={330}>Mitochondrion</Callout>
    </g>
  );
}
