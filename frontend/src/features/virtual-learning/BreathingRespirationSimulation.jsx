import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button, PaperCard, Tag } from '../../components/ui';
import { resolveCssVar } from '../../components/ui/subjectUtils';

/**
 * Breathing & Respiration Simulation (P2-8.3)
 * CBSE Class 10 Biology (Life Processes):
 * - Mechanism of Breathing: Inhalation (diaphragm flattens, ribs lift, chest volume increases, negative pressure draws air in)
 *   vs Exhalation (diaphragm domes upward, chest volume decreases, air pushed out).
 * - Enlarged Alveolus View: Microscopic gas exchange across alveolar membrane (O₂ into RBC capillaries, CO₂ out).
 */
export default function BreathingRespirationSimulation() {
  const [viewMode, setViewMode] = useState('lungs'); // 'lungs' | 'alveolus'
  const [bpm, setBpm] = useState(16); // Breaths per minute (normal 12-20)
  const [isPlaying, setIsPlaying] = useState(true);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const phaseRef = useRef(0); // 0 to 2*PI representing respiratory cycle

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const cTrachea = resolveCssVar('--paper-edge');
    const cTracheaStroke = resolveCssVar('--ink-soft');
    const cRings = resolveCssVar('--ink-muted');
    const cInhaleArrow = resolveCssVar('--physics');
    const cExhaleArrow = resolveCssVar('--red-600');
    const cLungInhale = resolveCssVar('--red-soft');
    const cLungExhale = resolveCssVar('--red-border');
    const cLungStroke = resolveCssVar('--red-600');
    const cDiaphragm = resolveCssVar('--maths');
    const cInk = resolveCssVar('--ink');
    const cAlveolusFill = resolveCssVar('--red-soft');
    const cCapillary = resolveCssVar('--physics');
    const cO2 = resolveCssVar('--emerald-600');
    const cCO2 = resolveCssVar('--amber-500');

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cycle = Math.sin(phaseRef.current); // -1 (exhale) to +1 (inhale)
      const isInhaling = Math.cos(phaseRef.current) > 0;

      if (viewMode === 'lungs') {
        // --- 1. Lungs & Diaphragm View ---
        const cx = width / 2;
        const cy = height / 2 - 10;

        // Trachea (Windpipe)
        ctx.fillStyle = cTrachea;
        ctx.fillRect(cx - 10, 30, 20, 60);
        ctx.strokeStyle = cTracheaStroke;
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 10, 30, 20, 60);

        // Cartilaginous rings
        for (let y = 38; y < 90; y += 10) {
          ctx.beginPath();
          ctx.moveTo(cx - 10, y);
          ctx.lineTo(cx + 10, y);
          ctx.strokeStyle = cRings;
          ctx.stroke();
        }

        // Airflow arrows
        ctx.strokeStyle = isInhaling ? cInhaleArrow : cExhaleArrow;
        ctx.lineWidth = 3;
        ctx.beginPath();
        const arrowY = 45 + (isInhaling ? 10 * cycle : -10 * cycle);
        ctx.moveTo(cx, arrowY - 10);
        ctx.lineTo(cx, arrowY + 10);
        if (isInhaling) {
          ctx.lineTo(cx - 5, arrowY + 5);
          ctx.moveTo(cx, arrowY + 10);
          ctx.lineTo(cx + 5, arrowY + 5);
        } else {
          ctx.lineTo(cx - 5, arrowY - 5);
          ctx.moveTo(cx, arrowY - 10);
          ctx.lineTo(cx + 5, arrowY - 5);
        }
        ctx.stroke();

        // Left & Right Lungs (expanding with inhalation)
        const lungExpansion = 1 + cycle * 0.15; // 0.85 to 1.15 scale
        const lungW = 70 * lungExpansion;
        const lungH = 110 * lungExpansion;

        // Left Lung
        ctx.beginPath();
        ctx.ellipse(cx - 65, cy + 30, lungW / 2, lungH / 2, -0.1, 0, Math.PI * 2);
        ctx.fillStyle = isInhaling ? cLungInhale : cLungExhale;
        ctx.fill();
        ctx.strokeStyle = cLungStroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Right Lung (3 lobes)
        ctx.beginPath();
        ctx.ellipse(cx + 65, cy + 30, lungW / 2, lungH / 2, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = isInhaling ? cLungInhale : cLungExhale;
        ctx.fill();
        ctx.strokeStyle = cLungStroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Diaphragm (Dome muscle beneath lungs)
        const diaphragmFlattening = 25 - cycle * 18; // flattens on inhale, domes up on exhale
        ctx.beginPath();
        ctx.moveTo(cx - 130, cy + 105);
        ctx.quadraticCurveTo(cx, cy + 105 - diaphragmFlattening, cx + 130, cy + 105);
        ctx.lineWidth = 8;
        ctx.strokeStyle = cDiaphragm;
        ctx.stroke();

        // Labels
        ctx.fillStyle = cInk;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Trachea', cx + 15, 55);
        ctx.fillText('Left Lung', cx - 110, cy + 20);
        ctx.fillText('Right Lung', cx + 75, cy + 20);

        ctx.fillStyle = cDiaphragm;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(
          `Diaphragm: ${isInhaling ? 'Contracting & Flattening (Inhalation)' : 'Relaxing & Doming Up (Exhalation)'}`,
          cx - 150,
          cy + 130
        );
      } else {
        // --- 2. Microscopic Alveolus Gas Exchange View ---
        const cx = width / 2;
        const cy = height / 2;

        // Alveolar Sac (Circle)
        ctx.beginPath();
        ctx.arc(cx - 40, cy, 90, 0, Math.PI * 2);
        ctx.fillStyle = cAlveolusFill;
        ctx.fill();
        ctx.strokeStyle = cExhaleArrow;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Surrounding Capillary Blood Vessel
        ctx.beginPath();
        ctx.arc(cx - 40, cy, 115, Math.PI * 0.2, Math.PI * 1.8, false);
        ctx.strokeStyle = cCapillary;
        ctx.lineWidth = 14;
        ctx.stroke();

        // Red Blood Cells moving in capillary
        const rbcCount = 8;
        for (let i = 0; i < rbcCount; i++) {
          const theta = Math.PI * 0.3 + (i / rbcCount) * (Math.PI * 1.4) + (phaseRef.current * 0.2) % (Math.PI * 0.3);
          const rx = cx - 40 + 115 * Math.cos(theta);
          const ry = cy + 115 * Math.sin(theta);
          ctx.beginPath();
          ctx.arc(rx, ry, 6, 0, Math.PI * 2);
          // Color turns from deoxygenated (blue) to oxygenated (bright red)
          ctx.fillStyle = theta > Math.PI ? cLungStroke : cInhaleArrow;
          ctx.fill();
        }

        // Gas Exchange Diffusion Arrows:
        // O2 into capillary (Blue -> Red)
        ctx.strokeStyle = cO2;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy - 20);
        ctx.lineTo(cx + 40, cy - 30);
        ctx.stroke();
        ctx.fillStyle = cO2;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('O₂ Diffusion into Blood →', cx + 45, cy - 30);

        // CO2 into alveolus (Red -> Out)
        ctx.strokeStyle = cCO2;
        ctx.beginPath();
        ctx.moveTo(cx + 40, cy + 20);
        ctx.lineTo(cx - 10, cy + 10);
        ctx.stroke();
        ctx.fillStyle = cCO2;
        ctx.fillText('← CO₂ Diffusion into Alveolus', cx + 45, cy + 25);

        ctx.fillStyle = cInk;
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Alveolar Sac (High pO₂)', cx - 90, cy);
        ctx.font = '10px sans-serif';
        ctx.fillText('Thin squamous epithelium (1-cell thick)', cx - 110, cy + 20);
      }

      if (isPlaying) {
        // Frequency linked to BPM: 1 breath = 60 / bpm seconds
        const speed = (bpm / 60) * 0.08;
        phaseRef.current += speed;
      }
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [viewMode, bpm, isPlaying]);

  return (
    <PaperCard flat style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      {/* View Switcher Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          <Button
            type="button"
            size="sm"
            variant={viewMode === 'lungs' ? 'danger' : 'secondary'}
            onClick={() => setViewMode('lungs')}
          >
            Lungs &amp; Diaphragm Motion
          </Button>
          <Button
            type="button"
            size="sm"
            variant={viewMode === 'alveolus' ? 'danger' : 'secondary'}
            onClick={() => setViewMode('alveolus')}
          >
            Alveolar Gas Exchange (Zoom)
          </Button>
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pause' : 'Resume'}
        </Button>
      </div>

      {/* Canvas Viewport */}
      <div style={{ width: '100%', height: '280px', backgroundColor: 'var(--paper-warm)', borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--paper-edge)' }}>
        <canvas
          ref={canvasRef}
          width={760}
          height={280}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Controls & Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-3)' }}>
        <PaperCard flat style={{ padding: 'var(--sp-3)', backgroundColor: 'var(--paper-warm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>Breathing Rate:</span>
            <Tag tone="red">{bpm} breaths/min</Tag>
          </div>
          <input
            type="range"
            min="8"
            max="40"
            step="2"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value, 10))}
            aria-label="Breathing Rate in breaths per minute"
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--red-600)' }}
          />
          <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginTop: '4px' }}>
            {bpm > 25 ? 'Heavy Exercise / Hyperventilation' : 'Resting Tidal Breathing'}
          </div>
        </PaperCard>

        <PaperCard flat style={{ padding: 'var(--sp-3)', backgroundColor: 'var(--physics-soft)', borderColor: 'var(--physics)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--physics-ink)', fontWeight: 700 }}>Tidal Volume (Normal breath)</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)' }}>~500 mL</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--physics-ink)' }}>Alveoli surface area in adult: ~80 m² (tennis court)</div>
        </PaperCard>

        <PaperCard flat style={{ padding: 'var(--sp-3)', backgroundColor: 'var(--red-soft)', borderColor: 'var(--red-border)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--red-ink)', fontWeight: 700 }}>Respiratory Pigment</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--red-ink)' }}>Hemoglobin (Hb)</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--red-ink)' }}>Each Hb tetramer binds 4 O₂ molecules (Oxyhemoglobin)</div>
        </PaperCard>
      </div>
    </PaperCard>
  );
}

