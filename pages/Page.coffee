React = require('react')
Router = require('react-router')
Link = React.createFactory Router.Link
Moment = React.createFactory require('../elements/Moment.jsx')
Paths = require('../elements/PathsMixin')
_ = require('lodash')

{ div, li, br, ul, h1, blockquote } = require 'react-coffee-elements'

Page = React.createClass
	displayName: 'Page'

	mixins: [
		Router.State
		Paths
	]

	render: ->
		div {}, 'This is another page'

module.exports = Page
