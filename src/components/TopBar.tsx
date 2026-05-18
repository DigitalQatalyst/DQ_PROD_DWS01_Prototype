import React from 'react';
import { ProductIdentity } from './ProductIdentity';
import { MarketplaceDropdown } from './MarketplaceDropdown';
import { DiscoverySearchCommand } from './DiscoverySearchCommand';
import { NotificationBell } from './NotificationBell';
import { PersonaSwitcher } from './PersonaSwitcher';
import { UserMenu } from './UserMenu';
import { ViewingModeSwitch } from './ViewingModeSwitch';
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
        <PersonaSwitcher />
        <ViewingModeSwitch />
        <UserMenu />
      </div>
    </header>;
}