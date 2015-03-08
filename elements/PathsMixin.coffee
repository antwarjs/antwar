paths = require('../paths')
React = require('react')
MdHelper = require './MdHelper'

module.exports =

  contextTypes:
    getCurrentPathname: React.PropTypes.func.isRequired
    getCurrentParams: React.PropTypes.func.isRequired

  getAllPosts: ->
    paths.allPosts()

  getAllPages: ->
    paths.allPages()

  getPost: ->
    @getPostForPath @context.getCurrentParams().post

  getPage: ->
    @getPageForPath @context.getCurrentPath().slice(1) #Remove leading slash

  getPostForPath: (path) ->
    paths.postForPath(path)

  getPageForPath: (path) ->
    paths.pageForPath(path)

  getPageTitle: ->
    post = @getPost()
    if post?.name
      return post.name
    else
      routes = @context.getCurrentRoutes()
      routes[routes.length - 1].name?.replace '/', ''
