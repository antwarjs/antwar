var React = require('react');
var helpers = require('antwar-helpers');
var Body = helpers.layouts.Body;
var GoogleAnalytics = helpers.components.GoogleAnalytics;
var Navigation = helpers.components.Navigation;
var RSS = helpers.components.RSS;

module.exports = React.createClass({
  displayName: 'Body',
  render() {
    return (
      <Body head={this.renderHead()} {...this.props}>
        {this.props.children}
        <Navigation {...this.props} pages={[
          {title: 'Home', url: '/'},
          {title: 'Documentation', url: '/docs'},
          {title: 'Blog', url: '/blog'}
        ]} />

        <GoogleAnalytics analyticsId='UA-60511795-1' />
      </Body>
    );
  },
  renderHead() {
    return <RSS />
  }
});
