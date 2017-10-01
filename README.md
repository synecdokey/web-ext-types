# web-ext-types

[![Build Status][build-badge]][build-url]
[![Npm Version][npm-badge]][npm-url]

TypeScript type definitions for WebExtensions, based on MDN's documentation.

## Requirements

As this library is using the `object` type, `typescript` should at least be on
version `2.2` to get the definitions to work.

## Install it

There is an npm package available, which means you can grab it from there:

```sh
# yarn version
yarn add web-ext-types --dev

# npm version
npm install --save-dev web-ext-types
```

Though if you want to use the git version, simply do:

```sh
# yarn version
yarn add michael-zapata/web-ext-types --dev

# npm version
npm install --save-dev michael-zapata/web-ext-types
```

As this is not a [`DefinitelyTyped`][definitely-typed] package, you will have to
include the type definition in your `tsconfig.json` by hand, via a `typeRoots`
option.

```js
{
  "compilerOptions": {
    // You have to explicitly set @types to get DefinitelyTyped type definitions
    "typeRoots": ["@types", "node_modules/web-ext-types"],
  }
}
```

[build-badge]: https://travis-ci.org/michael-zapata/web-ext-types.svg?branch=master
[build-url]: https://travis-ci.org/michael-zapata/web-ext-types
[definitely-typed]: https://github.com/DefinitelyTyped/DefinitelyTyped/
[npm-badge]: https://img.shields.io/npm/v/web-ext-types.svg
[npm-url]: https://www.npmjs.com/package/web-ext-types
