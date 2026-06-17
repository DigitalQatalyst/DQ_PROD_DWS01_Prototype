import React from "react";
import { MarketplaceCatalogCard } from "./marketplace/MarketplaceCatalogCard";
import type {
  TrackerTemplate,
  TrackerHealth,
} from "../mocks/trackerMarketplace.mock";

interface TrackerMarketplaceCardProps {
  tracker: TrackerTemplate;
  onClick: () => void;
}

export function TrackerMarketplaceCard({
  tracker,
  onClick,
}: TrackerMarketplaceCardProps) {
  const healthLabels: Record<TrackerHealth, string> = {
    green: "Healthy",
    amber: "Needs Attention",
    red: "Critical",
  };

  const healthLabel = healthLabels[tracker.health];
  const categoryCode = tracker.category.split(" ")[0].slice(0, 4).toUpperCase();

  return (
    <MarketplaceCatalogCard
      typeLabel={`${categoryCode} · Tracker`}
      metaLabel={`${tracker.owner} · ${tracker.activeCount} active · ${healthLabel}`}
      title={tracker.name}
      description={tracker.shortPurpose}
      footerId={tracker.id}
      badge={
        tracker.health === "red" ? (
          <span className="inline-flex items-center gap-1 rounded bg-red-100 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-red-700">
            Critical
          </span>
        ) : tracker.health === "amber" ? (
          <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-amber-700">
            Amber
          </span>
        ) : undefined
      }
      highlighted={tracker.health === "red"}
      disabled={false}
      onClick={onClick}
    />
  );
}
