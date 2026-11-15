import React from 'react';
import { Sparkles } from 'lucide-react';
import ChotuMascot from './ChotuMascot';

/**
 * Floating action button anchored bottom-right for launching Chotu mentor chat.
 */
export default function ChotuFab({ open, onClick }) {
  return (
    <button
      type="button"
      className="chotu-fab"
      onClick={onClick}
      aria-expanded={open ? 'true' : 'false'}
      aria-label={open ? 'Close Chotu mentor chat' : 'Ask Chotu mentor'}
      title="Ask Chotu (AI Saarthi)"
    >
      <ChotuMascot size={38} label="Ask Chotu" />
      <span className="chotu-fab__badge" aria-hidden="true">
        <Sparkles size={11} strokeWidth={2.4} />
      </span>
    </button>
  );
}
