import React from 'react';

const Index = ({ page }) => (
  <div>
    <h1>{page.title}</h1>

    <div dangerouslySetInnerHTML={{ __html: page.content }} />
  </div>
);

export default Index;
