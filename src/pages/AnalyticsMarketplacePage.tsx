import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePersona } from "../context/PersonaContext";
import { AnalyticsDashboardCard } from "../components/AnalyticsDashboardCard";
import { MarketplaceCatalogLayout } from "../components/marketplace/MarketplaceCatalogLayout";
import type { FilterGroup } from "../components/MarketplaceFilterPanel";
import { MarketplaceActionRouter } from "../components/MarketplaceActionRouter";
import { RequestIntakeWizard } from "../components/RequestIntakeWizard";
import {
  buildCatalogTrail,
  resolveMarketplaceStage,
} from "../utils/marketplaceBreadcrumbs";
import { ALL_TAB_ID, buildCatalogTabs } from "../utils/marketplaceCatalogTabs";

const DASHBOARD_CATEGORIES = [
  { id: "Marketplace", label: "Marketplace" },
  { id: "Personal", label: "Personal" },
  { id: "Team", label: "Team" },
  { id: "Unit", label: "Unit" },
  { id: "SLA", label: "SLA" },
  { id: "Governance", label: "Governance" },
  { id: "Executive", label: "Executive" },
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Marketplace:
    "Discovery and navigation for tracker and monitoring marketplaces.",
  Personal: "Individual performance, closure quality, and SLA adherence views.",
  Team: "Squad workload, flow health, blockers, and missing updates.",
  Unit: "Unit health, outcome tracking, and governance risk signals.",
  SLA: "Cross-platform SLA exposure, aging distribution, and breaches.",
  Governance: "Audit exceptions, policy compliance, and closure quality risks.",
  Executive: "Enterprise execution health, initiatives, and value delivery.",
};

const dashboards = [
  {
    id: "MKT-DRV-TRK",
    category: "Marketplace",
    title: "Tracker Marketplace",
    desc: "Discover available trackers, monitoring views, and governed tracking templates used across DWS.",
    route: "/marketplace/drive/tracker-marketplace",
    personas: [
      "Associate",
      "Scrum Master",
      "Team / Squad Lead",
      "Unit Lead",
      "HRA",
      "Admins",
      "Support",
      "CEO",
    ],
  },
  {
    id: "DB-1",
    category: "Personal",
    title: "My Performance Snapshot",
    desc: "Personal execution metrics, closure quality, and SLA adherence.",
    route: "/workspace/my-work",
    personas: ["Associate"],
  },
  {
    id: "DB-2",
    category: "Team",
    title: "Team Execution Dashboard",
    desc: "Team workload, flow health, blockers, and missing updates.",
    route: "/operations/team-execution",
    personas: ["Team / Squad Lead", "Scrum Master"],
  },
  {
    id: "DB-3",
    category: "Unit",
    title: "Unit Visibility Dashboard",
    desc: "Unit health, outcome tracking, and governance risks.",
    route: "/operations/unit-visibility",
    personas: ["Unit Lead"],
  },
  {
    id: "DB-4",
    category: "SLA",
    title: "SLA Dashboard",
    desc: "Cross-platform SLA exposure, aging distribution, and breaches.",
    route: "/intelligence/sla",
    personas: [
      "Scrum Master",
      "Team / Squad Lead",
      "Unit Lead",
      "HRA",
      "Admins",
      "Support",
      "CEO",
    ],
  },
  {
    id: "DB-5",
    category: "Governance",
    title: "Governance Dashboard",
    desc: "Audit exceptions, policy compliance, and closure quality risks.",
    route: "/executive/enterprise-execution",
    personas: ["CEO", "Admins"],
  },
  {
    id: "DB-6",
    category: "Executive",
    title: "CEO Enterprise Dashboard",
    desc: "Enterprise execution health, strategic initiatives, and value delivery.",
    route: "/executive/enterprise-execution",
    personas: ["CEO"],
  },
];

