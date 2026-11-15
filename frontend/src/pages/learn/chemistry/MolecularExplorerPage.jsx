import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, BookOpen, ExternalLink, Eye, Layers, Info } from 'lucide-react';
import MoleculeViewerSimulation from '../../../features/virtual-learning/MoleculeViewerSimulation';
import { PaperCard, Tag, Button } from '../../../components/ui';
import LearnLabShell from '../LearnLabShell';

const CBSE_MOLECULES = [
  { formula: 'CH₄', name: 'Methane', shape: 'Tetrahedral', bondAngle: '109.5°', molviewQuery: 'methane', desc: 'Central carbon bonded to 4 hydrogen atoms with 4 single sigma bonds.' },
  { formula: 'H₂O', name: 'Water', shape: 'Bent / V-shaped', bondAngle: '104.5°', molviewQuery: 'water', desc: 'Oxygen with 2 bond pairs and 2 lone pairs causing angular repulsion.' },
  { formula: 'NH₃', name: 'Ammonia', shape: 'Trigonal Pyramidal', bondAngle: '107°', molviewQuery: 'ammonia', desc: 'Nitrogen bonded to 3 hydrogens with 1 unshared lone pair.' },
  { formula: 'CO₂', name: 'Carbon Dioxide', shape: 'Linear', bondAngle: '180°', molviewQuery: 'carbon+dioxide', desc: 'Carbon double-bonded to two oxygen atoms (O=C=O).' },
  { formula: 'C₆H₆', name: 'Benzene', shape: 'Planar Hexagonal Ring', bondAngle: '120°', molviewQuery: 'benzene', desc: 'Aromatic hydrocarbon ring with delocalized pi electron cloud.' },
];

