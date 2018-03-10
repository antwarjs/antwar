import React, { createElement } from "react";
import marksy from "marksy";

const Index = ({
  page: { file: { attributes: { title }, body } },
  section: { all },
}) =>
  console.log("all", all()) || (
    <div>
      <h1>Index layout - {title}</h1>

      {marksy({ createElement })(body).tree}
    </div>
  );

export default Index;
