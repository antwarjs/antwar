import React from 'react';

const Markdown = ({ file }) => (
  <div dangerouslySetInnerHTML={{__html: file.content}} />
);
Markdown.propTypes = {
  file: React.PropTypes.object.isRequired
};

export default Markdown;
