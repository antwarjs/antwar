'use strict';

module.exports = function(o) {
  o = o || {};
  return {
    bodyContent: o.bodyContent || null,
    // since urls can get modified by other hooks, we need to
    // process after that
    postProcessPages: generatePrevNext,
  };
};

module.exports.bodyContent = function(o) {
  var bodyOptions = {
    previous: o.previous || function() {
      return '';
    },
    previousUrl: o.previousUrl || id,
    next: o.next || function() {
      return '';
    },
    nextUrl: o.nextUrl || id,
  };

  return bodyContent.bind(null, bodyOptions);
}

function bodyContent(generalOptions, options) {
  var React = require('react');

  var currentPath = options.currentPath;
  if(!currentPath) {
    return null;
  } else {
    var previousPath = currentPath.prev;
    var prev = previousPath && previousPath.url;
    var nextPath = currentPath.next;
    var next = nextPath && nextPath.url;

    return React.createClass({
      render: function () {
        var links = [];

        if(prev) {
          links.push(
            React.createElement('a', {
              key: 'previous-page',
              href: generalOptions.previousUrl(prev),
              className: 'previous-page'
            }, generalOptions.previous(previousPath))
          );
        }
        if(next) {
          links.push(
            React.createElement('a', {
              key: 'next-page',
              href: generalOptions.nextUrl(next),
              className: 'next-page'
            }, generalOptions.next(nextPath))
          );
        }

        if(links.length) {
          return React.createElement('div', {
            className: 'prevnext-pages'
          }, links);
        }

        return null;
      }
    });
  }
}

function generatePrevNext(items) {
  var len = items.length;

  return items.map(function(item, i) {
    var prevItem = i > 0 ? items[i - 1] : {};
    var nextItem = i < len - 1 ? items[i + 1] : {};

    item.prev = prevItem.section === item.section ? prevItem : undefined;
    item.next = nextItem.section === item.section ? nextItem : undefined;

    return item;
  });
}

function id(a) {return a;}
