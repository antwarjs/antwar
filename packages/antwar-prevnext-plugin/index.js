const _ = require('lodash');

module.exports = function () {
  return {
    // Since urls can get modified by other hooks, we need to
    // process after that.
    processPages: function generatePrevNext(items) {
      const len = items.length;

      return items.map(function (item, i) {
        const previousItem = i > 0 ? items[i - 1] : {};
        const nextItem = i < len - 1 ? items[i + 1] : {};
        const ret = _.cloneDeep(item);

        ret.previous = previousItem.section === item.section && previousItem;
        ret.next = nextItem.section === item.section && nextItem;

        return ret;
      });
    }
  };
};
