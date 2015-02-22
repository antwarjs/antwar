React = require 'react'
Moment = React.createFactory require './Moment'
Paths = require './PathsMixin'
Router = require 'react-router'

{ div, span, header, h1 } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Post'

	mixins: [ Router.State, Paths ]

	render: ->
		content = @getPost()
		published = @getPathMeta('published')
		title = @getPathMeta('title')
		div {},
			header {},
				h1 {}, title
				Moment datetime: published
				span dangerouslySetInnerHTML: __html: content
