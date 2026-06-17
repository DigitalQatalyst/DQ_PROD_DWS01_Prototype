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
  return items
    .filter((item) => getFlagValue(item.flag))
    .map((item) => {
      const children = item.children
        ? filterNavigationByFlags(item.children)
        : undefined;

      return {
        ...item,
        children,
      };
    })
    .filter((item) => {
      if (item.route || item.path) return true;
      return Boolean(item.children && item.children.length > 0);
    });
}
