import { Path, getSystemPath } from '@angular-devkit/core';
import * as path from 'path';
const webpackMerge = require('webpack-merge');

export function updateConfig(projectRoot: Path, extraWebpackConfig: string, config: any): any {
  const filePath = path.resolve(getSystemPath(projectRoot), extraWebpackConfig);

  if (path.extname(filePath) === '.ts') {
    try {
      require('ts-node/register');
    } catch (ex) { }
  }

  const additionalConfig = require(filePath);
  if (typeof additionalConfig === 'function') {
    return additionalConfig(config) || config;
  } else {
    return webpackMerge([config, additionalConfig]);
  }
}
