# web-ext-types

[![Build Status][build-badge]][build-url]

TypeScript type definitions for WebExtensions

:warning: This is in a WIP state. :warning:

What is implemented:
- `alarms`
- `browserAction`
- `commands`
- `events`
- `extensionTypes`
- `omnibox`
- `runtime`

## Requirements

As this library is using the `object` type, `typescript` should at least be on
version `2.2` to get the definitions to work.

## Install it

There is no npm package for now, which means you can only grab it from the
repository:

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
