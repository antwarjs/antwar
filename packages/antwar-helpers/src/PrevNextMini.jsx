import React from 'react';
import { Link } from 'react-router-dom';

const PrevNextMini = ({ page }) => (
  <div>
    {renderNext(page.next)}
    {renderPrev(page.prev)}
  </div>
);

function renderNext(next) {
  return next ?
    <Link className="next-page" to={`/${next.url}`} title={next.title}>
      <i className="icon-right-open" />
    </Link> :
    null;
}

function renderPrev(prev) {
  return prev ?
    <Link className="previous-page" to={`/${prev.url}`} title={prev.title}>
      <i className="icon-left-open" />
    </Link> :
    null;
}

export default PrevNextMini;
