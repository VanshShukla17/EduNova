import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  FlaskConical,
  Award,
  Flame,
  ArrowRight,
  Compass,
  Video,
  Shapes,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  HeroCard,
  SectionHeader,
  PaperCard,
  StatChip,
  ProgressRing,
  Tag,
  Stamp,
  Button,
  PixelButton,
  StickyNote,
  Skeleton,
  EmptyState,
} from '../components/ui';
import { NotebookGrid } from '../components/notebooks';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const [subjects, setSubjects] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [recentScores, setRecentScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [subjectsRes, progressRes, resultsRes] = await Promise.allSettled([
          api.getSubjects(),
          api.getProgress(),
          api.getResults(),
        ]);

        const loadedSubjects = subjectsRes.status === 'fulfilled' ? subjectsRes.value : [];
        const loadedProgress = progressRes.status === 'fulfilled' ? progressRes.value : [];
        const loadedResults = resultsRes.status === 'fulfilled' ? resultsRes.value : [];

        const subjectsWithProgress = await Promise.all(
          (Array.isArray(loadedSubjects) ? loadedSubjects : []).map(async (sub) => {
            try {
              const chapters = await api.getSubjectChapters(sub._id || sub.id);
              let avgProgress = 0;
              if (chapters && chapters.length > 0) {
                const totalPct = chapters.reduce(
                  (acc, c) => acc + (c.completionPercentage || 0),
                  0
                );
                avgProgress = Math.round(totalPct / chapters.length);
              }
              return {
                ...sub,
                chapters: chapters || [],
                progressPercentage: avgProgress,
              };
            } catch {
              return { ...sub, chapters: [], progressPercentage: 0 };
            }
          })
        );

        setSubjects(subjectsWithProgress);
        setProgressList(Array.isArray(loadedProgress) ? loadedProgress : []);
        setRecentScores(Array.isArray(loadedResults) ? loadedResults : []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const latestProgress = progressList.length > 0 ? progressList[0] : null;
  const firstSubject = subjects.length > 0 ? subjects[0] : null;
  const firstChapter =
    firstSubject && firstSubject.chapters && firstSubject.chapters.length > 0
      ? firstSubject.chapters[0]
      : null;

  const continueChapterTitle =
    latestProgress?.chapterId?.title || firstChapter?.title || 'Electricity (विद्युत)';
  const continueSubjectId =
    latestProgress?.chapterId?.subjectId || firstSubject?._id || firstSubject?.id || 'physics';
  const continueChapterId =
    latestProgress?.chapterId?._id ||
    latestProgress?.chapterId ||
    firstChapter?._id ||
    firstChapter?.id ||
    '1';

  const overallMastery =
    subjects.length > 0
      ? Math.round(
          subjects.reduce((acc, s) => acc + (s.progressPercentage || 0), 0) / subjects.length
        )
      : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
        <Skeleton lines={4} />
        <div className="paper-grid paper-grid--2">
          <Skeleton lines={3} />
          <Skeleton lines={3} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      {/* Hero Card: Resume Current Notebook */}
      <HeroCard
        eyebrow="CONTINUE LEARNING"
        eyebrowVariant="ready"
        title={t('dashboard.welcome', {
          name: user?.name || 'Student',
          defaultValue: `Welcome back, ${user?.name || 'Student'}`,
        })}
        subtitle={continueChapterTitle}
        description={`Class ${user?.classLevel || user?.class || 10} · ${user?.board || 'CBSE'} Notebook · Resume your current chapter or jump straight into hands-on STEM experiments.`}
        progress={latestProgress?.completionPercentage ?? overallMastery}
        progressLabel="Active chapter completion"
        subject={firstSubject?.name || 'physics'}
        badges={
          <>
            <StatChip variant="level" icon={Award}>
              {recentScores.length} Tests
            </StatChip>
            <StatChip variant="streak" icon={Flame}>
              Active Notebook
            </StatChip>
          </>
        }
        actions={
          <>
            <Button
              variant="primary"
              to={`/subjects/${continueSubjectId}/chapters/${continueChapterId}`}
            >
              <Play size={16} strokeWidth={2} aria-hidden="true" />
              Resume Chapter
            </Button>
            <Button variant="kraft" to="/labs">
              <FlaskConical size={16} strokeWidth={2} aria-hidden="true" />
              Open Virtual Labs
            </Button>
          </>
        }
        illustration={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--sp-3)',
              background: 'var(--paper-warm)',
              border: '1px solid var(--paper-border-warm)',
              borderRadius: 'var(--r-lg)',
              padding: 'var(--sp-4)',
              width: '100%',
              maxWidth: '280px',
            }}
          >
            <ProgressRing
              value={overallMastery}
              size={84}
              strokeWidth={8}
              tone="emerald"
              label="Overall Syllabus Mastery"
            />
            <div style={{ textAlign: 'center' }}>
              <div className="type-label" style={{ color: 'var(--ink)' }}>
                SYLLABUS MASTERY
              </div>
              <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
                {subjects.length} subjects active
              </p>
            </div>
          </div>
        }
      />

      {/* Section: Progress per Subject */}
      <section aria-labelledby="dashboard-subjects-heading">
        <SectionHeader
          tag="My STEM Notebooks"
          title="Progress per Subject"
          note="Tap any pinned subject card to open its chapters and lessons"
          action={
            <Button variant="note" size="sm" to="/subjects">
              All Chapters
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </Button>
          }
        />

        {subjects.length > 0 ? (
          <NotebookGrid subjects={subjects} language={i18n.language} />
        ) : (
          <EmptyState
            title="No Subjects Assigned Yet"
            description="Browse the full syllabus explorer or check back once subjects are published for your board."
            actionLabel="Explore Syllabus"
            to="/subjects"
          />
        )}
      </section>

      {/* Section: Interactive Desk Shortcuts */}
      <section aria-labelledby="dashboard-tools-heading">
        <SectionHeader
          tag="Workbench & Media"
          title="Hands-on Lab & Revision Tools"
          note="Jump into 3D modules, interactive diagrams, or your personal Chotu notes"
        />

        <div className="paper-grid paper-grid--4 tilt-cycle">
          <PaperCard interactive style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <Compass size={20} strokeWidth={2} style={{ color: 'var(--physics-ink)' }} aria-hidden="true" />
            <h3 className="type-h3">Interactive Hub</h3>
            <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
              Heart, optics, trigonometry & molecular 3D explorers.
            </p>
            <PixelButton variant="primary" size="sm" to="/learn" style={{ marginTop: 'auto' }}>
              Open Hub
            </PixelButton>
          </PaperCard>

          <PaperCard interactive style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <Shapes size={20} strokeWidth={2} style={{ color: 'var(--maths-ink)' }} aria-hidden="true" />
            <h3 className="type-h3">Visual Diagrams</h3>
            <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
              Pinpoint organ, circuit & geometry labels interactively.
            </p>
            <Button variant="primary" size="sm" to="/diagrams" style={{ marginTop: 'auto' }}>
              View Diagrams
            </Button>
          </PaperCard>

          <PaperCard interactive style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <Video size={20} strokeWidth={2} style={{ color: 'var(--chemistry-ink)' }} aria-hidden="true" />
            <h3 className="type-h3">Concept Videos</h3>
            <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
              Short topic explainers indexed chapter by chapter.
            </p>
            <Button variant="primary" size="sm" to="/videos" style={{ marginTop: 'auto' }}>
              Watch Videos
            </Button>
          </PaperCard>

          <PaperCard interactive style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <Sparkles size={20} strokeWidth={2} style={{ color: 'var(--biology-ink)' }} aria-hidden="true" />
            <h3 className="type-h3">Chotu AI Tutor</h3>
            <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
              Photo doubt solver & Socratic STEM revision chat.
            </p>
            <Button variant="primary" size="sm" to="/mentor" style={{ marginTop: 'auto' }}>
              Ask Chotu
            </Button>
          </PaperCard>
        </div>
      </section>

      {/* Section: Recent Test Scores */}
      <section aria-labelledby="dashboard-scores-heading">
        <SectionHeader
          tag="Exam Logbook"
          title="Recent Test Scores"
          note="Every MCQ attempt is recorded for weak-topic diagnosis"
          action={
            <Button variant="note" size="sm" to="/results">
              Full Diagnostics
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </Button>
          }
        />

        {recentScores.length > 0 ? (
          <PaperCard flat style={{ padding: 'var(--sp-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {recentScores.slice(0, 3).map((res) => {
                const chapName = res.chapterId?.title || 'Chapter Practice Test';
                const dateStr = new Date(res.createdAt).toLocaleDateString();
                const isHigh = Number(res.percentage) >= 80;
                return (
                  <div
                    key={res._id || res.id}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--sp-3)',
                      padding: 'var(--sp-3)',
                      borderRadius: 'var(--r-md)',
                      background: 'var(--paper-warm)',
                      border: '1px solid var(--paper-border-warm)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className="type-h3" style={{ fontSize: '1rem', color: 'var(--ink)' }}>
                        {chapName}
                      </span>
                      <span className="type-label" style={{ color: 'var(--ink-muted)' }}>
                        {dateStr}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                      {isHigh ? (
                        <Stamp variant="mastered">
                          <CheckCircle2 size={13} strokeWidth={2} aria-hidden="true" />
                          HIGH SCORE
                        </Stamp>
                      ) : (
                        <Tag variant="paper">PRACTICED</Tag>
                      )}
                      <span className="type-label" style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>
                        {res.score}/{res.totalQuestions} ({res.percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </PaperCard>
        ) : (
          <StickyNote tone="yellow" body rotation="-0.5deg" style={{ maxWidth: '100%' }}>
            <strong>No test logs yet.</strong> Pick any chapter in{' '}
            <Link to="/subjects" style={{ color: 'var(--emerald-800)', fontWeight: 700 }}>
              Syllabus
            </Link>{' '}
            and finish a quick MCQ check to unlock weak-topic diagnostics.
          </StickyNote>
        )}
      </section>
    </div>
  );
}
