'use strict';
var React = require('react');

var paths = require('../paths');


module.exports = {
  contextTypes: {
    router: React.PropTypes.func
  },

  getAllPosts: function () {
    return paths.allPosts();
  },
  getAllPages: function() {
    return paths.getPages();
  },
  getPost: function() {
    var router = this.context.router;
    var params = router.getCurrentParams();
    var post = params.post;
    var splat = params.splat;

    if(splat) {
      return this.getPostForPath(splat + '/' + post);
    }

    return this.getPostForPath(post);
  },
  getPage: function() {
    var router = this.context.router;

    return this.getPageForPath(router.getCurrentPath().slice(1));
  },
  getPostForPath: function(path) {
    return paths.postForPath(path);
  },
  getPageForPath: function(path) {
    return paths.pageForPath(path);
  },
  getPageTitle: function() {
    var post = this.getPost();

    if(post && post.title) {
      return post.title;
    }

    var router = this.context.router;
    var routes = router.getCurrentRoutes();

    var routeName = routes[routes.length - 1].name;

    if(routeName) {
      return routeName.replace('/', '');
    }

    return '';
  },
};
