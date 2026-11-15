import React from 'react';
import { Trophy, Award, RotateCcw, Home, CheckCircle2, XCircle } from 'lucide-react';
import { PlayerAvatar, OpponentAvatar } from './ArenaAvatars';

export default function ArenaResults({
  result,
  userName = 'You',
  opponentName = 'Player 2',
  isAI = false,
  onRematch,
  onExitLobby,
}) {
  const { userScore = 0, oppScore = 0, gainedXp = 0, isVictory = false, history = [] } = result || {};
  const isDraw = userScore === oppScore;

  return (
    <div className="arena-board" style={{ alignItems: 'center', textAlign: 'center' }}>
      {/* Result Outcome Header */}
      <div style={{ marginTop: '20px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: isVictory ? 'rgba(245, 158, 11, 0.2)' : isDraw ? 'rgba(56, 189, 248, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `2px solid ${isVictory ? '#f59e0b' : isDraw ? '#38bdf8' : '#ef4444'}`,
            marginBottom: '14px',
          }}
        >
          {isVictory ? (
            <Trophy size={36} color="#f59e0b" />
          ) : isDraw ? (
            <Award size={36} color="#38bdf8" />
          ) : (
            <Award size={36} color="#ef4444" />
          )}
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            margin: '0 0 8px',
            color: isVictory ? '#fbbf24' : isDraw ? '#38bdf8' : '#f87171',
            letterSpacing: '-0.02em',
          }}
        >
          {isVictory ? 'VICTORY!' : isDraw ? 'DRAW MATCH' : 'DEFEAT'}
        </h1>

        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', margin: '0 0 20px' }}>
          {isVictory
            ? 'Outstanding performance! You outscored your rival in accuracy and speed.'
            : isDraw
            ? 'Evenly matched duel! Both contenders showed immense STEM mastery.'
            : 'Close match! Review the questions below to strengthen your understanding.'}
        </p>

        {/* XP Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', padding: '6px 18px', borderRadius: '999px', fontWeight: 800, color: '#fbbf24', fontSize: '0.95rem', marginBottom: '28px' }}>
          <Award size={18} />
          +{gainedXp} XP EARNED
        </div>
      </div>

      {/* Final Scoreboard Card */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(45, 212, 191, 0.25)',
          borderRadius: '16px',
          padding: '24px 32px',
          maxWidth: '520px',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <PlayerAvatar size={54} />
          <div style={{ fontWeight: 800, color: '#38bdf8' }}>{userName}</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>{userScore}</div>
        </div>

        <div style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 900, color: '#64748b', fontSize: '1.4rem' }}>
          VS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <OpponentAvatar size={54} isAI={isAI} />
          <div style={{ fontWeight: 800, color: '#c084fc' }}>{opponentName}</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>{oppScore}</div>
        </div>
      </div>

      {/* Question Review List */}
      {history.length > 0 && (
        <div
          style={{
            background: 'var(--paper-warm, #faf7ec)',
            color: 'var(--ink, #101a3a)',
            borderRadius: '16px',
            border: '2px solid #e7decb',
            padding: '20px',
            maxWidth: '680px',
            width: '100%',
            textAlign: 'left',
            marginBottom: '32px',
          }}
        >
          <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', color: '#475569', letterSpacing: '0.05em' }}>
            Round Question Breakdown
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((h, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '10px 14px',
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  {h.isUserCorrect ? (
                    <CheckCircle2 size={18} color="#15803d" />
                  ) : (
                    <XCircle size={18} color="#dc2626" />
                  )}
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Round {h.round}: {h.question}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: h.isUserCorrect ? '#15803d' : '#dc2626',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h.isUserCorrect ? '+10 pts' : '0 pts'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          data-pixel-btn="true"
          onClick={onRematch}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            background: '#0d9488',
            color: '#fff',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 3px 0 #0f766e',
          }}
        >
          <RotateCcw size={16} />
          Rematch
        </button>

        <button
          type="button"
          data-pixel-btn="true"
          onClick={onExitLobby}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.75)',
            color: '#2dd4bf',
            border: '1px solid rgba(45, 212, 191, 0.35)',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          <Home size={16} />
          Return to Arena Lobby
        </button>
      </div>
    </div>
  );
}
