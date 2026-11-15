import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Activity, BookOpen, RotateCcw, HelpCircle } from 'lucide-react';
import { PaperCard, Tag, Button } from '../../../components/ui';
import { resolveCssVar } from '../../../components/ui/subjectUtils';
import LearnLabShell from '../LearnLabShell';
import LabPracticeQuiz from '../LabPracticeQuiz';

const QUIZ_DATA = {
  q1: {
    question: 'In Quadrant III (180° to 270°), which trigonometric ratio is positive?',
    options: ['sin θ and csc θ', 'cos θ and sec θ', 'tan θ and cot θ', 'All ratios are positive'],
    correct: 2,
    explanation:
      'According to the ASTC rule (Add Sugar To Coffee), Quadrant III is the "T" quadrant where tan θ and its reciprocal cot θ are positive; sin and cos are negative.',
  },
  q2: {
    question:
      'Which of the following fundamental identities is derived directly from the Pythagorean theorem on the unit circle (x² + y² = 1)?',
    options: ['sin²θ - cos²θ = 1', 'sin²θ + cos²θ = 1', 'tan²θ - 1 = sec²θ', 'sin(2θ) = 2 sin θ'],
    correct: 1,
    explanation:
      'Since x = cos θ and y = sin θ on the unit circle of radius 1, x² + y² = 1 directly gives cos²θ + sin²θ = 1.',
  },
  q3: {
    question: 'For the sinusoidal wave y = 3 sin(2x - π) + 1, what is its amplitude and period?',
    options: [
      'Amplitude = 3, Period = π',
      'Amplitude = 1, Period = 2π',
      'Amplitude = 3, Period = 2π',
      'Amplitude = 2, Period = π/2',
    ],
    correct: 0,
    explanation: 'Amplitude is |A| = 3. Period is T = 2π / |B| = 2π / 2 = π.',
  },
};

