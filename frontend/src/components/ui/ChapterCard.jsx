import React from 'react';
import NotebookCard from '../notebooks/NotebookCard';
import PhysicsPixelScene from '../notebooks/scenes/PhysicsPixelScene';
import ChemistryPixelScene from '../notebooks/scenes/ChemistryPixelScene';
import BiologyPixelScene from '../notebooks/scenes/BiologyPixelScene';
import MathematicsPixelScene from '../notebooks/scenes/MathematicsPixelScene';
import { resolveSubjectKey } from './subjectUtils';

const SCENE_MAP = {
  physics: PhysicsPixelScene,
  chemistry: ChemistryPixelScene,
  biology: BiologyPixelScene,
  maths: MathematicsPixelScene,
};

/**
 * Chapter notebook card with pinned accent, monospace code, mastery stamp,
 * progress track, and procedural animated pixel-art scene.
 */
export default function ChapterCard(props) {
  const subjectKey = resolveSubjectKey(props.subject);
  const SceneComponent = SCENE_MAP[subjectKey] || PhysicsPixelScene;

  return <NotebookCard {...props} SceneComponent={SceneComponent} />;
}
