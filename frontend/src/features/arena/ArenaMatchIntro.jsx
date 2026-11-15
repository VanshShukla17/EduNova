import React, { useEffect } from 'react';
import { ArrowLeft, Play, Zap } from 'lucide-react';
import { PlayerAvatar, OpponentAvatar } from './ArenaAvatars';

export default function ArenaMatchIntro({
  mode = 'pvp',
  opponentName = 'Player 2',
  opponentTitle = 'STEM Challenger',
  isAI = false,
  userName = 'You',
  onStartBattle,
  onBack,
}) {
  return (
    <div className="arena-board">
      {/* Top Bar with Back Button and Match Type Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={onBack}
          data-back="true"
          className="arena-back-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(45, 212, 191, 0.3)',
            color: '#2dd4bf',
            padding: '6px 14px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="arena-eyebrow">
          <Zap size={13} />
          {mode === 'pvp' ? 'CIRCUIT DUEL // PVP MATCH' : 'CIRCUIT DUEL // AI BATTLE'}
        </div>
      </div>

      {/* Main Duel Matchup Presentation */}
      <div className="arena-intro-wrapper">
        <div className="arena-intro-matchup">
          {/* Left Fighter: You */}
          <div className="arena-fighter-col">
            <div
              style={{
                background: 'radial-gradient(circle, rgba(13, 148, 136, 0.3) 0%, transparent 70%)',
                padding: '16px',
                borderRadius: '50%',
              }}
            >
              <PlayerAvatar size={110} />
            </div>

            <div className="arena-fighter-box">
              <div className="arena-fighter-name">{userName}</div>
              <div className="arena-fighter-sub">STEM EXPLORER</div>
            </div>
          </div>

          {/* Center Hexagonal VS + Start Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div className="arena-vs-hexagon">
              <div className="arena-vs-hexagon-inner">
                <span className="arena-vs-text">VS</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onStartBattle}
              data-pixel-btn="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '12px',
                background: '#f59e0b',
                color: '#0f172a',
                border: 'none',
                fontWeight: 900,
                fontSize: '1rem',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.55), 0 3px 0 #b45309',
                transition: 'all 0.15s ease',
              }}
            >
              <Play size={18} fill="#0f172a" />
              TAP TO START
            </button>
          </div>

          {/* Right Fighter: Opponent */}
          <div className="arena-fighter-col">
            <div
              style={{
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)',
                padding: '16px',
                borderRadius: '50%',
              }}
            >
              <OpponentAvatar size={110} isAI={isAI} />
            </div>

            <div
              className="arena-fighter-box"
              style={{
                borderColor: 'rgba(168, 85, 247, 0.4)',
                background: 'rgba(26, 16, 49, 0.75)',
              }}
            >
              <div className="arena-fighter-name" style={{ color: '#f3e8ff' }}>
                {opponentName}
              </div>
              <div className="arena-fighter-sub" style={{ color: '#c084fc' }}>
                {opponentTitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
