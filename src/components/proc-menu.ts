import * as events from '../events';
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
    this._ea.publish(events.PROJECTS_MODIFIED);
  }
  start() { this.emitEvent('START'); }
  restart() { this.emitEvent('RESET'); }
  stop() { this.emitEvent('STOP'); }

  // this.state = 'starting'; setTimeout(() => this.state = 'running', 2000);
  // this.state = 'stopping'; setTimeout(() => this.state = 'starting', 2000); setTimeout(() => this.state = 'running', 4000);
  // this.state = 'stopping'; setTimeout(() => this.state = 'idle', 2000);

  private emitEvent(name: string) {
    this._ea.publish((this.project ? 'PROJECT' : 'PROC') + '_' + name, this.project || this.proc);
  }
} 