import React from 'react';
import { Link } from 'react-router-dom';

const PrevNextMini = ({ previous, next }) => (
  <div>
    {renderNext(next)}
    {renderPrevious(previous)}
  </div>
);

function renderNext(next) {
  return next ?
    <Link className="next-page" to={next.url} title={next.title}>
      <i className="icon-right-open" />
    </Link> :
    null;
}

function renderPrevious(previous) {
  return previous ?
    <Link className="previous-page" to={previous.url} title={previous.title}>
      <i className="icon-left-open" />
    </Link> :
    null;
}

export default PrevNextMini;
