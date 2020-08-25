import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import { useDefaults, getDefaultApiParams } from "@shopware-pwa/composables";

Vue.use(VueCompositionApi);
const consoleWarnSpy = jest.spyOn(console, "warn");

describe("Composables - useDefaults", () => {
  const rootContextMock: any = {
    $store: jest.fn(),
    $shopwareApiInstance: jest.fn(),
    $shopwareDefaults: getDefaultApiParams(),
  };
  beforeEach(() => {
    jest.resetAllMocks();
    rootContextMock.$shopwareDefaults = getDefaultApiParams();
    consoleWarnSpy.mockImplementation(() => {});
  });
  describe("validation", () => {
    it("should throw an error when shopwareDefaults are not set", async () => {
      rootContextMock.$shopwareDefaults = undefined;
      expect(() => useDefaults(rootContextMock, "anyKey")).toThrow(
        "[composables][useDefaults]: applicationContext does not have shopwareDefaults!"
      );
    });

    it("should show a warning when accessing not existing key", async () => {
      const { getAssociationsConfig } = useDefaults(
        rootContextMock,
        "somethingNotExisting"
      );
      getAssociationsConfig();
      expect(consoleWarnSpy).toBeCalledWith(
        "[WARNING][@shopware-pwa/composables][useDefaults]: there is no defaults configuration for key: somethingNotExisting"
      );
    });

    it("should return an empty object for includes when there is no config", async () => {
      const { getIncludesConfig } = useDefaults(
        rootContextMock,
        "somethingNotExisting"
      );
      expect(getIncludesConfig()).toEqual({});
    });

    it("should return an empty array for associations when there is no config", async () => {
      const { getAssociationsConfig } = useDefaults(
        rootContextMock,
        "somethingNotExisting"
      );
      expect(getAssociationsConfig()).toEqual([]);
    });
  });
  describe("CMS", () => {
    it("should correctly get the cms includes", async () => {
      const { getIncludesConfig } = useDefaults(rootContextMock, "useCms");
      expect(getIncludesConfig()).toStrictEqual(
        getDefaultApiParams()?.["useCms"]?.includes
      );
    });
    it("should correctly get the cms associations", async () => {
      const { getAssociationsConfig } = useDefaults(rootContextMock, "useCms");
      expect(getAssociationsConfig()).toStrictEqual(
        getDefaultApiParams()?.["useCms"]?.associations
      );
    });
  });
  describe("PRODUCT", () => {
    it("should correctly get the product details includes", async () => {
      const { getIncludesConfig } = useDefaults(rootContextMock, "useProduct");
      expect(getIncludesConfig()).toStrictEqual(
        getDefaultApiParams()?.["useProduct"]?.includes
      );
    });
    it("should correctly get the product details associations", async () => {
      const { getAssociationsConfig } = useDefaults(
        rootContextMock,
        "useProduct"
      );
      expect(getAssociationsConfig()).toStrictEqual(
        getDefaultApiParams()?.["useProduct"]?.associations
      );
    });
  });
  describe("PRODUCT_LISTING", () => {
    it("should correctly get the product listing includes", async () => {
      const { getIncludesConfig } = useDefaults(
        rootContextMock,
        "useProductListing"
      );
      expect(getIncludesConfig()).toStrictEqual(
        getDefaultApiParams()?.["useProductListing"]?.includes
      );
    });
    it("should correctly get the product listing associations", async () => {
      const { getAssociationsConfig } = useDefaults(
        rootContextMock,
        "useProductListing"
      );
      expect(getAssociationsConfig()).toStrictEqual(
        getDefaultApiParams()?.["useProductListing"]?.associations || []
      );
    });
  });
});
