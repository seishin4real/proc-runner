import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, bindable, customElement, observable } from 'aurelia-framework';
import { confirm, pickDirectory } from 'electron/utils.electron';
import { find as _find } from 'lodash';
import { StoreService } from 'services/store.service';
import { PROC_DELETED, PROC_MOVED } from 'shared/events';
import { Process, Template } from 'shared/models';

@customElement('proc-edit')
@autoinject()
export class ProcEditComponent {
  constructor(
    private _ea: EventAggregator,
    store: StoreService
  ) {
    this.templates = store.getTemplates();
  }

  @bindable() proc: Process;

  @observable() template: string;
  templates: Template[];

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
    pickDirectory('Pick directory', 'Pick working directory for the proces.', this.proc.path).then(dir => {
      this.proc.path = dir;
    }).catch(() => { });
  }

  templateChanged(value: string) {
    if (!value) { return; }

    const t = Object.assign({}, _find(this.templates, { 'title': value }));

    this.proc.command = t.command;
    this.proc.args = t.args;
    this.proc.startMarker = t.startMarker;
    this.proc.progressMarkers = t.progressMarkers || [];
    this.proc.errorMarkers = t.errorMarkers || [];
  }
}
