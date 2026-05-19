import React from 'react';
import { ProductIdentity } from './ProductIdentity';
import { MarketplaceDropdown } from './MarketplaceDropdown';
import { DiscoverySearchCommand } from './DiscoverySearchCommand';
import { NotificationBell } from './NotificationBell';
import { UserMenu } from './UserMenu';
import { ViewingModeSwitch } from './ViewingModeSwitch';
import { HelpCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
export function TopBar() {
  return <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border-subtle z-[100] flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <ProductIdentity />
        <MarketplaceDropdown />
      </div>

      <div className="flex items-center gap-3">
        <DiscoverySearchCommand />
        <div className="w-px h-8 bg-border-subtle mx-1" />
        <NotificationBell />
        <button onClick={() => toast.info('Messages panel opened for workspace conversations.')} aria-label="Messages" className="relative flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-surface transition-colors">
          <MessageSquare size={19} strokeWidth={1.7} />
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-pill bg-info px-1 text-[10px] font-bold text-white">3</span>
        </button>
        <button onClick={() => toast.info('Help and support options opened.')} aria-label="Help" className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-surface transition-colors">
          <HelpCircle size={19} strokeWidth={1.7} />
        </button>
        <ViewingModeSwitch />
        <UserMenu />
      </div>
    </header>;
}
