import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, bindable, customElement } from 'aurelia-framework';
import { confirm, pickDirectory } from 'electron/utils.electron';
import { PROC_DELETED, PROC_MOVED } from 'shared/events';
import { Process } from 'shared/models';

@customElement('proc-edit')
@autoinject()
export class ProcEditComponent {
  constructor(private _ea: EventAggregator) { }

  @bindable() proc: Process;

  moveUp() { this._ea.publish(PROC_MOVED, { proc: this.proc, step: -1 }); }
  moveDown() { this._ea.publish(PROC_MOVED, { proc: this.proc, step: 1 }); }

  deleteProcess() {
    confirm('Confirm delete', `Are you sure you want to delete process "${this.proc.title}"?`).then(result => {
      if (result) {
        this._ea.publish(PROC_DELETED, this.proc);
      }
    });
  }

  pickDir() {
    pickDirectory('asdasd', 'asdasdasd', this.proc.path).then(dir => {
      this.proc.path = dir;
    }).catch(() => { });
  }
}
