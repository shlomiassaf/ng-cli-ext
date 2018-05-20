#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Path, getSystemPath, normalize, resolve, virtualFs } from '@angular-devkit/core';
import { NormalizedBrowserBuilderSchema } from '@angular-devkit/build-angular';

export function patchWith<T = any>(handler: (cfg: T) => T) {
  console.log('PATCHING @angular/cli with custom webpack config handler.\n');

  const projectLocalCli = require.resolve('@angular/cli', { paths: [ process.cwd() ]});
  require(path.join(path.dirname(projectLocalCli), '../init'));

  setTimeout(() => {
    const BrowserBuilder = require('@angular-devkit/build-angular').BrowserBuilder;
    const orgBuildWebpackConfig = BrowserBuilder.prototype.buildWebpackConfig;
    BrowserBuilder.prototype.buildWebpackConfig = function buildWebpackConfig(
      root: Path,
      projectRoot: Path,
      host: virtualFs.Host<fs.Stats>,
      options: NormalizedBrowserBuilderSchema,
    ) {
      return handler(orgBuildWebpackConfig.call(this, root, projectRoot, host, options));
    }
  }, 0);
}

if (require.main === module) {
  const idx = process.argv.findIndex( a => a === '--webpack');

  if (idx === -1 || !process.argv[idx+1]) {
    throw new Error('ngext require a valid webpack configuration handler (--webpack)');
  }

  const cfgRelativePath = process.argv[idx + 1];
  const cfgFullPath = path.isAbsolute(cfgRelativePath)
    ? cfgRelativePath
    : path.join(process.cwd(), cfgRelativePath)
  ;

  if (!fs.existsSync(cfgFullPath)) {
    console.log(`Could not find webpack configuration handler file at ${cfgFullPath}`);
  }

  process.argv.splice(idx, 2);
  const cfgHandler = require(cfgFullPath);
  patchWith(cfgHandler);
}
