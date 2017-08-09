const frontmatter = require("front-matter");

module.exports = source =>
  `module.exports = ${JSON.stringify(frontmatter(source))};`;
