import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName('./components/toggle-panel'),
    PLATFORM.moduleName('./elements/icon'),
    PLATFORM.moduleName('./elements/proc-icon'),
    PLATFORM.moduleName('./elements/token-input'),
    PLATFORM.moduleName('./value-converters/anchorme'),
    PLATFORM.moduleName('./value-converters/remove-cmd'),
    PLATFORM.moduleName('./value-converters/number'),
  ]);
}
