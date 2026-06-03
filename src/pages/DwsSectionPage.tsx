import React, { useMemo, useState } from 'react';
import { CalendarDays, Filter, LayoutDashboard, ListChecks, Plus, Search, Trello, X } from 'lucide-react';
import { toast } from 'sonner';
import { getNavigationItem } from '../config/navigation';
import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import { buildKpis, buildRecords, type DwsRecord } from '../mocks/dwsEntities.mock';
import { StatusPill } from '../components/StatusPill';

const trackerViews = ['Table View', 'Board View', 'Timeline View', 'Calendar View', 'Dashboard View', 'Owner / Workload View'];
const myWorkTabs = ['All', 'Tasks', 'Workflows', 'Requests', 'Approvals', 'Blockers', 'Updates'];

function DetailDrawer({ record, onClose, onUpdate }: { record: DwsRecord | null; onClose: () => void; onUpdate: (record: DwsRecord) => void }) {
  if (!record) return null;
  return (
    <>
      <div className="fixed inset-0 z-[190] bg-primary/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-[200] h-screen w-full max-w-md overflow-y-auto border-l border-border-default bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-border-subtle px-6 py-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{record.id} · {record.type}</div>
            <h2 className="mt-1 text-xl font-bold text-primary">{record.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close drawer" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={20} /></button>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex flex-wrap gap-2">
            <StatusPill status={record.status} />
            <StatusPill status={record.priority} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><div className="text-xs font-bold uppercase tracking-wider text-text-muted">Owner/source</div><div className="mt-1 font-semibold text-primary">{record.owner}</div></div>
            <div><div className="text-xs font-bold uppercase tracking-wider text-text-muted">Due date</div><div className="mt-1 font-semibold text-primary">{record.dueDate}</div></div>
            <div><div className="text-xs font-bold uppercase tracking-wider text-text-muted">Risk</div><div className="mt-1 font-semibold text-primary">{record.risk}</div></div>
            <div><div className="text-xs font-bold uppercase tracking-wider text-text-muted">Last updated</div><div className="mt-1 font-semibold text-primary">{record.lastUpdated}</div></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary">Description</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{record.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary">Related work items</h3>
            <div className="mt-2 space-y-2">
              {record.related.map((related) => <div key={related} className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm text-text-secondary">{related}</div>)}
            </div>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface p-4">
            <h3 className="text-sm font-bold text-primary">Recommended next action</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{record.nextAction}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['Mark reviewed', 'Change status', 'Assign owner', 'Add note'].map((label) => (
              <button
                key={label}
                onClick={() => {
                  const nextRecord = label === 'Change status' ? { ...record, status: record.status === 'Completed' ? 'In Progress' : 'Completed' } : record;
                  onUpdate(nextRecord);
                  toast.success(`${label} saved.`);
                }}
                className="rounded-button border border-border-default px-3 py-2 text-xs font-bold text-primary hover:bg-surface">
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

function ActionModal({ title, onClose, onSave }: { title: string; onClose: () => void; onSave: (values: Record<string, string>) => void }) {
  const fields = title.includes('Export') ? ['Report name', 'Cycle', 'Format'] :
    title.includes('Knowledge') ? ['Title', 'Category', 'Summary', 'Linked work item'] :
    title.includes('Evidence') ? ['Evidence title', 'Related item', 'Evidence link', 'Notes'] :
    ['Title', 'Owner', 'Priority', 'Due date', 'Description'];
  const [values, setValues] = useState<Record<string, string>>({});
  const canSubmit = fields.every((field) => String(values[field] || '').trim());

  return (
    <>
      <div className="fixed inset-0 z-[210] bg-primary/20" onClick={onClose} />
      <section className="fixed left-1/2 top-1/2 z-[220] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-modal border border-border-default bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">{title}</h2>
            <p className="mt-1 text-sm text-text-secondary">Required fields are validated locally for this prototype.</p>
          </div>
          <button onClick={onClose} aria-label="Close modal" className="rounded-full p-2 text-text-muted hover:bg-surface hover:text-primary"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className={field === 'Description' || field === 'Summary' || field === 'Notes' ? 'md:col-span-2' : ''}>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{field}</span>
              <input value={values[field] || ''} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className="mt-2 h-11 w-full rounded-input border border-border-default bg-white px-3 text-sm outline-none focus:border-border-strong" />
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-button px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface">Cancel</button>
          <button disabled={!canSubmit} onClick={() => onSave(values)} className="rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Save</button>
        </div>
      </section>
    </>
  );
}

function KpiStrip({ records, routeLabel }: { records: DwsRecord[]; routeLabel: string }) {
  const kpis = buildKpis({ label: routeLabel, section: 'workspace' } as never, records);
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {kpis.map((kpi) => (
        <button key={kpi.label} onClick={() => toast.info(`${kpi.label} filter applied.`)} className="rounded-card border border-border-subtle bg-white p-5 text-left shadow-sm hover:bg-surface">
          <div className="text-sm font-semibold text-text-muted">{kpi.label}</div>
          <div className="mt-2 text-3xl font-bold text-primary">{kpi.value}</div>
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-info" />
            {kpi.helper}
          </div>
        </button>
      ))}
    </section>
  );
}

function CreateTaskForm({ onCreate }: { onCreate: (record: DwsRecord) => void }) {
  const fields = ['Title', 'Purpose', 'Owner', 'Contributors', 'Expected output', 'Checklist', 'Due date / SLA', 'Priority', 'Linked knowledge', 'Evidence expectation'];
  const [values, setValues] = useState<Record<string, string>>({});
  const canSubmit = fields.every((field) => String(values[field] || '').trim());
  return (
    <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary">Create governed task</h2>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field} className={field === 'Purpose' || field === 'Expected output' || field === 'Checklist' || field === 'Evidence expectation' ? 'md:col-span-2' : ''}>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{field}</span>
            <input value={values[field] || ''} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className="mt-2 h-11 w-full rounded-input border border-border-default px-3 text-sm outline-none focus:border-border-strong" />
          </label>
        ))}
      </div>
      <button
        disabled={!canSubmit}
        onClick={() => {
          onCreate({
            id: `TSK-${Date.now().toString().slice(-4)}`,
            title: values.Title,
            type: 'Task',
            status: 'Draft',
            priority: values.Priority,
            owner: values.Owner,
            dueDate: values['Due date / SLA'],
            source: 'Create Task',
            risk: 'Low',
            lastUpdated: 'Just now',
            description: `${values.Purpose}. Expected output: ${values['Expected output']}. Evidence: ${values['Evidence expectation']}.`,
            nextAction: 'Review the task and publish it to the assigned owner.',
            related: [values['Linked knowledge'], 'Task Model Configuration'].filter(Boolean)
          });
          toast.success('Task created successfully.');
        }}
        className="mt-6 rounded-button bg-primary px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
        Submit task
      </button>
    </section>
  );
}

function SubmitRequestForm({ onCreate }: { onCreate: (record: DwsRecord) => void }) {
  const fields = ['Request category', 'Request type', 'Description', 'Expected outcome', 'Urgency', 'Attachments', 'Preferred due date', 'Linked task/workflow/tracker'];
  const [values, setValues] = useState<Record<string, string>>({});
  const canSubmit = fields.every((field) => String(values[field] || '').trim());
  return (
    <section className="rounded-card border border-border-subtle bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary">Submit request</h2>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field} className={field === 'Description' || field === 'Expected outcome' ? 'md:col-span-2' : ''}>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{field}</span>
            <input value={values[field] || ''} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className="mt-2 h-11 w-full rounded-input border border-border-default px-3 text-sm outline-none focus:border-border-strong" />
          </label>
        ))}
      </div>
      <button
        disabled={!canSubmit}
        onClick={() => {
          const newRequest = {
            id: `REQ-${Date.now().toString().slice(-4)}`,
            title: `${values['Request category']} - ${values['Request type']}`,
            type: 'Request',
            status: 'Submitted',
            priority: values.Urgency,
            owner: 'Central Support Queue',
            dueDate: values['Preferred due date'],
            source: 'Submit Request',
            risk: 'Low',
            lastUpdated: 'Just now',
            description: `${values.Description}. Expected outcome: ${values['Expected outcome']}.`,
            nextAction: 'Route request to the fulfilment owner queue.',
            category: values['Request category'],
            related: [values['Linked task/workflow/tracker'], values.Attachments].filter(Boolean),
            sla: 'On Track'
          };
          
          try {
            const localRequests = JSON.parse(localStorage.getItem('local_my_requests') || '[]');
            localStorage.setItem('local_my_requests', JSON.stringify([newRequest, ...localRequests]));
            window.dispatchEvent(new Event('local_requests_updated'));
          } catch (e) {
            console.error('Failed to save request to local storage', e);
          }
          
          onCreate(newRequest);
          toast.success('Request submitted successfully.');
        }}
        className="mt-6 rounded-button bg-primary px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
        Submit request
      </button>
    </section>
  );
}

