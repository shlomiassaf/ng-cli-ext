#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Path, getSystemPath, normalize, resolve, virtualFs } from '@angular-devkit/core';
import { NormalizedBrowserBuilderSchema } from '@angular-devkit/build-angular';
import { createECDH } from 'crypto';

function exitWithError(error: string | Error) {
  console.error(error);
  process.exit(1);
}

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
  const tsReg = process.argv.findIndex( a => a === '--tsnode');

  if (tsReg > -1) {
    process.argv.splice(tsReg, 1);  
    require('ts-node/register');
  }

  const idx = process.argv.findIndex( a => a === '--webpack');

  if (idx === -1 || !process.argv[idx+1]) {
    exitWithError('ng-ext-cli require a valid webpack configuration handler (--webpack)');    
  } else {
    const cfgRelativePath = process.argv[idx + 1];
    const cfgFullPath = path.isAbsolute(cfgRelativePath)
      ? cfgRelativePath
      : path.join(process.cwd(), cfgRelativePath)
    ;
  
    if (!fs.existsSync(cfgFullPath)) {
      exitWithError(`Could not find webpack configuration handler file at ${cfgFullPath}`);
    }
  
    process.argv.splice(idx, 2);
  
    let cfgHandler: (cfg: any) => any;
    try {
      cfgHandler = require(cfgFullPath);
      if (typeof cfgHandler !== 'function') {
        exitWithError(`Webpack configuration module does not export a function`);
      }
    } catch(error) {
      exitWithError(error);
    }
    cfgHandler && patchWith(cfgHandler);
  }
}
