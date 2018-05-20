Edit / Replace webpack config using angular cli.

### Install

```bash
npm install ng-cli-ext --save-dev
```

```bash
yarn ng-cli-ext -D
```

### Usage

```bash
./node_modules/.bin/ng-cli-ext --webpack webpack.config.js # NG COMMAND...
```

**For TypeScript configuration files:***

```bash
./node_modules/.bin/ng-cli-ext --tsnode --webpack webpack.config.ts # NG COMMAND...
```

### Configuration file format

The configuration file is a JS module that export's a function that accepts the webpack configuration object from the cli
and returns the modified webpack configuration that is sent to webpack.

> You can modify the same object or return a new object, either way an object must be returned.

```js
module.exports = function(webpackConfig) {
    // modify webpackConfig
    return webpackConfig;
}
```

See https://github.com/survivejs/webpack-merge for ideas.

### Examples

`ng serve` ->

```bash
./node_modules/.bin/ng-cli-ext --tsnode --webpack webpack.config.ts serve
```

`ng build --prod` ->

```bash
./node_modules/.bin/ng-cli-ext --webpack webpack.config.js build --prod
```
