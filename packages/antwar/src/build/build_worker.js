const _crypto = require("crypto");
const _fs = require("fs");
const _path = require("path");

const async = require("async");
const cheerio = require("cheerio");
const ejs = require("ejs");
const merge = require("webpack-merge");
const mkdirp = require("mkdirp");
const tmp = require("tmp");
const touch = require("touch");
const rimraf = require("rimraf");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const webpack = require("webpack");

const prettyConsole = require("../libs/pretty_console");

const cwd = process.cwd();

module.exports = function(o, cb) {
  if (o.task === "write") {
    write(o.params, cb);
  } else if (o.task === "write_pages") {
    writePages(o.params, cb);
  } else if (o.task === "write_redirects") {
    writeRedirects(o.params, cb);
  } else {
    cb();
  }
};

function writePages(params, finalCb) {
  async.each(
    params.pages,
    (d, cb) => {
      const { page, path } = d;

      processPage(
        {
          page,
          path,
          outputPath: params.output,
          templates: params.templates
        },
        cb
      );
    },
    finalCb
  );
}

function processPage(
  {
    page = "",
    outputPath = "",
    path = "",
    templates = {} // page/interactive/interactiveIndex
  },
  cb
) {
  const renderPage = require(_path.join(outputPath, "site.js")).renderPage;

  renderPage(page, function(err, { html, page }) {
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
          props: convertToJS(props)
        };
      })
      .get();
    const jsFiles = [];

    if (components.length) {
      // XXX: Should this bail early?
      components.forEach(component => {
        if (!_fs.existsSync(component.path)) {
          prettyConsole.log("Failed to find", component.path);
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
          components
        });
        const entry = ejs.compile(templates.interactive.file)({
          components
        });

        // Touch output so that other processes get a clue
        touch.sync(interactivePath);

        // Write to a temporary files so we can point webpack to that
        const interactiveEntryTmpFile = tmp.fileSync();
        const entryTmpFile = tmp.fileSync();

        _fs.writeFile(interactiveEntryTmpFile.name, interactiveIndexEntry);
        _fs.writeFile(entryTmpFile.name, entry);

        // XXX: should it be possible to tweak this? now we are picking
        // the file by convention
        const webpackConfigPath = _path.join(cwd, "webpack.config.js");
        const interactiveConfig = require(webpackConfigPath)("interactive");
        const webpackConfig = merge(interactiveConfig, {
          resolve: {
            modules: [cwd, _path.join(cwd, "node_modules")],
            alias: generateAliases(components)
          },
          resolveLoader: {
            modules: [cwd, _path.join(cwd, "node_modules")]
          },
          plugins: [
            new webpack.DefinePlugin({
              __DEV__: false
            })
          ]
        });

        const interactiveIndexEntryName = `${filename}-interactive-entry`;

        // Override webpack configuration to process correctly
        webpackConfig.entry = {
          [interactiveIndexEntryName]: interactiveEntryTmpFile.name,
          [filename]: entryTmpFile.name
        };

        // Merge output to avoid overriding publicPath
        webpackConfig.output = merge(interactiveConfig.output, {
          filename: "[name].js",
          path: outputPath,
          publicPath: "/",
          libraryTarget: "umd" // Needed for interactive index exports to work
        });

        return webpack(webpackConfig, (err2, stats) => {
          if (err2) {
            return cb(err2);
          }

          if (stats.hasErrors()) {
            return cb(stats.toString("errors-only"));
          }

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
                ReactDOMServer.renderToStaticMarkup(
                  React.createElement(
                    interactiveComponents[`Interactive${i}`],
                    props
                  )
                )
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
            htmlWebpackPlugin: {
              options: {
                context: {
                  ...page.file,
                  ...templates.page,
                  jsFiles: [...templates.page.jsFiles, ...jsFiles]
                }
              }
            },
            webpackConfig: {
              html: $.html()
            }
          });

          return writePage({ path, data, page }, cb);
        });
      }
    }

    // No need to go through webpack so go only through ejs
    const data = ejs.compile(templates.page.file)({
      htmlWebpackPlugin: {
        options: {
          context: {
            ...page.file,
            ...templates.page,
            jsFiles: [...templates.page.jsFiles, ...jsFiles]
          }
        }
      },
      webpackConfig: {
        html
      }
    });

    return writePage({ path, data }, cb);
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

function writePage({ path, data }, cb) {
  mkdirp(_path.dirname(path), function(err) {
    if (err) {
      return cb(err);
    }

    return write({ path, data }, function(err2) {
      if (err2) {
        return cb(err2);
      }

      prettyConsole.log("Finished writing page", path);

      return cb();
    });
  });
}

function writeRedirects(params, finalCb) {
  async.each(
    params.redirects,
    function(redirect, cb) {
      const from = redirect.from;
      const to = redirect.to;

      prettyConsole.log("Writing redirect", from, to);

      mkdirp(from, function(err) {
        if (err) {
          return cb(err);
        }

        return write(
          {
            path: _path.join(from, "index.html"),
            data:
              '<meta http-equiv="refresh" content="0; url=' +
              to +
              '">\n<link rel="canonical" href="' +
              to +
              '" />'
          },
          cb
        );
      });
    },
    finalCb
  );
}

function calculateMd5(input) {
  return _crypto
    .createHash("md5")
    .update(input)
    .digest("hex");
}

function write(params, cb) {
  _fs.writeFile(params.path, params.data, cb);
}
