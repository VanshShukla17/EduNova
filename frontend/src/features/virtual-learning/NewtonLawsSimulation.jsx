import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button, PaperCard, Tag } from '../../components/ui';
import { resolveCssVar } from '../../components/ui/subjectUtils';

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

    const cTrack = resolveCssVar('--paper-edge');
    const cAxis = resolveCssVar('--ink-soft');
    const cInk = resolveCssVar('--ink');
    const cPhysics = resolveCssVar('--physics');
    const cPhysicsInk = resolveCssVar('--physics-ink');
    const cWhite = resolveCssVar('--white');
    const cEmerald = resolveCssVar('--emerald-600');
    const cRed = resolveCssVar('--red-600');
    const cMaths = resolveCssVar('--maths');
    const cMathsInk = resolveCssVar('--maths-ink');
    const cAmber = resolveCssVar('--amber-500');
    const cMuted = resolveCssVar('--ink-muted');

    const render = (now) => {
      const dt = Math.min((now - lastTick) / 1000, 0.1);
      lastTick = now;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Floor / Track
      const groundY = height - 55;
      ctx.fillStyle = cTrack;
      ctx.fillRect(0, groundY, width, 55);

      ctx.strokeStyle = cAxis;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      const p = physRef.current;

      if (activeLaw === 1) {
        // Law 1: Law of Inertia
        ctx.fillStyle = cInk;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(
          `Law 1: Law of Inertia (Friction: ${frictionOn ? 'ON (μ = 0.05)' : 'OFF (μ = 0, Ideal Vacuum)'})`,
          20,
          25
        );

        const blockW = 60;
        const blockH = 40;

        // Draw Block
        ctx.fillStyle = cPhysics;
        ctx.fillRect(p.law1Pos, groundY - blockH, blockW, blockH);
        ctx.strokeStyle = cPhysicsInk;
        ctx.lineWidth = 2;
        ctx.strokeRect(p.law1Pos, groundY - blockH, blockW, blockH);

        // Mass label
        ctx.fillStyle = cWhite;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('m = 5 kg', p.law1Pos + 10, groundY - blockH + 24);

        // Velocity vector arrow
        if (Math.abs(p.law1Vel) > 0.05) {
          ctx.beginPath();
          ctx.moveTo(p.law1Pos + blockW, groundY - blockH / 2);
          ctx.lineTo(p.law1Pos + blockW + p.law1Vel * 10, groundY - blockH / 2);
          ctx.strokeStyle = cEmerald;
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = cEmerald;
          ctx.fillText(`v = ${p.law1Vel.toFixed(1)} m/s`, p.law1Pos + blockW + 12, groundY - blockH / 2 - 8);
        } else {
          ctx.fillStyle = cRed;
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
        ctx.fillStyle = cInk;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`Law 2: F = ma → a = F / m = ${force} N / ${mass} kg = ${acceleration} m/s²`, 20, 25);

        const blockW = 50 + mass * 4;
        const blockH = 45;

        // Draw Block
        ctx.fillStyle = cMaths;
        ctx.fillRect(p.law2Pos, groundY - blockH, blockW, blockH);
        ctx.strokeStyle = cMathsInk;
        ctx.lineWidth = 2;
        ctx.strokeRect(p.law2Pos, groundY - blockH, blockW, blockH);

        ctx.fillStyle = cWhite;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${mass} kg`, p.law2Pos + blockW / 2 - 14, groundY - blockH / 2 + 5);

        // Force vector arrow
        ctx.beginPath();
        ctx.moveTo(p.law2Pos + blockW, groundY - blockH / 2);
        ctx.lineTo(p.law2Pos + blockW + force * 2.2, groundY - blockH / 2);
        ctx.strokeStyle = cRed;
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = cRed;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`F = ${force} N →`, p.law2Pos + blockW + 10, groundY - blockH / 2 - 8);

        // Wheels
        ctx.fillStyle = cMuted;
        ctx.beginPath();
        ctx.arc(p.law2Pos + 12, groundY - 4, 6, 0, Math.PI * 2);
        ctx.arc(p.law2Pos + blockW - 12, groundY - 4, 6, 0, Math.PI * 2);
        ctx.fill();

        // Live Velocity Display
        ctx.fillStyle = cMaths;
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
        ctx.fillStyle = cInk;
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Law 3: Action and Reaction are Equal and Opposite (F₁₂ = -F₂₁)', 20, 25);

        // Cart 1
        const c1W = 60;
        const c1H = 35;
        ctx.fillStyle = cEmerald;
        ctx.fillRect(p.cart1Pos, groundY - c1H, c1W, c1H);
        ctx.fillStyle = cWhite;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${cart1Mass} kg`, p.cart1Pos + 16, groundY - c1H / 2 + 4);

        // Cart 2
        const c2W = 60;
        const c2H = 35;
        ctx.fillStyle = cAmber;
        ctx.fillRect(p.cart2Pos, groundY - c2H, c2W, c2H);
        ctx.fillStyle = cWhite;
        ctx.fillText(`${cart2Mass} kg`, p.cart2Pos + 16, groundY - c2H / 2 + 4);

        // Spring between carts if not exploded
        if (!isExploded) {
          ctx.strokeStyle = cAxis;
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
        ctx.fillStyle = cMuted;
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
        ctx.fillStyle = cInk;
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
    <PaperCard
      flat
      style={{
        padding: 'var(--sp-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-3)'
      }}
    >
      {/* Top Law Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          {[
            { id: 1, label: 'Law 1: Inertia' },
            { id: 2, label: 'Law 2: F = ma' },
            { id: 3, label: 'Law 3: Action & Reaction' }
          ].map((tab) => (
            <Button
              key={tab.id}
              type="button"
              size="sm"
              variant={activeLaw === tab.id ? 'primary' : 'secondary'}
              onClick={() => {
                setActiveLaw(tab.id);
                handleReset();
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            {isRunning ? 'Pause' : 'Resume'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleReset}
          >
            <RotateCcw size={14} /> Reset
          </Button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        style={{
          width: '100%',
          height: '240px',
          backgroundColor: 'var(--paper-warm)',
          borderRadius: 'var(--r-md)',
          overflow: 'hidden',
          border: '1px solid var(--paper-edge)'
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
        <PaperCard
          flat
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--sp-3)',
            backgroundColor: 'var(--physics-soft)',
            borderColor: 'var(--physics)',
            flexWrap: 'wrap',
            gap: 'var(--sp-2)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--physics-ink)' }}>
              Galileo&apos;s Frictionless Plane Experiment
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--physics-ink)' }}>
              An object in motion continues in uniform rectilinear motion unless acted upon by an external net unbalanced force.
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant={frictionOn ? 'danger' : 'primary'}
            onClick={() => setFrictionOn(!frictionOn)}
          >
            {frictionOn ? 'Disable Friction (Ideal Space)' : 'Enable Friction (μ = 0.05)'}
          </Button>
        </PaperCard>
      )}

      {activeLaw === 2 && (
        <PaperCard
          flat
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--sp-3)',
            padding: 'var(--sp-3)',
            backgroundColor: 'var(--paper-warm)'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
              <span>Applied Force (F):</span>
              <Tag tone="red">{force} N</Tag>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={force}
              onChange={(e) => setForce(parseInt(e.target.value, 10))}
              aria-label="Applied Force F in Newtons"
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--red-600)' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>
              <span>Cart Mass (m):</span>
              <Tag tone="maths">{mass} kg</Tag>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={mass}
              onChange={(e) => setMass(parseInt(e.target.value, 10))}
              aria-label="Cart Mass m in kilograms"
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--maths)' }}
            />
          </div>

          <PaperCard
            flat
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 'var(--sp-2) var(--sp-3)',
              backgroundColor: 'var(--maths-soft)',
              borderColor: 'var(--maths)'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--maths-ink)', fontWeight: 700 }}>
              Calculated Acceleration (a = F/m):
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
              {acceleration} m/s²
            </span>
          </PaperCard>
        </PaperCard>
      )}

      {activeLaw === 3 && (
        <PaperCard
          flat
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--sp-2)',
            padding: 'var(--sp-3)',
            backgroundColor: 'var(--emerald-soft)',
            borderColor: 'var(--emerald-600)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--emerald-800)' }}>
              Compressed Spring Recoil &amp; Momentum Conservation
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--emerald-700)' }}>
              Observe conservation of linear momentum: m₁v₁ + m₂v₂ = 0 (Equal &amp; Opposite forces).
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant={isExploded ? 'secondary' : 'primary'}
            onClick={handleSpringRelease}
            disabled={isExploded}
          >
            {isExploded ? 'Spring Released' : 'Release Compressed Spring'}
          </Button>
        </PaperCard>
      )}
    </PaperCard>
  );
}
