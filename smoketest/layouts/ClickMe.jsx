import React from 'react';

const ClickMe = ({ pages }) => (
  <div onClick={() => console.log('clicked', pages)}>
    Click me and see the console
  </div>
);

export default ClickMe;
