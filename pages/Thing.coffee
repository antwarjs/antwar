React = require('react')
Router = require('react-router')
Link = React.createFactory Router.Link
Moment = React.createFactory require('../elements/Moment.jsx')
Paths = require('../elements/PathsMixin')
_ = require('lodash')

{ div, li, br, ul, h1, blockquote } = require 'react-coffee-elements'

Index = React.createClass
	displayName: 'Index'

	mixins: [
		Router.State
		Paths
	]

	render: ->
		div {}, 'Thingy!'

module.exports = Index
