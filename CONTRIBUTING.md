0. [Open an issue](https://github.com/antwarjs/antwar/issues) to discuss the feature you want to implement or need. This will help us to figure out how to fit it in and will avoid unnecessary work on your part.
1. Implement whatever you want and write tests
2. Make sure `npm test` passes. This will run your tests and lint the code.
3. Once you are happy with the code, add yourself to the project contributors (`./CONTRIBUTORS.md`).
4. Create a PR against the `master` branch

## Development

```code
lang: bash
---
npm run init
npm start
open http://localhost:3000
```

This process will run `smoketest`. You can also do `npm run site`.

There's also a TDD mode for testing and building the project while developing. Run it through `npm run watch`.
