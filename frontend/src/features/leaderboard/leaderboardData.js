/**
 * STEM Arena & CBSE Platform Leaderboard Data
 * Supports Overall Standings and Subject-wise (Physics, Chemistry, Biology, Mathematics).
 * Places the authenticated student in the middle of the ranking (some above, some below).
 */

export const OVERALL_LEADERBOARD = [
  {
    id: 'user-1',
    name: 'Aarav Sharma',
    city: 'Delhi',
    classLevel: 'Class 10 · CBSE',
    xp: 2850,
    duelsWon: 48,
    accuracy: 96,
    streak: '12d streak',
    badge: 'Grandmaster Champion',
    palette: 'gold',
  },
  {
    id: 'user-2',
    name: 'Ananya Iyer',
    city: 'Chennai',
    classLevel: 'Class 10 · CBSE',
    xp: 2620,
    duelsWon: 44,
    accuracy: 94,
    streak: '9d streak',
    badge: 'Organic Chem Virtuoso',
    palette: 'purple',
  },
  {
    id: 'user-3',
    name: 'Kabir Verma',
    city: 'Bengaluru',
    classLevel: 'Class 10 · CBSE',
    xp: 2390,
    duelsWon: 39,
    accuracy: 91,
    streak: '14d streak',
    badge: 'Quantum Pioneer',
    palette: 'teal',
  },
  {
    id: 'user-4',
    name: 'Priya Patel',
    city: 'Ahmedabad',
    classLevel: 'Class 10 · CBSE',
    xp: 2150,
    duelsWon: 35,
    accuracy: 89,
    streak: '6d streak',
    badge: 'Genetics Prodigy',
    palette: 'rose',
  },
  {
    id: 'user-5',
    name: 'Rohan Mehta',
    city: 'Mumbai',
    classLevel: 'Class 10 · CBSE',
    xp: 1940,
    duelsWon: 31,
    accuracy: 88,
    streak: '8d streak',
    badge: 'Mechanics Whiz',
    palette: 'blue',
  },
  {
    id: 'user-6',
    name: 'Ishita Gupta',
    city: 'Chandigarh',
    classLevel: 'Class 10 · CBSE',
    xp: 1780,
    duelsWon: 28,
    accuracy: 86,
    streak: '5d streak',
    badge: 'Circuit Tactician',
    palette: 'amber',
  },
  // The current user will be placed here at Rank #7!
  {
    id: 'current-user-placeholder',
    isCurrentUser: true,
    name: 'Vansh Shukla',
    city: 'Kanpur',
    classLevel: 'Class 10 · CBSE',
    xp: 1620,
    duelsWon: 25,
    accuracy: 85,
    streak: '7d streak',
    badge: 'Rising STEM Contender',
    palette: 'mint',
  },
  {
    id: 'user-8',
    name: 'Devansh Rao',
    city: 'Hyderabad',
    classLevel: 'Class 10 · CBSE',
    xp: 1480,
    duelsWon: 22,
    accuracy: 83,
    streak: '4d streak',
    badge: 'Thermodynamics Scholar',
    palette: 'purple',
  },
  {
    id: 'user-9',
    name: 'Tanvi Deshmukh',
    city: 'Pune',
    classLevel: 'Class 10 · CBSE',
    xp: 1320,
    duelsWon: 20,
    accuracy: 81,
    streak: '3d streak',
    badge: 'Biochemistry Enthusiast',
    palette: 'rose',
  },
  {
    id: 'user-10',
    name: 'Arjun Nair',
    city: 'Kochi',
    classLevel: 'Class 10 · CBSE',
    xp: 1180,
    duelsWon: 18,
    accuracy: 79,
    streak: '5d streak',
    badge: 'Wave Optics Ace',
    palette: 'teal',
  },
  {
    id: 'user-11',
    name: 'Meera Joshi',
    city: 'Jaipur',
    classLevel: 'Class 10 · CBSE',
    xp: 1020,
    duelsWon: 16,
    accuracy: 78,
    streak: '2d streak',
    badge: 'Periodic Table Explorer',
    palette: 'gold',
  },
  {
    id: 'user-12',
    name: 'Siddharth Sen',
    city: 'Kolkata',
    classLevel: 'Class 10 · CBSE',
    xp: 890,
    duelsWon: 14,
    accuracy: 75,
    streak: '4d streak',
    badge: 'Calculus Apprentice',
    palette: 'blue',
  },
  {
    id: 'user-13',
    name: 'Riya Kapoor',
    city: 'Lucknow',
    classLevel: 'Class 10 · CBSE',
    xp: 760,
    duelsWon: 12,
    accuracy: 72,
    streak: '1d streak',
    badge: 'Optics Novice',
    palette: 'amber',
  },
  {
    id: 'user-14',
    name: 'Vivaan Malhotra',
    city: 'Gurugram',
    classLevel: 'Class 10 · CBSE',
    xp: 640,
    duelsWon: 9,
    accuracy: 70,
    streak: '3d streak',
    badge: 'Cell Anatomy Cadet',
    palette: 'mint',
  },
];

