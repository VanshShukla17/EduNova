import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Dna,
  Atom,
  FlaskConical,
  Compass,
  ArrowRight,
  Search,
  Sparkles,
} from 'lucide-react';
import { SUBJECTS_CONFIG, MODULES_DATA } from './learnData';
import ModuleCard from './ModuleCard';
import {
  HeroCard,
  SectionHeader,
  PaperCard,
  Pin,
  Tag,
  Field,
  Button,
  EmptyState,
  resolveSubjectKey,
  SUBJECT_PIN_COLORS,
} from '../../components/ui';

const ICON_MAP = {
  Dna,
  Atom,
  FlaskConical,
  Compass,
};

export default function LearnPortalPage() {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModules = MODULES_DATA.filter((m) => {
    const matchesSubject = selectedSubject === 'all' || m.subject === selectedSubject;
    const matchesSearch =
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subjectLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      <HeroCard
        eyebrow="Class 10–12 Interactive STEM Environment"
        eyebrowVariant="ready"
        title="EVidya Virtual STEM Hub"
        subtitle="Explore interactive 3D biological systems, physical ray optics, molecular structures, and graphing calculus labs."
        actions={
          <>
            <Button variant="primary" to="/learn/biology/human-heart">
              Explore Heart 3D
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button variant="kraft" to="/virtual-learning">
              All 3D Topics
            </Button>
            <Button variant="note" to="/mentor">
              <Sparkles size={16} strokeWidth={2} aria-hidden="true" />
              Ask Chotu
            </Button>
          </>
        }
      />

      {/* Browse by Subject */}
      <section>
        <SectionHeader
          tag="Subject Hubs"
          title="Explore by Subject"
          note="Jump into dedicated subject collections"
        />

        <div className="paper-grid paper-grid--4 tilt-cycle">
          {Object.keys(SUBJECTS_CONFIG).map((subKey) => {
            const s = SUBJECTS_CONFIG[subKey];
            const IconComp = ICON_MAP[s.icon] || Atom;
            const subjectKey = resolveSubjectKey(s.name);
            const moduleCount = MODULES_DATA.filter((m) => m.subject === subKey).length;

            return (
              <Link key={subKey} to={`/learn/${subKey}`} style={{ textDecoration: 'none' }}>
                <PaperCard
                  interactive
                  style={{
                    padding: 'var(--sp-5)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 'var(--sp-3)',
                  }}
                >
                  <Pin color={SUBJECT_PIN_COLORS[subjectKey] || 'blue'} position="left" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconComp size={24} strokeWidth={2} style={{ color: s.color }} aria-hidden="true" />
                    <Tag variant={subjectKey}>
                      {moduleCount} {moduleCount === 1 ? 'Module' : 'Modules'}
                    </Tag>
                  </div>

                  <div>
                    <h3 className="type-h3" style={{ color: 'var(--ink)' }}>
                      {s.name}
                    </h3>
                    <p className="type-small" style={{ color: 'var(--ink-muted)', marginTop: '4px' }}>
                      {s.description}
                    </p>
                  </div>
                </PaperCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Filter & Search Bar */}
      <PaperCard flat style={{ padding: 'var(--sp-4)' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--sp-3)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            {['all', 'biology', 'physics', 'chemistry', 'mathematics'].map((subKey) => (
              <Button
                key={subKey}
                variant={selectedSubject === subKey ? 'primary' : 'note'}
                size="sm"
                onClick={() => setSelectedSubject(subKey)}
              >
                {subKey === 'all' ? 'All Subjects' : SUBJECTS_CONFIG[subKey]?.name}
              </Button>
            ))}
          </div>

          <div style={{ flex: '1 1 220px', maxWidth: '300px' }}>
            <Field
              placeholder="Search interactive modules..."
              aria-label="Search interactive modules"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </PaperCard>

      {/* Interactive Modules Grid */}
      <section>
        <SectionHeader
          tag={`${filteredModules.length} Modules`}
          title="Featured Interactive Modules"
          note="Hands-on simulations built directly into your notebook"
        />

        {filteredModules.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No Matching Modules Found"
            description="Reset filters or search with another STEM topic keyword."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSelectedSubject('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="paper-grid paper-grid--3 tilt-cycle">
            {filteredModules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
