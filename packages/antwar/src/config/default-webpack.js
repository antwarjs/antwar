import * as path from "path";
import webpack from "webpack";

module.exports = function({ configurationPaths }) {
  const cwd = process.cwd();

  return {
    resolve: {
      alias: {
        "_antwar-config": configurationPaths.antwar,
        "antwar-config": path.join(__dirname, "config-entry.js"), // global access to antwar config
      },
      modules: [path.join(cwd, "node_modules"), "node_modules"],
    },
    resolveLoader: {
      modules: [
        cwd,
        path.join(__dirname, "..", "node_modules"),
        "node_modules",
      ],
    },
  };
};
