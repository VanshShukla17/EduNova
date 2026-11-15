import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { getAdminUsers, updateUserRole } from '../../services/api';
import { Button, EmptyState, Modal, PaperCard, SectionHeader, Skeleton, Tag } from '../../components/ui';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState(null);
  const [roleTarget, setRoleTarget] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers();
      setUsers(res.users || []);
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to load users: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmToggleRole = async () => {
    if (!roleTarget) return;
    const { user, newRole } = roleTarget;
    try {
      setUpdatingRole(true);
      await updateUserRole(user._id, newRole);
      setAlertMsg({ type: 'success', text: `Updated ${user.name}'s role to ${newRole}.` });
      setRoleTarget(null);
      loadUsers();
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Failed to update user role: ' + err.message });
      setRoleTarget(null);
    } finally {
      setUpdatingRole(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: 'var(--sp-8)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      {/* Top Navigation */}
      <div>
        <Button as={Link} to="/admin" variant="ghost" size="sm">
          <ArrowLeft size={16} /> Back to Admin Dashboard
        </Button>
      </div>

      {/* Banner Alert */}
      {alertMsg && (
        <PaperCard
          flat
          role="status"
          style={{
            padding: 'var(--sp-3) var(--sp-4)',
            backgroundColor: alertMsg.type === 'success' ? 'var(--emerald-soft)' : 'var(--red-soft)',
            color: alertMsg.type === 'success' ? 'var(--emerald-800)' : 'var(--red-ink)',
            borderColor: alertMsg.type === 'success' ? 'var(--emerald-600)' : 'var(--red-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            fontSize: '0.88rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {alertMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{alertMsg.text}</span>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setAlertMsg(null)} aria-label="Dismiss alert">
            <X size={16} />
          </Button>
        </PaperCard>
      )}

      {/* Header */}
      <PaperCard flat style={{ padding: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap', marginBottom: 'var(--sp-2)' }}>
          <Tag tone="emerald">User Directory</Tag>
          <span style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>
            {users.length} Registered Accounts
          </span>
        </div>
        <SectionHeader title="Registered Students & Administrators" />
      </PaperCard>

      {/* Users Table */}
      <PaperCard flat style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 'var(--sp-5)' }}>
            <Skeleton lines={5} />
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: 'var(--sp-5)' }}>
            <EmptyState
              title="No registered accounts"
              description="Student and administrator accounts will appear here once registered."
            />
          </div>
        ) : (
          <div className="paper-table-wrap">
            <table className="paper-table paper-table--stack">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email / Identifier</th>
                  <th>Role</th>
                  <th>Class / Board</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const nextRole = isAdmin ? 'student' : 'admin';
                  return (
                    <tr key={u._id}>
                      <td data-label="Name" style={{ fontWeight: 700, color: 'var(--ink)' }}>
                        {u.name}
                      </td>
                      <td data-label="Email / Identifier" style={{ color: 'var(--ink-muted)' }}>
                        {u.email || u.phone || '-'}
                      </td>
                      <td data-label="Role">
                        <Tag tone={isAdmin ? 'red' : 'physics'}>
                          {u.role}
                        </Tag>
                      </td>
                      <td data-label="Class / Board" style={{ color: 'var(--ink-soft)' }}>
                        Class {u.classLevel || 10} • {u.board || 'CBSE'}
                      </td>
                      <td data-label="Actions" style={{ textAlign: 'right' }}>
                        <Button
                          type="button"
                          size="sm"
                          variant={isAdmin ? 'secondary' : 'danger'}
                          onClick={() => setRoleTarget({ user: u, newRole: nextRole })}
                        >
                          {isAdmin ? 'Make Student' : 'Make Admin'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </PaperCard>

      <Modal
        open={Boolean(roleTarget)}
        onClose={() => !updatingRole && setRoleTarget(null)}
        title="Confirm Role Change"
        tapeTone="yellow"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)' }}>
            <Button type="button" variant="secondary" size="sm" onClick={() => setRoleTarget(null)} disabled={updatingRole}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={roleTarget?.newRole === 'admin' ? 'danger' : 'primary'}
              size="sm"
              onClick={handleConfirmToggleRole}
              disabled={updatingRole}
            >
              {updatingRole ? 'Updating...' : `Confirm ${roleTarget?.newRole?.toUpperCase()}`}
            </Button>
          </div>
        }
      >
        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--ink-muted)', lineHeight: 1.55 }}>
          Change <strong>{roleTarget?.user?.name}</strong>&apos;s role to{' '}
          <strong>{roleTarget?.newRole?.toUpperCase()}</strong>?
        </p>
      </Modal>
    </div>
  );
}
