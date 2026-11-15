import React, { useState } from 'react';
import { RotateCcw, Sun } from 'lucide-react';
import { PaperCard, Tag, Button } from './ui';

const SPECIMENS = [
  {
    id: 'onion_peel',
    name: 'Onion Peel Cells (Plant Tissue)',
    targetFocus: 50,
    baseScale: 1.0,
    stain: 'Safranin (Pinkish-Red)',
    description: 'Epidermal cells of Allium cepa showing distinct rectangular cell walls and peripheral nuclei pushed by central vacuoles.',
    organelles: [
      { name: 'Cell Wall', x: 45, y: 35, note: 'Rigid protective cellulose barrier maintaining structural integrity' },
      { name: 'Nucleus', x: 65, y: 55, note: 'Dark stained dense organelle containing genetic material' },
      { name: 'Cytoplasm', x: 50, y: 70, note: 'Granular semi-fluid matrix where metabolic reactions occur' }
    ]
  },
  {
    id: 'cheek_cell',
    name: 'Human Cheek Epithelial Cells (Animal Tissue)',
    targetFocus: 45,
    baseScale: 1.2,
    stain: 'Methylene Blue (Deep Blue)',
    description: 'Stratified squamous epithelial cells from the inner cheek lining, irregular polygonal shapes with prominent central nuclei.',
    organelles: [
      { name: 'Cell Membrane', x: 48, y: 32, note: 'Thin flexible phospholipid bilayer; cell wall is absent' },
      { name: 'Central Nucleus', x: 52, y: 52, note: 'Centrally located spherical nucleus stained dark blue' },
      { name: 'Cytoplasm', x: 62, y: 65, note: 'Transparent ground substance without large vacuoles' }
    ]
  },
  {
    id: 'amoeba',
    name: 'Amoeba Proteus (Microscopic Protist)',
    targetFocus: 55,
    baseScale: 1.1,
    stain: 'Live Wet Mount',
    description: 'Unicellular freshwater amoeboid protozoan continuously extending pseudopodia for amoeboid locomotion and phagocytosis.',
    organelles: [
      { name: 'Pseudopodium', x: 30, y: 40, note: 'False foot formed by cytoplasmic streaming for locomotion' },
      { name: 'Contractile Vacuole', x: 68, y: 38, note: 'Osmoregulatory organelle expelling excess water' },
      { name: 'Food Vacuole', x: 55, y: 65, note: 'Digests ingested bacterial prey via enzymatic hydrolysis' }
    ]
  }
];

