import _ from 'lodash';
import React from 'react';
import { Route } from 'react-router';
import config from 'config';
import BodyContent from './BodyContent';
import paths from '../libs/paths';

module.exports = (
  <Route>
    <Route component={BodyContent}>
      {_.map(config.paths, (v, k) =>
        paths.getSectionPages(k).map(({ url }) =>
          <Route path={url} />
        ).concat([<Route path={k} />])
      )}
    </Route>
  </Route>
);
