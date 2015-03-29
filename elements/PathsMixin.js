'use strict';
var React = require('react');

var paths = require('../paths');


module.exports = {
  contextTypes:  function() {
    return {
      getCurrentPathname: React.PropTypes.func.isRequired,
      getCurrentParams: React.PropTypes.func.isRequired,
    };
  },
  getAllPosts: function () {
    return paths.allPosts();
  },
  getAllPages: function() {
    return paths.getPages();
  },
  getPost: function() {
    var params = this.context.getCurrentParams();
    var post = params.post;
    var splat = params.splat;

    if(splat) {
      return this.getPostForPath(splat + '/' + post);
    }

    return this.getPostForPath(post);
  },
  getPage: function() {
    // remove leading slash
    return this.getPageForPath(this.context.getCurrentPath().slice(1));
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

    var routes = this.context.getCurrentRoutes();
    var routeName = routes[routes.length - 1].name;

    if(routeName) {
      return routeName.replace('/', '');
    }

    return '';
  },
};
