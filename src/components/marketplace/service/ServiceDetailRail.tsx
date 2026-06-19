import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, Layers, Route, Shield, User } from 'lucide-react';
import type { Service, ServiceDetail } from '../../../types/serviceLifecycle';
import { getServiceComplianceLabel } from '../../../utils/serviceDetailContent';
import { formatServiceSla } from '../../../utils/formatServiceSla';
import { MY_REQUESTS_PATH } from '../../../utils/localMyRequests';
import {
  RailActionButton,
  RailMetaRow,
  RailSection,
} from '../shared/MarketplaceDetailRailPrimitives';

interface ServiceDetailRailProps {
  service: Service;
  detail: ServiceDetail;
  discoveryCatalog?: boolean;
}

export function ServiceDetailRail({
  service,
  detail,
  discoveryCatalog = false,
}: ServiceDetailRailProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const stage = searchParams.get('from') || 'deploy';
  const approvalLabel = getServiceComplianceLabel(service);

  return (
    <aside className="sticky top-24 w-full space-y-4">
      <RailSection title="Quick actions">
        <div className="space-y-2">
          <RailActionButton
            onClick={() =>
              navigate(`/requests/start/${service.id}?from=${stage}`)
            }
          >
            <Route size={14} className="shrink-0 text-text-muted" />
            {service.primaryActionLabel ?? 'Request Service'}
          </RailActionButton>
          <RailActionButton onClick={() => navigate(MY_REQUESTS_PATH)}>
            <Clock size={14} className="shrink-0 text-text-muted" />
            Track request status
          </RailActionButton>
        </div>
      </RailSection>

      <RailSection title="Service details">
        <div className="space-y-3">
          {service.domain && (
            <RailMetaRow icon={<Layers size={13} />} label="Domain" value={service.domain} />
          )}
          {service.submarketplace && (
            <RailMetaRow
              icon={<Layers size={13} />}
              label="Submarketplace"
              value={service.submarketplace}
            />
          )}
          <RailMetaRow icon={<User size={13} />} label="Owner" value={detail.owner} />
          <RailMetaRow icon={<Clock size={13} />} label="Response SLA" value={formatServiceSla(detail.sla)} />
          <RailMetaRow icon={<Shield size={13} />} label="Approval" value={approvalLabel} />
          {!discoveryCatalog && (
            <RailMetaRow
              icon={<Route size={13} />}
              label="Fulfilment queue"
              value={detail.queue}
            />
          )}
        </div>
      </RailSection>
    </aside>
  );
}
