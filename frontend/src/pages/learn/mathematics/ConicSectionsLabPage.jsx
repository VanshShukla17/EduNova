import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Circle, Layers, Sliders, BookOpen, HelpCircle } from 'lucide-react';
import ConicSectionsSimulation from '../../../features/virtual-learning/ConicSectionsSimulation';
import { PaperCard, Button } from '../../../components/ui';
import { resolveCssVar } from '../../../components/ui/subjectUtils';
import LearnLabShell from '../LearnLabShell';
import LabPracticeQuiz from '../LabPracticeQuiz';

const QUIZ_DATA = {
  q1: {
    question: 'What is the eccentricity (e) of a parabola in standard conic section geometry?',
    options: ['e = 0', '0 < e < 1', 'e = 1', 'e > 1'],
    correct: 2,
    explanation:
      'A parabola is defined as the locus of points equidistant from the focus and directrix, giving an eccentricity e = 1 exactly.',
  },
  q2: {
    question:
      'When a right circular cone is cut by a plane parallel to one of its generating lines (β = α), which conic section is generated?',
    options: ['Ellipse', 'Circle', 'Parabola', 'Hyperbola'],
    correct: 2,
    explanation:
      'When the cutting plane angle β equals the semi-vertical angle α of the cone, the cross-section produces a Parabola.',
  },
  q3: {
    question:
      'For the ellipse x²/25 + y²/16 = 1, what are the coordinates of its foci and its eccentricity?',
    options: [
      'Foci (±3, 0), e = 0.6',
      'Foci (0, ±3), e = 0.8',
      'Foci (±9, 0), e = 0.5',
      'Foci (±4, 0), e = 0.75',
    ],
    correct: 0,
    explanation:
      'Here a² = 25 (a = 5) and b² = 16 (b = 4). Then c = √(a² - b²) = √(25 - 16) = 3. Foci are (±3, 0) and eccentricity e = c/a = 3/5 = 0.6.',
  },
};

