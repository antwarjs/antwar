const marked = require('marked');
const moment = require('moment');
const element = require('./element');

describe('Element', () => {
  it('entries generate xml', () => {
    const baseUrl = 'http://demo.com/';
    const sections = ['demoSection'];
    const pages = {
      demo: {
        title: 'demo title',
        sectionName: 'demoSection',
        date: '2016-02-01',
        content: 'demo'
      }
    };

    const result = element.entries(baseUrl, sections, pages);

    const expected = '<entry>' +
      '<title>' + pages.demo.title + '</title>' +
      '<id>ademotitle' + moment(pages.demo.date, 'YYYY-MM-DD').utcOffset(0).format().toLowerCase() + '</id>' +
      '<link href="' + baseUrl + 'demo"></link>' +
      '<updated>' + moment(pages.demo.date, 'YYYY-MM-DD').utcOffset(0).format() + '</updated>' +
      '<content type="html">' + pages.demo.content + '</content>' +
      '</entry>';

    expect(result).toEqual(expected);
  });

  it('do not resolve full urls', () => {
    const baseUrl = 'http://demo.com/';
    const sections = ['demoSection'];
    const pages = {
      demo: {
        title: 'demo title',
        sectionName: 'demoSection',
        date: '2016-02-01',
        content: marked('#test\n[check out](http://google.com)')
      }
    };

    const result = element.entries(baseUrl, sections, pages);

    const expected = '<entry>' +
      '<title>' + pages.demo.title + '</title>' +
      '<id>ademotitle' + moment(pages.demo.date, 'YYYY-MM-DD').utcOffset(0).format().toLowerCase() + '</id>' +
      '<link href="' + baseUrl + 'demo"></link>' +
      '<updated>' + moment(pages.demo.date, 'YYYY-MM-DD').utcOffset(0).format() + '</updated>' +
      '<content type="html">&lt;p&gt;#test\n&lt;a href=&quot;http://google.com&quot;&gt;check out&lt;/a&gt;&lt;/p&gt;\n</content>' +
      '</entry>';

    expect(result).toEqual(expected);
  });

  it('entries resolve relative urls against base', () => {
    const baseUrl = 'http://demo.com/';
    const sections = ['demoSection'];
    const pages = {
      demo: {
        title: 'demo title',
        sectionName: 'demoSection',
        date: '2016-02-01',
        content: marked('#test\n[check out](../blog/demo-interview)')
      }
    };

    const result = element.entries(baseUrl, sections, pages);

    const expected = '<entry>' +
      '<title>' + pages.demo.title + '</title>' +
      '<id>ademotitle' + moment(pages.demo.date, 'YYYY-MM-DD').utcOffset(0).format().toLowerCase() + '</id>' +
      '<link href="' + baseUrl + 'demo"></link>' +
      '<updated>' + moment(pages.demo.date, 'YYYY-MM-DD').utcOffset(0).format() + '</updated>' +
      '<content type="html">&lt;p&gt;#test\n&lt;a href=&quot;http://demo.com/blog/demo-interview&quot;&gt;check out&lt;/a&gt;&lt;/p&gt;\n</content>' +
      '</entry>';

    expect(result).toEqual(expected);
  });

  it('entries resolve absolute urls against base', () => {
    const baseUrl = 'http://demo.com/';
    const sections = ['demoSection'];
    const pages = {
      demo: {
        title: 'demo title',
        sectionName: 'demoSection',
        date: '2016-02-01',
        content: marked('#test\n[check out](/blog/demo-interview)')
      }
    };

    const result = element.entries(baseUrl, sections, pages);

    const expected = '<entry>' +
      '<title>' + pages.demo.title + '</title>' +
      '<id>ademotitle' + moment(pages.demo.date, 'YYYY-MM-DD').utcOffset(0).format().toLowerCase() + '</id>' +
      '<link href="' + baseUrl + 'demo"></link>' +
      '<updated>' + moment(pages.demo.date, 'YYYY-MM-DD').utcOffset(0).format() + '</updated>' +
      '<content type="html">&lt;p&gt;#test\n&lt;a href=&quot;http://demo.com/blog/demo-interview&quot;&gt;check out&lt;/a&gt;&lt;/p&gt;\n</content>' +
      '</entry>';

    expect(result).toEqual(expected);
  });

  it('entries resolve relative urls against base', () => {
    const baseUrl = 'http://demo.com/';
    const sections = ['blog'];
    const pages = {
      demo: {
        title: 'demo title',
        sectionName: 'blog',
        date: '2016-02-01',
        content: marked('#test\n[check out](./demo-interview)')
      }
    };

    const result = element.entries(baseUrl, sections, pages);

    const expected = '<entry>' +
      '<title>' + pages.demo.title + '</title>' +
      '<id>ademotitle' + moment(pages.demo.date, 'YYYY-MM-DD').utcOffset(0).format().toLowerCase() + '</id>' +
      '<link href="' + baseUrl + 'demo"></link>' +
      '<updated>' + moment(pages.demo.date, 'YYYY-MM-DD').utcOffset(0).format() + '</updated>' +
      '<content type="html">&lt;p&gt;#test\n&lt;a href=&quot;http://demo.com/blog/demo-interview&quot;&gt;check out&lt;/a&gt;&lt;/p&gt;\n</content>' +
      '</entry>';

    expect(result).toEqual(expected);
  });
});
