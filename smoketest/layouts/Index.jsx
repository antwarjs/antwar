import React from 'react';
import { Markdown } from 'antwar-helpers';
import Interactive from 'antwar-interactive';

const Index = ({ page }) => (
  <div>
    <h1>{page.title}</h1>

    <Interactive />

    <Markdown page={page} />
  </div>
);

export default Index;
