import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  PaperCard,
  Tape,
  Pin,
  Tag,
  Stamp,
  StickyNote,
  Button,
  Field,
  Modal,
  ProgressBar,
  Skeleton,
  EmptyState,
  resolveSubjectKey,
} from '../components/ui';

export default function PracticeTestPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [negativeMarking, setNegativeMarking] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        setError('');
        const data = await api.getChapterTest(chapterId);
        setQuestions(data || []);
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError('Could not load chapter test. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadTest();
  }, [chapterId]);

  const handleSelectOption = (questionId, optIndex) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optIndex }));
  };

  const handleSubmitTest = async () => {
    try {
      setSubmitting(true);
      setError('');

      const formattedAnswers = questions.map((q) => {
        const qId = q._id || q.id;
        return {
          questionId: qId,
          selectedOptionIndex:
            selectedAnswers[qId] !== undefined ? selectedAnswers[qId] : -1,
        };
      });

      const result = await api.submitChapterTest(chapterId, {
        answers: formattedAnswers,
        negativeMarking,
      });

      setTestResult(result);
      window.dispatchEvent(new Event('edunova-progress-updated'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (testResult) {
      navigate(-1);
    } else {
      setShowExitModal(true);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <Skeleton lines={5} />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ maxWidth: '640px', margin: 'var(--sp-5) auto' }}>
        <EmptyState
          icon={HelpCircle}
          title="No Questions Available Yet"
          description="There are no MCQ questions configured for this chapter yet."
          actionLabel="Go Back"
          onAction={() => navigate(-1)}
        />
      </div>
    );
  }

  // Review Results View
  if (testResult) {
    const isPassing = testResult.percentage >= 60;

    return (
      <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
        <PaperCard flat style={{ padding: 'var(--sp-6)', textAlign: 'center' }}>
          <Tape tone={isPassing ? 'green' : 'kraft'} rotation="-1deg" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <Stamp variant={isPassing ? 'mastered' : 'new'} animate>
              {isPassing ? 'TEST PASSED' : 'KEEP PRACTICING'}
            </Stamp>

            <h1 className="type-h1" style={{ color: 'var(--ink)' }}>
              {testResult.score} / {testResult.totalQuestions}
            </h1>

            <p className="type-h3" style={{ color: 'var(--hand-rust)' }}>
              Score: {testResult.percentage}%
            </p>

            <p className="type-body" style={{ color: 'var(--ink-muted)' }}>
              Review each sheet below or ask Chotu to break down missed steps.
            </p>
          </div>
        </PaperCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {testResult.answers &&
            testResult.answers.map((ans, idx) => {
              const isCorrect = ans.isCorrect;
              const originalQuestion = questions.find(
                (q) => (q._id || q.id) === (ans.questionId?._id || ans.questionId)
              );
              const options = originalQuestion?.options || [];

              return (
                <PaperCard
                  key={ans.questionId || idx}
                  flat
                  style={{
                    padding: 'var(--sp-5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--sp-3)',
                  }}
                >
                  <Pin color={isCorrect ? 'green' : 'red'} position="right" />

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--sp-2)' }}>
                    <span className="type-label" style={{ color: 'var(--ink-soft)' }}>
                      QUESTION {idx + 1}
                    </span>
                    <Tag variant={isCorrect ? 'verified' : 'paper'}>
                      {isCorrect ? (
                        <CheckCircle2 size={14} strokeWidth={2} aria-hidden="true" />
                      ) : (
                        <XCircle size={14} strokeWidth={2} aria-hidden="true" />
                      )}
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Tag>
                  </div>

                  <h3 className="type-h3" style={{ color: 'var(--ink)' }}>
                    {ans.questionText || originalQuestion?.questionText}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                    {options.map((opt, optIdx) => {
                      const isStudentChoice = ans.selectedOptionIndex === optIdx;
                      const isRightAnswer = ans.correctOptionIndex === optIdx;

                      let rowClass = 'option-card';
                      if (isRightAnswer) rowClass += ' option-card--correct';
                      else if (isStudentChoice) rowClass += ' option-card--wrong';

                      return (
                        <div key={optIdx} className={rowClass} style={{ cursor: 'default' }}>
                          <span className="option-card__letter">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="type-body" style={{ flex: 1 }}>
                            {opt}
                          </span>
                          {isStudentChoice ? (
                            <span className="type-label" style={{ color: isRightAnswer ? 'var(--emerald-800)' : 'var(--red-600)' }}>
                              {isRightAnswer ? '[Your Answer: Correct]' : '[Your Answer: Incorrect]'}
                            </span>
                          ) : isRightAnswer ? (
                            <span className="type-label" style={{ color: 'var(--emerald-800)' }}>
                              [Correct Answer]
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {ans.explanation ? (
                    <StickyNote tone="yellow" body rotation="-0.3deg" style={{ maxWidth: '100%' }}>
                      <strong>Explanation:</strong> {ans.explanation}
                    </StickyNote>
                  ) : null}

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="note"
                      size="sm"
                      onClick={() => {
                        const studentChoiceText = options[ans.selectedOptionIndex] || 'None';
                        const correctChoiceText = options[ans.correctOptionIndex] || 'Correct Option';
                        const prompt = `I attempted this CBSE Class ${user?.classLevel || 10} question: "${ans.questionText || originalQuestion?.questionText}". I chose "${studentChoiceText}", but the correct answer is "${correctChoiceText}". Can you explain step by step why and teach me this concept clearly?`;
                        navigate('/mentor', {
                          state: { prefill: prompt, subject: originalQuestion?.subject || 'Science' },
                        });
                      }}
                    >
                      <Sparkles size={15} strokeWidth={2} aria-hidden="true" />
                      Explain with Saarthi
                    </Button>
                  </div>
                </PaperCard>
              );
            })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--sp-2)' }}>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Finish & Return to Chapter
          </Button>
        </div>
      </div>
    );
  }

  // Active Single-Question Sheet View
  const currentQuestion = questions[currentIndex];
  const currentQId = currentQuestion._id || currentQuestion.id;
  const selectedIndex = selectedAnswers[currentQId];
  const answeredCount = Object.keys(selectedAnswers).length;
  const subjectKey = resolveSubjectKey(currentQuestion.subject || 'maths');

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--sp-3)',
        }}
      >
        <Button variant="dark" size="sm" onClick={handleBackClick}>
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Exit Test
        </Button>

        <Tag variant="paper">
          Question {currentIndex + 1} of {questions.length}
        </Tag>

        <div
          style={{
            background: 'var(--paper)',
            border: '1px solid var(--paper-edge)',
            borderRadius: 'var(--r-md)',
            padding: '2px 10px',
          }}
        >
          <Field
            as="checkbox"
            checked={negativeMarking}
            onChange={(e) => setNegativeMarking(e.target.checked)}
            label="Negative marking (-0.25)"
          />
        </div>
      </div>

      {error ? (
        <StickyNote tone="pink" body role="alert" style={{ maxWidth: '100%' }}>
          {error}
        </StickyNote>
      ) : null}

      <PaperCard flat style={{ padding: 'var(--sp-6)' }}>
        <Tape tone="yellow" rotation="-1deg" />

        <div style={{ marginBottom: 'var(--sp-4)' }}>
          <ProgressBar
            value={Math.round(((currentIndex + 1) / questions.length) * 100)}
            subject={subjectKey}
            label={`${answeredCount} of ${questions.length} answered`}
            showPercent
          />
        </div>

        <h2 className="type-h2" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-5)' }}>
          {currentQuestion.questionText}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {(currentQuestion.options || []).map((option, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                className={`option-card${isSelected ? ' option-card--selected' : ''}`}
                onClick={() => handleSelectOption(currentQId, idx)}
                aria-pressed={isSelected ? 'true' : 'false'}
              >
                <span className={`option-card__letter subject-tab--${subjectKey}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="type-body" style={{ flex: 1 }}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--sp-3)',
            marginTop: 'var(--sp-6)',
            paddingTop: 'var(--sp-4)',
            borderTop: '1px solid var(--paper-border-warm)',
          }}
        >
          <Button
            variant="ghost"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          >
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            Previous
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button
              variant="primary"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            >
              Next Question
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          ) : (
            <Button variant="kraft" onClick={handleSubmitTest} disabled={submitting}>
              <ClipboardCheck size={17} strokeWidth={2} aria-hidden="true" />
              {submitting ? 'Grading Test...' : 'Submit Practice Test'}
            </Button>
          )}
        </div>
      </PaperCard>

      {/* Exit Confirmation Modal */}
      <Modal
        open={showExitModal}
        onClose={() => setShowExitModal(false)}
        title="Leave Practice Test?"
        tapeTone="kraft"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowExitModal(false)}>
              Stay & Finish
            </Button>
            <Button variant="danger" size="sm" onClick={() => navigate(-1)}>
              Leave Test
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <AlertTriangle size={24} strokeWidth={2} style={{ color: 'var(--amber-500)', flexShrink: 0 }} aria-hidden="true" />
          <p className="type-body" style={{ color: 'var(--ink-muted)' }}>
            Your current answers are not submitted yet. Leave anyway?
          </p>
        </div>
      </Modal>
    </div>
  );
}
