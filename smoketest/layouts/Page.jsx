import React from 'react';
import Interactive from 'antwar-interactive';
import ClickMe from './ClickMe';

const Page = ({ page, section }) => (
  <div>
    <h1>Page layout - {page.file.attributes.title}</h1>

    <Interactive
      id="layouts/ClickMe.jsx"
      component={ClickMe}
      sections={section.all()}
      pages={section.pages()}
      containerProps={{ className: 'interactive-demo' }}
    />

    <div dangerouslySetInnerHTML={{ __html: page.file.body }} />
  </div>
);

export default Page;
