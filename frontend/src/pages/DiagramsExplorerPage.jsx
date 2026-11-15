import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import api from '../services/api';
import InteractiveDiagram from '../components/InteractiveDiagram';
import {
  HeroCard,
  PaperCard,
  Pin,
  Tag,
  Button,
  Skeleton,
  EmptyState,
  resolveSubjectKey,
} from '../components/ui';

export default function DiagramsExplorerPage() {
  const [diagrams, setDiagrams] = useState([]);
  const [selectedDiagram, setSelectedDiagram] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDiagrams() {
      try {
        setLoading(true);
        const data = await api.getDiagrams();
        setDiagrams(data || []);
        if (data && data.length > 0) {
          setSelectedDiagram(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch diagrams list:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDiagrams();
  }, []);

  const filteredDiagrams =
    selectedSubject === 'all'
      ? diagrams
      : diagrams.filter(
          (d) => (d.subjectCode || '').toLowerCase() === selectedSubject.toLowerCase()
        );

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        <Skeleton lines={4} />
        <Skeleton lines={4} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      <HeroCard
        eyebrow="Interactive Diagram Pinboard"
        eyebrowVariant="verified"
        title="Visual STEM Diagrams"
        subtitle="Inspect labeled parts or switch into identification quiz mode."
        actions={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            {[
              { id: 'all', label: 'All Diagrams' },
              { id: 'physics', label: 'Physics' },
              { id: 'chemistry', label: 'Chemistry' },
              { id: 'biology', label: 'Biology' },
            ].map((sub) => (
              <Button
                key={sub.id}
                variant={selectedSubject === sub.id ? 'primary' : 'note'}
                size="sm"
                onClick={() => {
                  setSelectedSubject(sub.id);
                  const next =
                    sub.id === 'all'
                      ? diagrams[0]
                      : diagrams.find(
                          (d) => (d.subjectCode || '').toLowerCase() === sub.id
                        );
                  if (next) setSelectedDiagram(next);
                }}
              >
                {sub.label}
              </Button>
            ))}
          </div>
        }
      />

      {diagrams.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Interactive Diagrams Available"
          description="Check back once diagrams are published for your board."
          actionLabel="Explore Syllabus"
          to="/subjects"
        />
      ) : (
        <div
          className="paper-grid"
          style={{
            gridTemplateColumns: 'minmax(240px, 310px) minmax(0, 1fr)',
            alignItems: 'start',
          }}
        >
          {/* Diagram Selection Index */}
          <PaperCard flat style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <Pin color="amber" position="left" />
            <div className="type-label" style={{ color: 'var(--ink-muted)', marginTop: 'var(--sp-1)' }}>
              SELECT DIAGRAM ({filteredDiagrams.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {filteredDiagrams.map((d) => {
                const isSelected = (selectedDiagram?.id || selectedDiagram?._id) === (d.id || d._id);
                const subjectKey = resolveSubjectKey(d.subjectCode);
                return (
                  <Button
                    key={d.id || d._id}
                    variant={isSelected ? 'primary' : 'note'}
                    size="sm"
                    onClick={() => setSelectedDiagram(d)}
                    style={{
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      height: 'auto',
                      padding: '10px 12px',
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{d.title}</span>
                    <Tag variant={subjectKey}>{d.subjectCode || 'STEM'}</Tag>
                  </Button>
                );
              })}
            </div>
          </PaperCard>

          {/* Active Interactive Diagram Sheet */}
          <div>
            {selectedDiagram ? (
              <InteractiveDiagram diagramData={selectedDiagram} />
            ) : (
              <EmptyState
                title="Pick a Diagram"
                description="Choose any subject card on the left to begin exploring components."
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
