module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "jasmine": true,
    "node": true,
    "mocha": true
  },
  "plugins": [
    "react"
  ],
  "globals": {
    "__DEV__": true,
    "__ENV__": true
  },
  "rules": {
    "comma-dangle": ["error", "never"],
    "prefer-arrow-callback": 0,
    "func-names": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": [1, { ignore: ['^reactabular'] }],
    "no-console": 0,
    "no-shadow": 0,
    "no-underscore-dangle": 0,
    "no-unused-expressions": 0,
    "no-use-before-define": 0,
    "react/jsx-filename-extension": 0,
    "react/sort-comp": 0,
    "react/no-multi-comp": 0,
    "react/prop-types": 0,
    "react/require-default-props": 0,
    "react/forbid-prop-types": 0,
    "react/no-danger": 0,
    "react/no-array-index-key": 0,
    "global-require": 0,
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "import/no-dynamic-require": 0,
    "prefer-template": 0,
    "jsx-a11y/no-static-element-interactions": 0
  }
};
