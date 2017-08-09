import React from "react";

const ClickMe = ({ sections, pages }) =>
  <div onClick={() => console.log("clicked", sections, pages)}>
    Click me and see the console
  </div>;

export default ClickMe;
