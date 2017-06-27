import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import config from 'config'; // Aliased through webpack
import paths from '../paths';
import BodyContent from '../BodyContent';

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
  <BrowserRouter>
    <Route
      component={({ location }) => {
        const allPages = paths.getAllPages(config);
        const page = paths.getPageForPath(config, location.pathname, allPages);

        return BodyContent(page, allPages)({ location });
      }}
    />
  </BrowserRouter>,
  container
);
