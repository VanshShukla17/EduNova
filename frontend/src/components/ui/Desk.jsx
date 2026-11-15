import React from 'react';
import Ruler from './Ruler';
import Doodles from './Doodles';

/**
 * Global graph-paper classroom desk surface mounted once in AppShell.
 * Decorative layer only; excluded from accessibility tree.
 */
export default function Desk() {
  return (
    <div className="desk" aria-hidden="true">
      <Doodles />
      <Ruler />
    </div>
  );
}
