const _url = require('url');
const _ = require('lodash');
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

exports.entries = function ({
  baseUrl,
  sections,
  pages,
  get
}) {
  return _.map(pages, function (page, name) {
    const sectionName = page.sectionName;

    if (!_.includes(sections, sectionName) || page.type !== 'page') {
      return null;
    }

    const pageTitle = get.title(page);
    const pageContent = get.content(page);
    const pageDate = get.date(page);

    return e('entry', {}, [
      e('title', {}, escapeHTML(pageTitle)),
      e(
        'id',
        {},
        'a' + _.camelCase(_.escape(_.deburr(pageTitle))).toLowerCase() + pageDate.toLowerCase()
      ),
      e('link', { href: _url.resolve(baseUrl, name) }, ''),
      e(
        'updated',
        {},
        pageDate
      ),
      e(
        'content',
        { type: 'html' },
        escapeHTML(resolveUrls(baseUrl, sectionName, pageContent))
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
  if (!input) {
    return '';
  }

  return input.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
