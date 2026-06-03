import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { useDirectoryLifecycle } from '../context/DirectoryLifecycleContext';
import { usePersona } from '../context/PersonaContext';
import { DirectoryDetailHero } from '../components/WorkDirectoryComponents';
import type { DirectoryActionType } from '../types/workDirectory';

const requestOptions = ['REQ-2001', 'REQ-2002', 'REQ-2003', 'REQ-2004'];
const taskOptions = ['TSK-2401', 'TSK-1002', 'TSK-1003'];

export function WorkDirectoryActionFlowPage({ mode }: { mode: 'contact' | 'route' | 'escalate' }) {
  const { directoryId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activePersona } = usePersona();
  const { getEntry, submitDirectoryAction } = useDirectoryLifecycle();
  const entry = getEntry(directoryId);

  const defaultAction = useMemo<DirectoryActionType>(() => {
    const action = searchParams.get('action');
    if (mode === 'contact' && action === 'review') return 'Request Review';
    if (mode === 'route' && action === 'assign') return 'Assign Task';
    if (mode === 'route' && action === 'handoff') return 'Handoff Work';
    if (mode === 'escalate') return 'Escalate';
    if (mode === 'route') return 'Route Request';
    return 'Contact';
  }, [mode, searchParams]);

  const [actionType, setActionType] = useState<DirectoryActionType>(defaultAction);
  const [targetId, setTargetId] = useState(mode === 'route' ? requestOptions[0] : '');
  const [severity, setSeverity] = useState('High');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold text-primary">Directory entry not found</h1>
        <Link to="/marketplaces/work-directory" className="font-bold text-primary hover:underline">Return to Work Directory</Link>
      </div>
    );
  }

  if (activePersona.id === 'ceo') {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold text-primary">Aggregate view only</h1>
        <p className="mb-6 text-text-secondary">Executive persona can inspect organisation structure and aggregate signals, but personal contact and routing actions are not available in this feature.</p>
        <button onClick={() => navigate('/intelligence/organisation-signals')} className="rounded-button bg-primary px-5 py-2.5 font-bold text-white hover:bg-navy-700">
          Open organisation signals
        </button>
      </div>
    );
  }

  const requiresTarget = mode === 'route';
  const warning = entry.availability === 'Escalation only' || !entry.backupOwner;

  const submit = () => {
    if (requiresTarget && !targetId) {
      setError('Select a request, task, or work item before submitting.');
      return;
    }
    if (!reason.trim()) {
      setError(`${mode === 'contact' ? 'Contact' : mode === 'escalate' ? 'Escalation' : 'Routing'} reason is required.`);
      return;
    }
    setError('');
    submitDirectoryAction({
      entryId: entry.id,
      actionType,
      targetId: targetId || severity,
      reason,
      notes
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-card border border-success/20 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-success" />
          <h1 className="mb-2 text-2xl font-bold text-primary">{actionType} submitted</h1>
          <p className="mb-6 text-text-secondary">The action was saved in prototype state and linked to {entry.name}.</p>
          <button onClick={() => navigate(`/marketplaces/work-directory/${entry.id}`)} className="rounded-button bg-primary px-5 py-2.5 font-bold text-white hover:bg-navy-700">
            Return to detail page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <DirectoryDetailHero entry={entry} />

      <div className="rounded-card border border-border-default bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-primary">
            {mode === 'escalate' ? <AlertTriangle size={20} /> : mode === 'contact' ? <MessageSquare size={20} /> : <ArrowRight size={20} />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">{mode === 'contact' ? 'Contact / Collaboration' : mode === 'escalate' ? 'Escalation Route' : 'Route Request / Handoff'}</h1>
            <p className="text-sm text-text-secondary">Selected target: {entry.name} · Backup: {entry.backupOwner || 'No backup mapped'}</p>
          </div>
        </div>

        {warning && (
          <div className="mb-5 rounded-lg border border-warning/20 bg-warning-surface px-4 py-3 text-sm font-semibold text-warning-text">
            {entry.availability === 'Escalation only' ? 'Owner is escalation-only. ' : ''}{!entry.backupOwner ? 'No backup owner is mapped. ' : ''}Confirm the route before submitting.
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold text-primary">Action</span>
            <select value={actionType} onChange={(event) => setActionType(event.target.value as DirectoryActionType)} className="h-11 w-full rounded-button border border-border-default px-3 text-sm">
              {(mode === 'contact' ? ['Contact', 'Request Review'] : mode === 'escalate' ? ['Escalate'] : ['Route Request', 'Assign Task', 'Handoff Work']).map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          {mode === 'route' ? (
            <label className="space-y-2">
              <span className="text-sm font-bold text-primary">Request / Task selector</span>
              <select value={targetId} onChange={(event) => setTargetId(event.target.value)} className="h-11 w-full rounded-button border border-border-default px-3 text-sm">
                <option value="">Select target...</option>
                {[...requestOptions, ...taskOptions].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          ) : mode === 'escalate' ? (
            <label className="space-y-2">
              <span className="text-sm font-bold text-primary">Severity</span>
              <select value={severity} onChange={(event) => setSeverity(event.target.value)} className="h-11 w-full rounded-button border border-border-default px-3 text-sm">
                {['Medium', 'High', 'Critical'].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          ) : (
            <label className="space-y-2">
              <span className="text-sm font-bold text-primary">Contact route</span>
              <input value={entry.preferredContactRoute} readOnly className="h-11 w-full rounded-button border border-border-default bg-surface px-3 text-sm font-semibold" />
            </label>
          )}
        </div>

        <label className="mt-5 block space-y-2">
          <span className="text-sm font-bold text-primary">Reason</span>
          <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Describe why this action is needed" className="h-11 w-full rounded-button border border-border-default px-3 text-sm" />
        </label>

        <label className="mt-5 block space-y-2">
          <span className="text-sm font-bold text-primary">Notes</span>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Add context, blocker details, SLA context, or handoff notes" className="w-full rounded-button border border-border-default px-3 py-2 text-sm" />
        </label>

        {error && <p className="mt-4 rounded-lg bg-danger-surface px-4 py-3 text-sm font-semibold text-danger-text">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => navigate(`/marketplaces/work-directory/${entry.id}`)} className="rounded-button border border-border-default px-4 py-2 text-sm font-bold text-primary hover:bg-surface">Cancel</button>
          <button onClick={submit} className="rounded-button bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">Submit</button>
        </div>
      </div>
    </div>
  );
}
