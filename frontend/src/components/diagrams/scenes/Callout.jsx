import React from 'react';

/**
 * Leader line + text label for SVG diagram scenes.
 * (x1, y1) = point on the part, (x2, y2) = where text ends.
 * show = false in quiz mode so labels don't give away answers.
 */
export default function Callout({ show = true, x1, y1, x2, y2, anchor = 'start', children }) {
  if (!show) return null;
  const dx = anchor === 'start' ? 6 : anchor === 'end' ? -6 : 0;
  const dy = anchor === 'middle' ? (y2 < y1 ? -4 : 14) : 4;
  return (
    <g className="dg-callout" pointerEvents="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <circle cx={x1} cy={y1} r="3" />
      <text x={x2 + dx} y={y2 + dy} textAnchor={anchor}>{children}</text>
    </g>
  );
}
