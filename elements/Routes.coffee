React = require 'react'
Router = require 'react-router'
Route = React.createFactory Router.Route
NotFoundRoute = React.createFactory Router.NotFoundRoute
DefaultRoute = React.createFactory Router.DefaultRoute
RouteHandler = React.createFactory Router.RouteHandler
Layout = require './Layout'
Post = require './Post'
_ = require 'lodash'
paths = require '../paths'

Routes =
	Route
		name: 'home'
		title: 'Home'
		path: '/'
		handler: Layout
	,
		Route
			name: 'post'
			path: '/blog/:post'
			handler: Post
		_.map paths.allPages(), (page, key) ->
			handler = require '../pages/' + page.fileName
			path = if page.name is 'index' then '/' else '/' + page.url  + '/?'
			Route
				path: path
				name: page.url
				handler: handler

module.exports = Routes
