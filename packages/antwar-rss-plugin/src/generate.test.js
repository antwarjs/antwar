const moment = require("moment");
const generate = require("./generate");

describe("Generate", () => {
  it("generates dummy xml", () => {
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
            title
          },
          body
        }
      }
    };
    const config = {
      title: "Demo RSS",
      author: "Demo Author"
    };
    const updated = moment().format();

    const result = generate({
      baseUrl,
      sections,
      updated,
      pages,
      config,
      get: {
        content: page => page.file.body,
        date: page => page.file.attributes.date,
        title: page => page.file.attributes.title
      }
    });
    const expected =
      '<feed xmlns="http://www.w3.org/2005/Atom">' +
      "<title>" +
      config.title +
      "</title>" +
      '<link href="' +
      baseUrl +
      'atom.xml" rel="self"></link>' +
      '<link href="' +
      baseUrl +
      '" rel=""></link>' +
      "<updated>" +
      updated +
      "</updated>" +
      "<id>" +
      baseUrl +
      "</id>" +
      "<author><name>" +
      config.author +
      "</name><email></email></author>" +
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
      "</entry>" +
      "</feed>";

    expect(result).toEqual(expected);
  });
});
