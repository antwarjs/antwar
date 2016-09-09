import React from 'react';

const RSS = props => {
  if (__DEV__) {
    return <noscript />;
  }

  return (
    <link
      rel="alternate"
      key="rss-theme-link"
      type="application/atom+xml"
      {...props}
    />
  );
};
RSS.propTypes = {
  href: React.PropTypes.string.isRequired
};
RSS.defaultProps = {
  href: '/atom.xml'
};

export default RSS;
