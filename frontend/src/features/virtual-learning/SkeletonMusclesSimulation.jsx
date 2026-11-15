import React, { useState, useEffect, useRef } from 'react';
import { Button, Field, PaperCard, Tag } from '../../components/ui';
import { resolveCssVar } from '../../components/ui/subjectUtils';

/**
 * Skeleton & Muscles Simulation (P2-8.2)
 * CBSE Class 11 & 12 Biology (Locomotion and Movement):
 * - Human Skeletal & Muscular Framework: 13 key anatomical landmarks.
 * - Antagonistic Muscle Pair Mechanism: Flexion vs Extension at the elbow joint (Biceps brachii contract while Triceps brachii relax, and vice versa).
 * - Layer Toggles: Skeleton only, Muscles only, or Composite anatomy.
 */
export default function SkeletonMusclesSimulation() {
  const [layer, setLayer] = useState('both'); // 'skeleton' | 'muscles' | 'both'
  const [elbowAngle, setElbowAngle] = useState(90); // 30 deg (full flexion) to 170 deg (full extension)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);

  const canvasRef = useRef(null);

  // 13 Anatomical Landmarks (P2-8.2.1)
  const anatomicalParts = [
    { id: 'biceps', name: 'Biceps Brachii', type: 'muscle', role: 'Primary elbow flexor (antagonistic pair)' },
    { id: 'triceps', name: 'Triceps Brachii', type: 'muscle', role: 'Primary elbow extensor (relaxes on flexion)' },
    { id: 'humerus', name: 'Humerus', type: 'bone', role: 'Long bone of the upper arm' },
    { id: 'radius', name: 'Radius', type: 'bone', role: 'Lateral bone of the forearm (rotates for pronation)' },
    { id: 'ulna', name: 'Ulna', type: 'bone', role: 'Medial bone of the forearm forming the elbow hinge' },
    { id: 'deltoid', name: 'Deltoid Muscle', type: 'muscle', role: 'Abducts the arm at shoulder joint' },
    { id: 'pectoralis', name: 'Pectoralis Major', type: 'muscle', role: 'Chest muscle pulling arm across thorax' },
    { id: 'femur', name: 'Femur', type: 'bone', role: 'Longest, strongest bone in human body' },
    { id: 'patella', name: 'Patella (Kneecap)', type: 'bone', role: 'Sesamoid bone protecting the knee joint' },
    { id: 'tibia', name: 'Tibia (Shinbone)', type: 'bone', role: 'Major weight-bearing bone of the lower leg' },
    { id: 'quadriceps', name: 'Quadriceps Femoris', type: 'muscle', role: 'Extends leg at knee joint' },
    { id: 'gastrocnemius', name: 'Gastrocnemius (Calf)', type: 'muscle', role: 'Plantarflexes foot during walking' },
    { id: 'cranium', name: 'Cranium (Skull)', type: 'bone', role: 'Encases and protects brain with suture joints' }
  ];

  const filteredParts = searchQuery.trim()
    ? anatomicalParts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : anatomicalParts;

  // Canvas drawing for Elbow Antagonistic Flexion / Extension
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Shoulder anchor point
    const shoulderX = 140;
    const shoulderY = 80;

    // Elbow joint position (Humerus length = 110px)
    const humerusLen = 110;
    const elbowX = shoulderX;
    const elbowY = shoulderY + humerusLen;

    // Forearm (Radius/Ulna) length = 120px
    const forearmLen = 120;
    // Calculate hand position based on elbowAngle (in radians)
    // 0 deg = down, 90 deg = horizontal, 150 deg = curled up
    const rad = ((180 - elbowAngle) * Math.PI) / 180;
    const handX = elbowX + forearmLen * Math.sin(rad);
    const handY = elbowY - forearmLen * Math.cos(rad);

    const cBone = resolveCssVar('--paper-edge');
    const cBoneOutline = resolveCssVar('--ink-soft');
    const cJoint = resolveCssVar('--paper-aged');
    const cMuted = resolveCssVar('--ink-muted');
    const cBicepsActive = resolveCssVar('--red-600');
    const cBicepsRest = resolveCssVar('--red-border');
    const cTricepsActive = resolveCssVar('--physics');
    const cTricepsRest = resolveCssVar('--physics-soft');
    const cInk = resolveCssVar('--ink');

    // 1. Draw Skeleton Layer (Bones)
    if (layer === 'skeleton' || layer === 'both') {
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.strokeStyle = cBone;

      // Humerus
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(elbowX, elbowY);
      ctx.stroke();

      // Forearm (Radius + Ulna)
      ctx.beginPath();
      ctx.moveTo(elbowX, elbowY);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      // Bone highlights / outlines
      ctx.lineWidth = 2;
      ctx.strokeStyle = cBoneOutline;
      ctx.strokeRect(shoulderX - 8, shoulderY - 8, 16, 16); // Shoulder joint

      // Elbow Hinge Joint (condyle)
      ctx.beginPath();
      ctx.arc(elbowX, elbowY, 10, 0, Math.PI * 2);
      ctx.fillStyle = cJoint;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = cMuted;
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('Humerus (Upper arm)', shoulderX - 110, (shoulderY + elbowY) / 2);
      ctx.fillText('Elbow Hinge Joint', elbowX + 16, elbowY + 4);
      ctx.fillText('Radius & Ulna', (elbowX + handX) / 2 + 10, (elbowY + handY) / 2 + 16);
    }

    // 2. Draw Muscle Layer (Antagonistic Biceps & Triceps)
    if (layer === 'muscles' || layer === 'both') {
      const isFlexed = elbowAngle < 90;
      const bicepsBellyWidth = 14 + (180 - elbowAngle) * 0.12; // bulges during flexion
      const tricepsBellyWidth = 12 + (elbowAngle) * 0.08; // stretches during extension

      ctx.beginPath();
      ctx.moveTo(shoulderX - 4, shoulderY + 15);
      ctx.quadraticCurveTo(shoulderX + 25 + bicepsBellyWidth, (shoulderY + elbowY) / 2, elbowX + 15, elbowY - 10);
      ctx.lineWidth = bicepsBellyWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = isFlexed ? cBicepsActive : cBicepsRest;
      ctx.stroke();

      // Triceps Brachii (Posterior / Back)
      ctx.beginPath();
      ctx.moveTo(shoulderX - 12, shoulderY + 20);
      ctx.quadraticCurveTo(shoulderX - 25 - tricepsBellyWidth, (shoulderY + elbowY) / 2, elbowX - 8, elbowY + 8);
      ctx.lineWidth = tricepsBellyWidth;
      ctx.strokeStyle = !isFlexed ? cTricepsActive : cTricepsRest;
      ctx.stroke();

      // Muscle Status Callouts
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = cBicepsActive;
      ctx.fillText(
        `Biceps: ${isFlexed ? 'CONTRACTED (Shortened & Bulging)' : 'RELAXED (Stretched)'}`,
        shoulderX + 50,
        shoulderY + 50
      );

      ctx.fillStyle = cTricepsActive;
      ctx.fillText(
        `Triceps: ${!isFlexed ? 'CONTRACTED (Pulling Arm Straight)' : 'RELAXED (Elongated)'}`,
        shoulderX - 180,
        shoulderY + 110
      );
    }

    // Angle indicator
    ctx.fillStyle = cInk;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Joint Angle: ${elbowAngle}° (${elbowAngle < 90 ? 'Flexion' : 'Extension'})`, 20, 25);
  }, [layer, elbowAngle]);

  return (
    <PaperCard flat style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      {/* Layer Toggles & Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          {[
            { id: 'both', label: 'Composite (Both)' },
            { id: 'muscles', label: 'Muscles Only' },
            { id: 'skeleton', label: 'Skeleton Only' }
          ].map((t) => (
            <Button
              key={t.id}
              type="button"
              size="sm"
              variant={layer === t.id ? 'primary' : 'secondary'}
              onClick={() => setLayer(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </div>

        <div style={{ minWidth: '200px', flex: '0 1 240px' }}>
          <Field
            type="text"
            aria-label="Search bone or muscle"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bone or muscle..."
          />
        </div>
      </div>

      {/* Main Viewport & Anatomical List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-3)' }}>
        <div style={{ backgroundColor: 'var(--paper-warm)', borderRadius: 'var(--r-md)', border: '1px solid var(--paper-edge)', height: '300px', overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            width={480}
            height={300}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>

        {/* 13 Landmark Explorer List */}
        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
            CBSE Anatomy Landmarks ({filteredParts.length})
          </div>
          {filteredParts.map((part) => (
            <button
              key={part.id}
              type="button"
              onClick={() => setSelectedPart(part)}
              className={`option-card${selectedPart?.id === part.id ? ' option-card--selected' : ''}`}
              style={{
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: '4px',
                padding: 'var(--sp-2) var(--sp-3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>{part.name}</span>
                <Tag tone={part.type === 'muscle' ? 'red' : 'neutral'}>{part.type}</Tag>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>{part.role}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Elbow Joint Angle Slider */}
      <PaperCard flat style={{ padding: 'var(--sp-3)', backgroundColor: 'var(--paper-warm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
          <span>Elbow Joint Movement (Flexion vs Extension):</span>
          <Tag tone="maths">{elbowAngle}° ({elbowAngle < 90 ? 'Flexion (Arm bent)' : 'Extension (Arm straight)'})</Tag>
        </div>
        <input
          type="range"
          min="40"
          max="160"
          step="2"
          value={elbowAngle}
          onChange={(e) => setElbowAngle(parseInt(e.target.value, 10))}
          aria-label="Elbow Joint Movement angle in degrees"
          style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--maths)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--ink-soft)', marginTop: '4px' }}>
          <span>← Full Flexion (Biceps shorten)</span>
          <span>Full Extension (Triceps shorten) →</span>
        </div>
      </PaperCard>
    </PaperCard>
  );
}

