const MAX_DISPLAY_DAYS = 5;

/** Compact SLA label for catalogue cards and detail chips (max 5 days shown). */
export function formatServiceSla(value: string | null | undefined): string {
  if (!value || value.trim() === '' || value === 'TBD') return 'TBD';

  const normalized = value.replace(/_/g, ' ');
  const match =
    normalized.match(/(\d+)\s*business\s*days?/i) ||
    normalized.match(/(\d+)\s*days?/i) ||
    normalized.match(/(\d+)/);

  if (!match) return normalized;

  const days = Math.min(parseInt(match[1], 10), MAX_DISPLAY_DAYS);
  return days === 1 ? '1 day' : `${days} days`;
}
