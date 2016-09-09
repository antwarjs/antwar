const React = require('react');
const helpers = require('antwar-helpers');

const Body = helpers.layouts.Body;
const GoogleAnalytics = helpers.components.GoogleAnalytics;
const Navigation = helpers.components.Navigation;
const RSS = helpers.components.RSS;

const SiteBody = ({ children, ...props }) => (
  <Body head={<RSS />} {...props}>
    {children}
    <Navigation
      {...props}
      pages={[
        { title: 'Home', url: '/' },
        { title: 'Documentation', url: '/docs' },
        { title: 'Blog', url: '/blog' }
      ]}
    />

    <GoogleAnalytics analyticsId="UA-60511795-1" />
  </Body>
);
SiteBody.propTypes = {
  children: React.PropTypes.any
};

export default SiteBody;
