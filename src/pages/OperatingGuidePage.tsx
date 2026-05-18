import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '../context/PersonaContext';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
export function OperatingGuidePage() {
  const {
    activePersona
  } = usePersona();
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>('task-ownership');
  const sections = [{
    id: 'task-ownership',
    title: 'Task Ownership',
    rule: 'Every task must have exactly one named owner.',
    why: 'Clear accountability prevents work from stalling and ensures someone is responsible for driving the task to closure.',
    example: 'A task to "Update Q3 Financials" is owned by Jane Doe, not the "Finance Team".'
  }, {
    id: 'updates',
    title: 'Updates',
    rule: 'Tasks in progress require regular progress updates.',
    why: 'Visibility into work progress reduces the need for status meetings and allows leads to identify risks early.',
    example: 'Adding a note: "Draft completed, waiting on final review from Legal before attaching evidence."'
  }, {
    id: 'blockers',
    title: 'Blockers',
    rule: 'Blocked work must be flagged immediately with a clear reason.',
    why: 'Flagging blockers triggers escalation workflows and notifies leads who can help unblock the work.',
    example: 'Changing status to Blocked and noting: "Missing access to production database."'
  }, {
    id: 'requests',
    title: 'Requests',
    rule: 'All service needs must go through the Service Catalogue.',
    why: 'Structured intake ensures requests are routed to the correct queue with the necessary information and SLA expectations.',
    example: 'Submitting an "IT & Access Request" instead of sending an email to the IT helpdesk.'
  }, {
    id: 'approvals',
    title: 'Approvals',
    rule: 'Approvals must be recorded within the platform.',
    why: 'Centralised approvals provide an immutable audit trail for governance and compliance.',
    example: 'Clicking "Approve" on a Task Closure Review rather than replying "Looks good" in a chat.'
  }, {
    id: 'evidence',
    title: 'Evidence',
    rule: 'Governed tasks require attached evidence before closure.',
    why: 'Evidence proves that the work was completed according to standards and provides artifacts for future audits.',
    example: 'Attaching the signed PDF contract before closing the "Finalise Vendor Agreement" task.'
  }, {
    id: 'closure-quality',
    title: 'Closure Quality',
    rule: 'Tasks must meet all checklist and evidence criteria to be closed.',
    why: 'Enforcing closure quality ensures that "done" actually means done, maintaining the integrity of the operating layer.',
    example: 'A task cannot be moved to Closed if the "Security Review" checklist item is unchecked.'
  }];
  return <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="text-sm font-medium text-text-muted mb-4">
          Stage 0 / Operating Guide
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">
          DWS.01 Operating Guide
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          This guide outlines the core principles and rules for working within
          the DWS.01 platform. Adhering to these rules ensures alignment with
          the Good Health Code and maintains execution quality.
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {sections.map((section) => {
        const isOpen = openSection === section.id;
        return <div key={section.id} className="border border-border-default rounded-card bg-white overflow-hidden shadow-sm">
              <button onClick={() => setOpenSection(isOpen ? null : section.id)} className="w-full flex items-center justify-between p-6 text-left hover:bg-surface transition-colors">
                <h3 className="text-lg font-semibold text-primary">
                  {section.title}
                </h3>
                {isOpen ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
              </button>

              {isOpen && <div className="p-6 pt-0 border-t border-border-subtle bg-surface/50">
                  <div className="space-y-6 mt-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                        The Rule
                      </h4>
                      <p className="text-sm font-medium text-primary">
                        {section.rule}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                        Why it matters
                      </h4>
                      <p className="text-sm text-text-secondary">
                        {section.why}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded border border-border-subtle">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                        Example
                      </h4>
                      <p className="text-sm text-text-secondary italic">
                        {section.example}
                      </p>
                    </div>
                  </div>
                </div>}
            </div>;
      })}
      </div>

      <div className="flex justify-center border-t border-border-default pt-12">
        <button onClick={() => navigate(activePersona.defaultRoute)} className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-button font-semibold hover:bg-navy-800 transition-colors shadow-md text-lg">
          Start from my workspace
          <ArrowRight size={20} />
        </button>
      </div>
    </div>;
}