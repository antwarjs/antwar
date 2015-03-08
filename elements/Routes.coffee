React = require 'react'
Router = require 'react-router'
Route = React.createFactory Router.Route
NotFoundRoute = React.createFactory Router.NotFoundRoute
DefaultRoute = React.createFactory Router.DefaultRoute
RouteHandler = React.createFactory Router.RouteHandler

Body = React.createFactory(require 'theme/Body')
Post = require 'theme/Post'
MarkdownPage = require 'theme/MarkdownPage'
Blog = require 'theme/Blog'

Layout = require('./Layout')(Body)

DevIndex = require './DevIndex'
_ = require 'lodash'
paths = require '../paths'

isMarkdownFile = (page) -> page.fileName?.indexOf('.md') > -1

Routes =
  Route
    name: 'home'
    title: 'Home'
    handler: Layout
  ,
    Route
      name: '/antwar_devindex'
      handler: DevIndex
    Route
      name: 'blog'
      path: '/blog/?'
      handler: Blog
    Route
      name: 'post'
      path: '/blog/:post'
      handler: Post
    _.map paths.allPages(), (page, key) ->
      handler = require 'pages/' + page.fileName
      if isMarkdownFile page
        handler = MarkdownPage
      path = if page.url is '/' then '/' else '/' + page.url  + '/?'
      Route
        path: path
        key: page.url
        name: page.url
        handler: handler

module.exports = Routes
