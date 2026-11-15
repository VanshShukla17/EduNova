import React, { useState, useEffect } from 'react';
import { Box, Play, CheckCircle, Search } from 'lucide-react';
import { getVirtualTopics } from '../../services/api';
import {
  HeroCard,
  SectionHeader,
  PaperCard,
  Pin,
  Tag,
  Stamp,
  Field,
  Button,
  Skeleton,
  EmptyState,
  resolveSubjectKey,
  SUBJECT_PIN_COLORS,
} from '../../components/ui';

export default function VirtualLearningPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getVirtualTopics();
        setTopics(data.topics || []);
      } catch (err) {
        console.error('Failed to fetch virtual topics:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredTopics = topics.filter((t) => {
    const matchesSubject =
      selectedSubject === 'all' ||
      (t.subject || '').toLowerCase() === selectedSubject.toLowerCase();
    const matchesClass =
      selectedClass === 'all' || String(t.classLevel) === String(selectedClass);
    const matchesSearch =
      !searchQuery ||
      (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.chapter || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesClass && matchesSearch;
  });

  if (loading) {
    return <Skeleton lines={5} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      <HeroCard
        eyebrow="3D Virtual STEM Lab Catalog"
        eyebrowVariant="ready"
        title="Interactive 3D Explorers"
        subtitle="Inspect physical phenomena, human anatomy, and mathematical curves in real time."
        actions={
          <Button variant="kraft" to="/learn">
            Open Classic STEM Hub
          </Button>
        }
      />

      {/* Filter Bar */}
      <PaperCard flat style={{ padding: 'var(--sp-4)' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--sp-3)',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            {['all', 'Physics', 'Chemistry', 'Biology', 'Mathematics'].map((sub) => (
              <Button
                key={sub}
                variant={selectedSubject === sub ? 'primary' : 'note'}
                size="sm"
                onClick={() => setSelectedSubject(sub)}
              >
                {sub === 'all' ? 'All Subjects' : sub}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', alignItems: 'center' }}>
            <Field
              as="select"
              aria-label="Class filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">All Classes</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </Field>

            <Field
              placeholder="Search 3D topics..."
              aria-label="Search 3D topics"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </PaperCard>

      <section>
        <SectionHeader
          tag={`${filteredTopics.length} Topics Available`}
          title="Select a 3D Simulation"
          note="Includes concept notes and observation checks"
        />

        {filteredTopics.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No 3D Topics Match Your Filter"
            description="Try resetting the subject or class filter."
            actionLabel="Show All Topics"
            onAction={() => {
              setSelectedSubject('all');
              setSelectedClass('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="paper-grid paper-grid--3 tilt-cycle">
            {filteredTopics.map((t, idx) => {
              const subjectKey = resolveSubjectKey(t.subject);
              return (
                <PaperCard
                  key={t.slug || idx}
                  as="article"
                  interactive
                  style={{
                    padding: 'var(--sp-5)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 'var(--sp-3)',
                  }}
                >
                  <Pin color={SUBJECT_PIN_COLORS[subjectKey] || 'blue'} position="left" />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                      <Tag variant={subjectKey}>
                        {t.subject} · Class {t.classLevel}
                      </Tag>
                      {t.completed ? (
                        <Stamp variant="mastered">
                          <CheckCircle size={12} aria-hidden="true" />
                          COMPLETED
                        </Stamp>
                      ) : null}
                    </div>

                    <h3 className="type-h3" style={{ color: 'var(--ink)' }}>
                      {t.title}
                    </h3>

                    <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
                      {t.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: 'var(--sp-3)',
                      borderTop: '1px solid var(--paper-border-warm)',
                      marginTop: 'auto',
                    }}
                  >
                    <span className="type-label" style={{ color: 'var(--ink-soft)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Box size={14} strokeWidth={2} aria-hidden="true" />
                      Interactive 3D
                    </span>

                    <Button variant="primary" size="sm" to={`/virtual-learning/${t.slug}`}>
                      <Play size={14} strokeWidth={2} aria-hidden="true" />
                      Launch 3D
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
