module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "plugins": [
    "react"
  ],
  "globals": {
    "__DEV__": true
  },
  "rules": {
    "comma-dangle": ["error", "never"],
    "prefer-arrow-callback": 0,
    "func-names": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": [1, { ignore: ['^reactabular'] }],
    "no-console": 0,
    "no-underscore-dangle": 0,
    "no-unused-expressions": 0,
    "no-use-before-define": 0,
    "react/sort-comp": 0,
    "react/no-multi-comp": 0,
    "react/prop-types": 0,
    "global-require": 0,
    "import/no-unresolved": 0,
    "prefer-template": 0
  }
};
