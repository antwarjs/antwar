import React from "react";
import PropTypes from "prop-types";

const Markdown = ({ page }) => (
  <div dangerouslySetInnerHTML={{ __html: page.content }} />
);
Markdown.propTypes = {
  page: PropTypes.object.isRequired,
};

export default Markdown;
