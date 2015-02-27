React = require('react')
Router = require('react-router')
Link = React.createFactory Router.Link
Moment = React.createFactory require('../theme/Moment')
Paths = require('../elements/PathsMixin')
# md = require '../posts/2015-02-14-first_post.md'
_ = require('lodash')

{ div, li, p, ul, h1, h3 } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Blog'

	mixins: [
		Router.State
		Paths
	]

	render: ->
		div {className: 'grid'},
			h1 'Blog posts'
			ul { className: 'post-list'},
				_.map _.sortBy(@getAllPosts(), 'date').reverse(), (post) =>
					li key: post.url,
						h3 {className: 'post-list__heading'},
							Link
								to: '/blog/' + post.url
							, post.title
						Moment
							datetime: post.date
						p {className: 'post-list__preview'},
							@getPreviewForPost post.url
