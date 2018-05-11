import { bindable, customElement } from 'aurelia-framework';
import { merge as _merge } from 'lodash';
import { Settings } from 'shared/models';

@customElement('settings')
export class SettingsComponent {
  @bindable() model: Settings;

  merge(sSettings: Settings) {
    sSettings.notifications = _merge(sSettings.notifications, this.model.notifications);
  }
}
