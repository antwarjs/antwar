const React = require('react');

const Body = ({ head, page, section, config, getPageTitle }) => {
  const language = config.language || 'en';

  const description = page.description || config.description;
  const keywords = page.keywords || config.keywords;

  const titleGetter = getPageTitle || defaultGetPageTitle;
  const pageTitle = titleGetter(config, section.title, page.title, ' - ');

  return (
    <html lang={language}>
      <head>
        <title>{pageTitle}</title>
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
        <link rel="icon" type="image/png" href="/assets/img/favicon.png" />

        {this.props.head ? this.props.head : null}

        {!__DEV__ ? <link rel="stylesheet" href="/assets/main.css" /> : null}
      </head>
      <body>
        <main role="main">
          {this.props.children}
        </main>
        {__DEV__ ? <script src="/main-bundle.js" /> : null}
      </body>
    </html>
  );
};

function defaultGetPageTitle(config, sectionTitle, pageTitle, separator) {
  const title = pageTitle || sectionTitle || '';
  const siteTitle = config.title || '';

  if (title) {
    return siteTitle + separator + title;
  }

  return siteTitle;
}

export default Body;
