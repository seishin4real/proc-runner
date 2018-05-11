import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { bindable, customElement } from 'aurelia-framework';
import { confirm } from 'electron/utils.electron';
import { findIndex as _findIndex } from 'lodash';
import { ProcessService } from 'services/process.service';
import { PROC_DELETED, PROC_MOVED, PROJECT_DELETED, PROJECT_MOVED } from 'shared/events';
import { moveInArray } from 'shared/func.move-in-array';
import { Process, Project } from 'shared/models';

@customElement('project-edit')
@autoinject()
export class ProjectEditComponent {
  constructor(
    private _procManager: ProcessService,
    private _ea: EventAggregator
  ) {
    _ea.subscribe(PROC_DELETED, this.deleteProc.bind(this));
    _ea.subscribe(PROC_MOVED, this.moveProc.bind(this));
  }
  @bindable() project: Project;

  moveUp() { this._ea.publish(PROJECT_MOVED, { project: this.project, step: -1 }); }
  moveDown() { this._ea.publish(PROJECT_MOVED, { project: this.project, step: 1 }); }

  addProcess() {
    this.project.meta.isCollapsed = false;
    this.project.procs.push(this._procManager.newProcess());
  }

  deleteProject() {
    confirm('Confirm delete', `Are you sure you want to delete project "${this.project.title}"?`).then(result => {
      if (result) {
        this._ea.publish(PROJECT_DELETED, this.project);
      }
    });
  }

  private deleteProc(proc: Process) {
    const procIdx = _findIndex(this.project.procs, p => p.id === proc.id);
    if (procIdx !== -1) {
      this.project.procs.splice(procIdx, 1);
    }
  }

  private moveProc({ proc, step }) {
    const procIdx = _findIndex(this.project.procs, { id: proc.id });

    if (step === -1 && procIdx === 0) { return; }

    if (step === 1 && procIdx === this.project.procs.length - 1) { return; }

    moveInArray(this.project.procs, procIdx, procIdx + step);
  }
}
