import React from "react";

const SitePage = ({ page: { file: { attributes: { title }, body } } }) =>
  <div>
    <h1>
      {title}
    </h1>

    <div dangerouslySetInnerHTML={{ __html: body }} />
  </div>;

export default SitePage;
