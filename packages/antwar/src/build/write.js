const _path = require('path');
const _os = require('os');

const _ = require('lodash');
const async = require('async');
const mkdirp = require('mkdirp');

const utils = require('./utils');

exports.assets = o => cb => {
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

exports.copyExtraAssets = (output, assets) => cb => {
  cb(null, [
    {
      task: 'copy_extra_assets',
      params: [output, assets]
    }
  ]);
};

exports.extras = (o, files) => cb => {
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

exports.pages = o => finalCb => {
  const data = Object.keys(o.allPaths).map(function (page) {
    const p = _path.join(o.output, page);

    return {
      path: p,
      page,
      title: o.allPaths[page]['title']
    };
  });

  async.map(data, function (d, cb) {
    // avoid writing index/index.html and write index.html instead
    return cb(null, {
      path: d.path.split('/').slice(-1)[0] === 'index' ?
        _path.join(d.path, '..', 'index.html') :
        _path.join(d.path, 'index.html'),
      page: d.page,
      title: d.title
    });
  }, function (err, d) {
    if (err) {
      return finalCb(err);
    }

    return finalCb(null, _.chunk(d, _os.cpus().length).map(function (partition) {
      return {
        task: 'write_pages',
        params: {
          output: o.output,
          pages: partition,
          templates: o.templates
        }
      };
    }));
  });
};

exports.redirects = o => cb => {
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
