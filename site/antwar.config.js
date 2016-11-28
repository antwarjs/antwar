const _ = require('lodash');
const rssPlugin = require('antwar-rss-plugin');
const prevnextPlugin = require('antwar-prevnext-plugin');
const markdown = require('./utils/markdown');
const highlight = require('./utils/highlight');

module.exports = {
  template: {
    title: 'Antwar',
    rss: {
      title: 'Antwar',
      href: '/atom.xml'
    }
  },
  assets: [
    {
      from: './CNAME',
      to: './'
    }
  ],
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
          'json!yaml-frontmatter!./pages',
          false,
          /^\.\/.*\.md$/
        );
      },
      layouts: {
        index() {
          return require('./layouts/SiteIndex').default;
        }
      },
      processPage: {
        url(o) {
          return o.sectionName + '/' + o.fileName.split('.')[0];
        },
        content(o) {
          return markdown().process(o.file.__content);
        }
      }
    },
    blog: {
      title: 'Blog posts',
      path() {
        const posts = require.context(
          'json!yaml-frontmatter!./posts',
          false,
          /^\.\/.*\.md$/
        );

        if (__DEV__) {
          const drafts = require.context(
            'json!yaml-frontmatter!./drafts',
            false,
            /^\.\/.*\.md$/
          );

          const ret = req => {
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
          return markdown().process(o.file.__content);
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
          'json!yaml-frontmatter!./docs',
          true,
          /^\.\/.*\.md$/
        );
      },
      sort(pages) {
        return _.sortBy(pages, page => page.file.sort);
      },
      processPage: {
        content(o) {
          return markdown().process(o.file.__content, highlight);
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
