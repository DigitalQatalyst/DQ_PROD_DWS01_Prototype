import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, X } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';

function RequestAccessModal({ onClose }: { onClose: () => void }) {
  const [reason, setReason] = useState('');
  const [scope, setScope] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = reason.trim() && scope.trim();
  const submitRequest = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/permission-exceptions', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope, reason }),
      });

      if (!response.ok) {
        throw new Error(`Access request failed with status ${response.status}`);
      }

      toast.success('Access request submitted for review.');
      onClose();
    } catch (error) {
      toast.error('Unable to submit access request.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[210] bg-primary/20" onClick={onClose} />
      <section className="fixed left-1/2 top-1/2 z-[220] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-modal border border-border-default bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">Request access</h2>
            <p className="mt-1 text-sm text-text-secondary">Explain the access scope and business reason.</p>
          </div>
          <button onClick={onClose} aria-label="Close access request" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Requested scope</span>
            <input value={scope} onChange={(event) => setScope(event.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default px-3 text-sm outline-none focus:border-border-strong" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Business reason</span>
            <textarea value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 min-h-28 w-full rounded-input border border-border-default px-3 py-2 text-sm outline-none focus:border-border-strong" />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-button px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface">Cancel</button>
          <button
            disabled={!canSubmit || isSubmitting}
            onClick={submitRequest}
            className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Submit request'}
          </button>
        </div>
      </section>
    </>
  );
}

export function AccessRestrictedPage() {
  const [requestOpen, setRequestOpen] = useState(false);
  const { activeRole, getDefaultRoute } = useWorkspaceRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('/api/access/denied', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resource: location.pathname,
        reason: 'route_permission_denied',
        activeRole,
      }),
    }).catch((error) => {
      console.error('Unable to record access denied event', error);
    });
  }, [activeRole, location.pathname]);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-surface px-8 py-10">
      <section className="mx-auto max-w-2xl rounded-card border border-border-subtle bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-primary">
          <Lock size={24} />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-primary">Access restricted</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Your active role, {activeRole}, does not include permission for this route. Restricted menu items are hidden from the sidebar, and direct URLs require approved access.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button onClick={() => setRequestOpen(true)} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Request Access</button>
          <button onClick={() => navigate(getDefaultRoute(activeRole))} className="rounded-button border border-border-default bg-white px-4 py-2 text-sm font-bold text-primary hover:bg-surface">Back to My Workspace</button>
        </div>
      </section>
      {requestOpen && <RequestAccessModal onClose={() => setRequestOpen(false)} />}
    </main>
  );
}
