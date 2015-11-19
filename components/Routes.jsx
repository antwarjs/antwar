import _ from 'lodash';
import React from 'react';
import {Route} from 'react-router';
import DevIndex from './DevIndex.jsx';
import BodyContent from './BodyContent.jsx';
import paths from '../libs/paths';
import config from 'config';

export default (
  <Route component={BodyContent}>
    {__DEV__ && <Route path="antwar_devindex" component={DevIndex} />}
    {_.map(config.paths, function(v, k) {
      const pathRoutes = paths.getSectionPages(k).map(_.property('url')).map((url) =>
        <Route component={BodyContent} path={url} />
      );

      // possible root path needs to be after other paths. else it can match too early
      if(k === '/') {
        return pathRoutes;
      }

      return pathRoutes.concat([
        <Route component={BodyContent} path={k} />
      ]);
    })}
    {config.paths['/'] && <Route component={BodyContent} path="/" />}
  </Route>
);
