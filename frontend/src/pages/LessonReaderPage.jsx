import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Sparkles,
  BookOpen,
  ClipboardCheck,
  Clock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import InteractiveDiagram from '../components/InteractiveDiagram';
import {
  PaperCard,
  Tape,
  Pin,
  Tag,
  Stamp,
  StickyNote,
  Button,
  Modal,
  Skeleton,
  EmptyState,
  useToast,
} from '../components/ui';

export default function LessonReaderPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { showToast } = useToast();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [progressInfo, setProgressInfo] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLesson() {
      try {
        setLoading(true);
        setError('');
        const data = await api.getLesson(lessonId);
        setLesson(data);
      } catch (err) {
        console.error('Failed to load lesson:', err);
        setError('Failed to load lesson notes.');
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [lessonId]);

  const handleMarkComplete = async () => {
    try {
      setCompleting(true);
      const res = await api.completeLesson(lessonId);
      setProgressInfo(res);
      setLesson((prev) => (prev ? { ...prev, isCompleted: true } : prev));
      window.dispatchEvent(new Event('edunova-progress-updated'));
      showToast('Lesson marked complete!', 'success');
    } catch (err) {
      console.error('Failed to complete lesson:', err);
      setError('Could not update lesson progress.');
      showToast('Could not update lesson progress.', 'error');
    } finally {
      setCompleting(false);
    }
  };

  const handleOpenSummary = async () => {
    setSummaryModalOpen(true);
    if (summaryData) return;

    try {
      setLoadingSummary(true);
      const langToUse = i18n.language === 'hi' ? 'hi' : 'en';
      const data = await api.getLessonSummary(lessonId, langToUse);
      setSummaryData(data);
    } catch (err) {
      console.error('Failed to load summary:', err);
      setSummaryData({ error: 'Failed to generate AI summary. Please check connection.' });
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        <Skeleton lines={6} />
      </div>
    );
  }

  if (!lesson || error) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <EmptyState
          icon={BookOpen}
          title="Lesson Could Not Load"
          description={error || 'This lesson sheet could not be retrieved.'}
          actionLabel="Go Back"
          onAction={() => navigate(-1)}
        />
      </div>
    );
  }

  const isHindi = i18n.language === 'hi';
  const title = isHindi && lesson.titleHindi ? lesson.titleHindi : lesson.title;
  const blocks = lesson.contentBlocks || [];

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      {/* Top Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--sp-3)',
        }}
      >
        <Button variant="dark" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back to Chapter
        </Button>

        <Button variant="note" size="sm" onClick={handleOpenSummary}>
          <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
          Quick Chotu Summary
        </Button>
      </div>

      {progressInfo ? (
        <StickyNote tone="green" body rotation="-0.4deg" style={{ maxWidth: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} strokeWidth={2} style={{ color: 'var(--emerald-700)' }} aria-hidden="true" />
            <span>
              Lesson completed! Chapter progress is now <strong>{progressInfo.completionPercentage}%</strong> (
              {progressInfo.completedLessonsCount} of {progressInfo.totalLessonsCount} lessons).
            </span>
          </div>
        </StickyNote>
      ) : null}

      {/* Main Ruled Notebook Lesson Sheet */}
      <PaperCard
        as="article"
        variant="ruled-margin"
        flat
        style={{
          padding: 'var(--sp-6) var(--sp-5) var(--sp-6) 64px',
        }}
      >
        <Tape tone="kraft" rotation="-1deg" />
        <Pin color={lesson.isCompleted ? 'green' : 'blue'} position="right" />

        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-3)',
            paddingBottom: 'var(--sp-4)',
            borderBottom: '1.5px solid var(--paper-edge)',
            marginBottom: 'var(--sp-5)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <Tag variant="paper">LESSON SHEET</Tag>
            {lesson.estimatedMinutes ? (
              <Tag variant="verified">
                <Clock size={12} strokeWidth={2} aria-hidden="true" />
                {lesson.estimatedMinutes} min read
              </Tag>
            ) : null}
            {lesson.isCompleted ? <Stamp variant="mastered">MASTERED</Stamp> : null}
          </div>

          <h1 className="type-h1" style={{ color: 'var(--ink)' }}>
            {title}
          </h1>
        </header>

        <div
          style={{
            maxWidth: 'var(--read-max)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-5)',
          }}
        >
          {blocks.map((block, idx) => {
            const textContent = isHindi && block.contentHindi ? block.contentHindi : block.content;

            if (block.type === 'text') {
              return (
                <p
                  key={idx}
                  className="type-body"
                  style={{ color: 'var(--ink)', lineHeight: 1.75, whiteSpace: 'pre-line' }}
                >
                  {textContent}
                </p>
              );
            }

            if (block.type === 'formula') {
              return (
                <div key={idx} className="terminal-block" style={{ textAlign: 'center', padding: 'var(--sp-4)' }}>
                  <div className="type-label" style={{ color: 'var(--amber-300)', marginBottom: '6px' }}>
                    KEY FORMULA
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--paper)' }}>
                    {textContent}
                  </div>
                </div>
              );
            }

            if (block.type === 'image') {
              return (
                <figure
                  key={idx}
                  style={{
                    background: 'var(--paper-warm)',
                    border: '1px solid var(--paper-border-warm)',
                    borderRadius: 'var(--r-md)',
                    padding: 'var(--sp-3)',
                  }}
                >
                  {block.mediaUrl ? (
                    <img
                      src={block.mediaUrl}
                      alt={textContent || 'Lesson visual aid'}
                      loading="lazy"
                      style={{
                        width: '100%',
                        borderRadius: 'var(--r-sm)',
                        display: 'block',
                      }}
                    />
                  ) : null}
                  {textContent ? (
                    <figcaption
                      className="type-small"
                      style={{ color: 'var(--ink-muted)', marginTop: 'var(--sp-2)', textAlign: 'center' }}
                    >
                      {textContent}
                    </figcaption>
                  ) : null}
                </figure>
              );
            }

            if (block.type === 'diagram') {
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {textContent ? (
                    <div className="type-label" style={{ color: 'var(--emerald-700)' }}>
                      {textContent}
                    </div>
                  ) : null}
                  <InteractiveDiagram slug={block.mediaUrl || block.content} />
                </div>
              );
            }

            if (block.type === 'callout') {
              return (
                <StickyNote key={idx} tone="yellow" body rotation="-0.5deg" style={{ maxWidth: '100%' }}>
                  {textContent}
                </StickyNote>
              );
            }

            return (
              <p key={idx} className="type-body" style={{ color: 'var(--ink)' }}>
                {textContent}
              </p>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--sp-3)',
            marginTop: 'var(--sp-6)',
            paddingTop: 'var(--sp-4)',
            borderTop: '1.5px solid var(--paper-edge)',
          }}
        >
          <Button
            variant={lesson.isCompleted ? 'note' : 'primary'}
            onClick={handleMarkComplete}
            disabled={completing}
          >
            <CheckCircle size={18} strokeWidth={2} aria-hidden="true" />
            {completing
              ? 'Saving...'
              : lesson.isCompleted
              ? 'Completed (Update Progress)'
              : 'Mark Lesson Complete'}
          </Button>

          {lesson.chapterId ? (
            <Button
              variant="kraft"
              to={`/practice/${typeof lesson.chapterId === 'object' ? lesson.chapterId._id || lesson.chapterId.id : lesson.chapterId}`}
            >
              <ClipboardCheck size={18} strokeWidth={2} aria-hidden="true" />
              Practice Chapter MCQs
            </Button>
          ) : null}
        </div>
      </PaperCard>

      {/* AI Summary Modal */}
      <Modal
        open={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        title="Chotu Quick Lesson Summary"
        tapeTone="green"
        footer={
          <Button variant="primary" size="sm" onClick={() => setSummaryModalOpen(false)}>
            Close Notes
          </Button>
        }
      >
        {loadingSummary ? (
          <Skeleton card={false} lines={4} />
        ) : summaryData?.error ? (
          <StickyNote tone="pink" body>
            {summaryData.error}
          </StickyNote>
        ) : (
          <StickyNote tone="yellow" body rotation="0deg" style={{ maxWidth: '100%' }}>
            <p className="type-body" style={{ whiteSpace: 'pre-line' }}>
              {summaryData?.summary ||
                summaryData?.text ||
                'Key points generated from this chapter will appear here.'}
            </p>
          </StickyNote>
        )}
      </Modal>
    </div>
  );
}
