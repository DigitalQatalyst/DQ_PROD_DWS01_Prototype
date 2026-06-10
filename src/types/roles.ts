/**
 * DWS Role Type System
 * 
 * Defines the canonical role model for role-based navigation and access control.
 */

export type DwsRole =
  | "Associate"
  | "Lead"
  | "ServiceOwner"
  | "GovernanceLead"
  | "Leadership"
  | "PlatformAdmin";

/**
 * All available roles in the system
 */
export const ALL_ROLES: DwsRole[] = [
  "Associate",
  "Lead",
  "ServiceOwner",
  "GovernanceLead",
  "Leadership",
  "PlatformAdmin",
];

/**
 * Normalize legacy role names to canonical DWS roles
 */
export function normalizeRole(role: string): DwsRole {
  // Map legacy WorkspaceRole names to DwsRole
  switch (role) {
    case "Admin":
      return "PlatformAdmin";
    case "Scrum Master":
    case "Team / Squad Lead":
    case "Unit Lead":
      return "Lead";
    case "HRA":
    case "Support":
      return "GovernanceLead";
    case "CEO":
      return "Leadership";
    case "Associate":
    default:
      return "Associate";
  }
}

/**
 * Get the default route for a given role
 */
export const defaultRouteByRole: Record<DwsRole, string> = {
  Associate: "/tasks/my-work/assigned-tasks",
  Lead: "/dashboard",
  ServiceOwner: "/services/fulfilment-queues/assigned-requests",
  GovernanceLead: "/governance/governance-review/governance-review-workspace",
  Leadership: "/analytics/execution-analytics/execution-overview",
  PlatformAdmin: "/administration/user-role-management/user-directory",
};

/**
 * Get the default route for a role, with fallback to /dashboard if route doesn't exist
 */
export function getDefaultRouteForRole(role: DwsRole): string {
  return defaultRouteByRole[role] || "/dashboard";
}
