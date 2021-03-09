import { Category } from "@shopware-pwa/commons/interfaces/models/content/category/Category";
import { getCategoryEndpoint, getCategoryDetailsEndpoint } from "../endpoints";
import { convertSearchCriteria } from "../helpers/searchConverter";
import { SearchResult } from "@shopware-pwa/commons/interfaces/response/SearchResult";
import { defaultInstance, ShopwareApiInstance } from "../apiService";
import { SearchCriteria } from "@shopware-pwa/commons/interfaces/search/SearchCriteria";
import { deprecationWarning } from "@shopware-pwa/commons";

/**
 * @deprecated use {@link getStoreNavigation} method instead
 * @throws ClientApiError
 * @alpha
 */
export async function getCategories(
  searchCriteria?: SearchCriteria,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<SearchResult<Category[]>> {
  deprecationWarning({
    methodName: "getCategories",
    newMethodName: "getNavigation",
    packageName: "shopware-6-client",
  });
  const resp = await contextInstance.invoke.post(
    getCategoryEndpoint(),
    convertSearchCriteria({ searchCriteria, config: contextInstance.config })
  );

  return resp.data;
}

/**
 * @throws ClientApiError
 * @alpha
 */
export async function getCategory(
  categoryId: string,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<Category> {
  const resp = await contextInstance.invoke.get(
    getCategoryDetailsEndpoint(categoryId)
  );

  return resp.data.data;
}
