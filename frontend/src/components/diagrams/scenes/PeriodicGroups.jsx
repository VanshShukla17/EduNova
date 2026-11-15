import React from 'react';

const SYM = (
  'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr ' +
  'Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu ' +
  'Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr ' +
  'Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'
).split(' ');

function position(z) {
  if (z === 1) return [1, 1];
  if (z === 2) return [1, 18];
  if (z <= 4) return [2, z - 2];
  if (z <= 10) return [2, z + 8];
  if (z <= 12) return [3, z - 10];
  if (z <= 18) return [3, z];
  if (z <= 36) return [4, z - 18];
  if (z <= 54) return [5, z - 36];
  if (z <= 56) return [6, z - 54];
  if (z <= 71) return [9, z - 54];
  if (z <= 86) return [6, z - 68];
  if (z <= 88) return [7, z - 86];
  if (z <= 103) return [10, z - 86];
  return [7, z - 100];
}

const LISTS = {
  alkali: [3, 11, 19, 37, 55, 87],
  alkaline: [4, 12, 20, 38, 56, 88],
  halogens: [9, 17, 35, 53, 85, 117],
  noble: [2, 10, 18, 36, 54, 86, 118],
  metalloids: [5, 14, 32, 33, 51, 52],
  nonmetals: [1, 6, 7, 8, 15, 16, 34],
  'post-transition': [13, 31, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116],
};

function category(z) {
  for (const [name, list] of Object.entries(LISTS)) if (list.includes(z)) return name;
  if (z >= 57 && z <= 71) return 'lanthanides';
  if (z >= 89 && z <= 103) return 'actinides';
  return 'transition';
}

const COLORS = {
  alkali: '#f87171',
  alkaline: '#fb923c',
  transition: '#fbbf24',
  'post-transition': '#86efac',
  metalloids: '#5eead4',
  nonmetals: '#7dd3fc',
  halogens: '#c4b5fd',
  noble: '#f0abfc',
  lanthanides: '#fde68a',
  actinides: '#d6a77a',
};

const LEGEND = [
  ['alkali', 'Alkali'], ['alkaline', 'Alkaline earth'], ['transition', 'Transition'],
  ['post-transition', 'Post-transition'], ['metalloids', 'Metalloids'], ['nonmetals', 'Non-metals'],
  ['halogens', 'Halogens'], ['noble', 'Noble gases'], ['lanthanides', 'Lanthanides'], ['actinides', 'Actinides'],
];

const W = 42, H = 36, OX = 22, OY = 30;

export default function PeriodicGroups({ part, labels }) {
  const groups = {};
  SYM.forEach((symbol, i) => {
    const z = i + 1;
    const [row, col] = position(z);
    const y = OY + (row - 1) * H + (row > 7 ? 14 : 0);
    const x = OX + (col - 1) * W;
    (groups[category(z)] ||= []).push({ z, symbol, x, y });
  });

  return (
    <g>
      {/* group numbers */}
      {Array.from({ length: 18 }, (_, i) => (
        <text key={i} x={OX + i * W + W / 2} y={OY - 8} textAnchor="middle" className="dg-tick">{i + 1}</text>
      ))}

      {Object.entries(groups).map(([name, cells]) => (
        <g key={name} {...part(name)}>
          {cells.map((c) => (
            <g key={c.z}>
              <rect x={c.x + 1} y={c.y + 1} width={W - 2} height={H - 2} rx="4" fill={COLORS[name]} stroke="var(--ink, #101a3a)" strokeOpacity=".35" />
              <text x={c.x + W / 2} y={c.y + H / 2 + 4} textAnchor="middle" className="dg-sym">{c.symbol}</text>
            </g>
          ))}
        </g>
      ))}

      {labels && (
        <g pointerEvents="none">
          {LEGEND.map(([id, text], i) => {
            const lx = 22 + (i % 5) * 152;
            const ly = 438 + Math.floor(i / 5) * 22;
            return (
              <g key={id}>
                <rect x={lx} y={ly - 10} width="14" height="14" rx="3" fill={COLORS[id]} stroke="var(--ink, #101a3a)" strokeOpacity=".4" />
                <text x={lx + 20} y={ly + 2} className="dg-legend">{text}</text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}
