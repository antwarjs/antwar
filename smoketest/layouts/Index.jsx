import React from 'react';

const Index = ({ page }) => (
  <div>
    <h1>Index layout - {page.file.attributes.title}</h1>

    <div dangerouslySetInnerHTML={{ __html: page.file.body }} />
  </div>
);

export default Index;
