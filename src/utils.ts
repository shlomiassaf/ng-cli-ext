import { Path, getSystemPath } from '@angular-devkit/core';
import * as path from 'path';
const webpackMerge = require('webpack-merge');

export function updateConfig(projectRoot: Path, extraWebpackConfig: string, config: any, tsConfigPath?: string): any {
  const filePath = path.resolve(getSystemPath(projectRoot), extraWebpackConfig);

  if (path.extname(filePath) === '.ts') {
    try {
      require('tsconfig-paths/register');
    } catch (ex) { }
    try {
      const tsNode = require('ts-node');
      if (tsConfigPath) {
        tsNode.register({
          project: path.resolve(getSystemPath(projectRoot), tsConfigPath),
        });
      } else {
        tsNode.register();
      }    
    } catch (ex) { }
  }

  const additionalConfig = require(filePath);
  if (typeof additionalConfig === 'function') {
    return additionalConfig(config) || config;
  } else {
    return webpackMerge([config, additionalConfig]);
  }
}
