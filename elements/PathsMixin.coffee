paths = require('../paths')
React = require('react')
MdHelper = require './MdHelper'
config = require '../config'

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

  getPostForPath: (path) ->
    paths.postForPath(path)

  getPageTitle: ->
    post = @getPost()
    if post?.name
      return post.name
    else
      routes = @context.getCurrentRoutes()
      routes[routes.length - 1].name?.replace '/', ''
