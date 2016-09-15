import React from 'react';

const Teaser = ({ pages }) => (
  pages.length > 1 ? renderMultiple(pages) : renderSingle(pages[0])
);

function renderMultiple(pages) {
  return (
    <ul className="teasers">
      {pages.map((page, i) => (
        <li key={'teaser-' + i}>{renderSingle(page)}</li>
      ))}
    </ul>
  );
}

function renderSingle(page) {
  if (page) {
    return <a className="teaser" href={'/' + page.url}>{page.title}</a>;
  }

  return null;
}

export default Teaser;
