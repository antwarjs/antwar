import React from 'react';

const SiteBody = ({ children }) => (
  <div>
    <span>Global layout demo</span>

    {children}
  </div>
);
SiteBody.propTypes = {
  children: React.PropTypes.any
};

export default SiteBody;
