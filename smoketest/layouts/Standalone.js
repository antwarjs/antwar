import React from "react";
import Interactive from "antwar-interactive";
import ClickMe from "./ClickMe";

const Standalone = ({ section }) => (
  <div>
    <h1>Standalone demo</h1>

    <Interactive
      id="layouts/ClickMe.js"
      component={ClickMe}
      sections={section.all()}
      pages={section.pages()}
      containerProps={{ className: "interactive-demo" }}
    />

    <p>Standalone page</p>
  </div>
);

export default Standalone;
