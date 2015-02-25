React = require 'react'
Moment = React.createFactory require './Moment'
Paths = require './PathsMixin'
Router = require 'react-router'

{ div, span, header, h1 } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Post'

	mixins: [ Router.State, Paths ]

	render: ->
		post = @getPost()
		console.log post
		div {className: 'post', onTouchMove: @touchMove},
			if post.headerImage? then div className: 'post__header-image', style: backgroundImage: "url(#{post.headerImage})"
			h1 {className: 'post__heading'}, post.title
			div className: 'post__content', dangerouslySetInnerHTML: __html: post.content
			Moment className: 'post__moment', datetime: post.published
