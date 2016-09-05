import React from 'react';

const Teaser = ({ section, sectionPages, amount = 1 }) => (
  pages.length > 1 ? renderMultiple(pages) : renderSingle(pages[0])
);

function renderMultiple(pages) {
  return (
    <ul className='teasers'>
      {pages.map((page, i) => {
        return <li key={'teaser-' + i}>{renderSingle(page)}</li>;
      })}
    </ul>
  );
},

function renderSingle(page) {
  if(page) {
    return <a className='teaser' href={'/' + page.url}>{page.title}</a>;
  }
}

export default Teaser;
