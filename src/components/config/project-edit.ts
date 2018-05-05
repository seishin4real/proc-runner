import { PROJECT_DELETED, PROJECT_MOVED } from '../../events';
import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, customElement } from 'aurelia-framework';
import { Project } from 'models';
import { ProcManager } from 'proc.manager';
import { ElectronDialog } from 'resources';

@customElement('project-edit')
@autoinject()
export class ProjectEditComponent {
  constructor(
    private _procManager: ProcManager,
    private _ea: EventAggregator
  ) { }
  @bindable() project: Project;

  moveUp() { this._ea.publish(PROJECT_MOVED, { project: this.project, step: -1 }); }
  moveDown() { this._ea.publish(PROJECT_MOVED, { project: this.project, step: 1 }); }

  addProcess() { this._procManager.addProcess(this.project); }
  deleteProject() {
    const result = ElectronDialog.confirm('Confirm delete', `Are you sure you want to delete project "${this.project.title}"?`);
    if (result) {
      this._ea.publish(PROJECT_DELETED, this.project);
    }
  }
}
