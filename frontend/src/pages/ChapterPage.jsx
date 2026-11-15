import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  PlayCircle,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  FlaskConical,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import {
  HeroCard,
  SectionHeader,
  PaperCard,
  Pin,
  Stamp,
  Tag,
  Button,
  StickyNote,
  Skeleton,
  EmptyState,
} from '../components/ui';

export default function ChapterPage() {
  const { subjectId, chapterId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [lessons, setLessons] = useState([]);
  const [chapterInfo, setChapterInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadChapterData() {
      try {
        setLoading(true);
        setError('');
        const lessonsData = await api.getChapterLessons(chapterId);
        setLessons(lessonsData || []);

        if (subjectId) {
          try {
            const chapters = await api.getSubjectChapters(subjectId);
            const current = (chapters || []).find((c) => (c._id || c.id) === chapterId);
            if (current) {
              setChapterInfo(current);
            }
          } catch {
            // Optional metadata
          }
        }
      } catch (err) {
        console.error('Failed to load chapter lessons:', err);
        setError('Failed to load lessons for this chapter.');
      } finally {
        setLoading(false);
      }
    }

    loadChapterData();
  }, [chapterId, subjectId]);

  const totalCount = lessons.length;
  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
        <Skeleton lines={4} />
        <Skeleton lines={3} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      <div>
        <Button variant="dark" size="sm" onClick={() => navigate('/subjects')}>
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back to Syllabus
        </Button>
      </div>

      {error ? (
        <StickyNote tone="pink" body rotation="-0.5deg" role="alert" style={{ maxWidth: '100%' }}>
          {error}
        </StickyNote>
      ) : null}

      <HeroCard
        eyebrow="Chapter Notebook"
        eyebrowVariant="verified"
        title={chapterInfo?.title || 'Chapter Lessons'}
        subtitle={chapterInfo?.titleHindi || undefined}
        description={
          chapterInfo?.description ||
          `${completedCount} of ${totalCount} lessons marked mastered in your notebook.`
        }
        progress={percentage}
        progressLabel={`${completedCount} / ${totalCount} lessons completed`}
        badges={percentage >= 100 ? <Stamp variant="mastered">CHAPTER MASTERED</Stamp> : null}
        actions={
          <>
            <Button variant="primary" to={`/practice/${chapterId}`}>
              <ClipboardCheck size={17} strokeWidth={2} aria-hidden="true" />
              Take Chapter MCQ Test
            </Button>
            <Button variant="kraft" to="/labs">
              <FlaskConical size={17} strokeWidth={2} aria-hidden="true" />
              Open Virtual Lab
            </Button>
          </>
        }
      />

      <section aria-labelledby="chapter-lessons-heading">
        <SectionHeader
          tag="Lesson Pages"
          title="Ordered Study Lessons"
          note="Read sequentially or open any concept sheet directly"
        />

        {lessons.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Lessons Published Yet"
            description="Check back soon or try the chapter MCQ practice quiz directly."
            actionLabel="Try Practice Quiz"
            to={`/practice/${chapterId}`}
          />
        ) : (
          <div className="paper-grid paper-grid--2 tilt-cycle">
            {lessons.map((lesson, idx) => {
              const lessonId = lesson._id || lesson.id;
              const title =
                i18n.language === 'hi' && lesson.titleHindi ? lesson.titleHindi : lesson.title;
              const completed = Boolean(lesson.isCompleted);

              return (
                <PaperCard
                  key={lessonId || idx}
                  as="article"
                  variant="ruled"
                  interactive
                  style={{
                    padding: 'var(--sp-5)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 'var(--sp-3)',
                  }}
                >
                  <Pin color={completed ? 'green' : 'amber'} position="right" />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span className="type-label" style={{ color: 'var(--hand-rust)' }}>
                        LESSON {String(idx + 1).padStart(2, '0')}
                      </span>
                      {completed ? (
                        <Stamp variant="mastered">
                          <CheckCircle2 size={12} strokeWidth={2} aria-hidden="true" />
                          READ
                        </Stamp>
                      ) : (
                        <Tag variant="paper">READY</Tag>
                      )}
                    </div>

                    <h3 className="type-h3" style={{ color: 'var(--ink)' }}>
                      {title}
                    </h3>

                    {lesson.estimatedMinutes ? (
                      <span
                        className="type-small"
                        style={{
                          color: 'var(--ink-muted)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Clock size={14} strokeWidth={2} aria-hidden="true" />
                        {lesson.estimatedMinutes} min read
                      </span>
                    ) : null}
                  </div>

                  <div style={{ marginTop: 'var(--sp-2)' }}>
                    <Button variant="primary" size="sm" fullWidth to={`/lessons/${lessonId}`}>
                      <PlayCircle size={16} strokeWidth={2} aria-hidden="true" />
                      {completed ? 'Review Lesson' : 'Read Lesson'}
                    </Button>
                  </div>
                </PaperCard>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
