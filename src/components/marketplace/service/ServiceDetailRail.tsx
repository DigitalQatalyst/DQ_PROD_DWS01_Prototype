import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  Flag,
  ListTree,
  RefreshCcw,
  Route,
  ShieldAlert,
  User,
} from 'lucide-react';
import type { Service, ServiceDetail } from '../../../types/serviceLifecycle';
import { getServiceComplianceLabel } from '../../../utils/serviceDetailContent';
import {
  RailActionButton,
  RailMetaRow,
  RailSection,
} from '../shared/MarketplaceDetailRailPrimitives';

interface ServiceDetailRailProps {
  service: Service;
  detail: ServiceDetail;
}

export function ServiceDetailRail({ service, detail }: ServiceDetailRailProps) {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      <aside className="sticky top-24 w-full space-y-5">
        <RailSection title="Use in Work">
          <div className="space-y-2">
            <RailActionButton onClick={() => showToast('Required inputs preview opened.')}>
              <FileText size={14} className="shrink-0 text-gray-500" />
              Preview Required Inputs
            </RailActionButton>
            <RailActionButton onClick={() => navigate('/requests/status')}>
              <Route size={14} className="shrink-0 text-gray-500" />
              Track Request Status
            </RailActionButton>
            <RailActionButton onClick={() => showToast('Fulfilment path opened.')}>
              <ClipboardList size={14} className="shrink-0 text-gray-500" />
              View Fulfilment Path
            </RailActionButton>
          </div>
        </RailSection>

        <RailSection title="Governance Actions">
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => showToast('Service update request submitted to the service owner.')}
              className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
            >
              <RefreshCcw size={13} className="shrink-0 text-gray-400" />
              Request Service Update
            </button>
            <button
              type="button"
              onClick={() => showToast('Routing issue flagged for service owner review.')}
              className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-xs font-medium text-error transition hover:bg-error/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
            >
              <Flag size={13} className="shrink-0" />
              Report Incorrect Routing
            </button>
          </div>
        </RailSection>

        <RailSection title="Governance & Details">
          <div className="space-y-3">
            <RailMetaRow icon={<User size={13} />} label="Owner" value={detail.owner} />
            <RailMetaRow icon={<ListTree size={13} />} label="Fulfilment queue" value={detail.queue} />
            <RailMetaRow icon={<Clock size={13} />} label="Response SLA" value={detail.sla} />
            <RailMetaRow icon={<Calendar size={13} />} label="Approval" value={detail.approval} />
            <RailMetaRow
              icon={<ShieldAlert size={13} />}
              label="Escalation"
              value={detail.escalationTrigger}
            />
            <RailMetaRow
              icon={<ClipboardList size={13} />}
              label="Compliance"
              value={getServiceComplianceLabel(service)}
            />
          </div>
        </RailSection>
      </aside>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[500] max-w-sm rounded-lg border border-gray-200 bg-white p-3 text-xs font-medium text-dq-navy shadow-dq-hover">
          {toast}
        </div>
      )}
    </>
  );
}
