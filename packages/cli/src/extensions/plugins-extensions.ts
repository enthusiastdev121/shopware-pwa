import { GluegunToolbox } from "gluegun";
import axios from "axios";

module.exports = (toolbox: GluegunToolbox) => {
  toolbox.fetchPluginsAuthToken = async (
    { shopwareEndpoint, username, password } = toolbox.inputParameters
  ) => {
    const authTokenResponse = await axios.post(
      `${shopwareEndpoint}/api/oauth/token`,
      {
        client_id: "administration",
        grant_type: "password",
        scopes: "write",
        username,
        password,
      }
    );
    return authTokenResponse.data.access_token;
  };

  toolbox.fetchPluginsBuildArtifact = async ({
    shopwareEndpoint,
    authToken,
  }: {
    shopwareEndpoint: string;
    authToken: string;
  }) => {
    const pluginsConfigRsponse = await axios.post(
      `${shopwareEndpoint}/api/v1/_action/pwa/dump-bundles`,
      null,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return pluginsConfigRsponse.data.buildArtifact;
  };

  toolbox.fetchPluginsConfig = async ({ config }: { config: string }) => {
    const pluginsConfigResponse = await axios.get(
      `${toolbox.inputParameters.shopwareEndpoint}/${config}`
    );
    return pluginsConfigResponse.data;
  };

  toolbox.loadPluginsAssetFile = async ({ asset }: { asset: string }) => {
    const fileUrl = `${toolbox.inputParameters.shopwareEndpoint}/${asset}`;

    const request = require("request");
    const loadFile = function () {
      return new Promise((resolve, reject) => {
        request(
          {
            url: fileUrl,
            encoding: null,
          },
          function (err: unknown, resp: unknown, body: any) {
            if (err) reject(err);
            toolbox.filesystem.write(
              ".shopware-pwa/pwa-bundles-assets.zip",
              body
            );
            resolve();
          }
        );
      });
    };
    await loadFile();
  };

  toolbox.unzipPluginsAssetsFile = async () => {
    const unzipper = require("unzipper");
    const assetsFile = await unzipper.Open.file(
      ".shopware-pwa/pwa-bundles-assets.zip"
    );
    await assetsFile.extract({
      path: ".shopware-pwa/pwa-bundles-assets",
    });
  };

  toolbox.buildPluginsTrace = async ({
    pluginsConfig,
    rootDirectory,
    pluginsTrace,
  }: any = {}) => {
    const pluginsRootDirectory =
      rootDirectory || ".shopware-pwa/pwa-bundles-assets";
    const pluginsMap = Object.assign({}, pluginsTrace);
    if (pluginsConfig) {
      const pluginNames = Object.keys(pluginsConfig);
      pluginNames.forEach((pluginName) => {
        if (!pluginsConfig[pluginName]) return;
        const pluginDirectory = `${pluginsRootDirectory}/${pluginName}`;
        const pluginDirExist = toolbox.filesystem.exists(pluginDirectory);
        if (pluginDirExist) {
          const pluginConfig = toolbox.filesystem.read(
            `${pluginDirectory}/config.json`,
            "json"
          );
          if (pluginConfig) {
            pluginConfig.slots.forEach(
              async (slot: { name: string; file: string }) => {
                if (!pluginsMap[slot.name]) pluginsMap[slot.name] = [];
                pluginsMap[slot.name].push(`~/${pluginDirectory}/${slot.file}`);
              }
            );
          } else {
            toolbox.print.error(`Plugin ${pluginName} has no config file!`);
          }
        }
      });
    }
    return pluginsMap;
  };

  toolbox.buildPluginsMap = async (pluginsTrace: any) => {
    const finalMap: any = {};
    const pluginSlotNames = Object.keys(pluginsTrace);
    for (let index = 0; index < pluginSlotNames.length; index++) {
      const pluginSlotName = pluginSlotNames[index];
      const slotComponents = pluginsTrace[pluginSlotName];
      if (slotComponents.length === 1) {
        finalMap[pluginSlotName] = slotComponents[0];
      } else {
        const componentNames = slotComponents.map(
          (component: any, index: number) => {
            const arr = `${pluginSlotName}-${index + 1}`.split("-");
            let capital = arr.map((item, index) =>
              index
                ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
                : item
            );
            return capital.join("");
          }
        );
        const bodyStart = "--> ";
        const bodyEnd = " <!--";
        const startingTags = [...componentNames]
          .reverse()
          .reduce((prev: string, current: string) => {
            return `${prev}<${current}>`;
          }, "");
        const endingTags = componentNames.reduce(
          (prev: string, current: string) => {
            return `${prev}</${current}>`;
          },
          ""
        );
        const body = bodyStart + startingTags + endingTags + bodyEnd;

        const componentImports = slotComponents.reduce(
          (prev: string, current: string, index: number) => {
            return `${prev}\nimport ${componentNames[index]} from '${current}'`;
          },
          ""
        );
        const components = slotComponents.reduce(
          (prev: string, current: string, index: number) => {
            return `${prev}\n ${componentNames[index]},`;
          },
          ""
        );
        await toolbox.template.generate({
          template: `/plugins/GenericPlugin.vue`,
          target: `.shopware-pwa/sw-plugins/${pluginSlotName}.vue`,
          props: {
            body,
            componentImports,
            components,
          },
        });
        finalMap[pluginSlotName] = `sw-plugins/${pluginSlotName}.vue`;
      }
    }
    return finalMap;
  };

  toolbox.loadPluginsAssets = async () => {
    if (
      !toolbox.inputParameters.username ||
      !toolbox.inputParameters.password
    ) {
      toolbox.print.warning(
        "Plugin settings are not fetched from shopware instance."
      );
      return;
    }
    try {
      const authToken = await toolbox.fetchPluginsAuthToken(
        toolbox.inputParameters
      );
      const buildArtifact = await toolbox.fetchPluginsBuildArtifact({
        ...toolbox.inputParameters,
        authToken,
      });
      const pluginsConfig = await toolbox.fetchPluginsConfig(buildArtifact);

      await toolbox.filesystem.removeAsync(`.shopware-pwa/pwa-bundles.json`);
      await toolbox.filesystem.removeAsync(`.shopware-pwa/pwa-bundles-assets`);
      await toolbox.filesystem.removeAsync(
        `.shopware-pwa/pwa-bundles-assets.zip`
      );
      await toolbox.filesystem.writeAsync(
        ".shopware-pwa/pwa-bundles.json",
        pluginsConfig
      );

      await toolbox.loadPluginsAssetFile(buildArtifact);
      await toolbox.unzipPluginsAssetsFile();
    } catch (e) {
      if (e && e.response && e.response.status === 401) {
        toolbox.print.error(
          `You provided bad cridentials for your shopware instance: ${toolbox.inputParameters.shopwareEndpoint} - plugins will not be added`
        );
      } else {
        console.error("UNEXPECTED ERROR", e ? e.response : e);
      }
      return;
    }
  };
};
