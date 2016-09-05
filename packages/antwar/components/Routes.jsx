import _ from 'lodash';
import React from 'react';
import { Route } from 'react-router';
import config from 'config';
import DevIndex from './DevIndex.jsx';
import BodyContent from './BodyContent.jsx';
import paths from '../libs/paths';

export default (
  <Route>
    {__DEV__ && <Route path="antwar_devindex" component={DevIndex} />}
    <Route component={BodyContent}>
      {_.map(config.paths, (v, k) =>
        paths.getSectionPages(k).map(({ url }) =>
          <Route path={url} />
        ).concat([<Route path={k} />])
      )}
    </Route>
  </Route>
);
