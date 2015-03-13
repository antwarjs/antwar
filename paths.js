'use strict';
var _ = require('lodash');

var themeFunctions = require('theme/functions') || {};

var MdHelper = require('./elements/MdHelper');
var postHooks = require('./postHooks');
var siteFunctions = require('config').site.functions || {} ;


function allPosts() {
  var returnObj = {};

  var posts = _.map(postReq().keys(), function(name) {
    return [
      name,
      postReq()(name),
    ];
  });

  // Include drafts if we're not in prod
  var drafts = [];
  if(__DEV__) {
    var req = draftReq();
    if(req) {
      drafts = _.map(req.keys(), function(name) {
        return [
          name,
          _.assign({draft: true}, draftReq()(name)),
        ];
      });
    }
  }

  // TODO: build plugin arch here
  posts = generateNextPrev(posts);
  drafts = generateNextPrev(drafts);

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

// TODO: push into a plugin
function generateNextPrev(posts) {
  var len = posts.length;

  return posts.map(function(fileArr, i) {
    var post = fileArr[1];

    if(i > 0) {
      post.prev = posts[1][i - 1];
    }
    if(i < len - 2) {
      post.next = posts[1][i + 1];
    }

    return fileArr;
  });
}

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
  return require.context('posts', false, /^\.\/.*\.md$/);
}
exports.postReq = postReq;

function draftReq() {
  try {
    return require.context('drafts', false, /^\.\/.*\.md$/);
  }
  catch(e) {}
}
exports.draftReq = draftReq;

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
      return file.preview || MdHelper.getContentPreview(file.__content);
    },
    content: function(file, fileName) {
      return MdHelper.render(file.__content);
    },
  }, themeFunctions, siteFunctions);

  var url = functions.url(file, fileName);
  var date = functions.date(file, fileName);
  var preview = functions.preview(file, fileName);
  var content = functions.content(file, fileName);

  return _.assign({}, file, {
    url: url,
    content: content,
    date: date,
    preview: preview
  });
}
