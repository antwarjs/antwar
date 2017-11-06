const _ = require("lodash");
const parseSectionPages = require("./parse-section-pages");
const transformSections = require("./transform-sections");

describe("Transform sections", () => {
  it("transforms a root section", () => {
    const sectionName = "/";
    const section = {
      layout: () => {},
      transform: pages => _.sortBy(pages, page => page.file.sort),
    };
    const parsedPages = parseSectionPages(
      sectionName,
      section,
      context(path => [`./${path}`])
    );
    const result = transformSections(sectionName, section, parsedPages);
    const expected = [
      {
        type: "page",
        fileName: "first.md",
        file: {
          sort: 0,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/first/",
      },
      {
        type: "page",
        fileName: "second.md",
        file: {
          sort: 1,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/second/",
      },
      {
        type: "page",
        fileName: "third.md",
        file: {
          sort: 10,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/third/",
      },
      {
        type: "index",
        fileName: "index.md",
        file: {
          sort: -1,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/",
      },
    ];

    expect(result).toEqual(expected);
  });

  it("transforms a nested page", () => {
    const sectionName = "/";
    const section = {
      layout: () => {},
      transform: pages => _.sortBy(pages, page => page.file.sort),
    };
    const parsedPages = parseSectionPages(
      sectionName,
      section,
      context(path => [`./${path}`], file => `nested/page/${file}`)
    );
    const result = transformSections(sectionName, section, parsedPages);
    const expected = [
      {
        type: "page",
        fileName: "nested/page/first.md",
        file: {
          sort: 0,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/nested/page/first/",
      },
      {
        type: "page",
        fileName: "nested/page/second.md",
        file: {
          sort: 1,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/nested/page/second/",
      },
      {
        type: "page",
        fileName: "nested/page/third.md",
        file: {
          sort: 10,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/nested/page/third/",
      },
      {
        type: "index",
        fileName: "nested/page/index.md",
        file: {
          sort: -1,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/nested/page/",
      },
    ];

    expect(result).toEqual(expected);
  });

  it("transforms a child section", () => {
    const sectionName = "/";
    const section = {
      paths: {
        docs: {
          layout: () => {},
          transform: pages => _.sortBy(pages, page => page.file.sort),
        },
      },
    };
    const parsedPages = parseSectionPages(
      sectionName,
      section,
      context(path => [`./docs/${path}`])
    );
    const result = transformSections(sectionName, section, parsedPages);
    const expected = [
      {
        type: "page",
        fileName: "docs/first.md",
        file: {
          sort: 0,
        },
        layout: undefined,
        section,
        sectionName: "docs",
        url: "/docs/first/",
      },
      {
        type: "page",
        fileName: "docs/second.md",
        file: {
          sort: 1,
        },
        layout: undefined,
        section,
        sectionName: "docs",
        url: "/docs/second/",
      },
      {
        type: "page",
        fileName: "docs/third.md",
        file: {
          sort: 10,
        },
        layout: undefined,
        section,
        sectionName: "docs",
        url: "/docs/third/",
      },
      {
        type: "index",
        fileName: "docs/index.md",
        file: {
          sort: -1,
        },
        layout: undefined,
        section,
        sectionName: "docs",
        url: "/docs/",
      },
    ];

    expect(result).toEqual(expected);
  });

  it("transforms root and child section", () => {
    const sectionName = "/";
    const section = {
      layout: () => {},
      transform: pages => _.sortBy(pages, page => page.file.sort),
      paths: {
        docs: {
          layout: () => {},
          transform: pages => _.sortBy(pages, page => page.file.sort),
        },
      },
    };
    const parsedPages = parseSectionPages(
      sectionName,
      section,
      context(path => [`./${path}`, `./docs/${path}`])
    );
    const result = transformSections(sectionName, section, parsedPages);
    const expected = [
      {
        type: "page",
        fileName: "first.md",
        file: {
          sort: 0,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/first/",
      },
      {
        type: "page",
        fileName: "second.md",
        file: {
          sort: 1,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/second/",
      },
      {
        type: "page",
        fileName: "third.md",
        file: {
          sort: 10,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/third/",
      },
      {
        type: "index",
        fileName: "index.md",
        file: {
          sort: -1,
        },
        layout: undefined,
        section,
        sectionName: "/",
        url: "/",
      },
      {
        type: "page",
        fileName: "docs/first.md",
        file: {
          sort: 0,
        },
        layout: undefined,
        section,
        sectionName: "docs",
        url: "/docs/first/",
      },
      {
        type: "page",
        fileName: "docs/second.md",
        file: {
          sort: 1,
        },
        layout: undefined,
        section,
        sectionName: "docs",
        url: "/docs/second/",
      },
      {
        type: "page",
        fileName: "docs/third.md",
        file: {
          sort: 10,
        },
        layout: undefined,
        section,
        sectionName: "docs",
        url: "/docs/third/",
      },
      {
        type: "index",
        fileName: "docs/index.md",
        file: {
          sort: -1,
        },
        layout: undefined,
        section,
        sectionName: "docs",
        url: "/docs/",
      },
    ];

    expect(result).toEqual(expected);
  });
});

function context(shapePath, shapeFile = id) {
  const files = [
    {
      file: "index.md",
      sort: -1,
    },
    {
      file: "first.md",
      sort: 0,
    },
    {
      file: "third.md",
      sort: 10,
    },
    {
      file: "second.md",
      sort: 1,
    },
  ];

  const modules = _.fromPairs(
    _.flatMap(
      files.map(({ file, sort }) => ({
        file: shapeFile(file),
        sort,
      })),
      ({ file, sort }) => shapePath(file).map(name => [name, { sort }])
    )
  );
  const ret = name => modules[name];
  ret.keys = () => Object.keys(modules);

  return ret;
}

function id(a) {
  return a;
}
