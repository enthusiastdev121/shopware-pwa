import {
  getProductEndpoint,
  getProductDetailsEndpoint,
  getProductsIdsEndpoint,
  getProductListingEndpoint,
} from "../endpoints";
import { ProductListingResult } from "@shopware-pwa/commons/interfaces/response/ProductListingResult";
import { Product } from "@shopware-pwa/commons/interfaces/models/content/product/Product";
import { SearchCriteria } from "@shopware-pwa/commons/interfaces/search/SearchCriteria";
import { SearchResult } from "@shopware-pwa/commons/interfaces/response/SearchResult";
import { convertSearchCriteria, ApiType } from "../helpers/searchConverter";
import { defaultInstance, ShopwareApiInstance } from "../apiService";
import { deprecationWarning } from "@shopware-pwa/commons";

/**
 * Get default amount of products' ids
 *
 * @throws ClientApiError
 * @alpha
 */
export const getProductsIds = async function (
  options?: any,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<SearchResult<string[]>> {
  const resp = await contextInstance.invoke.post(getProductsIdsEndpoint());
  return resp.data;
};

/**
 * Get default amount of products
 *
 * @deprecated use {@link getCategoryProductsListing} method instead
 * @throws ClientApiError
 * @alpha
 */
export const getProducts = async function (
  searchCriteria?: SearchCriteria,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<SearchResult<Product[]>> {
  deprecationWarning({
    methodName: "getProducts",
    newMethodName: "getCategoryProductsListing",
    packageName: "shopware-6-client",
  });
  const resp = await contextInstance.invoke.post(
    `${getProductEndpoint()}`,
    convertSearchCriteria({ searchCriteria, config: contextInstance.config })
  );
  return resp.data;
};

/**
 * Get default amount of products and listing configuration for given category
 *
 * @throws ClientApiError
 * @alpha
 */
export const getCategoryProductsListing = async function (
  categoryId: string,
  searchCriteria?: SearchCriteria,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<ProductListingResult> {
  const resp = await contextInstance.invoke.post(
    `${getProductListingEndpoint(categoryId)}`,
    convertSearchCriteria({
      searchCriteria,
      apiType: ApiType.store,
      config: contextInstance.config,
    })
  );
  return resp.data;
};

/**
 * Get the product with passed productId
 *
 * @throws ClientApiError
 * @alpha
 */
export async function getProduct(
  productId: string,
  params: any = null,
  contextInstance: ShopwareApiInstance = defaultInstance
): Promise<Product> {
  const resp = await contextInstance.invoke.get(
    getProductDetailsEndpoint(productId),
    {
      params,
    }
  );
  return resp.data.data;
}
