import React, { useState } from 'react';
import Callout from './Callout';

export default function ElectricCircuit({ part, labels }) {
  const [on, setOn] = useState(true);

  return (
    <g>
      {/* wires: one closed loop */}
      <g {...part('wire')}>
        <path d="M150 110 H650 V370 H150 Z" fill="none" stroke="#374151" strokeWidth="5" strokeLinejoin="round" pointerEvents="stroke" />
      </g>

      {/* conventional current: animated dashes, clockwise from the + terminal */}
      <g {...part('current')}>
        <path d="M166 126 H634 V354 H166 Z" fill="none" stroke={on ? '#f59e0b' : '#cbd5e1'}
          strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round"
          className={on ? 'dg-flow' : ''} pointerEvents="stroke" />
      </g>

      {/* battery (left) */}
      <g {...part('battery')}>
        <rect className="dg-mask" x="140" y="212" width="20" height="38" />
        <line x1="128" y1="210" x2="172" y2="210" stroke="var(--ink, #101a3a)" strokeWidth="3" />
        <line x1="138" y1="223" x2="162" y2="223" stroke="var(--ink, #101a3a)" strokeWidth="7" />
        <line x1="128" y1="237" x2="172" y2="237" stroke="var(--ink, #101a3a)" strokeWidth="3" />
        <line x1="138" y1="250" x2="162" y2="250" stroke="var(--ink, #101a3a)" strokeWidth="7" />
        <text x="182" y="214" className="dg-sign">+</text>
        <text x="182" y="256" className="dg-sign">−</text>
        <rect x="120" y="198" width="60" height="66" fill="transparent" />
      </g>

      {/* ammeter (top-left) */}
      <g {...part('ammeter')}>
        <rect className="dg-mask" x="232" y="98" width="56" height="24" />
        <circle cx="260" cy="110" r="24" fill="#fff" stroke="var(--ink, #101a3a)" strokeWidth="3" />
        <text x="260" y="118" textAnchor="middle" className="dg-sym" style={{ fontSize: 22 }}>A</text>
      </g>

      {/* switch (top-right) */}
      <g {...part('switch')}>
        <rect className="dg-mask" x="438" y="98" width="64" height="24" />
        <circle cx="438" cy="110" r="5" fill="var(--ink, #101a3a)" />
        <circle cx="502" cy="110" r="5" fill="var(--ink, #101a3a)" />
        <line x1="438" y1="110" x2={on ? 502 : 494} y2={on ? 110 : 82} stroke="var(--ink, #101a3a)" strokeWidth="5" strokeLinecap="round" />
        <rect x="430" y="76" width="80" height="44" fill="transparent" />
      </g>

      {/* bulb (right) */}
      <g {...part('bulb')}>
        <rect className="dg-mask" x="630" y="210" width="40" height="60" />
        {on && <circle cx="650" cy="240" r="46" fill="#fde047" opacity=".35" />}
        <circle cx="650" cy="240" r="30" fill={on ? '#fef08a' : '#f1f5f9'} stroke="var(--ink, #101a3a)" strokeWidth="3" />
        <path d="M636 262 V244 Q650 214 664 244 V262" fill="none" stroke={on ? '#d97706' : '#64748b'} strokeWidth="3" />
      </g>

      {/* resistor (bottom) */}
      <g {...part('resistor')}>
        <rect className="dg-mask" x="330" y="350" width="140" height="40" />
        <path d="M330 370 H350 l8 -16 l14 32 l14 -32 l14 32 l14 -32 l14 32 l8 -16 H470" fill="none" stroke="var(--ink, #101a3a)" strokeWidth="4" strokeLinejoin="round" />
        <rect x="330" y="348" width="140" height="44" fill="transparent" />
      </g>

      {/* switch toggle (interactive button) */}
      <g
        className="dg-toggle"
        role="button"
        tabIndex={0}
        aria-label="Toggle the switch"
        onClick={() => setOn((v) => !v)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOn((v) => !v))}
      >
        <rect x="600" y="428" width="130" height="32" rx="16" fill={on ? 'var(--color-primary, #2563eb)' : '#64748b'} />
        <text x="665" y="449" textAnchor="middle" fill="#fff" fontWeight="700">Switch: {on ? 'ON' : 'OFF'}</text>
      </g>

      <Callout show={labels} x1={128} y1={230} x2={90} y2={230} anchor="end">Battery</Callout>
      <Callout show={labels} x1={260} y1={86} x2={260} y2={50} anchor="middle">Ammeter</Callout>
      <Callout show={labels} x1={470} y1={86} x2={470} y2={50} anchor="middle">Switch</Callout>
      <Callout show={labels} x1={150} y1={150} x2={90} y2={150} anchor="end">Wire</Callout>
      <Callout show={labels} x1={680} y1={240} x2={730} y2={240}>Bulb</Callout>
      <Callout show={labels} x1={400} y1={388} x2={400} y2={425} anchor="middle">Resistor</Callout>
      <Callout show={labels} x1={166} y1={320} x2={90} y2={320} anchor="end">Current</Callout>
    </g>
  );
}
