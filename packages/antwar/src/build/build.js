const _fs = require("fs");
const _os = require("os");
const _path = require("path");

const _ = require("lodash");
const async = require("neo-async");
const rimraf = require("rimraf");
const webpack = require("webpack");
const workerFarm = require("worker-farm");

const workers = workerFarm(require.resolve("./build_worker"));

const webpackConfig = require("../config/build");
const write = require("./write");

module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    const output = config.antwar.output;

    if (!output) {
      return reject(new Error("Missing output directory"));
    }

    return webpackConfig(config)
      .then(runWebpack())
      .then(generateParameters(config.antwar, config.webpack))
      .then(writePages(config.antwar))
      .then(removeSiteBundle(output))
      .then(resolve)
      .catch(reject);
  });
};

function runWebpack() {
  return config =>
    new Promise(function(resolve, reject) {
      webpack(config, function(err, stats) {
        if (err) {
          return reject(err);
        }

        if (stats.hasErrors()) {
          return reject(stats.toString("errors-only"));
        }

        return resolve(stats);
      });
    });
}

function generateParameters(antwarConfig, webpackConfig) {
  const publicPath = webpackConfig.output
    ? webpackConfig.output.publicPath
    : "";

  return stats =>
    new Promise(function(resolve) {
      const assets = stats.compilation.assets;
      const cssFiles = Object.keys(assets)
        .map(asset => {
          if (_path.extname(asset) === ".css") {
            return assets[asset].existsAt;
          }

          return null;
        })
        .filter(a => a);
      const jsFiles = [];

      // Copy template configuration to webpack side so HtmlWebpackPlugin picks it up
      const template = {
        cssFiles: [],
        jsFiles: [],
        ...antwarConfig.template,
      };

      const cwd = process.cwd();
      const site = require(_path.join(cwd, antwarConfig.output, "site.js"));
      const parameters = {
        cwd,
        renderPage: site.renderPage,
        allPages: site.allPages,
        output: _path.join(cwd, antwarConfig.output),
        config: antwarConfig,
        cssFiles,
        jsFiles,
        templates: {
          page: {
            ...template,
            // XXX: sync operation
            file: _fs.readFileSync(
              (template && template.file) ||
                _path.join(__dirname, "../../templates/page.ejs"),
              {
                encoding: "utf8",
              }
            ),
            cssFiles: cssFiles.map(
              cssFile => publicPath + "/" + _path.basename(cssFile)
            ),
            jsFiles,
          },
          // TODO: expose to the user?
          interactive: {
            file: _fs.readFileSync(
              _path.join(__dirname, "../../templates/interactive.ejs"),
              {
                encoding: "utf8",
              }
            ),
          },
          interactiveIndex: {
            file: _fs.readFileSync(
              _path.join(__dirname, "../../templates/interactive_index.ejs"),
              {
                encoding: "utf8",
              }
            ),
          },
        },
      };

      resolve(parameters);
    });
}

function writePages(antwarConfig) {
  return parameters =>
    new Promise(function(resolve, reject) {
      const config = parameters.config;
      const assets = config && config.assets ? config.assets : [];

      if (parameters.cssFiles) {
        parameters.cssFiles.forEach(cssFile => {
          assets.push({
            from: cssFile,
            to: "./" + _path.basename(cssFile),
          });
        });
      }

      // get functions to execute
      return async.parallel(
        [write.pages(parameters), write.redirects(parameters)],
        function(err, tasks) {
          if (err) {
            return reject(err);
          }

          return executeTasks(
            _.flatten(tasks).filter(_.identity),
            antwarConfig.maximumWorkers,
            antwarConfig.console.log
          )
            .then(() => resolve(parameters))
            .catch(reject);
        }
      );
    });
}

function executeTasks(tasks, maximumWorkers, log) {
  return new Promise(function(resolve, reject) {
    async.eachLimit(
      tasks,
      maximumWorkers || _os.cpus().length,
      function(o, cb) {
        log("Starting task", o.task);

        workers(o, function(err) {
          log("Finished task", o.task);

          cb(err);
        });
      },
      function(err) {
        log("Tasks finished");

        workerFarm.end(workers);

        if (err) {
          return reject(err);
        }

        return resolve();
      }
    );
  });
}

function removeSiteBundle(outputDirectory) {
  return parameters =>
    new Promise(function(resolve, reject) {
      rimraf(_path.join(process.cwd(), outputDirectory, "site.js"), function(
        err
      ) {
        if (err) {
          return reject(err);
        }

        return resolve(parameters);
      });
    });
}
