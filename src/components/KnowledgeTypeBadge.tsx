import React from 'react';
import { KnowledgeAssetType } from '../types/knowledgeDiscovery';
import { BookOpen, FileText, CheckSquare, Settings, PlayCircle, Briefcase, Bookmark, Shield, Map } from 'lucide-react';

interface KnowledgeTypeBadgeProps {
  type: KnowledgeAssetType;
  size?: 'sm' | 'md';
}

export function KnowledgeTypeBadge({ type, size = 'sm' }: KnowledgeTypeBadgeProps) {
  let Icon = BookOpen;
  let bgClass = 'bg-surface';
  let textClass = 'text-text-secondary';

  switch (type) {
    case 'Guideline':
      Icon = Map;
      bgClass = 'bg-blue-50';
      textClass = 'text-blue-700';
      break;
    case 'Operating Standard':
      Icon = Settings;
      bgClass = 'bg-indigo-50';
      textClass = 'text-indigo-700';
      break;
    case 'Process Reference':
      Icon = FileText;
      bgClass = 'bg-slate-100';
      textClass = 'text-slate-700';
      break;
    case 'Evidence Standard':
      Icon = CheckSquare;
      bgClass = 'bg-green-50';
      textClass = 'text-green-700';
      break;
    case 'Playbook':
      Icon = PlayCircle;
      bgClass = 'bg-purple-50';
      textClass = 'text-purple-700';
      break;
    case 'Template':
      Icon = Briefcase;
      bgClass = 'bg-orange-50';
      textClass = 'text-orange-700';
      break;
    case 'GHC Reference':
      Icon = Shield;
      bgClass = 'bg-red-50';
      textClass = 'text-red-700';
      break;
    case '6xD Reference':
      Icon = Bookmark;
      bgClass = 'bg-cyan-50';
      textClass = 'text-cyan-700';
      break;
    case 'Workspace Guide':
    case 'Learning Reference':
      Icon = BookOpen;
      bgClass = 'bg-teal-50';
      textClass = 'text-teal-700';
      break;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  const iconSize = size === 'sm' ? 12 : 14;
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${bgClass} ${textClass} ${padding} font-semibold border border-current/10`}>
      <Icon size={iconSize} strokeWidth={2.5} />
      <span className={textSize}>{type}</span>
    </span>
  );
}
