import React from 'react';
import Interactive from 'antwar-interactive';
import ClickMe from './ClickMe';

const Page = ({
  page: {
    file: {
      attributes: {
        title
      },
      body
    }
  },
  section
}) => (
  <div>
    <h1>Page layout - {title}</h1>

    <Interactive
      id="layouts/ClickMe.jsx"
      component={ClickMe}
      sections={section.all()}
      pages={section.pages()}
      containerProps={{ className: 'interactive-demo' }}
    />

    <div dangerouslySetInnerHTML={{ __html: body }} />
  </div>
);

export default Page;
