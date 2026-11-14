import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Activity,
  BookOpen,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Eye,
  Layers,
  Compass,
  ArrowRight
} from 'lucide-react';
import ExternalSimulationFrame from '../components/ExternalSimulationFrame';

export default function HumanHeartPage() {
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'theory' | 'pathway'

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '14px' }}>
        <Link
          to="/subjects"
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
          <ArrowLeft size={16} /> Back to Biology & Subjects
        </Link>
      </div>

      {/* Category Indicator & Header Card */}
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
            <Heart size={12} fill="#1D4ED8" /> CBSE Class 10–12 • Biology
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              backgroundColor: '#F0FDF4',
              color: '#166534',
              padding: '3px 10px',
              borderRadius: '999px'
            }}
          >
            Life Processes & Human Physiology
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-muted, #64748B)' }}>
            Board Curriculum Standard
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '6px 0 10px 0', color: 'var(--color-text, #0F172A)' }}>
          Human Heart & Circulatory System
        </h1>

        <p style={{ color: 'var(--color-muted, #64748B)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
          The human heart is a muscular organ roughly the size of a clenched fist, responsible for pumping blood continuously throughout the body. Because humans are warm-blooded (endothermic) organisms requiring high energy efficiency, our heart features four distinct chambers that completely prevent the mixing of oxygenated and deoxygenated blood through a remarkable double circulatory cycle.
        </p>

        {/* View Mode Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', borderTop: '1px solid var(--color-border, #E2E8F0)', paddingTop: '14px' }}>
          {[
            { id: 'simulation', label: '3D Simulation', icon: Eye },
            { id: 'theory', label: 'Core Theory', icon: BookOpen },
            { id: 'pathway', label: 'Blood Flow Pathway', icon: Activity }
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
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Simulation Viewport */}
      {activeTab === 'simulation' && (
        <div style={{ marginBottom: '22px' }}>
          <ExternalSimulationFrame
            src="https://iamtechartist.com/Apps/heart-and-circulatory-system/"
            title="Human Heart & Circulatory System 3D Interactive Lab"
            attributionText="Interactive simulation powered by iamtechartist.com"
            attributionUrl="https://iamtechartist.com/Apps/heart-and-circulatory-system/"
            minHeight="480px"
            defaultHeight="600px"
          />

          {/* How to Interact Instructions Card */}
          <div className="card" style={{ marginTop: '16px', padding: '18px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px', color: '#1E293B' }}>
              <Compass size={18} color="var(--color-primary, #2563EB)" /> How to Interact with the 3D Simulation
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.84rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>🔄 Rotate & Orbit</strong>
                <span style={{ color: '#64748B' }}>Click/touch and drag across the canvas to inspect the heart from all 360° angles.</span>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>🔍 Zoom & Focus</strong>
                <span style={{ color: '#64748B' }}>Scroll your mouse wheel or pinch on mobile to zoom close into specific valves and vessels.</span>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>⛶ Fullscreen Mode</strong>
                <span style={{ color: '#64748B' }}>Use the Fullscreen button in the simulation header bar for an expansive laboratory study view.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Theory View */}
      {activeTab === 'theory' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            Key Anatomical Concepts (CBSE Curriculum)
          </h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ borderLeft: '4px solid #2563EB', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                1. Four-Chambered Architecture
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                The heart is divided into two upper thin-walled receiving chambers called <strong>Atria</strong> (Right Atrium and Left Atrium) and two lower thick-walled pumping chambers called <strong>Ventricles</strong> (Right Ventricle and Left Ventricle). A thick muscular wall called the <strong>Septum</strong> completely separates the right and left sides.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #7C3AED', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                2. Heart Valves & Unidirectional Flow
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                Valves ensure that blood flows strictly in one direction and does not backflow when the atria or ventricles contract:
                <br />• <strong>Tricuspid Valve:</strong> Between Right Atrium and Right Ventricle.
                <br />• <strong>Bicuspid (Mitral) Valve:</strong> Between Left Atrium and Left Ventricle.
                <br />• <strong>Semilunar Valves:</strong> Located at the base of the Pulmonary Artery and Aorta.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #16A34A', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                3. Cardiac Systole & Diastole
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                The rhythmic contraction of heart muscles is called <strong>Systole</strong> (pumping phase), and relaxation is called <strong>Diastole</strong> (filling phase). Normal human arterial blood pressure is approximately <strong>120/80 mm Hg</strong> (120 mm Hg systolic, 80 mm Hg diastolic), measured using a <em>sphygmomanometer</em>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Blood Pathway View */}
      {activeTab === 'pathway' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            Double Circulation: Two Coordinated Loops
          </h2>

          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontWeight: '700', color: '#1D4ED8', fontSize: '0.95rem', marginBottom: '6px' }}>
                🔵 Loop 1: Pulmonary Circulation (Deoxygenated Blood to Lungs)
              </div>
              <ol style={{ fontSize: '0.86rem', color: '#1E3A8A', margin: 0, paddingLeft: '20px', lineHeight: 1.6 }}>
                <li>Deoxygenated blood from body tissues enters through the <strong>Superior and Inferior Vena Cava</strong> into the <strong>Right Atrium</strong>.</li>
                <li>Right Atrium contracts $\rightarrow$ blood flows through the <strong>Tricuspid Valve</strong> into the <strong>Right Ventricle</strong>.</li>
                <li>Right Ventricle contracts $\rightarrow$ blood is pumped through the <strong>Pulmonary Artery</strong> into the <strong>Lungs</strong>, where carbon dioxide is released and oxygen is absorbed.</li>
              </ol>
            </div>

            <div style={{ backgroundColor: '#FDF2F8', border: '1px solid #FBCFE8', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontWeight: '700', color: '#BE185D', fontSize: '0.95rem', marginBottom: '6px' }}>
                🔴 Loop 2: Systemic Circulation (Oxygenated Blood to Body Tissues)
              </div>
              <ol style={{ fontSize: '0.86rem', color: '#831843', margin: 0, paddingLeft: '20px', lineHeight: 1.6 }}>
                <li>Oxygen-rich blood from lungs returns via four <strong>Pulmonary Veins</strong> into the <strong>Left Atrium</strong>.</li>
                <li>Left Atrium contracts $\rightarrow$ blood passes through the <strong>Bicuspid (Mitral) Valve</strong> into the thick-walled <strong>Left Ventricle</strong>.</li>
                <li>Left Ventricle contracts forcefully $\rightarrow$ oxygenated blood surges into the <strong>Aorta</strong>, branching across arteries to nourish the brain, muscles, and all vital organs.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Learning Objectives Checklist */}
      <div className="card" style={{ padding: '20px', marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={18} color="var(--color-success, #16A34A)" /> CBSE Learning Objectives for this Module
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
          {[
            'Identify the 4 chambers: Right/Left Atria and Right/Left Ventricles',
            'Explain why ventricles have thicker muscular walls than atria',
            'Describe why double circulation is necessary for warm-blooded mammals',
            'State the function of valves in maintaining unidirectional blood flow',
            'Trace the step-by-step pathway of blood from Vena Cava to Aorta',
            'Relate systolic/diastolic pressure to cardiac pumping cycles'
          ].map((obj, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#334155' }}>
              <span style={{ color: 'var(--color-success, #16A34A)', marginTop: '2px' }}>✓</span>
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Return & Next Steps Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        <Link
          to="/subjects"
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
              CURRICULUM
            </div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Biology: Life Processes</div>
            <div style={{ color: 'var(--color-muted, #64748B)', fontSize: '0.78rem' }}>Chapter notes & diagrams</div>
          </div>
          <ArrowRight size={18} color="var(--color-primary, #2563EB)" />
        </Link>

        <Link
          to="/virtual-learning"
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
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase' }}>
              MORE SIMULATIONS
            </div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>All 3D STEM Labs</div>
            <div style={{ color: 'var(--color-muted, #64748B)', fontSize: '0.78rem' }}>Optics, Molecules, Pendulum & more</div>
          </div>
          <ArrowRight size={18} color="#7C3AED" />
        </Link>
      </div>
    </div>
  );
}

