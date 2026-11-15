/**
 * Normalizes a subject name or slug into one of the four STEM keys
 * defined in Section 7 of DESIGN.md: maths, physics, chemistry, biology.
 */
export function resolveSubjectKey(subjectOrSlug) {
  const raw = String(subjectOrSlug || '').toLowerCase();
  if (raw.includes('math')) return 'maths';
  if (raw.includes('phys')) return 'physics';
  if (raw.includes('chem')) return 'chemistry';
  if (raw.includes('bio') || raw.includes('life') || raw.includes('heart')) return 'biology';
  return 'maths';
}

export const SUBJECT_PIN_COLORS = {
  maths: 'purple',
  physics: 'blue',
  chemistry: 'orange',
  biology: 'green',
};

export const SUBJECT_TAPE_TONES = {
  maths: 'kraft',
  physics: 'yellow',
  chemistry: 'kraft',
  biology: 'green',
};

/**
 * Resolves a CSS custom property from tokens.css at runtime for HTML5 Canvas or Three.js materials.
 */
export function resolveCssVar(tokenName) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return '';
  }
  const normalized = tokenName.startsWith('--') ? tokenName : `--${tokenName}`;
  return getComputedStyle(document.documentElement).getPropertyValue(normalized).trim();
}
