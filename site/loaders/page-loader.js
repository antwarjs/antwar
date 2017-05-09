const _ = require('lodash');
const frontmatter = require('front-matter');
const markdown = require('../utils/markdown');
const highlight = require('../utils/highlight');
const removeMarkdown = require('remove-markdown');

module.exports = function (source) {
  const result = frontmatter(source);

  result.attributes = result.attributes || {};
  result.preview = generatePreview(result); // Generate before processing to html
  result.body = markdown().process(result.body, highlight);
  result.description = generateDescription(result);
  result.keywords = generateKeywords(result);

  return `module.exports = ${JSON.stringify(result)};`;
};

function generatePreview(file) {
  let ret = file.body;

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
