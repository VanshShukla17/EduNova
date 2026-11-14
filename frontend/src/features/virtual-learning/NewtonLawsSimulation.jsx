import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, ShieldAlert, Award, Compass, Zap } from 'lucide-react';

/**
 * Newton's Laws of Motion 2D Numerical Simulation
 * CBSE Class 9, 10 & 11 Physics:
 * - Law 1: Law of Inertia (frictionless motion vs kinetic friction damping).
 * - Law 2: F = ma (Force and Mass controls, live dynamic acceleration readout).
 * - Law 3: Action & Reaction (Equal and opposite momentum recoil carts).
 * 
 * Uses direct canvas rendering and ref-based physics step for smooth 60fps animation.
 */
export default function NewtonLawsSimulation() {
  const [activeLaw, setActiveLaw] = useState(2); // 1 | 2 | 3
  const [isRunning, setIsRunning] = useState(true);

  // User Interactive Controls (React State)
  const [frictionOn, setFrictionOn] = useState(true);
  const [force, setForce] = useState(20); // Newtons
  const [mass, setMass] = useState(4); // kg
  const [cart1Mass, setCart1Mass] = useState(2); // kg
  const [cart2Mass, setCart2Mass] = useState(4); // kg
  const [isExploded, setIsExploded] = useState(false);

  // Canvas & Physics Loop Refs
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Mutable Physics State stored in Ref to prevent 60fps React state re-rendering
  const physRef = useRef({
    law1Pos: 40,
    law1Vel: 4,
    law2Pos: 40,
    law2Vel: 0,
    cart1Pos: 300,
    cart2Pos: 380,
    cart1Vel: 0,
    cart2Vel: 0
  });

  // State mirror for live UI readouts
  const [readouts, setReadouts] = useState({
    law1Vel: 4,
    law2Vel: 0,
    cart1Vel: 0,
    cart2Vel: 0
  });

  // Computed Law 2 acceleration
  const acceleration = Math.round((force / (mass || 1)) * 100) / 100;

  // Reset function
  const handleReset = () => {
    physRef.current = {
      law1Pos: 40,
      law1Vel: 4,
      law2Pos: 40,
      law2Vel: 0,
      cart1Pos: 320,
      cart2Pos: 380,
      cart1Vel: 0,
      cart2Vel: 0
    };
    setIsExploded(false);
    setReadouts({
      law1Vel: 4,
      law2Vel: 0,
      cart1Vel: 0,
      cart2Vel: 0
    });
  };

  // Trigger Law 3 spring release
  const handleSpringRelease = () => {
    const impulse = 30; // N*s
    const v1 = -impulse / cart1Mass;
    const v2 = impulse / cart2Mass;
    physRef.current.cart1Vel = v1;
    physRef.current.cart2Vel = v2;
    setIsExploded(true);
  };

  // Animation Loop (High Performance 60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let lastTick = performance.now();
    let uiUpdateCounter = 0;

    const render = (now) => {
      const dt = Math.min((now - lastTick) / 1000, 0.1);
      lastTick = now;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Floor / Track
      const groundY = height - 55;
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, groundY, width, 55);

      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      const p = physRef.current;

      if (activeLaw === 1) {
        // Law 1: Law of Inertia
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(
          `Law 1: Law of Inertia (Friction: ${frictionOn ? 'ON (μ = 0.05)' : 'OFF (μ = 0, Ideal Vacuum)'})`,
          20,
          25
        );

        const blockW = 60;
        const blockH = 40;

        // Draw Block
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(p.law1Pos, groundY - blockH, blockW, blockH);
        ctx.strokeStyle = '#1D4ED8';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.law1Pos, groundY - blockH, blockW, blockH);

        // Mass label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('m = 5 kg', p.law1Pos + 10, groundY - blockH + 24);

        // Velocity vector arrow
        if (Math.abs(p.law1Vel) > 0.05) {
          ctx.beginPath();
          ctx.moveTo(p.law1Pos + blockW, groundY - blockH / 2);
          ctx.lineTo(p.law1Pos + blockW + p.law1Vel * 10, groundY - blockH / 2);
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#10B981';
          ctx.fillText(`v = ${p.law1Vel.toFixed(1)} m/s`, p.law1Pos + blockW + 12, groundY - blockH / 2 - 8);
        } else {
          ctx.fillStyle = '#EF4444';
          ctx.fillText('At Rest (v = 0)', p.law1Pos, groundY - blockH - 8);
        }

        // Physics step
        if (isRunning) {
          p.law1Pos += p.law1Vel * 60 * dt;
          if (p.law1Pos > width - blockW - 10) {
            p.law1Pos = width - blockW - 10;
            p.law1Vel = -p.law1Vel * 0.85;
          } else if (p.law1Pos < 10) {
            p.law1Pos = 10;
            p.law1Vel = -p.law1Vel * 0.85;
          }

          if (frictionOn) {
            p.law1Vel *= Math.pow(0.992, dt * 60);
            if (Math.abs(p.law1Vel) < 0.03) p.law1Vel = 0;
          }
        }
      } else if (activeLaw === 2) {
        // Law 2: F = ma
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Law 2: F = ma → a = F / m = ${force} N / ${mass} kg = ${acceleration} m/s²`, 20, 25);

        const blockW = 50 + mass * 4;
        const blockH = 45;

        // Draw Block
        ctx.fillStyle = '#8B5CF6';
        ctx.fillRect(p.law2Pos, groundY - blockH, blockW, blockH);
        ctx.strokeStyle = '#6D28D9';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.law2Pos, groundY - blockH, blockW, blockH);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${mass} kg`, p.law2Pos + blockW / 2 - 14, groundY - blockH / 2 + 5);

        // Force vector arrow
        ctx.beginPath();
        ctx.moveTo(p.law2Pos + blockW, groundY - blockH / 2);
        ctx.lineTo(p.law2Pos + blockW + force * 2.2, groundY - blockH / 2);
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`F = ${force} N →`, p.law2Pos + blockW + 10, groundY - blockH / 2 - 8);

        // Wheels
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(p.law2Pos + 12, groundY - 4, 6, 0, Math.PI * 2);
        ctx.arc(p.law2Pos + blockW - 12, groundY - 4, 6, 0, Math.PI * 2);
        ctx.fill();

        // Live Velocity Display
        ctx.fillStyle = '#7C3AED';
        ctx.font = '11px sans-serif';
        ctx.fillText(`Current Velocity: ${p.law2Vel.toFixed(1)} m/s`, 20, 48);

        // Physics step
        if (isRunning) {
          p.law2Vel += acceleration * dt;
          p.law2Pos += p.law2Vel * 50 * dt;
          if (p.law2Pos > width - blockW - 10) {
            p.law2Pos = 20; // Loop around track
            p.law2Vel = 0;
          }
        }
      } else if (activeLaw === 3) {
        // Law 3: Action & Reaction
        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Law 3: Action and Reaction are Equal and Opposite (F₁₂ = -F₂₁)', 20, 25);

        // Cart 1
        const c1W = 60;
        const c1H = 35;
        ctx.fillStyle = '#10B981';
        ctx.fillRect(p.cart1Pos, groundY - c1H, c1W, c1H);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${cart1Mass} kg`, p.cart1Pos + 16, groundY - c1H / 2 + 4);

        // Cart 2
        const c2W = 60;
        const c2H = 35;
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(p.cart2Pos, groundY - c2H, c2W, c2H);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${cart2Mass} kg`, p.cart2Pos + 16, groundY - c2H / 2 + 4);

        // Spring between carts if not exploded
        if (!isExploded) {
          ctx.strokeStyle = '#64748B';
          ctx.lineWidth = 3;
          ctx.beginPath();
          const startX = p.cart1Pos + c1W;
          const endX = p.cart2Pos;
          ctx.moveTo(startX, groundY - c1H / 2);
          for (let x = startX + 5; x < endX; x += 6) {
            const yOffset = ((x - startX) % 12 < 6 ? -6 : 6);
            ctx.lineTo(x, groundY - c1H / 2 + yOffset);
          }
          ctx.lineTo(endX, groundY - c2H / 2);
          ctx.stroke();
        }

        // Momentum readout
        ctx.fillStyle = '#475569';
        ctx.font = '11px sans-serif';
        ctx.fillText(
          `Cart 1: v = ${p.cart1Vel.toFixed(2)} m/s (p = ${(cart1Mass * p.cart1Vel).toFixed(1)} kg·m/s)`,
          20,
          50
        );
        ctx.fillText(
          `Cart 2: v = ${p.cart2Vel.toFixed(2)} m/s (p = ${(cart2Mass * p.cart2Vel).toFixed(1)} kg·m/s)`,
          width - 290,
          50
        );

        // Conservation of momentum note
        const totalP = (cart1Mass * p.cart1Vel + cart2Mass * p.cart2Vel).toFixed(2);
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`Total System Momentum: Σp = ${totalP} kg·m/s (Conserved)`, 20, 70);

        if (isRunning && isExploded) {
          p.cart1Pos = Math.max(10, p.cart1Pos + p.cart1Vel * 50 * dt);
          p.cart2Pos = Math.min(width - c2W - 10, p.cart2Pos + p.cart2Vel * 50 * dt);
        }
      }

      // Throttle UI readouts to 5 times per sec
      uiUpdateCounter++;
      if (uiUpdateCounter % 12 === 0) {
        setReadouts({
          law1Vel: p.law1Vel,
          law2Vel: p.law2Vel,
          cart1Vel: p.cart1Vel,
          cart2Vel: p.cart2Vel
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [activeLaw, isRunning, frictionOn, force, mass, acceleration, isExploded, cart1Mass, cart2Mass]);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      {/* Top Law Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '3px' }}>
          {[
            { id: 1, label: 'Law 1: Inertia' },
            { id: 2, label: 'Law 2: F = ma' },
            { id: 3, label: 'Law 3: Action & Reaction' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveLaw(tab.id);
                handleReset();
              }}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeLaw === tab.id ? '#7C3AED' : 'transparent',
                color: activeLaw === tab.id ? '#FFFFFF' : '#64748B'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />} {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        style={{
          width: '100%',
          height: '240px',
          backgroundColor: '#F8FAFC',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #E2E8F0'
        }}
      >
        <canvas
          ref={canvasRef}
          width={760}
          height={240}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Interactive Controls based on Active Law */}
      {activeLaw === 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#EFF6FF',
            borderRadius: '10px',
            border: '1px solid #BFDBFE',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E40AF' }}>
              Galileo's Frictionless Plane Experiment
            </div>
            <div style={{ fontSize: '0.75rem', color: '#3B82F6' }}>
              An object in motion continues in uniform rectilinear motion unless acted upon by an external net unbalanced force.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFrictionOn(!frictionOn)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: frictionOn ? '#EF4444' : '#10B981',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            {frictionOn ? 'Disable Friction (Ideal Space)' : 'Enable Friction (μ = 0.05)'}
          </button>
        </div>
      )}

      {activeLaw === 2 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            padding: '12px 16px',
            backgroundColor: '#F8FAFC',
            borderRadius: '10px',
            border: '1px solid #E2E8F0'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px' }}>
              <span>Applied Force (F):</span>
              <span style={{ color: '#EF4444', fontWeight: '800' }}>{force} N</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={force}
              onChange={(e) => setForce(parseInt(e.target.value, 10))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600', marginBottom: '4px' }}>
              <span>Cart Mass (m):</span>
              <span style={{ color: '#7C3AED', fontWeight: '800' }}>{mass} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={mass}
              onChange={(e) => setMass(parseInt(e.target.value, 10))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '8px 12px',
              backgroundColor: '#FAF5FF',
              borderRadius: '8px',
              border: '1px solid #E9D5FF'
            }}
          >
            <span style={{ fontSize: '0.7rem', color: '#7E22CE', fontWeight: '700' }}>
              Calculated Acceleration (a = F/m):
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#581C87' }}>
              {acceleration} m/s²
            </span>
          </div>
        </div>
      )}

      {activeLaw === 3 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: '#F0FDF4',
            borderRadius: '10px',
            border: '1px solid #BBF7D0'
          }}
        >
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#15803D' }}>
              Compressed Spring Recoil & Momentum Conservation
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A' }}>
              Observe conservation of linear momentum: m₁v₁ + m₂v₂ = 0 (Equal & Opposite forces).
            </div>
          </div>
          <button
            type="button"
            onClick={handleSpringRelease}
            disabled={isExploded}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isExploded ? '#94A3B8' : '#15803D',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '0.8rem',
              cursor: isExploded ? 'not-allowed' : 'pointer'
            }}
          >
            {isExploded ? 'Spring Released' : 'Release Compressed Spring'}
          </button>
        </div>
      )}
    </div>
  );
}
