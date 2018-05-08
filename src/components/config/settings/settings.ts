import { bindable, customElement } from 'aurelia-framework';
import { Settings } from 'shared/models';

@customElement('settings')
export class SettingsComponent {
  @bindable() model: Settings;
}
