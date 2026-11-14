import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Play, Sparkles } from 'lucide-react';

export default function ModuleCard({ module }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #E2E8F0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = '#CBD5E1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.borderColor = '#E2E8F0';
      }}
    >
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              backgroundColor: module.badgeBg || '#EEF2FF',
              color: module.badgeColor || '#4338CA',
              padding: '4px 10px',
              borderRadius: '6px'
            }}
          >
            {module.subjectLabel} • {module.grade}
          </span>

          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              padding: '4px 9px',
              borderRadius: '6px'
            }}
          >
            <Box size={13} />
            {module.type}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: '800',
            color: '#1E293B',
            margin: '0 0 10px 0',
            lineHeight: '1.35'
          }}
        >
          {module.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '0.88rem',
            color: '#64748B',
            lineHeight: '1.55',
            margin: '0 0 20px 0'
          }}
        >
          {module.description}
        </p>
      </div>

      {/* Footer */}
      <div>
        <div
          style={{
            height: '1px',
            backgroundColor: '#F1F5F9',
            marginBottom: '16px'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.84rem', fontWeight: '600', color: '#64748B' }}>
            Ready to explore
          </span>

          <Link
            to={module.route}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#4338CA',
              color: '#FFFFFF',
              textDecoration: 'none',
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '0.86rem',
              fontWeight: '700',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3730A3';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
            }}
          >
            <Play size={13} fill="#FFFFFF" />
            {module.type === '3D Lab' ? 'Launch 3D' : 'Launch Lab'}
          </Link>
        </div>
      </div>
    </div>
  );
}

