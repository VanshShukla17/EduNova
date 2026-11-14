import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sun,
  BookOpen,
  CheckCircle2,
  Compass,
  Bot,
  Eye,
  Layers,
  ArrowRight
} from 'lucide-react';
import ExternalSimulationFrame from '../../../components/ExternalSimulationFrame';

export default function LightOpticsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'theory' | 'formulas'

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: 'physics',
        prefill: 'Explain the mirror formula vs lens formula, sign conventions, and ray diagram rules from CBSE Class 10 Physics: Light - Reflection and Refraction.'
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
          <Bot size={15} /> Ask Saarthi about Optics
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
            <Sun size={12} /> CBSE Class 10 & 12 • Physics
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
            Geometrical & Wave Optics
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '6px 0 10px 0', color: 'var(--color-text, #0F172A)' }}>
          Light and Optics
        </h1>

        <p style={{ color: 'var(--color-muted, #64748B)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
          Light exhibits rectilinear propagation in homogeneous media, bending (refracting) when traversing boundaries between optical media of differing refractive indices. Explore spherical mirrors, thin lenses, real vs virtual image formations, chromatic dispersion through triangular prisms, and total internal reflection.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', borderTop: '1px solid var(--color-border, #E2E8F0)', paddingTop: '14px' }}>
          {[
            { id: 'simulation', label: 'Interactive Ray Tracer', icon: Eye },
            { id: 'theory', label: 'Reflection & Refraction Laws', icon: BookOpen },
            { id: 'formulas', label: 'Formulae & Sign Conventions', icon: Layers }
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
            src="https://iamtechartist.com/light-and-optics/"
            title="Light and Optics Interactive Lab (iamtechartist.com)"
            attributionText="Interactive simulation powered by iamtechartist.com"
            attributionUrl="https://iamtechartist.com/light-and-optics/"
            minHeight="480px"
            defaultHeight="620px"
          />

          {/* Instructions */}
          <div className="card" style={{ marginTop: '16px', padding: '18px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px', color: '#1E293B' }}>
              <Compass size={18} color="var(--color-primary, #2563EB)" /> How to Explore the Optics Lab
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.84rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>🔍 Focal Length & Object Position</strong>
                <span style={{ color: '#64748B' }}>Drag the object arrow closer to or beyond the center of curvature (2F) and observe real vs virtual image shifts.</span>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>🌈 Prism & Dispersion</strong>
                <span style={{ color: '#64748B' }}>Observe wavelength-dependent refraction as polychromatic white light splits into VIBGYOR spectra.</span>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>⛶ Fullscreen Laboratory</strong>
                <span style={{ color: '#64748B' }}>Use the Fullscreen toggle to maximize ray tracking precision on larger screens.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Theory */}
      {activeTab === 'theory' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            Core Laws of Optics (CBSE Class 10 & 12)
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ borderLeft: '4px solid #2563EB', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                Laws of Reflection
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                1. The incident ray, the reflected ray, and the normal to the reflecting surface at the point of incidence all lie in the same plane.
                <br />
                2. The angle of incidence equals the angle of reflection: <strong>∠i = ∠r</strong>. Valid for all reflecting surfaces including spherical concave and convex mirrors.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #7C3AED', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                Snell's Law of Refraction
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                The ratio of the sine of the angle of incidence to the sine of the angle of refraction is constant for light of a given color and for a given pair of media:
                <br />
                <strong>n₂₁ = sin(i) / sin(r) = v₁ / v₂ = n₂ / n₁</strong>
                <br />
                When light travels from rarer to denser media, it bends toward the normal (speed decreases).
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #16A34A', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                Dispersion of White Light through a Prism
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                Glass has different refractive indices for different wavelengths (n_violet &gt; n_red). Violet light has the shortest wavelength and bends the most, whereas red light has the longest wavelength and bends the least, generating the <strong>VIBGYOR</strong> spectrum.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Formulas */}
      {activeTab === 'formulas' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            CBSE Optics Formula Reference & Sign Conventions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '16px' }}>
              <strong style={{ color: '#1D4ED8', display: 'block', marginBottom: '6px' }}>Mirror Formula & Magnification</strong>
              <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#1E3A8A', margin: '4px 0' }}>1/v + 1/u = 1/f</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#1E3A8A' }}>m = -v/u = hᵢ/hₒ</div>
              <p style={{ fontSize: '0.8rem', color: '#1E40AF', marginTop: '6px', marginBottom: 0 }}>
                • Concave mirror: f is negative (-)<br />• Convex mirror: f is positive (+)
              </p>
            </div>

            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '16px' }}>
              <strong style={{ color: '#166534', display: 'block', marginBottom: '6px' }}>Lens Formula & Optical Power</strong>
              <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#14532D', margin: '4px 0' }}>1/v - 1/u = 1/f</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.92rem', color: '#14532D' }}>m = +v/u | P = 1 / f(m) [Dioptres]</div>
              <p style={{ fontSize: '0.8rem', color: '#15803D', marginTop: '6px', marginBottom: 0 }}>
                • Convex (converging) lens: f &gt; 0, P &gt; 0<br />• Concave (diverging) lens: f &lt; 0, P &lt; 0
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
            'Construct accurate ray diagrams for concave and convex mirrors across 6 object positions',
            'Apply Cartesian sign conventions to solve numerical mirror and lens equations',
            'Explain Snell’s law of refraction and the concept of relative refractive index',
            'Describe how triangular prisms induce angular deviation and chromatic dispersion'
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
