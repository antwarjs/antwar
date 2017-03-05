var _ = require('lodash'); // eslint-disable-line no-var
var rssPlugin = require('antwar-rss-plugin'); // eslint-disable-line no-var
var prevnextPlugin = require('antwar-prevnext-plugin'); // eslint-disable-line no-var
var markdown = require('./utils/markdown'); // eslint-disable-line no-var
var highlight = require('./utils/highlight'); // eslint-disable-line no-var

module.exports = {
  template: {
    title: 'Antwar',
    rss: {
      title: 'Antwar',
      href: '/atom.xml'
    }
  },
  output: 'build',
  author: 'Antwar',
  layout() {
    return require('./layouts/SiteBody').default;
  },
  plugins: [
    rssPlugin({
      baseUrl: 'https://antwarjs.github.io/',
      sections: ['blog']
    }),
    prevnextPlugin()
  ],
  paths: {
    '/': {
      title: 'Antwar',
      path() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./pages',
          false,
          /^\.\/.*\.md$/
        );
      },
      layouts: {
        index() {
          return require('./layouts/SiteIndex').default;
        },
        page() {
          return require('./layouts/SitePage').default;
        }
      },
      processPage: {
        url(o) {
          return o.sectionName + '/' + o.fileName.split('.')[0];
        },
        content(o) {
          return markdown().process(o.file.body);
        }
      }
    },
    blog: {
      title: 'Developer Blog',
      path() {
        const posts = require.context(
          'json-loader!yaml-frontmatter-loader!./posts',
          false,
          /^\.\/.*\.md$/
        );

        if (__DEV__) {
          const drafts = require.context(
            'json-loader!yaml-frontmatter-loader!./drafts',
            false,
            /^\.\/.*\.md$/
          );

          const ret = (req) => {
            try {
              return posts(req);
            } catch (err) {
              return drafts(req);
            }
          };
          ret.keys = () => posts.keys().concat(drafts.keys());

          return ret;
        }

        return posts;
      },
      processPage: {
        url(o) {
          if (o.file.url) {
            return o.file.url;
          }

          const page = o.fileName.split('.')[0].split('-').slice(1).join('-');

          return `${o.sectionName}/${page}`;
        },
        content(o) {
          return markdown().process(o.file.body);
        }
      },
      layouts: {
        index() {
          return require('./layouts/SectionIndex').default;
        },
        page() {
          return require('./layouts/BlogPage').default;
        }
      }
    },
    docs: {
      title: 'Documentation',
      path() {
        return require.context(
          'json-loader!yaml-frontmatter-loader!./docs',
          true,
          /^\.\/.*\.md$/
        );
      },
      sort(pages) {
        return _.sortBy(pages, page => page.file.sort);
      },
      processPage: {
        content(o) {
          return markdown().process(o.file.body, highlight);
        }
      },
      layouts: {
        index() {
          return require('./layouts/SectionIndex').default;
        },
        page() {
          return require('./layouts/DocsPage').default;
        }
      }
    }
  }
};
