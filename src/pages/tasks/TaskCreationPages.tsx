import { useState, useMemo } from 'react';
import { Copy, Eye, Lightbulb, Plus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { taskTemplates, type TaskTemplate } from '../../data/taskAreaData';
import { TasksAreaHeader } from '../../components/TaskSharedComponents';

export function CreateTaskPage() {
  const [values, setValues] = useState<Record<string, string>>({
    title: '', purpose: '', expectedOutput: '', owner: 'Amina Hassan', contributors: '', priority: 'Medium', dueDate: '', slaExpectation: '', checklistItems: '', evidenceRequired: 'Yes', evidenceExpectation: '', linkedKnowledge: '', reviewer: '', closureReviewRequired: 'Yes',
  });
  const required = ['title', 'purpose', 'expectedOutput', 'owner', 'dueDate'];
  const canSubmit = required.every((f) => values[f]?.trim());

  const completeness = useMemo(() => {
    const filled = Object.values(values).filter((v) => v.trim()).length;
    return Math.round((filled / Object.keys(values).length) * 100);
  }, [values]);

  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!values.title.trim()) missing.push('Title');
    if (!values.purpose.trim()) missing.push('Purpose');
    if (!values.expectedOutput.trim()) missing.push('Expected Output');
    if (!values.owner.trim()) missing.push('Owner');
    if (!values.dueDate.trim()) missing.push('Due Date');
    return missing;
  }, [values]);

  const handleSubmit = () => {
    if (!canSubmit) { toast.error('Complete all required fields.'); return; }
    toast.success('Task created successfully.');
    setValues({ title: '', purpose: '', expectedOutput: '', owner: 'Amina Hassan', contributors: '', priority: 'Medium', dueDate: '', slaExpectation: '', checklistItems: '', evidenceRequired: 'Yes', evidenceExpectation: '', linkedKnowledge: '', reviewer: '', closureReviewRequired: 'Yes' });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Create Task" subtitle="Task Creation & Templates" purpose="Create a structured task with purpose, expected output, owner, checklist, due date, SLA, evidence, and knowledge links." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Task Intent</h2>
          <div className="mt-4 space-y-4">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Title *</span><input value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Purpose *</span><textarea value={values.purpose} onChange={(e) => setValues({ ...values, purpose: e.target.value })} rows={3} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Expected Output *</span><textarea value={values.expectedOutput} onChange={(e) => setValues({ ...values, expectedOutput: e.target.value })} rows={3} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" /></label>
          </div>
          <h2 className="mt-6 text-lg font-bold text-primary">Ownership</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Owner *</span><input value={values.owner} onChange={(e) => setValues({ ...values, owner: e.target.value })} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Contributors</span><input value={values.contributors} onChange={(e) => setValues({ ...values, contributors: e.target.value })} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" placeholder="Comma-separated names" /></label>
          </div>
          <h2 className="mt-6 text-lg font-bold text-primary">Execution Control</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Priority</span><select value={values.priority} onChange={(e) => setValues({ ...values, priority: e.target.value })} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Due Date *</span><input value={values.dueDate} onChange={(e) => setValues({ ...values, dueDate: e.target.value })} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" placeholder="e.g. 2026-06-15" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">SLA Expectation</span><input value={values.slaExpectation} onChange={(e) => setValues({ ...values, slaExpectation: e.target.value })} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" placeholder="e.g. 5 business days" /></label>
          </div>
          <label className="mt-4 block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Checklist Items</span><textarea value={values.checklistItems} onChange={(e) => setValues({ ...values, checklistItems: e.target.value })} rows={2} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" placeholder="Semicolon-separated items" /></label>
          <h2 className="mt-6 text-lg font-bold text-primary">Evidence & References</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Evidence Required</span><select value={values.evidenceRequired} onChange={(e) => setValues({ ...values, evidenceRequired: e.target.value })} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option>Yes</option><option>No</option></select></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Linked Knowledge</span><input value={values.linkedKnowledge} onChange={(e) => setValues({ ...values, linkedKnowledge: e.target.value })} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
          </div>
          <label className="mt-4 block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Evidence Expectation</span><textarea value={values.evidenceExpectation} onChange={(e) => setValues({ ...values, evidenceExpectation: e.target.value })} rows={2} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" /></label>
          <h2 className="mt-6 text-lg font-bold text-primary">Review Path</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Reviewer</span><input value={values.reviewer} onChange={(e) => setValues({ ...values, reviewer: e.target.value })} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Closure Review Required</span><select value={values.closureReviewRequired} onChange={(e) => setValues({ ...values, closureReviewRequired: e.target.value })} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option>Yes</option><option>No</option></select></label>
          </div>
          <div className="mt-6 flex gap-3">
            <button disabled={!canSubmit} onClick={handleSubmit} className="rounded-button bg-primary px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Create Task</button>
            <button onClick={() => toast.success('Draft saved locally.')} className="rounded-button border border-border-default px-4 py-2 text-sm font-bold text-primary hover:bg-surface">Save Draft</button>
          </div>
        </section>
        <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Task Quality Preview</h2>
          <div className="mt-4 flex items-center gap-3"><span className="text-3xl font-bold text-primary">{completeness}%</span><span className="text-xs text-text-muted">completeness</span></div>
          {missingFields.length > 0 && <div className="mt-4 rounded-card border border-border-subtle bg-surface p-3"><h3 className="text-xs font-bold text-danger-text">Missing Required Fields</h3><ul className="mt-2 space-y-1">{missingFields.map((f) => <li key={f} className="text-xs text-text-secondary">• {f}</li>)}</ul></div>}
          <div className="mt-4 rounded-card border border-border-subtle bg-surface p-3"><h3 className="text-xs font-bold text-text-muted">Closure Readiness Hints</h3><ul className="mt-2 space-y-1"><li className="text-xs text-text-secondary">• Purpose and expected output should be measurable</li><li className="text-xs text-text-secondary">• Checklist items should be verifiable</li><li className="text-xs text-text-secondary">• Evidence expectation should be specific</li></ul></div>
        </section>
      </div>
    </div>
  );
}

