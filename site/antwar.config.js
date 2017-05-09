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
      custom() {
        return require('./layouts/SiteIndex').default;
      }
      /*
      TODO: custom sort for docs
      sort(pages) {
        return _.sortBy(pages, page => page.file.sort);
      },
      custom page for docs (DocsPage)
       */
    }
  }
};
