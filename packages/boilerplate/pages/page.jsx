import React from 'react';

export default class Note extends React.Component {
  render() {
    return (
      <div className='post'>
        <h1 className='post__heading'>A page</h1>
        <p>This is a page. You can have as many pages as you like. Just add another file to the `pages` folder.</p>
      </div>
    );
  }
}
