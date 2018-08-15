import * as fs from 'fs';
import { BrowserBuilder } from '@angular-devkit/build-angular';
import { Path, virtualFs } from '@angular-devkit/core';
import { updateConfig } from '../utils';

import { PlusBuilderSchema } from './schema';

export class PlusBuilder extends BrowserBuilder  {

  buildWebpackConfig(
    root: Path,
    projectRoot: Path,
    host: virtualFs.Host<fs.Stats>,
    options: PlusBuilderSchema,
  ) {

    let config = super.buildWebpackConfig(root, projectRoot, host, options);

    if (options.singleBundle) {
      delete config.entry.polyfills;
      delete config.entry.styles;
      delete config.optimization;
    }
    
    return options.extraWebpackConfig
      ? updateConfig(projectRoot, options.extraWebpackConfig, config)
      : config
    ;
  }
}

export default PlusBuilder;