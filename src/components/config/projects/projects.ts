import { Project } from 'aurelia-cli';
import { bindable, customElement } from 'aurelia-framework';

@customElement('projects')
export class ProjectsComponent {
  @bindable() model: Project[];
}
