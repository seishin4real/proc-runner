import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, customElement } from 'aurelia-framework';
import { confirm } from 'electron/utils.electron';
import { ProcessService } from 'services/process.service';
import { PROJECT_DELETED, PROJECT_MOVED } from 'shared/events';
import { Project } from 'shared/models';

@customElement('project-edit')
@autoinject()
export class ProjectEditComponent {
  constructor(
    private _procManager: ProcessService,
    private _ea: EventAggregator
  ) { }
  @bindable() project: Project;

  moveUp() { this._ea.publish(PROJECT_MOVED, { project: this.project, step: -1 }); }
  moveDown() { this._ea.publish(PROJECT_MOVED, { project: this.project, step: 1 }); }

  addProcess() { this._procManager.addProcess(this.project); }
  deleteProject() {
    confirm('Confirm delete', `Are you sure you want to delete project "${this.project.title}"?`).then(result => {
      if (result) {
        this._ea.publish(PROJECT_DELETED, this.project);
      }
    });
  }
}
