import React from "react";
import { ProductIdentity } from "./ProductIdentity";
import { DiscoverySearchCommand } from "./DiscoverySearchCommand";
import { NotificationBell } from "./NotificationBell";
import { RoleSelector } from "./RoleSelector";
import { UserMenu } from "./UserMenu";
export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border-subtle z-[100] flex items-center justify-between px-6">
      <div className="flex shrink-0 items-center gap-8">
        <ProductIdentity />
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <DiscoverySearchCommand />
        <RoleSelector />
        <div className="mx-1 h-8 w-px bg-border-subtle" />
        <NotificationBell />

        <UserMenu />
      </div>
    </header>
  );
}
