const _ = require('lodash');
const themeConfig = require('antwar-default-theme');
const rssPlugin = require('antwar-rss-plugin');
const prevnextPlugin = require('antwar-prevnext-plugin');
const highlightPlugin = require('antwar-highlight-plugin');

module.exports = {
  webpack: themeConfig.webpack, // SCSS bits
  output: 'build',
  title: 'Antwar',
  author: 'Antwar',
  deploy: {
    branch: 'master'
  },
  layout() {
    return require('./layouts/Body');
  },
  style() {
    require('antwar-default-theme/scss/main.scss');
    require('./styles/specific.scss');
    require('./styles/prism.css');
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
      path() {
        return require.context('./pages');
      }
    },
    blog: {
      title: 'Blog posts',
      path() {
        return require.context('./posts', true, /^\.\/.*\.md$/);
      },
      draft() {
        return require.context('./drafts', true, /^\.\/.*\.md$/);
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
          return themeConfig.layouts().SectionIndex;
        },
        page() {
          return themeConfig.layouts().BlogPage;
        }
      }
    },
    docs: {
      title: 'Documentation',
      path() {
        return require.context('./docs', true, /^\.\/.*\.md$/);
      },
      sort(pages) {
        return _.sortBy(pages, function (page) {
          return page.file.sort;
        });
      },
      layouts: {
        index() {
          return themeConfig.layouts().SectionIndex;
        },
        page() {
          return themeConfig.layouts().DocsPage;
        }
      }
    }
  }
};
