import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Info,
  X,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ZoomIn,
  ZoomOut,
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

export default function InteractiveDiagram({ diagramData, diagramId, subjectCode }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [diagram, setDiagram] = useState(diagramData || null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [loading, setLoading] = useState(!diagramData && !!(diagramId || subjectCode));
  const [error, setError] = useState('');

  const [mode, setMode] = useState('explore');
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState({});
  const [activeQuizQuestion, setActiveQuizQuestion] = useState(null);
  const [zoom, setZoom] = useState(1);

  const isHindi = user?.language === 'hi';

  useEffect(() => {
    if (diagramData) {
      setDiagram(diagramData);
      return;
    }

    const idToFetch = diagramId || subjectCode;
    if (!idToFetch) return;

    async function fetchDiagram() {
      try {
        setLoading(true);
        setError('');
        const data = await api.getDiagramById(idToFetch);
        setDiagram(data);
      } catch (err) {
        console.error('Failed to load diagram:', err);
        setError('Interactive diagram could not be loaded.');
      } finally {
        setLoading(false);
      }
    }

    fetchDiagram();
  }, [diagramData, diagramId, subjectCode]);

  const handleElementTap = (element) => {
    if (mode === 'quiz') {
      setActiveQuizQuestion(element);
      return;
    }
    if (selectedElement && selectedElement.id === element.id) {
      setSelectedElement(null);
    } else {
      setSelectedElement(element);
    }
  };

  const handleQuizAnswer = (targetElement, guessedLabel) => {
    const isCorrect = targetElement.label === guessedLabel;
    setQuizAnswered((prev) => ({
      ...prev,
      [targetElement.id]: isCorrect,
    }));
    if (isCorrect) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleResetQuiz = () => {
    setQuizScore(0);
    setQuizAnswered({});
    setActiveQuizQuestion(null);
  };

  const handleAskSaarthi = (element) => {
    const prompt = `I am studying the "${diagram.title}" diagram in ${diagram.subjectCode || 'Science'}. Specifically, can you explain the function of the "${element.label}" and how it interacts with the rest of the system?`;
    navigate('/mentor', {
      state: { prefill: prompt, subject: diagram.subjectCode || 'Science' },
    });
  };

  if (loading) return <Skeleton lines={4} />;

  if (error || !diagram) {
    return (
      <EmptyState
        title="Diagram Not Available"
        description={error || 'Could not load diagram elements.'}
      />
    );
  }

  const elements = diagram.elements || [];

  return (
    <PaperCard flat style={{ padding: 'var(--sp-5)' }}>
      <Pin color="blue" position="right" />

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
            onClick={() => {
              setMode('explore');
              setActiveQuizQuestion(null);
            }}
          >
            <Info size={14} strokeWidth={2} aria-hidden="true" />
            Explore
          </Button>

          <Button
            variant={mode === 'quiz' ? 'primary' : 'note'}
            size="sm"
            onClick={() => {
              setMode('quiz');
              setSelectedElement(null);
            }}
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
            onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.15).toFixed(2))))}
            aria-label="Zoom in"
          >
            <ZoomIn size={14} strokeWidth={2} />
          </Button>
        </div>
      </div>

      {mode === 'quiz' ? (
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
          <Tag variant="verified">
            <CheckCircle2 size={13} strokeWidth={2} aria-hidden="true" />
            Score: {quizScore} / {elements.length}
          </Tag>
          <Button variant="note" size="sm" onClick={handleResetQuiz}>
            <RotateCcw size={13} strokeWidth={2} aria-hidden="true" />
            Reset Quiz
          </Button>
        </div>
      ) : null}

      {/* Interactive SVG Canvas */}
      <div
        style={{
          overflowX: 'auto',
          background: 'var(--paper-warm)',
          border: '1px solid var(--paper-border-warm)',
          borderRadius: 'var(--r-md)',
          padding: 'var(--sp-4)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
          <svg
            viewBox={diagram.svgViewBox || '0 0 600 400'}
            style={{ width: '100%', maxWidth: '580px', height: 'auto', display: 'block' }}
            role="img"
            aria-label={diagram.title}
          >
            {elements.map((elem) => {
              const isSelected =
                (mode === 'explore' && selectedElement?.id === elem.id) ||
                (mode === 'quiz' && activeQuizQuestion?.id === elem.id);
              const answered = quizAnswered[elem.id];
              const attrs = elem.attributes || {};

              let strokeColor = isSelected ? 'var(--physics)' : 'var(--ink-muted)';
              let fillColor = isSelected ? 'var(--physics-soft)' : 'var(--paper-field)';
              const strokeWidth = isSelected ? Number(attrs.strokeWidth || 2.5) + 2 : attrs.strokeWidth || 2.5;

              if (mode === 'quiz' && answered !== undefined) {
                strokeColor = answered ? 'var(--emerald-700)' : 'var(--red-600)';
                fillColor = answered ? 'var(--emerald-soft)' : 'var(--red-soft)';
              }

              const displayText =
                mode === 'quiz' && answered === undefined
                  ? '?'
                  : isHindi && elem.labelHindi
                  ? elem.labelHindi
                  : elem.label;

              const shapeProps = {
                onClick: () => handleElementTap(elem),
                style: { cursor: 'pointer' },
              };

              if (elem.type === 'rect') {
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
                      fill="var(--ink)"
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
                    fill="var(--ink)"
                    fontSize="11"
                    fontWeight="700"
                    pointerEvents="none"
                  >
                    {displayText}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Quiz Choice Prompt */}
      {mode === 'quiz' && activeQuizQuestion ? (
        <StickyNote tone="blue" body rotation="-0.3deg" style={{ maxWidth: '100%', marginTop: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-2)' }}>
            <span className="type-h3" style={{ fontSize: '1rem' }}>
              Identify This Highlighted Component:
            </span>
            <Button variant="ghost" size="sm" onClick={() => setActiveQuizQuestion(null)} aria-label="Close prompt">
              <X size={16} />
            </Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--sp-2)' }}>
            {elements.map((optionElem) => (
              <Button
                key={optionElem.id}
                variant="note"
                size="sm"
                disabled={quizAnswered[activeQuizQuestion.id] === true}
                onClick={() => handleQuizAnswer(activeQuizQuestion, optionElem.label)}
              >
                {optionElem.label}
              </Button>
            ))}
          </div>
          {quizAnswered[activeQuizQuestion.id] !== undefined ? (
            <p
              className="type-small"
              style={{
                marginTop: 'var(--sp-2)',
                fontWeight: 700,
                color: quizAnswered[activeQuizQuestion.id] ? 'var(--emerald-800)' : 'var(--red-600)',
              }}
            >
              {quizAnswered[activeQuizQuestion.id]
                ? 'Correct! Well done.'
                : `Incorrect. This component is "${activeQuizQuestion.label}".`}
            </p>
          ) : null}
        </StickyNote>
      ) : null}

      {/* Explanation Panel */}
      {mode === 'explore' && selectedElement ? (
        <StickyNote tone="yellow" body rotation="-0.4deg" style={{ maxWidth: '100%', marginTop: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap', marginBottom: 'var(--sp-2)' }}>
            <h3 className="type-h3" style={{ color: 'var(--ink)' }}>
              {isHindi && selectedElement.labelHindi ? selectedElement.labelHindi : selectedElement.label}
            </h3>
            <Button variant="primary" size="sm" onClick={() => handleAskSaarthi(selectedElement)}>
              <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
              Ask Saarthi
            </Button>
          </div>
          <p className="type-body" style={{ color: 'var(--ink)' }}>
            {isHindi && selectedElement.explanationHindi
              ? selectedElement.explanationHindi
              : selectedElement.explanation}
          </p>
        </StickyNote>
      ) : mode === 'explore' ? (
        <p className="type-small" style={{ color: 'var(--ink-muted)', marginTop: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={15} strokeWidth={2} aria-hidden="true" />
          {isHindi
            ? 'जानकारी देखने के लिए ऊपर दिए गए किसी भी घटक पर क्लिक करें।'
            : 'Tap any component in the diagram above to read its function and explanation.'}
        </p>
      ) : null}
    </PaperCard>
  );
}
