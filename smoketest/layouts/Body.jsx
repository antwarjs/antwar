import React from 'react';

const SiteBody = ({ children }) => (
  <html lang="en">
    <head />
    <body>
      {children}
      { __DEV__ ? <script src="/main-bundle.js" /> : null }
    </body>
  </html>
);
SiteBody.propTypes = {
  children: React.PropTypes.any
};

export default SiteBody;
