import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePersona } from "../context/PersonaContext";
import { TrackerMarketplaceCard } from "../components/TrackerMarketplaceCard";
import { MarketplaceCatalogLayout } from "../components/marketplace/MarketplaceCatalogLayout";
import type { FilterGroup } from "../components/MarketplaceFilterPanel";
import {
  buildCatalogTrail,
  resolveMarketplaceStage,
} from "../utils/marketplaceBreadcrumbs";
import { ALL_TAB_ID, buildCatalogTabs } from "../utils/marketplaceCatalogTabs";
import {
  TRACKER_TEMPLATES,
  TRACKER_CATEGORIES,
  type TrackerTemplate,
} from "../mocks/trackerMarketplace.mock";

export function TrackerMarketplacePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activePersona } = usePersona();
  const stage = resolveMarketplaceStage(searchParams.get("from"), "drive");

  const [activeTab, setActiveTab] = useState(ALL_TAB_ID);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>(
    {},
  );
  const [recommendedActive, setRecommendedActive] = useState(false);

  const filterGroups: FilterGroup[] = [
    {
      id: "category",
      label: "Category",
      options: TRACKER_CATEGORIES.map((category) => ({
        value: category.id,
        label: category.label,
      })),
    },
    {
      id: "health",
      label: "Health Status",
      options: [
        { value: "green", label: "Healthy" },
        { value: "amber", label: "Needs Attention" },
        { value: "red", label: "Critical" },
      ],
    },
    {
      id: "activity",
      label: "Activity Level",
      options: [
        { value: "high", label: "High (10+ active)" },
        { value: "medium", label: "Medium (5-9 active)" },
        { value: "low", label: "Low (1-4 active)" },
      ],
    },
  ];

  const categoryTabs = useMemo(
    () =>
      buildCatalogTabs(
        TRACKER_TEMPLATES,
        TRACKER_CATEGORIES,
        (tracker) => tracker.category,
      ),
    [],
  );

  const handleFilterChange = (groupId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [groupId]: values }));
  };

  const handleClearAll = () => {
    setFilterValues({});
    setSearch("");
    setRecommendedActive(false);
    setActiveTab(ALL_TAB_ID);
  };

  const getRecentlyUsed = (): string[] => {
    try {
      const recent = JSON.parse(localStorage.getItem("recentTrackers") || "[]");
      return recent;
    } catch {
      return [];
    }
  };

  const recentlyUsedSlugs = getRecentlyUsed();

  const filteredTrackers = TRACKER_TEMPLATES.filter((tracker) => {
    const matchesTab =
      activeTab === ALL_TAB_ID || tracker.category === activeTab;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      tracker.name.toLowerCase().includes(query) ||
      tracker.shortPurpose.toLowerCase().includes(query) ||
      tracker.category.toLowerCase().includes(query) ||
      tracker.owner.toLowerCase().includes(query) ||
      tracker.id.toLowerCase().includes(query);

    const matchesCategory =
      !filterValues.category?.length ||
      filterValues.category.includes(tracker.category);

    const matchesHealth =
      !filterValues.health?.length ||
      filterValues.health.includes(tracker.health);

    let matchesActivity = true;
    if (filterValues.activity?.length) {
      if (filterValues.activity.includes("high") && tracker.activeCount < 10) {
        matchesActivity = false;
      }
      if (
        filterValues.activity.includes("medium") &&
        (tracker.activeCount < 5 || tracker.activeCount >= 10)
      ) {
        matchesActivity = false;
      }
      if (
        filterValues.activity.includes("low") &&
        (tracker.activeCount < 1 || tracker.activeCount >= 5)
      ) {
        matchesActivity = false;
      }
    }

    const matchesRecommended =
      !recommendedActive ||
      tracker.health === "green" ||
      recentlyUsedSlugs.includes(tracker.slug);

    return (
      matchesTab &&
      matchesSearch &&
      matchesCategory &&
      matchesHealth &&
      matchesActivity &&
      matchesRecommended
    );
  }).sort((a, b) => {
    if (!recommendedActive) return 0;
    const aRec = recentlyUsedSlugs.includes(a.slug) || a.health === "green";
    const bRec = recentlyUsedSlugs.includes(b.slug) || b.health === "green";
    if (aRec && !bRec) return -1;
    if (!aRec && bRec) return 1;
    return 0;
  });

  const recentTrackers = TRACKER_TEMPLATES.filter((t) =>
    recentlyUsedSlugs.includes(t.slug),
  );

  const handlePreview = (tracker: TrackerTemplate) => {
    navigate(`/marketplace/drive/tracker-marketplace/${tracker.slug}`);
  };

  return (
    <MarketplaceCatalogLayout
      breadcrumbItems={buildCatalogTrail(stage, "Tracker Marketplace")}
      title="Discover available trackers, monitoring views, and governed tracking templates used across DWS."
      lede="Browse trackers organised by category — workload, backlog, project health, strategic initiatives, governance, actions, and risk. Preview tracker details before opening the tracker workspace."
      searchPlaceholder="Search trackers by name, purpose, category, owner, or ID…"
      search={search}
      onSearchChange={setSearch}
      itemLabel="trackers"
      totalCount={TRACKER_TEMPLATES.length}
      visibleCount={filteredTrackers.length}
      tabs={categoryTabs}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      filterHelperText="Refine by category, health status, and activity level."
      filterGroups={filterGroups}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      onClearAll={handleClearAll}
      recommendedActive={recommendedActive}
      onRecommendedChange={setRecommendedActive}
      showEmpty={filteredTrackers.length === 0}
      emptyTitle="No trackers match your filters"
      emptyMessage="Try adjusting your search or filters, or clear all filters to see all available trackers."
    >
      <div className="space-y-8">
        {recentTrackers.length > 0 && !search && activeTab === ALL_TAB_ID && (
          <section>
            <h2 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              Recently Used
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recentTrackers.slice(0, 3).map((tracker) => (
                <TrackerMarketplaceCard
                  key={tracker.id}
                  tracker={tracker}
                  onClick={() => handlePreview(tracker)}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          {recentTrackers.length > 0 && !search && activeTab === ALL_TAB_ID && (
            <h2 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              All Trackers
            </h2>
          )}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTrackers.map((tracker) => (
              <TrackerMarketplaceCard
                key={tracker.id}
                tracker={tracker}
                onClick={() => handlePreview(tracker)}
              />
            ))}
          </div>
        </section>
      </div>
    </MarketplaceCatalogLayout>
  );
}
