import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Droplets, TrendingUp } from 'lucide-react';
import { PaperCard, Tag, Button } from './ui';

export default function TitrationSimulation() {
  const [buretteVolume, setBuretteVolume] = useState(0); // mL dispensed (0 to 50)
  const [isDripping, setIsDripping] = useState(false);
  const [dripRate, setDripRate] = useState(0.2); // mL per tick
  const [stirring, setStirring] = useState(true);

  // Constants
  const acidVolume = 20.0; // mL
  const titrantMolarity = 0.1; // M NaOH
  const analyteMolarity = 0.1; // M HCl
  const equivalenceVolume = (analyteMolarity * acidVolume) / titrantMolarity; // 20.0 mL

  // Calculate pH based on volume of strong base added to strong acid
  const calculatePH = (vAdded) => {
    const vTotal = (acidVolume + vAdded) / 1000; // in Liters
    const molesAcidInitial = (analyteMolarity * acidVolume) / 1000;
    const molesBaseAdded = (titrantMolarity * vAdded) / 1000;

    if (vAdded < equivalenceVolume - 0.05) {
      // Acid in excess
      const molesAcidRemaining = molesAcidInitial - molesBaseAdded;
      const hConc = Math.max(1e-7, molesAcidRemaining / vTotal);
      return Math.min(6.5, Math.max(1.0, -Math.log10(hConc)));
    } else if (Math.abs(vAdded - equivalenceVolume) <= 0.05) {
      // Equivalence point
      return 7.0;
    } else {
      // Base in excess
      const molesBaseExcess = molesBaseAdded - molesAcidInitial;
      const ohConc = molesBaseExcess / vTotal;
      const pOH = -Math.log10(Math.max(1e-7, ohConc));
      return Math.max(7.5, Math.min(13.0, 14.0 - pOH));
    }
  };

  const currentPH = Number(calculatePH(buretteVolume).toFixed(2));

  // Determine solution color based on phenolphthalein indicator
  // pH < 8.2: Colorless
  // pH 8.2 - 9.5: Faint pink
  // pH > 9.5: Deep Magenta Pink
  let liquidColor = 'var(--physics-soft)';
  let liquidOpacity = 0.45;
  let colorName = 'Colorless (Acidic)';
  let colorBadge = 'var(--ink-muted)';

  if (currentPH >= 8.2 && currentPH <= 9.6) {
    liquidColor = 'var(--note-pink)';
    liquidOpacity = 0.7;
    colorName = 'Faint Permanent Pink (Equivalence Endpoint)';
    colorBadge = 'var(--red-600)';
  } else if (currentPH > 9.6) {
    liquidColor = 'var(--red-600)';
    liquidOpacity = 0.85;
    colorName = 'Deep Magenta (Over-titrated Basic)';
    colorBadge = 'var(--red-ink)';
  }

  // Animation drip loop
  useEffect(() => {
    let timer = null;
    if (isDripping) {
      timer = setInterval(() => {
        setBuretteVolume(v => {
          if (v >= 50.0) {
            setIsDripping(false);
            return 50.0;
          }
          return Number((v + dripRate).toFixed(2));
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isDripping, dripRate]);

  const handleAddDrop = () => {
    setBuretteVolume(v => Math.min(50, Number((v + 0.05).toFixed(2))));
  };

  const handleReset = () => {
    setIsDripping(false);
    setBuretteVolume(0);
  };

  // Generate sparkline path for titration curve
  const curvePoints = [];
  for (let v = 0; v <= Math.max(buretteVolume, 35); v += 0.5) {
    const ph = calculatePH(v);
    const x = 30 + (v / 40) * 180;
    const y = 140 - (ph / 14) * 110;
    curvePoints.push(`${x},${y}`);
  }

  return (
    <div className="paper-grid paper-grid--2" style={{ alignItems: 'start' }}>
      {/* Interactive Laboratory Apparatus Canvas */}
      <PaperCard
        flat
        style={{
          padding: 'var(--sp-4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--paper-warm)',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
          <span className="type-small" style={{ fontWeight: 700, color: 'var(--chemistry-ink)' }}>
            Volumetric Apparatus
          </span>
          <Tag variant="paper">{colorName}</Tag>
        </div>

        {/* SVG Drawing of Burette, Stand, Stopcock, and Conical Flask */}
        <svg viewBox="0 0 320 440" style={{ width: '100%', maxWidth: '320px', height: 'auto' }}>
          <rect x="20" y="410" width="140" height="15" rx="3" fill="var(--slate-700)" />
          <rect x="35" y="40" width="10" height="370" fill="var(--ink-muted)" />
          <rect x="35" y="140" width="85" height="8" rx="2" fill="var(--ink-soft)" />
          <rect x="110" y="130" width="18" height="28" rx="3" fill="var(--ink-muted)" />

          <rect x="112" y="30" width="14" height="240" rx="3" fill="var(--paper-edge)" stroke="var(--ink-soft)" strokeWidth="1.5" />
          {buretteVolume < 50 && (
            <rect
              x="113"
              y={30 + (buretteVolume / 50) * 230}
              width="12"
              height={230 - (buretteVolume / 50) * 230}
              fill="var(--physics)"
              opacity="0.7"
            />
          )}

          {[0, 10, 20, 30, 40, 50].map((tick) => (
            <g key={tick}>
              <line x1="126" y1={30 + (tick / 50) * 230} x2="132" y2={30 + (tick / 50) * 230} stroke="var(--ink-muted)" strokeWidth="1" />
              <text x="136" y={34 + (tick / 50) * 230} fontSize="7" fill="var(--ink-muted)" fontFamily="monospace">{tick}</text>
            </g>
          ))}

          <rect x="107" y="270" width="24" height="10" rx="2" fill={isDripping ? 'var(--emerald-500)' : 'var(--red-600)'} />
          <circle cx="119" cy="275" r="4" fill="var(--white)" />

          {isDripping && (
            <circle cx="119" cy="300" r="3" fill="var(--physics)">
              <animate attributeName="cy" from="285" to="340" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0.2" dur="0.5s" repeatCount="indefinite" />
            </circle>
          )}

          <polygon
            points="105,335 133,335 175,410 63,410"
            fill="none"
            stroke="var(--ink-soft)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon
            points="95,360 143,360 173,408 65,408"
            fill={liquidColor}
            fillOpacity={liquidOpacity}
            style={{ transition: 'fill 0.4s ease, fill-opacity 0.4s ease' }}
          />

          <rect
            x="110"
            y="400"
            width="18"
            height="5"
            rx="2.5"
            fill="var(--white)"
            stroke="var(--ink-soft)"
            strokeWidth="0.8"
            style={{
              transformOrigin: '119px 402px',
              animation: stirring ? 'spin 1s linear infinite' : 'none',
            }}
          />
        </svg>

        {/* Live HUD Readout */}
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-2)', marginTop: 'var(--sp-3)', textAlign: 'center' }}>
          <div style={{ background: 'var(--paper)', padding: 'var(--sp-2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
            <div className="type-small" style={{ color: 'var(--ink-muted)', fontWeight: 600 }}>NaOH Added</div>
            <div className="type-h3" style={{ color: 'var(--physics-ink)' }}>{buretteVolume.toFixed(2)} mL</div>
          </div>
          <div style={{ background: 'var(--paper)', padding: 'var(--sp-2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
            <div className="type-small" style={{ color: 'var(--ink-muted)', fontWeight: 600 }}>Solution pH</div>
            <div className="type-h3" style={{ color: colorBadge }}>{currentPH}</div>
          </div>
          <div style={{ background: 'var(--paper)', padding: 'var(--sp-2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
            <div className="type-small" style={{ color: 'var(--ink-muted)', fontWeight: 600 }}>HCl Volume</div>
            <div className="type-h3">20.0 mL</div>
          </div>
        </div>
      </PaperCard>

      {/* Right Column: Controls & Real-Time Titration Curve Chart */}
      <PaperCard flat style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        <div>
          <h2 className="type-h3" style={{ marginBottom: '4px' }}>Titration Controls</h2>
          <p className="type-small" style={{ color: 'var(--ink-muted)', margin: 0 }}>
            Operate the burette stopcock to add NaOH titrant until the solution turns faint permanent pink.
          </p>
        </div>

        {/* Flow Controls */}
        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
          <Button
            variant={isDripping ? 'secondary' : 'primary'}
            onClick={() => setIsDripping(!isDripping)}
            style={{ flex: 1 }}
          >
            {isDripping ? <Pause size={16} /> : <Play size={16} />}
            <span>{isDripping ? 'Stop Flow' : 'Start Continuous Flow'}</span>
          </Button>

          <Button
            variant="secondary"
            onClick={handleAddDrop}
            disabled={isDripping || buretteVolume >= 50}
          >
            <Droplets size={15} /> Add 1 Drop (0.05 mL)
          </Button>

          <Button variant="ghost" onClick={handleReset} aria-label="Reset Experiment" title="Reset Experiment">
            <RotateCcw size={16} />
          </Button>
        </div>

        {/* Flow Speed Slider */}
        <div>
          <label className="type-small" style={{ fontWeight: 700, color: 'var(--ink-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Flow Rate</span>
            <span>{dripRate} mL / step</span>
          </label>
          <input
            type="range"
            aria-label="Titration flow rate"
            min="0.05"
            max="0.5"
            step="0.05"
            value={dripRate}
            onChange={(e) => setDripRate(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--chemistry)' }}
          />
        </div>

        {/* Live Titration Curve (pH vs Volume) */}
        <div style={{ background: 'var(--paper-warm)', padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-2)' }}>
            <span className="type-small" style={{ fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={15} style={{ color: 'var(--physics)' }} />
              Live Titration Curve (pH vs V_NaOH)
            </span>
            <span className="type-small" style={{ fontWeight: 700, color: colorBadge }}>
              pH: {currentPH}
            </span>
          </div>

          <svg viewBox="0 0 240 160" style={{ width: '100%', height: 'auto', background: 'var(--white)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
            <line x1="30" y1="20" x2="30" y2="140" stroke="var(--paper-edge)" strokeWidth="1.5" />
            <line x1="30" y1="140" x2="220" y2="140" stroke="var(--paper-edge)" strokeWidth="1.5" />
            <line x1="30" y1="85" x2="220" y2="85" stroke="var(--amber-400)" strokeWidth="1" strokeDasharray="3 3" />
            <text x="5" y="88" fontSize="8" fill="var(--amber-ink)" fontWeight="bold">pH 7</text>
            <text x="5" y="25" fontSize="8" fill="var(--ink-muted)">14</text>
            <text x="12" y="143" fontSize="8" fill="var(--ink-muted)">0</text>
            <text x="110" y="155" fontSize="8" fill="var(--ink-muted)" textAnchor="middle">Volume NaOH (mL)</text>
            <text x="210" y="152" fontSize="7" fill="var(--ink-muted)">40</text>

            {curvePoints.length > 1 && (
              <polyline
                fill="none"
                stroke="var(--physics)"
                strokeWidth="2.5"
                points={curvePoints.join(' ')}
              />
            )}

            <circle
              cx={30 + (buretteVolume / 40) * 180}
              cy={140 - (currentPH / 14) * 110}
              r="4"
              fill={colorBadge}
            />
          </svg>
        </div>

        {/* Equivalence Point Deduction & Formula */}
        <div style={{ background: 'var(--chemistry-soft)', padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
          <div className="type-small" style={{ fontWeight: 700, color: 'var(--chemistry-ink)', marginBottom: '4px' }}>
            Quantitative Formula
          </div>
          <div className="type-mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>
            M₁ × V₁ (Acid) = M₂ × V₂ (Base)
          </div>
          <div className="type-small" style={{ marginTop: '4px', color: 'var(--ink-muted)' }}>
            M(HCl) = (0.10 M × {buretteVolume.toFixed(1)} mL) / 20.0 mL = <strong>{((0.1 * buretteVolume) / 20).toFixed(3)} M</strong>
          </div>
        </div>
      </PaperCard>
    </div>
  );
}

