import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Volume2,
  BookOpen,
  CheckCircle2,
  Compass,
  Bot,
  Eye,
  Activity,
  ArrowRight
} from 'lucide-react';
import ExternalSimulationFrame from '../../../components/ExternalSimulationFrame';

export default function WavesSoundPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'theory' | 'calculations'

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: 'physics',
        prefill: 'Explain wave characteristics (amplitude, wavelength, frequency, velocity v = fλ) and echo calculation requirements from CBSE Class 9/11 Physics: Sound.'
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
          <Bot size={15} /> Ask Saarthi about Waves
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
            <Volume2 size={12} /> CBSE Class 9, 10 & 11 • Physics
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
            Oscillations, Waves & Acoustics
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '6px 0 10px 0', color: 'var(--color-text, #0F172A)' }}>
          Waves and Sound
        </h1>

        <p style={{ color: 'var(--color-muted, #64748B)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
          Sound is a mechanical longitudinal wave that propagates through matter as alternating regions of high pressure (compressions) and low pressure (rarefactions). Investigate how wavelength ($\lambda$), frequency ($f$), and amplitude dictate acoustic velocity ($v = f\lambda$), pitch, and loudness, as well as echo reflection and the Doppler frequency shift.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', borderTop: '1px solid var(--color-border, #E2E8F0)', paddingTop: '14px' }}>
          {[
            { id: 'simulation', label: 'Interactive Wave Lab', icon: Eye },
            { id: 'theory', label: 'Wave Mechanics', icon: BookOpen },
            { id: 'calculations', label: 'Echo & Acoustic Relations', icon: Activity }
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
            src="https://iamtechartist.com/waves-and-sound/"
            title="Waves and Sound Interactive Lab (iamtechartist.com)"
            attributionText="Interactive simulation powered by iamtechartist.com"
            attributionUrl="https://iamtechartist.com/waves-and-sound/"
            minHeight="480px"
            defaultHeight="620px"
          />

          {/* Instructions */}
          <div className="card" style={{ marginTop: '16px', padding: '18px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px', color: '#1E293B' }}>
              <Compass size={18} color="var(--color-primary, #2563EB)" /> How to Explore the Waves Simulation
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.84rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>〰️ Frequency vs Pitch</strong>
                <span style={{ color: '#64748B' }}>Increase wave oscillation frequency to see wavelengths compress and pitch rise in real-time.</span>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>📊 Amplitude vs Loudness</strong>
                <span style={{ color: '#64748B' }}>Adjust the wave height (amplitude) to observe energy transfer and perceived loudness.</span>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>🚗 Doppler Frequency Shift</strong>
                <span style={{ color: '#64748B' }}>Observe how moving sound sources crowd wavefronts ahead and stretch wavefronts behind.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Theory */}
      {activeTab === 'theory' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            Transverse vs Longitudinal Waves
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ borderLeft: '4px solid #2563EB', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                Longitudinal Waves (e.g. Sound Waves in Air)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                Particles of the medium oscillate <strong>parallel</strong> to the direction of wave propagation, creating regions of compression (high density & pressure) and rarefaction (low density & pressure). Requires a material medium with elasticity.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #7C3AED', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                Transverse Waves (e.g. Light Waves, Ripples on Water)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                Particles or field vectors oscillate <strong>perpendicular</strong> to the direction of wave travel, creating alternating crests (peaks) and troughs (valleys). Electromagnetic waves can propagate through vacuum.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #16A34A', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                Speed of Sound Across Media
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                Because sound requires inter-atomic collisions, it travels fastest through rigid solids and slowest through gases:
                <br />
                • Solids (Iron/Steel): ~5,100 m/s
                <br />
                • Liquids (Water at 20°C): ~1,480 m/s
                <br />
                • Gases (Air at 20°C): ~344 m/s (cannot propagate in vacuum)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Calculations */}
      {activeTab === 'calculations' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            Acoustic Formulas & Echo Criterion (CBSE)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '16px' }}>
              <strong style={{ color: '#1D4ED8', display: 'block', marginBottom: '6px' }}>Universal Wave Equation</strong>
              <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#1E3A8A', margin: '4px 0' }}>v = f · λ = λ / T</div>
              <p style={{ fontSize: '0.82rem', color: '#1E40AF', marginTop: '6px', marginBottom: 0 }}>
                • v = velocity in m/s<br />
                • f = frequency in Hertz (Hz)<br />
                • λ = wavelength in meters (m)<br />
                • T = time period in seconds (s)
              </p>
            </div>

            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '16px' }}>
              <strong style={{ color: '#166534', display: 'block', marginBottom: '6px' }}>Echo Calculation & Minimum Distance</strong>
              <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#14532D', margin: '4px 0' }}>2d = v · t ➔ d = (v · t) / 2</div>
              <p style={{ fontSize: '0.82rem', color: '#15803D', marginTop: '6px', marginBottom: 0 }}>
                Persistence of hearing in human brain is <strong>0.1 s</strong>.<br />
                At v = 344 m/s: d_min = (344 × 0.1) / 2 = <strong>17.2 meters</strong>.
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
            'State the mathematical relationship between wave speed, frequency, and wavelength (v = fλ)',
            'Differentiate compression and rarefaction zones in longitudinal sound waves',
            'Derive the minimum distance of 17.2 m required to hear a distinct echo in air',
            'Explain the physical basis for Doppler frequency shift in approaching vs receding sources'
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
