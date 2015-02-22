React = require('react')
Router = require('react-router')
Link = React.createFactory Router.Link
Moment = React.createFactory require('../elements/Moment')
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
		div {},
			ul {},
				_.map @getAllPosts(), (post, key) =>
					li key: key,
						h1 {},
							Link
								to: '/blog/' + key
							, post.title
						br {}
						Moment
							datetime: post.date
						div {},
							blockquote { },
								@getPreviewForPost key
