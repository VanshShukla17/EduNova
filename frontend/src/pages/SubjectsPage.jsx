import React, { useEffect, useState } from 'react';
import { BookOpen, ArrowRight, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import {
  HeroCard,
  SectionHeader,
  PaperCard,
  Pin,
  Tag,
  Field,
  Button,
  ProgressBar,
  Stamp,
  Skeleton,
  EmptyState,
  resolveSubjectKey,
  SUBJECT_PIN_COLORS,
} from '../components/ui';

export default function SubjectsPage() {
  const { i18n } = useTranslation();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoading(true);
        const data = await api.getSubjects();
        if (data && data.length > 0) {
          const withChapters = await Promise.all(
            data.map(async (sub) => {
              try {
                const chapters = await api.getSubjectChapters(sub._id || sub.id);
                return { ...sub, chapters: chapters || [] };
              } catch {
                return { ...sub, chapters: [] };
              }
            })
          );
          setSubjects(withChapters);
        } else {
          setSubjects([
            {
              id: 'physics',
              code: 'physics',
              name: 'Physics',
              nameHindi: 'भौतिक विज्ञान',
              chapters: [{ id: '1', title: 'Electricity' }],
            },
            {
              id: 'chemistry',
              code: 'chemistry',
              name: 'Chemistry',
              nameHindi: 'रसायन विज्ञान',
              chapters: [{ id: '1', title: 'Chemical Reactions' }],
            },
            {
              id: 'biology',
              code: 'biology',
              name: 'Biology',
              nameHindi: 'जीव विज्ञान',
              chapters: [{ id: '1', title: 'Life Processes' }],
            },
            {
              id: 'mathematics',
              code: 'mathematics',
              name: 'Mathematics',
              nameHindi: 'गणित',
              chapters: [{ id: '1', title: 'Real Numbers' }],
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load subjects:', err);
        setError('Could not load subjects from server. Showing offline fallback.');
      } finally {
        setLoading(false);
      }
    }

    loadSubjects();
  }, []);

  const filteredSubjects = subjects.filter((sub) => {
    const key = resolveSubjectKey(sub.name || sub.code);
    if (activeFilter !== 'all' && key !== activeFilter) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    const matchSubject =
      (sub.name || '').toLowerCase().includes(q) ||
      (sub.nameHindi || '').toLowerCase().includes(q);
    const matchChapter = (sub.chapters || []).some((ch) =>
      (ch.title || '').toLowerCase().includes(q)
    );
    return matchSubject || matchChapter;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
        <Skeleton lines={3} />
        <div className="paper-grid paper-grid--2">
          <Skeleton lines={4} />
          <Skeleton lines={4} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      <HeroCard
        eyebrow="Complete STEM Curriculum"
        eyebrowVariant="paper"
        title="Subject Index & Chapters"
        subtitle="Select any pinned notebook sheet to open lessons and chapter tests."
        description={error || 'Filter by subject or search any chapter keyword.'}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'var(--sp-3)',
            marginTop: 'var(--sp-2)',
          }}
        >
          <div style={{ flex: '1 1 240px', maxWidth: '340px' }}>
            <Field
              placeholder="Search chapters or subjects..."
              aria-label="Search chapters or subjects"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'maths', label: 'Maths' },
              { id: 'physics', label: 'Physics' },
              { id: 'chemistry', label: 'Chemistry' },
              { id: 'biology', label: 'Biology' },
            ].map((item) => (
              <Button
                key={item.id}
                variant={activeFilter === item.id ? 'primary' : 'note'}
                size="sm"
                onClick={() => setActiveFilter(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </HeroCard>

      <section>
        <SectionHeader
          tag="Curriculum Shelves"
          title="Subjects & Chapters"
          note="Every chapter tracks lessons read and practice scores"
        />

        {filteredSubjects.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No Matching Chapters Found"
            description="Clear your search filter to view all subjects."
            actionLabel="Reset Filters"
            onAction={() => {
              setQuery('');
              setActiveFilter('all');
            }}
          />
        ) : (
          <div className="paper-grid paper-grid--2 tilt-cycle">
            {filteredSubjects.map((sub, idx) => {
              const subId = sub._id || sub.id;
              const subjectKey = resolveSubjectKey(sub.name || sub.code);
              const pinColor = SUBJECT_PIN_COLORS[subjectKey] || 'blue';
              const displayName =
                i18n.language === 'hi' && sub.nameHindi ? sub.nameHindi : sub.name;
              const chapters = sub.chapters || [];
              const avgPct =
                chapters.length > 0
                  ? Math.round(
                      chapters.reduce((sum, c) => sum + (c.completionPercentage || 0), 0) /
                        chapters.length
                    )
                  : 0;

              return (
                <PaperCard
                  key={subId || idx}
                  as="article"
                  style={{
                    padding: 'var(--sp-5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--sp-4)',
                  }}
                >
                  <Pin color={pinColor} position="left" />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 'var(--sp-2)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Tag variant={subjectKey}>{sub.name}</Tag>
                    {avgPct >= 100 ? <Stamp variant="mastered">MASTERED</Stamp> : null}
                  </div>

                  <div>
                    <h3 className="type-h2" style={{ color: 'var(--ink)' }}>
                      {displayName}
                    </h3>
                    <div style={{ marginTop: 'var(--sp-2)' }}>
                      <ProgressBar
                        value={avgPct}
                        subject={subjectKey}
                        label={`${chapters.length} chapter${chapters.length === 1 ? '' : 's'}`}
                        showPercent
                      />
                    </div>
                  </div>

                  {chapters.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                      {chapters.map((ch, chIdx) => {
                        const chapId = ch._id || ch.id;
                        const chPct = ch.completionPercentage || 0;
                        return (
                          <div
                            key={chapId || chIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 'var(--sp-3)',
                              padding: 'var(--sp-3)',
                              borderRadius: 'var(--r-md)',
                              background: 'var(--paper-warm)',
                              border: '1px solid var(--paper-border-warm)',
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                              <span className="type-label" style={{ color: 'var(--ink-soft)' }}>
                                CHAPTER {String(chIdx + 1).padStart(2, '0')} · {chPct}%
                              </span>
                              <span
                                className="type-body"
                                style={{ fontWeight: 700, color: 'var(--ink)' }}
                              >
                                {ch.title}
                              </span>
                            </div>

                            <Button
                              variant="primary"
                              size="sm"
                              to={`/subjects/${subId}/chapters/${chapId}`}
                            >
                              <BookOpen size={15} strokeWidth={2} aria-hidden="true" />
                              Open
                              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
                      Chapters are being prepared for this subject.
                    </p>
                  )}
                </PaperCard>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
