export const SUBJECTS_CONFIG = {
  biology: {
    id: 'biology',
    name: 'Biology',
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    icon: 'Dna',
    gradeRange: 'Class 10–12',
    description: 'Explore human anatomy, physiology, cellular respiration, and organ system biomechanics with immersive 3D interactive models.',
    chapters: 'Life Processes, Locomotion & Movement, Breathing & Exchange of Gases'
  },
  physics: {
    id: 'physics',
    name: 'Physics',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    icon: 'Atom',
    gradeRange: 'Class 10–12',
    description: 'Investigate ray optics, wave acoustics, harmonic motion, and classical Newtonian dynamics through real-time interactive physics labs.',
    chapters: 'Light - Reflection & Refraction, Waves & Sound, Laws of Motion'
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: 'FlaskConical',
    gradeRange: 'Class 10–12',
    description: 'Visualize atomic architecture, chemical bonding, 3D molecular conformations, and VSEPR geometries with MolView and 3D WebGL.',
    chapters: 'Chemical Bonding & Molecular Structure, Hydrocarbons, Carbon Compounds'
  },
  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    icon: 'Compass',
    gradeRange: 'Class 10–12',
    description: 'Master geometric coordinate spaces, unit circle projections, sinusoidal wave transformations, and 3D conic sections with dynamic parameter sliders.',
    chapters: 'Introduction to Trigonometry, Trigonometric Functions, Conic Sections'
  }
};

export const MODULES_DATA = [
  // BIOLOGY
  {
    id: 'human-heart',
    subject: 'biology',
    subjectLabel: 'BIOLOGY',
    grade: 'Class 10',
    title: 'Human Heart & Double Circulatory Cycle',
    description: 'Inspect the 4-chambered human heart in 3D. Control cardiac BPM, trace oxygenated vs deoxygenated blood pathways, and understand systemic vs pulmonary circulation.',
    route: '/learn/biology/human-heart',
    type: '3D Lab',
    badgeColor: '#4338CA',
    badgeBg: '#EEF2FF',
    attribution: 'iamtechartist.com'
  },
  {
    id: 'muscular-system',
    subject: 'biology',
    subjectLabel: 'BIOLOGY',
    grade: 'Class 11',
    title: 'Human Muscular System – The 13 Muscles',
    description: 'Explore the 13 major superficial muscles of the human body in 3D. Inspect anterior and posterior groups, muscle origins, and joint mechanics.',
    route: '/learn/biology/muscular-system',
    type: '3D Lab',
    badgeColor: '#4338CA',
    badgeBg: '#EEF2FF',
    attribution: 'iamtechartist.com'
  },
  {
    id: 'respiration',
    subject: 'biology',
    subjectLabel: 'BIOLOGY',
    grade: 'Class 10 & 11',
    title: 'Breathing and Pulmonary Respiration',
    description: 'Interactive 3D simulation of human pulmonary ventilation, diaphragm biomechanics, bronchial tree branching, and alveolar gas exchange.',
    route: '/learn/biology/respiration',
    type: '3D Lab',
    badgeColor: '#4338CA',
    badgeBg: '#EEF2FF',
    attribution: 'iamtechartist.com'
  },

  // PHYSICS
  {
    id: 'light-optics',
    subject: 'physics',
    subjectLabel: 'PHYSICS',
    grade: 'Class 10 & 12',
    title: 'Light & Ray Optics Interactive Lab',
    description: 'Interactive ray optics simulation covering reflection, spherical mirrors, Snell’s law of refraction, thin lenses, and real-time image formation.',
    route: '/learn/physics/light-and-optics',
    type: '3D Lab',
    badgeColor: '#1E40AF',
    badgeBg: '#EFF6FF',
    attribution: 'iamtechartist.com'
  },
  {
    id: 'waves-sound',
    subject: 'physics',
    subjectLabel: 'PHYSICS',
    grade: 'Class 11',
    title: 'Waves & Sound Acoustic Explorer',
    description: 'Experiment with longitudinal and transverse wave propagation, frequency, wavelength, amplitude, Doppler acoustic effect, and echo acoustics.',
    route: '/learn/physics/waves-and-sound',
    type: 'Interactive Lab',
    badgeColor: '#1E40AF',
    badgeBg: '#EFF6FF',
    attribution: 'iamtechartist.com'
  },
  {
    id: 'newtons-laws',
    subject: 'physics',
    subjectLabel: 'PHYSICS',
    grade: 'Class 11',
    title: 'Newton’s Laws of Motion & Dynamics',
    description: 'Hands-on dynamics lab exploring inertia, Newton’s second law (F = ma), action-reaction pairs, momentum conservation, and real-world friction.',
    route: '/learn/physics/newtons-laws',
    type: 'Interactive Lab',
    badgeColor: '#1E40AF',
    badgeBg: '#EFF6FF',
    attribution: 'iamtechartist.com'
  },

  // CHEMISTRY
  {
    id: 'molecular-explorer',
    subject: 'chemistry',
    subjectLabel: 'CHEMISTRY',
    grade: 'Class 10 & 11',
    title: 'Interactive 3D Molecular Explorer',
    description: 'Explore 3D ball-and-stick molecular geometry, chemical bonds, VSEPR shapes, and chemical structures powered by MolView and native 3D WebGL.',
    route: '/learn/chemistry/molecular-explorer',
    type: '3D Lab',
    badgeColor: '#B45309',
    badgeBg: '#FFFBEB',
    attribution: 'MolView & Native WebGL'
  },

  // MATHEMATICS
  {
    id: 'trigonometry',
    subject: 'mathematics',
    subjectLabel: 'MATHEMATICS',
    grade: 'Class 10 & 11',
    title: 'Trigonometry & Unit Circle Interactive Lab',
    description: 'Master the trigonometric unit circle, ASTC quadrant rule, Pythagorean identities, and real-time sinusoidal wave transformations y = A sin(Bx + C) + D.',
    route: '/learn/mathematics/trigonometry',
    type: 'Interactive Lab',
    badgeColor: '#6D28D9',
    badgeBg: '#F5F3FF',
    attribution: 'Native Interactive Canvas'
  },
  {
    id: 'conic-sections',
    subject: 'mathematics',
    subjectLabel: 'MATHEMATICS',
    grade: 'Class 11',
    title: 'Conic Sections 3D & 2D Graphing Lab',
    description: '3D double cone slicing cross-sections paired with an interactive 2D Cartesian grapher for Circle, Parabola, Ellipse, and Hyperbola with live property calculations.',
    route: '/learn/mathematics/conic-sections',
    type: '3D Lab',
    badgeColor: '#6D28D9',
    badgeBg: '#F5F3FF',
    attribution: 'Native WebGL & Canvas'
  }
];

