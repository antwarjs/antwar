import React from 'react';

const SitePage = ({ page }) => (
  <div>
    <h1>{page.file.attributes.title}</h1>

    <div dangerouslySetInnerHTML={{ __html: page.file.body }} />
  </div>
);

export default SitePage;
