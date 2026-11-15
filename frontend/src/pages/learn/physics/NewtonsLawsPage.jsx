import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, BookOpen, Eye, Activity } from 'lucide-react';
import ExternalSimulationFrame from '../../../components/ExternalSimulationFrame';
import NewtonLawsSimulation from '../../../features/virtual-learning/NewtonLawsSimulation';
import { PaperCard, Button } from '../../../components/ui';
import LearnLabShell from '../LearnLabShell';

export default function NewtonsLawsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('simulation');
  const [simViewMode, setSimViewMode] = useState('3d');

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: 'physics',
        prefill: "Explain Newton's Three Laws of Motion, F = ma derivation, and conservation of linear momentum with real-world CBSE Class 9/11 examples.",
      },
    });
  };

  return (
    <LearnLabShell
      subject="physics"
      backTo="/learn/physics"
      backLabel="Back to Physics"
      hubTitle="Physics Learning Hub"
      hubSubtitle="Optics, Waves & Sound, Newton's Laws"
      badgeIcon={Compass}
      badgeLabel="CBSE Class 9 & 11 • Physics"
      subBadgeLabel="Classical Mechanics & Dynamics"
      title="Newton's Laws of Motion"
      description="Sir Isaac Newton formulated the three fundamental laws governing classical mechanics: inertia, dynamic force acceleration (F = ma), and reciprocal action-reaction pairs (F_AB = -F_BA). Explore how forces change momentum and why total momentum is conserved."
      askLabel="Ask Chotu about Newton's Laws"
      onAskSaarthi={askSaarthi}
      tabs={[
        { id: 'simulation', label: 'Interactive Dynamics Lab', icon: Eye },
        { id: 'laws', label: 'The 3 Laws of Motion', icon: BookOpen },
        { id: 'applications', label: 'Momentum & Real-World Physics', icon: Activity },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      objectives={[
        'Define inertia and explain its quantitative dependence on mass',
        'Derive the second law equation F = ma from rate of momentum change',
        'Demonstrate why action and reaction forces act on different bodies without canceling',
        'Apply conservation of linear momentum to solve recoil and collision numericals',
      ]}
    >
      {activeTab === 'simulation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <PaperCard flat style={{ padding: 'var(--sp-3) var(--sp-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
              <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                <Button
                  size="sm"
                  variant={simViewMode === '3d' ? 'primary' : 'ghost'}
                  onClick={() => setSimViewMode('3d')}
                >
                  3D Holographic Experience
                </Button>
                <Button
                  size="sm"
                  variant={simViewMode === '2d' ? 'primary' : 'ghost'}
                  onClick={() => setSimViewMode('2d')}
                >
                  2D Numerical Physics Lab
                </Button>
              </div>
              <span className="type-small" style={{ color: 'var(--ink-muted)' }}>
                {simViewMode === '3d'
                  ? 'Interactive WebGL 3D Holographic Book'
                  : 'Friction, F = ma & Recoil Carts Simulator'}
              </span>
            </div>
          </PaperCard>

          {simViewMode === '3d' ? (
            <>
              <ExternalSimulationFrame
                src="https://iamtechartist.com/Apps/newtons-laws-of-motion/"
                title="Newton's Laws of Motion: 3D Holographic Lab"
                attributionText="Interactive 3D simulation powered by iamtechartist.com"
                attributionUrl="https://iamtechartist.com/Apps/newtons-laws-of-motion/"
                minHeight="480px"
                defaultHeight="620px"
              />
              <PaperCard flat>
                <h2 className="type-h3" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
                  <Compass size={18} style={{ color: 'var(--physics)' }} />
                  How to Interact with the 3D Holographic Model
                </h2>
                <div className="paper-grid paper-grid--3">
                  <div style={{ background: 'var(--paper-warm)', padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                    <strong className="type-small" style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                      3D Orbit &amp; Rotation
                    </strong>
                    <span className="type-small" style={{ color: 'var(--ink-muted)' }}>
                      Click or touch and drag on the 3D canvas to rotate the holographic scene and marble bust of Newton.
                    </span>
                  </div>
                  <div style={{ background: 'var(--paper-warm)', padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                    <strong className="type-small" style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                      Chapter Rail Navigation
                    </strong>
                    <span className="type-small" style={{ color: 'var(--ink-muted)' }}>
                      Use the vertical nodes along the rail to flip through each chapter and spread of Newton's laws.
                    </span>
                  </div>
                  <div style={{ background: 'var(--paper-warm)', padding: 'var(--sp-3)', borderRadius: 'var(--r-sm)', border: '1px solid var(--paper-edge)' }}>
                    <strong className="type-small" style={{ color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>
                      Fullscreen Laboratory
                    </strong>
                    <span className="type-small" style={{ color: 'var(--ink-muted)' }}>
                      Tap Fullscreen in the toolbar for maximum immersion and smooth WebGL rendering.
                    </span>
                  </div>
                </div>
              </PaperCard>
            </>
          ) : (
            <NewtonLawsSimulation />
          )}
        </div>
      )}

      {activeTab === 'laws' && (
        <PaperCard flat>
          <h2 className="type-h2" style={{ marginBottom: 'var(--sp-4)' }}>
            The Three Laws of Motion (CBSE Statement &amp; Meaning)
          </h2>
          <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
            <div style={{ borderLeft: '4px solid var(--physics)', paddingLeft: 'var(--sp-4)' }}>
              <h3 className="type-h3" style={{ marginBottom: '4px' }}>First Law: Law of Inertia</h3>
              <p className="type-body" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                An object continues in its state of rest or uniform motion along a straight line unless acted upon by a net external unbalanced force. <strong>Mass is the quantitative measure of inertia</strong> — greater mass requires greater force to change velocity.
              </p>
            </div>
            <div style={{ borderLeft: '4px solid var(--maths)', paddingLeft: 'var(--sp-4)' }}>
              <h3 className="type-h3" style={{ marginBottom: '4px' }}>Second Law: Rate of Momentum Change (F = ma)</h3>
              <p className="type-body" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                The rate of change of momentum of a body is directly proportional to the applied unbalanced force and takes place in its direction:
                <br /><strong>F ∝ dp/dt = d(mv)/dt = m(dv/dt) = ma</strong>
                <br /><strong>1 Newton (N):</strong> Force that accelerates 1 kg at 1 m/s².
              </p>
            </div>
            <div style={{ borderLeft: '4px solid var(--biology)', paddingLeft: 'var(--sp-4)' }}>
              <h3 className="type-h3" style={{ marginBottom: '4px' }}>Third Law: Action &amp; Reaction Pairs</h3>
              <p className="type-body" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                To every action, there is an equal and opposite reaction: <strong>F_AB = -F_BA</strong>. Action and reaction forces <strong>never cancel each other</strong> because they act on two different bodies simultaneously.
              </p>
            </div>
          </div>
        </PaperCard>
      )}

      {activeTab === 'applications' && (
        <PaperCard flat>
          <h2 className="type-h2" style={{ marginBottom: 'var(--sp-4)' }}>
            Conservation of Linear Momentum &amp; Practical Cases
          </h2>
          <div style={{ display: 'grid', gap: 'var(--sp-3)' }}>
            <div style={{ background: 'var(--physics-soft)', border: '1px solid var(--paper-edge)', borderRadius: 'var(--r-md)', padding: 'var(--sp-4)' }}>
              <strong className="type-h3" style={{ color: 'var(--physics-ink)', display: 'block', marginBottom: '4px' }}>
                Law of Conservation of Linear Momentum
              </strong>
              <div className="type-mono" style={{ color: 'var(--ink)', marginBottom: '6px' }}>
                m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂
              </div>
              <p className="type-small" style={{ color: 'var(--physics-ink)', margin: 0 }}>
                In an isolated system with no external unbalanced force, total momentum before collision equals total momentum after collision.
              </p>
            </div>

            <div style={{ background: 'var(--paper-warm)', border: '1px solid var(--paper-edge)', borderRadius: 'var(--r-md)', padding: 'var(--sp-4)' }}>
              <strong className="type-h3" style={{ display: 'block', marginBottom: '4px' }}>
                Why a Cricketer Pulls Hands Backwards when Catching
              </strong>
              <p className="type-small" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                From impulse F · Δt = Δp, increasing the impact time Δt lowers the average impact force F exerted on the hands, preventing injury.
              </p>
            </div>

            <div style={{ background: 'var(--paper-warm)', border: '1px solid var(--paper-edge)', borderRadius: 'var(--r-md)', padding: 'var(--sp-4)' }}>
              <strong className="type-h3" style={{ display: 'block', marginBottom: '4px' }}>
                Recoil Velocity of a Gun
              </strong>
              <div className="type-mono" style={{ color: 'var(--ink)', marginBottom: '6px' }}>
                V_recoil = -(m_bullet · v_bullet) / M_gun
              </div>
              <p className="type-small" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                Because gun mass M is far greater than bullet mass m, the recoil velocity is much smaller than the bullet's muzzle velocity.
              </p>
            </div>
          </div>
        </PaperCard>
      )}
    </LearnLabShell>
  );
}
