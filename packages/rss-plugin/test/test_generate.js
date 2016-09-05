'use strict';
var test = require('tape');
var moment = require('moment');
var generate = require('../src/generate');

test('generates dummy xml', function (t) {
  t.plan(1);

  const baseUrl = 'http://demo.com/'
  const sections = ['demoSection'];
  const pages = {
    demo: {
      title: 'demo title',
      section: 'demoSection',
      date: '2016-02-01',
      content: 'demo'
    }
  };
  const config = {
    title: 'demo',
    author: 'Demo Author'
  };
  const updated = moment().format();

  const result = generate(baseUrl, sections, updated, pages, config);
  const expected = '<feed xmlns="http://www.w3.org/2005/Atom">' +
    '<title>' + config.title + '</title>' +
    '<link href="' + baseUrl + 'atom.xml" rel="self"></link>' +
    '<link href="' + baseUrl + '" rel=""></link>' +
    '<updated>' + updated + '</updated>' +
    '<id>' + baseUrl + '</id>' +
    '<author><name>' + config.author + '</name><email></email></author>' +
    '<entry>' +
    '<title>' + pages.demo.title + '</title>' +
    '<id>ademotitle2016-02-01t00:00:00+02:00</id>' +
    '<link href="' + baseUrl + 'demo"></link>' +
    '<updated>' +  moment(pages.demo.date, 'YYYY-MM-DD').format() + '</updated>' +
    '<content type="html">' + pages.demo.content + '</content>' +
    '</entry>' +
    '</feed>';

  t.equal(result, expected);
});
