const _url = require('url');
const _ = require('lodash');
const moment = require('moment');
const absolutify = require('absolutify');
const urljoin = require('url-join');

exports.feed = function (children) {
  return e('feed', { xmlns: 'http://www.w3.org/2005/Atom' }, children);
};

exports.title = function (title) {
  return e('title', {}, escapeHTML(title));
};

exports.link = function (target = '', rel = '') {
  return e('link', { href: target, rel }, '');
};

exports.updated = function (date) {
  return e('updated', {}, date);
};

exports.id = function (value) {
  return e('id', {}, value);
};

exports.author = function (author) {
  return e('author', {}, [
    e('name', {}, author ? escapeHTML(author.name || author) : ''),
    e('email', {}, author ? author.email || '' : '')
  ]);
};

exports.entries = function (baseUrl, sections, pages) {
  return _.map(pages, function (page, name) {
    if (!_.includes(sections, page.section) || !page.title) {
      return null;
    }

    return e('entry', {}, [
      e('title', {}, escapeHTML(page.title)),
      e(
        'id',
        {},
        'a' + _.camelCase(_.escape(_.deburr(page.title))).toLowerCase() +
        moment(page.date, 'YYYY-MM-DD').format().toLowerCase()
      ),
      e('link', { href: _url.resolve(baseUrl, name) }, ''),
      e(
        'updated',
        {},
        moment(page.date, 'YYYY-MM-DD').format()
      ),
      e(
        'content',
        { type: 'html' },
        escapeHTML(resolveUrls(baseUrl, page.section, page.content))
      )
    ]);
  }).filter(_.identity).join('');
};

function e(name, attributes, content) {
  let attrStr = _.map(attributes, function (val, key) {
    return key + '="' + val + '"';
  });
  let ret = content;

  attrStr = attrStr.length ? ' ' + attrStr.join(' ') : '';

  if (_.isArray(content)) {
    ret = content.join('');
  }

  return '<' + name + attrStr + '>' + ret + '</' + name + '>';
}

function resolveUrls(baseUrl, section, content) {
  return absolutify(content, function (url, attrName) {
    if (!url.indexOf('./')) {
      return urljoin(baseUrl, section, _.trimStart(url, './'));
    }

    if (attrName === 'href') {
      return _.trimEnd(_url.resolve(baseUrl, url), '/');
    }

    return url;
  });
}

function escapeHTML(input) {
  return input.replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&apos;');
}
