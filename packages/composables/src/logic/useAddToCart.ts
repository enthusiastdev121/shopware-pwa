import { ref, Ref, computed } from "@vue/composition-api";
import { Product } from "@shopware-pwa/commons/interfaces/models/content/product/Product";
import { useCart } from "@shopware-pwa/composables";
import { ClientApiError } from "@shopware-pwa/commons/interfaces/errors/ApiError";

/**
 * @alpha
 */
export interface UseAddToCart {
  addToCart: () => Promise<void>;
  quantity: Ref<number>;
  loading: Ref<boolean>;
  error: Ref<any>;
  getStock: Ref<number | null>;
  isInCart: Ref<boolean>;
}

/**
 * @alpha
 */
export const useAddToCart = (product: Product): UseAddToCart => {
  const { addProduct, cartItems } = useCart();
  const quantity: Ref<number> = ref(1);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<any> = ref(null);

  const addToCart = async (): Promise<void> => {
    if (!product || !product.id) {
      error.value =
        "Product has to be passed as a composable argument and needs to have an id property.";
      return;
    }
    loading.value = true;
    error.value = null;
    if (!quantity.value) quantity.value = 1;
    try {
      await addProduct({ id: product.id, quantity: quantity.value });
      quantity.value = 1;
    } catch (e) {
      const err: ClientApiError = e;
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const getStock = computed(() => product && product.stock);

  const isInCart = computed((): boolean =>
    cartItems.value.some((item: any) => item.id === product.id)
  );

  return {
    addToCart,
    quantity,
    error,
    loading,
    getStock,
    isInCart,
  };
};
