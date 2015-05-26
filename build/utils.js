'use strict';
var path = require('path');

var async = require('async');
var cpr = require('cpr');


exports.copyExtraAssets = function(buildDir, assets, cb) {
  assets = assets || [];

  async.forEach(assets, function(asset, cb) {
    cpr(asset.from, path.join(buildDir, asset.to), cb);
  }, cb);
};
