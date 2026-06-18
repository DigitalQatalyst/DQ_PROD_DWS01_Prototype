import { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
interface NotificationBellProps {
  count?: number;
  urgentCount?: number;
}
export function NotificationBell({
  count = 4
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localCount, setLocalCount] = useState(count);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleMarkAllRead = () => {
    setLocalCount(0);
    setIsOpen(false);
  };
  return <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} aria-label="Notifications" className="relative p-2 rounded-button hover:bg-surface transition-colors text-primary focus:outline-none focus:ring-4 focus:ring-primary/10">
        <Bell size={20} strokeWidth={1.5} />
        {localCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary" />}
      </button>

      {isOpen && <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-card shadow-xl border border-border-default overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <h3 className="font-semibold text-primary">Notifications</h3>
            {localCount > 0 && <button onClick={handleMarkAllRead} className="text-xs text-secondary hover:underline">
                Mark all read
              </button>}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {localCount > 0 ? <div className="divide-y divide-border-subtle">
                <div className="p-4 hover:bg-surface cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-danger shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-primary">
                        TSK-1004 breached SLA
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Governance dashboard copy is overdue.
                      </p>
                      <p className="text-xs text-text-disabled mt-2">
                        10 mins ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-surface cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-warning shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-primary">
                        REQ-2001 pending information
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Brian Otieno requested more details.
                      </p>
                      <p className="text-xs text-text-disabled mt-2">
                        1 hour ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-surface cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-primary">
                        APR-3001 awaiting review
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Task closure review requested by David Mwangi.
                      </p>
                      <p className="text-xs text-text-disabled mt-2">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                </div>
              </div> : <div className="p-8 text-center text-text-muted text-sm">
                No new notifications
              </div>}
          </div>
        </div>}
    </div>;
}
