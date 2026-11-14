import React from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Dna,
  Atom,
  FlaskConical,
  Compass,
  Bot,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { SUBJECTS_CONFIG, MODULES_DATA } from './learnData';
import ModuleCard from './ModuleCard';

const SUBJECT_ICONS = {
  biology: Dna,
  physics: Atom,
  chemistry: FlaskConical,
  mathematics: Compass
};

export default function SubjectHubPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const config = SUBJECTS_CONFIG[subjectId?.toLowerCase()];
  if (!config) {
    return <Navigate to="/learn" replace />;
  }

  const IconComponent = SUBJECT_ICONS[config.id] || Sparkles;
  const modules = MODULES_DATA.filter((m) => m.subject === config.id);

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: config.id,
        prefill: `I have a doubt regarding CBSE Class 10–12 ${config.name} concepts. Can you explain the core fundamentals and practice problems?`
      }
    });
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '48px' }}>
      {/* Top Breadcrumb & Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <Link
          to="/learn"
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
          <ArrowLeft size={16} /> Back to All Subjects
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
            padding: '6px 14px',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <Bot size={15} /> Ask Saarthi about {config.name}
        </button>
      </div>

      {/* Hero Subject Card */}
      <div
        style={{
          backgroundColor: config.bgColor,
          border: `1.5px solid ${config.borderColor}`,
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: config.color,
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
            }}
          >
            <IconComponent size={26} />
          </div>

          <div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: '800',
                color: config.color,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              CBSE {config.gradeRange}
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A', margin: '2px 0 0 0' }}>
              {config.name} Interactive Learning
            </h1>
          </div>
        </div>

        <p style={{ color: '#334155', fontSize: '0.98rem', lineHeight: '1.6', margin: 0, maxWidth: '850px' }}>
          {config.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
          <BookOpen size={14} />
          <span><strong>Aligned CBSE Chapters:</strong> {config.chapters}</span>
        </div>
      </div>

      {/* Modules Grid */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: '0 0 16px 0' }}>
          Interactive Modules ({modules.length})
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {modules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      </div>
    </div>
  );
}

