import React from 'react';

/**
 * Steel wire paperclip for holding citation notes on paper cards.
 */
export default function Paperclip({ className = '', style }) {
  return (
    <svg
      className={['paperclip', className].filter(Boolean).join(' ')}
      style={style}
      viewBox="0 0 18 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13 11v18a5 5 0 0 1-10 0V9a6 6 0 0 1 12 0v20a3 3 0 0 1-6 0V12" />
    </svg>
  );
}
