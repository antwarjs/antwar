module.exports = function () {
  return {
    bodyContent() {
      // this should return a React element
    },
    headContent() {
      // this should return a React element
    },
    extra() {
      // this should return an object in format
      // {<filename>: <content>}
    },
    preProcessItems(items) {
      // you can manipulate items and their metadata here
      // before they are processed
      return items;
    },
    postProcessItems(items) {
      // you can manipulate items and their metadata here
      // after they have been processed
      return items;
    }
  };
};
