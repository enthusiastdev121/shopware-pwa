import {
  NuxtModuleOptions,
  WebpackConfig,
  WebpackContext,
  ShopwarePwaConfigFile,
} from "./interfaces";
import path from "path";
import { loadConfig } from "./utils";
import { extendCMS } from "./cms";
import { extendLocales } from "./locales";
import { useCorePackages } from "./packages";
import { invokeBuildLogger } from "./logger";
import {
  getTargetSourcePath,
  getBaseSourcePath,
  getProjectSourcePath,
  useThemeAndProjectFiles,
  onThemeFilesChanged,
  onProjectFilesChanged,
} from "./theme";
import chokidar from "chokidar";
import { getDefaultApiParams } from "@shopware-pwa/composables";
import merge from "lodash/merge";
import fse from "fs-extra";

export async function runModule(
  moduleObject: NuxtModuleOptions,
  moduleOptions: {}
) {
  const TARGET_SOURCE: string = getTargetSourcePath(moduleObject);
  const BASE_SOURCE: string = getBaseSourcePath(moduleObject);
  const PROJECT_SOURCE: string = getProjectSourcePath(moduleObject);

  // Change project source root to Target path
  moduleObject.options.srcDir = TARGET_SOURCE;
  moduleObject.options.store = true; // enable store generation
  // resolve project src aliases
  moduleObject.options.alias = moduleObject.options.alias || {};
  moduleObject.options.alias["~"] = TARGET_SOURCE;
  moduleObject.options.alias["@"] = TARGET_SOURCE;
  moduleObject.options.alias["assets"] = path.join(TARGET_SOURCE, "assets");
  moduleObject.options.alias["static"] = path.join(TARGET_SOURCE, "static");

  // theme resolve
  moduleObject.options.alias["@theme"] = BASE_SOURCE;

  await useThemeAndProjectFiles({ TARGET_SOURCE, PROJECT_SOURCE, BASE_SOURCE });

  /* istanbul ignore next */
  invokeBuildLogger(moduleObject);
  const shopwarePwaConfig: ShopwarePwaConfigFile = await loadConfig(
    moduleObject
  );

  if (!shopwarePwaConfig.shopwareAccessToken)
    console.error("shopwareAccessToken in shopware-pwa.config.js is missing");
  if (!shopwarePwaConfig.shopwareEndpoint)
    console.error("shopwareEndpoint in shopware-pwa.config.js is missing");

  // Warning about wrong API address
  // TODO: remove in 1.0
  if (shopwarePwaConfig.shopwareEndpoint?.includes("/sales-channel-api/v1")) {
    console.error(
      "Please change your shopwareEndpoint in shopware-pwa.config.js to contain just domain, example: https://github.com/DivanteLtd/shopware-pwa#running-shopware-pwa-on-custom-shopware-instance"
    );
  }

  moduleObject.addPlugin({
    fileName: "api-defaults.js",
    src: path.join(__dirname, "..", "plugins", "api-defaults.js"),
    options: {
      apiDefaults: merge(
        {},
        getDefaultApiParams(),
        shopwarePwaConfig.apiDefaults
      ),
    },
  });

  moduleObject.addPlugin({
    fileName: "api-client.js",
    src: path.join(__dirname, "..", "plugins", "api-client.js"),
    options: {
      shopwareEndpoint: shopwarePwaConfig.shopwareEndpoint,
      shopwareAccessToken: shopwarePwaConfig.shopwareAccessToken,
    },
  });

  const defaults = {
    alias: "cookies",
    parseJSON: true,
  };
  moduleObject.addPlugin({
    src: path.join(__dirname, "..", "plugins", "cookie-universal-nuxt.js"),
    fileName: "cookie-universal-nuxt.js",
    options: Object.assign({}, defaults, moduleOptions),
  });

  moduleObject.addPlugin({
    src: path.join(__dirname, "..", "plugins", "price-filter.js"),
    fileName: "price-filter.js",
    options: moduleOptions,
  });

  moduleObject.addPlugin({
    src: path.join(
      __dirname,
      "..",
      "plugins",
      "entities-parser",
      "entities-parser.csr.js"
    ),
    fileName: "entities-parser.csr.js",
    mode: "client",
    options: moduleOptions,
  });

  moduleObject.addPlugin({
    src: path.join(
      __dirname,
      "..",
      "plugins",
      "entities-parser",
      "entities-parser.ssr.js"
    ),
    fileName: "entities-parser.ssr.js",
    mode: "server",
    options: {},
  });

  moduleObject.addPlugin({
    src: path.join(__dirname, "..", "plugins", "composition-api.js"),
    fileName: "composition-api.js",
    options: moduleOptions,
  });

  // fixes problem with multiple composition-api instances
  moduleObject.extendBuild((config: WebpackConfig) => {
    config.resolve.alias["@vue/composition-api"] = path.resolve(
      "node_modules/@vue/composition-api"
    );
  });

  // locales
  extendLocales(moduleObject, shopwarePwaConfig);

  moduleObject.extendBuild((config: WebpackConfig, ctx: WebpackContext) => {
    const swPluginsDirectory = path.join(
      moduleObject.options.rootDir,
      ".shopware-pwa",
      "sw-plugins"
    );
    config.resolve.alias["sw-plugins"] = swPluginsDirectory;
    if (ctx.isClient && !ctx.isDev) {
      config.optimization.splitChunks.cacheGroups.commons.minChunks = 2;
    }
  });

  extendCMS(moduleObject);

  moduleObject.options.build = moduleObject.options.build || {};
  moduleObject.options.build.babel = moduleObject.options.build.babel || {};
  /* istanbul ignore next */
  moduleObject.options.build.babel.presets = ({ isServer }) => {
    return [
      [
        path.join(
          moduleObject.options.rootDir,
          "node_modules",
          "@nuxt",
          "babel-preset-app"
        ),
        // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
        {
          buildTarget: isServer ? "server" : "client",
          corejs: { version: 3 },
        },
      ],
    ];
  };

  moduleObject.options.build.filenames =
    moduleObject.options.build.filenames || {};
  moduleObject.options.build.filenames.chunk = ({ isDev }) =>
    isDev ? "[name].js" : "[id].[contenthash].js";

  const corePackages: string[] = [
    "@shopware-pwa/composables",
    "@shopware-pwa/helpers",
    "@shopware-pwa/shopware-6-client",
    "@storefront-ui/vue",
    "@storefront-ui/shared",
  ];

  useCorePackages(moduleObject, corePackages);

  // backward compatibility for defaullt-theme alias
  moduleObject.options.alias["@shopware-pwa/default-theme"] = TARGET_SOURCE;
  moduleObject.options.build.transpile =
    moduleObject.options.build.transpile || [];
  moduleObject.options.build.transpile.push("@shopware-pwa/default-theme");

  // Watching files in development mode
  if (moduleObject.options.dev) {
    // Observing theme
    chokidar
      .watch([BASE_SOURCE], {
        ignored: `${BASE_SOURCE}/node_modules/**/*`,
        ignoreInitial: true,
        followSymlinks: true,
      })
      .on("all", (event: string, filePath: string) =>
        onThemeFilesChanged({
          event,
          filePath,
          TARGET_SOURCE,
          PROJECT_SOURCE,
          BASE_SOURCE,
        })
      );

    // Observe project
    chokidar
      .watch([PROJECT_SOURCE], {
        ignoreInitial: true,
      })
      .on("all", (event: string, filePath: string) =>
        onProjectFilesChanged({
          event,
          filePath,
          TARGET_SOURCE,
          PROJECT_SOURCE,
          BASE_SOURCE,
        })
      );
  }

  // On build copy combined static files to rootStatic folder
  if (!moduleObject.options.dev) {
    moduleObject.nuxt.hook("build:done", async (builder: NuxtModuleOptions) => {
      const sourceDir = path.join(TARGET_SOURCE, "static");
      const destinationDir = path.join(builder.options.rootDir, "static");
      await fse.copy(sourceDir, destinationDir);
      console.log(
        "Moved static files to root directory static folder. Make sure your static files are placed inside `src/static` directory."
      );
    });
  }
}
