// Ported from webpack.js.org
const marked = require('marked');
const parse = require('./parse');

module.exports = function (siteSection) {
  // alter marked renderer to add slashes to beginning so images point at root
  // leanpub expects images without slash...
  const section = siteSection ? '/' + siteSection + '/' : '/';

  const renderer = new marked.Renderer();

  renderer.code = function (code, language, escaped) { // eslint-disable-line no-unused-vars
    // marked.Renderer.prototype.code.call(this, code, language, escaped);
    // TODO: if language is interactive, do something different here
    // TODO: figure out a proper way to extend the old code (escaped etc.)
    // TODO: this should render through react to get the initial markup
    // TODO: figure out how to handle development mode (write separate js file)
    // TODO: figure out how to handle production mode (write separate js file)
    /* console.log(code, language);
    return (
      '<pre class="language-' + language +
      '"><code class="language-' + language +
      '">' + code + '</code></pre>'
    );*/
  };

  renderer.image = function (href, title, text) {
    return '<img src="' + section + href + '" alt="' + text + '">';
  };

  // patch ids (this.options.headerPrefix can be undefined!)
  renderer.heading = function (text, level, raw) {
    const id = raw.toLowerCase().replace(/`/g, '').replace(/[^\w]+/g, '-');

    return `<h${level} class="header">` +
      `<a class="anchor" href="#${id}" id="${id}"></a>` +
      `<span class="text">${text}</span>` +
      `<a class="icon-link" href="#${id}"></a>` +
      `</h${level}>\n`;
  };

  return {
    process(content, highlight) {
      const markedDefaults = {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        sanitizer: null,
        mangle: true,
        smartLists: false,
        silent: false,
        highlight: highlight || false,
        langPrefix: 'lang-',
        smartypants: false,
        headerPrefix: '',
        renderer,
        xhtml: false
      };

      return marked.parser(parse.quotes(content), markedDefaults);
    },

    // Note that this should correspond with renderer.heading
    getAnchors(content) {
      return marked.lexer(content)
        .filter(chunk => chunk.type === 'heading')
        .map(chunk => ({
          title: chunk.text.replace(/`/g, ''),
          id: chunk.text.toLowerCase().replace(/`/g, '').replace(/[^\w]+/g, '-')
        }));
    }
  };
};
