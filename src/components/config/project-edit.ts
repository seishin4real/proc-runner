import { bindable, containerless, customElement } from 'aurelia-framework';
import { Project } from 'models';

@customElement('project-edit')
export class ProjectEditComponent {
  @bindable() project: Project;
  isCollapsed = true;

  toggleCollapesed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
