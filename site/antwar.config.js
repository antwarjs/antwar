const _ = require('lodash');

/*
const rssPlugin = require('antwar-rss-plugin');
const prevnextPlugin = require('antwar-prevnext-plugin');
const highlightPlugin = require('antwar-highlight-plugin');
*/

module.exports = {
  template: {
    title: 'Antwar'
  },
  output: 'build',
  author: 'Antwar',
  layout() {
    return require('./layouts/Body');
  },
  /*
  plugins: [
    rssPlugin({
      baseUrl: 'https://antwarjs.github.io/',
      sections: ['blog']
    }),
    prevnextPlugin(),
    highlightPlugin()
  ],
  */
  paths: {
    '/': {
      path() {
        return require.context(
          'json!yaml-frontmatter!./pages',
          false,
          /^\.\/.*\.md$/
        );
      }
    },
    blog: {
      title: 'Blog posts',
      path() {
        return require.context(
          'json!yaml-frontmatter!./posts',
          false,
          /^\.\/.*\.md$/
        );
      },
      draft() {
        return require.context(
          'json!yaml-frontmatter!./drafts',
          false,
          /^\.\/.*\.md$/
        );
      },
      processPage: {
        url(o) {
          if (o.file.url) {
            return o.file.url;
          }

          const page = o.fileName.split('.')[0].split('-').slice(1).join('-');

          return `${o.sectionName}/${page}`;
        }
      },
      layouts: {
        index() {
          return require('./layouts/SectionIndex');
        },
        page() {
          return require('./layouts/BlogPage');
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
        return _.sortBy(pages, function (page) {
          return page.file.sort;
        });
      },
      layouts: {
        index() {
          return require('./layouts/SectionIndex');
        },
        page() {
          return require('./layouts/DocsPage');
        }
      }
    }
  }
};
