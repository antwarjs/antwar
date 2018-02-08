const marked = require("marked");
const moment = require("moment");
const element = require("./element");

const get = {
  content: page => page.file.body,
  date: page => page.file.attributes.date,
  title: page => page.file.attributes.title,
};

describe("Element", () => {
  it("entries generate xml", () => {
    const baseUrl = "http://demo.com/";
    const sections = ["demoSection"];
    const title = "demo title";
    const date = moment("2016-02-21", "YYYY-MM-DD")
      .utcOffset(0)
      .format();
    const body = "demo";
    const pages = {
      demo: {
        type: "page",
        sectionName: "demoSection",
        file: {
          attributes: {
            date,
            title,
          },
          body,
        },
      },
    };

    const result = element.entries({
      baseUrl,
      sections,
      pages,
      get,
    });

    const expected =
      "<entry>" +
      "<title>" +
      title +
      "</title>" +
      "<id>ademotitle" +
      date.toLowerCase() +
      "</id>" +
      '<link href="' +
      baseUrl +
      'demo"></link>' +
      "<updated>" +
      date +
      "</updated>" +
      '<content type="html">' +
      body +
      "</content>" +
      "</entry>";

    expect(result).toEqual(expected);
  });

  it("do not resolve full urls", () => {
    const baseUrl = "http://demo.com/";
    const sections = ["demoSection"];
    const title = "demo title";
    const date = moment("2016-02-21", "YYYY-MM-DD")
      .utcOffset(0)
      .format();
    const body = marked("#test\n[check out](http://google.com)");
    const pages = {
      demo: {
        type: "page",
        sectionName: "demoSection",
        file: {
          attributes: {
            date,
            title,
          },
          body,
        },
      },
    };

    const result = element.entries({
      baseUrl,
      sections,
      pages,
      get,
    });

    const expected =
      "<entry>" +
      "<title>" +
      title +
      "</title>" +
      "<id>ademotitle" +
      date.toLowerCase() +
      "</id>" +
      '<link href="' +
      baseUrl +
      'demo"></link>' +
      "<updated>" +
      date +
      "</updated>" +
      '<content type="html">' +
      "&lt;p&gt;#test\n&lt;a href=&quot;http://google.com&quot;&gt;check out&lt;/a&gt;&lt;/p&gt;\n" +
      "</content>" +
      "</entry>";

    expect(result).toEqual(expected);
  });

  it("entries resolve relative urls against base", () => {
    const baseUrl = "http://demo.com/";
    const sections = ["demoSection"];
    const title = "demo title";
    const date = moment("2016-02-21", "YYYY-MM-DD")
      .utcOffset(0)
      .format();
    const body = marked("#test\n[check out](../blog/demo-interview)");
    const pages = {
      demo: {
        type: "page",
        sectionName: "demoSection",
        file: {
          attributes: {
            date,
            title,
          },
          body,
        },
      },
    };

    const result = element.entries({
      baseUrl,
      sections,
      pages,
      get,
    });

    const expected =
      "<entry>" +
      "<title>" +
      title +
      "</title>" +
      "<id>ademotitle" +
      date.toLowerCase() +
      "</id>" +
      '<link href="' +
      baseUrl +
      'demo"></link>' +
      "<updated>" +
      date +
      "</updated>" +
      '<content type="html">&lt;p&gt;#test\n&lt;a href=&quot;http://demo.com/blog/demo-interview&quot;&gt;check out&lt;/a&gt;&lt;/p&gt;\n</content>' +
      "</entry>";

    expect(result).toEqual(expected);
  });

  it("entries resolve absolute urls against base", () => {
    const baseUrl = "http://demo.com/";
    const sections = ["demoSection"];
    const title = "demo title";
    const date = moment("2016-02-21", "YYYY-MM-DD")
      .utcOffset(0)
      .format();
    const body = marked("#test\n[check out](/blog/demo-interview)");
    const pages = {
      demo: {
        type: "page",
        sectionName: "demoSection",
        file: {
          attributes: {
            date,
            title,
          },
          body,
        },
      },
    };

    const result = element.entries({
      baseUrl,
      sections,
      pages,
      get,
    });

    const expected =
      "<entry>" +
      "<title>" +
      title +
      "</title>" +
      "<id>ademotitle" +
      date.toLowerCase() +
      "</id>" +
      '<link href="' +
      baseUrl +
      'demo"></link>' +
      "<updated>" +
      date +
      "</updated>" +
      '<content type="html">&lt;p&gt;#test\n&lt;a href=&quot;http://demo.com/blog/demo-interview&quot;&gt;check out&lt;/a&gt;&lt;/p&gt;\n</content>' +
      "</entry>";

    expect(result).toEqual(expected);
  });

  it("entries resolve relative urls against base", () => {
    const baseUrl = "http://demo.com/";
    const sections = ["blog"];
    const title = "demo title";
    const date = moment("2016-02-21", "YYYY-MM-DD")
      .utcOffset(0)
      .format();
    const body = marked("#test\n[check out](./demo-interview)");
    const pages = {
      demo: {
        type: "page",
        sectionName: "blog",
        file: {
          attributes: {
            date,
            title,
          },
          body,
        },
      },
    };

    const result = element.entries({
      baseUrl,
      sections,
      pages,
      get,
    });

    const expected =
      "<entry>" +
      "<title>" +
      title +
      "</title>" +
      "<id>ademotitle" +
      date.toLowerCase() +
      "</id>" +
      '<link href="' +
      baseUrl +
      'demo"></link>' +
      "<updated>" +
      date +
      "</updated>" +
      '<content type="html">&lt;p&gt;#test\n&lt;a href=&quot;http://demo.com/blog/demo-interview&quot;&gt;check out&lt;/a&gt;&lt;/p&gt;\n</content>' +
      "</entry>";

    expect(result).toEqual(expected);
  });
});
