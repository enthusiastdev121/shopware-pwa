/*
Run Rollup in watch mode for development.

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "global"):

```
# name supports fuzzy match. will watch all packages with name containing "dom"
yarn dev dom

# specify the format to output
yarn dev core --formats cjs

# Can also drop all __DEV__ blocks with:
__DEV__=false yarn dev
```
*/

const execa = require("execa");
const path = require("path");
const { fuzzyMatchTarget } = require("./utils");
const args = require("minimist")(process.argv.slice(2));
const target = args._.length
  ? fuzzyMatchTarget(args._)[0]
  : "shopware-6-client";
const chokidar = require("chokidar");

chokidar
  .watch([path.join(__dirname, "..", "packages", target, "src")], {
    ignoreInitial: true,
  })
  .on("all", async (event) => {
    execa("yarn", ["build", target], {
      stdio: "inherit",
    });
  });

execa("yarn", ["build", target], {
  stdio: "inherit",
});
