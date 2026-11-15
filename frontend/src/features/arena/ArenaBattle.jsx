import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Home,
  ArrowRight,
  Flame,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { PlayerAvatar, OpponentAvatar } from './ArenaAvatars';

const ROUND_TIME = 45; // 45 seconds per question

export default function ArenaBattle({
  questions = [],
  mode = 'pvp',
  isAI = false,
  aiDifficulty = 'challenger',
  opponentName = 'Player 2',
  opponentTitle = 'STEM Challenger',
  userName = 'You',
  onFinishMatch,
  onExitLobby,
}) {
  const [currentRound, setCurrentRound] = useState(0); // 0 to 4 (5 rounds)
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [selectedOption, setSelectedOption] = useState(null);
  const [roundEnded, setRoundEnded] = useState(false);

  // Scores
  const [userScore, setUserScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [roundHistory, setRoundHistory] = useState([]);

  // Opponent simulation state
  const [oppStatus, setOppStatus] = useState('Thinking...');
  const [oppAnswered, setOppAnswered] = useState(false);
  const [oppIsCorrect, setOppIsCorrect] = useState(null);

  const currentQ = questions[currentRound] || questions[0];
  const timerRef = useRef(null);

  // Simulated AI/Opponent answering timing and accuracy based on difficulty or live peer
  useEffect(() => {
    setOppStatus('Analyzing question...');
    setOppAnswered(false);
    setOppIsCorrect(null);

    let delay = 6000; // default 6s
    let accuracy = 0.75;

    if (isAI) {
      if (aiDifficulty === 'apprentice') {
        delay = Math.floor(Math.random() * 5000) + 7000; // 7-12s
        accuracy = 0.65;
      } else if (aiDifficulty === 'challenger') {
        delay = Math.floor(Math.random() * 4000) + 4000; // 4-8s
        accuracy = 0.82;
      } else {
        // master
        delay = Math.floor(Math.random() * 3000) + 3000; // 3-6s
        accuracy = 0.94;
      }
    } else {
      // PvP live peer simulation
      delay = Math.floor(Math.random() * 5000) + 4500;
      accuracy = 0.78;
    }

    const oppTimer = setTimeout(() => {
      const isCorrect = Math.random() < accuracy;
      setOppAnswered(true);
      setOppIsCorrect(isCorrect);
      setOppStatus(`Locked in answer (${(delay / 1000).toFixed(1)}s)`);

      if (isCorrect) {
        setOppScore((s) => s + 10);
      }
    }, delay);

    return () => clearTimeout(oppTimer);
  }, [currentRound, isAI, aiDifficulty]);

  // Round countdown timer
  useEffect(() => {
    setTimeLeft(ROUND_TIME);
    setRoundEnded(false);
    setSelectedOption(null);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentRound]);

  const handleTimeExpire = () => {
    setRoundEnded(true);
  };

  const handleSelectOption = (idx) => {
    if (roundEnded || selectedOption !== null) return;
    clearInterval(timerRef.current);

    setSelectedOption(idx);
    setRoundEnded(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setUserScore((s) => s + 10);
    }

    setRoundHistory((prev) => [
      ...prev,
      {
        round: currentRound + 1,
        question: currentQ.question,
        userPick: idx,
        correctIndex: currentQ.correctIndex,
        isUserCorrect: isCorrect,
      },
    ]);
  };

  const handleNextRound = () => {
    if (currentRound + 1 < Math.min(questions.length, 5)) {
      setCurrentRound((r) => r + 1);
    } else {
      // Battle finished
      const isVictory = userScore > oppScore;
      const gainedXp = isVictory ? 50 : userScore === oppScore ? 30 : 20;
      onFinishMatch({
        userScore,
        oppScore,
        gainedXp,
        isVictory,
        history: roundHistory,
      });
    }
  };

  const isMatchFinished = currentRound >= 4 && roundEnded;
  const isTimeUrgent = timeLeft <= 10;
  const timerPercent = (timeLeft / ROUND_TIME) * 100;

  return (
    <div className="arena-board">
      {/* Top Match Status Bar */}
      <div className="arena-battle-header">
        <div className="arena-battle-scores">
          <span style={{ color: '#2dd4bf', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={18} />
            ROUND {currentRound + 1}/5
          </span>
          <span style={{ color: '#64748b' }}>|</span>
          <span style={{ color: '#ffffff' }}>
            YOU: <strong style={{ color: '#38bdf8' }}>{userScore}</strong> &nbsp;—&nbsp; OPP:{' '}
            <strong style={{ color: '#c084fc' }}>{oppScore}</strong>
          </span>
        </div>

        <div className="arena-timer-wrap">
          <Clock size={16} color={isTimeUrgent ? '#ef4444' : '#2dd4bf'} />
          <div className="arena-timer-bar">
            <div
              className={`arena-timer-fill${isTimeUrgent ? ' is-urgent' : ''}`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 800,
              fontSize: '0.95rem',
              color: isTimeUrgent ? '#ef4444' : '#ffffff',
              minWidth: '32px',
              textAlign: 'right',
            }}
          >
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Main Battle Grid: Question Workbench + Right Stats Sidebar */}
      <div className="arena-battle-grid">
        {/* Left: Question Card */}
        <div className="arena-q-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span
              style={{
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {currentQ.subject} • {currentQ.classLevel}
            </span>

            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>
              {currentQ.topic}
            </span>
          </div>

          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--ink, #101a3a)',
              lineHeight: 1.45,
              marginBottom: '20px',
            }}
          >
            {currentQ.question}
          </h2>

          {/* 4 Interactive MCQ Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQ.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctIndex;

              let btnClass = 'arena-option-btn';
              if (roundEnded) {
                if (isCorrectAnswer) btnClass += ' is-correct';
                else if (isSelected && !isCorrectAnswer) btnClass += ' is-wrong';
              } else if (isSelected) {
                btnClass += ' is-selected';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className={btnClass}
                  disabled={roundEnded}
                  onClick={() => handleSelectOption(idx)}
                >
                  <span className="arena-opt-key">{letter}</span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {roundEnded && isCorrectAnswer && (
                    <CheckCircle2 size={18} color="#15803d" />
                  )}
                  {roundEnded && isSelected && !isCorrectAnswer && (
                    <XCircle size={18} color="#dc2626" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Round Feedback and Explanation */}
          {roundEnded && (
            <div
              style={{
                marginTop: '18px',
                padding: '14px 16px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: selectedOption === currentQ.correctIndex ? '#15803d' : '#dc2626',
                  }}
                >
                  {selectedOption === currentQ.correctIndex
                    ? '✔ Correct! +10 Points'
                    : selectedOption === null
                    ? '⏳ Time Out!'
                    : `✘ Incorrect. Correct is Option ${String.fromCharCode(65 + currentQ.correctIndex)}.`}
                </span>

                <button
                  type="button"
                  data-pixel-btn="true"
                  onClick={handleNextRound}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: '#0d9488',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 0 #0f766e',
                  }}
                >
                  {currentRound + 1 >= 5 ? 'See Final Results' : 'Next Round'}
                  <ArrowRight size={14} />
                </button>
              </div>

              {currentQ.explanation && (
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.45 }}>
                  <strong>Explanation:</strong> {currentQ.explanation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar Widgets */}
        <div>
          {/* 1. Opponent Widget */}
          <div className="arena-side-widget">
            <div className="arena-side-title">OPPONENT // LIVE MATCH</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <OpponentAvatar size={46} isAI={isAI} />
              <div>
                <div style={{ fontWeight: 800, color: '#f3e8ff', fontSize: '0.95rem' }}>
                  {opponentName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#c084fc', textTransform: 'uppercase' }}>
                  {opponentTitle}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {!oppAnswered ? (
                <div className="arena-thinking-pulse">
                  <span className="arena-thinking-dot" />
                  <span>{oppStatus}</span>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#86efac', fontWeight: 700 }}>
                  ✔ {oppStatus}
                </div>
              )}
            </div>
          </div>

          {/* 2. Scoreboard Widget */}
          <div className="arena-side-widget">
            <div className="arena-side-title">SCOREBOARD</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>{userName}</span>
                  <span style={{ fontWeight: 800 }}>{userScore} pts</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (userScore / 50) * 100)}%`, height: '100%', background: '#38bdf8', transition: 'width 0.4s ease' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: '#c084fc', fontWeight: 700 }}>{opponentName}</span>
                  <span style={{ fontWeight: 800 }}>{oppScore} pts</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (oppScore / 50) * 100)}%`, height: '100%', background: '#c084fc', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Your Profile Widget */}
          <div className="arena-side-widget" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PlayerAvatar size={42} />
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{userName}</div>
              <div style={{ fontSize: '0.75rem', color: '#2dd4bf', fontWeight: 700 }}>
                ⚡ STEM Challenger
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
