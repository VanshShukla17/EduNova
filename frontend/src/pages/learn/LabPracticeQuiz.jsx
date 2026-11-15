import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PaperCard, Tag } from '../../components/ui';

/**
 * Shared practice check card list used in math interactive labs
 * (Trigonometry and Conic Sections).
 */
export default function LabPracticeQuiz({ quizData }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});

  const handleQuizAnswer = (qId, optionIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    setQuizResults((prev) => ({
      ...prev,
      [qId]: optionIdx === quizData[qId].correct,
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      {Object.entries(quizData).map(([qKey, qItem], idx) => {
        const isAnswered = selectedAnswers[qKey] !== undefined;
        const isCorrect = quizResults[qKey];
        return (
          <PaperCard key={qKey} flat>
            <div style={{ marginBottom: 'var(--sp-2)' }}>
              <Tag variant="paper">Question {idx + 1}</Tag>
            </div>
            <h3 className="type-h3" style={{ marginBottom: 'var(--sp-3)' }}>
              {qItem.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
              {qItem.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[qKey] === optIdx;
                let stateClass = '';
                if (isAnswered) {
                  if (optIdx === qItem.correct) stateClass = ' is-correct';
                  else if (isSelected) stateClass = ' is-wrong';
                } else if (isSelected) {
                  stateClass = ' is-selected';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    className={`option-card${stateClass}`}
                    onClick={() => handleQuizAnswer(qKey, optIdx)}
                  >
                    <span className="option-card__letter">{String.fromCharCode(65 + optIdx)}</span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {isAnswered && optIdx === qItem.correct ? (
                      <CheckCircle2 size={16} style={{ color: 'var(--emerald-600)', flexShrink: 0 }} />
                    ) : null}
                  </button>
                );
              })}
            </div>

            {isAnswered ? (
              <div
                className="type-small"
                style={{
                  padding: 'var(--sp-3)',
                  borderRadius: 'var(--r-sm)',
                  background: isCorrect ? 'var(--emerald-soft)' : 'var(--red-soft)',
                  border: `1px solid ${isCorrect ? 'var(--emerald-600)' : 'var(--red-border)'}`,
                  color: isCorrect ? 'var(--emerald-800)' : 'var(--red-ink)',
                }}
              >
                <strong>{isCorrect ? 'Correct!' : 'Incorrect.'}</strong> {qItem.explanation}
              </div>
            ) : null}
          </PaperCard>
        );
      })}
    </div>
  );
}
