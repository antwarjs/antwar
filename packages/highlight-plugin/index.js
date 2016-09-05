'use strict';

module.exports = function() {
  return {
    postProcessPages: function(items) {
      var Prism = require('prismjs');
      var languages = require('prism-languages');
      var highlight = Prism.highlight;
      var _ = require('lodash');
      var he = require('he');
      var cheerio = require('cheerio');

      _.each(items, function (item) {
        if(!item.content) {
          return;
        }

        var $ = cheerio.load(item.content);

        $('code').replaceWith(function(i, e) {
            var defaultLanguage = 'markup';
            var $e = $(e);
            var text = $e.text();
            var language = $e.attr('class');
            var result;

            if(language) {
              language = language.split('-');
              language = language.length > 1 ? language[1] : defaultLanguage;
            }
            else {
              return $('<code>' + he.encode(text) + '</code>');
            }

            if(language === 'html') {
              language = 'markup';
            }

            if(!languages[language]) {
              console.warn('Failed to find language definition', language);

              return $('<code>' + he.encode(text) + '</code>');
            }

            try {
              result = highlight(text, languages[language]);
            }
            catch(e) {
              console.warn('Failed to highlight, defaulting to', defaultLanguage);

              try {
                result = highlight(text, languages[defaultLanguage]);
              }
              catch(e) {
                result = text;
              }
            }

            return $e.html(result);
        });

        item.content = $.html();
      });

      return items;
    }
  };
};

