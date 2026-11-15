import React from 'react';

/**
 * Subtle chalk doodles anchored to outer desk margins on wide viewports (1280px+).
 */
export default function Doodles() {
  return (
    <div className="doodles">
      <div className="doodle" style={{ top: '12%', left: '36px', rotate: '-12deg' }}>
        <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
          <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(35 24 24)" />
          <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(-35 24 24)" />
          <circle cx="24" cy="24" r="3" fill="currentColor" />
        </svg>
      </div>

      <div className="doodle" style={{ top: '26%', right: '26px', rotate: '8deg' }}>
        <span>E = mc²</span>
      </div>

      <div className="doodle" style={{ top: '42%', left: '34px', rotate: '-6deg' }}>
        <svg width="42" height="54" viewBox="0 0 42 54" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M16 6h10M18 6v14l-10 22a4 4 0 0 0 3.6 6h18.8a4 4 0 0 0 3.6-6L24 20V6" />
          <path d="M12 36h18" strokeDasharray="3 3" />
        </svg>
      </div>

      <div className="doodle" style={{ top: '56%', right: '30px', rotate: '-10deg' }}>
        <svg width="52" height="40" viewBox="0 0 52 40" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 34V8l38 26H6Z" />
          <path d="M6 26h8v8" />
        </svg>
      </div>

      <div className="doodle" style={{ top: '70%', left: '38px', rotate: '6deg' }}>
        <span>sin²θ + cos²θ = 1</span>
      </div>

      <div className="doodle" style={{ top: '78%', right: '28px', rotate: '12deg' }}>
        <svg width="44" height="58" viewBox="0 0 44 58" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 6c16 8 4 16 20 24s-4 14-20 22" />
          <path d="M32 6c-16 8-4 16-20 24s4 14 20 22" />
          <path d="M15 14h14M17 29h10M15 44h14" />
        </svg>
      </div>

      <div className="doodle" style={{ top: '14%', right: '34px', rotate: '-5deg' }}>
        <span>F = G·m₁m₂/r²</span>
      </div>

      <div className="doodle" style={{ bottom: '46px', left: '40px', rotate: '-4deg' }}>
        <span>pH + pOH = 14</span>
      </div>
    </div>
  );
}
