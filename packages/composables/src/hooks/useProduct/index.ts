import { ref, Ref } from "@vue/composition-api";
import { getProduct, getProductPage } from "@shopware-pwa/shopware-6-client";
import { Product } from "@shopware-pwa/commons/interfaces/models/content/product/Product";
import { ClientApiError } from "@shopware-pwa/commons/interfaces/errors/ApiError";
import { getApplicationContext } from "@shopware-pwa/composables";
import { ApplicationVueContext } from "../../appContext";
import { useDefaults } from "../../logic/useDefaults";
const NO_PRODUCT_REFERENCE_ERROR =
  "Associations cannot be loaded for undefined product";

/**
 * @alpha
 */
export interface UseProduct<PRODUCT, SEARCH> {
  product: Ref<PRODUCT>;
  search: SEARCH;
  loading: Ref<boolean>;
  error: Ref<any>;
  [x: string]: any;
}

/**
 * @alpha
 */
export type Search = (path: string, associations?: any) => any;

/**
 * @alpha
 */
export const useProduct = (
  rootContext: ApplicationVueContext,
  loadedProduct?: any
): UseProduct<Product, Search> => {
  const { apiInstance } = getApplicationContext(rootContext, "useProduct");
  const { getAssociationsConfig, getIncludesConfig } = useDefaults(
    rootContext,
    "useProduct"
  );

  const loading: Ref<boolean> = ref(false);
  const product: Ref<Product> = ref(loadedProduct);
  const error: Ref<any> = ref(null);

  const loadAssociations = async () => {
    if (!product || !product.value || !product.value.id) {
      throw NO_PRODUCT_REFERENCE_ERROR;
    }

    const searchCriteria = {
      configuration: {
        includes: getIncludesConfig(),
        associations: getAssociationsConfig(),
      },
    };

    // TODO: https://github.com/DivanteLtd/shopware-pwa/issues/911
    const urlPath = `detail/${product.value.parentId || product.value.id}`;
    const {
      product: { children },
    } = await getProductPage(urlPath, searchCriteria, apiInstance);

    // load only children; other properties are loaded synchronously
    product.value = Object.assign({}, product.value, {
      children,
    });
  };

  const search = async (productId: string) => {
    loading.value = true;
    try {
      const result = await getProduct(productId, null, apiInstance);
      product.value = result;
      return result;
    } catch (e) {
      const err: ClientApiError = e;
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    product,
    loading,
    search,
    error,
    loadAssociations,
  };
};
