import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Compass,
  Activity,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Bot,
  RotateCcw,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function TrigonometryLabPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('circle'); // 'circle' | 'wave' | 'identities' | 'quiz'

  // Unit Circle State
  const [angleDeg, setAngleDeg] = useState(45);
  const [showTangentLine, setShowTangentLine] = useState(true);
  const circleCanvasRef = useRef(null);

  // Wave Explorer State: y = A * sin(B * x + C) + D
  const [ampA, setAmpA] = useState(1.5);
  const [freqB, setFreqB] = useState(1.0);
  const [phaseC, setPhaseC] = useState(0.0);
  const [vertD, setVertD] = useState(0.0);
  const waveCanvasRef = useRef(null);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});

  const rad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.abs(cosVal) > 0.0001 ? Math.tan(rad) : (sinVal > 0 ? Infinity : -Infinity);
  const cscVal = Math.abs(sinVal) > 0.0001 ? 1 / sinVal : (sinVal >= 0 ? Infinity : -Infinity);
  const secVal = Math.abs(cosVal) > 0.0001 ? 1 / cosVal : (cosVal >= 0 ? Infinity : -Infinity);
  const cotVal = Math.abs(sinVal) > 0.0001 ? cosVal / sinVal : Infinity;

  // Radian representation helper
  const getRadianString = (deg) => {
    const d = deg % 360;
    if (d === 0) return '0 rad';
    if (d === 30) return 'π / 6 rad';
    if (d === 45) return 'π / 4 rad';
    if (d === 60) return 'π / 3 rad';
    if (d === 90) return 'π / 2 rad';
    if (d === 120) return '2π / 3 rad';
    if (d === 135) return '3π / 4 rad';
    if (d === 150) return '5π / 6 rad';
    if (d === 180) return 'π rad';
    if (d === 210) return '7π / 6 rad';
    if (d === 225) return '5π / 4 rad';
    if (d === 240) return '4π / 3 rad';
    if (d === 270) return '3π / 2 rad';
    if (d === 300) return '5π / 3 rad';
    if (d === 315) return '7π / 4 rad';
    if (d === 330) return '11π / 6 rad';
    if (d === 360) return '2π rad';
    return `${(deg * Math.PI / 180).toFixed(2)} rad`;
  };

  // Quadrant information
  const getQuadrant = (deg) => {
    const d = deg % 360;
    if (d >= 0 && d < 90) return { q: 'I', label: 'Quadrant I (All positive: ASTC: A)', color: '#2563EB' };
    if (d >= 90 && d < 180) return { q: 'II', label: 'Quadrant II (Sin / Csc positive: ASTC: S)', color: '#7C3AED' };
    if (d >= 180 && d < 270) return { q: 'III', label: 'Quadrant III (Tan / Cot positive: ASTC: T)', color: '#059669' };
    return { q: 'IV', label: 'Quadrant IV (Cos / Sec positive: ASTC: C)', color: '#DC2626' };
  };

  const currentQuad = getQuadrant(angleDeg);

  // Render Unit Circle Canvas
  useEffect(() => {
    const canvas = circleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const R = 115; // Unit circle radius in pixels

    // Background grid
    ctx.strokeStyle = '#F1F5F9';
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

    // Axes
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(15, cy);
    ctx.lineTo(width - 15, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 15);
    ctx.lineTo(cx, height - 15);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#64748B';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('+X (cos θ)', width - 65, cy - 8);
    ctx.fillText('+Y (sin θ)', cx + 8, 25);
    ctx.fillText('-1', cx - R - 15, cy + 15);
    ctx.fillText('+1', cx + R - 5, cy + 15);

    // Unit Circle outline
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Angle coordinates on circle
    const px = cx + R * Math.cos(rad);
    const py = cy - R * Math.sin(rad);

    // Shaded angle sector
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 32, 0, -rad, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(79, 70, 229, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cosine projection line (Horizontal on X axis)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, cy);
    ctx.strokeStyle = '#0284C7'; // Blue
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Sine projection line (Vertical to P)
    ctx.beginPath();
    ctx.moveTo(px, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = '#16A34A'; // Green
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Hypotenuse (Radius = 1)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Tangent line if enabled
    if (showTangentLine && Math.abs(cosVal) > 0.05) {
      const tanY = cy - R * Math.tan(rad);
      if (tanY >= -height && tanY <= height * 2) {
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.moveTo(cx + R, cy);
        ctx.lineTo(cx + R, tanY);
        ctx.strokeStyle = '#EA580C';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Terminal point P(cos, sin)
    ctx.beginPath();
    ctx.arc(px, py, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = '#4F46E5';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Coordinate text at point
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 11px system-ui, sans-serif';
    const offsetX = cosVal >= 0 ? 12 : -75;
    const offsetY = sinVal >= 0 ? -12 : 20;
    ctx.fillText(`P(${cosVal.toFixed(2)}, ${sinVal.toFixed(2)})`, px + offsetX, py + offsetY);
  }, [angleDeg, rad, cosVal, sinVal, showTangentLine]);

  // Render Wave Explorer Canvas
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const scaleX = 35; // px per radian
    const scaleY = 32; // px per unit

    // Grid
    ctx.strokeStyle = '#F1F5F9';
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

    // Main Axes
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

    // Axis Labels
    ctx.fillStyle = '#64748B';
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('0', cx + 4, cy + 12);
    ctx.fillText('π', cx + scaleX * Math.PI - 5, cy + 14);
    ctx.fillText('2π', cx + scaleX * 2 * Math.PI - 8, cy + 14);
    ctx.fillText('-π', cx - scaleX * Math.PI - 8, cy + 14);
    ctx.fillText('+2', cx + 6, cy - scaleY * 2 + 4);
    ctx.fillText('-2', cx + 6, cy + scaleY * 2 + 4);

    // Reference curve: y = sin(x) in light grey
    ctx.beginPath();
    ctx.strokeStyle = '#CBD5E1';
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

    // Transformed curve: y = A * sin(B * x + C) + D
    ctx.beginPath();
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 3;
    for (let px = 0; px < width; px++) {
      const xVal = (px - cx) / scaleX;
      const yVal = ampA * Math.sin(freqB * xVal + phaseC) + vertD;
      const py = cy - yVal * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Midline (y = D) if shifted
    if (Math.abs(vertD) > 0.05) {
      ctx.beginPath();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      const midY = cy - vertD * scaleY;
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [ampA, freqB, phaseC, vertD]);

  const handleQuizAnswer = (qId, optionIdx) => {
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionIdx });
    setQuizResults({
      ...quizResults,
      [qId]: optionIdx === quizData[qId].correct
    });
  };

  const quizData = {
    q1: {
      question: 'In Quadrant III (180° to 270°), which trigonometric ratio is positive?',
      options: ['sin θ and csc θ', 'cos θ and sec θ', 'tan θ and cot θ', 'All ratios are positive'],
      correct: 2,
      explanation: 'According to the ASTC rule (Add Sugar To Coffee), Quadrant III is the "T" quadrant where tan θ and its reciprocal cot θ are positive; sin and cos are negative.'
    },
    q2: {
      question: 'Which of the following fundamental identities is derived directly from the Pythagorean theorem on the unit circle (x² + y² = 1)?',
      options: ['sin²θ - cos²θ = 1', 'sin²θ + cos²θ = 1', 'tan²θ - 1 = sec²θ', 'sin(2θ) = 2 sin θ'],
      correct: 1,
      explanation: 'Since x = cos θ and y = sin θ on the unit circle of radius 1, x² + y² = 1 directly gives cos²θ + sin²θ = 1.'
    },
    q3: {
      question: 'For the sinusoidal wave y = 3 sin(2x - π) + 1, what is its amplitude and period?',
      options: ['Amplitude = 3, Period = π', 'Amplitude = 1, Period = 2π', 'Amplitude = 3, Period = 2π', 'Amplitude = 2, Period = π/2'],
      correct: 0,
      explanation: 'Amplitude is |A| = 3. Period is T = 2π / |B| = 2π / 2 = π.'
    }
  };

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: 'mathematics',
        prefill: 'Can you explain the ASTC quadrant rule and show step-by-step proofs of the 3 fundamental Pythagorean identities (sin²θ+cos²θ=1, 1+tan²θ=sec²θ, 1+cot²θ=csc²θ)?'
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
          <Bot size={15} /> Ask Saarthi about Trigonometry
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
            MATHEMATICS • CLASS 10 & 11
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
            CBSE Chapter 8 & 3
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
            Native Interactive Lab
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 10px 0', color: 'var(--color-text-primary, #0F172A)' }}>
          Trigonometry Interactive Lab
        </h1>
        <p style={{ color: 'var(--color-text-secondary, #475569)', fontSize: '0.96rem', lineHeight: '1.6', margin: 0 }}>
          Explore the trigonometric unit circle, connect terminal angle coordinates $(x,y) = (\cos\theta, \sin\theta)$ to right-triangle ratios, master the ASTC quadrant rule, and dynamically visualize sinusoidal transformations $y = A\sin(Bx+C)+D$.
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
            { id: 'circle', label: 'Unit Circle & ASTC', icon: Compass },
            { id: 'wave', label: 'Sinusoidal Wave Explorer', icon: Activity },
            { id: 'identities', label: 'Fundamental Identities', icon: BookOpen },
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

      {/* TAB 1: UNIT CIRCLE & ASTC */}
      {activeTab === 'circle' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.1fr) minmax(280px, 0.9fr)', gap: '20px', alignItems: 'start' }}>
          {/* Left: Canvas & Angle Controls */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>Unit Circle Canvas ($r = 1$)</h2>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: currentQuad.color,
                  backgroundColor: '#F8FAFC',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${currentQuad.color}30`
                }}
              >
                {currentQuad.q}: {currentQuad.label.split(':')[0]}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '10px', marginBottom: '16px' }}>
              <canvas
                ref={circleCanvasRef}
                width={360}
                height={320}
                style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            {/* Slider Control */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Angle θ:</span>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#4F46E5' }}>
                  {angleDeg}° &nbsp;|&nbsp; {getRadianString(angleDeg)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={angleDeg}
                onChange={(e) => setAngleDeg(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#4F46E5' }}
              />
            </div>

            {/* Quick Angle Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {[0, 30, 45, 60, 90, 120, 135, 180, 270, 360].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setAngleDeg(deg)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    fontWeight: angleDeg === deg ? '700' : '500',
                    backgroundColor: angleDeg === deg ? '#4F46E5' : '#F1F5F9',
                    color: angleDeg === deg ? '#FFFFFF' : '#334155',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {deg}°
                </button>
              ))}
            </div>

            {/* Toggle Tangent Line */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', color: '#475569' }}>
              <input
                type="checkbox"
                checked={showTangentLine}
                onChange={(e) => setShowTangentLine(e.target.checked)}
                style={{ accentColor: '#EA580C' }}
              />
              Show Tangent Line at x = 1 (orange)
            </label>
          </div>

          {/* Right: Ratios & ASTC Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Real-time Ratios */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: '700', margin: '0 0 12px 0' }}>Trigonometric Values at {angleDeg}°</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '10px', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: '700' }}>SINE (Vertical / y)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#15803D' }}>sin {angleDeg}° = {sinVal.toFixed(3)}</div>
                </div>

                <div style={{ padding: '10px', backgroundColor: '#F0F9FF', borderRadius: '8px', border: '1px solid #BAE6FD' }}>
                  <div style={{ fontSize: '0.72rem', color: '#0369A1', fontWeight: '700' }}>COSINE (Horizontal / x)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0284C7' }}>cos {angleDeg}° = {cosVal.toFixed(3)}</div>
                </div>

                <div style={{ padding: '10px', backgroundColor: '#FFF7ED', borderRadius: '8px', border: '1px solid #FED7AA' }}>
                  <div style={{ fontSize: '0.72rem', color: '#C2410C', fontWeight: '700' }}>TANGENT (sin / cos)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#EA580C' }}>
                    tan {angleDeg}° = {Math.abs(tanVal) > 100 ? (tanVal > 0 ? '+Undefined' : '-Undefined') : tanVal.toFixed(3)}
                  </div>
                </div>

                <div style={{ padding: '10px', backgroundColor: '#FAF5FF', borderRadius: '8px', border: '1px solid #E9D5FF' }}>
                  <div style={{ fontSize: '0.72rem', color: '#7E22CE', fontWeight: '700' }}>COSECANT (1 / sin)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#9333EA' }}>
                    csc {angleDeg}° = {Math.abs(cscVal) > 100 ? 'Undefined' : cscVal.toFixed(3)}
                  </div>
                </div>

                <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '700' }}>SECANT (1 / cos)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#334155' }}>
                    sec {angleDeg}° = {Math.abs(secVal) > 100 ? 'Undefined' : secVal.toFixed(3)}
                  </div>
                </div>

                <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: '700' }}>COTANGENT (cos / sin)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#334155' }}>
                    cot {angleDeg}° = {Math.abs(cotVal) > 100 ? 'Undefined' : cotVal.toFixed(3)}
                  </div>
                </div>
              </div>

              {/* Pythagorean Proof Check */}
              <div style={{ marginTop: '14px', padding: '10px', backgroundColor: '#EEF2FF', borderRadius: '8px', border: '1px solid #C7D2FE', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '700', color: '#3730A3', marginBottom: '2px' }}>Pythagorean Identity Verification:</div>
                <div style={{ fontFamily: 'monospace', color: '#4338CA' }}>
                  sin²({angleDeg}°) + cos²({angleDeg}°) = ({sinVal.toFixed(3)})² + ({cosVal.toFixed(3)})² = {(Math.pow(sinVal, 2) + Math.pow(cosVal, 2)).toFixed(3)} ≈ 1.000 ✓
                </div>
              </div>
            </div>

            {/* ASTC Rule Box */}
            <div className="card" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '0.94rem', fontWeight: '700', margin: '0 0 8px 0', color: '#1E293B' }}>The ASTC Quadrant Rule ("Add Sugar To Coffee")</h3>
              <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                Angles beyond 90° retain their reference acute values but alternate signs depending on the quadrant:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
                <div style={{ padding: '8px', backgroundColor: '#EFF6FF', borderRadius: '6px', borderLeft: '4px solid #2563EB' }}>
                  <strong>Q1 (0°–90°): ALL</strong>
                  <div style={{ color: '#1E40AF' }}>All functions positive</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#F5F3FF', borderRadius: '6px', borderLeft: '4px solid #7C3AED' }}>
                  <strong>Q2 (90°–180°): SIN</strong>
                  <div style={{ color: '#5B21B6' }}>sin & csc are (+)</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#ECFDF5', borderRadius: '6px', borderLeft: '4px solid #059669' }}>
                  <strong>Q3 (180°–270°): TAN</strong>
                  <div style={{ color: '#065F46' }}>tan & cot are (+)</div>
                </div>
                <div style={{ padding: '8px', backgroundColor: '#FEF2F2', borderRadius: '6px', borderLeft: '4px solid #DC2626' }}>
                  <strong>Q4 (270°–360°): COS</strong>
                  <div style={{ color: '#991B1B' }}>cos & sec are (+)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WAVE EXPLORER */}
      {activeTab === 'wave' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 4px 0', color: '#1E293B' }}>
                  Sinusoidal Wave Transformation Lab
                </h2>
                <div style={{ fontSize: '0.92rem', fontFamily: 'monospace', color: '#4F46E5', fontWeight: '700' }}>
                  y = {ampA} · sin({freqB}x {phaseC >= 0 ? `+ ${phaseC.toFixed(1)}` : `- ${Math.abs(phaseC).toFixed(1)}`}) {vertD >= 0 ? `+ ${vertD.toFixed(1)}` : `- ${Math.abs(vertD).toFixed(1)}`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAmpA(1);
                  setFreqB(1);
                  setPhaseC(0);
                  setVertD(0);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} /> Reset to standard sin(x)
              </button>
            </div>

            {/* Wave Plotter Canvas */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '12px', marginBottom: '20px' }}>
              <canvas
                ref={waveCanvasRef}
                width={860}
                height={260}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '6px' }}>
                <span>Dashed grey line: Standard reference $y = \sin(x)$</span>
                <span>Solid purple curve: Transformed sinusoidal wave</span>
              </div>
            </div>

            {/* Controls Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {/* Amplitude A */}
              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                  <span>Amplitude (A):</span>
                  <span style={{ color: '#4F46E5', fontWeight: '700' }}>{ampA.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={ampA}
                  onChange={(e) => setAmpA(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#4F46E5' }}
                />
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
                  Stretches wave vertically; peak height = |A|
                </div>
              </div>

              {/* Frequency B */}
              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                  <span>Frequency (B):</span>
                  <span style={{ color: '#4F46E5', fontWeight: '700' }}>{freqB.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.1"
                  value={freqB}
                  onChange={(e) => setFreqB(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#4F46E5' }}
                />
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
                  Period T = 2π / B = {( (2 * Math.PI) / freqB ).toFixed(2)} rad
                </div>
              </div>

              {/* Phase Shift C */}
              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                  <span>Phase Shift (C):</span>
                  <span style={{ color: '#4F46E5', fontWeight: '700' }}>{phaseC.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-3.14"
                  max="3.14"
                  step="0.1"
                  value={phaseC}
                  onChange={(e) => setPhaseC(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#4F46E5' }}
                />
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
                  Horizontal displacement = -C / B
                </div>
              </div>

              {/* Vertical Shift D */}
              <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                  <span>Vertical Shift (D):</span>
                  <span style={{ color: '#4F46E5', fontWeight: '700' }}>{vertD.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={vertD}
                  onChange={(e) => setVertD(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#4F46E5' }}
                />
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
                  Translates equilibrium line y = D
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FUNDAMENTAL IDENTITIES */}
      {activeTab === 'identities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 16px 0', color: '#1E293B' }}>
              CBSE Class 10 & 11 Fundamental Trigonometric Identities
            </h2>

            {/* The 3 Core Identities */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', backgroundColor: '#EEF2FF', borderRadius: '10px', border: '1.5px solid #C7D2FE' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4F46E5', textTransform: 'uppercase' }}>Identity 1</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#3730A3', margin: '8px 0' }}>sin²θ + cos²θ = 1</div>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                  Valid for all real angles θ. Rearranged forms:
                  <br />• sin²θ = 1 - cos²θ
                  <br />• cos²θ = 1 - sin²θ
                </p>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1.5px solid #BBF7D0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803D', textTransform: 'uppercase' }}>Identity 2</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#166534', margin: '8px 0' }}>1 + tan²θ = sec²θ</div>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                  Valid for θ ≠ (2n+1)π/2. Rearranged forms:
                  <br />• sec²θ - tan²θ = 1
                  <br />• tan²θ = sec²θ - 1
                </p>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#FFF7ED', borderRadius: '10px', border: '1.5px solid #FED7AA' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#C2410C', textTransform: 'uppercase' }}>Identity 3</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#9A3412', margin: '8px 0' }}>1 + cot²θ = csc²θ</div>
                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                  Valid for θ ≠ nπ. Rearranged forms:
                  <br />• csc²θ - cot²θ = 1
                  <br />• cot²θ = csc²θ - 1
                </p>
              </div>
            </div>

            {/* Standard Angle Exact Value Table */}
            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 12px 0', color: '#1E293B' }}>Standard Angle Reference Table</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem', textAlign: 'center' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Ratio</th>
                    <th style={{ padding: '10px' }}>0° (0)</th>
                    <th style={{ padding: '10px' }}>30° (π/6)</th>
                    <th style={{ padding: '10px' }}>45° (π/4)</th>
                    <th style={{ padding: '10px' }}>60° (π/3)</th>
                    <th style={{ padding: '10px' }}>90° (π/2)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '9px 10px', textAlign: 'left', fontWeight: '700', color: '#16A34A' }}>sin θ</td>
                    <td style={{ padding: '9px 10px' }}>0</td>
                    <td style={{ padding: '9px 10px' }}>1/2</td>
                    <td style={{ padding: '9px 10px' }}>1/√2</td>
                    <td style={{ padding: '9px 10px' }}>√3/2</td>
                    <td style={{ padding: '9px 10px' }}>1</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '9px 10px', textAlign: 'left', fontWeight: '700', color: '#0284C7' }}>cos θ</td>
                    <td style={{ padding: '9px 10px' }}>1</td>
                    <td style={{ padding: '9px 10px' }}>√3/2</td>
                    <td style={{ padding: '9px 10px' }}>1/√2</td>
                    <td style={{ padding: '9px 10px' }}>1/2</td>
                    <td style={{ padding: '9px 10px' }}>0</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '9px 10px', textAlign: 'left', fontWeight: '700', color: '#EA580C' }}>tan θ</td>
                    <td style={{ padding: '9px 10px' }}>0</td>
                    <td style={{ padding: '9px 10px' }}>1/√3</td>
                    <td style={{ padding: '9px 10px' }}>1</td>
                    <td style={{ padding: '9px 10px' }}>√3</td>
                    <td style={{ padding: '9px 10px', color: '#DC2626' }}>Undefined</td>
                  </tr>
                </tbody>
              </table>
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
                        {isAnswered && optIdx === qItem.correct && <CheckCircle2 size={16} color="#16A34A" />}
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

