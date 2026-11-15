import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  PaperCard,
  Tape,
  Field,
  Button,
  StickyNote,
  ChotuMascot,
  Tag,
} from '../components/ui';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your email or mobile number and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login({ identifier: identifier.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: 'var(--sp-6) auto 0' }}>
      <PaperCard flat style={{ padding: 'var(--sp-6)', position: 'relative' }}>
        <Tape tone="kraft" rotation="-1.5deg" />

        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-30px',
            right: '24px',
          }}
        >
          <ChotuMascot size={58} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
          <Tag variant="paper">Student Notebook</Tag>
          <h1 className="type-h1" style={{ color: 'var(--ink)' }}>
            Welcome Back
          </h1>
          <p className="type-hand" style={{ color: 'var(--hand-rust)', fontSize: '1.35rem' }}>
            Log in to open your saved lessons, lab logs, and practice scores.
          </p>
        </div>

        {error ? (
          <StickyNote
            tone="pink"
            body
            rotation="-0.5deg"
            role="alert"
            style={{ marginBottom: 'var(--sp-4)', fontWeight: 600 }}
          >
            {error}
          </StickyNote>
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <Field
            id="login-id"
            label="Email or Mobile Number"
            type="text"
            placeholder="e.g. aarav@example.com or 9876543210"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
          />

          <Field
            id="login-password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <Button type="submit" variant="primary" fullWidth disabled={submitting}>
            <LogIn size={18} strokeWidth={2} aria-hidden="true" />
            {submitting ? 'Opening Notebook...' : 'Log in'}
            {!submitting ? <ArrowRight size={16} strokeWidth={2} aria-hidden="true" /> : null}
          </Button>
        </form>

        <p
          className="type-small"
          style={{
            textAlign: 'center',
            color: 'var(--ink-muted)',
            marginTop: 'var(--sp-5)',
            paddingTop: 'var(--sp-4)',
            borderTop: '1px solid var(--paper-border-warm)',
          }}
        >
          New to EVidya?{' '}
          <Link to="/signup" style={{ color: 'var(--emerald-700)', fontWeight: 700 }}>
            Create a free notebook
          </Link>
        </p>
      </PaperCard>
    </div>
  );
}
