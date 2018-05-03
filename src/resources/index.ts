import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName('./elements/icon'),
    PLATFORM.moduleName('./elements/proc-icon'),
    PLATFORM.moduleName('./value-converters/remove-cmd'),
  ]);
}

export * from './utils';