export default function MolecularExplorerPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inline');

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: 'chemistry',
        prefill: 'Explain covalent bonding, electron dot structures, and VSEPR geometry of Water (H2O), Methane (CH4), and Carbon Dioxide (CO2) from CBSE Class 10 & 11 Chemistry.',
      },
    });
  };

  return (
    <LearnLabShell
      subject="chemistry"
      backTo="/learn/chemistry"
      backLabel="Back to Chemistry"
      hubTitle="Chemistry Learning Hub"
      hubSubtitle="Chemical Bonding & Molecular Explorer"
      badgeIcon={FlaskConical}
      badgeLabel="CBSE Class 10 & 11 • Chemistry"
      subBadgeLabel="Chemical Bonding & Molecular Structure"
      title="Interactive Molecular Explorer"
      description="Molecules are three-dimensional structures governed by valence electron repulsion (VSEPR theory), orbital hybridization, and covalent bond angles. Explore 3D ball-and-stick models, bond polarities, and foundational CBSE compounds."
      askLabel="Ask Chotu about Molecules"
      onAskSaarthi={askSaarthi}
      tabs={[
        { id: 'inline', label: '3D Ball-and-Stick Viewer', icon: Eye },
        { id: 'molview', label: 'MolView Workspace', icon: ExternalLink },
        { id: 'vsepr', label: 'VSEPR Geometry & Bond Angles', icon: BookOpen },
        { id: 'cbse-molecules', label: 'CBSE Common Molecules', icon: Layers },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      objectives={[
        'Explain covalent bonding through electron sharing and Lewis octet completion',
        'Correlate central atom electron pairs with VSEPR geometry (linear, bent, tetrahedral)',
        'Sketch 2D Lewis structures and deduce 3D ball-and-stick spatial arrangements',
        'Account for bond angle deviations caused by lone pair - bond pair repulsion',
      ]}
    >
      {activeTab === 'inline' && (
        <PaperCard flat>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
            <div>
              <h2 className="type-h3" style={{ margin: 0 }}>Interactive 3D Ball-and-Stick Molecular Viewer</h2>
              <p className="type-small" style={{ color: 'var(--ink-muted)', margin: '2px 0 0 0' }}>
                Rotate, zoom, and inspect covalent bond arrangements and CPK atom coloring.
              </p>
            </div>
            <Tag variant="verified">Three.js 3D Engine</Tag>
          </div>
          <MoleculeViewerSimulation />
        </PaperCard>
      )}

      {activeTab === 'molview' && (
        <PaperCard flat>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
            <div style={{ background: 'var(--chemistry-soft)', color: 'var(--chemistry-ink)', padding: 'var(--sp-3)', borderRadius: 'var(--r-md)' }}>
              <FlaskConical size={26} />
            </div>
            <div>
              <h2 className="type-h2" style={{ margin: '0 0 4px 0' }}>MolView Chemistry Workbench (molview.org)</h2>
              <p className="type-small" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                Sketch 2D chemical bonds, convert them into 3D conformers, inspect electron density surfaces, and measure bond lengths.
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--amber-soft)', border: '1px solid var(--paper-edge)', borderRadius: 'var(--r-md)', padding: 'var(--sp-3)', marginBottom: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-2)', alignItems: 'flex-start' }}>
            <Info size={18} style={{ color: 'var(--amber-ink)', marginTop: '2px', flexShrink: 0 }} />
            <div className="type-small" style={{ color: 'var(--amber-ink)' }}>
              <strong>Iframe Integration Notice:</strong> <code>molview.org</code> sends security headers (<code>X-Frame-Options: SAMEORIGIN</code>), so compounds open directly in a dedicated browser tab.
            </div>
          </div>

          <h3 className="type-h3" style={{ marginBottom: 'var(--sp-3)' }}>
            Launch MolView Workspace by Target Compound
          </h3>
          <div className="paper-grid paper-grid--3" style={{ marginBottom: 'var(--sp-5)' }}>
            {CBSE_MOLECULES.map((m) => (
              <a
                key={m.formula}
                href={`https://molview.org/?q=${m.molviewQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <PaperCard interactive tilt={0} style={{ padding: 'var(--sp-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-2)' }}>
                    <div>
                      <strong className="type-body">{m.name}</strong>{' '}
                      <span className="type-mono" style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>({m.formula})</span>
                      <div className="type-small" style={{ color: 'var(--chemistry-ink)' }}>{m.shape}</div>
                    </div>
                    <ExternalLink size={16} style={{ color: 'var(--ink-soft)', flexShrink: 0 }} />
                  </div>
                </PaperCard>
              </a>
            ))}
          </div>

          <div style={{ textAlign: 'center', borderTop: '1px dashed var(--paper-edge)', paddingTop: 'var(--sp-4)' }}>
            <Button
              as="a"
              href="https://molview.org/"
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
            >
              <ExternalLink size={16} /> Open Blank MolView Sketcher (molview.org)
            </Button>
          </div>

          <div className="type-small" style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-2) var(--sp-3)', background: 'var(--paper-warm)', borderRadius: 'var(--r-sm)', color: 'var(--ink-muted)', border: '1px solid var(--paper-edge)' }}>
            Attribution: MolView is created and maintained by Herman Bergwerf.
          </div>
        </PaperCard>
      )}

      {activeTab === 'vsepr' && (
        <PaperCard flat>
          <h2 className="type-h2" style={{ marginBottom: 'var(--sp-4)' }}>
            VSEPR Theory &amp; Repulsion Principles (CBSE Class 11)
          </h2>
          <div style={{ display: 'grid', gap: 'var(--sp-4)' }}>
            <div style={{ borderLeft: '4px solid var(--physics)', paddingLeft: 'var(--sp-4)' }}>
              <h3 className="type-h3" style={{ marginBottom: '4px' }}>Order of Electron Pair Repulsion</h3>
              <p className="type-body" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                Lone pairs occupy more spatial volume than bonding pairs, producing the repulsion hierarchy:
                <br /><strong>Lone Pair – Lone Pair (lp–lp) &gt; Lone Pair – Bond Pair (lp–bp) &gt; Bond Pair – Bond Pair (bp–bp)</strong>
              </p>
            </div>
            <div style={{ borderLeft: '4px solid var(--chemistry)', paddingLeft: 'var(--sp-4)' }}>
              <h3 className="type-h3" style={{ marginBottom: '4px' }}>Why Water (H₂O) Bond Angle is 104.5° Instead of 109.5°</h3>
              <p className="type-body" style={{ color: 'var(--ink-muted)', margin: 0 }}>
                Oxygen in H₂O has 4 electron pairs (sp³ hybridization, ideal tetrahedral angle 109.5°), but its two unshared lone pairs push the O–H bonds closer together down to <strong>104.5°</strong>.
              </p>
            </div>
          </div>
        </PaperCard>
      )}

      {activeTab === 'cbse-molecules' && (
        <PaperCard flat>
          <h2 className="type-h2" style={{ marginBottom: 'var(--sp-4)' }}>
            CBSE Class 10 &amp; 11 Core Compounds Catalog
          </h2>
          <div style={{ display: 'grid', gap: 'var(--sp-3)' }}>
            {CBSE_MOLECULES.map((m) => (
              <div
                key={m.formula}
                style={{
                  background: 'var(--paper-warm)',
                  border: '1px solid var(--paper-edge)',
                  borderRadius: 'var(--r-md)',
                  padding: 'var(--sp-4)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                    <span className="type-h3">{m.name}</span>
                    <Tag variant="paper">{m.formula}</Tag>
                  </div>
                  <Tag variant="verified">Bond Angle: {m.bondAngle}</Tag>
                </div>
                <div className="type-small" style={{ color: 'var(--ink)', marginBottom: '4px' }}>
                  <strong>Geometry:</strong> {m.shape}
                </div>
                <div className="type-small" style={{ color: 'var(--ink-muted)' }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </PaperCard>
      )}
    </LearnLabShell>
  );
}
