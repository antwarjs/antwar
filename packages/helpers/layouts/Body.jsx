const React = require('react');

const Body = ({ head, page, section, config, getPageTitle, children }) => {
  const language = config.language || 'en';
  const siteBase = config.siteBase;

  const description = page.description || config.description;
  const keywords = page.keywords || config.keywords;

  const titleGetter = getPageTitle || pageTitleGetter;
  const pageTitle = titleGetter(config, section.title, page.title, ' - ');

  return (
    <html lang={language}>
      <head>
        <title>{pageTitle}</title>
        { !__DEV__ && siteBase ? <base href={siteBase} /> : null }
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimal-ui"
        />
        <meta
          name="description"
          content={description}
        />
        <meta
          name="keywords"
          content={keywords}
        />
        <link
          rel="icon"
          type="image/png"
          href={stripSlash(siteBase) + '/assets/img/favicon.png'}
        />

        { head || null }

        { !__DEV__ ?
          <link rel="stylesheet" href={stripSlash(siteBase) + '/assets/main.css'} /> :
          null
        }
      </head>
      <body>
        <main role="main">
          {children}
        </main>
        { __DEV__ ? <script src="/main-bundle.js" /> : null }
      </body>
    </html>
  );
};

module.exports = Body;

// XXX: replace with something nicer
function stripSlash(str) {
  if (str[str.length - 1] === '/') {
    return str.split('').slice(0, -1).join('');
  }

  return str;
}

function pageTitleGetter(config, sectionTitle, pageTitle, separator) {
  const title = pageTitle || sectionTitle || '';
  const siteTitle = config.title || '';

  if (title) {
    return siteTitle + separator + title;
  }

  return siteTitle;
}
