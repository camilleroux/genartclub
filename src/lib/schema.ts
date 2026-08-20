import { absolute } from './url';

interface Step {
  name: string;
  /** Omitted on the page being read, which is always the last step. */
  path?: string;
}

/**
 * The trail from the home page down to the current one. The last step carries no
 * url on purpose: a breadcrumb that links to the page it sits on is read as one
 * level deeper than it is, and the visible "All artists" link is the trail.
 */
export function breadcrumbList(site: URL | undefined, trail: Step[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      ...(path ? { item: absolute(path, site) } : {}),
    })),
  };
}
