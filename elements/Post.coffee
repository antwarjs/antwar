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
		headerImage = @getPathMeta('headerImage')
		div {className: 'post', onTouchMove: @touchMove},
			if headerImage? then div className: 'post__header-image', style: backgroundImage: "url(#{headerImage})"
			h1 {}, title
			span dangerouslySetInnerHTML: __html: content
			Moment datetime: published

	touchMove: ->
		console.log 'touchmove'

