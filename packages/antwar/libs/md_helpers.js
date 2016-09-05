const marked = require('marked');
const removeMd = require('remove-markdown');

exports.render = function (content) {
  if (content) {
    return marked(content);
  }

  return null;
};

exports.renderPreview = function (content, limit, endChar = '') {
  if (!content) {
    return null;
  }

  const stripped = removeMd(content);

  if (stripped.length > limit) {
    return stripped.substr(0, limit) + endChar;
  }

  return stripped;
};
