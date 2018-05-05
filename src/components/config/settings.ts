import { bindable, customElement } from 'aurelia-framework';

@customElement('settings')
export class SettingsComponent {
  @bindable() model: {
    notifications: {
      position: string;
      timeout: number;
    }
  };
}
