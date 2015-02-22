React = require('react')
Router = require('react-router')
Link = React.createFactory Router.Link
Moment = React.createFactory require('../elements/Moment.jsx')
Paths = require('../elements/PathsMixin')
# md = require '../posts/2015-02-14-first_post.md'
_ = require('lodash')

{ div, li, br, ul, h2, h1, blockquote } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Blog'

	mixins: [
		Router.State
		Paths
	]

	render: ->
		# title = @getPathMeta('title')
		momentStyle = fontSize: '0.5em'
		quoteStyle =
			margin: '0 1em 1em 1em'
			fontStyle: 'italic'
		titleStyle = fontSize: '1.5em'
		ulStyle =
			listStyle: 'none'
			paddingLeft: 0
		div {},
			# h1 title
			ul style: ulStyle,
				_.map @getAllPosts(), (post, key) =>
					li key: key,
						h1 { },
							Link
								key: key
								to: '/blog/' + key
							, post.title
						br {}
						Moment
							datetime: post.published
							style: momentStyle
						div {},
							blockquote { style: quoteStyle },
								@getPreviewForPost key
