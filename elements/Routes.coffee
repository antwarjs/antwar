React = require 'react'
Router = require 'react-router'
Route = React.createFactory Router.Route
NotFoundRoute = React.createFactory Router.NotFoundRoute
DefaultRoute = React.createFactory Router.DefaultRoute
RouteHandler = React.createFactory Router.RouteHandler
Layout = require './Layout'
Post = require '../theme/Post'
DevIndex = require './DevIndex'
_ = require 'lodash'
paths = require '../paths'

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
			name: 'post'
			path: '/blog/:post'
			handler: Post
		_.map paths.allPages(), (page, key) ->
			handler = require '../pages/' + page.fileName
			path = if page.url is '/' then '/' else '/' + page.url  + '/?'
			Route
				path: path
				key: page.url
				name: page.url
				handler: handler

module.exports = Routes
