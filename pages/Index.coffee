React = require('react')
Router = require('react-router')
Link = React.createFactory Router.Link
Nav = React.createFactory require '../elements/Nav'
Paths = require('../elements/PathsMixin')
_ = require('lodash')

{ div, li, br, ul, h1, blockquote } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Index'

	mixins: [
		Router.State
		Paths
	]

	render: ->
		div {}, 'Index hey'

