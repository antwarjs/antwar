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
      template: params.template
    }, cb);
  }, finalCb);
}

function writePage({
  page = '',
  path = '',
  template = ''
}, cb) {
  const renderPage = require(_path.join(cwd, './.antwar/build/bundleStaticPage.js'));

  renderPage(page.page, function (err, html) {
    if (err) {
      return cb(err);
    }

    const $ = cheerio.load(html);
    const interactiveSections = $('.interactive').map((i, el) => {
      return _path.join(cwd, $(el).attr('id'));
    }).get();

    interactiveSections.forEach(s => {
      if (!_fs.existsSync(s)) {
        prettyConsole.log('Failed to find', s);
      }
    });

    // TODO: resolve full paths for bundling
    console.log('interactive sections', interactiveSections);

    const data = ejs.compile(template.file)({
      webpackConfig: { template, html }
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
