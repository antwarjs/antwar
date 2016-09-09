const assert = require('assert');
const fs = require('fs');
const _path = require('path');
const _ = require('lodash');

const async = require('async');
const cpr = require('cpr');
const cp = require('cp');

exports.copyExtraAssets = function (buildDir, assets = [], finalCb) {
  async.forEach(assets, function (asset, cb) {
    const from = asset.from;
    const stats = fs.statSync(from);

    if (from.indexOf('./') === 0 && stats.isFile()) {
      cp(from, _path.join(buildDir, asset.to, from), cb);
    } else {
      cpr(from, _path.join(buildDir, asset.to), cb);
    }
  }, finalCb);
};

exports.copyIfExists = function (from, to, cb) {
  fs.exists(from, function (exists) {
    if (exists) {
      cpr(from, to, cb);
    } else {
      cb();
    }
  });
};

function calculateRedirects(paths) {
  return [].concat // eslint-disable-line prefer-spread
    .apply([], _.map(paths, function (values, path) {
      return _.map(values.redirects, function (v, k) {
        const from = path + '/' + k;

        // Redirect to any other section
        if (v[0] === '/') {
          return {
            from,
            to: v.slice(1) // strip /
          };
        }

        // Redirect to the same section
        return {
          from,
          to: path + '/' + v
        };
      }).filter(_.identity);
    })
  );
}

exports.calculateRedirects = calculateRedirects;

// TODO: push to separate tests
assert.deepEqual(calculateRedirects({
  foo: {},
  demo: {
    redirects: {
      foo: 'bar'
    }
  }
}), [
  {
    from: 'demo/foo',
    to: 'demo/bar'
  }
]);
