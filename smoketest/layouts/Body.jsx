import React from 'react';
import PropTypes from 'prop-types';

const SiteBody = ({ children }) => (
  <div>
    <span>Global layout demo</span>

    {children}
  </div>
);
SiteBody.propTypes = {
  children: PropTypes.any
};

export default SiteBody;
