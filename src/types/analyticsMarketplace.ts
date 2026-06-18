export type AssetCategory = 'Personal' | 'Team' | 'Unit' | 'Enterprise';
export type AssetType = 'Dashboard' | 'Report' | 'View';

export interface AnalyticsAsset {
  id: string;
  slug: string;
  name: string;
  purpose: string;
  category: AssetCategory;
  owner: string;
  type: AssetType;
  dataScope: string;
  refreshRhythm: string;
  lastUpdated: string;
  roleAccess: string[];
}
