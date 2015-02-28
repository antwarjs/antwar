React = require('react')
_ = require('lodash')
content = require '../content/Docs.md'
MdHelper = require '../elements/MdHelper'
{ div, p, h1, h2 } = require 'react-coffee-elements'

module.exports = React.createClass

	displayName: 'Docs'

	render: ->
		parsedContent = MdHelper.parse content
		div {className: 'post'},
			h1 className: 'post__heading', 'Docs'
			div className: 'post__content', dangerouslySetInnerHTML: __html: parsedContent
