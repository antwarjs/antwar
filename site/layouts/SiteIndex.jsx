import React from 'react';
import { Markdown } from 'antwar-helpers';
import Hero from './Hero';

const Index = ({ page }) => (
  <div>
    { page.title === 'Antwar' ?
      <Hero page={page} /> :
        <h1>{page.title}</h1> }
    <Markdown page={page} />
  </div>
);

export default Index;
