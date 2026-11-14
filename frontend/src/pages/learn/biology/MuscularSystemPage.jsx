import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Activity,
  BookOpen,
  CheckCircle2,
  Compass,
  Bot,
  Eye,
  Layers,
  ArrowRight
} from 'lucide-react';
import ExternalSimulationFrame from '../../../components/ExternalSimulationFrame';

export default function MuscularSystemPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'theory' | 'muscles'

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: 'biology',
        prefill: 'Explain how antagonistic muscle pairs (like biceps and triceps) work together during elbow flexion and extension according to CBSE Class 10/11 Biology.'
      }
    });
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <Link
          to="/learn/biology"
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
          <ArrowLeft size={16} /> Back to Biology
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
          <Bot size={15} /> Ask Saarthi about Muscles
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
            <Activity size={12} /> CBSE Class 10–12 • Biology
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
            Locomotion & Muscular Physiology
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '6px 0 10px 0', color: 'var(--color-text, #0F172A)' }}>
          Human Muscular System – The 13 Muscles
        </h1>

        <p style={{ color: 'var(--color-muted, #64748B)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
          Skeletal muscles work in coordinated antagonistic pairs across joints to generate bodily movement and maintain posture. This reference experience focuses specifically on the <strong>13 major foundational muscles</strong> of the anterior and posterior human anatomy, illustrating their origin, insertion, and mechanical contraction dynamics.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', borderTop: '1px solid var(--color-border, #E2E8F0)', paddingTop: '14px' }}>
          {[
            { id: 'simulation', label: '3D Anatomy Explorer', icon: Eye },
            { id: 'theory', label: 'Contraction Dynamics', icon: BookOpen },
            { id: 'muscles', label: '13 Major Muscles Catalog', icon: Layers }
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
          <ExternalSimulationFrame
            src="https://iamtechartist.com/the-13-muscles/"
            title="Human Muscular System – The 13 Muscles (iamtechartist.com)"
            attributionText="Interactive simulation powered by iamtechartist.com"
            attributionUrl="https://iamtechartist.com/the-13-muscles/"
            minHeight="480px"
            defaultHeight="620px"
          />

          {/* Instructions */}
          <div className="card" style={{ marginTop: '16px', padding: '18px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px', color: '#1E293B' }}>
              <Compass size={18} color="var(--color-primary, #2563EB)" /> How to Explore the 13 Muscles
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.84rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>🔄 Anterior vs Posterior</strong>
                <span style={{ color: '#64748B' }}>Rotate between frontal (chest, abs, quads) and dorsal (trapezius, lats, hamstrings) views.</span>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>🔍 Muscle Identification</strong>
                <span style={{ color: '#64748B' }}>Hover or tap individual muscle groups to inspect muscle fiber orientation and action.</span>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>⛶ Fullscreen Mode</strong>
                <span style={{ color: '#64748B' }}>Use the Fullscreen toggle for distraction-free anatomical examination.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Contraction Dynamics */}
      {activeTab === 'theory' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            Muscular Contraction Types & Joint Actions
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ borderLeft: '4px solid #2563EB', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                1. Concentric Contraction (Tension with Shortening)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                The muscle generates force that exceeds external resistance, causing the muscle to visibly shorten. <em>Example:</em> The biceps brachii contracts concentrically to curl a weight upward at the elbow joint.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #7C3AED', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                2. Eccentric Contraction (Tension with Controlled Lengthening)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                The muscle generates force while actively lengthening to brake or control motion against gravity. <em>Example:</em> Lowering a weight slowly down as the biceps lengthens under tension to prevent hyperextension.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #16A34A', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                3. Isometric Contraction (Tension with Constant Length)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                The muscle develops tension without changing its length, stabilizing a joint. <em>Example:</em> Holding a plank pose or maintaining upright spinal posture via the erector spinae and rectus abdominis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: The 13 Muscles Catalog */}
      {activeTab === 'muscles' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            The 13 Major Skeletal Muscles (CBSE Reference)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
            {[
              { name: 'Deltoid', region: 'Shoulder', action: 'Abducts, flexes, and rotates arm' },
              { name: 'Pectoralis Major', region: 'Chest', action: 'Adducts and flexes humerus at shoulder' },
              { name: 'Biceps Brachii', region: 'Anterior Arm', action: 'Flexes elbow; supinates forearm' },
              { name: 'Rectus Abdominis', region: 'Abdomen', action: 'Flexes vertebral column; compresses abdomen' },
              { name: 'Quadriceps Femoris', region: 'Anterior Thigh', action: 'Extends knee; flexes hip' },
              { name: 'Tibialis Anterior', region: 'Anterior Lower Leg', action: 'Dorsiflexes and inverts foot' },
              { name: 'Trapezius', region: 'Upper Back / Neck', action: 'Elevates, depresses, and retracts scapula' },
              { name: 'Triceps Brachii', region: 'Posterior Arm', action: 'Extends elbow joint (antagonist to biceps)' },
              { name: 'Latissimus Dorsi', region: 'Middle/Lower Back', action: 'Extends, adducts, and internally rotates arm' },
              { name: 'Gluteus Maximus', region: 'Buttocks', action: 'Extends and laterally rotates hip' },
              { name: 'Hamstrings', region: 'Posterior Thigh', action: 'Flexes knee; extends hip' },
              { name: 'Gastrocnemius', region: 'Calf (Posterior)', action: 'Plantarflexes foot; flexes knee' },
              { name: 'Soleus', region: 'Deep Calf', action: 'Plantarflexes ankle during walking/standing' }
            ].map((m, i) => (
              <div key={i} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: '#0F172A', fontSize: '0.92rem' }}>{m.name}</strong>
                  <span style={{ fontSize: '0.7rem', backgroundColor: '#EEF2FF', color: '#4338CA', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>{m.region}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{m.action}</div>
              </div>
            ))}
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
            'Locate and identify the 13 foundational skeletal muscles in 3D',
            'Distinguish concentric, eccentric, and isometric contractions',
            'Explain the mechanical mechanism of antagonistic muscle pairs across joints',
            'Describe how motor neurons stimulate skeletal muscle fibers at neuromuscular junctions'
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
          to="/learn/biology"
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
              BIOLOGY MODULES
            </div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Biology Learning Hub</div>
            <div style={{ color: 'var(--color-muted, #64748B)', fontSize: '0.78rem' }}>Heart, Respiration & Muscular System</div>
          </div>
          <ArrowRight size={18} color="var(--color-primary, #2563EB)" />
        </Link>
      </div>
    </div>
  );
}

