import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskLifecycle } from '../context/TaskLifecycleContext';
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, ShieldCheck, PlayCircle } from 'lucide-react';
import { StatusPill } from '../components/StatusPill';

export function TaskDetailStatusPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, isLoading, submitTaskForReview } = useTaskLifecycle();
  
  const [showToast, setShowToast] = useState(false);

  const task = tasks.find(t => t.id === taskId);

  if (isLoading) return <div className="p-8">Loading task...</div>;
  if (!task) return <div className="p-8 text-danger">Task not found.</div>;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmitReview = () => {
    if (task.id) {
      submitTaskForReview(task.id);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 pb-32">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header */}
      <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-border-subtle">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded bg-navy-50 px-2 py-1 text-xs font-bold tracking-wider text-primary">
              {task.templateTitle || 'Custom Task'}
            </span>
          </div>
          <StatusPill status={task.status} />
        </div>

        <h1 className="mb-2 text-3xl font-bold text-text-primary">{task.title}</h1>
        <p className="mb-6 text-lg text-text-secondary">{task.purpose}</p>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl bg-surface p-4 text-sm font-medium text-text-secondary">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-text-muted" />
            <span className="text-text-muted">Due Date:</span> {task.dueDate}
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-text-muted" />
            <span className="text-text-muted">Priority:</span> {task.priority}
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-text-muted" />
            <span className="text-text-muted">Review State:</span> {task.reviewState || 'Not Requested'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
            <h2 className="mb-4 text-lg font-bold text-text-primary">Expected Output</h2>
            <p className="text-text-secondary">{task.expectedOutput}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
            <h2 className="mb-4 text-lg font-bold text-text-primary">Checklist Progress</h2>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                <div 
                  className="h-full bg-success" 
                  style={{ width: `${task.checklistTotal > 0 ? (task.checklistDone / task.checklistTotal) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-bold text-text-secondary">
                {task.checklistDone} / {task.checklistTotal} Done
              </span>
            </div>
            
            {/* Mocked checklist items for UI */}
            <ul className="space-y-3">
              {Array.from({ length: task.checklistTotal }).map((_, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    i < task.checklistDone ? 'border-success bg-success text-white' : 'border-border-strong bg-surface'
                  }`}>
                    {i < task.checklistDone && <CheckCircle2 size={14} />}
                  </div>
                  <span className={`text-sm ${i < task.checklistDone ? 'text-text-secondary line-through' : 'font-medium text-text-primary'}`}>
                    Template required item {i + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-border-subtle">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-text-muted">Actions</h3>
            
            <button 
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-50 border border-primary px-4 py-2.5 text-sm font-bold text-primary shadow-sm hover:bg-navy-100"
            >
              Update Progress
            </button>
            
            {task.status !== 'Review Needed' && task.status !== 'Closed' && (
              <button 
                onClick={handleSubmitReview}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-navy-700"
              >
                <PlayCircle size={18} />
                Submit for Review
              </button>
            )}
            
            <button 
              onClick={handleCopyLink}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-default bg-white px-4 py-2.5 text-sm font-bold text-text-secondary hover:bg-surface"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white shadow-lg">
          Action completed.
        </div>
      )}
    </div>
  );
}
