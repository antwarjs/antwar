const _ = require('lodash');
const frontmatter = require('front-matter');
const markdown = require('../utils/markdown');
const highlight = require('../utils/highlight');

module.exports = function (source) {
  const result = frontmatter(source);

  result.attributes = result.attributes || {};
  result.body = markdown().process(result.body, highlight);
  result.preview = generatePreview(result);
  result.description = generateDescription(result);
  result.keywords = generateKeywords(result);

  return `module.exports = ${JSON.stringify(result)};`;
};

function generatePreview(file) {
  if (file.attributes && file.attributes.preview) {
    return file.attributes.preview;
  }

  return file.body && file.body.slice(0, 100) + '…';
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
