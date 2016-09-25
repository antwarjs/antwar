const _ = require('lodash');
const marked = require('marked');

const rssPlugin = require('antwar-rss-plugin');
const prevnextPlugin = require('antwar-prevnext-plugin');
const highlightPlugin = require('antwar-highlight-plugin');

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
    return require('./layouts/Body').default;
  },
  plugins: [
    rssPlugin({
      baseUrl: 'https://antwarjs.github.io/',
      sections: ['blog']
    }),
    prevnextPlugin(),
    highlightPlugin()
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
        page() {
          return require('./layouts/Index').default;
        }
      },
      processPage: {
        url(o) {
          return o.sectionName + '/' + o.fileName.split('.')[0];
        },
        content(o) {
          return marked(o.file.__content);
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
          return marked(o.file.__content);
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
          return marked(o.file.__content);
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
