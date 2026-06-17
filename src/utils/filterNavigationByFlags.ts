import { launchFlags } from '../config/launchFlags';

export function getFlagValue(flagPath?: string): boolean {
  if (!flagPath) return true;

  return (
    flagPath.split('.').reduce<unknown>((current, key) => {
      if (current == null || typeof current !== 'object') return undefined;
      return (current as Record<string, unknown>)[key];
    }, launchFlags) === true
  );
}

export function filterNavigationByFlags<
  T extends { flag?: string; route?: string; path?: string; children?: T[] },
>(items: T[]): T[] {
  const visibleItems: T[] = [];

  for (const item of items) {
    if (!getFlagValue(item.flag)) continue;

    const hadChildren = Boolean(item.children);
    const children = item.children
      ? filterNavigationByFlags(item.children)
      : undefined;
    const hasVisibleChildren = Boolean(children && children.length > 0);

    if (hadChildren && !hasVisibleChildren && !item.path && !item.route) continue;
    if (!hadChildren && !item.path && !item.route) continue;

    visibleItems.push({
      ...item,
      children,
    });
  }

  return visibleItems;
}
