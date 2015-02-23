React = require('react')
Nav = React.createFactory require('./Nav')
Router = require('react-router')
RouteHandler = React.createFactory Router.RouteHandler
Paths = require('./PathsMixin')
config = require '../config'

{ html, head, body, div, title, script, link, main, meta } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Layout'

	mixins: [ Router.State,	Paths ]

	render: ->
		html {},
			head {},
				title @getPathMeta('title') + config.title
				meta
					name:"viewport"
					content:"width=device-width, initial-scale=1, maximum-scale=1, minimal-ui"
				link
					rel: 'alternate'
					type: 'application/atom+xml'
					title: config.title
					href: '/atom.xml'
				if process.env.NODE_ENV is 'production'
					link
						rel: 'stylesheet'
						href: '/assets/main.css'
			body {},
				div { id: 'layout' },
					Nav()
					main { role: 'main' },
						@props.children
						RouteHandler()
				if process.env.NODE_ENV isnt 'production'
					script src: '/main-bundle.js'
