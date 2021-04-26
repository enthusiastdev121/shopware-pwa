import { getDefaultConfigFile } from "@shopware-pwa/commons";
import { GluegunToolbox } from "gluegun";

module.exports = {
  name: "init",
  alias: ["i"],
  description:
    "Create new Shopware PWA project inside the current directory. Can be invoked multiple times for actualisations.",
  run: async (toolbox: GluegunToolbox) => {
    const {
      system: { run },
      print: { info, warning, success, spin },
    } = toolbox;

    const inputParameters = toolbox.inputParameters;
    // when --ci parameter is provided, then we skip questions for default values
    const isCIrun = inputParameters.ci;

    if (!toolbox.isProduction) {
      warning(`You're running CLI in development mode!`);
    }

    const availablePwaVersions = await toolbox.shopware.getPwaVersions();

    const currentSetup = await getDefaultConfigFile();
    toolbox.reloadInputParameters({
      shopwareEndpoint: currentSetup.shopwareEndpoint,
      shopwareAccessToken: currentSetup.shopwareAccessToken,
    });

    if (!isCIrun) {
      const shopwareEndpointQuestion = {
        type: "input",
        name: "shopwareEndpoint",
        message: "Shopware instance address:",
        initial: inputParameters.shopwareEndpoint,
        result: (url: string) => toolbox.normalizeBaseUrl(url),
        validate: (url: string) => {
          try {
            // tslint:disable-next-line
            new URL(url);
            return true;
          } catch (error) {
            warning(error.message);
          }

          return false;
        },
      };
      const shopwareAccessTokenQuestion = {
        type: "input",
        name: "shopwareAccessToken",
        message: "Shopware instance access token:",
        initial: inputParameters.shopwareAccessToken,
      };
      const stageQuestion = {
        type: "select",
        name: "stage",
        message: "Which version you'd like to use:",
        choices: availablePwaVersions,
        initial: inputParameters.stage,
      };

      const answers = await toolbox.prompt.ask([
        shopwareEndpointQuestion,
        shopwareAccessTokenQuestion,
        stageQuestion,
      ]);
      Object.assign(inputParameters, answers);
    }

    await toolbox.generateNuxtProject();

    const defaultVersion = availablePwaVersions[0];
    let stage = inputParameters.stage || defaultVersion;
    if (inputParameters.stage === "stable") stage = defaultVersion;

    const updateConfigSpinner = spin(
      "Updating configuration for option: " + stage
    );

    // Adding Shopware PWA core dependencies
    const coreDevPackages = ["@shopware-pwa/nuxt-module"];
    const localCoreDevPackages = [
      "@shopware-pwa/cli",
      "@shopware-pwa/composables",
      "@shopware-pwa/helpers",
      "@shopware-pwa/shopware-6-client",
      "@shopware-pwa/default-theme",
      "@shopware-pwa/nuxt-module",
      "@shopware-pwa/theme-base",
    ];

    try {
      // - unlink potential linked locally packages
      await run(`yarn unlink ${localCoreDevPackages.join(" ")}`);
    } catch (e) {
      // It's just for safety, unlink on fresh project will throw an error so we can catch it here
    }

    await toolbox.patching.update("package.json", (config) => {
      const sortPackageJson = require("sort-package-json");
      config.dependencies = config.dependencies || {};
      config.devDependencies = config.devDependencies || {};

      // remove all @shopware-pwa packages
      const shopwarePwaPackageNames = Object.keys({
        ...config.dependencies,
        ...config.devDependencies,
      }).filter((name) => name.includes("@shopware-pwa"));
      shopwarePwaPackageNames.forEach((packageName) => {
        delete config.dependencies[packageName];
        delete config.devDependencies[packageName];
      });

      if (stage !== "local") {
        // add dependencies with version
        coreDevPackages.forEach((packageName) => {
          config.devDependencies[packageName] = stage;
        });
      } else {
        // add local dependencies and link them
        localCoreDevPackages.forEach((packageName) => {
          config.devDependencies[packageName] = defaultVersion;
        });
      }

      return sortPackageJson(config);
    });

    if (stage === "local") {
      await run(`npx yalc add -D ${localCoreDevPackages.join(" ")}`);
      await run(`yarn link ${localCoreDevPackages.join(" ")}`);
    }

    await run("yarn --check-files");
    updateConfigSpinner.succeed();

    const generateFilesSpinner = spin("Generating project files");
    await toolbox.generateTemplateFiles();
    const copyPromisses = toolbox.themeFolders.map((themeFolder) =>
      toolbox.copyThemeFolder(themeFolder)
    );
    await Promise.all(copyPromisses);
    generateFilesSpinner.succeed();

    // generate plugin files
    await toolbox.createPluginsTemplate();
    await toolbox.runtime.run(`plugins`, inputParameters);
    await toolbox.runtime.run(`cms`);
    await toolbox.runtime.run(`languages`, inputParameters);
    await toolbox.runtime.run(`domains`, inputParameters);

    const updateDependenciesSpinner = spin("Updating dependencies");
    // Loading additional packages
    await run(`yarn`);
    updateDependenciesSpinner.succeed();

    success(`Generated Shopware PWA project!`);
    info(`Type 'shopware-pwa dev' and start exploring`);
  },
};
