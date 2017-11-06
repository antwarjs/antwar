var marked = require("marked"); // eslint-disable-line no-var

function parseQuotes(data) {
  const tokens = marked.lexer(data).map(function(t) {
    if (t.type === "paragraph") {
      return (
        parseCustomQuote(t, "T>", "tip") ||
        parseCustomQuote(t, "W>", "warning") ||
        parseCustomQuote(t, "?>", "todo") ||
        t
      );
    }

    return t;
  });

  tokens.links = [];

  return tokens;
}
exports.quotes = parseQuotes;

function parseCustomQuote(token, match, className) {
  if (token.type === "paragraph") {
    const text = token.text;
    let icon;

    if (text.indexOf(match) === 0) {
      switch (className) {
        case "tip":
          icon = "icon-info";
          break;
        case "warning":
          icon = "icon-warning";
          break;
        default:
          icon = "icon-chevron-right";
          break;
      }

      return {
        type: "html",
        text:
          `<blockquote class="${className}">` +
          `<div class="tip-title"><i class="tip-icon ${icon}"></i>${className}</div>` +
          text.slice(2).trim() +
          "</blockquote>",
      };
    }
  }

  return token;
}
exports.customQuote = parseCustomQuote;