function RecordsTable({ records, onOpen, onStatusChange }: { records: DwsRecord[]; onOpen: (record: DwsRecord) => void; onStatusChange: (record: DwsRecord) => void }) {
  return (
    <div className="overflow-hidden rounded-card border border-border-subtle">
      <table className="w-full text-left">
        <thead className="bg-surface text-xs font-bold uppercase tracking-wider text-text-muted">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Due Date</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Owner</th>
            <th className="px-4 py-3">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {records.map((record) => (
            <tr key={record.id} onClick={() => onOpen(record)} className="cursor-pointer hover:bg-surface">
              <td className="px-4 py-3"><div className="text-sm font-bold text-primary">{record.title}</div><div className="text-xs text-text-muted">{record.id} · {record.type}</div></td>
              <td className="px-4 py-3"><StatusPill status={record.status} /></td>
              <td className="px-4 py-3 text-sm text-text-secondary">{record.dueDate}</td>
              <td className="px-4 py-3"><StatusPill status={record.priority} /></td>
              <td className="px-4 py-3 text-sm font-semibold text-primary">{record.owner}</td>
              <td className="px-4 py-3">
                <button onClick={(event) => { event.stopPropagation(); onStatusChange(record); }} className="rounded-button border border-border-default px-3 py-1.5 text-xs font-bold text-primary hover:bg-white">Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrackerView({ view, records, onOpen }: { view: string; records: DwsRecord[]; onOpen: (record: DwsRecord) => void }) {
  if (view === 'Board View') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {['Pending', 'In Progress', 'On Track'].map((status) => (
          <div key={status} className="rounded-card border border-border-subtle bg-surface p-4">
            <h3 className="text-sm font-bold text-primary">{status}</h3>
            <div className="mt-3 space-y-3">
              {records.filter((record) => record.status === status || status === 'In Progress').slice(0, 3).map((record) => (
                <button key={record.id} onClick={() => onOpen(record)} className="w-full rounded-card border border-border-subtle bg-white p-3 text-left hover:border-border-default">
                  <div className="text-sm font-bold text-primary">{record.title}</div>
                  <div className="mt-2 text-xs text-text-muted">{record.owner} · {record.dueDate}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (view === 'Timeline View' || view === 'Calendar View') {
    return (
      <div className="space-y-3">
        {records.map((record) => (
          <button key={record.id} onClick={() => onOpen(record)} className="grid w-full grid-cols-[96px_1fr_120px] items-center gap-4 rounded-card border border-border-subtle bg-white p-4 text-left hover:bg-surface">
            <div className="text-sm font-bold text-primary">{record.dueDate}</div>
            <div><div className="font-bold text-primary">{record.title}</div><div className="text-xs text-text-muted">{record.source}</div></div>
            <StatusPill status={record.status} />
          </button>
        ))}
      </div>
    );
  }
  if (view === 'Dashboard View' || view === 'Owner / Workload View') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {records.map((record, index) => (
          <button key={record.id} onClick={() => onOpen(record)} className="rounded-card border border-border-subtle bg-white p-4 text-left hover:bg-surface">
            <div className="flex items-center justify-between gap-3">
              <div><div className="font-bold text-primary">{view === 'Owner / Workload View' ? record.owner : record.title}</div><div className="text-xs text-text-muted">{record.source}</div></div>
              <span className="text-2xl font-bold text-primary">{55 + index * 8}%</span>
            </div>
            <div className="mt-4 h-2 rounded-pill bg-navy-100"><div className="h-full rounded-pill bg-info" style={{ width: `${55 + index * 8}%` }} /></div>
          </button>
        ))}
      </div>
    );
  }
  return <RecordsTable records={records} onOpen={onOpen} onStatusChange={onOpen} />;
}

export function DwsSectionPage({ route }: { route: string }) {
  const { activeRole } = useWorkspaceRole();
  const navItem = getNavigationItem(route);
  const [records, setRecords] = useState<DwsRecord[]>(() => navItem ? buildRecords(navItem, activeRole) : []);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [tab, setTab] = useState('All');
  const [view, setView] = useState('Table View');
  const [drawerRecord, setDrawerRecord] = useState<DwsRecord | null>(null);
  const [modalTitle, setModalTitle] = useState<string | null>(null);

  React.useEffect(() => {
    if (navItem) setRecords(buildRecords(navItem, activeRole));
  }, [activeRole, navItem]);

  const filters = useMemo(() => ['All', ...Array.from(new Set(records.flatMap((record) => [record.status, record.type, record.priority]))).slice(0, 6)], [records]);
  const visibleRecords = records.filter((record) => {
    const matchesSearch = `${record.title} ${record.type} ${record.owner} ${record.source}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All' || record.status === filter || record.type === filter || record.priority === filter;
    const matchesTab = tab === 'All' || record.type.toLowerCase().includes(tab.slice(0, -1).toLowerCase()) || record.status.toLowerCase().includes(tab.toLowerCase());
    return matchesSearch && matchesFilter && (route === '/workspace/my-work' ? matchesTab : true);
  });

  if (!navItem) return null;

  const updateRecord = (record: DwsRecord) => {
    setRecords((current) => current.map((item) => item.id === record.id ? record : item));
    setDrawerRecord(record);
  };
  const addRecord = (record: DwsRecord) => setRecords((current) => [record, ...current]);
  const isTracker = navItem.section === 'trackers';
  const isReport = navItem.section === 'reports';
  const isCreateTask = route === '/tasks/create';
  const isSubmitRequest = route === '/services/submit-request';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface px-5 py-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{navItem.label}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{navItem.description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setModalTitle(isReport ? 'Export Report' : isTracker ? 'Create tracker item' : 'Create record')} className="inline-flex h-10 items-center gap-2 rounded-button bg-primary px-4 text-sm font-bold text-white shadow-sm"><Plus size={16} />{isReport ? 'Export Report' : 'New'}</button>
        </div>
      </header>

      <KpiStrip records={records} routeLabel={navItem.label} />

      {isCreateTask && <div className="mt-5"><CreateTaskForm onCreate={addRecord} /></div>}
      {isSubmitRequest && <div className="mt-5"><SubmitRequestForm onCreate={addRecord} /></div>}

      <section className="mt-5 rounded-card border border-border-subtle bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-64 flex-1 items-center gap-2 rounded-input border border-border-default bg-white px-3 py-2 text-sm text-text-muted">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${navItem.label.toLowerCase()}`} className="w-full bg-transparent outline-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((name) => <button key={name} onClick={() => setFilter(name)} className={`rounded-pill px-3 py-1.5 text-xs font-bold ${filter === name ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}>{name}</button>)}
          </div>
        </div>

        {route === '/workspace/my-work' && (
          <div className="mb-5 flex flex-wrap gap-3 border-b border-border-subtle">
            {myWorkTabs.map((name) => <button key={name} onClick={() => setTab(name)} className={`px-3 py-3 text-sm font-bold ${tab === name ? 'border-b-2 border-info text-info-text' : 'text-text-secondary hover:text-primary'}`}>{name}</button>)}
          </div>
        )}

        {isTracker && (
          <div className="mb-5 flex flex-wrap gap-2">
            {trackerViews.map((name) => {
              const Icon = name === 'Board View' ? Trello : name === 'Dashboard View' ? LayoutDashboard : name === 'Calendar View' ? CalendarDays : name === 'Owner / Workload View' ? Filter : ListChecks;
              return <button key={name} onClick={() => setView(name)} className={`inline-flex items-center gap-2 rounded-button px-3 py-2 text-xs font-bold ${view === name ? 'bg-primary text-white' : 'bg-surface text-text-secondary hover:text-primary'}`}><Icon size={14} />{name}</button>;
            })}
          </div>
        )}

        {isReport && (
          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {records.slice(0, 3).map((record, index) => (
              <button key={record.id} onClick={() => setDrawerRecord(record)} className="rounded-card border border-border-subtle bg-surface p-4 text-left hover:bg-navy-50">
                <div className="text-sm font-bold text-primary">{record.source}</div>
                <div className="mt-3 h-24 rounded-lg border border-border-subtle bg-white p-3">
                  <div className="flex h-full items-end gap-2">
                    {[42, 66, 54, 78, 62].map((height, barIndex) => <span key={barIndex} className="flex-1 rounded-t bg-info" style={{ height: `${Math.min(90, height + index * 4)}%` }} />)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {isTracker ? <TrackerView view={view} records={visibleRecords} onOpen={setDrawerRecord} /> : <RecordsTable records={visibleRecords} onOpen={setDrawerRecord} onStatusChange={(record) => updateRecord({ ...record, status: record.status === 'Completed' ? 'In Progress' : 'Completed' })} />}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">AI Insights</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {['Review overdue ownership before weekly governance.', 'Link evidence to high-priority records.', 'Route pending approvals to the active owner.', 'Generate a status summary for this view.'].map((insight) => (
              <button key={insight} onClick={() => setDrawerRecord(records[0])} className="rounded-card border border-border-subtle bg-surface p-4 text-left text-sm font-semibold text-primary hover:bg-navy-50">{insight}</button>
            ))}
          </div>
        </div>
        <div className="rounded-card border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-primary">Upcoming</h2>
          <div className="mt-4 space-y-3">
            {records.slice(0, 3).map((record) => (
              <button key={record.id} onClick={() => setDrawerRecord(record)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-surface">
                <CalendarDays size={17} className="text-text-muted" />
                <div><div className="text-sm font-bold text-primary">{record.title}</div><div className="text-xs text-text-muted">{record.dueDate}</div></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <DetailDrawer record={drawerRecord} onClose={() => setDrawerRecord(null)} onUpdate={updateRecord} />
      {modalTitle && <ActionModal title={modalTitle} onClose={() => setModalTitle(null)} onSave={(values) => {
        addRecord({
          id: `${navItem.section.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
          title: values.Title || values['Report name'] || values['Evidence title'] || 'DWS record',
          type: modalTitle,
          status: modalTitle.includes('Export') ? 'Ready' : 'Draft',
          priority: values.Priority || 'Medium',
          owner: values.Owner || activeRole,
          dueDate: values['Due date'] || '30 Jun 2026',
          source: navItem.label,
          risk: 'Low',
          lastUpdated: 'Just now',
          description: values.Description || values.Summary || 'Created from local prototype action.',
          nextAction: 'Review and publish the record.',
          related: [navItem.label]
        });
        toast.success(modalTitle.includes('Export') ? 'Report prepared for export.' : 'Record saved successfully.');
        setModalTitle(null);
      }} />}
    </div>
  );
}
