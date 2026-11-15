import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Globe,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  Gauge,
  ArrowLeft,
} from 'lucide-react';
import PendulumSimulation from '../components/PendulumSimulation';
import TitrationSimulation from '../components/TitrationSimulation';
import MicroscopeSimulation from '../components/MicroscopeSimulation';
import { getLab, submitLabQuiz } from '../services/api';
import {
  HeroCard,
  PaperCard,
  Pin,
  Tag,
  Stamp,
  StickyNote,
  Button,
  Skeleton,
} from '../components/ui';

export default function VirtualLabPage() {
  const { labId } = useParams();
  const navigate = useNavigate();
  const effectiveLabId = labId || 'simple_pendulum';

  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [length, setLength] = useState(1.0);
  const [mass, setMass] = useState(0.2);
  const [gravity, setGravity] = useState(9.8);
  const [initialAngle, setInitialAngle] = useState(12);
  const [isRunning, setIsRunning] = useState(true);
  const [isSlowMotion, setIsSlowMotion] = useState(false);

  const [readout, setReadout] = useState({
    period: '2.006',
    cycles: 0,
    simTime: '0.0',
    angleDeg: '12.0',
  });

  const [activeTab, setActiveTab] = useState('procedure');
  const [useHindi, setUseHindi] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        setLoading(true);
        const data = await getLab(effectiveLabId);
        setLab(data);
        setSelectedAnswers({});
        setQuizResult(null);
      } catch (err) {
        console.error('Failed to fetch lab details:', err);
        setError('Could not load virtual lab from server. Running offline simulation mode.');
        setLab({
          labId: 'simple_pendulum',
          title: 'Simple Pendulum Experiment',
          titleHindi: 'सरल लोलक प्रयोग',
          description:
            'Investigate Simple Harmonic Motion and measure how string length and gravity change oscillation period T.',
          instructions: [
            'Adjust String Length (L) from 0.25m to 2.00m and observe the period readout.',
            'Modify Bob Mass (m) from 50g to 1000g — notice that period T stays independent of mass.',
            'Switch between Earth, Moon, Mars, and Jupiter gravity fields to compare oscillation speeds.',
            'Use Slow Motion (0.5x) to observe kinetic and potential energy exchange cleanly.',
          ],
          observationQuestions: [
            {
              question: 'If the length of a simple pendulum is quadrupled (4x), how does its time period T change?',
              options: ['Doubles (2x)', 'Halves (0.5x)', 'Increases 4x', 'Remains the same'],
              correctOptionIndex: 0,
              explanation: 'Since T = 2π√(L/g), multiplying L by 4 multiplies T by √4 = 2.',
            },
            {
              question: 'What happens to the pendulum time period if the bob mass increases from 100g to 800g?',
              options: ['Increases 8x', 'No change (independent of mass)', 'Decreases slightly', 'Doubles'],
              correctOptionIndex: 1,
              explanation: 'Mass cancels out in ma = -mg·sin(θ), so time period T is independent of mass.',
            },
            {
              question: 'Where does the same 1.0m pendulum swing slowest?',
              options: ['Earth (9.8 m/s²)', 'Moon (1.62 m/s²)', 'Jupiter (24.79 m/s²)', 'All equal'],
              correctOptionIndex: 1,
              explanation: 'Lower gravity g increases time period T = 2π√(L/g).',
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchLabData();
  }, [effectiveLabId]);

  const handleReset = () => {
    setLength(1.0);
    setMass(0.2);
    setGravity(9.8);
    setInitialAngle(12);
    setIsSlowMotion(false);
    setIsRunning(true);
  };

  const handleSelectOption = (qIdx, optIdx) => {
    if (quizResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    const questionsCount = lab?.observationQuestions?.length || 3;
    if (Object.keys(selectedAnswers).length < questionsCount) {
      alert('Please answer all observation questions before submitting.');
      return;
    }

    try {
      setSubmittingQuiz(true);
      const formattedAnswers = Object.keys(selectedAnswers).map((k) => ({
        questionIndex: Number(k),
        selectedOptionIndex: selectedAnswers[k],
      }));

      const res = await submitLabQuiz(effectiveLabId, {
        answers: formattedAnswers,
        experimentParameters: { length, mass, gravity, initialAngle },
      });
      setQuizResult(res);
    } catch {
      const questions = lab?.observationQuestions || [];
      let score = 0;
      const evalList = questions.map((q, idx) => {
        const isCorrect = selectedAnswers[idx] === q.correctOptionIndex;
        if (isCorrect) score++;
        return {
          questionIndex: idx,
          selectedOptionIndex: selectedAnswers[idx],
          correctOptionIndex: q.correctOptionIndex,
          isCorrect,
          explanation: q.explanation,
        };
      });
      setQuizResult({
        score,
        totalQuestions: questions.length,
        percentage: Math.round((score / Math.max(1, questions.length)) * 100),
        passed: score / Math.max(1, questions.length) >= 0.6,
        evaluatedAnswers: evalList,
      });
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading && !lab) {
    return <Skeleton lines={6} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
        <Button variant="dark" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back
        </Button>

        <Button
          variant={useHindi ? 'primary' : 'note'}
          size="sm"
          onClick={() => setUseHindi(!useHindi)}
        >
          <Globe size={15} strokeWidth={2} aria-hidden="true" />
          {useHindi ? 'हिंदी (Hindi)' : 'English'}
        </Button>
      </div>

      <HeroCard
        eyebrow="Interactive Lab Workbench"
        eyebrowVariant="verified"
        title={useHindi && lab?.titleHindi ? lab.titleHindi : lab?.title || 'Virtual Lab Experiment'}
        description={useHindi && lab?.descriptionHindi ? lab.descriptionHindi : lab?.description}
        actions={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            {[
              { id: 'simple_pendulum', label: 'Simple Pendulum (Physics)' },
              { id: 'acid_base_titration', label: 'Acid-Base Titration (Chemistry)' },
              { id: 'compound_microscope', label: 'Compound Microscope (Biology)' },
            ].map((labItem) => (
              <Button
                key={labItem.id}
                variant={effectiveLabId === labItem.id ? 'primary' : 'note'}
                size="sm"
                onClick={() => navigate(`/labs/${labItem.id}`)}
              >
                {labItem.label}
              </Button>
            ))}
          </div>
        }
      />

      {error ? (
        <StickyNote tone="yellow" body style={{ maxWidth: '100%' }}>
          {error}
        </StickyNote>
      ) : null}

      {/* Workbench Area */}
      {effectiveLabId === 'acid_base_titration' ? (
        <TitrationSimulation />
      ) : effectiveLabId === 'compound_microscope' ? (
        <MicroscopeSimulation />
      ) : (
        <div className="workbench">
          {/* Left Page: Apparatus Controls & Live Readouts */}
          <PaperCard flat style={{ padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <Pin color="blue" position="left" />

            <h2 className="type-h3" style={{ color: 'var(--ink)' }}>
              Experimental Variables & Controls
            </h2>

            <div className="paper-grid paper-grid--2" style={{ gap: 'var(--sp-2)' }}>
              <div className="stat-chip">
                <span>Period (T):</span>
                <strong>{readout.period} s</strong>
              </div>
              <div className="stat-chip">
                <span>Cycles:</span>
                <strong>{readout.cycles}</strong>
              </div>
              <div className="stat-chip">
                <span>Elapsed:</span>
                <strong>{readout.simTime} s</strong>
              </div>
              <div className="stat-chip">
                <span>Angle (θ):</span>
                <strong>{readout.angleDeg}°</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
              <Button
                variant={isRunning ? 'danger' : 'primary'}
                size="sm"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? <Pause size={15} /> : <Play size={15} />}
                {isRunning ? 'Pause Oscillation' : 'Resume Oscillation'}
              </Button>

              <Button
                variant={isSlowMotion ? 'kraft' : 'note'}
                size="sm"
                onClick={() => setIsSlowMotion(!isSlowMotion)}
              >
                <Gauge size={15} />
                {isSlowMotion ? 'Slow Motion: ON (0.5x)' : 'Slow Motion (0.5x)'}
              </Button>

              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw size={15} />
                Reset
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <label className="field">
                <span className="field__label">
                  {useHindi ? 'डोरी की लंबाई (L)' : 'String Length (L)'}: {length.toFixed(2)} m
                </span>
                <input
                  type="range"
                  min="0.25"
                  max="2.00"
                  step="0.05"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  style={{ accentColor: 'var(--physics)' }}
                />
              </label>

              <label className="field">
                <span className="field__label">
                  {useHindi ? 'गोलक का द्रव्यमान (m)' : 'Bob Mass (m)'}: {(mass * 1000).toFixed(0)} g
                </span>
                <input
                  type="range"
                  min="0.05"
                  max="1.00"
                  step="0.05"
                  value={mass}
                  onChange={(e) => setMass(Number(e.target.value))}
                  style={{ accentColor: 'var(--emerald-700)' }}
                />
              </label>

              <label className="field">
                <span className="field__label">
                  {useHindi ? 'प्रारंभिक कोण (θ₀)' : 'Initial Angle (θ₀)'}: {initialAngle}°
                </span>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={initialAngle}
                  onChange={(e) => setInitialAngle(Number(e.target.value))}
                  style={{ accentColor: 'var(--amber-500)' }}
                />
              </label>

              <div>
                <span className="field__label" style={{ display: 'block', marginBottom: '6px' }}>
                  {useHindi ? 'गुरुत्वाकर्षण क्षेत्र (g)' : 'Gravitational Field (g)'}: {gravity.toFixed(2)} m/s²
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                  {[
                    { name: 'Moon', g: 1.62 },
                    { name: 'Mars', g: 3.71 },
                    { name: 'Earth', g: 9.8 },
                    { name: 'Jupiter', g: 24.79 },
                  ].map((planet) => (
                    <Button
                      key={planet.name}
                      variant={Math.abs(gravity - planet.g) < 0.05 ? 'primary' : 'note'}
                      size="sm"
                      onClick={() => setGravity(planet.g)}
                    >
                      {planet.name} ({planet.g})
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </PaperCard>

          {/* Center Spiral Binder */}
          <div className="workbench__binder" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="workbench__hole" />
            ))}
          </div>

          {/* Right Page: Simulation Viewport */}
          <div className="dark-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <Tag variant="verified">LIVE SIMULATION CANVAS</Tag>
            <PendulumSimulation
              length={length}
              mass={mass}
              gravity={gravity}
              initialAngle={initialAngle}
              isRunning={isRunning}
              isSlowMotion={isSlowMotion}
              onReadoutUpdate={setReadout}
            />
          </div>
        </div>
      )}

      {/* Notebook Tabs: Procedure / Theory / Observation Quiz */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
        <Button
          variant={activeTab === 'procedure' ? 'primary' : 'note'}
          size="sm"
          onClick={() => setActiveTab('procedure')}
        >
          <BookOpen size={15} />
          {useHindi ? 'प्रयोग विधि' : 'Procedure'}
        </Button>
        <Button
          variant={activeTab === 'theory' ? 'primary' : 'note'}
          size="sm"
          onClick={() => setActiveTab('theory')}
        >
          <Sparkles size={15} />
          {useHindi ? 'भौतिक सिद्धांत' : 'Physics Theory'}
        </Button>
        <Button
          variant={activeTab === 'quiz' ? 'primary' : 'note'}
          size="sm"
          onClick={() => setActiveTab('quiz')}
        >
          <HelpCircle size={15} />
          {useHindi ? 'निष्कर्ष प्रश्नोत्तरी' : 'Observation Quiz'}
          {quizResult ? <CheckCircle2 size={14} /> : null}
        </Button>
      </div>

      {activeTab === 'procedure' ? (
        <PaperCard variant="ruled-margin" flat style={{ padding: 'var(--sp-5) var(--sp-5) var(--sp-5) 64px' }}>
          <h3 className="type-h3" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
            {useHindi ? 'प्रायोगिक चरण (Experimental Steps)' : 'Step-by-Step Lab Procedure'}
          </h3>
          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', color: 'var(--ink)' }}>
            {(useHindi && lab?.instructionsHindi?.length ? lab.instructionsHindi : lab?.instructions || []).map(
              (step, idx) => (
                <li key={idx} className="type-body">
                  {step}
                </li>
              )
            )}
          </ol>
        </PaperCard>
      ) : null}

      {activeTab === 'theory' ? (
        <PaperCard flat style={{ padding: 'var(--sp-5)' }}>
          <h3 className="type-h3" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
            {useHindi ? 'सरल लोलक का गणितीय मॉडल' : 'Mathematical Model of the Simple Pendulum'}
          </h3>
          <p className="type-body" style={{ color: 'var(--ink-muted)', marginBottom: 'var(--sp-3)' }}>
            For small angular displacements (θ ≤ 15°), the restoring force is proportional to displacement (F ≈ −mgθ), yielding Simple Harmonic Motion:
          </p>
          <div className="terminal-block" style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: 'var(--sp-4)' }}>
            T = 2π √(L / g)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', color: 'var(--ink-muted)' }}>
            <p className="type-body">
              <strong>1. Length Dependence:</strong> Period T is proportional to √L. Quadrupling length doubles T.
            </p>
            <p className="type-body">
              <strong>2. Mass Independence:</strong> Bob mass cancels out in ma = −mg·sin(θ).
            </p>
            <p className="type-body">
              <strong>3. Gravity Dependence:</strong> Lower gravity produces a slower oscillation and larger T.
            </p>
          </div>
        </PaperCard>
      ) : null}

      {activeTab === 'quiz' ? (
        <PaperCard flat style={{ padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            <h3 className="type-h3" style={{ color: 'var(--ink)' }}>
              {useHindi ? 'अवलोकन प्रश्नोत्तरी' : 'End-of-Lab Observation Quiz'}
            </h3>
            <Tag variant="paper">{lab?.observationQuestions?.length || 3} Questions</Tag>
          </div>

          {quizResult ? (
            <StickyNote tone={quizResult.passed ? 'green' : 'pink'} body style={{ maxWidth: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                {quizResult.passed ? <Award size={26} /> : <XCircle size={26} />}
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {quizResult.passed ? 'Discovery Verified! Lab Passed' : 'Keep Investigating! Retake Recommended'}
                  </div>
                  <div className="type-small">
                    Score: {quizResult.score} / {quizResult.totalQuestions} ({quizResult.percentage}%) · Minimum to pass: 60%
                  </div>
                </div>
                {quizResult.passed ? <Stamp variant="mastered">PASSED</Stamp> : null}
              </div>
            </StickyNote>
          ) : null}

          {(lab?.observationQuestions || []).map((q, qIdx) => {
            const selectedOpt = selectedAnswers[qIdx];
            const evalAnswer = quizResult?.evaluatedAnswers?.[qIdx];
            const opts = useHindi && q.optionsHindi?.length ? q.optionsHindi : q.options;

            return (
              <PaperCard
                key={q._id || qIdx}
                flat
                style={{ padding: 'var(--sp-4)', background: 'var(--paper-warm)' }}
              >
                <div className="type-body" style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
                  {qIdx + 1}. {useHindi && q.questionHindi ? q.questionHindi : q.question}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {opts.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    let rowClass = 'option-card';
                    let statusLabel = null;

                    if (evalAnswer) {
                      const isCorrect = evalAnswer.correctOptionIndex === optIdx;
                      if (isSelected && isCorrect) {
                        rowClass += ' option-card--correct';
                        statusLabel = '[Your Answer: Correct]';
                      } else if (isSelected && !isCorrect) {
                        rowClass += ' option-card--wrong';
                        statusLabel = '[Your Answer: Incorrect]';
                      } else if (isCorrect) {
                        rowClass += ' option-card--correct';
                        statusLabel = '[Correct Answer]';
                      }
                    } else if (isSelected) {
                      rowClass += ' option-card--selected';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={Boolean(quizResult)}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={rowClass}
                      >
                        <span className="option-card__letter">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="type-body" style={{ flex: 1 }}>
                          {opt}
                        </span>
                        {statusLabel ? (
                          <span className="type-label" style={{ color: statusLabel.includes('Incorrect') ? 'var(--red-600)' : 'var(--emerald-800)' }}>
                            {statusLabel}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {evalAnswer?.explanation ? (
                  <StickyNote tone="yellow" body style={{ maxWidth: '100%', marginTop: 'var(--sp-3)' }}>
                    <strong>Explanation:</strong> {evalAnswer.explanation}
                  </StickyNote>
                ) : null}
              </PaperCard>
            );
          })}

          {!quizResult ? (
            <Button variant="primary" fullWidth onClick={handleSubmitQuiz} disabled={submittingQuiz}>
              {submittingQuiz ? 'Submitting & Scoring...' : 'Submit Lab Observations'}
            </Button>
          ) : (
            <Button
              variant="kraft"
              fullWidth
              onClick={() => {
                setQuizResult(null);
                setSelectedAnswers({});
              }}
            >
              Retake Observation Quiz
            </Button>
          )}
        </PaperCard>
      ) : null}
    </div>
  );
}
