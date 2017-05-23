const _ = require('lodash');
const frontmatter = require('front-matter');
const loaderUtils = require('loader-utils');
const markdown = require('../utils/markdown');
const highlight = require('../utils/highlight');
const removeMarkdown = require('remove-markdown');

module.exports = function (source) {
  const result = frontmatter(source);

  result.attributes = result.attributes || {};
  result.preview = generatePreview(result, result.body);
  result.description = generateDescription(result);
  result.keywords = generateKeywords(result);
  result.body = markdown().process(result.body, highlight);

  delete result.frontmatter;

  // TODO: Figure out how to make resolve.alias to work
  return `module.exports = ${JSON.stringify(result)};`.replace(
    /__IMG_START__(.+)__IMG_END__/g, (match, href) => (
      `" + require(${JSON.stringify((loaderUtils.urlToRequest(href)))}) + "`
    )
  );
};

function generatePreview(file, body) {
  let ret = body;

  if (file.attributes && file.attributes.preview) {
    ret = file.attributes.preview;
  }

  return removeMarkdown(ret).slice(0, 100) + '…';
}

function generateDescription(file) {
  if (file.attributes) {
    return file.attributes.description || file.attributes.preview;
  }

  return file.preview;
}

function generateKeywords(file) {
  let keywords;

  if (file.attributes && file.attributes.keywords) {
    keywords = file.attributes.keywords;
  }

  if (_.isString(keywords)) {
    return keywords.split(',');
  }

  return keywords;
}
