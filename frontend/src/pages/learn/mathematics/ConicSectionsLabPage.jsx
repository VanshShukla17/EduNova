import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Circle,
  Layers,
  Sliders,
  BookOpen,
  Bot,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Maximize2
} from 'lucide-react';
import ConicSectionsSimulation from '../../../features/virtual-learning/ConicSectionsSimulation';

export default function ConicSectionsLabPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('3d-cone'); // '3d-cone' | '2d-grapher' | 'formulas' | 'quiz'

  // 2D Grapher State
  const [selectedConic, setSelectedConic] = useState('circle'); // 'circle' | 'parabola' | 'ellipse' | 'hyperbola'

  // Circle parameters: (x - h)^2 + (y - k)^2 = r^2
  const [circleH, setCircleH] = useState(0);
  const [circleK, setCircleK] = useState(0);
  const [circleR, setCircleR] = useState(3);

  // Parabola parameters: y^2 = 4ax or x^2 = 4ay
  const [parabolaOrientation, setParabolaOrientation] = useState('horizontal'); // 'horizontal' (y^2=4ax) | 'vertical' (x^2=4ay)
  const [parabolaA, setParabolaA] = useState(2);

  // Ellipse parameters: x^2/a^2 + y^2/b^2 = 1
  const [ellipseA, setEllipseA] = useState(4);
  const [ellipseB, setEllipseB] = useState(2.5);

  // Hyperbola parameters: x^2/a^2 - y^2/b^2 = 1
  const [hyperbolaA, setHyperbolaA] = useState(3);
  const [hyperbolaB, setHyperbolaB] = useState(2);

  const canvasRef = useRef(null);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});

  // 2D Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeTab !== '2d-grapher') return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const scale = 25; // 25 px per mathematical unit

    // Background Grid
    ctx.strokeStyle = '#F1F5F9';
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

    // Coordinate Axes
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // Axis numbers
    ctx.fillStyle = '#64748B';
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('0', cx + 4, cy + 12);
    ctx.fillText('+5', cx + 5 * scale - 6, cy + 14);
    ctx.fillText('-5', cx - 5 * scale - 6, cy + 14);
    ctx.fillText('+5', cx + 6, cy - 5 * scale + 4);
    ctx.fillText('-5', cx + 6, cy + 5 * scale + 4);

    // Plot selected conic
    if (selectedConic === 'circle') {
      const centerPx = cx + circleH * scale;
      const centerPy = cy - circleK * scale;
      const radiusPx = circleR * scale;

      // Circle
      ctx.beginPath();
      ctx.arc(centerPx, centerPy, radiusPx, 0, Math.PI * 2);
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
      ctx.fill();
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(centerPx, centerPy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#1D4ED8';
      ctx.fill();

      // Radius line
      ctx.beginPath();
      ctx.moveTo(centerPx, centerPy);
      ctx.lineTo(centerPx + radiusPx, centerPy);
      ctx.strokeStyle = '#EA580C';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#EA580C';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText(`r = ${circleR}`, centerPx + radiusPx / 2 - 10, centerPy - 6);
      ctx.fillText(`C(${circleH}, ${circleK})`, centerPx + 8, centerPy - 8);
    } else if (selectedConic === 'parabola') {
      const a = parabolaA;
      ctx.strokeStyle = '#EA580C';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      if (parabolaOrientation === 'horizontal') {
        // y^2 = 4ax => x = y^2 / (4a)
        for (let py = 0; py <= height; py += 2) {
          const y = (cy - py) / scale;
          const x = (y * y) / (4 * a);
          const px = cx + x * scale;
          if (py === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Focus (a, 0)
        const fx = cx + a * scale;
        const fy = cy;
        ctx.beginPath();
        ctx.arc(fx, fy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#DC2626';
        ctx.fill();
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText(`Focus (${a}, 0)`, fx + 6, fy - 6);

        // Directrix x = -a
        const dx = cx - a * scale;
        ctx.beginPath();
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(dx, 0);
        ctx.lineTo(dx, height);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#6366F1';
        ctx.fillText(`Directrix: x = -${a}`, dx + 6, 20);
      } else {
        // x^2 = 4ay => y = x^2 / (4a)
        for (let px = 0; px <= width; px += 2) {
          const x = (px - cx) / scale;
          const y = (x * x) / (4 * a);
          const py = cy - y * scale;
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Focus (0, a)
        const fx = cx;
        const fy = cy - a * scale;
        ctx.beginPath();
        ctx.arc(fx, fy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#DC2626';
        ctx.fill();
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText(`Focus (0, ${a})`, fx + 8, fy - 6);

        // Directrix y = -a
        const dy = cy + a * scale;
        ctx.beginPath();
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(0, dy);
        ctx.lineTo(width, dy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#6366F1';
        ctx.fillText(`Directrix: y = -${a}`, 20, dy - 6);
      }
    } else if (selectedConic === 'ellipse') {
      const a = ellipseA;
      const b = ellipseB;
      const c = Math.sqrt(Math.max(0, a * a - b * b));

      // Ellipse curve
      ctx.beginPath();
      ctx.ellipse(cx, cy, a * scale, b * scale, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#16A34A';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = 'rgba(22, 163, 74, 0.08)';
      ctx.fill();
      ctx.stroke();

      // Foci at (+c, 0) and (-c, 0)
      const f1x = cx + c * scale;
      const f2x = cx - c * scale;
      ctx.beginPath();
      ctx.arc(f1x, cy, 4, 0, Math.PI * 2);
      ctx.arc(f2x, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#15803D';
      ctx.fill();

      ctx.fillStyle = '#15803D';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillText(`F₁(-${c.toFixed(2)}, 0)`, f2x - 40, cy - 8);
      ctx.fillText(`F₂(${c.toFixed(2)}, 0)`, f1x + 8, cy - 8);

      // Major and minor axes endpoints
      ctx.fillStyle = '#475569';
      ctx.fillText(`A'(-${a}, 0)`, cx - a * scale - 40, cy + 14);
      ctx.fillText(`A(${a}, 0)`, cx + a * scale + 6, cy + 14);
      ctx.fillText(`B(0, ${b})`, cx + 6, cy - b * scale - 6);
      ctx.fillText(`B'(0, -${b})`, cx + 6, cy + b * scale + 14);
    } else if (selectedConic === 'hyperbola') {
      const a = hyperbolaA;
      const b = hyperbolaB;
      const c = Math.sqrt(a * a + b * b);

      // Asymptotes: y = ±(b/a)x
      ctx.beginPath();
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      const slope = b / a;
      ctx.moveTo(0, cy - (-cx / scale) * slope * scale);
      ctx.lineTo(width, cy - ((width - cx) / scale) * slope * scale);
      ctx.moveTo(0, cy - (-cx / scale) * (-slope) * scale);
      ctx.lineTo(width, cy - ((width - cx) / scale) * (-slope) * scale);
      ctx.stroke();
      ctx.setLineDash([]);

      // Right branch: x = a * cosh(t), y = b * sinh(t)
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let py = 0; py <= height; py += 2) {
        const y = (cy - py) / scale;
        const xSquared = a * a * (1 + (y * y) / (b * b));
        const x = Math.sqrt(xSquared);
        const px = cx + x * scale;
        if (py === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Left branch
      ctx.beginPath();
      for (let py = 0; py <= height; py += 2) {
        const y = (cy - py) / scale;
        const xSquared = a * a * (1 + (y * y) / (b * b));
        const x = -Math.sqrt(xSquared);
        const px = cx + x * scale;
        if (py === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Foci
      const f1x = cx + c * scale;
      const f2x = cx - c * scale;
      ctx.beginPath();
      ctx.arc(f1x, cy, 4, 0, Math.PI * 2);
      ctx.arc(f2x, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#991B1B';
      ctx.fill();

      ctx.fillStyle = '#991B1B';
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
    hyperbolaB
  ]);

  const handleQuizAnswer = (qId, optionIdx) => {
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionIdx });
    setQuizResults({
      ...quizResults,
      [qId]: optionIdx === quizData[qId].correct
    });
  };

  const quizData = {
    q1: {
      question: 'What is the eccentricity (e) of a parabola in standard conic section geometry?',
      options: ['e = 0', '0 < e < 1', 'e = 1', 'e > 1'],
      correct: 2,
      explanation: 'A parabola is defined as the locus of points equidistant from the focus and directrix, giving an eccentricity e = 1 exactly.'
    },
    q2: {
      question: 'When a right circular cone is cut by a plane parallel to one of its generating lines (β = α), which conic section is generated?',
      options: ['Ellipse', 'Circle', 'Parabola', 'Hyperbola'],
      correct: 2,
      explanation: 'When the cutting plane angle β equals the semi-vertical angle α of the cone, the cross-section produces a Parabola.'
    },
    q3: {
      question: 'For the ellipse x²/25 + y²/16 = 1, what are the coordinates of its foci and its eccentricity?',
      options: ['Foci (±3, 0), e = 0.6', 'Foci (0, ±3), e = 0.8', 'Foci (±9, 0), e = 0.5', 'Foci (±4, 0), e = 0.75'],
      correct: 0,
      explanation: 'Here a² = 25 (a = 5) and b² = 16 (b = 4). Then c = √(a² - b²) = √(25 - 16) = √9 = 3. Foci are (±3, 0) and eccentricity e = c/a = 3/5 = 0.6.'
    }
  };

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: 'mathematics',
        prefill: 'Can you explain how a plane cutting a double circular cone produces Circle, Parabola, Ellipse, and Hyperbola, and detail the formulas for their eccentricity, directrix, and latus rectum?'
      }
    });
  };

  return (
    <div style={{ maxWidth: '940px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Breadcrumbs & Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <Link
          to="/learn/mathematics"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-primary, #2563EB)',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} /> Back to Mathematics
        </Link>

        <button
          type="button"
          onClick={askSaarthi}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#EDE9FE',
            color: '#6D28D9',
            border: '1px solid #C4B5FD',
            borderRadius: '999px',
            padding: '5px 14px',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <Bot size={15} /> Ask Saarthi about Conics
        </button>
      </div>

      {/* Header Banner */}
      <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: '#EEF2FF',
              color: '#4F46E5',
              padding: '4px 10px',
              borderRadius: '999px'
            }}
          >
            MATHEMATICS • CLASS 11
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              padding: '4px 10px',
              borderRadius: '999px'
            }}
          >
            CBSE Chapter 11
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              padding: '4px 10px',
              borderRadius: '999px'
            }}
          >
            3D + 2D Interactive Lab
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 10px 0', color: 'var(--color-text-primary, #0F172A)' }}>
          Conic Sections Interactive Lab
        </h1>
        <p style={{ color: 'var(--color-text-secondary, #475569)', fontSize: '0.96rem', lineHeight: '1.6', margin: 0 }}>
          Witness how the intersection of an inclined plane with a 3D double circular cone generates the four fundamental conics: Circle, Ellipse, Parabola, and Hyperbola. Dynamically experiment with focal parameters, axes, and eccentricity on the interactive 2D Cartesian grapher.
        </p>

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--color-border, #E2E8F0)',
            marginTop: '20px',
            paddingBottom: '2px',
            overflowX: 'auto'
          }}
        >
          {[
            { id: '3d-cone', label: '3D Double Cone Slicing', icon: Layers },
            { id: '2d-grapher', label: '2D Cartesian Grapher', icon: Sliders },
            { id: 'formulas', label: 'CBSE Standard Equations', icon: BookOpen },
            { id: 'quiz', label: 'Practice Check', icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  border: 'none',
                  background: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#4F46E5' : 'var(--color-text-secondary, #64748B)',
                  borderBottom: isSelected ? '2.5px solid #4F46E5' : '2.5px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: 3D CONE SLICING */}
      {activeTab === '3d-cone' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 4px 0', color: '#1E293B' }}>
                  3D Double Cone & Cutting Plane Section
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
                  Drag the plane angle slider to rotate the intersecting plane relative to the cone axis.
                </p>
              </div>
            </div>

            {/* Embed ConicSectionsSimulation */}
            <ConicSectionsSimulation />
          </div>
        </div>
      )}

      {/* TAB 2: 2D CARTESIAN GRAPHER */}
      {activeTab === '2d-grapher' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(280px, 0.85fr)', gap: '20px', alignItems: 'start' }}>
          {/* Left: Canvas */}
          <div className="card" style={{ padding: '20px' }}>
            {/* Conic Selector Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {[
                { id: 'circle', label: 'Circle', color: '#2563EB' },
                { id: 'parabola', label: 'Parabola', color: '#EA580C' },
                { id: 'ellipse', label: 'Ellipse', color: '#16A34A' },
                { id: 'hyperbola', label: 'Hyperbola', color: '#DC2626' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedConic(c.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: `1.5px solid ${selectedConic === c.id ? c.color : '#E2E8F0'}`,
                    backgroundColor: selectedConic === c.id ? `${c.color}15` : '#FFFFFF',
                    color: selectedConic === c.id ? c.color : '#475569',
                    fontSize: '0.84rem',
                    fontWeight: selectedConic === c.id ? '700' : '600',
                    cursor: 'pointer'
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Canvas */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '8px', marginBottom: '14px' }}>
              <canvas
                ref={canvasRef}
                width={480}
                height={340}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748B', textAlign: 'center' }}>
              Scale: 1 grid unit = 1 Cartesian coordinate unit
            </div>
          </div>

          {/* Right: Parameter Controls & Property Readouts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* CIRCLE CONTROLS */}
            {selectedConic === 'circle' && (
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 10px 0', color: '#2563EB' }}>
                  Circle: (x - h)² + (y - k)² = r²
                </h3>
                <div style={{ fontSize: '0.88rem', fontFamily: 'monospace', color: '#1E40AF', backgroundColor: '#EFF6FF', padding: '8px 12px', borderRadius: '6px', marginBottom: '16px' }}>
                  (x {circleH >= 0 ? `- ${circleH}` : `+ ${Math.abs(circleH)}`})² + (y {circleK >= 0 ? `- ${circleK}` : `+ ${Math.abs(circleK)}`})² = {(circleR * circleR).toFixed(1)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600' }}>
                      <span>Radius (r):</span>
                      <span style={{ color: '#2563EB' }}>{circleR} units</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      step="0.5"
                      value={circleR}
                      onChange={(e) => setCircleR(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#2563EB' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600' }}>
                      <span>Center X (h):</span>
                      <span style={{ color: '#2563EB' }}>{circleH}</span>
                    </div>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.5"
                      value={circleH}
                      onChange={(e) => setCircleH(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#2563EB' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600' }}>
                      <span>Center Y (k):</span>
                      <span style={{ color: '#2563EB' }}>{circleK}</span>
                    </div>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.5"
                      value={circleK}
                      onChange={(e) => setCircleK(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#2563EB' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '16px', padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>
                  <strong>Properties:</strong> Eccentricity e = 0. Diameter = {circleR * 2} units. Area = {(Math.PI * circleR * circleR).toFixed(1)} sq units.
                </div>
              </div>
            )}

            {/* PARABOLA CONTROLS */}
            {selectedConic === 'parabola' && (
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 10px 0', color: '#EA580C' }}>
                  Parabola: {parabolaOrientation === 'horizontal' ? 'y² = 4ax' : 'x² = 4ay'}
                </h3>
                <div style={{ fontSize: '0.88rem', fontFamily: 'monospace', color: '#9A3412', backgroundColor: '#FFF7ED', padding: '8px 12px', borderRadius: '6px', marginBottom: '16px' }}>
                  {parabolaOrientation === 'horizontal' ? `y² = ${(4 * parabolaA).toFixed(1)}x` : `x² = ${(4 * parabolaA).toFixed(1)}y`}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setParabolaOrientation('horizontal')}
                    style={{
                      flex: 1,
                      padding: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      borderRadius: '4px',
                      border: '1px solid #FED7AA',
                      backgroundColor: parabolaOrientation === 'horizontal' ? '#EA580C' : '#FFFFFF',
                      color: parabolaOrientation === 'horizontal' ? '#FFFFFF' : '#9A3412',
                      cursor: 'pointer'
                    }}
                  >
                    y² = 4ax (Horizontal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setParabolaOrientation('vertical')}
                    style={{
                      flex: 1,
                      padding: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      borderRadius: '4px',
                      border: '1px solid #FED7AA',
                      backgroundColor: parabolaOrientation === 'vertical' ? '#EA580C' : '#FFFFFF',
                      color: parabolaOrientation === 'vertical' ? '#FFFFFF' : '#9A3412',
                      cursor: 'pointer'
                    }}
                  >
                    x² = 4ay (Vertical)
                  </button>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600' }}>
                    <span>Focal Parameter (a):</span>
                    <span style={{ color: '#EA580C' }}>{parabolaA} units</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.5"
                    value={parabolaA}
                    onChange={(e) => setParabolaA(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#EA580C' }}
                  />
                </div>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                  <div><strong>Focus:</strong> {parabolaOrientation === 'horizontal' ? `(${parabolaA}, 0)` : `(0, ${parabolaA})`}</div>
                  <div><strong>Directrix:</strong> {parabolaOrientation === 'horizontal' ? `x = -${parabolaA}` : `y = -${parabolaA}`}</div>
                  <div><strong>Latus Rectum:</strong> 4a = {4 * parabolaA} units</div>
                  <div><strong>Eccentricity:</strong> e = 1</div>
                </div>
              </div>
            )}

            {/* ELLIPSE CONTROLS */}
            {selectedConic === 'ellipse' && (
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 10px 0', color: '#16A34A' }}>
                  Ellipse: x²/a² + y²/b² = 1
                </h3>
                <div style={{ fontSize: '0.88rem', fontFamily: 'monospace', color: '#166534', backgroundColor: '#F0FDF4', padding: '8px 12px', borderRadius: '6px', marginBottom: '16px' }}>
                  x²/{ (ellipseA * ellipseA).toFixed(1) } + y²/{ (ellipseB * ellipseB).toFixed(1) } = 1
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600' }}>
                      <span>Semi-Major Axis (a):</span>
                      <span style={{ color: '#16A34A' }}>{ellipseA}</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      step="0.5"
                      value={ellipseA}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setEllipseA(val);
                        if (ellipseB >= val) setEllipseB(val - 0.5);
                      }}
                      style={{ width: '100%', accentColor: '#16A34A' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600' }}>
                      <span>Semi-Minor Axis (b):</span>
                      <span style={{ color: '#16A34A' }}>{ellipseB}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={ellipseA - 0.5}
                      step="0.5"
                      value={ellipseB}
                      onChange={(e) => setEllipseB(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#16A34A' }}
                    />
                  </div>
                </div>

                {(() => {
                  const c = Math.sqrt(ellipseA * ellipseA - ellipseB * ellipseB);
                  const e = c / ellipseA;
                  const lr = (2 * ellipseB * ellipseB) / ellipseA;
                  return (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                      <div><strong>Foci:</strong> (±{c.toFixed(2)}, 0)</div>
                      <div><strong>Eccentricity (e = c/a):</strong> {e.toFixed(3)} (0 &lt; e &lt; 1)</div>
                      <div><strong>Latus Rectum (2b²/a):</strong> {lr.toFixed(2)} units</div>
                      <div><strong>Major Axis:</strong> 2a = {ellipseA * 2} | <strong>Minor:</strong> 2b = {ellipseB * 2}</div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* HYPERBOLA CONTROLS */}
            {selectedConic === 'hyperbola' && (
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 10px 0', color: '#DC2626' }}>
                  Hyperbola: x²/a² - y²/b² = 1
                </h3>
                <div style={{ fontSize: '0.88rem', fontFamily: 'monospace', color: '#991B1B', backgroundColor: '#FEF2F2', padding: '8px 12px', borderRadius: '6px', marginBottom: '16px' }}>
                  x²/{ (hyperbolaA * hyperbolaA).toFixed(1) } - y²/{ (hyperbolaB * hyperbolaB).toFixed(1) } = 1
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600' }}>
                      <span>Semi-Transverse Axis (a):</span>
                      <span style={{ color: '#DC2626' }}>{hyperbolaA}</span>
                    </div>
                    <input
                      type="range"
                      min="1.5"
                      max="5"
                      step="0.5"
                      value={hyperbolaA}
                      onChange={(e) => setHyperbolaA(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#DC2626' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600' }}>
                      <span>Semi-Conjugate Axis (b):</span>
                      <span style={{ color: '#DC2626' }}>{hyperbolaB}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.5"
                      value={hyperbolaB}
                      onChange={(e) => setHyperbolaB(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#DC2626' }}
                    />
                  </div>
                </div>

                {(() => {
                  const c = Math.sqrt(hyperbolaA * hyperbolaA + hyperbolaB * hyperbolaB);
                  const e = c / hyperbolaA;
                  const lr = (2 * hyperbolaB * hyperbolaB) / hyperbolaA;
                  return (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '6px' }}>
                      <div><strong>Foci:</strong> (±{c.toFixed(2)}, 0)</div>
                      <div><strong>Eccentricity (e = c/a):</strong> {e.toFixed(3)} (e &gt; 1)</div>
                      <div><strong>Asymptotes:</strong> y = ±({(hyperbolaB / hyperbolaA).toFixed(2)})x</div>
                      <div><strong>Latus Rectum (2b²/a):</strong> {lr.toFixed(2)} units</div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CBSE STANDARD EQUATIONS & FORMULAS */}
      {activeTab === 'formulas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 16px 0', color: '#1E293B' }}>
              CBSE Class 11 Conic Sections Reference Summary
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: '#EFF6FF', borderRadius: '10px', border: '1.5px solid #BFDBFE' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1E40AF', margin: '0 0 8px 0' }}>Circle (e = 0)</h3>
                <div style={{ fontFamily: 'monospace', fontWeight: '700', color: '#2563EB', marginBottom: '8px' }}>
                  (x - h)² + (y - k)² = r²
                </div>
                <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  • Center: (h, k)<br />
                  • Radius: r<br />
                  • Plane angle: β = 90° (perpendicular to axis)<br />
                  • General form: x² + y² + 2gx + 2fy + c = 0
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#FFF7ED', borderRadius: '10px', border: '1.5px solid #FED7AA' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#9A3412', margin: '0 0 8px 0' }}>Parabola (e = 1)</h3>
                <div style={{ fontFamily: 'monospace', fontWeight: '700', color: '#EA580C', marginBottom: '8px' }}>
                  y² = 4ax &nbsp;|&nbsp; x² = 4ay
                </div>
                <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  • Focus: (a, 0)<br />
                  • Directrix: x = -a<br />
                  • Vertex: (0, 0)<br />
                  • Latus Rectum: 4a<br />
                  • Plane angle: β = α (parallel to generator)
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1.5px solid #BBF7D0' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#166534', margin: '0 0 8px 0' }}>Ellipse (0 &lt; e &lt; 1)</h3>
                <div style={{ fontFamily: 'monospace', fontWeight: '700', color: '#15803D', marginBottom: '8px' }}>
                  x²/a² + y²/b² = 1 (a &gt; b)
                </div>
                <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  • c² = a² - b²<br />
                  • Eccentricity: e = c/a &lt; 1<br />
                  • Foci: (±c, 0)<br />
                  • Major Axis: 2a | Minor: 2b<br />
                  • Plane angle: α &lt; β &lt; 90°
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#FEF2F2', borderRadius: '10px', border: '1.5px solid #FECACA' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#991B1B', margin: '0 0 8px 0' }}>Hyperbola (e &gt; 1)</h3>
                <div style={{ fontFamily: 'monospace', fontWeight: '700', color: '#DC2626', marginBottom: '8px' }}>
                  x²/a² - y²/b² = 1
                </div>
                <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                  • c² = a² + b²<br />
                  • Eccentricity: e = c/a &gt; 1<br />
                  • Foci: (±c, 0)<br />
                  • Asymptotes: y = ±(b/a)x<br />
                  • Plane angle: 0 ≤ β &lt; α (cuts both nappes)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRACTICE CHECK */}
      {activeTab === 'quiz' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(quizData).map(([qKey, qItem], idx) => {
            const isAnswered = selectedAnswers[qKey] !== undefined;
            const isCorrect = quizResults[qKey];
            return (
              <div key={qKey} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#4F46E5', backgroundColor: '#EEF2FF', padding: '3px 8px', borderRadius: '4px' }}>
                    Question {idx + 1}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 14px 0', color: '#1E293B' }}>
                  {qItem.question}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                  {qItem.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qKey] === optIdx;
                    let btnBg = '#F8FAFC';
                    let btnBorder = '#E2E8F0';
                    let btnColor = '#334155';

                    if (isAnswered) {
                      if (optIdx === qItem.correct) {
                        btnBg = '#DCFCE7';
                        btnBorder = '#86EFAC';
                        btnColor = '#166534';
                      } else if (isSelected) {
                        btnBg = '#FEE2E2';
                        btnBorder = '#FCA5A5';
                        btnColor = '#991B1B';
                      }
                    } else if (isSelected) {
                      btnBg = '#EEF2FF';
                      btnBorder = '#C7D2FE';
                      btnColor = '#3730A3';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleQuizAnswer(qKey, optIdx)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: `1.5px solid ${btnBorder}`,
                          backgroundColor: btnBg,
                          color: btnColor,
                          fontSize: '0.88rem',
                          fontWeight: isSelected ? '700' : '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: isCorrect ? '#F0FDF4' : '#FEF2F2',
                      border: `1px solid ${isCorrect ? '#BBF7D0' : '#FECACA'}`,
                      fontSize: '0.82rem',
                      lineHeight: '1.5',
                      color: isCorrect ? '#166534' : '#991B1B'
                    }}
                  >
                    <strong>{isCorrect ? 'Correct!' : 'Incorrect.'}</strong> {qItem.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

