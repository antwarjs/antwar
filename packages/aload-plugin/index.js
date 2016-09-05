'use strict';
var _ = require('lodash');
var he = require('he');

module.exports = function() {
  return {
    bodyContent: function (options) {
      var React = require('react');
      return React.createClass({
        render: function() {
          return React.createElement('script', {dangerouslySetInnerHTML: {__html: 'function aload(t){"use strict";t=t||window.document.querySelectorAll("[data-aload]"),void 0===t.length&&(t=[t]);var a,e=0,r=t.length;for(e;r>e;e+=1)a=t[e],a["LINK"!==a.tagName?"src":"href"]=a.getAttribute("data-aload"),a.removeAttribute("data-aload");return t};window.onload=function(){aload();};'}});
        }
      });
    },
    itemProcessItems: function (items, cheerio) {
      var cheerio = require('cheerio');
      _.each(items, function(item) {
        var $ = cheerio.load(item.content);
        $('img').each(function(i, e) {
            var el = $(this);
            var src = el.attr('src');
            el.removeAttr('src');
            el.attr('data-aload', src);
        });
        item.content = $.html();
      });
      return items;
    }
  };
};
