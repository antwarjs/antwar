const getPageForPath = require("./get-page-for-path");

describe("Get page for path", () => {
  it("gets the root page", () => {
    const result = getPageForPath("/", { "/": "demo" });
    const expected = "demo";

    expect(result).toEqual(expected);
  });

  it("gets an empty object if there is no root", () => {
    const result = getPageForPath("/", {});
    const expected = {};

    expect(result).toEqual(expected);
  });

  it("gets a page", () => {
    const result = getPageForPath("foo/", { "foo/": "demo" });
    const expected = "demo";

    expect(result).toEqual(expected);
  });

  it("gets a page without a trailing slash", () => {
    const result = getPageForPath("foo", { "foo/": "demo" });
    const expected = "demo";

    expect(result).toEqual(expected);
  });

  it("returns an empty object if there is no match", () => {
    const result = getPageForPath("foo", { "bar/": "demo" });
    const expected = {};

    expect(result).toEqual(expected);
  });
});
