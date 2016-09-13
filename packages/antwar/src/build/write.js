const _path = require('path');
const _os = require('os');

const _ = require('lodash');
const async = require('async');
const mkdirp = require('mkdirp');

const utils = require('./utils');

exports.assets = function (o, cb) {
  const assetsDir = _path.join(o.output, 'assets');
  const log = o.config.console.log;
  const info = o.config.console.info;

  log('Creating asset directory');

  mkdirp(assetsDir, function (err) {
    if (err) {
      return cb(err);
    }

    info('Wrote asset directory');

    return cb(null, [
      {
        task: 'copy_assets',
        params: [_path.join(o.cwd, 'assets'), assetsDir]
      }
    ]);
  });
};

exports.extraAssets = function (o, cb) {
  cb(null, [
    {
      task: 'copy_extra_assets',
      params: [o.output, o.config && o.config.assets]
    }
  ]);
};

exports.indices = function (o, finalCb) {
  const config = o.config;
  const log = config.console.log;
  const info = config.console.info;

  async.map(_.keys(config.paths), function (pathRoot, cb) {
    const p = _path.join(o.output, pathRoot);

    log('Writing index directory', p);

    mkdirp(p, function (err) {
      if (err) {
        return cb(err);
      }

      info('Wrote index directory');

      // index is a special case
      if (pathRoot === '/') {
        pathRoot = ''; // eslint-disable-line no-param-reassign
      }

      // XXX: rendering isn't parallel
      return o.renderPage(pathRoot, function (err2, html) {
        if (err2) {
          return cb(err2);
        }

        return cb(null, {
          task: 'write',
          params: {
            path: _path.join(o.output, pathRoot, 'index.html'),
            data: html
          }
        });
      });
    });
  }, finalCb);
};

exports.extras = function (o, files, cb) {
  if (!files || !files.length) {
    return cb();
  }

  return cb(null, _.flatten(files.map(function (fileCollection) {
    return _.map(fileCollection, function (fileContent, fileName) {
      return {
        task: 'write',
        params: {
          path: _path.join(o.output, fileName),
          data: fileContent
        }
      };
    });
  })));
};

exports.pages = function (o, finalCb) {
  const data = Object.keys(o.allPaths).map(function (page) {
    const p = _path.join(o.output, page);

    return {
      path: p,
      page
    };
  });

  async.map(data, function (d, cb) {
    const p = d.path;

    // skip writing index/index.html
    if (p.split('/').slice(-1)[0] === 'index') {
      return cb();
    }

    // XXX: mkdirp could be pushed to task
    return mkdirp(p, function (err) {
      if (err) {
        return cb(err);
      }

      return cb(null, {
        path: _path.join(p, 'index.html'),
        page: d.page
      });
    });
  }, function (err, d) {
    if (err) {
      return finalCb(err);
    }

    return finalCb(null, _.chunk(d, _os.cpus().length).map(function (partition) {
      return {
        task: 'write_pages',
        params: {
          pages: partition,
          template: o.template
        }
      };
    }));
  });
};

exports.redirects = function (o, cb) {
  cb(null, {
    task: 'write_redirects',
    params: {
      redirects: utils.calculateRedirects(o.config.paths).map(function (d) {
        return {
          from: _path.join(o.output, d.from),
          to: '/' + d.to
        };
      })
    }
  });
};
