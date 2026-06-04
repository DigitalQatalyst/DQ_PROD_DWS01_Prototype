import React from 'react';
import { REQUESTS_CONSOLE_TABS, type RequestsConsoleTab } from '../../types/requestsConsole';

interface RequestsConsoleTabsProps {
  activeTab: RequestsConsoleTab;
  onTabChange: (tab: RequestsConsoleTab) => void;
}

export function RequestsConsoleTabs({ activeTab, onTabChange }: RequestsConsoleTabsProps) {
  return (
    <div className="flex overflow-x-auto hide-scrollbar border-b border-border-default mb-4" role="tablist">
      {REQUESTS_CONSOLE_TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              isActive
                ? 'border-secondary text-primary'
                : 'border-transparent text-text-muted hover:text-primary hover:border-border-strong'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
