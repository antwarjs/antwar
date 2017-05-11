const _ = require('lodash');
const parseSectionPages = require('./parse-section-pages');
const sortSections = require('./sort-sections');

describe('Sort sections', () => {
  it('sorts a root section', () => {
    const sectionName = '/';
    const section = {
      layouts: {
        page: () => {}
      },
      sort: pages => _.sortBy(pages, page => page.file.sort)
    };
    const parsedPages = parseSectionPages(
      sectionName,
      section,
      context(path => [`./${path}`])
    );
    const result = sortSections(
      sectionName,
      section,
      parsedPages
    );
    const expected = [
      {
        type: 'page',
        fileName: 'first',
        file: {
          sort: 0
        },
        layout: undefined,
        section,
        sectionName: '/',
        url: '/first/'
      },
      {
        type: 'page',
        fileName: 'second',
        file: {
          sort: 1
        },
        layout: undefined,
        section,
        sectionName: '/',
        url: '/second/'
      },
      {
        type: 'page',
        fileName: 'third',
        file: {
          sort: 10
        },
        layout: undefined,
        section,
        sectionName: '/',
        url: '/third/'
      }
    ];

    expect(result).toEqual(expected);
  });

  it('sorts a child section', () => {
    const sectionName = '/';
    const section = {
      paths: {
        docs: {
          layouts: {
            page: () => {}
          },
          sort: pages => _.sortBy(pages, page => page.file.sort)
        }
      }
    };
    const parsedPages = parseSectionPages(
      sectionName,
      section,
      context(path => [`./docs/${path}`])
    );
    const result = sortSections(
      sectionName,
      section,
      parsedPages
    );
    const expected = [
      {
        type: 'page',
        fileName: 'first',
        file: {
          sort: 0
        },
        layout: undefined,
        section,
        sectionName: 'docs',
        url: '/docs/first/'
      },
      {
        type: 'page',
        fileName: 'second',
        file: {
          sort: 1
        },
        layout: undefined,
        section,
        sectionName: 'docs',
        url: '/docs/second/'
      },
      {
        type: 'page',
        fileName: 'third',
        file: {
          sort: 10
        },
        layout: undefined,
        section,
        sectionName: 'docs',
        url: '/docs/third/'
      }
    ];

    expect(result).toEqual(expected);
  });

  it('sorts root and child section', () => {
    const sectionName = '/';
    const section = {
      layouts: {
        page: () => {}
      },
      sort: pages => _.sortBy(pages, page => page.file.sort),
      paths: {
        docs: {
          layouts: {
            page: () => {}
          },
          sort: pages => _.sortBy(pages, page => page.file.sort)
        }
      }
    };
    const parsedPages = parseSectionPages(
      sectionName,
      section,
      context(path => [`./${path}`, `./docs/${path}`]),
    );
    const result = sortSections(
      sectionName,
      section,
      parsedPages
    );
    const expected = [
      {
        type: 'page',
        fileName: 'first',
        file: {
          sort: 0
        },
        layout: undefined,
        section,
        sectionName: '/',
        url: '/first/'
      },
      {
        type: 'page',
        fileName: 'second',
        file: {
          sort: 1
        },
        layout: undefined,
        section,
        sectionName: '/',
        url: '/second/'
      },
      {
        type: 'page',
        fileName: 'third',
        file: {
          sort: 10
        },
        layout: undefined,
        section,
        sectionName: '/',
        url: '/third/'
      },
      {
        type: 'page',
        fileName: 'first',
        file: {
          sort: 0
        },
        layout: undefined,
        section,
        sectionName: 'docs',
        url: '/docs/first/'
      },
      {
        type: 'page',
        fileName: 'second',
        file: {
          sort: 1
        },
        layout: undefined,
        section,
        sectionName: 'docs',
        url: '/docs/second/'
      },
      {
        type: 'page',
        fileName: 'third',
        file: {
          sort: 10
        },
        layout: undefined,
        section,
        sectionName: 'docs',
        url: '/docs/third/'
      }
    ];

    expect(result).toEqual(expected);
  });
});

function context(shapePath) {
  const files = [
    {
      file: 'first.md',
      sort: 0
    },
    {
      file: 'third.md',
      sort: 10
    },
    {
      file: 'second.md',
      sort: 1
    }
  ];

  const modules = _.fromPairs(
    _.flatMap(
      files,
      ({ file, sort }) => shapePath(file).map(name => ([name, { sort }]))
    )
  );
  const ret = name => modules[name];
  ret.keys = () => Object.keys(modules);

  return ret;
}
