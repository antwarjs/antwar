const _path = require('path');
const _os = require('os');

const _ = require('lodash');
const async = require('async');

const utils = require('./utils');

exports.extras = (o, files) => (cb) => {
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

exports.pages = o => (finalCb) => {
  const data = Object.keys(o.allPages).map(function (page) {
    const p = _path.join(o.output, page);

    return {
      path: p,
      page,
      title: o.allPages[page].title
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

exports.redirects = o => cb => (
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
  })
);
