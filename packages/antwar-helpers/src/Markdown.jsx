import React from 'react';

const Markdown = ({ page }) => (
  <div dangerouslySetInnerHTML={{ __html: page.content }} />
);
Markdown.propTypes = {
  page: React.PropTypes.object.isRequired
};

export default Markdown;
