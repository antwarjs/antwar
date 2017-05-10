import React from 'react';

const PrevNext = ({
  next, nextText, previous, previousText
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
      {previous ?
        <div className="prevnext__prev" style={style}>
          <div
            className="prevnext__bg"
            style={{
              backgroundImage: `url(${previous.headerImage})`
            }}
          />
          <span className="prevnext__info">{previousText}</span>
          <a className="prevnext__link" href={previous.url}>{previous.title}</a>
        </div> :
        null
      }
      {next ?
        <div className="prevnext__next" style={style}>
          <div
            className="prevnext__bg"
            style={{
              backgroundImage: `url(${next.headerImage})`
            }}
          />
          <span className="prevnext__info">{nextText}</span>
          <a className="prevnext__link" href={next.url}>{next.title}</a>
        </div> :
        null
      }
    </div>
  );
};

export default PrevNext;
