const _crypto = require("crypto");
const _fs = require("fs");
const _path = require("path");

const async = require("neo-async");
const cheerio = require("cheerio");
const ejs = require("ejs");
const merge = require("webpack-merge");
const mkdirp = require("mkdirp");
const tmp = require("tmp");
const touch = require("touch");
const rimraf = require("rimraf");
const webpack = require("webpack");

const defaultAntwar = require("../config/default-antwar");
const mergeConfiguration = require("../libs/merge-configuration");

const cwd = process.cwd();

module.exports = function writePages(
  { configurationPaths, environment, pages, outputPath, templates },
  finalCb
) {
  const antwarConfiguration = mergeConfiguration(
    defaultAntwar(),
    require(configurationPaths.antwar)(environment)
  );

  async.each(
    pages,
    ({ page, path }, cb) =>
      processPage(
        {
          configurationPaths,
          antwarConfiguration,
          page,
          path,
          outputPath,
          templates,
        },
        cb
      ),
    finalCb
  );
};

function processPage(
  {
    configurationPaths,
    antwarConfiguration,
    page = "",
    outputPath = "",
    path = "",
    templates = {}, // page/interactive/interactiveIndex
  },
  cb
) {
  const renderPage = require(_path.join(outputPath, "site.js")).renderPage;
  const console = antwarConfiguration.console;

  renderPage(page, function(err, { html, page, context } = {}) {
    if (err) {
      return cb(err);
    }

    const $ = cheerio.load(html);
    const components = $(".interactive")
      .map((i, el) => {
        const $el = $(el);
        const id = $el.attr("id");
        const props = $el.data("props");

        return {
          id,
          name: `Interactive${i}`,
          path: _path.join(cwd, id),
          props: convertToJS(props),
        };
      })
      .get();
    const jsFiles = [];

    if (components.length) {
      // XXX: Should this bail early?
      components.forEach(component => {
        if (!_fs.existsSync(component.path)) {
          console.log("Failed to find", component.path);
        }
      });

      // Calculate hash based on filename and section so we can check whether
      // to generate a bundle at all. Use a relative path so the project directory
      // can be moved around.
      const filename = calculateMd5(
        _path
          .relative(cwd, path)
          .split("/")
          .filter(a => a)
          .slice(0, -1)
          .join("/") + components.map(c => c.id + "=" + c.props).join("")
      );
      const interactivePath = _path.join(outputPath, `${filename}.js`);

      // Attach generated file to template
      jsFiles.push(`/${filename}.js`);

      // If the bundle exists already, skip generating
      if (!_fs.existsSync(interactivePath)) {
        const interactiveIndexEntry = ejs.compile(
          templates.interactiveIndex.file
        )({
          components,
        });
        const entry = ejs.compile(templates.interactive.file)({
          components,
        });

        // Touch output so that other processes get a clue
        touch.sync(interactivePath);

        // Write to a temporary files so we can point webpack to that
        const interactiveEntryTmpFile = tmp.fileSync();
        const entryTmpFile = tmp.fileSync();

        // XXX: convert to async
        _fs.writeFileSync(interactiveEntryTmpFile.name, interactiveIndexEntry);
        _fs.writeFileSync(entryTmpFile.name, entry);

        const interactiveConfig = require(configurationPaths.webpack)(
          "interactive"
        );
        const webpackConfig = merge(interactiveConfig, {
          mode: "production",
          resolve: {
            modules: [cwd, _path.join(cwd, "node_modules")],
            alias: generateAliases(components),
          },
          resolveLoader: {
            modules: [cwd, _path.join(cwd, "node_modules")],
          },
        });

        const interactiveIndexEntryName = `${filename}-interactive-entry`;

        // Override webpack configuration to process correctly
        webpackConfig.entry = {
          [interactiveIndexEntryName]: interactiveEntryTmpFile.name,
          [filename]: entryTmpFile.name,
        };

        // Merge output to avoid overriding publicPath
        webpackConfig.output = merge(interactiveConfig.output, {
          filename: "[name].js",
          path: outputPath,
          publicPath: "/",
          libraryTarget: "umd", // Needed for interactive index exports to work
          globalObject: "this",
        });

        return webpack(webpackConfig, (err2, stats) => {
          if (err2) {
            return cb(err2);
          }

          if (stats.hasErrors()) {
            return cb(stats.toString("errors-only"));
          }

          const assets = stats.compilation.assets;
          const cssFiles = Object.keys(assets)
            .map(asset => {
              if (_path.extname(asset) === ".css") {
                return assets[asset].existsAt;
              }

              return null;
            })
            .filter(a => a)
            .map(cssFile => "/" + _path.basename(cssFile));

          const interactiveIndexPath = _path.join(
            outputPath,
            interactiveIndexEntryName
          );
          const interactiveComponents = require(interactiveIndexPath);
          const renderErrors = [];

          // Render initial HTML for each component
          $(".interactive").each((i, el) => {
            const $el = $(el);
            const props = $el.data("props");

            try {
              $el.html(
                antwarConfiguration.render.interactive({
                  component: interactiveComponents[`Interactive${i}`],
                  props,
                })
              );
            } catch (renderErr) {
              renderErrors.push(renderErr);
            }
          });

          if (renderErrors.length) {
            return cb(renderErrors[0]);
          }

          rimraf.sync(interactiveIndexPath + ".*");

          // Wrote a bundle, compile through ejs now
          const data = ejs.compile(templates.page.file)({
            context: {
              ...context,
              ...page.file,
              ...templates.page,
              cssFiles: [...templates.page.cssFiles, ...cssFiles],
              jsFiles: [...templates.page.jsFiles, ...jsFiles],
              html: $.html(),
            },
          });

          return writePage({ console, path, data, page }, cb);
        });
      }
    }

    // No need to go through webpack so go only through ejs
    const data = ejs.compile(templates.page.file)({
      context: {
        ...context,
        ...page.file,
        ...templates.page,
        jsFiles: [...templates.page.jsFiles, ...jsFiles],
        html,
      },
    });

    return writePage({ console, path, data }, cb);
  });
}

function convertToJS(props) {
  let ret = "";

  Object.keys(props).forEach(prop => {
    const v = props[prop];

    ret += `${prop}: ${JSON.stringify(v)},`;
  });

  return `{${ret}}`;
}

function generateAliases(components) {
  const ret = {};

  components.forEach(({ id, path }) => {
    ret[id] = path;
  });

  return ret;
}

function writePage({ console, path, data }, cb) {
  mkdirp(_path.dirname(path), function(err) {
    if (err) {
      return cb(err);
    }

    return _fs.writeFile(path, data, function(err2) {
      if (err2) {
        return cb(err2);
      }

      console.log("Finished writing page", path);

      return cb();
    });
  });
}

function calculateMd5(input) {
  return _crypto
    .createHash("md5")
    .update(input)
    .digest("hex");
}
