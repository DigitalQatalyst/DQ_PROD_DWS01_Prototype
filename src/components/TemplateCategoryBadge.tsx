import React from 'react';
import { TaskTemplateCategoryType } from '../types/taskLibrary';
import { Users, CheckCircle, ShieldAlert, BadgeCheck, User, Lightbulb } from 'lucide-react';

interface TemplateCategoryBadgeProps {
  category: TaskTemplateCategoryType;
  size?: 'sm' | 'md';
}

export function TemplateCategoryBadge({ category, size = 'sm' }: TemplateCategoryBadgeProps) {
  let Icon = Users;
  let bgClass = 'bg-surface';
  let textClass = 'text-text-secondary';

  switch (category) {
    case 'Team Delivery':
      Icon = Users;
      bgClass = 'bg-blue-50';
      textClass = 'text-blue-700';
      break;
    case 'Review':
      Icon = CheckCircle;
      bgClass = 'bg-purple-50';
      textClass = 'text-purple-700';
      break;
    case 'Governance':
      Icon = ShieldAlert;
      bgClass = 'bg-red-50';
      textClass = 'text-red-700';
      break;
    case 'Closure Quality':
      Icon = BadgeCheck;
      bgClass = 'bg-green-50';
      textClass = 'text-green-700';
      break;
    case 'Personal Work':
      Icon = User;
      bgClass = 'bg-slate-100';
      textClass = 'text-slate-700';
      break;
    case 'Working Session':
      Icon = Lightbulb;
      bgClass = 'bg-amber-50';
      textClass = 'text-amber-700';
      break;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  const iconSize = size === 'sm' ? 12 : 14;
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${bgClass} ${textClass} ${padding} font-semibold border border-current/10`}>
      <Icon size={iconSize} strokeWidth={2.5} />
      <span className={textSize}>{category}</span>
    </span>
  );
}
