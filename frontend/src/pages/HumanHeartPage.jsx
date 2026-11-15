import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, BookOpen, Compass, Eye, ArrowRight } from 'lucide-react';
import ExternalSimulationFrame from '../components/ExternalSimulationFrame';
import { PaperCard } from '../components/ui';
import LearnLabShell from './learn/LearnLabShell';

export default function HumanHeartPage() {
  const [activeTab, setActiveTab] = useState('simulation');

  return (
    <LearnLabShell
      subject="biology"
      backTo="/subjects"
      backLabel="Back to Biology & Subjects"
      badgeIcon={Heart}
      badgeLabel="CBSE Class 10–12 • Biology"
      subBadgeLabel="Life Processes & Human Physiology"
      title="Human Heart & Circulatory System"
      description="The human heart is a muscular organ roughly the size of a clenched fist, responsible for pumping blood continuously throughout the body. Because humans are warm-blooded (endothermic) organisms requiring high energy efficiency, our heart features four distinct chambers that completely prevent the mixing of oxygenated and deoxygenated blood through a double circulatory cycle."
      tabs={[
        { id: 'simulation', label: '3D Simulation', icon: Eye },
        { id: 'theory', label: 'Core Theory', icon: BookOpen },
        { id: 'pathway', label: 'Blood Flow Pathway', icon: Activity },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      objectives={[
        'Identify the 4 chambers: Right/Left Atria and Right/Left Ventricles',
        'Explain why ventricles have thicker muscular walls than atria',
        'Describe why double circulation is necessary for warm-blooded mammals',
        'State the function of valves in maintaining unidirectional blood flow',
        'Trace the step-by-step pathway of blood from Vena Cava to Aorta',
        'Relate systolic/diastolic pressure to cardiac pumping cycles',
      ]}
    >
      {activeTab === 'simulation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <ExternalSimulationFrame
            src="https://iamtechartist.com/Apps/heart-and-circulatory-system/"
            title="Human Heart & Circulatory System 3D Interactive Lab"
            attributionText="Interactive simulation powered by iamtechartist.com"
            attributionUrl="https://iamtechartist.com/Apps/heart-and-circulatory-system/"
            minHeight="480px"
            defaultHeight="600px"
          />

          <PaperCard flat>
            <h2 className="type-h3" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
              <Compass size={18} style={{ color: 'var(--biology)' }} />
              How to Interact with the 3D Simulation
            </h2>
            <div className="paper-grid paper-grid--3">
              <div style={{ background: 'var(--paper-warm)', padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                <strong className="type-small" style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                  Rotate &amp; Orbit
                </strong>
                <span className="type-small" style={{ color: 'var(--ink-muted)' }}>
                  Click/touch and drag across the canvas to inspect the heart from all 360° angles.
                </span>
              </div>
              <div style={{ background: 'var(--paper-warm)', padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                <strong className="type-small" style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                  Zoom &amp; Focus
                </strong>
                <span className="type-small" style={{ color: 'var(--ink-muted)' }}>
                  Scroll your mouse wheel or pinch on mobile to zoom close into specific valves and vessels.
                </span>
              </div>
              <div style={{ background: 'var(--paper-warm)', padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                <strong className="type-small" style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                  Fullscreen Mode
                </strong>
                <span className="type-small" style={{ color: 'var(--ink-muted)' }}>
                  Use the Fullscreen button in the simulation header bar for an expansive laboratory study view.
                </span>
              </div>
            </div>
          </PaperCard>
        </div>
      )}

      {activeTab === 'theory' && (
        <PaperCard flat>
          <h2 className="type-h2" style={{ marginBottom: 'var(--sp-4)' }}>
            Key Anatomical Concepts (CBSE Curriculum)
          </h2>
          <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
            <div style={{ borderLeft: '4px solid var(--physics)', paddingLeft: 'var(--sp-4)' }}>
              <h3 className="type-h3" style={{ marginBottom: '4px' }}>1. Four-Chambered Architecture</h3>
              <p className="type-body" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                The heart is divided into two upper thin-walled receiving chambers called <strong>Atria</strong> (Right Atrium and Left Atrium) and two lower thick-walled pumping chambers called <strong>Ventricles</strong> (Right Ventricle and Left Ventricle). A thick muscular wall called the <strong>Septum</strong> completely separates the right and left sides.
              </p>
            </div>
            <div style={{ borderLeft: '4px solid var(--maths)', paddingLeft: 'var(--sp-4)' }}>
              <h3 className="type-h3" style={{ marginBottom: '4px' }}>2. Heart Valves &amp; Unidirectional Flow</h3>
              <p className="type-body" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                Valves ensure blood flows strictly forward without backflow when chambers contract:
                <br />• <strong>Tricuspid Valve:</strong> Between Right Atrium and Right Ventricle.
                <br />• <strong>Bicuspid (Mitral) Valve:</strong> Between Left Atrium and Left Ventricle.
                <br />• <strong>Semilunar Valves:</strong> At the base of the Pulmonary Artery and Aorta.
              </p>
            </div>
            <div style={{ borderLeft: '4px solid var(--biology)', paddingLeft: 'var(--sp-4)' }}>
              <h3 className="type-h3" style={{ marginBottom: '4px' }}>3. Cardiac Systole &amp; Diastole</h3>
              <p className="type-body" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                Rhythmic contraction of heart muscles is <strong>Systole</strong> (pumping phase), and relaxation is <strong>Diastole</strong> (filling phase). Normal human arterial blood pressure is approximately <strong>120/80 mm Hg</strong> (120 systolic, 80 diastolic), measured using a <em>sphygmomanometer</em>.
              </p>
            </div>
          </div>
        </PaperCard>
      )}

      {activeTab === 'pathway' && (
        <PaperCard flat>
          <h2 className="type-h2" style={{ marginBottom: 'var(--sp-4)' }}>
            Double Circulation: Two Coordinated Loops
          </h2>
          <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
            <div style={{ background: 'var(--physics-soft)', border: '1px solid var(--paper-edge)', borderRadius: 'var(--r-md)', padding: 'var(--sp-4)' }}>
              <div className="type-h3" style={{ color: 'var(--physics-ink)', marginBottom: 'var(--sp-2)' }}>
                Loop 1: Pulmonary Circulation (Deoxygenated Blood to Lungs)
              </div>
              <ol className="type-small" style={{ color: 'var(--ink)', margin: 0, paddingLeft: 'var(--sp-5)', lineHeight: 1.7 }}>
                <li>Deoxygenated blood from body tissues enters through the <strong>Superior and Inferior Vena Cava</strong> into the <strong>Right Atrium</strong>.</li>
                <li>Right Atrium contracts → blood flows through the <strong>Tricuspid Valve</strong> into the <strong>Right Ventricle</strong>.</li>
                <li>Right Ventricle contracts → blood is pumped through the <strong>Pulmonary Artery</strong> into the <strong>Lungs</strong>, releasing CO₂ and absorbing O₂.</li>
              </ol>
            </div>

            <div style={{ background: 'var(--red-soft)', border: '1px solid var(--red-border)', borderRadius: 'var(--r-md)', padding: 'var(--sp-4)' }}>
              <div className="type-h3" style={{ color: 'var(--red-ink)', marginBottom: 'var(--sp-2)' }}>
                Loop 2: Systemic Circulation (Oxygenated Blood to Body Tissues)
              </div>
              <ol className="type-small" style={{ color: 'var(--ink)', margin: 0, paddingLeft: 'var(--sp-5)', lineHeight: 1.7 }}>
                <li>Oxygen-rich blood from lungs returns via four <strong>Pulmonary Veins</strong> into the <strong>Left Atrium</strong>.</li>
                <li>Left Atrium contracts → blood passes through the <strong>Bicuspid (Mitral) Valve</strong> into the thick-walled <strong>Left Ventricle</strong>.</li>
                <li>Left Ventricle contracts forcefully → oxygenated blood surges into the <strong>Aorta</strong> to nourish the brain, muscles, and all vital organs.</li>
              </ol>
            </div>
          </div>
        </PaperCard>
      )}

      <div className="paper-grid paper-grid--2" style={{ marginTop: 'var(--sp-5)' }}>
        <Link to="/subjects" style={{ textDecoration: 'none', color: 'inherit' }}>
          <PaperCard interactive tilt="tilt-a">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="type-eyebrow" style={{ color: 'var(--biology-ink)' }}>CURRICULUM</div>
                <div className="type-h3">Biology: Life Processes</div>
                <div className="type-small" style={{ color: 'var(--ink-muted)' }}>Chapter notes &amp; diagrams</div>
              </div>
              <ArrowRight size={18} style={{ color: 'var(--ink-muted)' }} />
            </div>
          </PaperCard>
        </Link>

        <Link to="/virtual-learning" style={{ textDecoration: 'none', color: 'inherit' }}>
          <PaperCard interactive tilt="tilt-b">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="type-eyebrow" style={{ color: 'var(--physics-ink)' }}>MORE SIMULATIONS</div>
                <div className="type-h3">All 3D STEM Labs</div>
                <div className="type-small" style={{ color: 'var(--ink-muted)' }}>Optics, Molecules, Pendulum &amp; more</div>
              </div>
              <ArrowRight size={18} style={{ color: 'var(--ink-muted)' }} />
            </div>
          </PaperCard>
        </Link>
      </div>
    </LearnLabShell>
  );
}
