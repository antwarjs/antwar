import React from 'react';
import { Markdown } from 'antwar-helpers';

const Index = ({ page }) => (
  <div>
    <h1>{page.title}</h1>

    <Markdown page={page} />
  </div>
);

export default Index;
