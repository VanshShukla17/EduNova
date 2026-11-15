import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Dna, Atom, FlaskConical, Compass } from 'lucide-react';
import { SUBJECTS_CONFIG, MODULES_DATA } from './learnData';
import ModuleCard from './ModuleCard';
import {
  HeroCard,
  SectionHeader,
  Button,
  EmptyState,
} from '../../components/ui';

const ICON_MAP = {
  Dna,
  Atom,
  FlaskConical,
  Compass,
};

export default function SubjectHubPage() {
  const { subjectId } = useParams();
  const subjectConfig = SUBJECTS_CONFIG[subjectId];
  const modules = MODULES_DATA.filter((m) => m.subject === subjectId);

  if (!subjectConfig) {
    return (
      <EmptyState
        title="Subject Not Found"
        description={`The subject hub "${subjectId}" does not exist.`}
        actionLabel="Back to STEM Portal"
        to="/learn"
      />
    );
  }

  const IconComp = ICON_MAP[subjectConfig.icon] || BookOpen;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-3)' }}>
        <Button variant="dark" size="sm" to="/learn">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back to STEM Learning Portal
        </Button>

        <Button variant="note" size="sm" to="/mentor" state={{ subject: subjectConfig.name }}>
          Ask Chotu ({subjectConfig.name})
        </Button>
      </div>

      <HeroCard
        eyebrow={`STEM Learning Hub · ${subjectConfig.name}`}
        eyebrowVariant="verified"
        title={subjectConfig.name}
        description={subjectConfig.description}
        illustration={
          <div
            style={{
              padding: 'var(--sp-5)',
              borderRadius: 'var(--r-lg)',
              background: subjectConfig.bgColor,
              border: `1.5px solid ${subjectConfig.borderColor}`,
              color: subjectConfig.color,
            }}
          >
            <IconComp size={48} strokeWidth={1.8} aria-hidden="true" />
          </div>
        }
      />

      <section>
        <SectionHeader
          tag={`${modules.length} Interactive Units`}
          title={`Interactive ${subjectConfig.name} Labs`}
          note="Launch any module directly inside your notebook"
        />

        <div className="paper-grid paper-grid--3 tilt-cycle">
          {modules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      </section>
    </div>
  );
}
