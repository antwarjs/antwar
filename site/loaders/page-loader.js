const frontmatter = require('front-matter');
const markdown = require('../utils/markdown');
const highlight = require('../utils/highlight');

module.exports = function (source) {
  const result = frontmatter(source);

  result.attributes = result.attributes || {};
  result.body = markdown().process(result.body, highlight);

  return `module.exports = ${JSON.stringify(result)};`;
};
