'use strict';
var _fs = require('fs');
var _path = require('path');

var utils = require('./utils');

var cwd = process.cwd();

module.exports = function(o, cb) {
  if(o.task === 'copy_assets') {
    utils.copyIfExists.apply(null, o.params.concat([cb]));
  }
  else if(o.task === 'write_main') {
    writeMain(o.params, cb);
  }
  else if(o.task === 'copy_extra_assets') {
    utils.copyExtraAssets.apply(null, o.params.concat([cb]));
  }
  else if(o.task === 'write') {
    writeIndex(o.params, cb);
  }
  else {
    cb();
  }
};

function writeMain(params, cb) {
  var assetsDir = params.assetsDir;
  var mainPath = params.mainPath;

  _fs.exists(mainPath, function(exists) {
    if(!exists) {
      return cb();
    }

    _fs.readFile(mainPath, function(err, data) {
      if(err) {
        return cb(err);
      }

      _fs.writeFile(_path.join(assetsDir, 'main.css'), data, cb);
    });
  });
}

function writeIndex(params, cb) {
  _fs.writeFile(params.path, params.data, cb);
}
