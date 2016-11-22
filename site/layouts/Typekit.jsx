import React from 'react';

export default class Typekit extends React.Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'https://use.typekit.net/qqv0pwh.js';
    script.async = true;
    script.onload = function () {
      /* eslint no-empty: 1 */
      try { window.Typekit.load({ async: true }); } catch (e) {}
    };
    document.body.appendChild(script);
  }

  render() {
    return <noscript />;
  }
}
