import { ref, Ref, computed, reactive } from "@vue/composition-api";
import { parse } from "query-string";
import {
  getSuggestedResults,
  getSearchResults,
} from "@shopware-pwa/shopware-6-client";
import {
  getListingAvailableFilters,
  UiCategoryFilter,
} from "@shopware-pwa/helpers";

import {
  ListingQueryParams,
  SearchCriteria,
  Sort,
} from "@shopware-pwa/commons/interfaces/search/SearchCriteria";
import {
  EqualsFilter,
  RangeFilter,
  SearchFilterType,
} from "@shopware-pwa/commons/interfaces/search/SearchFilter";
import { Aggregations } from "@shopware-pwa/commons/interfaces/search/Aggregations";
import { ProductListingResult } from "@shopware-pwa/commons/interfaces/response/ProductListingResult";
import { getApplicationContext } from "@shopware-pwa/composables";
import { ApplicationVueContext } from "../appContext";
import {
  appendSearchCriteriaToUrl,
  appendQueryParamsToSearchCriteria,
  resetSearchCriteria,
  toggleEntityFilter,
  toggleFilter as toggleGenericFilter,
} from "../internalHelpers/searchCriteria";
import { deprecationWarning } from "@shopware-pwa/commons";

/**
 * @beta
 */
export interface CurrentPagination {
  currentPage: number | undefined;
  perPage: number | undefined;
  total: number | undefined;
}

/**
 * @alpha
 * @deprecated please see useProductQuickSearch instead
 */
export interface UseProductSearch {
  loadingSearch: Readonly<Ref<boolean>>;
  loadingSuggestions: Readonly<Ref<boolean>>;
  currentSearchTerm: Readonly<Ref<string>>;
  searchResult: Readonly<Ref<ProductListingResult | null>>;
  suggestionsResult: Readonly<Ref<ProductListingResult | null>>;
  currentPagination: Ref<CurrentPagination | undefined>;
  availableFilters: Readonly<Ref<any>>;
  selectedFilters: Readonly<Ref<any>>;
  selectedEntityFilters: Readonly<Ref<any>>;
  suggestSearch: (term: string) => Promise<void>;
  search: (term: string) => Promise<void>;
  changePage: (page: number) => Promise<void>;
  changeSorting: (sorting: Sort) => void;
  toggleFilter: (
    filter: EqualsFilter | RangeFilter,
    forceSave: boolean
  ) => void;
  resetFilters: () => void;
}

/**
 * @alpha
 * @deprecated please see useProductQuickSearch instead
 */
export const useProductSearch = (
  rootContext: ApplicationVueContext
): UseProductSearch => {
  const { apiInstance } = getApplicationContext(
    rootContext,
    "useProductSearch"
  );
  deprecationWarning({
    methodName: "useProductSearch",
    newMethodName: "useProductQuickSearch",
    packageName: "composables",
  });

  const loadingSearch: Ref<boolean> = ref(false);
  const loadingSuggestions: Ref<boolean> = ref(false);
  const currentSearchTerm: Ref<string> = ref("");
  const searchResult: Ref<ProductListingResult | null> = ref(null);
  const suggestionsResult: Ref<ProductListingResult | null> = ref(null);
  const availableFilters: Ref<UiCategoryFilter[]> = ref([]);
  const currentPagination = computed(() => ({
    currentPage: searchResult.value?.page,
    perPage: searchResult.value?.limit,
    total: searchResult.value?.total,
  }));
  const searchCriteria: Partial<SearchCriteria> | any = reactive({
    manufacturer: [],
    properties: [],
    filters: {},
    pagination: {},
    sort: {},
  });

  const aggregations: Readonly<Ref<Aggregations | null>> = computed(
    () => searchResult.value && searchResult.value.aggregations
  );

  const changePage = async (page: number): Promise<void> => {
    searchCriteria.pagination.page = page;
    syncQueryParams();
    await search(currentSearchTerm.value);
  };

  const suggestSearch = async (term: string): Promise<void> => {
    try {
      loadingSuggestions.value = true;
      const suggestedProductListing = await getSuggestedResults(
        term,
        undefined,
        apiInstance
      );
      suggestionsResult.value = suggestedProductListing;
    } catch (e) {
      console.error("[useProductSearch][suggestSearch]", e);
    } finally {
      loadingSuggestions.value = false;
    }
  };

  const syncQueryParams = () => {
    appendSearchCriteriaToUrl(searchCriteria, currentSearchTerm.value);
  };

  const changeSorting = async (sorting: Sort) => {
    if (!sorting) {
      return;
    }

    searchCriteria.sort = sorting;
    syncQueryParams();
    await search(currentSearchTerm.value);
  };

  const toggleFilter = (
    filter: EqualsFilter | RangeFilter,
    forceSave?: boolean
  ): undefined | string => {
    if (!filter || !Object.keys(filter).length) {
      return;
    }

    if (filter.type === SearchFilterType.RANGE) {
      toggleGenericFilter(filter, searchCriteria);
    }

    if (filter.type === SearchFilterType.EQUALS) {
      toggleEntityFilter(filter as EqualsFilter, searchCriteria, forceSave);
    }

    syncQueryParams();
  };

  const captureQueryParams = () => {
    /* istanbul ignore next */
    const criteriaQueryParams: ListingQueryParams | any = parse(
      window?.location?.search,
      {
        parseNumbers: true,
      }
    );
    /* istanbul ignore next */
    if (!criteriaQueryParams) {
      return;
    }

    appendQueryParamsToSearchCriteria(criteriaQueryParams, searchCriteria);
  };

  const search = async (term: string): Promise<void> => {
    if (!term) {
      return;
    }

    try {
      captureQueryParams();
      loadingSearch.value = true;
      currentSearchTerm.value = term;
      searchResult.value = null;
      const result = await getSearchResults(term, searchCriteria, apiInstance);
      searchResult.value = result;
      availableFilters.value = getListingAvailableFilters(aggregations.value);
    } catch (e) {
      throw e;
    } finally {
      loadingSearch.value = false;
    }
  };

  const resetFilters = async () => {
    resetSearchCriteria(searchCriteria);
    syncQueryParams();
  };

  return {
    suggestSearch,
    search,
    currentSearchTerm: computed(() => currentSearchTerm.value),
    loadingSearch,
    loadingSuggestions,
    searchResult: computed(() => searchResult.value),
    suggestionsResult,
    currentPagination,
    selectedFilters: computed(() => searchCriteria.filters), // other type of filters, like price range
    selectedEntityFilters: computed(() => [
      ...searchCriteria.manufacturer,
      ...searchCriteria.properties,
    ]),
    availableFilters,
    changePage,
    changeSorting,
    toggleFilter,
    resetFilters,
  };
};
