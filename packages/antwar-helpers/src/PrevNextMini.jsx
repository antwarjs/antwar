import React from "react";
import { Link } from "react-router-dom";

const PrevNextMini = ({ previous, next, getTitle = () => {} }) => (
  <div>
    {renderNext(getTitle, next)}
    {renderPrevious(getTitle, previous)}
  </div>
);

function renderNext(getTitle, next) {
  return next ? (
    <Link className="next-page" to={next.url} title={getTitle(next)}>
      <i className="icon-right-open" />
    </Link>
  ) : null;
}

function renderPrevious(getTitle, previous) {
  return previous ? (
    <Link
      className="previous-page"
      to={previous.url}
      title={getTitle(previous)}
    >
      <i className="icon-left-open" />
    </Link>
  ) : null;
}

export default PrevNextMini;
