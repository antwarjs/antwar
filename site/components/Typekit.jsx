import React from 'react';

export default class Typekit extends React.Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'https://use.typekit.net/qqv0pwh.js';
    script.async = true;
    script.onload = function () {
      try { window.Typekit.load({ async: true }); } catch (e) { console.warn('Typekit Failed to Load'); }
    };
    document.body.appendChild(script);
  }

  render() {
    return <noscript />;
  }
}
