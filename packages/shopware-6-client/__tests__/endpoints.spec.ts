import {
  getProductEndpoint,
  getProductDetailsEndpoint,
  getCategoryEndpoint,
  getCategoryDetailsEndpoint,
  getCustomerAddressEndpoint,
  getCustomerAddressDetailsEndpoint,
  getCustomerAddressSetDefaultShippingEndpoint,
  getCustomerAddressSetDefaultBillingEndpoint,
  getCustomerEndpoint,
  getCustomerDetailsEndpoint,
  getCustomerLoginEndpoint,
  getCustomerLogoutEndpoint,
  getCustomerOrderEndpoint,
  getCheckoutCartEndpoint,
  getCheckoutCartProductEndpoint,
  getCheckoutCartLineItemEndpoint,
  getCheckoutOrderEndpoint,
  getCheckoutGuestOrderEndpoint,
  getCheckoutGuestOrderDetailsEndpoint,
  getCheckoutOrderPayEndpoint,
  getContextCurrencyEndpoint,
  getContextLanguageEndpoint,
  getContextCountryEndpoint,
  getContextPaymentMethodEndpoint,
  getContextShippingMethodEndpoint,
  getContextSalutationEndpoint,
  getNewsletterSubscribeEndpoint,
  getNewsletterUnsubscribeEndpoint,
  getProductsIdsEndpoint,
  getNavigationEndpoint,
  getCustomerOrderDetailsEndpoint,
  getContextCountryItemEndpoint,
  getContextSalutationItemEndpoint,
} from "../src/endpoints";

const sampleProductId = "eea0f69ec02d44f7a4224272b3d99478";
const sampleCategoryId = "03dfd5badd3d43bd8a345ef660761e09";
const sampleAddressId = "324af469318f46b68e0fe69d77ef15fb";
const sampleCustomerId = "8b67c1fbb718487db750651430023298";
const sampleLineItemId = "042df8812942487bb52c9fc1e5b26e20";
const sampleOrderId = "27356105cf9b4484b96143881c37bbcb";
const sampleCountryId = "27356105cf9b4484b96143881c37bbcb";
const sampleSalutationId = "27356105cf9b4484b96143881c37bbcb";

