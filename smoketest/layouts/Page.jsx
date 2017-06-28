import React, { createElement } from 'react';
import Interactive from 'antwar-interactive';
import marksy from 'marksy';
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

    {marksy({ createElement })(body).tree}
  </div>
);

export default Page;
