import React from 'react';

const Index = ({
  page: {
    file: {
      attributes: {
        title
      },
      body
    }
  }
}) => (
  <div>
    <h1>Index layout - {title}</h1>

    <div dangerouslySetInnerHTML={{ __html: body }} />
  </div>
);

export default Index;
