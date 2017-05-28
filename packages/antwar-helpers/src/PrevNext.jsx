import React from 'react';
import { Link } from 'react-router-dom';

const PrevNext = ({
  next, nextText,
  previous, previousText,
  getTitle = () => {}
}) => {
  if (!(next || previous)) {
    return <div className="prevnext" />;
  }

  // XXX: make sure page spans whole container if it's the only one
  let style = {
    width: '100%'
  };
  if (next && previous) {
    style = {};
  }

  return (
    <div className="prevnext">
      {previous &&
        <div className="prevnext__prev" style={style}>
          {previous.headerImage && <div
            className="prevnext__bg"
            style={{
              backgroundImage: `url(${previous.headerImage})`
            }}
          />}
          <span className="prevnext__info">{previousText}</span>
          <Link className="prevnext__link" to={previous.url}>{getTitle(previous)}</Link>
        </div>
      }
      {next &&
        <div className="prevnext__next" style={style}>
          {next.headerImage && <div
            className="prevnext__bg"
            style={{
              backgroundImage: `url(${next.headerImage})`
            }}
          />}
          <span className="prevnext__info">{nextText}</span>
          <Link className="prevnext__link" to={next.url}>{getTitle(next)}</Link>
        </div>
      }
    </div>
  );
};

export default PrevNext;
