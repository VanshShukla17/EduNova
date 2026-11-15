import React from 'react';
import Callout from './Callout';

const TUBE = (cx) => `M${cx - 35} 320 V90 Q${cx - 35} 60 ${cx} 60 Q${cx + 35} 60 ${cx + 35} 90 V320`;

export default function WaterElectrolysis({ part, labels }) {
  return (
    <g>
      {/* Wires to battery */}
      <path d="M320 440 V472 H340 M480 440 V472 H460" fill="none" stroke="#374151" strokeWidth="4" pointerEvents="none" />

      {/* Electrolyte */}
      <g {...part('electrolyte')}>
        <rect x="232" y="235" width="336" height="183" fill="#bfe3f5" />
        <path d="M232 235 Q282 227 332 235 T432 235 T532 235 T568 235" fill="none" stroke="#7cc0e3" strokeWidth="3" pointerEvents="none" />
      </g>

      {/* Gas tubes: H2 volume is twice O2 volume */}
      <g {...part('hydrogen')}>
        <rect x="287" y="62" width="66" height="108" fill="#eef2ff" />
        <rect x="287" y="170" width="66" height="150" fill="#bfe3f5" />
        <path d={TUBE(320)} fill="none" stroke="#475569" strokeWidth="5" pointerEvents="stroke" />
        <text x="320" y="125" textAnchor="middle" className="dg-sym" style={{ fontSize: 22 }}>H₂</text>
      </g>

      <g {...part('oxygen')}>
        <rect x="447" y="62" width="66" height="54" fill="#eef2ff" />
        <rect x="447" y="116" width="66" height="204" fill="#bfe3f5" />
        <path d={TUBE(480)} fill="none" stroke="#475569" strokeWidth="5" pointerEvents="stroke" />
        <text x="480" y="97" textAnchor="middle" className="dg-sym" style={{ fontSize: 22 }}>O₂</text>
      </g>

      {/* Electrodes */}
      <g {...part('cathode')}>
        <rect x="313" y="150" width="14" height="298" rx="3" fill="#6b7280" stroke="#374151" strokeWidth="2" />
        <text x="298" y="400" textAnchor="end" className="dg-sign">−</text>
      </g>
      <g {...part('anode')}>
        <rect x="473" y="150" width="14" height="298" rx="3" fill="#6b7280" stroke="#374151" strokeWidth="2" />
        <text x="502" y="400" className="dg-sign">+</text>
      </g>

      {/* Beaker outline */}
      <g {...part('beaker')}>
        <path d="M230 150 V400 Q230 420 250 420 H550 Q570 420 570 400 V150" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" pointerEvents="stroke" />
      </g>

      {/* Rising Bubbles (animated) */}
      <g pointerEvents="none">
        {[[300, 300, 0], [335, 340, 0.4], [310, 380, 0.8], [338, 270, 1.2], [296, 345, 1.6], [333, 395, 0.2],
          [470, 330, 0.1], [498, 380, 0.9], [472, 280, 1.4]].map(([x, y, d], i) => (
          <circle key={i} cx={x} cy={y} r="4" className="dg-bubble" style={{ animationDelay: `${d}s` }} />
        ))}
      </g>

      {/* DC Battery */}
      <g {...part('battery')}>
        <rect x="340" y="452" width="120" height="38" rx="6" fill="#fde68a" stroke="var(--ink, #101a3a)" strokeWidth="3" />
        <text x="362" y="478" textAnchor="middle" className="dg-sign">−</text>
        <text x="438" y="478" textAnchor="middle" className="dg-sign">+</text>
        <text x="400" y="477" textAnchor="middle" className="dg-sym">DC</text>
      </g>

      <Callout show={labels} x1={285} y1={110} x2={180} y2={100} anchor="end">H₂ gas (2 volumes)</Callout>
      <Callout show={labels} x1={515} y1={90} x2={620} y2={100}>O₂ gas (1 volume)</Callout>
      <Callout show={labels} x1={230} y1={200} x2={180} y2={210} anchor="end">Beaker</Callout>
      <Callout show={labels} x1={313} y1={300} x2={180} y2={330} anchor="end">Cathode (−)</Callout>
      <Callout show={labels} x1={487} y1={300} x2={620} y2={330}>Anode (+)</Callout>
      <Callout show={labels} x1={545} y1={380} x2={620} y2={390}>Dilute acid + water</Callout>
      <Callout show={labels} x1={460} y1={471} x2={620} y2={471}>DC battery</Callout>
    </g>
  );
}
