const _ = require('lodash');
const parseSectionPages = require('./parse-section-pages');
const sortSections = require('./sort-sections');

describe('Sort sections', () => {
  /*it('sorts a root section', () => {

    expect(result).toEqual(expected);
  });*/

  it('sorts a child section', () => {
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
      '/',
      section,
      context()
    );
    const result = sortSections(
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
});

function context() {
  const modules = {
    './docs/first.md': {
      sort: 0
    },
    './docs/third.md': {
      sort: 10
    },
    './docs/second.md': {
      sort: 1
    }
  };
  const ret = name => modules[name];
  ret.keys = () => Object.keys(modules);

  return ret;
}
