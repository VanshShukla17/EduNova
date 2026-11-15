import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { ARENA_QUESTIONS } from '../features/arena/arenaQuestions';
import ArenaLobby from '../features/arena/ArenaLobby';
import ArenaMatchIntro from '../features/arena/ArenaMatchIntro';
import ArenaBattle from '../features/arena/ArenaBattle';
import ArenaResults from '../features/arena/ArenaResults';
import '../features/arena/arena.css';

const OPPONENT_NAMES = [
  'Aarav Sharma',
  'Priya Patel',
  'Rohan Mehta',
  'Ananya Iyer',
  'Kabir Verma',
  'Ishita Gupta',
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function ArenaPage() {
  const { user } = useAuth();

  const [view, setView] = useState('lobby'); // 'lobby' | 'intro' | 'battle' | 'results'
  const [mode, setMode] = useState('pvp'); // 'pvp' | 'ai'
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [aiDifficulty, setAiDifficulty] = useState('challenger');

  const [opponent, setOpponent] = useState({
    name: 'Player 2',
    title: 'STEM Challenger',
    isAI: false,
  });

  const [activeQuestions, setActiveQuestions] = useState([]);
  const [matchResult, setMatchResult] = useState(null);

  const userName = user?.name || 'You';

  // Prepare 5 questions for the duel
  const getMatchQuestions = () => {
    let pool = ARENA_QUESTIONS;
    if (selectedSubject !== 'all') {
      pool = ARENA_QUESTIONS.filter(
        (q) => q.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
    }
    if (pool.length < 5) pool = ARENA_QUESTIONS;
    return shuffle(pool).slice(0, 5);
  };

  const handleStartPvP = () => {
    const randomName = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
    setOpponent({
      name: randomName,
      title: 'CBSE Live Challenger',
      isAI: false,
    });
    setMode('pvp');
    setActiveQuestions(getMatchQuestions());
    setView('intro');
  };

  const handleStartAI = () => {
    const difficultyTitles = {
      apprentice: 'Quantum Apprentice',
      challenger: 'Adaptive STEM AI',
      master: 'Neural Grandmaster',
    };
    setOpponent({
      name: 'Saarthi AI Bot',
      title: difficultyTitles[aiDifficulty] || 'Adaptive STEM AI',
      isAI: true,
    });
    setMode('ai');
    setActiveQuestions(getMatchQuestions());
    setView('intro');
  };

  const handleProceedToBattle = () => {
    setView('battle');
  };

  const handleFinishMatch = (result) => {
    setMatchResult(result);
    setView('results');
  };

  const handleRematch = () => {
    setActiveQuestions(getMatchQuestions());
    setView('intro');
  };

  const handleExitLobby = () => {
    setView('lobby');
    setMatchResult(null);
  };

  return (
    <div className="arena-container">
      {view === 'lobby' && (
        <ArenaLobby
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          aiDifficulty={aiDifficulty}
          onSelectDifficulty={setAiDifficulty}
          onStartPvP={handleStartPvP}
          onStartAI={handleStartAI}
          userXp={user?.xp || 300}
        />
      )}

      {view === 'intro' && (
        <ArenaMatchIntro
          mode={mode}
          userName={userName}
          opponentName={opponent.name}
          opponentTitle={opponent.title}
          isAI={opponent.isAI}
          onStartBattle={handleProceedToBattle}
          onBack={handleExitLobby}
        />
      )}

      {view === 'battle' && (
        <ArenaBattle
          questions={activeQuestions}
          mode={mode}
          isAI={opponent.isAI}
          aiDifficulty={aiDifficulty}
          userName={userName}
          opponentName={opponent.name}
          opponentTitle={opponent.title}
          onFinishMatch={handleFinishMatch}
          onExitLobby={handleExitLobby}
        />
      )}

      {view === 'results' && (
        <ArenaResults
          result={matchResult}
          userName={userName}
          opponentName={opponent.name}
          isAI={opponent.isAI}
          onRematch={handleRematch}
          onExitLobby={handleExitLobby}
        />
      )}
    </div>
  );
}
