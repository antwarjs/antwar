module.exports = function () {
  return {
    postProcessPages(items) {
      const Prism = require('prismjs');
      const languages = require('prism-languages');

      const highlight = Prism.highlight;
      const _ = require('lodash');
      const he = require('he');
      const cheerio = require('cheerio');

      _.each(items, function (item) {
        if (!item.content) {
          return;
        }

        const $ = cheerio.load(item.content);

        $('code').replaceWith(function (i, e) {
          const defaultLanguage = 'markup';
          const $e = $(e);
          const text = $e.text();
          let language = $e.attr('class');
          let result;

          if (language) {
            language = language.split('-');
            language = language.length > 1 ? language[1] : defaultLanguage;
          } else {
            return $('<code>' + he.encode(text) + '</code>');
          }

          if (language === 'html') {
            language = 'markup';
          }

          if (!languages[language]) {
            console.warn('Failed to find language definition', language);

            return $('<code>' + he.encode(text) + '</code>');
          }

          try {
            result = highlight(text, languages[language]);
          } catch (err) {
            console.warn('Failed to highlight, defaulting to', defaultLanguage);

            try {
              result = highlight(text, languages[defaultLanguage]);
            } catch (err2) {
              result = text;
            }
          }

          return $e.html(result);
        });

        item.content = $.html(); // eslint-disable-line no-param-reassign
      });

      return items;
    }
  };
};

