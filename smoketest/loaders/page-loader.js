const frontmatter = require('front-matter');
const marked = require('marked');

module.exports = function (source) {
  const result = frontmatter(source);

  result.attributes = result.attributes || {};
  result.body = marked(result.body);

  return `module.exports = ${JSON.stringify(result)};`;
};
