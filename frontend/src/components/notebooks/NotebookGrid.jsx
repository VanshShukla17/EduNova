import React from 'react';
import PhysicsNotebook from './PhysicsNotebook';
import ChemistryNotebook from './ChemistryNotebook';
import BiologyNotebook from './BiologyNotebook';
import MathematicsNotebook from './MathematicsNotebook';
import { resolveSubjectKey } from '../ui/subjectUtils';

const CANONICAL_ORDER = {
  physics: 0,
  chemistry: 1,
  biology: 2,
  maths: 3,
};

const NOTEBOOK_MAP = {
  physics: PhysicsNotebook,
  chemistry: ChemistryNotebook,
  biology: BiologyNotebook,
  maths: MathematicsNotebook,
};

/**
 * 2x2 desktop / stacked mobile grid of interactive pixel-art subject notebooks.
 */
export default function NotebookGrid({ subjects = [], language = 'en' }) {
  const orderedSubjects = [...subjects].sort((a, b) => {
    const ka = resolveSubjectKey(a.name || a.code);
    const kb = resolveSubjectKey(b.name || b.code);
    return (CANONICAL_ORDER[ka] ?? 99) - (CANONICAL_ORDER[kb] ?? 99);
  });

  return (
    <div className="notebook-grid tilt-cycle">
      {orderedSubjects.map((sub, idx) => {
        const firstChap = sub.chapters && sub.chapters[0];
        const subId = sub._id || sub.id;
        const chapId = firstChap ? firstChap._id || firstChap.id : null;
        const targetTo = chapId ? `/subjects/${subId}/chapters/${chapId}` : '/subjects';
        const displayName =
          language === 'hi' && sub.nameHindi ? sub.nameHindi : sub.name;
        const subjectKey = resolveSubjectKey(sub.name || sub.code);
        const chapterCount = sub.chapters?.length || 0;
        const chapterWord = chapterCount === 1 ? 'chapter' : 'chapters';
        const progress = sub.progressPercentage || 0;

        const SubjectNotebook = NOTEBOOK_MAP[subjectKey] || PhysicsNotebook;

        return (
          <SubjectNotebook
            key={subId || idx}
            code={`NOTEBOOK ${String(idx + 1).padStart(2, '0')}`}
            subjectLabel={sub.name}
            title={displayName}
            description={`${chapterCount} ${chapterWord} synced · Offline ready`}
            progress={progress}
            meta={`${chapterCount} ${chapterWord}`}
            mastered={progress >= 100}
            isNew={progress === 0}
            to={targetTo}
          />
        );
      })}
    </div>
  );
}
