import {
  getCustomerEndpoint,
  getCustomerAddressEndpoint,
  getCustomerUpdateEmailEndpoint,
  getCustomerRegisterEndpoint,
  getCustomerDetailsUpdateEndpoint,
  getCustomerUpdatePasswordEndpoint,
  getCustomerDefaultBillingAddressEndpoint,
  getCustomerDefaultShippingAddressEndpoint,
  getCustomerLogoutEndpoint,
  getCustomerLoginEndpoint,
  getCustomerOrderEndpoint,
  getCustomerOrderDetailsEndpoint,
} from "../endpoints";
import { Customer } from "@shopware-pwa/commons/interfaces/models/checkout/customer/Customer";
import { apiService } from "../apiService";
import { CustomerAddress } from "@shopware-pwa/commons/interfaces/models/checkout/customer/CustomerAddress";
import { CustomerRegistrationParams } from "@shopware-pwa/commons/interfaces/request/CustomerRegistrationParams";
import { ContextTokenResponse } from "@shopware-pwa/commons/interfaces/response/SessionContext";
import { Order } from "@shopware-pwa/commons/interfaces/models/checkout/order/Order";

/**
 * @alpha
 */
export interface CustomerRegisterResponse {
  data: string;
}

/**
 * Register a customer
 *
 * @throws ClientApiError
 * @alpha
 */
export async function register(
  params: CustomerRegistrationParams
): Promise<CustomerRegisterResponse> {
  const resp = await apiService.post(getCustomerRegisterEndpoint(), params);
  return resp.data;
}

/**
 * Login user to shopware instance.
 *
 * @throws ClientApiError
 * @beta
 */
export async function login({
  username,
  password,
}: { username?: string; password?: string } = {}): Promise<
  ContextTokenResponse
> {
  if (!username || !password)
    throw new Error("Provide username and password for login");
  const resp = await apiService.post(getCustomerLoginEndpoint(), {
    username,
    password,
  });
  const contextToken =
    resp.data["sw-context-token"] || resp.data["contextToken"];
  return { contextToken };
}

/**
 * End up the user session.
 *
 * @throws ClientApiError
 * @beta
 */
export async function logout(): Promise<void> {
  await apiService.post(getCustomerLogoutEndpoint());
}

/**
 * Get customer's object
 *
 * @throws ClientApiError
 * @beta
 */
export async function getCustomer(): Promise<Customer | null> {
  try {
    // TODO: implement generic parameter converter for GET query string; related issue #568
    const associationsQuery = "?associations[salutation][]";
    const resp = await apiService.get(
      `${getCustomerEndpoint()}${associationsQuery}`
    );
    return resp.data;
  } catch (e) {
    if (e.statusCode === 403) return null;
    throw new Error("Unexpected getCustomerResponse. " + e);
  }
}

/**
 * Get all customer's addresses
 *
 * @throws ClientApiError
 * @beta
 */
export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  const resp = await apiService.get(getCustomerAddressEndpoint());
  return resp.data.data;
}

/**
 * Get all customer's orders
 *
 * @throws ClientApiError
 * @beta
 */
export async function getCustomerOrders(): Promise<Order[]> {
  const resp = await apiService.get(getCustomerOrderEndpoint());
  return resp.data.elements || [];
}

/**
 * Get order details
 *
 * @throws ClientApiError
 * @alpha
 */
export async function getCustomerOrderDetails(orderId: string): Promise<Order> {
  const resp = await apiService.get(getCustomerOrderDetailsEndpoint(orderId));
  return resp.data.data;
}

/**
 * Get the customer's address by id
 *
 * @throws ClientApiError
 * @alpha
 */
export async function getCustomerAddress(
  addressId: string
): Promise<CustomerAddress> {
  const resp = await apiService.get(getCustomerAddressEndpoint(addressId));
  return resp.data.data;
}

/**
 * @alpha
 */
export interface CustomerAddressParam extends Partial<CustomerAddress> {}

/**
 * Create an address and respond the new address's id
 *
 * @throws ClientApiError
 * @alpha
 */
export async function createCustomerAddress(
  params: CustomerAddressParam
): Promise<string> {
  const resp = await apiService.post(getCustomerAddressEndpoint(), params);
  return resp.data;
}

/**
 * Delete's the customer's address by id
 *
 * @throws ClientApiError
 * @alpha
 */
export async function deleteCustomerAddress(addressId: string): Promise<void> {
  await apiService.delete(getCustomerAddressEndpoint(addressId));
}

/**
 * Set address as default
 *
 * @throws ClientApiError
 * @alpha
 */
export async function setDefaultCustomerBillingAddress(
  addressId: string
): Promise<string> {
  const response = await apiService.patch(
    getCustomerDefaultBillingAddressEndpoint(addressId)
  );
  return response.data;
}

/**
 * Set address as default
 *
 * @throws ClientApiError
 * @alpha
 */
export async function setDefaultCustomerShippingAddress(
  addressId: string
): Promise<string> {
  const response = await apiService.patch(
    getCustomerDefaultShippingAddressEndpoint(addressId)
  );
  return response.data;
}

/**
 * @alpha
 */
export interface CustomerUpdateEmailParam {
  email: string;
  emailConfirmation: string;
  password: string;
}

/**
 * Update a customer's email
 *
 * @throws ClientApiError
 * @alpha
 */
export async function updateEmail(
  params: CustomerUpdateEmailParam
): Promise<void> {
  await apiService.post(getCustomerUpdateEmailEndpoint(), params);
}

/**
 * @alpha
 */
export interface CustomerUpdatePasswordParam {
  password: string;
  newPassword: string;
  newPasswordConfirm: string;
}

/**
 * Update a customer's password
 *
 * @throws ClientApiError
 * @alpha
 */
export async function updatePassword(
  params: CustomerUpdatePasswordParam
): Promise<void> {
  await apiService.post(getCustomerUpdatePasswordEndpoint(), params);
}

/**
 * @alpha
 */
export interface CustomerUpdateProfileParam {
  firstName: string;
  lastName: string;
  salutationId: string;
  title: string | null;
}

/**
 * Update a customer's profile data
 *
 * @throws ClientApiError
 * @alpha
 */
export async function updateProfile(
  params: CustomerUpdateProfileParam
): Promise<void> {
  await apiService.post(getCustomerDetailsUpdateEndpoint(), params);
}