export default function ConicSectionsLabPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('3d-cone');
  const [selectedConic, setSelectedConic] = useState('circle');

  const [circleH, setCircleH] = useState(0);
  const [circleK, setCircleK] = useState(0);
  const [circleR, setCircleR] = useState(3);

  const [parabolaOrientation, setParabolaOrientation] = useState('horizontal');
  const [parabolaA, setParabolaA] = useState(2);

  const [ellipseA, setEllipseA] = useState(4);
  const [ellipseB, setEllipseB] = useState(2.5);

  const [hyperbolaA, setHyperbolaA] = useState(3);
  const [hyperbolaB, setHyperbolaB] = useState(2);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeTab !== '2d-grapher') return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const gridColor = resolveCssVar('--paper-edge') || 'CanvasText';
    const axisColor = resolveCssVar('--ink-soft') || 'CanvasText';
    const inkMuted = resolveCssVar('--ink-muted') || 'CanvasText';
    const physicsColor = resolveCssVar('--physics') || 'CanvasText';
    const mathsColor = resolveCssVar('--maths') || 'CanvasText';
    const chemColor = resolveCssVar('--chemistry') || 'CanvasText';
    const bioColor = resolveCssVar('--biology') || 'CanvasText';
    const redColor = resolveCssVar('--red-600') || 'CanvasText';
    const redInk = resolveCssVar('--red-ink') || 'CanvasText';

    const cx = width / 2;
    const cy = height / 2;
    const scale = 25;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += scale) {
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
    ctx.fillText('+5', cx + 5 * scale - 6, cy + 14);
    ctx.fillText('-5', cx - 5 * scale - 6, cy + 14);
    ctx.fillText('+5', cx + 6, cy - 5 * scale + 4);
    ctx.fillText('-5', cx + 6, cy + 5 * scale + 4);

    if (selectedConic === 'circle') {
      const centerPx = cx + circleH * scale;
      const centerPy = cy - circleK * scale;
      const radiusPx = circleR * scale;

      ctx.beginPath();
      ctx.arc(centerPx, centerPy, radiusPx, 0, Math.PI * 2);
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = physicsColor;
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = physicsColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerPx, centerPy, 4, 0, Math.PI * 2);
      ctx.fillStyle = physicsColor;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(centerPx, centerPy);
      ctx.lineTo(centerPx + radiusPx, centerPy);
      ctx.strokeStyle = chemColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = chemColor;
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText(`r = ${circleR}`, centerPx + radiusPx / 2 - 10, centerPy - 6);
      ctx.fillText(`C(${circleH}, ${circleK})`, centerPx + 8, centerPy - 8);
    } else if (selectedConic === 'parabola') {
      const a = parabolaA;
      ctx.strokeStyle = chemColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      if (parabolaOrientation === 'horizontal') {
        for (let py = 0; py <= height; py += 2) {
          const y = (cy - py) / scale;
          const x = (y * y) / (4 * a);
          const px = cx + x * scale;
          if (py === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const fx = cx + a * scale;
        ctx.beginPath();
        ctx.arc(fx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = redColor;
        ctx.fill();
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText(`Focus (${a}, 0)`, fx + 6, cy - 6);

        const dx = cx - a * scale;
        ctx.beginPath();
        ctx.strokeStyle = mathsColor;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(dx, 0);
        ctx.lineTo(dx, height);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = mathsColor;
        ctx.fillText(`Directrix: x = -${a}`, dx + 6, 20);
      } else {
        for (let px = 0; px <= width; px += 2) {
          const x = (px - cx) / scale;
          const y = (x * x) / (4 * a);
          const py = cy - y * scale;
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const fy = cy - a * scale;
        ctx.beginPath();
        ctx.arc(cx, fy, 4, 0, Math.PI * 2);
        ctx.fillStyle = redColor;
        ctx.fill();
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText(`Focus (0, ${a})`, cx + 8, fy - 6);

        const dy = cy + a * scale;
        ctx.beginPath();
        ctx.strokeStyle = mathsColor;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(0, dy);
        ctx.lineTo(width, dy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = mathsColor;
        ctx.fillText(`Directrix: y = -${a}`, 20, dy - 6);
      }
    } else if (selectedConic === 'ellipse') {
      const a = ellipseA;
      const b = ellipseB;
      const c = Math.sqrt(Math.max(0, a * a - b * b));

      ctx.beginPath();
      ctx.ellipse(cx, cy, a * scale, b * scale, 0, 0, Math.PI * 2);
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = bioColor;
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = bioColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const f1x = cx + c * scale;
      const f2x = cx - c * scale;
      ctx.beginPath();
      ctx.arc(f1x, cy, 4, 0, Math.PI * 2);
      ctx.arc(f2x, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = bioColor;
      ctx.fill();

      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillText(`F₁(-${c.toFixed(2)}, 0)`, f2x - 40, cy - 8);
      ctx.fillText(`F₂(${c.toFixed(2)}, 0)`, f1x + 8, cy - 8);

      ctx.fillStyle = inkMuted;
      ctx.fillText(`A'(-${a}, 0)`, cx - a * scale - 40, cy + 14);
      ctx.fillText(`A(${a}, 0)`, cx + a * scale + 6, cy + 14);
      ctx.fillText(`B(0, ${b})`, cx + 6, cy - b * scale - 6);
      ctx.fillText(`B'(0, -${b})`, cx + 6, cy + b * scale + 14);
    } else if (selectedConic === 'hyperbola') {
      const a = hyperbolaA;
      const b = hyperbolaB;
      const c = Math.sqrt(a * a + b * b);

      ctx.beginPath();
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      const slope = b / a;
      ctx.moveTo(0, cy - (-cx / scale) * slope * scale);
      ctx.lineTo(width, cy - ((width - cx) / scale) * slope * scale);
      ctx.moveTo(0, cy - (-cx / scale) * (-slope) * scale);
      ctx.lineTo(width, cy - ((width - cx) / scale) * (-slope) * scale);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = redColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let py = 0; py <= height; py += 2) {
        const y = (cy - py) / scale;
        const x = Math.sqrt(a * a * (1 + (y * y) / (b * b)));
        const px = cx + x * scale;
        if (py === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.beginPath();
      for (let py = 0; py <= height; py += 2) {
        const y = (cy - py) / scale;
        const x = -Math.sqrt(a * a * (1 + (y * y) / (b * b)));
        const px = cx + x * scale;
        if (py === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const f1x = cx + c * scale;
      const f2x = cx - c * scale;
      ctx.beginPath();
      ctx.arc(f1x, cy, 4, 0, Math.PI * 2);
      ctx.arc(f2x, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = redInk;
      ctx.fill();

      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillText(`F₁(-${c.toFixed(2)}, 0)`, f2x - 40, cy - 8);
      ctx.fillText(`F₂(${c.toFixed(2)}, 0)`, f1x + 8, cy - 8);
    }
  }, [
    activeTab,
    selectedConic,
    circleH,
    circleK,
    circleR,
    parabolaOrientation,
    parabolaA,
    ellipseA,
    ellipseB,
    hyperbolaA,
    hyperbolaB,
  ]);

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: 'mathematics',
        prefill:
          'Can you explain how a plane cutting a double circular cone produces Circle, Parabola, Ellipse, and Hyperbola, and detail the formulas for their eccentricity, directrix, and latus rectum?',
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
      badgeIcon={Circle}
      badgeLabel="Mathematics • Class 11"
      subBadgeLabel="CBSE Chapter 11 • 3D + 2D Lab"
      title="Conic Sections Interactive Lab"
      description="Witness how the intersection of an inclined plane with a 3D double circular cone generates Circle, Ellipse, Parabola, and Hyperbola. Experiment dynamically with focal parameters, axes, and eccentricity."
      askLabel="Ask Chotu about Conics"
      onAskSaarthi={askSaarthi}
      tabs={[
        { id: '3d-cone', label: '3D Double Cone Slicing', icon: Layers },
        { id: '2d-grapher', label: '2D Cartesian Grapher', icon: Sliders },
        { id: 'formulas', label: 'CBSE Standard Equations', icon: BookOpen },
        { id: 'quiz', label: 'Practice Check', icon: HelpCircle },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === '3d-cone' && (
        <PaperCard flat>
          <div style={{ marginBottom: 'var(--sp-3)' }}>
            <h2 className="type-h3" style={{ margin: '0 0 4px 0' }}>
              3D Double Cone &amp; Cutting Plane Section
            </h2>
            <p className="type-small" style={{ color: 'var(--ink-muted)', margin: 0 }}>
              Drag the plane angle slider to rotate the intersecting plane relative to the cone axis.
            </p>
          </div>
          <ConicSectionsSimulation />
        </PaperCard>
      )}

      {activeTab === '2d-grapher' && (
        <div className="paper-grid paper-grid--2" style={{ alignItems: 'start' }}>
          <PaperCard flat>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', marginBottom: 'var(--sp-3)' }}>
              {[
                { id: 'circle', label: 'Circle' },
                { id: 'parabola', label: 'Parabola' },
                { id: 'ellipse', label: 'Ellipse' },
                { id: 'hyperbola', label: 'Hyperbola' },
              ].map((c) => (
                <Button
                  key={c.id}
                  size="sm"
                  variant={selectedConic === c.id ? 'primary' : 'ghost'}
                  onClick={() => setSelectedConic(c.id)}
                  style={{ flex: 1 }}
                >
                  {c.label}
                </Button>
              ))}
            </div>

            <div style={{ background: 'var(--white)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)', padding: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
              <canvas ref={canvasRef} width={480} height={340} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>

            <div className="type-small" style={{ color: 'var(--ink-muted)', textAlign: 'center' }}>
              Scale: 1 grid unit = 1 Cartesian coordinate unit
            </div>
          </PaperCard>

          <PaperCard flat>
            {selectedConic === 'circle' && (
              <div>
                <h3 className="type-h3" style={{ color: 'var(--physics-ink)', marginBottom: 'var(--sp-2)' }}>
                  Circle: (x - h)² + (y - k)² = r²
                </h3>
                <div className="type-mono" style={{ background: 'var(--physics-soft)', color: 'var(--physics-ink)', padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--r-sm)', marginBottom: 'var(--sp-4)' }}>
                  (x {circleH >= 0 ? `- ${circleH}` : `+ ${Math.abs(circleH)}`})² + (y {circleK >= 0 ? `- ${circleK}` : `+ ${Math.abs(circleK)}`})² = {(circleR * circleR).toFixed(1)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  <div>
                    <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Radius (r)</span><span>{circleR} units</span>
                    </div>
                    <input type="range" aria-label="Circle radius" min="1" max="6" step="0.5" value={circleR} onChange={(e) => setCircleR(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--physics)' }} />
                  </div>
                  <div>
                    <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Center X (h)</span><span>{circleH}</span>
                    </div>
                    <input type="range" aria-label="Circle center X" min="-4" max="4" step="0.5" value={circleH} onChange={(e) => setCircleH(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--physics)' }} />
                  </div>
                  <div>
                    <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Center Y (k)</span><span>{circleK}</span>
                    </div>
                    <input type="range" aria-label="Circle center Y" min="-4" max="4" step="0.5" value={circleK} onChange={(e) => setCircleK(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--physics)' }} />
                  </div>
                </div>

                <div className="type-small" style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-3)', background: 'var(--paper-warm)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                  <strong>Properties:</strong> Eccentricity e = 0. Diameter = {circleR * 2} units. Area = {(Math.PI * circleR * circleR).toFixed(1)} sq units.
                </div>
              </div>
            )}

            {selectedConic === 'parabola' && (
              <div>
                <h3 className="type-h3" style={{ color: 'var(--chemistry-ink)', marginBottom: 'var(--sp-2)' }}>
                  Parabola: {parabolaOrientation === 'horizontal' ? 'y² = 4ax' : 'x² = 4ay'}
                </h3>
                <div className="type-mono" style={{ background: 'var(--chemistry-soft)', color: 'var(--chemistry-ink)', padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--r-sm)', marginBottom: 'var(--sp-3)' }}>
                  {parabolaOrientation === 'horizontal' ? `y² = ${(4 * parabolaA).toFixed(1)}x` : `x² = ${(4 * parabolaA).toFixed(1)}y`}
                </div>

                <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                  <Button size="sm" variant={parabolaOrientation === 'horizontal' ? 'primary' : 'ghost'} onClick={() => setParabolaOrientation('horizontal')} style={{ flex: 1 }}>
                    y² = 4ax (Horizontal)
                  </Button>
                  <Button size="sm" variant={parabolaOrientation === 'vertical' ? 'primary' : 'ghost'} onClick={() => setParabolaOrientation('vertical')} style={{ flex: 1 }}>
                    x² = 4ay (Vertical)
                  </Button>
                </div>

                <div>
                  <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Focal Parameter (a)</span><span>{parabolaA} units</span>
                  </div>
                  <input type="range" aria-label="Parabola focal parameter a" min="0.5" max="4" step="0.5" value={parabolaA} onChange={(e) => setParabolaA(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--chemistry)' }} />
                </div>

                <div className="type-small" style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-3)', background: 'var(--paper-warm)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)', display: 'grid', gap: '4px' }}>
                  <div><strong>Focus:</strong> {parabolaOrientation === 'horizontal' ? `(${parabolaA}, 0)` : `(0, ${parabolaA})`}</div>
                  <div><strong>Directrix:</strong> {parabolaOrientation === 'horizontal' ? `x = -${parabolaA}` : `y = -${parabolaA}`}</div>
                  <div><strong>Latus Rectum:</strong> 4a = {4 * parabolaA} units</div>
                  <div><strong>Eccentricity:</strong> e = 1</div>
                </div>
              </div>
            )}

            {selectedConic === 'ellipse' && (
              <div>
                <h3 className="type-h3" style={{ color: 'var(--biology-ink)', marginBottom: 'var(--sp-2)' }}>
                  Ellipse: x²/a² + y²/b² = 1
                </h3>
                <div className="type-mono" style={{ background: 'var(--biology-soft)', color: 'var(--biology-ink)', padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--r-sm)', marginBottom: 'var(--sp-4)' }}>
                  x²/{(ellipseA * ellipseA).toFixed(1)} + y²/{(ellipseB * ellipseB).toFixed(1)} = 1
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  <div>
                    <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Semi-Major Axis (a)</span><span>{ellipseA}</span>
                    </div>
                    <input
                      type="range"
                      aria-label="Ellipse semi-major axis"
                      min="2"
                      max="6"
                      step="0.5"
                      value={ellipseA}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEllipseA(val);
                        if (ellipseB >= val) setEllipseB(val - 0.5);
                      }}
                      style={{ width: '100%', accentColor: 'var(--biology)' }}
                    />
                  </div>
                  <div>
                    <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Semi-Minor Axis (b)</span><span>{ellipseB}</span>
                    </div>
                    <input type="range" aria-label="Ellipse semi-minor axis" min="1" max={ellipseA - 0.5} step="0.5" value={ellipseB} onChange={(e) => setEllipseB(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--biology)' }} />
                  </div>
                </div>

                {(() => {
                  const c = Math.sqrt(ellipseA * ellipseA - ellipseB * ellipseB);
                  const e = c / ellipseA;
                  const lr = (2 * ellipseB * ellipseB) / ellipseA;
                  return (
                    <div className="type-small" style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-3)', background: 'var(--paper-warm)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)', display: 'grid', gap: '4px' }}>
                      <div><strong>Foci:</strong> (±{c.toFixed(2)}, 0)</div>
                      <div><strong>Eccentricity (e = c/a):</strong> {e.toFixed(3)} (0 &lt; e &lt; 1)</div>
                      <div><strong>Latus Rectum (2b²/a):</strong> {lr.toFixed(2)} units</div>
                      <div><strong>Major Axis:</strong> 2a = {ellipseA * 2} | <strong>Minor:</strong> 2b = {ellipseB * 2}</div>
                    </div>
                  );
                })()}
              </div>
            )}

            {selectedConic === 'hyperbola' && (
              <div>
                <h3 className="type-h3" style={{ color: 'var(--red-ink)', marginBottom: 'var(--sp-2)' }}>
                  Hyperbola: x²/a² - y²/b² = 1
                </h3>
                <div className="type-mono" style={{ background: 'var(--red-soft)', color: 'var(--red-ink)', padding: 'var(--sp-2) var(--sp-3)', borderRadius: 'var(--r-sm)', marginBottom: 'var(--sp-4)' }}>
                  x²/{(hyperbolaA * hyperbolaA).toFixed(1)} - y²/{(hyperbolaB * hyperbolaB).toFixed(1)} = 1
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  <div>
                    <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Semi-Transverse Axis (a)</span><span>{hyperbolaA}</span>
                    </div>
                    <input type="range" aria-label="Hyperbola transverse axis" min="1.5" max="5" step="0.5" value={hyperbolaA} onChange={(e) => setHyperbolaA(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--red-600)' }} />
                  </div>
                  <div>
                    <div className="type-small" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>Semi-Conjugate Axis (b)</span><span>{hyperbolaB}</span>
                    </div>
                    <input type="range" aria-label="Hyperbola conjugate axis" min="1" max="4" step="0.5" value={hyperbolaB} onChange={(e) => setHyperbolaB(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--red-600)' }} />
                  </div>
                </div>

                {(() => {
                  const c = Math.sqrt(hyperbolaA * hyperbolaA + hyperbolaB * hyperbolaB);
                  const e = c / hyperbolaA;
                  const lr = (2 * hyperbolaB * hyperbolaB) / hyperbolaA;
                  return (
                    <div className="type-small" style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-3)', background: 'var(--paper-warm)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)', display: 'grid', gap: '4px' }}>
                      <div><strong>Foci:</strong> (±{c.toFixed(2)}, 0)</div>
                      <div><strong>Eccentricity (e = c/a):</strong> {e.toFixed(3)} (e &gt; 1)</div>
                      <div><strong>Asymptotes:</strong> y = ±({(hyperbolaB / hyperbolaA).toFixed(2)})x</div>
                      <div><strong>Latus Rectum (2b²/a):</strong> {lr.toFixed(2)} units</div>
                    </div>
                  );
                })()}
              </div>
            )}
          </PaperCard>
        </div>
      )}

      {activeTab === 'formulas' && (
        <PaperCard flat>
          <h2 className="type-h2" style={{ marginBottom: 'var(--sp-4)' }}>
            CBSE Class 11 Conic Sections Reference Summary
          </h2>
          <div className="paper-grid paper-grid--2">
            <div style={{ padding: 'var(--sp-4)', background: 'var(--physics-soft)', borderRadius: 'var(--r-md)', border: '1px solid var(--paper-edge)' }}>
              <h3 className="type-h3" style={{ color: 'var(--physics-ink)', marginBottom: 'var(--sp-2)' }}>Circle (e = 0)</h3>
              <div className="type-mono" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>(x - h)² + (y - k)² = r²</div>
              <div className="type-small" style={{ color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                • Center: (h, k)<br />• Radius: r<br />• Plane angle: β = 90°<br />• General form: x² + y² + 2gx + 2fy + c = 0
              </div>
            </div>

            <div style={{ padding: 'var(--sp-4)', background: 'var(--chemistry-soft)', borderRadius: 'var(--r-md)', border: '1px solid var(--paper-edge)' }}>
              <h3 className="type-h3" style={{ color: 'var(--chemistry-ink)', marginBottom: 'var(--sp-2)' }}>Parabola (e = 1)</h3>
              <div className="type-mono" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>y² = 4ax &nbsp;|&nbsp; x² = 4ay</div>
              <div className="type-small" style={{ color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                • Focus: (a, 0)<br />• Directrix: x = -a<br />• Latus Rectum: 4a<br />• Plane angle: β = α
              </div>
            </div>

            <div style={{ padding: 'var(--sp-4)', background: 'var(--biology-soft)', borderRadius: 'var(--r-md)', border: '1px solid var(--paper-edge)' }}>
              <h3 className="type-h3" style={{ color: 'var(--biology-ink)', marginBottom: 'var(--sp-2)' }}>Ellipse (0 &lt; e &lt; 1)</h3>
              <div className="type-mono" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>x²/a² + y²/b² = 1 (a &gt; b)</div>
              <div className="type-small" style={{ color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                • c² = a² - b²<br />• Eccentricity: e = c/a &lt; 1<br />• Foci: (±c, 0)<br />• Major Axis: 2a | Minor: 2b
              </div>
            </div>

            <div style={{ padding: 'var(--sp-4)', background: 'var(--red-soft)', borderRadius: 'var(--r-md)', border: '1px solid var(--red-border)' }}>
              <h3 className="type-h3" style={{ color: 'var(--red-ink)', marginBottom: 'var(--sp-2)' }}>Hyperbola (e &gt; 1)</h3>
              <div className="type-mono" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>x²/a² - y²/b² = 1</div>
              <div className="type-small" style={{ color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                • c² = a² + b²<br />• Eccentricity: e = c/a &gt; 1<br />• Foci: (±c, 0)<br />• Asymptotes: y = ±(b/a)x
              </div>
            </div>
          </div>
        </PaperCard>
      )}

      {activeTab === 'quiz' && <LabPracticeQuiz quizData={QUIZ_DATA} />}
    </LearnLabShell>
  );
}
