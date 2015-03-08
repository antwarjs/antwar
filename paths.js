'use strict';
var _ = require('lodash');

var themeFunctions = require('theme/functions') || {};

var MdHelper = require('./elements/MdHelper');


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
  if(process.env.NODE_ENV !== 'production') {
    var req = draftReq();

    drafts = _.map(req.keys(), function(name) {
      return [
        name,
        _.assign({draft: true}, draftReq()(name)),
      ];
    });
  }

  // Build some nice objects from the files
  _.each(posts.concat(drafts), function(fileArr) {
    // Name is on format ./YYYY-MM-DD-url_title.md
    // TODO: Configurable file name standard
    var processedFile = processPost(
      fileArr[1],
      fileArr[0].slice(2) // remove the './'
    );

    returnObj[processedFile.url] = processedFile;
  });

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

  // clean the filename to get the url
  var url;
  if(themeFunctions.url) {
    url = themeFunctions.url(file, fileName);
  }
  else {
    // XXXXX: use a path opt to cut the ext instead?
    url = fileName.slice(0, fileName.length - 3);
  }

  // get the date from the file name if it's not in the frontmatter
  var date;
  if(themeFunctions.date) {
    date = themeFunctions.date(file, fileName);
  }
  else {
    date = file.date || fileName.slice(0, 10);
  }

  // get the content
  var content = MdHelper.render(file.__content);

  // generate the preview
  var preview;
  if(themeFunctions.preview) {
    preview = themeFunctions.preview(file, fileName);
  }
  else {
    preview = file.preview || MdHelper.getContentPreview(file.__content);
  }

  return _.assign({}, file, {
    url: url,
    content: content,
    date: date,
    preview: preview
  });
}
