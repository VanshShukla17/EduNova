import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Bot,
  Eye,
  Layers,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import MoleculeViewerSimulation from '../../../features/virtual-learning/MoleculeViewerSimulation';

export default function MolecularExplorerPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inline'); // 'inline' | 'molview' | 'vsepr' | 'cbse-molecules'

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: 'chemistry',
        prefill: 'Explain covalent bonding, electron dot structures, and VSEPR geometry of Water (H2O), Methane (CH4), and Carbon Dioxide (CO2) from CBSE Class 10 & 11 Chemistry.'
      }
    });
  };

  const cbseMolecules = [
    { formula: 'CH₄', name: 'Methane', shape: 'Tetrahedral', bondAngle: '109.5°', molviewQuery: 'methane', desc: 'Central carbon bonded to 4 hydrogen atoms with 4 single sigma bonds.' },
    { formula: 'H₂O', name: 'Water', shape: 'Bent / V-shaped', bondAngle: '104.5°', molviewQuery: 'water', desc: 'Oxygen with 2 bond pairs and 2 lone pairs causing angular repulsion.' },
    { formula: 'NH₃', name: 'Ammonia', shape: 'Trigonal Pyramidal', bondAngle: '107°', molviewQuery: 'ammonia', desc: 'Nitrogen bonded to 3 hydrogens with 1 unshared lone pair.' },
    { formula: 'CO₂', name: 'Carbon Dioxide', shape: 'Linear', bondAngle: '180°', molviewQuery: 'carbon+dioxide', desc: 'Carbon double-bonded to two oxygen atoms (O=C=O).' },
    { formula: 'C₆H₆', name: 'Benzene', shape: 'Planar Hexagonal Ring', bondAngle: '120°', molviewQuery: 'benzene', desc: 'Aromatic hydrocarbon ring with delocalized pi electron cloud.' }
  ];

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Breadcrumbs & Ask Saarthi */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <Link
          to="/learn/chemistry"
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
          <ArrowLeft size={16} /> Back to Chemistry
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
          <Bot size={15} /> Ask Saarthi about Molecules
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
            <FlaskConical size={12} /> CBSE Class 10 & 11 • Chemistry
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              backgroundColor: '#F3E8FF',
              color: '#7C3AED',
              padding: '3px 10px',
              borderRadius: '999px'
            }}
          >
            Chemical Bonding & Molecular Structure
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '6px 0 10px 0', color: 'var(--color-text, #0F172A)' }}>
          Interactive Molecular Explorer
        </h1>

        <p style={{ color: 'var(--color-muted, #64748B)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
          Molecules are three-dimensional structures governed by valence electron repulsion (VSEPR theory), orbital hybridization, and covalent bond angles. Explore ball-and-stick representations, 2D structural sketches, bond polarities, and examine foundational CBSE Class 10 & 11 compounds.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', borderTop: '1px solid var(--color-border, #E2E8F0)', paddingTop: '14px', flexWrap: 'wrap' }}>
          {[
            { id: 'inline', label: '3D Ball-and-Stick Viewer', icon: Eye },
            { id: 'molview', label: 'MolView Workspace Integration', icon: ExternalLink },
            { id: 'vsepr', label: 'VSEPR Geometry & Bond Angles', icon: BookOpen },
            { id: 'cbse-molecules', label: 'CBSE Common Molecules', icon: Layers }
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

      {/* Tab 1: Inline 3D Viewer */}
      {activeTab === 'inline' && (
        <div style={{ marginBottom: '22px' }}>
          <div className="card" style={{ padding: '16px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: '#1E293B' }}>
                  Interactive 3D Ball-and-Stick Molecular Viewer
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Rotate, zoom, and inspect covalent bond arrangements and atom-color standards (CPK coloring).
                </p>
              </div>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#EEF2FF', color: '#4338CA', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                Three.js 3D Engine
              </span>
            </div>

            <MoleculeViewerSimulation />
          </div>
        </div>
      )}

      {/* Tab 2: MolView Integration */}
      {activeTab === 'molview' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#F3E8FF', color: '#7C3AED', padding: '12px', borderRadius: '12px' }}>
              <FlaskConical size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 4px 0', color: '#1E293B' }}>
                MolView Chemistry Workbench (molview.org)
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                MolView is an advanced web-based chemical sketcher and 3D visualizer. Students can sketch 2D chemical bonds, convert them into 3D conformers, inspect electron density surfaces, and calculate bond lengths.
              </p>
            </div>
          </div>

          {/* Integration Status Notice */}
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Info size={18} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '0.84rem', color: '#92400E', lineHeight: 1.5 }}>
                <strong>Iframe Integration Notice:</strong> The official MolView domain (<code>molview.org</code>) serves security headers (<code>X-Frame-Options: SAMEORIGIN</code>) that mandate opening the workbench in an isolated tab or workspace window to ensure full sketcher capabilities and WebGL acceleration.
              </div>
            </div>
          </div>

          {/* Quick Launch Buttons for CBSE Target Molecules */}
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '10px', color: '#1E293B' }}>
            Launch MolView Workspace by Target Compound:
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            {cbseMolecules.map((m) => (
              <a
                key={m.formula}
                href={`https://molview.org/?q=${m.molviewQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#1E293B' }}>{m.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: '6px' }}>({m.formula})</span>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-primary, #2563EB)' }}>{m.shape}</div>
                </div>
                <ExternalLink size={16} color="#64748B" />
              </a>
            ))}
          </div>

          <div style={{ textAlign: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
            <a
              href="https://molview.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-flex', width: 'auto', padding: '10px 24px', fontSize: '0.9rem', textDecoration: 'none' }}
            >
              <ExternalLink size={16} /> Open Blank MolView Sketcher (molview.org)
            </a>
          </div>

          {/* Attribution */}
          <div style={{ marginTop: '20px', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '8px', fontSize: '0.76rem', color: '#94A3B8', border: '1px solid #E2E8F0' }}>
            Attribution: MolView is an open-source web application created and maintained by Herman Bergwerf. All chemical sketchers and 3D rendering engines belong to their respective copyright holders.
          </div>
        </div>
      )}

      {/* Tab 3: VSEPR Theory */}
      {activeTab === 'vsepr' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            VSEPR Theory & Repulsion Principles (CBSE Class 11)
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ borderLeft: '4px solid #2563EB', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                Order of Electron Pair Repulsion
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                Lone pairs are localized on the central atom and occupy more spatial volume than bonding pairs. Consequently, repulsive forces follow the strict sequence:
                <br />
                <strong>Lone Pair - Lone Pair (lp - lp) &gt; Lone Pair - Bond Pair (lp - bp) &gt; Bond Pair - Bond Pair (bp - bp)</strong>
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #7C3AED', paddingLeft: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#1E293B' }}>
                Why Water (H₂O) Bond Angle is 104.5° Instead of 109.5°
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                Oxygen in $H_2O$ has 4 electron pairs ($sp^3$ hybridization, theoretical tetrahedral angle of $109.5^\circ$). However, because it possesses <strong>two lone pairs</strong>, the strong lp-lp and lp-bp repulsions compress the H-O-H bond angle down to <strong>$104.5^\circ$</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: CBSE Molecules Catalog */}
      {activeTab === 'cbse-molecules' && (
        <div className="card" style={{ padding: '22px', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px', color: '#0F172A' }}>
            CBSE Class 10 & 11 Core Compounds Catalog
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {cbseMolecules.map((m) => (
              <div key={m.formula} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1E293B' }}>{m.name}</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '4px' }}>{m.formula}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>
                    Bond Angle: {m.bondAngle}
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '4px' }}><strong>Geometry:</strong> {m.shape}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>{m.desc}</div>
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
            'Explain covalent bonding through electron sharing and Lewis octet completion',
            'Correlate central atom electron pairs with VSEPR geometry (linear, bent, tetrahedral)',
            'Sketch 2D Lewis structures and deduce 3D ball-and-stick spatial arrangements',
            'Account for bond angle deviations caused by lone pair - bond pair repulsion'
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
          to="/learn/chemistry"
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
              CHEMISTRY MODULES
            </div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Chemistry Learning Hub</div>
            <div style={{ color: 'var(--color-muted, #64748B)', fontSize: '0.78rem' }}>Chemical Bonding & Molecular Explorer</div>
          </div>
          <ArrowRight size={18} color="var(--color-primary, #2563EB)" />
        </Link>
      </div>
    </div>
  );
}

