import { bindable, customElement } from 'aurelia-framework';
import { Process } from 'models';

@customElement('proc-edit')
export class ProcEditComponent {
  @bindable() proc: Process;
  isCollapsed = true;

  toggleCollapesed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