export function AnalyticsMarketplacePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activePersona, hasRouteAccess } = usePersona();
  const stage = resolveMarketplaceStage(searchParams.get("from"), "drive");

  const [activeTab, setActiveTab] = useState(ALL_TAB_ID);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>(
    {},
  );
  const [recommendedActive, setRecommendedActive] = useState(false);
  const [actionItem, setActionItem] = useState<{
    dashboard: (typeof dashboards)[number];
    isPermitted: boolean;
  } | null>(null);
  const [nestedAction, setNestedAction] = useState<{
    type: "request";
    dashboard: (typeof dashboards)[number];
  } | null>(null);

  const filterGroups: FilterGroup[] = [
    {
      id: "type",
      label: "Dashboard Type",
      options: DASHBOARD_CATEGORIES.map((category) => ({
        value: category.id,
        label: category.label,
      })),
    },
    {
      id: "permission",
      label: "Permission",
      options: [
        { value: "Available to my role", label: "Available to my role" },
        { value: "Restricted", label: "Restricted" },
        { value: "Requires approval", label: "Requires approval" },
      ],
    },
    {
      id: "scope",
      label: "Data Scope",
      options: [
        { value: "Personal", label: "Personal" },
        { value: "Team", label: "Team" },
        { value: "Unit", label: "Unit" },
        { value: "Enterprise", label: "Enterprise" },
      ],
    },
  ];

  const categoryTabs = useMemo(
    () =>
      buildCatalogTabs(
        dashboards,
        DASHBOARD_CATEGORIES,
        (dashboard) => dashboard.category,
      ),
    [],
  );

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [groupId]: values }));
    setFilterValues((prev) => ({ ...prev, [groupId]: values }));
  };


  const handleClearAll = () => {
    setFilterValues({});
    setSearch("");
    setRecommendedActive(false);
    setActiveTab(ALL_TAB_ID);
    setActiveTab(ALL_TAB_ID);
  };

  const filteredDashboards = dashboards
    .filter((dashboard) => {
      const matchesTab =
        activeTab === ALL_TAB_ID || dashboard.category === activeTab;
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        dashboard.title.toLowerCase().includes(query) ||
        dashboard.desc.toLowerCase().includes(query) ||
        dashboard.id.toLowerCase().includes(query);
      const matchesType =
        !filterValues.type?.length ||
        filterValues.type.includes(dashboard.category);

      let matchesPermission = true;
      if (filterValues.permission?.length) {
        const isPermitted = hasRouteAccess(dashboard.route, activePersona);
        if (
          filterValues.permission.includes("Available to my role") &&
          !isPermitted
        ) {
          matchesPermission = false;
        }
        if (filterValues.permission.includes("Restricted") && isPermitted) {
          matchesPermission = false;
        }
      }

      const matchesRecommended =
        !recommendedActive || dashboard.personas.includes(activePersona.role);

      return (
        matchesTab &&
        matchesSearch &&
        matchesType &&
        matchesPermission &&
        matchesRecommended
      );
    })
    .sort((a, b) => {
      if (!recommendedActive) return 0;
      const aRec = a.personas.includes(activePersona.role);
      const bRec = b.personas.includes(activePersona.role);
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;
      return 0;
    });


  return (
    <MarketplaceCatalogLayout
      breadcrumbItems={buildCatalogTrail(stage, "Analytics Discovery")}
      title="Governed discovery for dashboards, SLA views, and performance surfaces."
      lede="Organised through the DWS analytics taxonomy — personal, team, unit, SLA, governance, and executive views. Discovery layer only; access is governed by your active role and permission scope."
      searchPlaceholder="Search dashboards, metrics, reports, or visibility areas…"
      search={search}
      onSearchChange={setSearch}
      itemLabel="dashboards"
      totalCount={dashboards.length}
      visibleCount={filteredDashboards.length}
      tabs={categoryTabs}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      toneStrip={
        activeTab !== ALL_TAB_ID && CATEGORY_DESCRIPTIONS[activeTab]
          ? { code: activeTab, description: CATEGORY_DESCRIPTIONS[activeTab] }
          : null
      }
      filterHelperText="Refine by dashboard type, permission scope, and data visibility."
      filterGroups={filterGroups}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      onClearAll={handleClearAll}
      recommendedActive={recommendedActive}
      onRecommendedChange={setRecommendedActive}
      showEmpty={filteredDashboards.length === 0}
      emptyTitle="No dashboards match your filters"
      emptyMessage="Try adjusting your search or filters, or clear all filters to see all available dashboards."
      belowContent={
        <>
          <MarketplaceActionRouter
            marketplaceType={actionItem ? "analytics" : null}
            item={actionItem?.dashboard}
            activePersona={activePersona}
            isPermitted={actionItem?.isPermitted}
            onClose={() => setActionItem(null)}
            onRequestAccess={(dashboard) => {
              setActionItem(null);
              setNestedAction({ type: "request", dashboard });
            }}
          />
          {nestedAction?.type === "request" && (
            <RequestIntakeWizard
              service={{
                title: "Dashboard Access Request",
                category: "IT & Access Requests",
                ownerType: "Platform Admin",
              }}
              activePersona={activePersona}
              onClose={() => setNestedAction(null)}
              preFilledContext={{
                justification: `Requesting access to ${nestedAction.dashboard.title}`,
              }}
            />
          )}
        </>
      }
    >
      <div className="mb-6 flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
        <div>
          <p className="text-[13px] font-semibold text-orange-800">
            New: Analytics Marketplace
          </p>
          <p className="text-[12px] text-orange-700">
            Discover governed dashboards, reports, and views with preview.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/marketplace/drive/analytics-marketplace")}
          className="shrink-0 rounded-lg bg-orange-600 px-4 py-1.5 text-[12px] font-semibold text-white transition hover:bg-orange-700"
        >
          Explore
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredDashboards.map((dashboard) => {
          const isPermitted = hasRouteAccess(dashboard.route, activePersona);
          return (
            <AnalyticsDashboardCard
              key={dashboard.id}
              id={dashboard.id}
              category={dashboard.category}
              title={dashboard.title}
              description={dashboard.desc}
              isPermitted={isPermitted}
              onClick={() => setActionItem({ dashboard, isPermitted })}
            />
          );
        })}
      </div>
    </MarketplaceCatalogLayout>
  );
}
