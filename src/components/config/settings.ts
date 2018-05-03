import { bindable, customElement } from 'aurelia-framework';
import { Store } from 'store';

@customElement('settings')
export class SettingsComponent {
  @bindable() model: {
    notifications: {
      position: string;
      timeout: number;
    }
  }
}
