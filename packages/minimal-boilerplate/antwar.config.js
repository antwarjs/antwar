module.exports = {
  output: 'build',
  name: 'Antwar minimal boilerplate',
  author: {
    name: 'Dr A N Twar',
    email: 'antwar@antwar.com'
  },
  deploy: {
    branch: 'gh-pages'
  },
  theme: {
    name: 'antwar-minimal-theme',
    navigation: [
      { title: 'Home', path: '/' },
      { title: 'Blog', path: '/blog' },
      { title: 'Page', path: '/page' },
      { title: 'MarkdownPage', path: '/markdownpage' }
    ]
  },
  paths: {
    '/': {
      path() {
        return require.context('./pages');
      }
    },
    blog: {
      title: 'Blog posts',
      layout: 'blog',
      path() {
        return require.context('./posts', true, /^\.\/.*\.md$/);
      },
      draft() {
        return require.context('./drafts', true, /^\.\/.*\.md$/);
      }
    }
  }
};

