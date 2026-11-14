import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Compass,
  BookOpen,
  CheckCircle2,
  Bot,
  Eye,
  Activity,
  ArrowRight
} from 'lucide-react';
import ExternalSimulationFrame from '../../../components/ExternalSimulationFrame';
import NewtonLawsSimulation from '../../../features/virtual-learning/NewtonLawsSimulation';

export default function NewtonsLawsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'laws' | 'applications'
  const [simViewMode, setSimViewMode] = useState('3d'); // '3d' | '2d'

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: 'physics',
        prefill: "Explain Newton's Three Laws of Motion, F = ma derivation, and conservation of linear momentum with real-world CBSE Class 9/11 examples."
      }
    });
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Breadcrumbs & Ask Saarthi */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <Link
          to="/learn/physics"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-primary, #2563EB)',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} /> Back to Physics
        </Link>

        <button
          type="button"
          onClick={askSaarthi}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#EDE9FE',
            color: '#6D28D9',
            border: '1px solid #C4B5FD',
            borderRadius: '999px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <Bot size={15} /> Ask Saarthi about Newton's Laws
        </button>
      </div>

      {/* Header Card */}
      <div className="card" style={{ marginBottom: '20px', padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              padding: '3px 10px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Compass size={12} /> CBSE Class 9 & 11 • Physics
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              padding: '3px 10px',
              borderRadius: '999px'
            }}
          >
            Classical Mechanics & Dynamics
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '6px 0 10px 0', color: 'var(--color-text, #0F172A)' }}>
          Newton's Laws of Motion
        </h1>

        <p style={{ color: 'var(--color-muted, #64748B)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
          Sir Isaac Newton formulated the three fundamental laws governing classical mechanics: inertia, dynamic force acceleration ($F = ma$), and reciprocal action-reaction pairs ($\vec{F}_{AB} = -\vec{F}_{BA}$). Explore how forces cause momentum changes and discover why total linear momentum is strictly conserved in isolated systems.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', borderTop: '1px solid var(--color-border, #E2E8F0)', paddingTop: '14px' }}>
          {[
            { id: 'simulation', label: 'Interactive Dynamics Lab', icon: Eye },
            { id: 'laws', label: 'The 3 Laws of Motion', icon: BookOpen },
            { id: 'applications', label: 'Momentum & Real-World Physics', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm, 8px)',
                  border: isActive ? '1px solid var(--color-primary, #2563EB)' : '1px solid var(--color-border, #E2E8F0)',
                  backgroundColor: isActive ? 'var(--color-primary-light, #EFF6FF)' : 'var(--color-surface, #FFFFFF)',
                  color: isActive ? 'var(--color-primary, #2563EB)' : 'var(--color-muted, #64748B)',
                  fontSize: '0.84rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Simulation */}
      {activeTab === 'simulation' && (
        <div style={{ marginBottom: '22px' }}>
          {/* Sub-mode selector: 3D Holographic Model vs 2D Numerical Dynamics Lab */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderRadius: '8px', padding: '3px' }}>
              <button
                type="button"
                onClick={() => setSimViewMode('3d')}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: simViewMode === '3d' ? '#2563EB' : 'transparent',
                  color: simViewMode === '3d' ? '#FFFFFF' : '#64748B'
                }}
              >
                ✨ 3D Holographic Experience
              </button>
              <button
                type="button"
                onClick={() => setSimViewMode('2d')}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: simViewMode === '2d' ? '#2563EB' : 'transparent',
                  color: simViewMode === '2d' ? '#FFFFFF' : '#64748B'
                }}
              >
                📐 2D Numerical Physics Lab
              </button>
            </div>

            <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
              {simViewMode === '3d'
                ? 'Interactive WebGL 3D Holographic Book'
                : 'Friction, F = ma & Recoil Carts Simulator'}
            </span>
          </div>

          {simViewMode === '3d' ? (
            <div>
              <ExternalSimulationFrame
                src="https://iamtechartist.com/Apps/newtons-laws-of-motion/"
                title="Newton's Laws of Motion: 3D Holographic Lab"
                attributionText="Interactive 3D simulation powered by iamtechartist.com"
                attributionUrl="https://iamtechartist.com/Apps/newtons-laws-of-motion/"
                minHeight="480px"
                defaultHeight="620px"
              />

              {/* Instructions */}
              <div className="card" style={{ marginTop: '16px', padding: '18px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px', color: '#1E293B' }}>
                  <Compass size={18} color="var(--color-primary, #2563EB)" /> How to Interact with the 3D Holographic Model
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.84rem' }}>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>🔄 3D Orbit & Rotation</strong>
                    <span style={{ color: '#64748B' }}>Click or touch and drag on the 3D canvas to rotate the holographic scene and marble bust of Newton.</span>
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>📖 Chapter Rail Navigation</strong>
                    <span style={{ color: '#64748B' }}>Use the vertical icons and nodes along the right rail to flip through each chapter and spread of Newton's laws.</span>
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>⛶ Fullscreen Laboratory</strong>
                    <span style={{ color: '#64748B' }}>Tap Fullscreen in the upper toolbar for maximum immersion and responsive GPU rendering.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <NewtonLawsSimulation />
            </div>
          )}
        </div>
      )}

      {/* Tab 2: The 3 Laws */}
      {activeTab === 'laws' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            The Three Laws of Motion (CBSE Statement & Meaning)
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ borderLeft: '4px solid #2563EB', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                First Law: Law of Inertia
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                An object continues in its state of rest or uniform motion along a straight line unless acted upon by a net external unbalanced force. <strong>Mass is the quantitative measure of inertia</strong> — greater mass requires greater force to change velocity.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #7C3AED', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                Second Law: Rate of Momentum Change (F = ma)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                The rate of change of momentum of a body is directly proportional to the applied unbalanced force and takes place in the direction of the force:
                <br />
                <strong>F ∝ dp/dt = d(mv)/dt = m(dv/dt) = ma</strong>
                <br />
                <strong>1 Newton (N):</strong> Force that accelerates a mass of 1 kg at 1 m/s².
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #16A34A', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                Third Law: Action & Reaction Pairs
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                To every action, there is always an equal and opposite reaction: <strong>F_AB = -F_BA</strong>. Action and reaction forces <strong>never cancel each other out</strong> because they act on two different bodies simultaneously.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Applications & Momentum */}
      {activeTab === 'applications' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            Conservation of Linear Momentum & Practical Cases
          </h2>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '16px' }}>
              <strong style={{ color: '#1D4ED8', display: 'block', marginBottom: '6px' }}>
                Law of Conservation of Linear Momentum
              </strong>
              <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#1E3A8A', margin: '4px 0' }}>
                m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂
              </div>
              <p style={{ fontSize: '0.84rem', color: '#1E40AF', margin: 0 }}>
                In an isolated system with no external unbalanced force, the total momentum before collision equals the total momentum after collision.
              </p>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px' }}>
              <strong style={{ color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Why a Cricketer Pulls Hands Backwards when Catching
              </strong>
              <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                From impulse $F \cdot \Delta t = \Delta p$, increasing the impact time $\Delta t$ reduces the impact force $F$ exerted by the fast-moving cricket ball on the hands, preventing severe injury.
              </p>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px' }}>
              <strong style={{ color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Recoil Velocity of a Gun
              </strong>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#0F172A', margin: '4px 0' }}>
                V_recoil = -(m_bullet · v_bullet) / M_gun
              </div>
              <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0 }}>
                Because the gun mass $M$ is much larger than the bullet mass $m$, the recoil velocity is far smaller than the bullet muzzle velocity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Learning Objectives */}
      <div className="card" style={{ padding: '20px', marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={18} color="var(--color-success, #16A34A)" /> Learning Objectives
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
          {[
            "Define inertia and explain its quantitative dependence on mass",
            "Derive the second law equation F = ma from rate of momentum change",
            "Demonstrate why action and reaction forces act on different bodies without canceling",
            "Apply conservation of linear momentum to solve recoil and collision numericals"
          ].map((obj, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
              <span style={{ color: 'var(--color-success, #16A34A)', marginTop: '2px' }}>✓</span>
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Return Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        <Link
          to="/learn/physics"
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: 'inherit',
            marginBottom: 0,
            padding: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary, #2563EB)', textTransform: 'uppercase' }}>
              PHYSICS MODULES
            </div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Physics Learning Hub</div>
            <div style={{ color: 'var(--color-muted, #64748B)', fontSize: '0.78rem' }}>Optics, Waves & Sound, Newton's Laws</div>
          </div>
          <ArrowRight size={18} color="var(--color-primary, #2563EB)" />
        </Link>
      </div>
    </div>
  );
}
