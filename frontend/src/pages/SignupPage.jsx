import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';
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

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    password: '',
    board: 'CBSE',
    class: '10',
    language: 'en',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!formData.identifier.trim()) {
      setError('Please provide an email address or mobile number.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      const isEmail = formData.identifier.includes('@');
      const payload = {
        name: formData.name.trim(),
        email: isEmail ? formData.identifier.trim() : undefined,
        phone: !isEmail ? formData.identifier.trim() : undefined,
        password: formData.password,
        board: formData.board,
        class: Number(formData.class),
        language: formData.language,
      };

      await signup(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: 'var(--sp-5) auto 0' }}>
      <PaperCard flat style={{ padding: 'var(--sp-6)', position: 'relative' }}>
        <Tape tone="green" rotation="1.2deg" />

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
          <Tag variant="ready">Onboarding · Class 9–12</Tag>
          <h1 className="type-h1" style={{ color: 'var(--ink)' }}>
            Create Your Notebook
          </h1>
          <p className="type-hand" style={{ color: 'var(--hand-rust)', fontSize: '1.35rem' }}>
            Personalize your board, class, and preferred language in under a minute.
          </p>
        </div>

        {error ? (
          <StickyNote
            tone="pink"
            body
            rotation="-0.4deg"
            role="alert"
            style={{ marginBottom: 'var(--sp-4)', fontWeight: 600 }}
          >
            {error}
          </StickyNote>
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <Field
            id="signup-name"
            label="Full Name"
            type="text"
            placeholder="e.g. Aarav Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Field
            id="signup-id"
            label="Email or Mobile Number"
            type="text"
            placeholder="e.g. aarav@example.com or 9876543210"
            value={formData.identifier}
            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
            required
          />

          <Field
            id="signup-password"
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            helper="Use 6 or more characters so your offline progress stays protected."
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span className="field__label">Educational Board</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--sp-3)' }}>
              {['CBSE', 'State Board'].map((boardOption) => (
                <Button
                  key={boardOption}
                  type="button"
                  variant={formData.board === boardOption ? 'primary' : 'note'}
                  onClick={() => setFormData({ ...formData, board: boardOption })}
                  aria-pressed={formData.board === boardOption ? 'true' : 'false'}
                >
                  {boardOption}
                </Button>
              ))}
            </div>
          </div>

          <div className="paper-grid paper-grid--2" style={{ gap: 'var(--sp-3)' }}>
            <Field
              id="signup-class"
              as="select"
              label="Class"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            >
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </Field>

            <Field
              id="signup-lang"
              as="select"
              label="Language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="en">English (EN)</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="mr">Marathi (मराठी)</option>
            </Field>
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={submitting}>
            <UserPlus size={18} strokeWidth={2} aria-hidden="true" />
            {submitting ? 'Setting up Notebook...' : 'Create Account'}
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
          Already have a notebook?{' '}
          <Link to="/login" style={{ color: 'var(--emerald-700)', fontWeight: 700 }}>
            Log in
          </Link>
        </p>
      </PaperCard>
    </div>
  );
}
