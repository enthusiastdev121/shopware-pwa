import { StoreNavigationElement } from "@shopware-pwa/commons/interfaces/models/content/navigation/Navigation";

/**
 * @beta
 */
export interface StoreNavigationRoute {
  routeLabel: string;
  routePath: string;
  isExternal: boolean;
  children?: StoreNavigationRoute[] | null;
}

/**
 * @beta
 */
export function getStoreNavigationRoutes(
  navigationElements: StoreNavigationElement[]
): StoreNavigationRoute[] {
  return navigationElements.map((element: StoreNavigationElement) => ({
    routeLabel: element.name,
    isExternal: !!element.externalLink,
    routePath:
      element.externalLink ||
      (element.seoUrls?.[0]?.seoPathInfo &&
        `/${element.seoUrls[0].seoPathInfo}`),
    children: element.children && getStoreNavigationRoutes(element.children),
  }));
}
