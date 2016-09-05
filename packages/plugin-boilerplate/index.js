'use strict';


module.exports = function() {
  return {
    bodyContent: function(o) {
      // this should return a React element
    },
    headContent: function(o) {
      // this should return a React element
    },
    extra: function(o) {
      // this should return an object in format
      // {<filename>: <content>}
    },
    preProcessItems: function(items) {
      // you can manipulate items and their metadata here
      // before they are processed
      return items;
    },
    postProcessItems: function(items) {
      // you can manipulate items and their metadata here
      // after they have been processed
      return items;
    },
  };
};
