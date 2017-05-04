import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import BodyContent from '../core/BodyContent';

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
  <BrowserRouter><BodyContent /></BrowserRouter>,
  container
);
