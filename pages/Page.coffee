React = require('react')
Router = require('react-router')
Link = React.createFactory Router.Link
Moment = React.createFactory require('../elements/Moment')
Paths = require('../elements/PathsMixin')
_ = require('lodash')

{ div, li, br, ul, h1, blockquote } = require 'react-coffee-elements'

module.exports = React.createClass
	displayName: 'Page'

	mixins: [
		Router.State
		Paths
	]

	render: ->
		div {}, 'This is another page'
