import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Info,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  Award,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  PaperCard,
  Pin,
  Tag,
  StickyNote,
  Button,
  Skeleton,
  EmptyState,
} from './ui';
import { SCENES } from './diagrams/scenes';
import { STEM_DIAGRAMS, normalizeDiagramId } from './diagrams/diagramsData';
import './diagrams/diagrams.css';

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function InteractiveDiagram({ diagramData, diagramId, subjectCode, onAwardXP }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [diagram, setDiagram] = useState(diagramData || null);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [loading, setLoading] = useState(!diagramData && !!(diagramId || subjectCode));
  const [error, setError] = useState('');

  const [mode, setMode] = useState('explore'); // 'explore' | 'quiz'
  const [zoom, setZoom] = useState(1);

  // Quiz state
  const [flash, setFlash] = useState(null); // { id, ok }
  const [quizState, setQuizState] = useState(null); // { order, index, tries, firstTry, score, xp, status, wrongId }

  const isHindi = user?.language === 'hi';

  // Load diagram data
  useEffect(() => {
    if (diagramData) {
      const canonicalKey = normalizeDiagramId(diagramData);
      const canonicalMatch = STEM_DIAGRAMS.find((d) => d.id === canonicalKey);
      if (canonicalMatch) {
        setDiagram({
          ...diagramData,
          ...canonicalMatch,
          dbId: diagramData.id || diagramData._id || diagramData.dbId,
          ...(diagramData.titleHindi ? { titleHindi: diagramData.titleHindi } : {}),
        });
      } else {
        setDiagram(diagramData);
      }
      return;
    }

    const idToFetch = diagramId || subjectCode;
    if (!idToFetch) return;

    // First check local STEM curriculum
    const localMatch = STEM_DIAGRAMS.find(
      (d) => d.id === normalizeDiagramId(idToFetch) || d.subject === String(idToFetch).toLowerCase()
    );

    if (localMatch) {
      setDiagram(localMatch);
      setLoading(false);
      return;
    }

    async function fetchDiagram() {
      try {
        setLoading(true);
        setError('');
        const data = await api.getDiagramById(idToFetch);
        if (data) {
          const norm = normalizeDiagramId(data);
          const matched = STEM_DIAGRAMS.find((d) => d.id === norm);
          setDiagram(
            matched
              ? {
                  ...data,
                  ...matched,
                  dbId: data.id || data._id,
                  ...(data.titleHindi ? { titleHindi: data.titleHindi } : {}),
                }
              : data
          );
        }
      } catch (err) {
        console.warn('Backend diagram load failed, checking STEM curriculum:', err);
        if (localMatch) {
          setDiagram(localMatch);
        } else {
          setError('Interactive diagram could not be loaded.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDiagram();
  }, [diagramData, diagramId, subjectCode]);

  // Normalize parts and elements
  const allParts = useMemo(() => {
    if (!diagram) return [];
    if (diagram.parts && diagram.parts.length > 0) return diagram.parts;
    if (diagram.elements && diagram.elements.length > 0) {
      return diagram.elements.map((el) => ({
        id: el.id,
        name: el.label || el.name || el.id,
        label: el.label || el.name || el.id,
        labelHindi: el.labelHindi,
        function: el.function || (isHindi ? 'विस्तृत वैज्ञानिक कार्य' : 'Scientific functional component'),
        explanation: el.explanation || '',
        explanationHindi: el.explanationHindi || '',
        attributes: el.attributes,
        type: el.type,
        shape: el.shape,
      }));
    }
    return [];
  }, [diagram, isHindi]);

  const partsById = useMemo(() => {
    return Object.fromEntries(allParts.map((p) => [p.id, p]));
  }, [allParts]);

  // Flash reset timer (for wrong answer feedback)
  useEffect(() => {
    if (!flash || flash.ok) return undefined;
    const timer = setTimeout(() => setFlash(null), 750);
    return () => clearTimeout(timer);
  }, [flash]);

  // Mode switching & Quiz initiation
  const startQuiz = () => {
    if (allParts.length === 0) return;
    setSelectedElementId(null);
    setFlash(null);
    const order = shuffle(allParts.map((p) => p.id)).slice(0, Math.min(allParts.length, 8));
    setQuizState({
      order,
      index: 0,
      tries: 0,
      firstTry: 0,
      score: 0,
      xp: 0,
      status: 'asking', // 'asking' | 'correct' | 'done'
      wrongId: null,
    });
  };

  const handleModeSwitch = (nextMode) => {
    setMode(nextMode);
    setFlash(null);
    setSelectedElementId(null);
    if (nextMode === 'quiz') {
      startQuiz();
    }
  };

  // Handle clicking a part in the diagram
  const handlePartClick = (partId) => {
    if (mode === 'explore') {
      setSelectedElementId((prev) => (prev === partId ? null : partId));
      return;
    }

    if (mode === 'quiz' && quizState && quizState.status === 'asking') {
      const targetId = quizState.order[quizState.index];
      if (partId === targetId) {
        const gainedXp = quizState.tries === 0 ? 10 : 5;
        if (onAwardXP) onAwardXP(gainedXp);
        setFlash({ id: partId, ok: true });
        setQuizState((prev) => ({
          ...prev,
          status: 'correct',
          score: prev.score + 1,
          xp: prev.xp + gainedXp,
          firstTry: prev.firstTry + (prev.tries === 0 ? 1 : 0),
          wrongId: null,
        }));
      } else {
        setFlash({ id: partId, ok: false });
        setQuizState((prev) => ({
          ...prev,
          tries: prev.tries + 1,
          wrongId: partId,
        }));
      }
    }
  };

  const handleNextQuizQuestion = () => {
    setFlash(null);
    if (!quizState) return;
    if (quizState.index + 1 >= quizState.order.length) {
      setQuizState((prev) => ({ ...prev, status: 'done' }));
    } else {
      setQuizState((prev) => ({
        ...prev,
        index: prev.index + 1,
        tries: 0,
        status: 'asking',
        wrongId: null,
      }));
    }
  };

  const handleAskSaarthi = (element) => {
    if (!element || !diagram) return;
    const elementName = isHindi && element.labelHindi ? element.labelHindi : (element.label || element.name);
    const prompt = `I am studying the "${diagram.title}" diagram in ${diagram.subjectCode || diagram.subject || 'STEM'}. Specifically, can you explain the function of the "${elementName}" and how it interacts with the rest of the system?`;
    navigate('/mentor', {
      state: { prefill: prompt, subject: diagram.subjectCode || diagram.subject || 'Science' },
    });
  };

  if (loading) return <Skeleton lines={5} />;

  if (error || !diagram) {
    return (
      <EmptyState
        title="Diagram Not Available"
        description={error || 'Could not load diagram elements.'}
      />
    );
  }

  // Look up custom Scene component
  const sceneKey = normalizeDiagramId(diagram);
  const SceneComponent = SCENES[sceneKey];

  // Helper function passed to custom SVG scene components
  const partProps = (id) => ({
    className: [
      'dg-part',
      mode === 'explore' && selectedElementId === id && 'is-selected',
      flash?.id === id && (flash.ok ? 'is-correct' : 'is-wrong'),
    ]
      .filter(Boolean)
      .join(' '),
    role: 'button',
    tabIndex: 0,
    'aria-label': mode === 'quiz' ? 'Diagram component' : (partsById[id]?.name || id),
    onClick: (e) => {
      e.stopPropagation();
      handlePartClick(id);
    },
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handlePartClick(id);
      }
    },
  });

  const selectedPart = selectedElementId ? partsById[selectedElementId] : null;
  const currentQuizTarget = quizState && quizState.status !== 'done' ? partsById[quizState.order[quizState.index]] : null;
  const wrongClickedPart = quizState?.wrongId ? partsById[quizState.wrongId] : null;

  return (
    <PaperCard flat style={{ padding: 'var(--sp-5)' }}>
      <Pin color="blue" position="right" />

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--sp-3)',
          marginBottom: 'var(--sp-4)',
        }}
      >
        <div>
          <h2 className="type-h2" style={{ color: 'var(--ink)' }}>
            {isHindi && diagram.titleHindi ? diagram.titleHindi : diagram.title}
          </h2>
          {diagram.description ? (
            <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
              {diagram.description}
            </p>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', alignItems: 'center' }}>
          <Button
            variant={mode === 'explore' ? 'primary' : 'note'}
            size="sm"
            onClick={() => handleModeSwitch('explore')}
          >
            <Info size={14} strokeWidth={2} aria-hidden="true" />
            Explore
          </Button>

          <Button
            variant={mode === 'quiz' ? 'primary' : 'note'}
            size="sm"
            onClick={() => handleModeSwitch('quiz')}
          >
            <HelpCircle size={14} strokeWidth={2} aria-hidden="true" />
            Identify Quiz
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
            aria-label="Zoom out"
          >
            <ZoomOut size={14} strokeWidth={2} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.min(1.8, Number((z + 0.15).toFixed(2))))}
            aria-label="Zoom in"
          >
            <ZoomIn size={14} strokeWidth={2} />
          </Button>
        </div>
      </div>

      {/* Quiz Top Status Bar */}
      {mode === 'quiz' && quizState ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--sp-2)',
            marginBottom: 'var(--sp-3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <Tag variant="verified">
              <CheckCircle2 size={13} strokeWidth={2} aria-hidden="true" />
              Score: {quizState.score} / {quizState.order.length}
            </Tag>
            {quizState.xp > 0 && (
              <Tag variant="primary">
                <Award size={13} strokeWidth={2} aria-hidden="true" />
                +{quizState.xp} XP
              </Tag>
            )}
          </div>
          <Button variant="note" size="sm" onClick={startQuiz}>
            <RotateCcw size={13} strokeWidth={2} aria-hidden="true" />
            Reset Quiz
          </Button>
        </div>
      ) : null}

      {/* Interactive SVG Canvas */}
      <div className="dg-canvas-wrapper">
        <svg
          viewBox={diagram.viewBox || diagram.svgViewBox || '0 0 800 480'}
          style={{ width: `${Math.round(zoom * 100)}%`, maxWidth: zoom === 1 ? '100%' : 'none' }}
          role="group"
          aria-label={diagram.title}
          onClick={() => mode === 'explore' && setSelectedElementId(null)}
        >
          {SceneComponent ? (
            <SceneComponent part={partProps} labels={mode === 'explore'} />
          ) : (
            // Fallback generic renderer for custom DB elements without dedicated SVG scenes
            allParts.map((elem) => {
              const isSelected = mode === 'explore' && selectedElementId === elem.id;
              const isWrong = flash?.id === elem.id && !flash.ok;
              const isCorrect = flash?.id === elem.id && flash.ok;
              const attrs = elem.attributes || {};

              let strokeColor = isSelected ? 'var(--physics, #2563eb)' : 'var(--ink-muted, #64748b)';
              let fillColor = isSelected ? 'var(--physics-soft, #dbeafe)' : 'var(--paper-field, #f8fafc)';
              const strokeWidth = isSelected ? Number(attrs.strokeWidth || 2.5) + 2 : attrs.strokeWidth || 2.5;

              if (isCorrect) {
                strokeColor = 'var(--emerald-700, #15803d)';
                fillColor = 'var(--emerald-soft, #dcfce7)';
              } else if (isWrong) {
                strokeColor = 'var(--red-600, #dc2626)';
                fillColor = 'var(--red-soft, #fee2e2)';
              }

              const displayText =
                mode === 'quiz'
                  ? '?'
                  : isHindi && elem.labelHindi
                  ? elem.labelHindi
                  : (elem.label || elem.name);

              const shapeProps = {
                onClick: (e) => {
                  e.stopPropagation();
                  handlePartClick(elem.id);
                },
                style: { cursor: 'pointer' },
                className: 'dg-part',
              };

              if (elem.type === 'rect' || elem.shape === 'rect') {
                return (
                  <g key={elem.id} {...shapeProps}>
                    <rect
                      x={attrs.x || 0}
                      y={attrs.y || 0}
                      width={attrs.width || 80}
                      height={attrs.height || 40}
                      rx={attrs.rx || 6}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                    />
                    <text
                      x={Number(attrs.x || 0) + Number(attrs.width || 80) / 2}
                      y={Number(attrs.y || 0) + Number(attrs.height || 40) / 2 + 5}
                      textAnchor="middle"
                      fill="var(--ink, #1f2937)"
                      fontSize="11"
                      fontWeight="700"
                      pointerEvents="none"
                    >
                      {displayText}
                    </text>
                  </g>
                );
              }

              return (
                <g key={elem.id} {...shapeProps}>
                  <circle
                    cx={attrs.cx || 50}
                    cy={attrs.cy || 50}
                    r={attrs.r || 30}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                  />
                  <text
                    x={attrs.cx || 50}
                    y={Number(attrs.cy || 50) + 4}
                    textAnchor="middle"
                    fill="var(--ink, #1f2937)"
                    fontSize="11"
                    fontWeight="700"
                    pointerEvents="none"
                  >
                    {displayText}
                  </text>
                </g>
              );
            })
          )}
        </svg>
      </div>

      {/* Interactive Explanations & Quiz Prompts */}
      <div style={{ marginTop: 'var(--sp-4)' }}>
        {mode === 'explore' && !selectedPart && (
          <p
            className="type-small"
            style={{
              color: 'var(--ink-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Info size={15} strokeWidth={2} aria-hidden="true" />
            {isHindi
              ? 'जानकारी देखने के लिए ऊपर दिए गए किसी भी घटक पर क्लिक करें।'
              : 'Tap any component in the diagram above to read its scientific function and explanation.'}
          </p>
        )}

        {mode === 'explore' && selectedPart && (
          <StickyNote tone="yellow" body rotation="-0.3deg" style={{ maxWidth: '100%' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                flexWrap: 'wrap',
                marginBottom: 'var(--sp-2)',
              }}
            >
              <h3 className="type-h3" style={{ color: 'var(--ink)' }}>
                {isHindi && selectedPart.labelHindi ? selectedPart.labelHindi : (selectedPart.label || selectedPart.name)}
              </h3>
              <Button variant="primary" size="sm" onClick={() => handleAskSaarthi(selectedPart)}>
                <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
                Ask Saarthi
              </Button>
            </div>

            {selectedPart.function && (
              <p
                className="type-body"
                style={{
                  fontWeight: 600,
                  color: 'var(--color-primary, #2563eb)',
                  marginBottom: 'var(--sp-1)',
                }}
              >
                {selectedPart.function}
              </p>
            )}

            <p className="type-body" style={{ color: 'var(--ink)' }}>
              {isHindi && selectedPart.explanationHindi
                ? selectedPart.explanationHindi
                : selectedPart.explanation}
            </p>
          </StickyNote>
        )}

        {/* Quiz Prompt */}
        {mode === 'quiz' && quizState && quizState.status !== 'done' && currentQuizTarget && (
          <StickyNote tone="blue" body rotation="-0.2deg" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-2)' }}>
              <span className="type-label" style={{ color: 'var(--ink-muted)' }}>
                QUESTION {quizState.index + 1} OF {quizState.order.length}
              </span>
            </div>

            <h3 className="type-h3" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>
              Tap the: <span style={{ color: 'var(--color-primary, #2563eb)' }}>
                {isHindi && currentQuizTarget.labelHindi ? currentQuizTarget.labelHindi : (currentQuizTarget.label || currentQuizTarget.name)}
              </span>
            </h3>

            {quizState.status === 'asking' && wrongClickedPart && (
              <p className="type-small" style={{ color: 'var(--red-600, #dc2626)', fontWeight: 600 }}>
                That was the {isHindi && wrongClickedPart.labelHindi ? wrongClickedPart.labelHindi : (wrongClickedPart.label || wrongClickedPart.name)}. Try again!
              </p>
            )}

            {quizState.status === 'correct' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                <p className="type-small" style={{ color: 'var(--emerald-800, #15803d)', fontWeight: 700 }}>
                  ✔ Correct! +{quizState.tries === 0 ? 10 : 5} XP
                </p>
                {currentQuizTarget.function && (
                  <p className="type-body" style={{ color: 'var(--ink)', fontStyle: 'italic' }}>
                    {currentQuizTarget.function}
                  </p>
                )}
                <div>
                  <Button variant="primary" size="sm" onClick={handleNextQuizQuestion}>
                    {quizState.index + 1 >= quizState.order.length ? 'See Final Score' : 'Next Question'}
                    <ArrowRight size={14} style={{ marginLeft: 6 }} />
                  </Button>
                </div>
              </div>
            )}
          </StickyNote>
        )}

        {/* Quiz Done summary */}
        {mode === 'quiz' && quizState?.status === 'done' && (
          <StickyNote tone="green" body rotation="0.2deg" style={{ maxWidth: '100%' }}>
            <h3 className="type-h3" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}>
              🎉 Identification Quiz Completed!
            </h3>
            <p className="type-body" style={{ color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
              You answered <strong>{quizState.firstTry}</strong> of <strong>{quizState.order.length}</strong> components correctly on the first attempt, earning <strong>+{quizState.xp} XP</strong>!
            </p>
            <Button variant="primary" size="sm" onClick={startQuiz}>
              <RotateCcw size={14} style={{ marginRight: 6 }} />
              Try Quiz Again
            </Button>
          </StickyNote>
        )}
      </div>
    </PaperCard>
  );
}
