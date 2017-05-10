const _ = require('lodash');

module.exports = function (o) {
  o = o || {}; // eslint-disable-line no-param-reassign

  return {
    bodyContent: o.bodyContent || null,
    // since urls can get modified by other hooks, we need to
    // process after that
    processPages: function generatePrevNext(items) {
      const len = items.length;

      return items.map(function (item, i) {
        const previousItem = i > 0 ? items[i - 1] : {};
        const nextItem = i < len - 1 ? items[i + 1] : {};
        const ret = _.cloneDeep(item);

        ret.previous = previousItem.section === item.section ? previousItem : undefined;
        ret.next = nextItem.section === item.section ? nextItem : undefined;

        return ret;
      });
    }
  };
};

module.exports.bodyContent = function (o) {
  const bodyOptions = {
    previous: o.previous || function () {
      return '';
    },
    previousUrl: o.previousUrl || id,
    next: o.next || function () {
      return '';
    },
    nextUrl: o.nextUrl || id
  };

  return bodyContent.bind(null, bodyOptions);
};

function bodyContent(generalOptions, options) {
  const React = require('react');

  const currentPath = options.currentPath;
  if (!currentPath) {
    return null;
  }

  const previousPath = currentPath.previous;
  const previous = previousPath && previousPath.url;
  const nextPath = currentPath.next;
  const next = nextPath && nextPath.url;

  return () => {
    const links = [];

    if (previous) {
      links.push(
        React.createElement('a', {
          key: 'previous-page',
          href: generalOptions.previousUrl(previous),
          className: 'previous-page'
        }, generalOptions.previous(previousPath))
      );
    }
    if (next) {
      links.push(
        React.createElement('a', {
          key: 'next-page',
          href: generalOptions.nextUrl(next),
          className: 'next-page'
        }, generalOptions.next(nextPath))
      );
    }

    if (links.length) {
      return React.createElement('div', {
        className: 'prevnext-pages'
      }, links);
    }

    return null;
  };
}

function id(a) { return a; }
