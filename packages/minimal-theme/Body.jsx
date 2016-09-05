var React = require('react');
var _ = require('lodash');
var Router = require('react-router');
var config = require('config');
var Link = Router.Link;
var Body = React.createClass({

	render: function() {
		var links = _.map(config.theme.navigation, function(link, i) {
			return <li key={'link-' + i}><Link to={link.path} key={link.path}>{link.title}</Link></li>
		});
		return (
			<main>
				<ul>{links}</ul>
				{this.props.children}
			</main>
		);
	}

});

module.exports = Body;
