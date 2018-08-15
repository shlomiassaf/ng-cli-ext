import * as fs from 'fs';
import { Path, virtualFs } from '@angular-devkit/core';

import { DevServerBuilder as DevServerBuilderBase, BrowserBuilderSchema as BrowserBuilderSchemaBase   } from '@angular-devkit/build-angular';
import { updateConfig } from '../utils';

export interface BrowserBuilderSchema extends BrowserBuilderSchemaBase {
  extraWebpackConfig: string;
  singleBundle: boolean;
}

export class DevServerBuilder extends DevServerBuilderBase {

  buildWebpackConfig(root: Path, projectRoot: Path, host: virtualFs.Host<fs.Stats>, browserOptions: BrowserBuilderSchema): any {
    
    let config = super.buildWebpackConfig(root, projectRoot, host, browserOptions);
    return browserOptions.extraWebpackConfig
      ? updateConfig(projectRoot, browserOptions.extraWebpackConfig, config)
      : config
    ;
  }
}

export default DevServerBuilder;