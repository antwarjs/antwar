import React from 'react';

const PrevNext = ({ page, previousText, nextText }) => {
  if (!(page.next || page.prev)) {
    return <div className="prevnext" />;
  }

  // XXX: make sure page spans whole container if it's the only one
  let style = {
    width: '100%'
  };
  if (page.next && page.prev) {
    style = {};
  }

  return (
    <div className="prevnext">
      {page.prev ?
        <div className="prevnext__prev" style={style}>
          <div
            className="prevnext__bg"
            style={{
              backgroundImage: `url(${page.prev.headerImage})`
            }}
          />
          <span className="prevnext__info">{previousText}</span>
          <a className="prevnext__link" href={`/${page.prev.url}`}>{page.prev.title}</a>
        </div> :
        null
      }
      {page.next ?
        <div className="prevnext__next" style={style}>
          <div
            className="prevnext__bg"
            style={{
              backgroundImage: `url(${page.next.headerImage})`
            }}
          />
          <span className="prevnext__info">{nextText}</span>
          <a className="prevnext__link" href={`/${page.next.url}`}>{page.next.title}</a>
        </div> :
        null
      }
    </div>
  );
};

export default PrevNext;
