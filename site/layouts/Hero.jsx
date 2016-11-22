import React from 'react';

import classes from './Hero.scss';

export default function () {
  const width = 1000;
  const height = 1000;

  return (
    <div className={classes.hero}>
      <svg x={width / 2} y={height / 2} viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}>
        <TV width={600} border={10} />
        {/* <circle cx={0} cy={0} r={2} fill="red" /> */}
      </svg>
    </div>
  );
}

function TV({ width, border = 20, widescreen }) {
  const sw = width - (border * 2);
  const sh = widescreen ? sw * (9 / 16) : sw * (3 / 4);
  const height = sh + (border * 2);

  return (
    <g className={classes.tv}>
      <defs>
        <radialGradient id="tv-gradient" r={1}>
          <stop offset="0%" stopColor="#007EA1" />
          <stop offset="55%" stopColor="#0B0A30" />
        </radialGradient>
        <filter id="text-glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <RoundedRect width={width} height={height} fill="url(#tv-gradient)" />
      <Screen width={sw} height={sh}>
        <text className={classes.title} fontSize="160" y="30">Antwar</text>
        <text className={classes.subtitle} fontSize="52" y="85">the static site generator</text>
      </Screen>
    </g>
  );
}

/* TODO
 * display static when no children are present
 */

function Screen({ children, width, height }) {
  const isw = width - 25;
  const ish = height - 25;
  const isd = Math.sqrt(Math.pow(isw, 2) + Math.pow(ish, 2));
  const screenIsDark = !children;

  const screenGlareProps = {
    opacity: screenIsDark ? 0.5 : 1,
    x: -500,
    y: -isd / 2,
    width: 1000,
    height: isd,
    transform: 'rotate(45)',
    fill: 'url(#glare-gradient)'
  };

  const scanlinesProps = {
    x: -width / 2,
    y: -height / 2,
    width,
    height,
    fill: 'url(#scanlines)',
    opacity: 0.05
  };

  const innerScreenGlowProps = {
    x: -width,
    y: -height,
    width: width * 2,
    height: height * 2,
    fill: 'url(#inner-screen-glow)'
  };

  return (
    <g>
      <defs>
        <clipPath id="screen">
          <RoundedRect width={isw} height={ish} />
        </clipPath>
        <filter id="glow">
          <feGaussianBlur stdDeviation="10" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="inner-screen-glow">
          <stop offset="20%" stopOpacity="0" stopColor="white" />
          <stop offset="70%" stopOpacity=".15" stopColor="#00BCF5" />
        </radialGradient>
        <linearGradient id="scanlines" x1="0%" y1="0%" x2="0%" y2="3%" spreadMethod="repeat">
          <stop offset="25%" stopColor="#555" />
          <stop offset="25%" stopColor="#999" />
          <stop offset="50%" stopColor="#999" />
          <stop offset="50%" stopColor="#666" />
          <stop offset="75%" stopColor="#666" />
          <stop offset="75%" stopColor="#aaa" />
        </linearGradient>
        <linearGradient id="glare-gradient">
          <stop offset="0%" stopOpacity={0} stopColor="#C730CF" />
          <stop offset="25%" stopOpacity={0.05} stopColor="#C730CF" />
          <stop offset="50%" stopOpacity={0.1} stopColor="#00BCF5" />
          <stop offset="75%" stopOpacity={0.05} stopColor="#C730CF" />
          <stop offset="100%" stopOpacity={0} stopColor="#C730CF" />
        </linearGradient>
      </defs>
      <RoundedRect width={isw} height={ish} fill={'white'} filter="url(#glow)" />
      <rect {...screenGlareProps} />
      <g clipPath="url(#screen)">
        {children}
        <rect {...scanlinesProps} />
        <rect {...innerScreenGlowProps} />
      </g>
    </g>
  );
}

/* eslint no-unused-vars: 1 */
function Static({ width, height }) {
  // TODO: figure how to maybe generate a "static-like" pattern instead?

  const rectProps = {
    x: -width / 2,
    y: -height / 2,
    width,
    height,
    fill: 'black',
    filter: 'url(#static)'
  };

  const turbulenceProps = {
    type: 'fractalNoise',
    baseFrequency: '0.4',
    numOctaves: '2',
    seed: '8',
    stitchTiles: 'stitch',
    result: 'static'
  };

  return (
    <g>
      <defs>
        <filter id="static">
          <feTurbulence {...turbulenceProps} />
          <feComposite in2="green" in="static" mode="multiply" />
        </filter>
      </defs>
      <rect {...rectProps} />
    </g>
  );
}

function RoundedRect({ cx = 0, cy = 0, width, height, fill, filter }) {
  const p = 50;

  const d = `
  M ${cx + (width / 2)} ${cy + (height / 2)}
  c 0 ${height / p}
    ${-width} ${height / p}
    ${-width} 0
  c ${-width / p} 0
    ${-width / p} ${-height}
    0 ${-height}
  c 0 ${-height / p}
    ${width} ${-height / p}
    ${width} 0
  c ${width / p} 0
    ${width / p} ${height}
    0 ${height}
  Z`;

  return <path d={d} fill={fill || '#000'} filter={filter} />;
}