describe("endpoints", () => {
  describe("getProductEndpoint", () => {
    it("should return Shopware product endpoint", async () => {
      const result = getProductEndpoint();
      expect(result).toEqual("/product");
    });
  });

  describe("getProductDetailsEndpoint", () => {
    it("should return Shopware product details endpoint", async () => {
      const result = getProductDetailsEndpoint(sampleProductId);
      expect(result).toEqual("/product/" + sampleProductId);
    });
  });

  describe("getProductsIdsEndpoint", () => {
    it("should return Shopware product details endpoint", async () => {
      const result = getProductsIdsEndpoint();
      expect(result).toEqual("/search-ids/product");
    });
  });

  describe("getCategoryEndpoint", () => {
    it("should return Shopware category endpoint", async () => {
      const result = getCategoryEndpoint();
      expect(result).toEqual("/category");
    });
  });

  describe("getCategoryDetailsEndpoint", () => {
    it("should return Shopware category details endpoint", async () => {
      const result = getCategoryDetailsEndpoint(sampleCategoryId);
      expect(result).toEqual("/category/" + sampleCategoryId);
    });
  });

  describe("getCustomerAddressEndpoint", () => {
    it("should return Shopware address endpoint", async () => {
      const result = getCustomerAddressEndpoint();
      expect(result).toEqual("/customer/address");
    });
  });

  describe("getCustomerAddressDetailsEndpoint", () => {
    it("should return Shopware address details endpoint", async () => {
      const result = getCustomerAddressDetailsEndpoint(sampleAddressId);
      expect(result).toEqual("/customer/address/" + sampleAddressId);
    });
  });

  describe("getCustomerAddressSetDefaultShippingEndpoint", () => {
    it("should return Shopware set default shipping address endpoint", async () => {
      const result = getCustomerAddressSetDefaultShippingEndpoint(
        sampleAddressId
      );
      expect(result).toEqual(
        "/customer/address/" + sampleAddressId + "/default-shipping"
      );
    });
  });

  describe("getCustomerAddressSetDefaultBillingEndpoint", () => {
    it("should return Shopware set default billing address endpoint", async () => {
      const result = getCustomerAddressSetDefaultBillingEndpoint(
        sampleAddressId
      );
      expect(result).toEqual(
        "/customer/address/" + sampleAddressId + "/default-billing"
      );
    });
  });

  describe("getCustomerEndpoint", () => {
    it("should return Shopware customer endpoint", async () => {
      const result = getCustomerEndpoint();
      expect(result).toEqual("/customer");
    });
  });

  describe("getCustomerDetailsEndpoint", () => {
    it("should return Shopware customer details endpoint", async () => {
      const result = getCustomerDetailsEndpoint(sampleCustomerId);
      expect(result).toEqual("/customer/" + sampleCustomerId);
    });
  });

  describe("getCustomerLoginEndpoint", () => {
    it("should return Shopware customer login endpoint", async () => {
      const result = getCustomerLoginEndpoint();
      expect(result).toEqual("/customer/login");
    });
  });

  describe("getCustomerLogoutEndpoint", () => {
    it("should return Shopware customer logout endpoint", async () => {
      const result = getCustomerLogoutEndpoint();
      expect(result).toEqual("/customer/logout");
    });
  });

  describe("getCustomerOrderEndpoint", () => {
    it("should return Shopware customer order endpoint", async () => {
      const result = getCustomerOrderEndpoint();
      expect(result).toEqual("/customer/order");
    });
  });

  describe("getCustomerOrderDetailsEndpoint", () => {
    it("should return Shopware customer order details endpoint", async () => {
      const result = getCustomerOrderDetailsEndpoint("12345-ab");
      expect(result).toEqual("/checkout/guest-order/12345-ab");
    });
  });

  describe("getCheckoutCartEndpoint", () => {
    it("should return Shopware checkout-cart endpoint", async () => {
      const result = getCheckoutCartEndpoint();
      expect(result).toEqual("/checkout/cart");
    });
  });

  describe("getCheckoutCartProductEndpoint", () => {
    it("should return Shopware checkout-cart-product endpoint", async () => {
      const result = getCheckoutCartProductEndpoint(sampleProductId);
      expect(result).toEqual("/checkout/cart/product/" + sampleProductId);
    });
  });

  describe("getCheckoutCartLineItemEndpoint", () => {
    it("should return Shopware checkout-cart-lineItem endpoint", async () => {
      const result = getCheckoutCartLineItemEndpoint(sampleLineItemId);
      expect(result).toEqual("/checkout/cart/line-item/" + sampleLineItemId);
    });
  });

  describe("getCheckoutOrderEndpoint", () => {
    it("should return Shopware checkout-order endpoint", async () => {
      const result = getCheckoutOrderEndpoint();
      expect(result).toEqual("/checkout/order");
    });
  });

  describe("getCheckoutGuestOrderEndpoint", () => {
    it("should return Shopware checkout-guestOrder endpoint", async () => {
      const result = getCheckoutGuestOrderEndpoint();
      expect(result).toEqual("/checkout/guest-order");
    });
  });

  describe("getCheckoutGuestOrderDetailsEndpoint", () => {
    it("should return Shopware checkout-guestOrder-details endpoint", async () => {
      const result = getCheckoutGuestOrderDetailsEndpoint(sampleOrderId);
      expect(result).toEqual("/checkout/guest-order/" + sampleOrderId);
    });
  });

  describe("getCheckoutOrderPayEndpoint", () => {
    it("should return Shopware checkout-order-pay endpoint", async () => {
      const result = getCheckoutOrderPayEndpoint(sampleOrderId);
      expect(result).toEqual("/checkout/order/" + sampleOrderId + "/pay");
    });
  });

  describe("getContextCurrencyEndpoint", () => {
    it("should return Shopware currency endpoint", async () => {
      const result = getContextCurrencyEndpoint();
      expect(result).toEqual("/currency");
    });
  });

  describe("getContextLanguageEndpoint", () => {
    it("should return Shopware language endpoint", async () => {
      const result = getContextLanguageEndpoint();
      expect(result).toEqual("/language");
    });
  });

  describe("getContextCountryEndpoint", () => {
    it("should return Shopware country endpoint", async () => {
      const result = getContextCountryEndpoint();
      expect(result).toEqual("/country");
    });
  });

  describe("getContextPaymentMethodEndpoint", () => {
    it("should return Shopware payment method endpoint", async () => {
      const result = getContextPaymentMethodEndpoint();
      expect(result).toEqual("/payment-method");
    });
  });
  describe("getContextShippingMethodEndpoint", () => {
    it("should return Shopware shipping method endpoint", async () => {
      const result = getContextShippingMethodEndpoint();
      expect(result).toEqual("/shipping-method");
    });
  });

  describe("getContextSalutationEndpoint", () => {
    it("should return Shopware salutation endpoint", async () => {
      const result = getContextSalutationEndpoint();
      expect(result).toEqual("/salutation");
    });
  });

  describe("getNewsletterSubscribeEndpoint", () => {
    it("should return Shopware newsletter subscribe endpoint", async () => {
      const result = getNewsletterSubscribeEndpoint();
      expect(result).toEqual("/newsletter/subscribe");
    });
  });

  describe("getNewsletterUnsubscribeEndpoint", () => {
    it("should return Shopware newsletter unsubscribe endpoint", async () => {
      const result = getNewsletterUnsubscribeEndpoint();
      expect(result).toEqual("/newsletter/unsubscribe");
    });
  });

  describe("getNavigationEndpoint", () => {
    it("should return navigation endpoint", async () => {
      const result = getNavigationEndpoint();
      expect(result).toEqual("/vsf/navigation");
    });
  });

  describe("getContextCountryItemEndpoint", () => {
    it("should return country item endpoint", async () => {
      const result = getContextCountryItemEndpoint(sampleCountryId);
      expect(result).toEqual(`/country/${sampleCountryId}`);
    });
  });

  describe("getContextSalutationItemEndpoint", () => {
    it("should return salutation item endpoint", async () => {
      const result = getContextSalutationItemEndpoint(sampleSalutationId);
      expect(result).toEqual(`/salutation/${sampleSalutationId}`);
    });
  });
});
