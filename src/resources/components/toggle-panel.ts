import { bindable, customElement } from 'aurelia-framework';
import { unwrap } from 'resources';

@customElement('toggle-panel')
export class TogllePanelComponent {
  @bindable() icon: string;
  @bindable() title: string;
  @bindable() color: string;

  isCollapsed = true;
  footer: Element;

  attached() {
    unwrap(this.footer.querySelector('[slot=footer]'));
  }

  toggleCollapesed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
