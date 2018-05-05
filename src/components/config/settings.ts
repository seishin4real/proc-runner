import { bindable, customElement } from 'aurelia-framework';
import { Settings } from 'models';

@customElement('settings')
export class SettingsComponent {
  @bindable() model: Settings;
}
