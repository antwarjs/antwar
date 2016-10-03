const _fs = require('fs');
const _path = require('path');

const async = require('async');
const cheerio = require('cheerio');
const ejs = require('ejs');
const mkdirp = require('mkdirp');

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
    prettyConsole.log('Starting to write page', page);

    writePage({
      page,
      path,
      templates: params.templates
    }, cb);
  }, finalCb);
}

function writePage({
  page = '',
  path = '',
  templates = {} // page/interactive
}, cb) {
  const renderPage = require(_path.join(cwd, './.antwar/build/bundleStaticPage.js'));

  renderPage(page.page, function (err, html) {
    if (err) {
      return cb(err);
    }

    const $ = cheerio.load(html);
    const components = $('.interactive').map((i, el) => {
      const id = $(el).attr('id');

      return {
        id,
        name: `Interactive${i}`,
        path: _path.join(cwd, id)
      };
    }).get();

    if (components.length) {
      components.forEach(component => {
        if (!_fs.existsSync(component.path)) {
          prettyConsole.log('Failed to find', component.path);
        }
      });

      const entry = ejs.compile(templates.interactive.file)({
        components
      });

      // TODO: write entry to a tmp file
      console.log('entry', entry);
    }

    const data = ejs.compile(templates.page.file)({
      webpackConfig: { template: templates.page, html }
    });

    return mkdirp(_path.dirname(path), function (err2) {
      if (err2) {
        return cb(err2);
      }

      return write({ path, data }, function (err3) {
        if (err3) {
          return cb(err3);
        }

        prettyConsole.log('Finished writing page', page);

        return cb();
      });
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

function write(params, cb) {
  _fs.writeFile(params.path, params.data, cb);
}
