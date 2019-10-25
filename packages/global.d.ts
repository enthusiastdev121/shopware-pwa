import { AxiosStatic } from "axios";

// Global compile-time constants
declare var __DEV__: boolean;
declare var __JSDOM__: boolean;
declare var __BROWSER__: boolean;
declare var __COMMIT__: string;
declare var __VERSION__: string;

// Feature flags
declare var __FEATURE_OPTIONS__: boolean;
declare var __FEATURE_SUSPENSE__: boolean;

// Externals
declare var axios: AxiosStatic;
