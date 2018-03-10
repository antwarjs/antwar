import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import config from "antwar-config";
import paths from "../paths";
import BodyContent from "../BodyContent";

const container = document.createElement("div");
document.body.appendChild(container);

ReactDOM.render(
  <BrowserRouter>
    <Route
      component={({ location }) => {
        const allPages = paths.getAllPages(config);
        const page = paths.getPageForPath(location.pathname, allPages);

        return BodyContent(page, allPages)({ location });
      }}
    />
  </BrowserRouter>,
  container
);
