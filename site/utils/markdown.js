// Ported from webpack.js.org
const marked = require('marked');
const parse = require('./parse');

module.exports = function () {
  const renderer = new marked.Renderer();

  renderer.image = function (href, title, text) {
    return `<img src="__IMG_START__${href}__IMG_END__" alt="${text}" class="inline-img" />`;
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