export default function MicroscopeSimulation() {
  const [selectedSpecimen, setSelectedSpecimen] = useState(SPECIMENS[0]);
  const [objectiveLens, setObjectiveLens] = useState(40); // 10x, 40x, 100x
  const [coarseFocus, setCoarseFocus] = useState(30);     // 0 to 100
  const [fineFocus, setFineFocus] = useState(20);         // 0 to 100
  const [lightIntensity, setLightIntensity] = useState(85); // 20 to 100
  const [selectedOrganelle, setSelectedOrganelle] = useState(null);

  const totalMagnification = 10 * objectiveLens; // Eyepiece is 10x

  // Combined focus calculation: Target is selectedSpecimen.targetFocus
  // Optimal when (coarseFocus * 0.7 + fineFocus * 0.3) is close to targetFocus
  const effectiveFocus = (coarseFocus * 0.7) + (fineFocus * 0.3);
  const focusDiff = Math.abs(effectiveFocus - selectedSpecimen.targetFocus);
  const blurPx = Math.min(16, (focusDiff * 0.4).toFixed(1));
  const isInSharpFocus = focusDiff < 4.0;

  const handleReset = () => {
    setCoarseFocus(30);
    setFineFocus(20);
    setObjectiveLens(40);
    setSelectedOrganelle(null);
  };

  return (
    <div className="paper-grid paper-grid--2" style={{ alignItems: 'start' }}>
      {/* Microscope Circular Field of View Canvas */}
      <PaperCard
        flat
        style={{
          padding: 'var(--sp-4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--slate-950)',
          borderColor: 'var(--dark-paper-border)',
          color: 'var(--white)',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
          <span className="type-small" style={{ fontWeight: 700, color: 'var(--physics-soft)' }}>
            Optical Eyepiece Field of View ({totalMagnification}x)
          </span>
          <Tag variant={isInSharpFocus ? 'verified' : 'paper'}>
            {isInSharpFocus ? 'Sharp Focus' : 'Blurry (Adjust Focus Knobs)'}
          </Tag>
        </div>

        {/* Circular Eyepiece Aperture */}
        <div
          style={{
            width: 'min(320px, 100%)',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '6px solid var(--slate-700)',
            position: 'relative',
            background: 'var(--desk-950)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Microscope Field Background with Illumination */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background:
                selectedSpecimen.id === 'onion_peel'
                  ? 'var(--note-pink)'
                  : selectedSpecimen.id === 'cheek_cell'
                  ? 'var(--physics-soft)'
                  : 'var(--biology-soft)',
              opacity: lightIntensity / 100,
              filter: `blur(${blurPx}px)`,
              transition: 'filter 0.15s ease, opacity 0.2s ease',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* SVG Visual of Biological Specimen */}
            {selectedSpecimen.id === 'onion_peel' && (
              <svg viewBox="0 0 200 200" style={{ width: '90%', height: '90%', transform: `scale(${objectiveLens / 35})` }}>
                {[20, 60, 100, 140].map((y, rowIdx) => (
                  <g key={y}>
                    {[10, 70, 130].map((x) => (
                      <g key={x}>
                        <rect
                          x={x + (rowIdx % 2 === 0 ? 0 : 25)}
                          y={y}
                          width="55"
                          height="35"
                          rx="3"
                          fill="var(--red-soft)"
                          stroke="var(--red-600)"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx={x + (rowIdx % 2 === 0 ? 0 : 25) + 38}
                          cy={y + 18}
                          r="5.5"
                          fill="var(--red-ink)"
                        />
                        <ellipse
                          cx={x + (rowIdx % 2 === 0 ? 0 : 25) + 20}
                          cy={y + 18}
                          rx="12"
                          ry="8"
                          fill="var(--note-pink)"
                          stroke="var(--red-border)"
                          strokeWidth="1"
                        />
                      </g>
                    ))}
                  </g>
                ))}
              </svg>
            )}

            {selectedSpecimen.id === 'cheek_cell' && (
              <svg viewBox="0 0 200 200" style={{ width: '85%', height: '85%', transform: `scale(${objectiveLens / 35})` }}>
                <path
                  d="M 60 70 C 40 90, 45 130, 75 140 C 115 150, 140 120, 135 90 C 130 60, 90 50, 60 70 Z"
                  fill="var(--physics-soft)"
                  stroke="var(--physics)"
                  strokeWidth="2.5"
                />
                <circle cx="95" cy="100" r="7.5" fill="var(--physics-ink)" />
                <path
                  d="M 120 40 C 105 50, 110 75, 130 80 C 150 85, 170 70, 165 50 C 160 30, 135 25, 120 40 Z"
                  fill="var(--physics-soft)"
                  stroke="var(--physics)"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <circle cx="140" cy="55" r="5" fill="var(--physics-ink)" />
              </svg>
            )}

            {selectedSpecimen.id === 'amoeba' && (
              <svg viewBox="0 0 200 200" style={{ width: '85%', height: '85%', transform: `scale(${objectiveLens / 35})` }}>
                <path
                  d="M 80 50 C 50 40, 30 70, 40 100 C 30 130, 60 160, 95 155 C 130 150, 160 170, 170 135 C 180 100, 150 85, 145 60 C 140 30, 105 55, 80 50 Z"
                  fill="var(--biology-soft)"
                  stroke="var(--biology)"
                  strokeWidth="3"
                />
                <circle cx="105" cy="95" r="9" fill="var(--biology-ink)" />
                <circle cx="70" cy="85" r="6" fill="var(--emerald-soft)" stroke="var(--biology-ink)" strokeWidth="1.5" />
                <circle cx="135" cy="120" r="5" fill="var(--biology)" />
              </svg>
            )}
          </div>

          {/* Reticle / Crosshair Scale Overlay */}
          <svg viewBox="0 0 320 320" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <circle cx="160" cy="160" r="158" fill="none" stroke="var(--slate-700)" strokeWidth="2" />
            <line x1="160" y1="150" x2="160" y2="170" stroke="var(--ink-soft)" strokeWidth="1" />
            <line x1="150" y1="160" x2="170" y2="160" stroke="var(--ink-soft)" strokeWidth="1" />
          </svg>
        </div>

        {/* Status Callout */}
        <div className="type-small" style={{ marginTop: 'var(--sp-3)', color: 'var(--on-desk-muted)', textAlign: 'center' }}>
          Specimen: <strong>{selectedSpecimen.name}</strong> • Stain: <strong>{selectedSpecimen.stain}</strong>
        </div>
      </PaperCard>

      {/* Right Column: Microscope Controls */}
      <PaperCard flat style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        <div>
          <h2 className="type-h3" style={{ marginBottom: '4px' }}>
            Microscope Controls
          </h2>
          <p className="type-small" style={{ color: 'var(--ink-muted)', margin: 0 }}>
            Switch biological specimen slides, change objective lens magnification, and tune fine focus knobs.
          </p>
        </div>

        {/* Specimen Slide Selector */}
        <div>
          <label className="type-small" style={{ fontWeight: 700, color: 'var(--ink-muted)' }}>
            Select Biological Slide
          </label>
          <div style={{ display: 'grid', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)' }}>
            {SPECIMENS.map((s) => (
              <Button
                key={s.id}
                size="sm"
                variant={selectedSpecimen.id === s.id ? 'primary' : 'ghost'}
                onClick={() => {
                  setSelectedSpecimen(s);
                  setSelectedOrganelle(null);
                }}
                style={{ justifyContent: 'flex-start' }}
              >
                {s.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Objective Lens Turret */}
        <div>
          <label className="type-small" style={{ fontWeight: 700, color: 'var(--ink-muted)' }}>
            Objective Lens Turret (Total Magnification: {totalMagnification}x)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)' }}>
            {[10, 40, 100].map((mag) => (
              <Button
                key={mag}
                size="sm"
                variant={objectiveLens === mag ? 'primary' : 'ghost'}
                onClick={() => setObjectiveLens(mag)}
              >
                {mag}x ({mag * 10}x)
              </Button>
            ))}
          </div>
        </div>

        {/* Focus Knobs */}
        <div className="paper-grid paper-grid--2" style={{ gap: 'var(--sp-3)' }}>
          <div>
            <label className="type-small" style={{ fontWeight: 700, color: 'var(--ink-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Coarse Focus</span>
              <span>{coarseFocus}</span>
            </label>
            <input
              type="range"
              aria-label="Coarse focus"
              min="0"
              max="100"
              value={coarseFocus}
              onChange={(e) => setCoarseFocus(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--emerald-600)' }}
            />
          </div>

          <div>
            <label className="type-small" style={{ fontWeight: 700, color: 'var(--ink-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Fine Focus</span>
              <span>{fineFocus}</span>
            </label>
            <input
              type="range"
              aria-label="Fine focus"
              min="0"
              max="100"
              value={fineFocus}
              onChange={(e) => setFineFocus(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--emerald-600)' }}
            />
          </div>
        </div>

        {/* Substage Iris Diaphragm / Light Intensity */}
        <div>
          <label className="type-small" style={{ fontWeight: 700, color: 'var(--ink-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Sun size={14} /> Iris Diaphragm Aperture
            </span>
            <span>{lightIntensity}%</span>
          </label>
          <input
            type="range"
            aria-label="Light intensity"
            min="30"
            max="100"
            value={lightIntensity}
            onChange={(e) => setLightIntensity(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--amber-500)' }}
          />
        </div>

        {/* Organelle Key & Notes */}
        <div style={{ background: 'var(--paper-warm)', padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
          <div className="type-small" style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>
            Distinct Visible Organelles
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {selectedSpecimen.organelles.map((org, idx) => (
              <div key={idx} className="type-small" style={{ lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--biology-ink)' }}>• {org.name}: </strong>
                <span style={{ color: 'var(--ink-muted)' }}>{org.note}</span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleReset} variant="secondary" style={{ width: '100%' }}>
          <RotateCcw size={14} /> Reset Microscope to Initial Position
        </Button>
      </PaperCard>
    </div>
  );
}

