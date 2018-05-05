import { bindable, customElement } from 'aurelia-framework';

@customElement('toggle-panel')
export class TogllePanelComponent {
  @bindable() icon: string;
  @bindable() title: string;
  @bindable() color: string;
  @bindable() isCollapsed = true;

  toggleCollapesed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
