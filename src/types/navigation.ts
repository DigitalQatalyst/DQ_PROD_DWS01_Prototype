/**
 * Navigation Type System
 * 
 * Defines the type structure for role-based navigation items.
 */

import type { LucideIcon } from 'lucide-react';
import type { DwsRole } from './roles';

/**
 * Navigation item that supports hierarchical structure and role-based visibility
 */
export interface NavItem {
  id: string;
  label: string;
  route?: string;
  icon?: LucideIcon;
  children?: NavItem[];
  visibleTo?: DwsRole[];
  badge?: string;
  helper?: string;
}

/**
 * Feature Area - top-level navigation section (uppercase label, no icon)
 */
export interface FeatureAreaNav extends NavItem {
  children: FeatureGroupNav[];
}

/**
 * Feature Group - collapsible navigation group (icon + label + chevron)
 */
export interface FeatureGroupNav extends NavItem {
  icon: LucideIcon;
  children: FeatureNav[];
}

/**
 * Feature - leaf navigation item (text-only child link)
 */
export interface FeatureNav extends NavItem {
  route: string;
}
