var assert = require('assert');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var async = require('async');
var cpr = require('cpr');
var cp = require('cp');


exports.copyExtraAssets = function(buildDir, assets, cb) {
  assets = assets || [];

  async.forEach(assets, function(asset, cb) {
    var from = asset.from;
    var stats = fs.statSync(from);

    if(from.indexOf('./') === 0 && stats.isFile()) {
        cp(from, path.join(buildDir, asset.to, from), cb);
    }
    else {
        cpr(from, path.join(buildDir, asset.to), cb);
    }
  }, cb);
};

exports.copyIfExists = function(from, to, cb) {
  fs.exists(from, function(exists) {
    if(exists) {
      cpr(from, to, cb);
    }
    else {
      cb();
    }
  });
};

function calculateRedirects(paths) {
  return [].concat.apply([], _.map(paths, function(values, path) {
    return _.map(values.redirects, function(v, k) {
      var from = path + '/' + k;

      // Redirect to any other section
      if(v[0] === '/') {
        return {
          from : from,
          to: v.slice(1) // strip /
        };
      }

      // Redirect to the same section
      return {
        from: from,
        to: path + '/' + v
      };
    }).filter(_.identity);
  }));
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
