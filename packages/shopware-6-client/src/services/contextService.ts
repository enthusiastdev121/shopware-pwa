import { Currency } from "@shopware-pwa/shopware-6-client/src/interfaces/models/system/currency/Currency";
import { apiService } from "../apiService";
import {
  getContextCurrencyEndpoint,
  getContextCountryEndpoint,
  getContextPaymentMethodEndpoint,
  getContextShippingMethodEndpoint,
  getContextLanguageEndpoint,
  getContextEndpoint
} from "../endpoints";
import { Country } from "@shopware-pwa/shopware-6-client/src/interfaces/models/system/country/Country";
import { ShippingMethod } from "@shopware-pwa/shopware-6-client/src/interfaces/models/checkout/shipping/ShippingMethod";
import { PaymentMethod } from "@shopware-pwa/shopware-6-client/src/interfaces/models/checkout/payment/PaymentMethod";
import { Language } from "@shopware-pwa/shopware-6-client/src/interfaces/models/framework/language/Language";
import { SearchResult } from "@shopware-pwa/shopware-6-client/src/interfaces/response/SearchResult";
import { UpdateContextParams } from "@shopware-pwa/shopware-6-client/src/interfaces/request/UpdateContextParams";
import { ContextTokenResponse } from "@shopware-pwa/shopware-6-client/src/interfaces/response/ContextTokenResponse";

async function updateContext(
  params: UpdateContextParams
): Promise<ContextTokenResponse> {
  const resp = await apiService.patch(getContextEndpoint(), params);
  const contextToken = resp.data["sw-context-token"];
  return { contextToken };
}

export async function getAvailableCurrencies(): Promise<
  SearchResult<Currency[]>
> {
  const resp = await apiService.get(getContextCurrencyEndpoint());

  return resp.data;
}

export async function setCurrentCurrency(
  newCurrencyID: string
): Promise<ContextTokenResponse> {
  let params = { currencyId: newCurrencyID };
  const resp = await updateContext(params);

  return resp;
}

export async function getAvailableLanguages(): Promise<
  SearchResult<Language[]>
> {
  const resp = await apiService.get(getContextLanguageEndpoint());

  return resp.data;
}

export async function setCurrentLanguage(
  newLanguageId: string
): Promise<ContextTokenResponse> {
  let params = { languageId: newLanguageId };
  const resp = await updateContext(params);

  return resp;
}

export async function getAvailableCountries(): Promise<
  SearchResult<Country[]>
> {
  const resp = await apiService.get(getContextCountryEndpoint());

  return resp.data;
}

export async function getAvailablePaymentMethods(): Promise<
  SearchResult<PaymentMethod[]>
> {
  const resp = await apiService.get(getContextPaymentMethodEndpoint());

  return resp.data;
}

export async function setCurrentPaymentMethod(
  newPaymentMethodId: string
): Promise<ContextTokenResponse> {
  let params = { paymentMethodId: newPaymentMethodId };
  const resp = await updateContext(params);

  return resp;
}

export async function getAvailableShippingMethods(): Promise<
  SearchResult<ShippingMethod[]>
> {
  const resp = await apiService.get(getContextShippingMethodEndpoint());

  return resp.data;
}

export async function setCurrentShippingMethod(
  newShippingMethodId: string
): Promise<ContextTokenResponse> {
  let params = { shippingMethodId: newShippingMethodId };
  const resp = await updateContext(params);

  return resp;
}
