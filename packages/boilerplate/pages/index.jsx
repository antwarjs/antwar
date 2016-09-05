import React from 'react';

export default class Note extends React.Component {
  render() {
    return (
      <div className='post post--front'>
        <h1 className='post__heading'>Welcome home!</h1>
        <p>This is the front page. Do whatever you like with it.</p>
      </div>
    );
  }
}
