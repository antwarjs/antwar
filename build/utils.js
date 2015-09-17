'use strict';
var fs = require('fs');
var path = require('path');

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