export default function TrigonometryLabPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('circle');
  const [angleDeg, setAngleDeg] = useState(45);
  const [showTangentLine, setShowTangentLine] = useState(true);
  const circleCanvasRef = useRef(null);

  const [ampA, setAmpA] = useState(1.5);
  const [freqB, setFreqB] = useState(1.0);
  const [phaseC, setPhaseC] = useState(0.0);
  const [vertD, setVertD] = useState(0.0);
  const waveCanvasRef = useRef(null);

  const rad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.abs(cosVal) > 0.0001 ? Math.tan(rad) : sinVal > 0 ? Infinity : -Infinity;
  const cscVal = Math.abs(sinVal) > 0.0001 ? 1 / sinVal : sinVal >= 0 ? Infinity : -Infinity;
  const secVal = Math.abs(cosVal) > 0.0001 ? 1 / cosVal : cosVal >= 0 ? Infinity : -Infinity;
  const cotVal = Math.abs(sinVal) > 0.0001 ? cosVal / sinVal : Infinity;

  const getRadianString = (deg) => {
    const map = {
      0: '0 rad', 30: 'π / 6 rad', 45: 'π / 4 rad', 60: 'π / 3 rad', 90: 'π / 2 rad',
      120: '2π / 3 rad', 135: '3π / 4 rad', 150: '5π / 6 rad', 180: 'π rad',
      210: '7π / 6 rad', 225: '5π / 4 rad', 240: '4π / 3 rad', 270: '3π / 2 rad',
      300: '5π / 3 rad', 315: '7π / 4 rad', 330: '11π / 6 rad', 360: '2π rad',
    };
    return map[deg] || `${((deg * Math.PI) / 180).toFixed(2)} rad`;
  };

  const getQuadrant = (deg) => {
    const d = deg % 360;
    if (d >= 0 && d < 90) return { q: 'I', label: 'Quadrant I (All positive: ASTC: A)', token: 'var(--physics)' };
    if (d >= 90 && d < 180) return { q: 'II', label: 'Quadrant II (Sin / Csc positive: ASTC: S)', token: 'var(--maths)' };
    if (d >= 180 && d < 270) return { q: 'III', label: 'Quadrant III (Tan / Cot positive: ASTC: T)', token: 'var(--biology)' };
    return { q: 'IV', label: 'Quadrant IV (Cos / Sec positive: ASTC: C)', token: 'var(--red-600)' };
  };

  const currentQuad = getQuadrant(angleDeg);

  useEffect(() => {
    const canvas = circleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const gridColor = resolveCssVar('--paper-edge') || 'CanvasText';
    const axisColor = resolveCssVar('--ink-soft') || 'CanvasText';
    const inkMuted = resolveCssVar('--ink-muted') || 'CanvasText';
    const inkColor = resolveCssVar('--ink') || 'CanvasText';
    const white = resolveCssVar('--white') || 'Canvas';
    const physicsColor = resolveCssVar('--physics') || 'CanvasText';
    const mathsColor = resolveCssVar('--maths') || 'CanvasText';
    const bioColor = resolveCssVar('--biology') || 'CanvasText';
    const chemColor = resolveCssVar('--chemistry') || 'CanvasText';

    const cx = width / 2;
    const cy = height / 2;
    const R = 115;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(15, cy);
    ctx.lineTo(width - 15, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 15);
    ctx.lineTo(cx, height - 15);
    ctx.stroke();

    ctx.fillStyle = inkMuted;
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('+X (cos θ)', width - 65, cy - 8);
    ctx.fillText('+Y (sin θ)', cx + 8, 25);
    ctx.fillText('-1', cx - R - 15, cy + 15);
    ctx.fillText('+1', cx + R - 5, cy + 15);

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = physicsColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const px = cx + R * Math.cos(rad);
    const py = cy - R * Math.sin(rad);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 32, 0, -rad, true);
    ctx.closePath();
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = mathsColor;
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = mathsColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, cy);
    ctx.strokeStyle = physicsColor;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(px, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = bioColor;
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = mathsColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    if (showTangentLine && Math.abs(cosVal) > 0.05) {
      const tanY = cy - R * Math.tan(rad);
      if (tanY >= -height && tanY <= height * 2) {
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.moveTo(cx + R, cy);
        ctx.lineTo(cx + R, tanY);
        ctx.strokeStyle = chemColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    ctx.beginPath();
    ctx.arc(px, py, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = mathsColor;
    ctx.fill();
    ctx.strokeStyle = white;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = inkColor;
    ctx.font = 'bold 11px system-ui, sans-serif';
    const offsetX = cosVal >= 0 ? 12 : -75;
    const offsetY = sinVal >= 0 ? -12 : 20;
    ctx.fillText(`P(${cosVal.toFixed(2)}, ${sinVal.toFixed(2)})`, px + offsetX, py + offsetY);
  }, [angleDeg, rad, cosVal, sinVal, showTangentLine, activeTab]);

  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const gridColor = resolveCssVar('--paper-edge') || 'CanvasText';
    const axisColor = resolveCssVar('--ink-soft') || 'CanvasText';
    const inkMuted = resolveCssVar('--ink-muted') || 'CanvasText';
    const mathsColor = resolveCssVar('--maths') || 'CanvasText';
    const amberColor = resolveCssVar('--amber-500') || 'CanvasText';

    const cx = width / 2;
    const cy = height / 2;
    const scaleX = 35;
    const scaleY = 32;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += scaleX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += scaleY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    ctx.fillStyle = inkMuted;
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('0', cx + 4, cy + 12);
    ctx.fillText('π', cx + scaleX * Math.PI - 5, cy + 14);
    ctx.fillText('2π', cx + scaleX * 2 * Math.PI - 8, cy + 14);
    ctx.fillText('-π', cx - scaleX * Math.PI - 8, cy + 14);
    ctx.fillText('+2', cx + 6, cy - scaleY * 2 + 4);
    ctx.fillText('-2', cx + 6, cy + scaleY * 2 + 4);

    ctx.beginPath();
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    for (let px = 0; px < width; px++) {
      const xVal = (px - cx) / scaleX;
      const yVal = Math.sin(xVal);
      const py = cy - yVal * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.strokeStyle = mathsColor;
    ctx.lineWidth = 3;
    for (let px = 0; px < width; px++) {
      const xVal = (px - cx) / scaleX;
      const yVal = ampA * Math.sin(freqB * xVal + phaseC) + vertD;
      const py = cy - yVal * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    if (Math.abs(vertD) > 0.05) {
      ctx.beginPath();
      ctx.strokeStyle = amberColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      const midY = cy - vertD * scaleY;
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [ampA, freqB, phaseC, vertD, activeTab]);

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: 'mathematics',
        prefill:
          'Can you explain the ASTC quadrant rule and show step-by-step proofs of the 3 fundamental Pythagorean identities (sin²θ+cos²θ=1, 1+tan²θ=sec²θ, 1+cot²θ=csc²θ)?',
      },
    });
  };

  return (
    <LearnLabShell
      subject="maths"
      backTo="/learn/mathematics"
      backLabel="Back to Mathematics"
      hubTitle="Mathematics Learning Hub"
      hubSubtitle="Trigonometry & Conic Sections Interactive Labs"
      badgeIcon={Compass}
      badgeLabel="Mathematics • Class 10 & 11"
      subBadgeLabel="CBSE Chapter 8 & 3 • Native Lab"
      title="Trigonometry Interactive Lab"
      description="Explore the trigonometric unit circle, connect terminal angle coordinates (x, y) = (cos θ, sin θ) to right-triangle ratios, master the ASTC quadrant rule, and dynamically visualize sinusoidal waves."
      askLabel="Ask Chotu about Trigonometry"
      onAskSaarthi={askSaarthi}
      tabs={[
        { id: 'circle', label: 'Unit Circle & ASTC', icon: Compass },
        { id: 'wave', label: 'Sinusoidal Wave Explorer', icon: Activity },
        { id: 'identities', label: 'Fundamental Identities', icon: BookOpen },
        { id: 'quiz', label: 'Practice Check', icon: HelpCircle },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'circle' && (
        <div className="paper-grid paper-grid--2" style={{ alignItems: 'start' }}>
          <PaperCard flat>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
              <h2 className="type-h3" style={{ margin: 0 }}>Unit Circle Canvas (r = 1)</h2>
              <Tag variant="paper">
                <span style={{ color: currentQuad.token }}>{currentQuad.q}: {currentQuad.label.split(':')[0]}</span>
              </Tag>
            </div>

            <div style={{ background: 'var(--white)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)', padding: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
              <canvas
                ref={circleCanvasRef}
                width={360}
                height={320}
                style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="type-small" style={{ fontWeight: 700 }}>Angle θ</span>
                <span className="type-mono" style={{ color: 'var(--maths-ink)', fontWeight: 700 }}>
                  {angleDeg}° &nbsp;|&nbsp; {getRadianString(angleDeg)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Angle in degrees"
                min="0"
                max="360"
                step="1"
                value={angleDeg}
                onChange={(e) => setAngleDeg(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--maths)' }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--sp-3)' }}>
              {[0, 30, 45, 60, 90, 120, 135, 180, 270, 360].map((deg) => (
                <Button
                  key={deg}
                  size="sm"
                  variant={angleDeg === deg ? 'primary' : 'ghost'}
                  onClick={() => setAngleDeg(deg)}
                >
                  {deg}°
                </Button>
              ))}
            </div>

            <label className="type-small" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', color: 'var(--ink-muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showTangentLine}
                onChange={(e) => setShowTangentLine(e.target.checked)}
                style={{ accentColor: 'var(--chemistry)' }}
              />
              Show Tangent Line at x = 1 (ochre)
            </label>
          </PaperCard>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <PaperCard flat>
              <h3 className="type-h3" style={{ marginBottom: 'var(--sp-3)' }}>
                Trigonometric Values at {angleDeg}°
              </h3>
              <div className="paper-grid paper-grid--2" style={{ gap: 'var(--sp-2)' }}>
                <div style={{ padding: 'var(--sp-3)', background: 'var(--biology-soft)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                  <div className="type-eyebrow" style={{ color: 'var(--biology-ink)' }}>SINE (y)</div>
                  <div className="type-h3" style={{ color: 'var(--biology-ink)' }}>sin {angleDeg}° = {sinVal.toFixed(3)}</div>
                </div>
                <div style={{ padding: 'var(--sp-3)', background: 'var(--physics-soft)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                  <div className="type-eyebrow" style={{ color: 'var(--physics-ink)' }}>COSINE (x)</div>
                  <div className="type-h3" style={{ color: 'var(--physics-ink)' }}>cos {angleDeg}° = {cosVal.toFixed(3)}</div>
                </div>
                <div style={{ padding: 'var(--sp-3)', background: 'var(--chemistry-soft)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                  <div className="type-eyebrow" style={{ color: 'var(--chemistry-ink)' }}>TANGENT (sin/cos)</div>
                  <div className="type-h3" style={{ color: 'var(--chemistry-ink)' }}>
                    tan = {Math.abs(tanVal) > 100 ? (tanVal > 0 ? '+Undef' : '-Undef') : tanVal.toFixed(3)}
                  </div>
                </div>
                <div style={{ padding: 'var(--sp-3)', background: 'var(--maths-soft)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                  <div className="type-eyebrow" style={{ color: 'var(--maths-ink)' }}>COSECANT (1/sin)</div>
                  <div className="type-h3" style={{ color: 'var(--maths-ink)' }}>
                    csc = {Math.abs(cscVal) > 100 ? 'Undef' : cscVal.toFixed(3)}
                  </div>
                </div>
                <div style={{ padding: 'var(--sp-3)', background: 'var(--paper-warm)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                  <div className="type-eyebrow" style={{ color: 'var(--ink-muted)' }}>SECANT (1/cos)</div>
                  <div className="type-h3">
                    sec = {Math.abs(secVal) > 100 ? 'Undef' : secVal.toFixed(3)}
                  </div>
                </div>
                <div style={{ padding: 'var(--sp-3)', background: 'var(--paper-warm)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                  <div className="type-eyebrow" style={{ color: 'var(--ink-muted)' }}>COTANGENT (cos/sin)</div>
                  <div className="type-h3">
                    cot = {Math.abs(cotVal) > 100 ? 'Undef' : cotVal.toFixed(3)}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'var(--sp-3)', padding: 'var(--sp-3)', background: 'var(--maths-soft)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                <div className="type-small" style={{ fontWeight: 700, color: 'var(--maths-ink)', marginBottom: '2px' }}>
                  Pythagorean Identity Verification
                </div>
                <div className="type-mono" style={{ fontSize: '0.82rem', color: 'var(--ink)' }}>
                  sin²({angleDeg}°) + cos²({angleDeg}°) = ({sinVal.toFixed(3)})² + ({cosVal.toFixed(3)})² = {(Math.pow(sinVal, 2) + Math.pow(cosVal, 2)).toFixed(3)} ≈ 1.000
                </div>
              </div>
            </PaperCard>

            <PaperCard flat>
              <h3 className="type-h3" style={{ marginBottom: 'var(--sp-2)' }}>
                The ASTC Quadrant Rule ("Add Sugar To Coffee")
              </h3>
              <p className="type-small" style={{ color: 'var(--ink-muted)', marginBottom: 'var(--sp-3)' }}>
                Angles beyond 90° retain reference acute values with signs determined by quadrant:
              </p>
              <div className="paper-grid paper-grid--2" style={{ gap: 'var(--sp-2)' }}>
                <div style={{ padding: 'var(--sp-2) var(--sp-3)', background: 'var(--physics-soft)', borderRadius: 'var(--r-sm)', borderLeft: '4px solid var(--physics)' }}>
                  <strong className="type-small">Q1 (0°–90°): ALL</strong>
                  <div className="type-small" style={{ color: 'var(--physics-ink)' }}>All functions (+)</div>
                </div>
                <div style={{ padding: 'var(--sp-2) var(--sp-3)', background: 'var(--maths-soft)', borderRadius: 'var(--r-sm)', borderLeft: '4px solid var(--maths)' }}>
                  <strong className="type-small">Q2 (90°–180°): SIN</strong>
                  <div className="type-small" style={{ color: 'var(--maths-ink)' }}>sin &amp; csc (+)</div>
                </div>
                <div style={{ padding: 'var(--sp-2) var(--sp-3)', background: 'var(--biology-soft)', borderRadius: 'var(--r-sm)', borderLeft: '4px solid var(--biology)' }}>
                  <strong className="type-small">Q3 (180°–270°): TAN</strong>
                  <div className="type-small" style={{ color: 'var(--biology-ink)' }}>tan &amp; cot (+)</div>
                </div>
                <div style={{ padding: 'var(--sp-2) var(--sp-3)', background: 'var(--red-soft)', borderRadius: 'var(--r-sm)', borderLeft: '4px solid var(--red-600)' }}>
                  <strong className="type-small">Q4 (270°–360°): COS</strong>
                  <div className="type-small" style={{ color: 'var(--red-ink)' }}>cos &amp; sec (+)</div>
                </div>
              </div>
            </PaperCard>
          </div>
        </div>
      )}

      {activeTab === 'wave' && (
        <PaperCard flat>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
            <div>
              <h2 className="type-h3" style={{ margin: '0 0 4px 0' }}>Sinusoidal Wave Transformation Lab</h2>
              <div className="type-mono" style={{ color: 'var(--maths-ink)', fontWeight: 700 }}>
                y = {ampA} · sin({freqB}x {phaseC >= 0 ? `+ ${phaseC.toFixed(1)}` : `- ${Math.abs(phaseC).toFixed(1)}`}) {vertD >= 0 ? `+ ${vertD.toFixed(1)}` : `- ${Math.abs(vertD).toFixed(1)}`}
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setAmpA(1);
                setFreqB(1);
                setPhaseC(0);
                setVertD(0);
              }}
            >
              <RotateCcw size={14} /> Reset to sin(x)
            </Button>
          </div>

          <div style={{ background: 'var(--white)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)', padding: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
            <canvas ref={waveCanvasRef} width={860} height={260} style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-2)', color: 'var(--ink-muted)', marginTop: 'var(--sp-2)' }}>
              <span>Dashed slate line: Standard y = sin(x)</span>
              <span>Solid blue-ink curve: Transformed wave</span>
            </div>
          </div>

          <div className="paper-grid paper-grid--4">
            <div style={{ padding: 'var(--sp-3)', background: 'var(--paper-warm)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
              <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '6px' }}>
                <span>Amplitude (A)</span>
                <span style={{ color: 'var(--maths-ink)' }}>{ampA.toFixed(1)}</span>
              </div>
              <input type="range" aria-label="Amplitude A" min="-3" max="3" step="0.1" value={ampA} onChange={(e) => setAmpA(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--maths)' }} />
              <div className="type-small" style={{ color: 'var(--ink-muted)', marginTop: '4px' }}>Peak height = |A|</div>
            </div>

            <div style={{ padding: 'var(--sp-3)', background: 'var(--paper-warm)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
              <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '6px' }}>
                <span>Frequency (B)</span>
                <span style={{ color: 'var(--maths-ink)' }}>{freqB.toFixed(1)}</span>
              </div>
              <input type="range" aria-label="Frequency B" min="0.5" max="4" step="0.1" value={freqB} onChange={(e) => setFreqB(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--maths)' }} />
              <div className="type-small" style={{ color: 'var(--ink-muted)', marginTop: '4px' }}>Period T = {((2 * Math.PI) / freqB).toFixed(2)} rad</div>
            </div>

            <div style={{ padding: 'var(--sp-3)', background: 'var(--paper-warm)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
              <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '6px' }}>
                <span>Phase Shift (C)</span>
                <span style={{ color: 'var(--maths-ink)' }}>{phaseC.toFixed(1)}</span>
              </div>
              <input type="range" aria-label="Phase Shift C" min="-3.14" max="3.14" step="0.1" value={phaseC} onChange={(e) => setPhaseC(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--maths)' }} />
              <div className="type-small" style={{ color: 'var(--ink-muted)', marginTop: '4px' }}>Horizontal shift = -C/B</div>
            </div>

            <div style={{ padding: 'var(--sp-3)', background: 'var(--paper-warm)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
              <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '6px' }}>
                <span>Vertical Shift (D)</span>
                <span style={{ color: 'var(--maths-ink)' }}>{vertD.toFixed(1)}</span>
              </div>
              <input type="range" aria-label="Vertical Shift D" min="-2" max="2" step="0.1" value={vertD} onChange={(e) => setVertD(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--maths)' }} />
              <div className="type-small" style={{ color: 'var(--ink-muted)', marginTop: '4px' }}>Equilibrium line y = D</div>
            </div>
          </div>
        </PaperCard>
      )}

      {activeTab === 'identities' && (
        <PaperCard flat>
          <h2 className="type-h2" style={{ marginBottom: 'var(--sp-4)' }}>
            CBSE Class 10 &amp; 11 Fundamental Trigonometric Identities
          </h2>
          <div className="paper-grid paper-grid--3" style={{ marginBottom: 'var(--sp-5)' }}>
            <div style={{ padding: 'var(--sp-4)', background: 'var(--maths-soft)', borderRadius: 'var(--r-md)', border: '1px solid var(--paper-edge)' }}>
              <div className="type-eyebrow" style={{ color: 'var(--maths-ink)' }}>Identity 1</div>
              <div className="type-h2" style={{ margin: 'var(--sp-2) 0' }}>sin²θ + cos²θ = 1</div>
              <p className="type-small" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                Valid for all real θ.
                <br />• sin²θ = 1 - cos²θ
                <br />• cos²θ = 1 - sin²θ
              </p>
            </div>
            <div style={{ padding: 'var(--sp-4)', background: 'var(--biology-soft)', borderRadius: 'var(--r-md)', border: '1px solid var(--paper-edge)' }}>
              <div className="type-eyebrow" style={{ color: 'var(--biology-ink)' }}>Identity 2</div>
              <div className="type-h2" style={{ margin: 'var(--sp-2) 0' }}>1 + tan²θ = sec²θ</div>
              <p className="type-small" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                Valid for θ ≠ (2n+1)π/2.
                <br />• sec²θ - tan²θ = 1
                <br />• tan²θ = sec²θ - 1
              </p>
            </div>
            <div style={{ padding: 'var(--sp-4)', background: 'var(--chemistry-soft)', borderRadius: 'var(--r-md)', border: '1px solid var(--paper-edge)' }}>
              <div className="type-eyebrow" style={{ color: 'var(--chemistry-ink)' }}>Identity 3</div>
              <div className="type-h2" style={{ margin: 'var(--sp-2) 0' }}>1 + cot²θ = csc²θ</div>
              <p className="type-small" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                Valid for θ ≠ nπ.
                <br />• csc²θ - cot²θ = 1
                <br />• cot²θ = csc²θ - 1
              </p>
            </div>
          </div>

          <h3 className="type-h3" style={{ marginBottom: 'var(--sp-3)' }}>Standard Angle Reference Table</h3>
          <div className="paper-table-wrap">
            <table className="paper-table" style={{ textAlign: 'center' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Ratio</th>
                  <th>0° (0)</th>
                  <th>30° (π/6)</th>
                  <th>45° (π/4)</th>
                  <th>60° (π/3)</th>
                  <th>90° (π/2)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'left', fontWeight: 700, color: 'var(--biology-ink)' }}>sin θ</td>
                  <td>0</td><td>1/2</td><td>1/√2</td><td>√3/2</td><td>1</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'left', fontWeight: 700, color: 'var(--physics-ink)' }}>cos θ</td>
                  <td>1</td><td>√3/2</td><td>1/√2</td><td>1/2</td><td>0</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'left', fontWeight: 700, color: 'var(--chemistry-ink)' }}>tan θ</td>
                  <td>0</td><td>1/√3</td><td>1</td><td>√3</td>
                  <td style={{ color: 'var(--red-600)', fontWeight: 600 }}>Undefined</td>
                </tr>
              </tbody>
            </table>
          </div>
        </PaperCard>
      )}

      {activeTab === 'quiz' && <LabPracticeQuiz quizData={QUIZ_DATA} />}
    </LearnLabShell>
  );
}
