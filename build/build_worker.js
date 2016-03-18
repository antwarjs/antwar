'use strict';
var _fs = require('fs');
var _path = require('path');

var async = require('async');
var mkdirp = require('mkdirp');

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
    write(o.params, cb);
  }
  else if(o.task === 'write_pages') {
    writePages(o.params, cb);
  }
  else if(o.task === 'write_redirects') {
    writeRedirects(o.params, cb);
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

function writePages(params, cb) {
  var cwd = process.cwd();
  var renderPage = require(_path.join(cwd, './.antwar/build/bundleStaticPage.js'));

  async.each(params.pages, function(page, cb) {
    // XXX: why page can be null?
    if(page) {
      // TODO: use user defined logger instead
      console.log('Starting to write page', page.page);

      renderPage(page.page, function(err, html) {
        if(err) {
          return cb(err);
        }

        write({
          path: page.path,
          data: html
        }, function(err) {
          if(err) {
            return cb(err);
          }

          // TODO: use user defined logger instead
          console.log('Finished writing page', page.page);

          cb();
        });
      });
    }
    else {
      cb();
    }
  }, cb);
}

function writeRedirects(params, cb) {
  async.each(params.redirects, function(redirect, cb) {
    var from = redirect.from;
    var to = redirect.to;

    console.log('Writing redirect', from, to);

    mkdirp(from, function(err) {
      if(err) {
        return cb(err);
      }

      write({
        path: _path.join(from, 'index.html'),
        data: '<meta http-equiv="refresh" content="0; url=' + to + '">\n<link rel="canonical" href="' + to + '" />'
      }, cb);
    });
  }, cb);
}

function write(params, cb) {
  _fs.writeFile(params.path, params.data, cb);
}
