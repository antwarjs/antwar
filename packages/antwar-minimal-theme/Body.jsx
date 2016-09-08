const React = require('react');
const Router = require('react-router');

const Link = Router.Link;

const Body = ({ theme, children }) => (
  <main>
    <ul>{theme.navigation.map((link, i) => (
      <li key={'link-' + i}>
        <Link to={link.path} key={link.path}>{link.title}</Link>
      </li>
    ))}</ul>
    {children}
  </main>
);

export default Body;
