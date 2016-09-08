const React = require('react');

const Item = ({ title, isDraft, date, content, author }) => (
  <div>
    <h1>{title}</h1>
    <div>
      {isDraft ? <span>Draft</span> : null}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
    {date}
    {author ? <span>Authored by {author}</span> : null}
  </div>
);

export default Item;