export function SelectTaskTemplatePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<TaskTemplate | null>(null);
  const categories = ['All', 'GHC', 'Agile TMS', 'HRA', 'Support', 'Governance', 'Execution'];

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return taskTemplates;
    return taskTemplates.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Select Task Template" subtitle="Task Creation & Templates" purpose="Start from governed task patterns that encode DQ operating discipline." actionLabel="Create Blank Task" onAction={() => toast.info('Navigate to Create Task.')} />
      <div className="mb-4 flex flex-wrap gap-2">{categories.map((c) => <button key={c} onClick={() => setSelectedCategory(c)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${selectedCategory === c ? 'bg-primary text-white' : 'bg-white text-text-secondary hover:bg-surface'}`}>{c}</button>)}</div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {filtered.map((tpl) => (
          <section key={tpl.id} className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-wider text-text-muted">{tpl.id} · {tpl.category}</div><h3 className="mt-1 text-lg font-bold text-primary">{tpl.name}</h3></div><span className="rounded-pill bg-surface px-2 py-1 text-xs font-bold text-text-muted">{tpl.checklistCount} items</span></div>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{tpl.purpose}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs"><div className="rounded-card border border-border-subtle bg-surface p-3"><span className="font-bold text-text-muted">Typical Owner</span><div className="mt-1 font-semibold text-primary">{tpl.typicalOwner}</div></div><div className="rounded-card border border-border-subtle bg-surface p-3"><span className="font-bold text-text-muted">Evidence Rules</span><div className="mt-1 font-semibold text-primary">{tpl.evidenceRules}</div></div></div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => setPreviewTemplate(tpl)} className="inline-flex items-center gap-1.5 rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface"><Eye size={12} />Preview</button>
              <button onClick={() => toast.success(`Template ${tpl.name} loaded into task draft.`)} className="inline-flex items-center gap-1.5 rounded-button bg-primary px-3 py-2 text-xs font-bold text-white"><Plus size={12} />Use Template</button>
              <button onClick={() => toast.success('Template duplicated locally.')} className="inline-flex items-center gap-1.5 rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface"><Copy size={12} />Duplicate</button>
            </div>
          </section>
        ))}
      </div>
      {previewTemplate && (
        <>
          <div className="fixed inset-0 z-[190] bg-primary/20" onClick={() => setPreviewTemplate(null)} />
          <aside className="fixed right-0 top-0 z-[200] h-screen w-full max-w-lg overflow-y-auto border-l border-border-default bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-border-subtle px-6 py-5"><div><div className="text-xs font-bold uppercase tracking-wider text-text-muted">{previewTemplate.id}</div><h2 className="mt-1 text-xl font-bold text-primary">{previewTemplate.name}</h2></div><button onClick={() => setPreviewTemplate(null)} className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary">✕</button></div>
            <div className="space-y-5 p-6">
              <div className="rounded-card border border-border-subtle bg-surface p-4"><span className="text-xs font-bold text-text-muted">Purpose</span><p className="mt-1 text-sm text-text-secondary">{previewTemplate.purpose}</p></div>
              <div className="rounded-card border border-border-subtle bg-surface p-4"><span className="text-xs font-bold text-text-muted">Closure Criteria</span><ul className="mt-2 space-y-1">{previewTemplate.closureCriteria.map((c) => <li key={c} className="text-xs text-text-secondary">• {c}</li>)}</ul></div>
              <div className="rounded-card border border-border-subtle bg-surface p-4"><span className="text-xs font-bold text-text-muted">Linked References</span><div className="mt-2 flex flex-wrap gap-2">{previewTemplate.linkedReferences.map((r) => <span key={r} className="rounded-pill bg-white px-2 py-1 text-xs font-semibold text-text-secondary">{r}</span>)}</div></div>
              <button onClick={() => { toast.success(`Template ${previewTemplate.name} loaded.`); setPreviewTemplate(null); }} className="w-full rounded-button bg-primary px-4 py-2 text-sm font-bold text-white">Use This Template</button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

export function DefinePurposeOutputPage() {
  const [purpose, setPurpose] = useState('');
  const [output, setOutput] = useState('');
  const [criteria, setCriteria] = useState('');
  const [format, setFormat] = useState('');

  const clarityScore = useMemo(() => {
    let score = 0;
    if (purpose.length > 20) score += 33;
    if (output.length > 20) score += 33;
    if (criteria.length > 10) score += 34;
    return score;
  }, [purpose, output, criteria]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Define Purpose & Output" subtitle="Task Creation & Templates" purpose="Help users define why the task exists and what output proves completion." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <div className="rounded-card border border-info bg-info-surface p-4"><div className="flex items-start gap-3"><Lightbulb size={18} className="mt-0.5 text-info" /><div><h3 className="text-sm font-bold text-primary">Strong Task Intent</h3><p className="mt-1 text-xs leading-5 text-text-secondary">A strong task purpose explains why the work matters, what business situation triggered it, and what will be different when it is complete. A strong expected output is specific, measurable, and directly proves the purpose was achieved.</p></div></div></div>
          <div className="mt-5 space-y-4">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Purpose Statement</span><textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={4} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" placeholder="Why does this task exist? What business situation triggered it?" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Expected Output</span><textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={4} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" placeholder="What specific output proves this task is complete?" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Success Criteria</span><textarea value={criteria} onChange={(e) => setCriteria(e.target.value)} rows={3} className="mt-2 w-full rounded-input border border-border-default bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-border-strong" placeholder="How will we know the output meets expectations?" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Output Format</span><input value={format} onChange={(e) => setFormat(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" placeholder="e.g. Document, Spreadsheet, Confirmation" /></label>
          </div>
        </section>
        <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Quality Assistant</h2>
          <div className="mt-4 flex items-center gap-3"><span className="text-3xl font-bold text-primary">{clarityScore}%</span><span className="text-xs text-text-muted">purpose clarity</span></div>
          <div className="mt-4 space-y-3">
            <div className={`flex items-center gap-2 rounded-card border p-3 ${purpose.length > 20 ? 'border-success bg-success-surface' : 'border-border-subtle bg-surface'}`}><CheckCircle2 size={14} className={purpose.length > 20 ? 'text-success' : 'text-text-muted'} /><span className="text-xs font-semibold text-primary">Purpose clarity</span></div>
            <div className={`flex items-center gap-2 rounded-card border p-3 ${output.length > 20 ? 'border-success bg-success-surface' : 'border-border-subtle bg-surface'}`}><CheckCircle2 size={14} className={output.length > 20 ? 'text-success' : 'text-text-muted'} /><span className="text-xs font-semibold text-primary">Output measurability</span></div>
            <div className={`flex items-center gap-2 rounded-card border p-3 ${criteria.length > 10 ? 'border-success bg-success-surface' : 'border-border-subtle bg-surface'}`}><CheckCircle2 size={14} className={criteria.length > 10 ? 'text-success' : 'text-text-muted'} /><span className="text-xs font-semibold text-primary">Closure evidence inferability</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function AssignOwnerContributorsPage() {
  const [owner, setOwner] = useState('Amina Hassan');
  const [role, setRole] = useState('Associate');
  const [unit, setUnit] = useState('People Operations');
  const [backupOwner, setBackupOwner] = useState('');
  const [contributors, setContributors] = useState<Array<{ name: string; responsibility: string }>>([{ name: '', responsibility: '' }]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Assign Owner / Contributors" subtitle="Task Creation & Templates" purpose="Ensure accountability is explicit with named owner, role, unit, and contributors." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Owner Selection</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Owner *</span><input value={owner} onChange={(e) => setOwner(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Role</span><input value={role} onChange={(e) => setRole(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Unit / Team</span><input value={unit} onChange={(e) => setUnit(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Backup Owner (optional)</span><input value={backupOwner} onChange={(e) => setBackupOwner(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
          </div>
          <h2 className="mt-6 text-lg font-bold text-primary">Contributors</h2>
          <div className="mt-4 space-y-3">
            {contributors.map((c, i) => (
              <div key={i} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input value={c.name} onChange={(e) => { const next = [...contributors]; next[i].name = e.target.value; setContributors(next); }} className="h-11 rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" placeholder="Contributor name" />
                <input value={c.responsibility} onChange={(e) => { const next = [...contributors]; next[i].responsibility = e.target.value; setContributors(next); }} className="h-11 rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" placeholder="Responsibility" />
              </div>
            ))}
            <button onClick={() => setContributors([...contributors, { name: '', responsibility: '' }])} className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">Add Contributor</button>
          </div>
        </section>
        <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Accountability Preview</h2>
          <div className="mt-4 rounded-card border border-border-subtle bg-surface p-4">
            <p className="text-xs leading-5 text-text-secondary">The <strong className="text-primary">owner</strong> is accountable for progress updates, blocker management, evidence attachment, and closure readiness. Contributors support specific aspects of the work but the owner remains responsible for the task outcome.</p>
          </div>
          <div className="mt-4 rounded-card border border-border-subtle bg-surface p-4">
            <span className="text-xs font-bold text-text-muted">Workload Hint</span>
            <div className="mt-2 space-y-1 text-xs text-text-secondary"><p>Active tasks: 5</p><p>Blocked tasks: 1</p><p>Due soon: 2</p></div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function SetSlaDueDatePage() {
  const [dueDate, setDueDate] = useState('');
  const [slaTier, setSlaTier] = useState('Standard');
  const [reviewDate, setReviewDate] = useState('');
  const [reminder, setReminder] = useState('Two days before due date');
  const [escalation, setEscalation] = useState('Team Lead');

  const slaTiers = ['Urgent (1 day)', 'Standard (5 days)', 'Extended (10 days)', 'Custom'];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <TasksAreaHeader title="Set SLA / Due Date" subtitle="Task Creation & Templates" purpose="Define time control, reminders, and escalation expectations for governed work." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Due Date *</span><input value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" placeholder="e.g. 2026-06-15" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">SLA Tier</span><select value={slaTier} onChange={(e) => setSlaTier(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none">{slaTiers.map((t) => <option key={t}>{t}</option>)}</select></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Review Date</span><input value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Reminder Schedule</span><select value={reminder} onChange={(e) => setReminder(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none"><option>Daily until due</option><option>Two days before due date</option><option>On due date only</option><option>No reminder</option></select></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-text-muted">Escalation Threshold</span><input value={escalation} onChange={(e) => setEscalation(e.target.value)} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" /></label>
          </div>
        </section>
        <section className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">SLA Preview</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-card border border-success bg-success-surface p-3"><span className="text-xs font-bold text-success-text">On-Track Window</span><p className="mt-1 text-xs text-text-secondary">Task is within the expected completion window.</p></div>
            <div className="rounded-card border border-warning bg-warning-surface p-3"><span className="text-xs font-bold text-warning-text">At-Risk Trigger</span><p className="mt-1 text-xs text-text-secondary">Triggered when 80% of SLA time has elapsed without completion.</p></div>
            <div className="rounded-card border border-danger bg-danger-surface p-3"><span className="text-xs font-bold text-danger-text">Breach Trigger</span><p className="mt-1 text-xs text-text-secondary">Triggered when due date passes without closure or approved extension.</p></div>
            <div className="rounded-card border border-border-subtle bg-surface p-3"><span className="text-xs font-bold text-text-muted">Escalation Owner</span><p className="mt-1 text-xs text-text-secondary">{escalation}</p></div>
          </div>
        </section>
      </div>
    </div>
  );
}
