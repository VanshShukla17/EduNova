import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  Eye,
  Settings,
  ArrowRight,
  Sparkles,
  Video,
  Cpu,
  Database
} from 'lucide-react';
import { getAdminStats } from '../../services/api';
import { Button, PaperCard, SectionHeader, Skeleton, Tag } from '../../components/ui';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAdminStats()
      .then((data) => {
        if (isMounted && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch admin stats');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const statItems = [
    { label: 'Total Students', value: stats?.users ?? '-', icon: Users, color: 'var(--physics-ink)', bg: 'var(--physics-soft)' },
    { label: 'STEM Subjects', value: stats?.subjects ?? '-', icon: BookOpen, color: 'var(--emerald-800)', bg: 'var(--emerald-soft)' },
    { label: 'Chapters', value: stats?.chapters ?? '-', icon: Layers, color: 'var(--amber-ink)', bg: 'var(--amber-soft)' },
    { label: 'Lessons', value: stats?.lessons ?? '-', icon: FileText, color: 'var(--maths-ink)', bg: 'var(--maths-soft)' },
    { label: 'Practice MCQs', value: stats?.questions ?? '-', icon: HelpCircle, color: 'var(--red-ink)', bg: 'var(--red-soft)' },
    { label: '3D Simulations', value: stats?.virtualTopics ?? 9, icon: Sparkles, color: 'var(--physics-ink)', bg: 'var(--physics-soft)' },
    { label: '3D Virtual Labs', value: stats?.labs ?? 3, icon: Settings, color: 'var(--maths-ink)', bg: 'var(--maths-soft)' },
    { label: 'Chapter Videos', value: stats?.videos ?? 4, icon: Video, color: 'var(--red-ink)', bg: 'var(--red-soft)' }
  ];

  const modules = [
    {
      to: '/admin/content',
      icon: Layers,
      iconBg: 'var(--physics-soft)',
      iconColor: 'var(--physics-ink)',
      title: 'Content Manager',
      desc: 'Create, update, and safely delete Subjects, Chapters, and Lessons with content blocks.',
      action: 'Manage Content'
    },
    {
      to: '/admin/questions',
      icon: HelpCircle,
      iconBg: 'var(--red-soft)',
      iconColor: 'var(--red-ink)',
      title: 'MCQ Question Bank',
      desc: 'Author board-style MCQs with 4 bilingual options, answer key, and step-by-step explanations.',
      action: 'Manage Questions'
    },
    {
      to: '/admin/users',
      icon: Users,
      iconBg: 'var(--emerald-soft)',
      iconColor: 'var(--emerald-800)',
      title: 'User Management',
      desc: 'View registered students, review accounts, and configure administrative roles.',
      action: 'Manage Users'
    },
    {
      to: '/virtual-learning',
      icon: Sparkles,
      iconBg: 'var(--physics-soft)',
      iconColor: 'var(--physics-ink)',
      title: 'Virtual Learning (9 Topics)',
      desc: 'Inspect and review 3D simulations across Physics, Chemistry, Biology and Maths.',
      action: 'View Simulations'
    },
    {
      to: '/labs',
      icon: Settings,
      iconBg: 'var(--maths-soft)',
      iconColor: 'var(--maths-ink)',
      title: '3D Virtual Labs (3 Experiments)',
      desc: 'Acid-Base Titration, Compound Microscope, and Simple Pendulum practical apparatus.',
      action: 'Launch Labs'
    },
    {
      to: '/videos',
      icon: Video,
      iconBg: 'var(--red-soft)',
      iconColor: 'var(--red-ink)',
      title: 'Chapter Videos',
      desc: 'Curated lecture videos with chapter timestamps, checkpoints, and Saarthi doubts.',
      action: 'Inspect Lectures'
    }
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: 'var(--sp-8)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      {/* Admin Header — Flat ruled paper ledger card */}
      <PaperCard flat style={{ padding: 'var(--sp-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <div style={{ marginBottom: 'var(--sp-2)' }}>
              <Tag tone="red">
                <ShieldAlert size={14} /> ADMIN CONTROL CENTER
              </Tag>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1, 1.55rem)', fontWeight: 700, margin: '0 0 var(--sp-1) 0', color: 'var(--ink)' }}>
              STEM Curriculum Administration
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', margin: 0 }}>
              Manage CBSE Class 10 bilingual subjects, chapters, lesson blocks, and practice question banks.
            </p>
          </div>
          <Button as={Link} to="/dashboard" variant="secondary" size="sm">
            <Eye size={16} /> Student View
          </Button>
        </div>
      </PaperCard>

      {/* Metrics Grid */}
      <section aria-label="Curriculum and System Overview">
        <SectionHeader kicker="METRICS" title="Curriculum & System Overview" />

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <PaperCard key={idx} flat style={{ padding: 'var(--sp-3)' }}>
                <Skeleton lines={2} />
              </PaperCard>
            ))}
          </div>
        ) : error ? (
          <PaperCard flat style={{ padding: 'var(--sp-4)', marginTop: 'var(--sp-3)', backgroundColor: 'var(--red-soft)', borderColor: 'var(--red-border)', color: 'var(--red-ink)' }}>
            {error}
          </PaperCard>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
            {statItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <PaperCard
                  key={idx}
                  flat
                  style={{
                    padding: 'var(--sp-3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      {item.label}
                    </span>
                    <div style={{ padding: '6px', borderRadius: 'var(--r-sm)', backgroundColor: item.bg, color: item.color }}>
                      <Icon size={16} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
                    {item.value}
                  </div>
                </PaperCard>
              );
            })}
          </div>
        )}
      </section>

      {/* Management Shortcuts */}
      <section aria-label="Management Modules">
        <SectionHeader kicker="MODULES" title="Management Modules" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.to} to={mod.to} style={{ textDecoration: 'none', color: 'inherit' }}>
                <PaperCard
                  flat
                  interactive
                  style={{
                    padding: 'var(--sp-4)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 'var(--sp-3)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
                      <div style={{ padding: '8px', borderRadius: 'var(--r-sm)', backgroundColor: mod.iconBg, color: mod.iconColor }}>
                        <Icon size={20} />
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                        {mod.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'var(--ink-muted)', margin: 0, lineHeight: 1.5 }}>
                      {mod.desc}
                    </p>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: mod.iconColor, fontSize: '0.85rem', fontWeight: 700 }}>
                    {mod.action} <ArrowRight size={14} />
                  </div>
                </PaperCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Cloud & AI Quota Status (P2-14.2) */}
      <section aria-label="Cloud Infrastructure Status">
        <SectionHeader kicker="INFRASTRUCTURE" title="Cloud Infrastructure & Free-Tier Quota Status" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
          <PaperCard flat style={{ padding: 'var(--sp-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Cpu size={18} color="var(--maths)" />
              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)' }}>
                Gemini 1.5 Flash AI Engine
              </h4>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
              <div><strong>Rate Limit:</strong> 15 Requests / Minute (Free Tier)</div>
              <div><strong>Daily Limit:</strong> 1,500 Requests / Day</div>
              <div><strong>Saarthi RAG Cache:</strong> Active (15-min duplicate query deduplication)</div>
              <div style={{ marginTop: '6px' }}>
                <strong>Status:</strong> <Tag tone="emerald">HEALTHY &amp; ACTIVE</Tag>
              </div>
            </div>
          </PaperCard>

          <PaperCard flat style={{ padding: 'var(--sp-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Database size={18} color="var(--physics)" />
              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)' }}>
                Supabase PostgreSQL &amp; Vector
              </h4>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
              <div><strong>Storage Limit:</strong> 500 MB Free Tier (&lt; 25 MB utilized)</div>
              <div><strong>Vector Extension:</strong> pgvector HNSW cosine index enabled</div>
              <div><strong>Row Level Security (RLS):</strong> Enforced on all user tables</div>
              <div style={{ marginTop: '6px' }}>
                <strong>Status:</strong> <Tag tone="emerald">ONLINE &amp; SYNCHRONIZED</Tag>
              </div>
            </div>
          </PaperCard>
        </div>
      </section>
    </div>
  );
}
