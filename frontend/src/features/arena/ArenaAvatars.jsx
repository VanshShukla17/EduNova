import React from 'react';

/**
 * Pixel-art avatars matching the uploaded Arena duel designs:
 * Green Explorer (You) and Purple Cyber Challenger (Player 2 / AI).
 */

export function PlayerAvatar({ size = 72, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {/* Hair / Headgear */}
      <rect x="14" y="8" width="12" height="3" fill="#b45309" />
      <rect x="12" y="10" width="16" height="3" fill="#b45309" />

      {/* Face */}
      <rect x="13" y="12" width="14" height="10" fill="#fed7aa" />

      {/* Cyber Goggles Frame */}
      <rect x="11" y="13" width="18" height="6" rx="2" fill="#0d9488" />
      <rect x="13" y="14" width="6" height="4" fill="#67e8f9" />
      <rect x="21" y="14" width="6" height="4" fill="#67e8f9" />
      {/* Goggle eye pupils */}
      <circle cx="16" cy="16" r="1.5" fill="#0f172a" />
      <circle cx="24" cy="16" r="1.5" fill="#0f172a" />

      {/* Smile */}
      <rect x="17" y="19" width="6" height="1.5" fill="#c2410c" />

      {/* Neck Collar */}
      <rect x="15" y="22" width="10" height="2" fill="#0f766e" />

      {/* Torso / Space Suit */}
      <path
        d="M12 24 C12 24 10 36 10 38 H30 C30 38 28 24 28 24 Z"
        fill="#0d9488"
      />
      {/* Chest Badge with Q/Atom symbol */}
      <rect x="17" y="27" width="6" height="6" rx="1" fill="#fef08a" />
      <rect x="19" y="29" width="2" height="2" fill="#0f766e" />

      {/* Left arm with compass wrist-display */}
      <circle cx="9" cy="28" r="3.5" fill="#0f766e" />
      <circle cx="8" cy="28" r="2" fill="#38bdf8" />
      <line x1="8" y1="26" x2="8" y2="30" stroke="#fff" strokeWidth="0.8" />
      <line x1="6" y1="28" x2="10" y2="28" stroke="#fff" strokeWidth="0.8" />

      {/* Right arm */}
      <circle cx="31" cy="28" r="3" fill="#0f766e" />
    </svg>
  );
}

export function OpponentAvatar({ size = 72, className = '', isAI = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {/* Crown / Antenna */}
      <rect x="18" y="5" width="4" height="3" fill="#a855f7" />
      <rect x="19" y="4" width="2" height="2" fill="#ec4899" />
      <rect x="14" y="8" width="12" height="3" fill="#7e22ce" />
      <rect x="12" y="10" width="16" height="3" fill="#6b21a8" />

      {/* Head */}
      <rect x="13" y="11" width="14" height="10" fill="#a855f7" />

      {/* Glowing Neon Visor */}
      <rect x="11" y="13" width="18" height="5" rx="1.5" fill="#f43f5e" />
      <rect x="13" y="14" width="14" height="2.5" fill="#fbcfe8" />
      <rect x="14" y="15" width="10" height="1" fill="#ffffff" />

      {/* Cyber Mouth / Grill */}
      <rect x="17" y="19" width="6" height="1.5" fill="#581c87" />

      {/* Collar */}
      <rect x="15" y="21" width="10" height="2" fill="#581c87" />

      {/* Torso Robe */}
      <path
        d="M12 23 C12 23 9 36 9 38 H31 C31 38 28 23 28 23 Z"
        fill="#7e22ce"
      />

      {/* Core Energy Emblem */}
      <rect x="17" y="26" width="6" height="6" rx="1" fill="#ec4899" />
      <text
        x="20"
        y="31"
        textAnchor="middle"
        fontSize="5"
        fontWeight="bold"
        fill="#ffffff"
      >
        {isAI ? 'AI' : '2'}
      </text>

      {/* Left arm */}
      <circle cx="8" cy="28" r="3" fill="#6b21a8" />
      <rect x="5" y="27" width="2" height="2" fill="#ec4899" />

      {/* Right arm with quantum orb */}
      <circle cx="32" cy="28" r="3" fill="#6b21a8" />
    </svg>
  );
}
