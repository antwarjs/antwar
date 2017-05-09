var _ = require('lodash'); // eslint-disable-line no-var
var rssPlugin = require('antwar-rss-plugin'); // eslint-disable-line no-var
var prevnextPlugin = require('antwar-prevnext-plugin'); // eslint-disable-line no-var

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
  layout: () => require('./layouts/SiteBody').default,
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
      content: () => (
        require.context(
          './loaders/page-loader!./pages',
          true,
          /^\.\/.*\.md$/
        )
      ),
      layouts: {
        index: () => require('./layouts/SectionIndex').default,
        page: () => require('./layouts/Page').default
      },
      custom: () => require('./layouts/SiteIndex').default,
      paths: {
        blog: {
          layouts: {
            page: () => require('./layouts/BlogPage').default
          }
        },
        docs: {
          layouts: {
            page: () => require('./layouts/DocsPage').default
          },
          sort: pages => _.sortBy(pages, page => page.file.sort)
        }
      }
    }
  }
};
