import {
  getProductEndpoint,
  getProductDetailsEndpoint,
  getProductsIdsEndpoint,
} from "../endpoints";
import { SearchResult } from "@shopware-pwa/commons/interfaces/response/SearchResult";
import { Product } from "@shopware-pwa/commons/interfaces/models/content/product/Product";
import { convertSearchCriteria } from "../helpers/searchConverter";
import { apiService } from "../apiService";
import { SearchCriteria } from "@shopware-pwa/commons/interfaces/search/SearchCriteria";

/**
 * Get default amount of products' ids
 *
 * @throws ClientApiError
 * @alpha
 */
export const getProductsIds = async function (): Promise<SearchResult<
  string[]
>> {
  const resp = await apiService.post(getProductsIdsEndpoint());
  return resp.data;
};

/**
 * Get default amount of products
 *
 * @throws ClientApiError
 * @alpha
 */
export const getProducts = async function (
  searchCriteria?: SearchCriteria
): Promise<SearchResult<Product[]>> {
  const resp = await apiService.post(
    `${getProductEndpoint()}`,
    convertSearchCriteria(searchCriteria)
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
  params: any = null
): Promise<Product> {
  const resp = await apiService.get(getProductDetailsEndpoint(productId), {
    params,
  });
  return resp.data.data;
}
