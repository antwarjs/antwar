// Ported from webpack.js.org
const Prism = require('prismjs');
const languages = require('prism-languages');

const highlight = Prism.highlight;

if (typeof document !== 'undefined') {
  // disable automatic highlight on content loaded
  const script = document.currentScript ||
    [].slice.call(document.getElementsByTagName('script')).pop();
  script.setAttribute('data-manual', '');
}

module.exports = function (code, language = 'bash') {
  try {
    return highlight(code, languages[language]);
  } catch (error) {
    if (!languages[language]) {
      console.warn('Prism does not support this language: ', language);
    } else {
      console.warn('Prism failed to highlight: ', error);
    }
  }

  return code;
};
