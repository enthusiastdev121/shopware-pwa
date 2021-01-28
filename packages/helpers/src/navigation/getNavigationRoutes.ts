import { NavigationElement as SwNavigationElement } from "@shopware-pwa/commons/interfaces/models/content/navigation/Navigation";

/**
 * @alpha
 */
export interface NavigationRoute {
  routeLabel: string;
  routePath: string;
}

/**
 * @alpha
 */
export function getNavigationRoutes(
  navigationElements: SwNavigationElement[]
): NavigationRoute[] {
  console.warn("navigationElements", navigationElements);
  return navigationElements.map(
    (element: {
      children: SwNavigationElement[] | null;
      translated: any;
      name: string;
      route: { path: string; resourceType: string };
    }) => ({
      routeLabel: element.translated?.name || element.name,
      routePath:
        element.route.path.charAt(0) !== "/"
          ? `/${element.route.path}`
          : element.route.path,
      children: element.children && getNavigationRoutes(element.children),
    })
  );
}
