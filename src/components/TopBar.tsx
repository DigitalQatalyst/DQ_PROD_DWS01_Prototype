import { ProductIdentity } from './ProductIdentity';
import { DiscoverySearchCommand } from './DiscoverySearchCommand';
import { NotificationBell } from './NotificationBell';
import { RoleSelector } from './RoleSelector';
import { UserIdentity } from './UserIdentity';
import { Bot, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DqIconButton } from './DqButton';
export function TopBar() {
  const navigate = useNavigate();
  return <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border-subtle z-[100] flex items-center justify-between px-6">
      <div className="flex shrink-0 items-center gap-8">
        <ProductIdentity />
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <DiscoverySearchCommand />
        <RoleSelector />
        <div className="mx-1 h-8 w-px bg-border-subtle" />
        <NotificationBell />
        <DqIconButton label="AI assistant" onClick={() => navigate('/ai-cockpit')} className="h-9 w-9 border-transparent">
          <Bot size={19} strokeWidth={1.5} />
        </DqIconButton>
        <DqIconButton label="Settings" onClick={() => toast.info('Platform settings are available to authorised administrators.')} className="h-9 w-9 border-transparent">
          <Settings size={19} strokeWidth={1.5} />
        </DqIconButton>
        <UserIdentity />
      </div>
    </header>;
}
