import React from 'react';
import { RequestIntakeWizard } from './RequestIntakeWizard';
import { TaskFromTemplateWizard } from './TaskFromTemplateWizard';
import { KnowledgeActionPanel } from './KnowledgeActionPanel';
import { DirectoryRoutePanel } from './DirectoryRoutePanel';
import { DashboardAccessPanel } from './DashboardAccessPanel';
import { MarketplaceFeedbackFlow } from './MarketplaceFeedbackFlow';
export type MarketplaceType =
'service' |
'task-template' |
'knowledge' |
'work-directory' |
'analytics' |
'feedback';
interface MarketplaceActionRouterProps {
  marketplaceType: MarketplaceType | null;
  item: any;
  activePersona: any;
  onClose: () => void;
  // Additional handlers for nested flows
  onStartTaskFromGuide?: (guide: any) => void;
  onRequestUpdate?: (guide: any) => void;
  onRouteRequest?: (entity: any) => void;
  onAssignTask?: (entity: any) => void;
  onRequestAccess?: (dashboard: any) => void;
  isPermitted?: boolean;
}
export function MarketplaceActionRouter({
  marketplaceType,
  item,
  activePersona,
  onClose,
  onStartTaskFromGuide,
  onRequestUpdate,
  onRouteRequest,
  onAssignTask,
  onRequestAccess,
  isPermitted = false
}: MarketplaceActionRouterProps) {
  if (!marketplaceType) return null;
  switch (marketplaceType) {
    case 'service':
      return (
        <RequestIntakeWizard
          service={item}
          activePersona={activePersona}
          onClose={onClose} />);


    case 'task-template':
      return (
        <TaskFromTemplateWizard
          template={item}
          activePersona={activePersona}
          onClose={onClose} />);


    case 'knowledge':
      return (
        <KnowledgeActionPanel
          guide={item}
          activePersona={activePersona}
          onClose={onClose}
          onStartTaskFromGuide={onStartTaskFromGuide || (() => {})}
          onRequestUpdate={onRequestUpdate || (() => {})} />);


    case 'work-directory':
      return (
        <DirectoryRoutePanel
          entity={item}
          activePersona={activePersona}
          onClose={onClose}
          onRouteRequest={onRouteRequest || (() => {})}
          onAssignTask={onAssignTask || (() => {})} />);


    case 'analytics':
      return (
        <DashboardAccessPanel
          dashboard={item}
          activePersona={activePersona}
          isPermitted={isPermitted}
          onClose={onClose}
          onRequestAccess={onRequestAccess || (() => {})} />);


    case 'feedback':
      return (
        <MarketplaceFeedbackFlow
          activePersona={activePersona}
          onClose={onClose} />);


    default:
      return null;
  }
}