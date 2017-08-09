const _ = require("lodash");

function generateAdjacent(pages) {
  return pages.map((page, i) => {
    const ret = _.cloneDeep(page); // Avoid mutation

    ret.previous = i > 0 && pages[i - 1];
    ret.next = i < pages.length - 1 && pages[i + 1];

    return ret;
  });
}

module.exports = generateAdjacent;
