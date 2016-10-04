import React from 'react';
import { Markdown } from 'antwar-helpers';
import Interactive from 'antwar-interactive';
import ClickMe from './ClickMe';

const Index = ({ page }) => (
  <div>
    <h1>{page.title}</h1>

    <Interactive id="layouts/ClickMe.jsx" component={ClickMe} />

    <Markdown page={page} />
  </div>
);

export default Index;