export const SUBJECT_LEADERBOARDS = {
  physics: [
    { id: 'p-1', name: 'Kabir Verma', city: 'Bengaluru', xp: 820, duelsWon: 18, accuracy: 95, badge: 'Optics & Electromagnetism Specialist', palette: 'teal' },
    { id: 'p-2', name: 'Aarav Sharma', city: 'Delhi', xp: 780, duelsWon: 16, accuracy: 93, badge: 'Mechanics Master', palette: 'gold' },
    { id: 'p-3', name: 'Priya Patel', city: 'Ahmedabad', xp: 710, duelsWon: 14, accuracy: 90, badge: 'Circuits Guru', palette: 'rose' },
    { id: 'p-4', name: 'Rohan Mehta', city: 'Mumbai', xp: 650, duelsWon: 12, accuracy: 88, badge: 'Kinematics Lead', palette: 'blue' },
    // Current user at #5 in Physics
    { id: 'current-user-placeholder', isCurrentUser: true, name: 'Vansh Shukla', city: 'Kanpur', xp: 590, duelsWon: 11, accuracy: 87, badge: 'Circuit & Ray Optics Whiz', palette: 'mint' },
    { id: 'p-6', name: 'Ananya Iyer', city: 'Chennai', xp: 520, duelsWon: 10, accuracy: 84, badge: 'Magnetic Fields Cadet', palette: 'purple' },
    { id: 'p-7', name: 'Devansh Rao', city: 'Hyderabad', xp: 460, duelsWon: 8, accuracy: 81, badge: 'Sound & Waves Explorer', palette: 'purple' },
    { id: 'p-8', name: 'Ishita Gupta', city: 'Chandigarh', xp: 410, duelsWon: 7, accuracy: 79, badge: 'Newtonian Apprentice', palette: 'amber' },
    { id: 'p-9', name: 'Arjun Nair', city: 'Kochi', xp: 350, duelsWon: 6, accuracy: 76, badge: 'Coulomb Law Student', palette: 'teal' },
    { id: 'p-10', name: 'Tanvi Deshmukh', city: 'Pune', xp: 290, duelsWon: 5, accuracy: 73, badge: 'Energy Specialist', palette: 'rose' },
  ],

  chemistry: [
    { id: 'c-1', name: 'Ananya Iyer', city: 'Chennai', xp: 850, duelsWon: 19, accuracy: 96, badge: 'Organic Synthesis Virtuoso', palette: 'purple' },
    { id: 'c-2', name: 'Aarav Sharma', city: 'Delhi', xp: 790, duelsWon: 17, accuracy: 92, badge: 'Redox Reactions Champ', palette: 'gold' },
    { id: 'c-3', name: 'Ishita Gupta', city: 'Chandigarh', xp: 730, duelsWon: 15, accuracy: 89, badge: 'Chemical Bonding Lead', palette: 'amber' },
    { id: 'c-4', name: 'Devansh Rao', city: 'Hyderabad', xp: 670, duelsWon: 13, accuracy: 87, badge: 'Electrochemistry Prodigy', palette: 'purple' },
    { id: 'c-5', name: 'Kabir Verma', city: 'Bengaluru', xp: 610, duelsWon: 11, accuracy: 85, badge: 'Periodic Trends Expert', palette: 'teal' },
    { id: 'c-6', name: 'Tanvi Deshmukh', city: 'Pune', xp: 570, duelsWon: 10, accuracy: 84, badge: 'Acid & Bases Scholar', palette: 'rose' },
    // Current user at #7 in Chemistry
    { id: 'current-user-placeholder', isCurrentUser: true, name: 'Vansh Shukla', city: 'Kanpur', xp: 520, duelsWon: 9, accuracy: 83, badge: 'Equation Balancer & Mole Ace', palette: 'mint' },
    { id: 'c-8', name: 'Priya Patel', city: 'Ahmedabad', xp: 470, duelsWon: 8, accuracy: 80, badge: 'Carbon Compounds Explorer', palette: 'rose' },
    { id: 'c-9', name: 'Rohan Mehta', city: 'Mumbai', xp: 420, duelsWon: 7, accuracy: 77, badge: 'Thermodynamics Novice', palette: 'blue' },
    { id: 'c-10', name: 'Siddharth Sen', city: 'Kolkata', xp: 360, duelsWon: 6, accuracy: 74, badge: 'Metals & Non-Metals Learner', palette: 'blue' },
  ],

  biology: [
    { id: 'b-1', name: 'Priya Patel', city: 'Ahmedabad', xp: 870, duelsWon: 20, accuracy: 97, badge: 'Human Physiology & Genetics Master', palette: 'rose' },
    { id: 'b-2', name: 'Ananya Iyer', city: 'Chennai', xp: 810, duelsWon: 18, accuracy: 94, badge: 'Cell Biology Ace', palette: 'purple' },
    { id: 'b-3', name: 'Ishita Gupta', city: 'Chandigarh', xp: 750, duelsWon: 16, accuracy: 91, badge: 'Circulation & Anatomy Lead', palette: 'amber' },
    { id: 'b-4', name: 'Tanvi Deshmukh', city: 'Pune', xp: 690, duelsWon: 14, accuracy: 88, badge: 'Ecology & Evolution Specialist', palette: 'rose' },
    { id: 'b-5', name: 'Meera Joshi', city: 'Jaipur', xp: 630, duelsWon: 12, accuracy: 86, badge: 'Plant Physiology Scholar', palette: 'gold' },
    // Current user at #6 in Biology
    { id: 'current-user-placeholder', isCurrentUser: true, name: 'Vansh Shukla', city: 'Kanpur', xp: 580, duelsWon: 10, accuracy: 86, badge: 'Heart & Double Helix Expert', palette: 'mint' },
    { id: 'b-7', name: 'Aarav Sharma', city: 'Delhi', xp: 510, duelsWon: 9, accuracy: 82, badge: 'Life Processes Cadet', palette: 'gold' },
    { id: 'b-8', name: 'Kabir Verma', city: 'Bengaluru', xp: 450, duelsWon: 7, accuracy: 79, badge: 'Control & Coordination Novice', palette: 'teal' },
    { id: 'b-9', name: 'Arjun Nair', city: 'Kochi', xp: 390, duelsWon: 6, accuracy: 76, badge: 'Heredity Explorer', palette: 'teal' },
    { id: 'b-10', name: 'Riya Kapoor', city: 'Lucknow', xp: 330, duelsWon: 5, accuracy: 72, badge: 'Cell Anatomy Learner', palette: 'amber' },
  ],

  mathematics: [
    { id: 'm-1', name: 'Aarav Sharma', city: 'Delhi', xp: 890, duelsWon: 21, accuracy: 97, badge: 'Calculus & Vectors Grandmaster', palette: 'gold' },
    { id: 'm-2', name: 'Rohan Mehta', city: 'Mumbai', xp: 830, duelsWon: 19, accuracy: 94, badge: 'Coordinate Geometry Prodigy', palette: 'blue' },
    { id: 'm-3', name: 'Kabir Verma', city: 'Bengaluru', xp: 770, duelsWon: 17, accuracy: 91, badge: 'Algebra & Matrices Virtuoso', palette: 'teal' },
    { id: 'm-4', name: 'Siddharth Sen', city: 'Kolkata', xp: 710, duelsWon: 15, accuracy: 89, badge: 'Probability Specialist', palette: 'blue' },
    { id: 'm-5', name: 'Devansh Rao', city: 'Hyderabad', xp: 650, duelsWon: 13, accuracy: 86, badge: 'Conic Sections Ace', palette: 'purple' },
    { id: 'm-6', name: 'Priya Patel', city: 'Ahmedabad', xp: 590, duelsWon: 11, accuracy: 84, badge: 'Quadratic Equations Lead', palette: 'rose' },
    // Current user at #7 in Mathematics
    { id: 'current-user-placeholder', isCurrentUser: true, name: 'Vansh Shukla', city: 'Kanpur', xp: 540, duelsWon: 10, accuracy: 85, badge: 'Trigonometry & Unit Circle Whiz', palette: 'mint' },
    { id: 'm-8', name: 'Ananya Iyer', city: 'Chennai', xp: 480, duelsWon: 8, accuracy: 81, badge: 'Statistics Explorer', palette: 'purple' },
    { id: 'm-9', name: 'Vivaan Malhotra', city: 'Gurugram', xp: 420, duelsWon: 7, accuracy: 78, badge: 'Arithmetic Progressions Novice', palette: 'mint' },
    { id: 'm-10', name: 'Meera Joshi', city: 'Jaipur', xp: 360, duelsWon: 5, accuracy: 74, badge: 'Polynomials Learner', palette: 'gold' },
  ],
};

/**
 * Returns the leaderboard list for a given category ('overall' | 'physics' | 'chemistry' | 'biology' | 'mathematics')
 * with the authenticated user's actual profile name, board/class, and XP dynamically injected!
 */
export function getLeaderboardData(category = 'overall', currentUser = null, userXp = null) {
  const rawList =
    category === 'overall'
      ? OVERALL_LEADERBOARD
      : SUBJECT_LEADERBOARDS[category] || OVERALL_LEADERBOARD;

  const resolvedName = currentUser?.name || 'Vansh Shukla';
  const resolvedClass = `Class ${currentUser?.classLevel || currentUser?.class || 10} · ${currentUser?.board || 'CBSE'}`;

  return rawList.map((entry, index) => {
    if (entry.isCurrentUser) {
      return {
        ...entry,
        rank: index + 1,
        name: resolvedName,
        classLevel: resolvedClass,
        // If the user has earned real XP, keep their real XP or realistic baseline
        xp: userXp ? Math.max(userXp, entry.xp) : entry.xp,
      };
    }
    return {
      ...entry,
      rank: index + 1,
    };
  });
}
