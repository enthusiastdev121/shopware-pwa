import { addCartItemQuantity } from "../../../src";
import { apiService } from "../../../src/apiService";
import { random, commerce } from "faker";

jest.mock("../../../src/apiService");
const mockedAxios = apiService as jest.Mocked<typeof apiService>;

describe("CartService - addCartItemQuantity", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should call valid endpoint and return a cart", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          name: random.uuid(),
          token: random.uuid(),
          lineItems: [
            {
              id: "3a64e872ca404522a2c5d43ebc751e6",
              label: commerce.productName(),
              quantity: 5,
              payload: {
                productNumber: random.uuid(),
              },
            },
          ],
        },
      },
    });

    let lineItemId = "3a64e872ca404522a2c5d43ebc751e6b";

    const result = await addCartItemQuantity(lineItemId, 3);
    expect(mockedAxios.post).toBeCalledTimes(1);
    expect(mockedAxios.post).toBeCalledWith(
      `/sales-channel-api/v1/checkout/cart/line-item/3a64e872ca404522a2c5d43ebc751e6b`,
      {
        type: "product",
        quantity: 3,
      }
    );
    expect(result.lineItems[0].quantity).toEqual(5);
  });

  it("should throw unhandled 500 error when non-existing lineItemId given", async () => {
    mockedAxios.post.mockRejectedValueOnce(
      new Error("500: FRAMEWORK__INCONSISTENT_CRITERIA_IDS")
    );

    let lineItemId = "someNonExistingLineItemId";

    expect(addCartItemQuantity(lineItemId, 1)).rejects.toThrow(
      "500: FRAMEWORK__INCONSISTENT_CRITERIA_IDS"
    );
    expect(mockedAxios.post).toBeCalledTimes(1);
    expect(mockedAxios.post).toBeCalledWith(
      "/sales-channel-api/v1/checkout/cart/line-item/someNonExistingLineItemId",
      {
        quantity: 1,
        type: "product",
      }
    );
  });

  it("should throw unhandled 400 error when negative quantity given", async () => {
    mockedAxios.post.mockRejectedValueOnce(
      new Error("400: CHECKOUT__CART_INVALID_LINEITEM_QUANTITY")
    );

    let lineItemId = "someNonExistingLineItemId";

    expect(addCartItemQuantity(lineItemId, -2)).rejects.toThrow(
      "400: CHECKOUT__CART_INVALID_LINEITEM_QUANTITY"
    );
    expect(mockedAxios.post).toBeCalledTimes(1);
    expect(mockedAxios.post).toBeCalledWith(
      `/sales-channel-api/v1/checkout/cart/line-item/${lineItemId}`,
      {
        quantity: -2,
        type: "product",
      }
    );
  });

  it("should throw unhandled 404 error when empty lineItemId given", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("404: Not Found"));

    let lineItemId = "";

    expect(addCartItemQuantity(lineItemId, 2)).rejects.toThrow(
      "404: Not Found"
    );
    expect(mockedAxios.post).toBeCalledTimes(1);
    expect(mockedAxios.post).toBeCalledWith(
      "/sales-channel-api/v1/checkout/cart/line-item/",
      {
        quantity: 2,
        type: "product",
      }
    );
  });
});
