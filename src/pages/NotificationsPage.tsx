import React, { useEffect, useState } from 'react';
import { RolePageScaffold } from '../components/RolePageScaffold';
import { FilterBar } from '../components/FilterBar';
import { Bell, ShieldCheck, AlertTriangle, MessageSquare, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
const mockNotifications = [{
  id: 'NOT-1',
  type: 'Reminder',
  title: 'Missing Update on TSK-1004',
  time: '1 hour ago',
  read: false,
  icon: Bell,
  color: 'text-[#D97706]',
  bg: 'bg-[#FFFBEB]'
}, {
  id: 'NOT-2',
  type: 'Approval',
  title: 'Closure Review Requested for TSK-1003',
  time: '3 hours ago',
  read: false,
  icon: ShieldCheck,
  color: 'text-[#030F35]',
  bg: 'bg-[#F3F5FD]'
}, {
  id: 'NOT-3',
  type: 'Blocker',
  title: 'BLK-101 Escalated to you',
  time: '1 day ago',
  read: true,
  icon: AlertTriangle,
  color: 'text-[#DC2626]',
  bg: 'bg-[#FEF2F2]'
}, {
  id: 'NOT-4',
  type: 'Update',
  title: 'New comment on REQ-2001',
  time: '1 day ago',
  read: true,
  icon: MessageSquare,
  color: 'text-[#2563EB]',
  bg: 'bg-[#EFF6FF]'
}];
export function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  const handleAction = (action: string) => toast.success(`${action} simulated.`);
  if (loading) {
    return <div className="p-8 animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded w-full"></div>
      </div>;
  }
  const filtered = activeTab === 'All' ? mockNotifications : mockNotifications.filter((n) => activeTab === 'Unread' ? !n.read : true);
  return <RolePageScaffold eyebrow="My Daily Work" title="Notifications" purpose="Alerts, reminders, and required actions across your workspace." primaryAction={{
    label: 'Mark all read',
    onClick: () => handleAction('All marked read')
  }} filterRow={<FilterBar tabs={['All', 'Unread']} activeTab={activeTab} onTabChange={setActiveTab} />}>
      <div className="space-y-3">
        {filtered.map((notif) => {
        const Icon = notif.icon;
        return <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-[12px] border ${notif.read ? 'bg-white border-[#EEEFF6]' : 'bg-[#F3F5FD] border-[#D8D9E6]'} transition-colors cursor-pointer hover:border-[#030F35]/30`} onClick={() => handleAction('Notification opened')}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[#111118]">
                    {notif.title}
                  </span>
                  <span className="text-xs text-[#5F607F]">{notif.time}</span>
                </div>
                <span className="text-xs font-medium text-[#5F607F] uppercase tracking-wider">
                  {notif.type}
                </span>
              </div>
              {!notif.read && <div className="w-2.5 h-2.5 rounded-full bg-[#FB5535] mt-1.5" />}
            </div>;
      })}
      </div>
    </RolePageScaffold>;
}