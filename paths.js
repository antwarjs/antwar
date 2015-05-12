'use strict';
var _ = require('lodash');

var themeFunctions = require('theme/functions') || {};

var MdHelper = require('./elements/MdHelper');
var postHooks = require('./postHooks');
var siteFunctions = require('config').functions || {} ;
var he = require('he');

function allPosts() {
  var returnObj = {};
  var postModules = postReq();

  var posts = _.map(postModules.keys(), function(name) {
    return [
      name,
      postModules(name),
    ];
  });

  // Include drafts if we're not in prod
  var drafts = [];
  if(__DEV__) {
    var draftModules = draftReq();

    if(draftModules) {
      drafts = _.map(draftModules.keys(), function(name) {
        return [
          name,
          _.assign({draft: true}, draftModules(name)),
        ];
      });
    }
  }

  posts = postHooks.preProcessPosts(posts);

  // Build some nice objects from the files
  _.each(posts.concat(drafts), function(fileArr) {
    var post = fileArr[1];
    var fileName = fileArr[0].slice(2); // remove the './'

    // Name is on format ./YYYY-MM-DD-url_title.md
    // TODO: Configurable file name standard
    var processedFile = processPost(
      post,
      fileName
    );

    returnObj[processedFile.url] = processedFile;
  });
  returnObj = postHooks.postProcessPosts(returnObj);

  return returnObj;
}
exports.allPosts = allPosts;

function allPages() {
  // TODO: allow hooks on page processing
  var req = pageReq();
  var pages = {};

  _.each(req.keys(), function(name) {
    // name is format ./url_title.ext
    var file = req(name); // require the file
    var fileName = name.slice(2); // remove the './'

    var content = renderContent(file);

    // url is filename minus extension
    var url = _.kebabCase(fileName.split('.')[0]);

    // title is the capitalized url
    var title = _.capitalize(url.replace(/\-/g, ' '));

    // rewrite the index file
    if(url === 'index') {
      url = '/';
    }

    pages[url] = {
      url: url,
      fileName: fileName,
      title: title,
      content: content,
    };
  });
  pages = postHooks.postProcessPages(pages);
  return pages;
}
exports.allPages = allPages;

function postForPath(path) {
  return allPosts()[path];
}
exports.postForPath = postForPath;

function pageForPath(path) {
  return allPages()[path];
}
exports.pageForPath = pageForPath;

function pageReq() {
  return require.context('pages', false);
}
exports.pageReq = pageReq;

function postReq() {
  return require.context('posts', true, /^\.\/.*\.md$/);
}

function draftReq() {
  try {
    return require.context('drafts', true, /^\.\/.*\.md$/);
  }
  catch(e) {}
}

function renderContent(content) {
  return MdHelper.render(content);
}
exports.renderContent = renderContent;

function processPost(file, fileName) {
  // TODO: implement nicer hooks to configurable functions
  var functions = _.assign({
    url: function(file, fileName) {
      return fileName.slice(0, fileName.length - 3);
    },
    date: function(file, fileName) {
      return file.date || fileName.slice(0, 10);
    },
    preview: function(file, fileName) {
      if (file.preview) {
        return file.preview;
      }
      else {
        var stripped = he.decode(file.content.replace(/<(?:.|\n)*?>/gm, ''));
        if (stripped.length > 100) {
          return stripped.substr(0, 100) + '…';
        }
        else {
          return stripped;
        }
      }
      return file.preview || MdHelper.getContentPreview(file.__content);
    },
    content: function(file, fileName) {
      return MdHelper.render(file.__content);
    },
  }, themeFunctions, siteFunctions);

  // _.assign cannot be used here as otherwise some references (ie. prevnext)
  // won't get updated
  file.url = functions.url(file, fileName);
  file.date = functions.date(file, fileName);
  file.content = functions.content(file, fileName);
  file.preview = functions.preview(file, fileName);

  return file;
}
