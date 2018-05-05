import { APP_OPEN_CONFIG, PROJECTS_MODIFIED } from '../events';
import { Process, Project } from '../models';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, bindable, containerless, customElement } from 'aurelia-framework';

@containerless()
@customElement('proc-menu')
@autoinject()
export class ProcMenuComponent {
  constructor(private _ea: EventAggregator) { }

  @bindable() project: Project;
  @bindable() proc: Process;

  toggleIsBatch() {
    this.proc.isBatch = !this.proc.isBatch;
    this._ea.publish(PROJECTS_MODIFIED);
  }
  start() { this.emitEvent('START'); }
  restart() { this.emitEvent('RESET'); }
  stop() { this.emitEvent('STOP'); }

  config() {
    this._ea.publish(APP_OPEN_CONFIG, this.proc);
  }

  private emitEvent(name: string) {
    this._ea.publish((this.project ? 'PROJECT' : 'PROC') + '_' + name, this.project || this.proc);
  }
}
