const _fs = require("fs");
const _os = require("os");
const _path = require("path");

const async = require("neo-async");
const rimraf = require("rimraf");
const webpack = require("webpack");
const workerFarm = require("worker-farm");

const workers = workerFarm(require.resolve("./worker"));

const write = require("./write");

module.exports = function({ environment, configurations, configurationPaths }) {
  return new Promise(function(resolve, reject) {
    const output = configurations.antwar.output;

    if (!output) {
      return reject(new Error("Missing output directory"));
    }

    return runWebpack(require("../config/build")({ configurations }))
      .then(generateParameters(configurations.antwar, configurations.webpack))
      .then(writePages(environment, configurations.antwar, configurationPaths))
      .then(removeSiteBundle(output))
      .then(resolve)
      .catch(reject);
  });
};

function runWebpack(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
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

function generateParameters(antwarConfiguration, webpackConfiguration) {
  const publicPath = webpackConfiguration.output
    ? webpackConfiguration.output.publicPath
    : "";

  return stats =>
    new Promise(resolve => {
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
        ...antwarConfiguration.template,
      };

      const cwd = process.cwd();
      const site = require(_path.join(
        cwd,
        antwarConfiguration.output,
        "site.js"
      ));
      const parameters = {
        cwd,
        renderPage: site.renderPage,
        allPages: site.allPages,
        output: _path.join(cwd, antwarConfiguration.output),
        config: antwarConfiguration,
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

function writePages(environment, antwarConfiguration, configurationPaths) {
  return parameters =>
    new Promise((resolve, reject) => {
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

      write.pages(parameters, environment, configurationPaths)((err, tasks) => {
        if (err) {
          return reject(err);
        }

        executeTasks(
          tasks,
          antwarConfiguration.maximumWorkers,
          antwarConfiguration.console.log
        )
          .then(() => resolve(parameters))
          .catch(reject);
      });
    });
}

function executeTasks(tasks, maximumWorkers, log) {
  return new Promise((resolve, reject) => {
    async.eachLimit(
      tasks,
      maximumWorkers || _os.cpus().length,
      (o, cb) => {
        log("Starting to write pages");

        workers(o, err => {
          log("Finished writing pages");

          cb(err);
        });
      },
      err => {
        workerFarm.end(workers);

        if (err) {
          return reject(err);
        }

        log("BUILD FINISHED!");

        return resolve();
      }
    );
  });
}

function removeSiteBundle(outputDirectory) {
  return parameters =>
    new Promise((resolve, reject) => {
      rimraf(_path.join(process.cwd(), outputDirectory, "site.js"), err => {
        if (err) {
          return reject(err);
        }

        return resolve(parameters);
      });
    });
}
