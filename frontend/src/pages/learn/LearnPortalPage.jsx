import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Dna,
  Atom,
  FlaskConical,
  Compass,
  Search,
  Filter,
  Bot,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SUBJECTS_CONFIG, MODULES_DATA } from './learnData';
import ModuleCard from './ModuleCard';

export default function LearnPortalPage() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = Object.values(SUBJECTS_CONFIG);

  const filteredModules = MODULES_DATA.filter((mod) => {
    const matchesSubject = selectedSubject === 'all' || mod.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || mod.grade.includes(selectedGrade);
    const matchesSearch =
      searchQuery.trim() === '' ||
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.subjectLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubject && matchesGrade && matchesSearch;
  });

  const askSaarthi = () => {
    navigate('/mentor', {
      state: {
        subject: selectedSubject !== 'all' ? selectedSubject : 'general',
        prefill: 'Hi Saarthi! Can you recommend the best interactive 3D simulation or STEM lab for my current CBSE syllabus revision?'
      }
    });
  };

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', paddingBottom: '48px' }}>
      {/* Hero Banner */}
      <div
        className="card"
        style={{
          padding: '32px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '720px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '700', marginBottom: '14px', letterSpacing: '0.04em' }}>
            <Sparkles size={14} color="#FDE047" /> CBSE CLASS 10–12 INTERACTIVE STEM ENVIRONMENT
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: '800', margin: '0 0 12px 0', lineHeight: '1.25' }}>
            Interactive STEM Learning Labs
          </h1>

          <p style={{ fontSize: '1rem', color: '#E0E7FF', lineHeight: '1.6', margin: '0 0 20px 0' }}>
            Experience 3D anatomical structures, ray optics raytracers, molecular chemistry conformers, and dynamic coordinate wave systems engineered to elevate conceptual mastery.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={askSaarthi}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                color: '#312E81',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '0.88rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <Bot size={16} /> Ask AI Mentor Saarthi
            </button>

            <Link
              to="/subjects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                textDecoration: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '0.88rem',
                fontWeight: '600'
              }}
            >
              Curriculum Chapters <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Subject Hub Quick Cards */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1E293B', margin: '0 0 16px 0' }}>
          Explore by Subject Hub
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {subjects.map((s) => {
            const count = MODULES_DATA.filter((m) => m.subject === s.id).length;
            return (
              <Link
                key={s.id}
                to={`/learn/${s.id}`}
                style={{
                  backgroundColor: s.bgColor,
                  border: `1.5px solid ${s.borderColor}`,
                  borderRadius: '14px',
                  padding: '20px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: '800', color: s.color, textTransform: 'uppercase' }}>
                      {s.gradeRange}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#FFFFFF', color: s.color, padding: '2px 8px', borderRadius: '999px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      {count} {count === 1 ? 'Module' : 'Modules'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0' }}>
                    {s.name}
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0, lineHeight: '1.45' }}>
                    {s.description.slice(0, 85)}...
                  </p>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: '700', color: s.color }}>
                  Enter Hub <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '18px 22px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Subject Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'biology', 'physics', 'chemistry', 'mathematics'].map((subKey) => (
              <button
                key={subKey}
                type="button"
                onClick={() => setSelectedSubject(subKey)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: selectedSubject === subKey ? '700' : '600',
                  border: selectedSubject === subKey ? '1.5px solid #4338CA' : '1px solid #CBD5E1',
                  backgroundColor: selectedSubject === subKey ? '#EEF2FF' : '#FFFFFF',
                  color: selectedSubject === subKey ? '#4338CA' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {subKey === 'all' ? 'All Subjects' : subKey.charAt(0).toUpperCase() + subKey.slice(1)}
              </button>
            ))}
          </div>

          {/* Grade Selector & Search */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.82rem',
                color: '#334155',
                backgroundColor: '#FFFFFF',
                fontWeight: '600'
              }}
            >
              <option value="all">All Classes</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>

            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '7px 12px 7px 32px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.82rem',
                  color: '#1E293B',
                  outline: 'none',
                  width: '180px'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>
            Interactive STEM Modules ({filteredModules.length})
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
            Showing {filteredModules.length} of {MODULES_DATA.length} labs
          </span>
        </div>

        {filteredModules.length === 0 ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: '600' }}>No modules match your current filters.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedSubject('all');
                setSelectedGrade('all');
                setSearchQuery('');
              }}
              style={{
                backgroundColor: '#4338CA',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}
          >
            {filteredModules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

