const _crypto = require('crypto');
const _fs = require('fs');
const _path = require('path');

const async = require('async');
const cheerio = require('cheerio');
const ejs = require('ejs');
const merge = require('webpack-merge');
const mkdirp = require('mkdirp');
const tmp = require('tmp');
const touch = require('touch');
const webpack = require('webpack');

const utils = require('./utils');
const prettyConsole = require('../libs/pretty_console');

const cwd = process.cwd();

module.exports = function (o, cb) {
  if (o.task === 'copy_assets') {
    utils.copyIfExists.apply(null, o.params.concat([cb]));
  } else if (o.task === 'copy_extra_assets') {
    utils.copyExtraAssets.apply(null, o.params.concat([cb]));
  } else if (o.task === 'write') {
    write(o.params, cb);
  } else if (o.task === 'write_pages') {
    writePages(o.params, cb);
  } else if (o.task === 'write_redirects') {
    writeRedirects(o.params, cb);
  } else {
    cb();
  }
};

function writePages(params, finalCb) {
  async.each(params.pages, function (d, cb) {
    const { page, path } = d;

    processPage({
      page,
      path,
      outputPath: params.output,
      templates: params.templates
    }, cb);
  }, finalCb);
}

function processPage({
  page = '',
  outputPath = '',
  path = '',
  templates = {} // page/interactive
}, cb) {
  const renderPage = require(_path.join(cwd, './.antwar/build/bundleStaticPage.js'));

  renderPage(page, function (err, html) {
    if (err) {
      return cb(err);
    }

    const $ = cheerio.load(html);
    const components = $('.interactive').map((i, el) => {
      const $el = $(el);
      const id = $el.attr('id');
      const props = $el.data('props');

      return {
        id,
        name: `Interactive${i}`,
        path: _path.join(cwd, id),
        props: convertToJS(props)
      };
    }).get();
    const jsFiles = [];

    if (components.length) {
      components.forEach(component => {
        if (!_fs.existsSync(component.path)) {
          prettyConsole.log('Failed to find', component.path);
        }
      });

      // Calculate hash based on filename and section so we can check whether
      // to generate a bundle at all
      const filename = calculateMd5(
        page.split('/').filter(a => a).slice(0, -1).join('/') + components.map(c => c.id).join('')
      );
      const interactivePath = _path.join(outputPath, `${filename}.js`);

      // Attach generated file to template
      jsFiles.push(`/${filename}.js`);

      // If the bundle exists already, skip generating
      if (!_fs.existsSync(interactivePath)) {
        const entry = ejs.compile(templates.interactive.file)({
          components
        });

        // Touch output so that other processes get a clue
        touch.sync(interactivePath);

        // Write to a temporary file so we can point webpack to that
        const tmpFile = tmp.fileSync();

        _fs.writeFile(tmpFile.name, entry);

        // XXX: should it be possible to tweak this? now we are picking
        // the file by convention
        const webpackConfigPath = _path.join(cwd, 'webpack.config.js');
        const webpackConfig = merge(
          require(webpackConfigPath)('interactive'),
          {
            resolve: {
              modulesDirectories: [
                cwd,
                _path.join(cwd, 'node_modules')
              ],
              alias: generateAliases(components)
            },
            resolveLoader: {
              modulesDirectories: [
                cwd,
                _path.join(cwd, 'node_modules')
              ]
            },
            plugins: [
              new webpack.DefinePlugin({
                __DEV__: false
              })
            ]
          }
        );

        // Override webpack configuration to process correctly
        webpackConfig.entry = {
          [filename]: tmpFile.name
        };
        webpackConfig.output = {
          filename: '[name].js',
          path: outputPath
        };

        return webpack(webpackConfig, (err2, stats) => {
          if (err2) {
            return cb(err2);
          }

          if (stats.hasErrors()) {
            return cb(stats.toString('errors-only'));
          }

          // Wrote a bundle, compile through ejs now
          const data = ejs.compile(templates.page.file)({
            webpackConfig: {
              template: {
                ...templates.page,
                jsFiles: [
                  ...templates.page.jsFiles,
                  ...jsFiles
                ]
              },
              html
            }
          });

          return writePage({ path, data, page }, cb);
        });
      }
    }

    // No need to go through webpack so go only through ejs
    const data = ejs.compile(templates.page.file)({
      webpackConfig: {
        template: {
          ...templates.page,
          jsFiles: [
            ...templates.page.jsFiles,
            ...jsFiles
          ]
        },
        html
      }
    });

    return writePage({ path, data, page }, cb);
  });
}

function convertToJS(props) {
  let ret = '';

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

function writePage({
  path,
  data,
  page
}, cb) {
  mkdirp(_path.dirname(path), function (err) {
    if (err) {
      return cb(err);
    }

    return write({ path, data }, function (err2) {
      if (err2) {
        return cb(err2);
      }

      prettyConsole.log('Finished writing page', page);

      return cb();
    });
  });
}

function writeRedirects(params, finalCb) {
  async.each(params.redirects, function (redirect, cb) {
    const from = redirect.from;
    const to = redirect.to;

    prettyConsole.log('Writing redirect', from, to);

    mkdirp(from, function (err) {
      if (err) {
        return cb(err);
      }

      return write({
        path: _path.join(from, 'index.html'),
        data: '<meta http-equiv="refresh" content="0; url=' +
          to + '">\n<link rel="canonical" href="' + to + '" />'
      }, cb);
    });
  }, finalCb);
}

function calculateMd5(input) {
  return _crypto.createHash('md5').update(input).digest('hex');
}

function write(params, cb) {
  _fs.writeFile(params.path, params.data, cb);
}
