import * as path from "path";
import rimraf from "rimraf";
import merge from "webpack-merge";

import defaultAntwar from "./config/default-antwar";
import defaultWebpack from "./config/default-webpack";
import mergeConfiguration from "deepmerge";
import build from "./build";
import dev from "./dev";

exports.develop = execute(develop);
exports.start = exports.develop; // convenience alias
exports.build = execute(build);

function execute(target) {
  return ({ configurationPaths, environment }) => {
    process.env.NODE_ENV = environment;

    return target({
      environment,
      configurationPaths,
      configurations: {
        antwar: mergeConfiguration(
          defaultAntwar(),
          require(configurationPaths.antwar)(environment)
        ),
        webpack: merge(
          defaultWebpack({ configurationPaths }),
          require(configurationPaths.webpack)(environment)
        ),
      },
    });
  };
}

function develop({ configurations }) {
  const cwd = process.cwd();
  const buildDir = path.join(cwd, "./.antwar");

  return new Promise((resolve, reject) => {
    rimraf(buildDir, err => {
      if (err) {
        return reject(err);
      }

      return build
        .devIndex({ configurations })
        .then(dev.server.bind(null, configurations))
        .then(resolve)
        .catch(reject);
    });
  });
}
