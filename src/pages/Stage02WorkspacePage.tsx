import { useWorkspaceRole } from '../context/WorkspaceRoleContext';
import { QuickLinksPanel } from '../components/dashboard/QuickLinksPanel';
import {
  ActionSnapshotRow,
  DashboardHeader,
  NextBestActionsPanel,
  PriorityAlertsPanel,
  RecentActivityPanel,
} from '../components/dashboard/MyDashboardPanels';

function getFirstName(displayName: string) {
  return displayName.trim().split(/\s+/)[0] || 'there';
}

export function Stage02WorkspacePage() {
  const { activeSegment } = useWorkspaceRole();
  const firstName = getFirstName(activeSegment.profileName);

  return (
    <div className="px-5 py-7 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <DashboardHeader firstName={firstName} />
        <ActionSnapshotRow />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <NextBestActionsPanel />
          <PriorityAlertsPanel />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RecentActivityPanel />
          <QuickLinksPanel />
        </div>
      </div>
    </div>
  );
}
