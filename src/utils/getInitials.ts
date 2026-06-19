/**
 * Derives up to two uppercase initials from a display name. Parenthetical
 * suffixes (e.g. "(Dev Mock)") are ignored, and an email is used as a fallback.
 */
export function getInitials(name?: string | null, email?: string | null): string {
  const cleaned = (name ?? '').replace(/\(.*?\)/g, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return '?';
}
